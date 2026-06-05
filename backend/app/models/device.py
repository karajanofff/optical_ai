from datetime import datetime

from sqlalchemy import DateTime, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class Device(Base):
    __tablename__ = "devices"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120), index=True)
    device_type: Mapped[str] = mapped_column(String(80))
    location: Mapped[str] = mapped_column(String(120))
    ip_address: Mapped[str] = mapped_column(String(64), unique=True)
    status: Mapped[str] = mapped_column(String(32), default="online")
    resolved_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True, default=None)
    signal_strength: Mapped[float] = mapped_column(Float, default=-18.0)
    latency: Mapped[float] = mapped_column(Float, default=2.0)
    packet_loss: Mapped[float] = mapped_column(Float, default=0.1)
    traffic_load: Mapped[float] = mapped_column(Float, default=45.0)
    uptime: Mapped[int] = mapped_column(Integer, default=99)
    temperature: Mapped[float] = mapped_column(Float, default=34.0)

    metrics = relationship("Metric", back_populates="device", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="device", cascade="all, delete-orphan")
