from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_model_metrics():
    return {
        "precision": 0.903,
        "recall": 0.929,
        "f1_score": 0.916,
        "auc": 0.956,
        "confusion_matrix": [[32500, 4500], [3229, 42103]],
        "detection_by_type": [
            {"type": "Generic", "rate": 99.6},
            {"type": "Backdoor", "rate": 99.3},
            {"type": "Reconnaissance", "rate": 98.3},
            {"type": "DoS", "rate": 96.1},
            {"type": "Exploits", "rate": 95.6},
            {"type": "Analysis", "rate": 93.5},
            {"type": "Worms", "rate": 93.2},
            {"type": "Shellcode", "rate": 79.6},
            {"type": "Fuzzers", "rate": 61.8}
        ],
        "roc_curve": [
            {"fpr": 0.0, "tpr": 0.0},
            {"fpr": 0.1, "tpr": 0.85},
            {"fpr": 0.2, "tpr": 0.92},
            {"fpr": 0.3, "tpr": 0.96},
            {"fpr": 0.4, "tpr": 0.98},
            {"fpr": 0.5, "tpr": 0.99},
            {"fpr": 1.0, "tpr": 1.0}
        ],
        "operational": {
            "detection_latency_ms": 45,
            "false_positive_ceiling": 0.12,
            "service_availability": 99.98
        }
    }