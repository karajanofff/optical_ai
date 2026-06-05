from datetime import datetime

from pydantic import BaseModel, ConfigDict


class AlertResponse(BaseModel):
    id: int
    device_id: int
    title: str
    message: str
    severity: str
    is_read: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AlertUpdate(BaseModel):
    is_read: bool
