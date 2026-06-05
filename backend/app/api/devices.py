from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import current_user
from app.db.session import get_db
from app.models.device import Device
from app.models.metric import Metric
from app.schemas.device import DeviceCreate, DeviceResponse, DeviceUpdate
from app.schemas.metric import MetricResponse
from app.services.auth import require_admin

router = APIRouter(prefix="/devices", tags=["devices"])


@router.get("", response_model=list[DeviceResponse])
def list_devices(db: Session = Depends(get_db), user=Depends(current_user)):
    return db.query(Device).order_by(Device.id.asc()).all()


@router.post("", response_model=DeviceResponse, status_code=status.HTTP_201_CREATED)
def create_device(payload: DeviceCreate, db: Session = Depends(get_db), user=Depends(require_admin)):
    device = Device(**payload.model_dump())
    db.add(device)
    db.commit()
    db.refresh(device)
    return device


@router.get("/{device_id}", response_model=DeviceResponse)
def get_device(device_id: int, db: Session = Depends(get_db), user=Depends(current_user)):
    device = db.query(Device).filter(Device.id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    return device


@router.put("/{device_id}", response_model=DeviceResponse)
def update_device(device_id: int, payload: DeviceUpdate, db: Session = Depends(get_db), user=Depends(require_admin)):
    device = db.query(Device).filter(Device.id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    for field, value in payload.model_dump().items():
        setattr(device, field, value)
    db.commit()
    db.refresh(device)
    return device


@router.delete("/{device_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_device(device_id: int, db: Session = Depends(get_db), user=Depends(require_admin)):
    device = db.query(Device).filter(Device.id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    db.delete(device)
    db.commit()


@router.get("/{device_id}/metrics", response_model=list[MetricResponse])
def get_device_metrics(device_id: int, db: Session = Depends(get_db), user=Depends(current_user)):
    device = db.query(Device).filter(Device.id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    return db.query(Metric).filter(Metric.device_id == device_id).order_by(Metric.created_at.desc()).limit(20).all()
