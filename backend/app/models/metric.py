from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class Metric(Base):
    __tablename__ = "metrics"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    device_id: Mapped[int] = mapped_column(ForeignKey("devices.id", ondelete="CASCADE"), index=True)
    signal_strength: Mapped[float] = mapped_column(Float)
    latency: Mapped[float] = mapped_column(Float)
    packet_loss: Mapped[float] = mapped_column(Float)
    traffic_load: Mapped[float] = mapped_column(Float)
    uptime: Mapped[float] = mapped_column(Float)
    temperature: Mapped[float] = mapped_column(Float)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)

    device = relationship("Device", back_populates="metrics")
