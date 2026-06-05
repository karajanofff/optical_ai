from pydantic import BaseModel


class ReportSummaryResponse(BaseModel):
    total_devices: int
    online_devices: int
    offline_devices: int
    warning_devices: int
    anomaly_count: int
    average_signal: float
    average_latency: float
    average_packet_loss: float
    health_score: float
    alerts_today: int
    alerts_this_week: int
