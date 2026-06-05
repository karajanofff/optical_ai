from pydantic import BaseModel, ConfigDict


class OpticalLineBase(BaseModel):
    name: str
    source_device_id: int
    target_device_id: int
    fiber_type: str
    length_km: float
    attenuation_db: float
    signal_loss_db: float
    utilization_percent: float
    status: str
    last_update_time: str


class OpticalLineCreate(OpticalLineBase):
    pass


class OpticalLineUpdate(OpticalLineBase):
    pass


class OpticalLineResponse(OpticalLineBase):
    id: int
    source_device_name: str
    target_device_name: str

    model_config = ConfigDict(from_attributes=True)
