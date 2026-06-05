from pydantic import BaseModel


class PredictionRequest(BaseModel):
    signal_strength: float
    latency: float
    packet_loss: float
    traffic_load: float
    uptime: float
    temperature: float


class PredictionResponse(BaseModel):
    prediction: str
    confidence: float
