"""
ActivityRepository handles database operations related to the Activity model.
"""

from sqlalchemy.orm import Session
from ..models.activity import Activity
from ..enums import ActivityStatus
from .base import BaseRepository

class ActivityRepository(BaseRepository[Activity]):
    """Repository for Activity model operations"""
    
    def __init__(self, db: Session):
        super().__init__(db, Activity)

    def create_activity(self, activity_data: dict, creator_id: int) -> Activity:
        """Create a new activity"""
        activity_data['creator_id'] = creator_id
        activity_data['status'] = ActivityStatus.OPEN
        return self.create(activity_data)