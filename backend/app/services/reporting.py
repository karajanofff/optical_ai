from datetime import datetime, timedelta

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.alert import Alert
from app.models.device import Device


def build_summary_report(db: Session) -> dict:
    total_devices = db.query(func.count(Device.id)).scalar() or 0
    online_devices = db.query(func.count(Device.id)).filter(Device.status == "online").scalar() or 0
    offline_devices = db.query(func.count(Device.id)).filter(Device.status == "offline").scalar() or 0
    warning_devices = db.query(func.count(Device.id)).filter(Device.status == "warning").scalar() or 0
    anomaly_count = warning_devices + offline_devices
    averages = db.query(
        func.avg(Device.signal_strength),
        func.avg(Device.latency),
        func.avg(Device.packet_loss),
    ).one()
    average_signal = round(float(averages[0] or 0), 2)
    average_latency = round(float(averages[1] or 0), 2)
    average_packet_loss = round(float(averages[2] or 0), 2)
    alerts_today = db.query(func.count(Alert.id)).filter(Alert.created_at >= datetime.utcnow() - timedelta(days=1)).scalar() or 0
    alerts_this_week = db.query(func.count(Alert.id)).filter(Alert.created_at >= datetime.utcnow() - timedelta(days=7)).scalar() or 0

    health_score = 100.0
    if total_devices:
        health_score -= round((offline_devices / total_devices) * 40, 2)
        health_score -= round((warning_devices / total_devices) * 20, 2)
        health_score -= min(20.0, average_packet_loss * 2)
        health_score -= max(0.0, average_latency - 2.0)
    health_score = round(max(0.0, min(100.0, health_score)), 2)

    return {
        "total_devices": total_devices,
        "online_devices": online_devices,
        "offline_devices": offline_devices,
        "warning_devices": warning_devices,
        "anomaly_count": anomaly_count,
        "average_signal": average_signal,
        "average_latency": average_latency,
        "average_packet_loss": average_packet_loss,
        "health_score": health_score,
        "alerts_today": alerts_today,
        "alerts_this_week": alerts_this_week,
    }
