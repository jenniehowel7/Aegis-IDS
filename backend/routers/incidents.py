from fastapi import APIRouter, Depends, HTTPException
from utils.auth import get_current_user

router = APIRouter()

incidents = [
    {
        "id": "1",
        "title": "Suspicious HTTP POST flood",
        "severity": "high",
        "status": "investigating",
        "timestamp": "2024-04-01T14:23:00Z",
        "src_ip": "192.168.1.105",
        "dst_ip": "10.0.0.45",
        "attack_type": "Generic",
        "confidence": 0.94,
        "rationale": "High POST rate exceeding normal thresholds",
        "playbook": "1. Block source IP\n2. Analyze patterns"
    }
]

@router.get("/")
async def list_incidents(user=Depends(get_current_user)):
    return incidents

@router.get("/{incident_id}")
async def get_incident(incident_id: str, user=Depends(get_current_user)):
    for inc in incidents:
        if inc["id"] == incident_id:
            return inc
    raise HTTPException(404, "Incident not found")