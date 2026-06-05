from sqlalchemy import Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class OpticalLine(Base):
    __tablename__ = "optical_lines"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120), index=True)
    source_device_id: Mapped[int] = mapped_column(ForeignKey("devices.id", ondelete="CASCADE"))
    target_device_id: Mapped[int] = mapped_column(ForeignKey("devices.id", ondelete="CASCADE"))
    fiber_type: Mapped[str] = mapped_column(String(64), default="Single-mode")
    length_km: Mapped[float] = mapped_column(Float, default=1.0)
    attenuation_db: Mapped[float] = mapped_column(Float, default=0.2)
    signal_loss_db: Mapped[float] = mapped_column(Float, default=0.1)
    utilization_percent: Mapped[float] = mapped_column(Float, default=35.0)
    status: Mapped[str] = mapped_column(String(32), default="healthy")
    last_update_time: Mapped[str] = mapped_column(String(64), default="")

    source_device = relationship("Device", foreign_keys=[source_device_id])
    target_device = relationship("Device", foreign_keys=[target_device_id])
