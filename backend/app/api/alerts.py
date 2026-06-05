from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.api.deps import current_user
from app.db.session import get_db
from app.models.alert import Alert
from app.schemas.alert import AlertResponse, AlertUpdate
from app.services.recommendations import build_fix_recommendations

router = APIRouter(prefix="/alerts", tags=["alerts"])


def serialize_alert(alert: Alert) -> AlertResponse:
    device = alert.device
    return AlertResponse(
        id=alert.id,
        device_id=alert.device_id,
        device_name=device.name if device else "",
        title=alert.title,
        message=alert.message,
        severity=alert.severity,
        is_read=alert.is_read,
        created_at=alert.created_at,
        recommendations=build_fix_recommendations(device, alert.severity) if device else [],
    )


@router.get("", response_model=list[AlertResponse])
def list_alerts(db: Session = Depends(get_db), user=Depends(current_user)):
    alerts = db.query(Alert).options(joinedload(Alert.device)).order_by(Alert.created_at.desc()).limit(100).all()
    return [serialize_alert(alert) for alert in alerts]


@router.patch("/{alert_id}", response_model=AlertResponse)
def update_alert(alert_id: int, payload: AlertUpdate, db: Session = Depends(get_db), user=Depends(current_user)):
    alert = db.query(Alert).options(joinedload(Alert.device)).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.is_read = payload.is_read
    db.commit()
    db.refresh(alert)
    return serialize_alert(alert)
