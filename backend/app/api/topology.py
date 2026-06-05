from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import current_user
from app.db.session import get_db
from app.models.device import Device
from app.models.optical_line import OpticalLine
from app.schemas.optical_line import OpticalLineCreate, OpticalLineResponse, OpticalLineUpdate
from app.services.auth import require_admin

router = APIRouter(prefix="/topology", tags=["topology"])


def _serialize(line: OpticalLine) -> OpticalLineResponse:
    return OpticalLineResponse(
        id=line.id,
        name=line.name,
        source_device_id=line.source_device_id,
        target_device_id=line.target_device_id,
        fiber_type=line.fiber_type,
        length_km=line.length_km,
        attenuation_db=line.attenuation_db,
        signal_loss_db=line.signal_loss_db,
        utilization_percent=line.utilization_percent,
        status=line.status,
        last_update_time=line.last_update_time,
        source_device_name=line.source_device.name if line.source_device else "Unknown",
        target_device_name=line.target_device.name if line.target_device else "Unknown",
    )


@router.get("/lines", response_model=list[OpticalLineResponse])
def list_optical_lines(db: Session = Depends(get_db), user=Depends(current_user)):
    lines = db.query(OpticalLine).order_by(OpticalLine.id.asc()).all()
    return [_serialize(line) for line in lines]


@router.post("/lines", response_model=OpticalLineResponse, status_code=status.HTTP_201_CREATED)
def create_optical_line(payload: OpticalLineCreate, db: Session = Depends(get_db), user=Depends(require_admin)):
    source = db.query(Device).filter(Device.id == payload.source_device_id).first()
    target = db.query(Device).filter(Device.id == payload.target_device_id).first()
    if not source or not target:
        raise HTTPException(status_code=404, detail="Source or target device not found")

    line = OpticalLine(**payload.model_dump())
    db.add(line)
    db.commit()
    db.refresh(line)
    return _serialize(line)


@router.put("/lines/{line_id}", response_model=OpticalLineResponse)
def update_optical_line(line_id: int, payload: OpticalLineUpdate, db: Session = Depends(get_db), user=Depends(require_admin)):
    line = db.query(OpticalLine).filter(OpticalLine.id == line_id).first()
    if not line:
        raise HTTPException(status_code=404, detail="Line not found")

    for field, value in payload.model_dump().items():
        setattr(line, field, value)
    db.commit()
    db.refresh(line)
    return _serialize(line)


@router.delete("/lines/{line_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_optical_line(line_id: int, db: Session = Depends(get_db), user=Depends(require_admin)):
    line = db.query(OpticalLine).filter(OpticalLine.id == line_id).first()
    if not line:
        raise HTTPException(status_code=404, detail="Line not found")
    db.delete(line)
    db.commit()
