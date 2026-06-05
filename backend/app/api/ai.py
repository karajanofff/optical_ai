from fastapi import APIRouter, Depends

from app.api.deps import current_user
from app.schemas.ai import PredictionRequest, PredictionResponse
from app.services.ai_service import ai_service

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/predict", response_model=PredictionResponse)
def predict(payload: PredictionRequest, user=Depends(current_user)):
    return ai_service.predict(
        [
            payload.signal_strength,
            payload.latency,
            payload.packet_loss,
            payload.traffic_load,
            payload.uptime,
            payload.temperature,
        ]
    )
