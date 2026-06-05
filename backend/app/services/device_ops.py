from datetime import datetime

from sqlalchemy.orm import Session

from app.models.alert import Alert
from app.models.device import Device

HEALTHY_METRICS = {
    "status": "online",
    "signal_strength": -17.5,
    "latency": 2.2,
    "packet_loss": 0.15,
    "traffic_load": 320.0,
    "uptime": 1200,
    "temperature": 33.0,
}


def resolve_device(db: Session, device: Device) -> Device:
    for field, value in HEALTHY_METRICS.items():
        setattr(device, field, value)
    device.resolved_at = datetime.utcnow()

    db.query(Alert).filter(Alert.device_id == device.id, Alert.is_read.is_(False)).update(
        {"is_read": True},
        synchronize_session=False,
    )
    db.commit()
    db.refresh(device)
    return device
