# services/detection.py
import pandas as pd
import joblib
import os
import numpy as np

class DetectionService:
    def __init__(self):
        # Fix: Use correct filename
        model_path = os.path.join(os.path.dirname(__file__), "..", "models", "xgboost_mixed.pkl")
        
        if not os.path.exists(model_path):
            print(f"⚠️ Model not found at {model_path}")
            self.model = None
            self.features = []
        else:
            self.model = joblib.load(model_path)
            self.features = self.model.get_booster().feature_names
            print(f"✅ Model loaded with {len(self.features)} features")

    def predict(self, features_dict):
        """Predict single connection"""
        if self.model is None:
            return {
                "prediction": "ERROR",
                "confidence": 0.0,
                "attack_probability": 0.0,
                "error": "Model not loaded"
            }
        
        df = pd.DataFrame([features_dict])[self.features]
        prob = self.model.predict_proba(df)[0][1]
        
        # Convert numpy types to Python native types
        return {
            "prediction": "ATTACK" if prob >= 0.80 else "NORMAL",
            "confidence": float(prob),
            "attack_probability": float(prob)
        }

detection_service = DetectionService()