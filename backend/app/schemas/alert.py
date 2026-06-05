from datetime import datetime

from pydantic import BaseModel, ConfigDict


class AlertResponse(BaseModel):
    id: int
    device_id: int
    device_name: str
    title: str
    message: str
    severity: str
    is_read: bool
    created_at: datetime
    recommendations: list[str]

    model_config = ConfigDict(from_attributes=True)


class AlertUpdate(BaseModel):
    is_read: bool
