from fastapi import APIRouter
from services.detection import detection_service
import random

router = APIRouter()

@router.get("/")
async def get_live_stream():
    # Generate random packets with real predictions
    protocols = ["tcp", "udp", "icmp"]
    services = ["http", "dns", "https", "ftp"]
    
    packets = []
    for i in range(20):
        proto = random.choice(protocols)
        sbytes = random.randint(64, 1500)
        dbytes = random.randint(64, 1500)
        
        features = {
            'is_sm_ips_ports': 0,
            'sbytes': sbytes,
            'dbytes': dbytes,
            'rate': random.uniform(1, 100),
            'dur': random.uniform(0, 1),
            'sload': 0, 'dload': 0, 'sinpkt': 0, 'dinpkt': 0,
            'sjit': 0, 'djit': 0, 'tcprtt': 0, 'synack': 0, 'ackdat': 0,
            'bytes_ratio': sbytes / (dbytes + 1),
            'packets_ratio': 1.0, 'load_ratio': 1.0,
            'jitter_product': 0, 'dangerous_proto': 0
        }
        
        result = detection_service.predict(features)
        
        packets.append({
            "id": f"pkt_{i}",
            "time": f"2024-04-01T14:{random.randint(0,59):02d}:{random.randint(0,59):02d}Z",
            "src_ip": f"192.168.1.{random.randint(1,254)}",
            "dst_ip": f"10.0.0.{random.randint(1,254)}",
            "port": random.randint(1024, 65535),
            "protocol": proto,
            "service": random.choice(services),
            "src_bytes": sbytes,
            "dst_bytes": dbytes,
            "duration": round(random.uniform(0, 5), 3),
            "latency": round(random.uniform(0, 100), 2),
            "status": result["prediction"].lower(),
            "confidence": result["confidence"]
        })
    
    return packets