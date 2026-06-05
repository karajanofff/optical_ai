from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import current_user
from app.db.session import get_db
from app.models.alert import Alert
from app.schemas.alert import AlertResponse, AlertUpdate

router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.get("", response_model=list[AlertResponse])
def list_alerts(db: Session = Depends(get_db), user=Depends(current_user)):
    return db.query(Alert).order_by(Alert.created_at.desc()).limit(100).all()


@router.patch("/{alert_id}", response_model=AlertResponse)
def update_alert(alert_id: int, payload: AlertUpdate, db: Session = Depends(get_db), user=Depends(current_user)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.is_read = payload.is_read
    db.commit()
    db.refresh(alert)
    return alert
