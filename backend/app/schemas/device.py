from pydantic import BaseModel, ConfigDict


class DeviceBase(BaseModel):
    name: str
    device_type: str
    location: str
    ip_address: str
    status: str
    signal_strength: float
    latency: float
    packet_loss: float
    traffic_load: float
    uptime: int
    temperature: float


class DeviceCreate(DeviceBase):
    pass


class DeviceUpdate(DeviceBase):
    pass


class DeviceResponse(DeviceBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
