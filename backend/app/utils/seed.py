from random import choice, uniform

from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.models.alert import Alert
from app.models.device import Device
from app.models.metric import Metric
from app.models.optical_line import OpticalLine
from app.models.user import User


def seed_database(db: Session) -> None:
    if db.query(User).count() == 0:
        db.add_all(
            [
                User(username="admin", full_name="System Administrator", role="admin", password_hash=get_password_hash("admin123")),
                User(username="operator", full_name="Network Operator", role="operator", password_hash=get_password_hash("operator123")),
            ]
        )
        db.flush()

    catalog = [
        ("Core-OLT-01", "OLT", "Tashkent Central", "10.0.0.11"),
        ("Edge-ONU-02", "ONU", "Yunusobod", "10.0.0.12"),
        ("Backbone-ODF-03", "ODF", "Chilonzor", "10.0.0.13"),
        ("Metro-Switch-04", "Optical Switch", "Samarkand", "10.0.0.14"),
        ("Access-OLT-05", "OLT", "Fergana", "10.0.0.15"),
        ("Distribution-ONU-06", "ONU", "Bukhara", "10.0.0.16"),
    ]

    if db.query(Device).count() == 0:
        devices: list[Device] = []
        for name, device_type, location, ip_address in catalog:
            signal = round(uniform(-28, -14), 2)
            latency = round(uniform(1.5, 9.0), 2)
            packet_loss = round(uniform(0.0, 3.5), 2)
            traffic_load = round(uniform(140, 980), 2)
            uptime = int(uniform(120, 18000))
            temperature = round(uniform(27, 61), 2)
            status = "online" if latency < 6 and packet_loss < 1.5 and signal > -24 else choice(["warning", "offline"])
            devices.append(
                Device(
                    name=name,
                    device_type=device_type,
                    location=location,
                    ip_address=ip_address,
                    status=status,
                    signal_strength=signal,
                    latency=latency,
                    packet_loss=packet_loss,
                    traffic_load=traffic_load,
                    uptime=uptime,
                    temperature=temperature,
                )
            )

        db.add_all(devices)
        db.flush()

        alerts: list[Alert] = []
        for device in devices:
            for _ in range(6):
                db.add(
                    Metric(
                        device_id=device.id,
                        signal_strength=round(device.signal_strength + uniform(-1.5, 1.5), 2),
                        latency=round(max(0.7, device.latency + uniform(-1.2, 1.9)), 2),
                        packet_loss=round(max(0.0, device.packet_loss + uniform(-0.4, 0.8)), 2),
                        traffic_load=round(max(30.0, min(1400.0, device.traffic_load + uniform(-60.0, 95.0))), 2),
                        uptime=round(max(1.0, device.uptime + uniform(-6.0, 24.0)), 2),
                        temperature=round(max(20.0, min(80.0, device.temperature + uniform(-3.0, 4.0))), 2),
                    )
                )
            if device.status != "online":
                status_label = "oflayn" if device.status == "offline" else "ogohlantirish"
                alerts.append(
                    Alert(
                        device_id=device.id,
                        title=f"{device.name} tekshiruvni talab qiladi",
                        message=f"{device.location} hududidagi {device.name} qurilmasida {status_label} holat ko'rsatkichlari kuzatildi.",
                        severity="critical" if device.status == "offline" else "warning",
                        is_read=False,
                    )
                )

        db.add_all(alerts)
        db.flush()

    devices = db.query(Device).order_by(Device.id.asc()).all()

    if db.query(OpticalLine).count() == 0 and len(devices) >= 6:
        db.add_all(
            [
            OpticalLine(
                name="Toshkent Core -> Yunusobod Access",
                source_device_id=devices[0].id,
                target_device_id=devices[1].id,
                fiber_type="Single-mode",
                length_km=12.4,
                attenuation_db=0.28,
                signal_loss_db=0.42,
                utilization_percent=61.0,
                status="healthy",
                last_update_time="2026-04-20 22:30",
            ),
            OpticalLine(
                name="Toshkent Core -> Chilonzor Backbone",
                source_device_id=devices[0].id,
                target_device_id=devices[2].id,
                fiber_type="Single-mode",
                length_km=18.9,
                attenuation_db=0.36,
                signal_loss_db=0.71,
                utilization_percent=79.0,
                status="warning",
                last_update_time="2026-04-20 22:30",
            ),
            OpticalLine(
                name="Chilonzor Backbone -> Samarkand Metro",
                source_device_id=devices[2].id,
                target_device_id=devices[3].id,
                fiber_type="Long-haul",
                length_km=275.0,
                attenuation_db=0.41,
                signal_loss_db=1.15,
                utilization_percent=67.0,
                status="healthy",
                last_update_time="2026-04-20 22:30",
            ),
            OpticalLine(
                name="Samarkand Metro -> Fergana Access",
                source_device_id=devices[3].id,
                target_device_id=devices[4].id,
                fiber_type="Regional fiber",
                length_km=142.7,
                attenuation_db=0.52,
                signal_loss_db=1.61,
                utilization_percent=88.0,
                status="critical",
                last_update_time="2026-04-20 22:30",
            ),
            OpticalLine(
                name="Fergana Access -> Bukhara Distribution",
                source_device_id=devices[4].id,
                target_device_id=devices[5].id,
                fiber_type="Backbone",
                length_km=310.3,
                attenuation_db=0.49,
                signal_loss_db=1.28,
                utilization_percent=54.0,
                status="healthy",
                last_update_time="2026-04-20 22:30",
            ),
            ]
        )
    db.commit()
