from sqlalchemy import Integer, ForeignKey, Enum, DateTime, func, UniqueConstraint
from sqlalchemy.orm import mapped_column, relationship
from ..database import Base
from ..enums.participation import ParticipationStatus

class ParticipationRequest(Base):
    __tablename__ = "participation_requests"

    id = mapped_column(Integer, primary_key=True, index=True)
    user_id = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    activity_id = mapped_column(Integer, ForeignKey("activities.id"), nullable=False)
    status = mapped_column(Enum(ParticipationStatus), default=ParticipationStatus.PENDING, nullable=False)
    requested_at = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at = mapped_column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="participation_requests")
    activity = relationship("Activity", back_populates="participation_requests")

    # Unique constraint to prevent duplicate requests
    __table_args__ = (UniqueConstraint('user_id', 'activity_id', name='unique_user_activity_request'),)