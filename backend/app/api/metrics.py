import asyncio

from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from app.api.deps import current_user
from app.db.session import SessionLocal, get_db
from app.models.device import Device
from app.schemas.metric import LiveMetricPayload
from app.services.monitoring import generate_live_metrics

router = APIRouter(prefix="/metrics", tags=["metrics"])


@router.get("/live", response_model=list[LiveMetricPayload])
def get_live_metrics(db: Session = Depends(get_db), user=Depends(current_user)):
    devices = db.query(Device).order_by(Device.id.asc()).all()
    return [generate_live_metrics(db, device) for device in devices]


@router.websocket("/ws/live")
async def metrics_websocket(websocket: WebSocket):
    await websocket.accept()
    db = SessionLocal()
    try:
        while True:
            devices = db.query(Device).order_by(Device.id.asc()).all()
            payload = [generate_live_metrics(db, device) for device in devices]
            await websocket.send_json(payload)
            await asyncio.sleep(3)
    except WebSocketDisconnect:
        pass
    finally:
        db.close()
