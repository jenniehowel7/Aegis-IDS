from fastapi import APIRouter
import random

router = APIRouter()

@router.get("/")
async def get_dashboard():
    # Remove: user=Depends(get_current_user)
    return {
        "stats": {
            "total_packets": random.randint(20000, 30000),
            "threats_detected": random.randint(400, 600),
            "uptime": 99.98,
            "throughput": round(random.uniform(100, 150), 1),
            "open_incidents": random.randint(8, 15)
        },
        "traffic_trends": [
            {"time": "00:00", "normal": random.randint(200, 400), "attack": random.randint(10, 30)},
            {"time": "04:00", "normal": random.randint(200, 400), "attack": random.randint(10, 30)},
            {"time": "08:00", "normal": random.randint(400, 600), "attack": random.randint(30, 60)},
            {"time": "12:00", "normal": random.randint(400, 600), "attack": random.randint(40, 70)},
            {"time": "16:00", "normal": random.randint(400, 600), "attack": random.randint(30, 60)},
            {"time": "20:00", "normal": random.randint(300, 500), "attack": random.randint(20, 40)}
        ],
        "attack_categories": [
            {"category": "Generic", "count": random.randint(150, 200)},
            {"category": "Exploits", "count": random.randint(100, 150)},
            {"category": "DoS", "count": random.randint(80, 120)},
            {"category": "Reconnaissance", "count": random.randint(50, 80)},
            {"category": "Fuzzers", "count": random.randint(30, 50)}
        ],
        "protocol_distribution": [
            {"protocol": "TCP", "count": random.randint(12000, 18000)},
            {"protocol": "UDP", "count": random.randint(6000, 10000)},
            {"protocol": "ICMP", "count": random.randint(3000, 5000)}
        ],
        "service_distribution": [
            {"service": "http", "count": random.randint(6000, 10000)},
            {"service": "dns", "count": random.randint(4000, 7000)},
            {"service": "https", "count": random.randint(3000, 6000)},
            {"service": "smtp", "count": random.randint(1500, 3000)},
            {"service": "ftp", "count": random.randint(800, 1500)}
        ],
        "recent_alerts": [
            {
                "id": "1",
                "time": "2024-04-01T14:23:00Z",
                "src_ip": f"192.168.1.{random.randint(1,254)}",
                "dst_ip": f"10.0.0.{random.randint(1,254)}",
                "protocol": "tcp",
                "service": "http",
                "status": "attack",
                "severity": "high",
                "confidence": round(random.uniform(0.85, 0.99), 4)
            },
            {
                "id": "2",
                "time": "2024-04-01T14:22:15Z",
                "src_ip": f"192.168.1.{random.randint(1,254)}",
                "dst_ip": f"10.0.0.{random.randint(1,254)}",
                "protocol": "tcp",
                "service": "ftp",
                "status": "attack",
                "severity": "medium",
                "confidence": round(random.uniform(0.80, 0.95), 4)
            }
        ]
    }