"""
Activity Model file.
Creates the "activities" table in the postgresql database.
Handles table and relationship between tables.
"""

from sqlalchemy import Integer, String, Text, DateTime, Enum, ForeignKey, func
from sqlalchemy.orm import relationship, mapped_column
from ..database import Base
from ..enums.activity import ActivityStatus, ActivityCategory

class Activity(Base):
    __tablename__ = "activities"

    id = mapped_column(Integer, primary_key=True, index=True)
    title = mapped_column(String(200), nullable=False)
    description = mapped_column(Text, nullable=False)
    category = mapped_column(Enum(ActivityCategory), nullable=False)
    location = mapped_column(String(255), nullable=False)
    activity_date = mapped_column(DateTime(timezone=True), nullable=False)
    max_participants = mapped_column(Integer, nullable=False)
    status = mapped_column(Enum(ActivityStatus), default=ActivityStatus.OPEN, nullable=False)
    creator_id = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at = mapped_column(DateTime(timezone=True), onupdate=func.now())

    """
    Relationships: Defines the relationship across tables.
    Herein, the creator and participation_requests are automatically populated for the activity.
    """
    creator = relationship("User", back_populates="created_activities")
    participation_requests = relationship("ParticipationRequest", back_populates="activity", cascade="all, delete-orphan", passive_deletes=True)