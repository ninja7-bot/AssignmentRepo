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
        return self.create(activity_data)

    def get_by_id(self, activity_id: int) -> Activity:
        return self.db.query(Activity).filter(Activity.id == activity_id).first()

    def get_all(self, filters: dict | None):
        query = self.db.query(Activity)
        if filters is None:
            filters = {}

        if "status" not in filters:
            filters["status"] = ActivityStatus.OPEN

        if filters.get("category"):
            query = query.filter(Activity.category == filters["category"])
        if filters.get("location"):
            query = query.filter(Activity.location.ilike(f"%{filters['location']}%"))
        if filters.get("date_from"):
            query = query.filter(Activity.activity_date >= filters["date_from"])
        if filters.get("date_to"):
            query = query.filter(Activity.activity_date <= filters["date_to"])
        if filters.get("status"):
            query = query.filter(Activity.status == filters["status"])

        return query.order_by(Activity.activity_date).all()

    def update_activity(self, activity_id: int, update_data: dict) -> Activity | None:
        activity = self.get_by_id(activity_id)
        if not activity:
            return None
        for field, value in update_data.items():
            if value is not None:
                setattr(activity, field, value)
        self.db.commit()
        self.db.refresh(activity)
        return activity

    def update_status(self, activity_id: int, status: ActivityStatus):
        activity = self.get_by_id(activity_id)
        if activity:
            activity.status = status
            self.db.commit()
            self.db.refresh(activity)
        return activity

    def delete_activity(self, activity_id: int) -> bool:
        activity = self.get_by_id(activity_id)
        if not activity:
            return False
        self.db.delete(activity)
        self.db.commit()
        return True

    def get_user_activities(self, user_id: int):
        return self.db.query(Activity).filter(Activity.creator_id == user_id).all()        