from datetime import datetime

from pydantic import BaseModel, ConfigDict


class MetricResponse(BaseModel):
    id: int
    device_id: int
    signal_strength: float
    latency: float
    packet_loss: float
    traffic_load: float
    uptime: float
    temperature: float
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class LiveMetricPayload(BaseModel):
    device_id: int
    device_name: str
    status: str
    signal_strength: float
    latency: float
    packet_loss: float
    traffic_load: float
    uptime: float
    temperature: float
    ai_state: str
    timestamp: str
