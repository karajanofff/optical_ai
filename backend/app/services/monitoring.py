from datetime import datetime, timedelta
from random import uniform

from sqlalchemy.orm import Session

from app.models.alert import Alert
from app.models.device import Device
from app.models.metric import Metric
from app.services.ai_service import ai_service


def _is_recently_resolved(device: Device) -> bool:
    if device.resolved_at is None:
        return False
    return device.resolved_at > datetime.utcnow() - timedelta(minutes=30)


def generate_live_metrics(db: Session, device: Device) -> dict:
    if _is_recently_resolved(device):
        signal_strength = round(-18.0 + uniform(-1.2, 1.0), 2)
        latency = round(2.5 + uniform(-0.4, 0.4), 2)
        packet_loss = round(max(0.0, 0.2 + uniform(-0.08, 0.12)), 2)
        traffic_load = round(300.0 + uniform(-40.0, 60.0), 2)
        uptime = round(max(1.0, device.uptime + uniform(0.0, 5.0)), 2)
        temperature = round(33.0 + uniform(-1.5, 1.5), 2)
    else:
        signal_strength = round(device.signal_strength + uniform(-2.4, 1.2), 2)
        latency = round(max(0.5, device.latency + uniform(-0.8, 2.5)), 2)
        packet_loss = round(max(0.0, min(9.9, device.packet_loss + uniform(-0.2, 1.1))), 2)
        traffic_load = round(max(40.0, min(1400.0, device.traffic_load + uniform(-70.0, 120.0))), 2)
        uptime = round(max(1.0, device.uptime + uniform(-10.0, 18.0)), 2)
        temperature = round(max(18.0, min(88.0, device.temperature + uniform(-1.2, 3.0))), 2)
    ai_result = ai_service.predict([signal_strength, latency, packet_loss, traffic_load, uptime, temperature])
    status = "online"
    if ai_result["prediction"] == "critical":
        status = "offline"
    elif ai_result["prediction"] == "warning":
        status = "warning"

    if _is_recently_resolved(device) and ai_result["prediction"] != "critical":
        status = "online"

    db.add(
        Metric(
            device_id=device.id,
            signal_strength=signal_strength,
            latency=latency,
            packet_loss=packet_loss,
            traffic_load=traffic_load,
            uptime=uptime,
            temperature=temperature,
        )
    )

    device.signal_strength = signal_strength
    device.latency = latency
    device.packet_loss = packet_loss
    device.traffic_load = traffic_load
    device.uptime = max(1, int(uptime))
    device.temperature = temperature
    device.status = status

    if ai_result["prediction"] != "normal":
        latest_alert = (
            db.query(Alert)
            .filter(Alert.device_id == device.id)
            .order_by(Alert.created_at.desc())
            .first()
        )
        should_create_alert = (
            latest_alert is None
            or latest_alert.severity != ai_result["prediction"]
            or latest_alert.created_at < datetime.utcnow() - timedelta(minutes=5)
        )
    else:
        should_create_alert = False

    if should_create_alert:
        db.add(
            Alert(
                device_id=device.id,
                title=f"{device.name} qurilmasida anomaliya aniqlandi",
                message=(
                    f"AI modeli {device.name} qurilmasini "
                    f"{'kritik' if ai_result['prediction'] == 'critical' else 'ogohlantirish'} holat sifatida "
                    f"{ai_result['confidence']:.0%} ishonchlilik bilan belgiladi."
                ),
                severity=ai_result["prediction"],
            )
        )

    db.commit()
    return {
        "device_id": device.id,
        "device_name": device.name,
        "status": status,
        "signal_strength": signal_strength,
        "latency": latency,
        "packet_loss": packet_loss,
        "traffic_load": traffic_load,
        "uptime": uptime,
        "temperature": temperature,
        "ai_state": ai_result["prediction"],
        "timestamp": datetime.utcnow().isoformat(),
    }
