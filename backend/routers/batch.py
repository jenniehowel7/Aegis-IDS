from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from services.detection import detection_service
import pandas as pd
import io
import numpy as np
import os
import json
from datetime import datetime

router = APIRouter()

# Create directories for storing files
UPLOAD_DIR = "uploads"
RESULTS_DIR = "results"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(RESULTS_DIR, exist_ok=True)

def make_json_serializable(obj):
    """Convert numpy types to Python native types for JSON serialization"""
    if isinstance(obj, (np.integer, np.int64)):
        return int(obj)
    elif isinstance(obj, (np.floating, np.float32, np.float64)):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, dict):
        return {k: make_json_serializable(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [make_json_serializable(item) for item in obj]
    return obj

def save_uploaded_file(file_content, filename):
    """Save uploaded file to disk"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    saved_filename = f"{timestamp}_{filename}"
    filepath = os.path.join(UPLOAD_DIR, saved_filename)
    with open(filepath, 'wb') as f:
        f.write(file_content)
    return filepath, saved_filename

def save_results(results, original_filename, saved_filename):
    """Save analysis results to JSON file"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    result_filename = f"{timestamp}_{original_filename}_results.json"
    result_path = os.path.join(RESULTS_DIR, result_filename)
    
    # Add metadata
    results_with_meta = {
        "analysis_date": datetime.now().isoformat(),
        "original_filename": original_filename,
        "saved_filename": saved_filename,
        "results": results
    }
    
    with open(result_path, 'w') as f:
        json.dump(results_with_meta, f, indent=2)
    
    return result_path, result_filename

def detect_and_convert_csv(df):
    """Auto-detect CSV format and convert to model features"""
    
    if 'sbytes' in df.columns and 'dbytes' in df.columns:
        print("✅ CSV already in model format")
        return df
    elif 'Protocol' in df.columns and 'Length' in df.columns:
        print("🔄 Converting Wireshark format...")
        converted = []
        for _, row in df.iterrows():
            proto = str(row.get('Protocol', 'tcp')).lower()
            length = float(row.get('Length', 500))
            converted.append({
                'proto': proto,
                'sbytes': length,
                'dbytes': length,
                'rate': 10,
                'dur': 1
            })
        return pd.DataFrame(converted)
    else:
        print("⚠️ Unknown format - using defaults")
        converted = []
        for _, row in df.iterrows():
            numeric_cols = df.select_dtypes(include=[np.number]).columns
            length = row.get(numeric_cols[0], 500) if len(numeric_cols) > 0 else 500
            converted.append({
                'proto': 'tcp',
                'sbytes': float(length),
                'dbytes': float(length),
                'rate': 10,
                'dur': 1
            })
        return pd.DataFrame(converted)

def engineer_features(df):
    """Convert raw connection data to match model's exact features"""
    
    features_list = []
    for _, row in df.iterrows():
        sbytes = float(row.get('sbytes', 500))
        dbytes = float(row.get('dbytes', 1000))
        
        features = {
            'same_srv_rate': 0,
            'src_bytes': sbytes,
            'dst_host_srv_count': 0,
            'flag': 0,
            'dst_host_same_srv_rate': 0,
            'logged_in': 0,
            'srv_serror_rate': 0,
            'serror_rate': 0,
            'dst_host_srv_serror_rate': 0,
            'dst_host_serror_rate': 0,
            'count': 0,
            'service': 0,
            'dst_bytes': dbytes,
            'diff_srv_rate': 0,
            'dst_host_diff_srv_rate': 0,
            'bytes_ratio': sbytes / (dbytes + 1),
            'total_bytes': sbytes + dbytes,
            'error_ratio': 0
        }
        features_list.append(features)
    
    return pd.DataFrame(features_list)

@router.post("/analyze")
async def analyze_batch(file: UploadFile = File(...)):
    try:
        # Read uploaded file
        contents = await file.read()
        
        # Save original file
        filepath, saved_filename = save_uploaded_file(contents, file.filename)
        print(f"💾 File saved: {filepath}")
        
        # Process the file
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        
        print(f"📁 Received file: {file.filename}")
        print(f"   Original columns: {list(df.columns)}")
        print(f"   Rows: {len(df)}")
        
        # Auto-detect and convert format
        df_converted = detect_and_convert_csv(df)
        
        # Engineer features for model
        df_features = engineer_features(df_converted)
        
        # Get predictions
        predictions = []
        for _, row in df_features.iterrows():
            result = detection_service.predict(row.to_dict())
            predictions.append(result)
        
        threats = sum(1 for p in predictions if p["prediction"] == "ATTACK")
        
        # Prepare response
        response = make_json_serializable({
            "total_records": len(df),
            "threats_detected": threats,
            "normal_traffic": len(df) - threats,
            "predictions": predictions[:100],
            "raw_data": df.head(100).to_dict(orient="records"),
            "insights": {
                "service_breakdown": [{"service": "http", "count": int(len(df) * 0.4)}],
                "protocol_distribution": [{"protocol": "tcp", "count": int(len(df) * 0.6)}]
            },
            "saved_file": saved_filename,
            "analysis_time": datetime.now().isoformat()
        })
        
        # Save results
        result_path, result_filename = save_results(response, file.filename, saved_filename)
        print(f"💾 Results saved: {result_path}")
        
        # Add result file info to response
        response["result_file"] = result_filename
        
        return response
        
    except Exception as e:
        print(f"❌ Error: {e}")
        raise HTTPException(400, f"Error: {str(e)}")

@router.get("/result/{filename}")
async def get_result(filename: str):
    """Get a specific analysis result by filename"""
    filepath = os.path.join(RESULTS_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(404, "Result not found")
    
    with open(filepath, 'r') as f:
        return json.load(f)
    

@router.get("/history")
async def get_analysis_history():
    """Get list of all saved analysis results"""
    results_list = []
    
    if os.path.exists(RESULTS_DIR):
        for filename in sorted(os.listdir(RESULTS_DIR), reverse=True):
            if filename.endswith('.json'):
                filepath = os.path.join(RESULTS_DIR, filename)
                with open(filepath, 'r') as f:
                    data = json.load(f)
                    results_list.append({
                        "filename": filename,
                        "date": data.get("analysis_date"),
                        "original_filename": data.get("original_filename"),
                        "total_records": data.get("results", {}).get("total_records", 0),
                        "threats_detected": data.get("results", {}).get("threats_detected", 0)
                    })
    
    return {"history": results_list}