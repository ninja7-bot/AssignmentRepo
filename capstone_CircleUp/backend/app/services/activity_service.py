from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import datetime
from ..repository.activity_repository import ActivityRepository
from ..repository.participation_repository import ParticipationRepository
from ..schemas.activity import ActivityCreate, ActivityUpdate
from ..enums import ActivityStatus

class ActivityService:
    def __init__(self, db: Session):
        self.db = db
        self.activity_repo = ActivityRepository(db)
        self.participation_repo = ParticipationRepository(db)

    def create_activity(self, activity_data: ActivityCreate, creator_id: int):
        """Create a new activity"""
        try:
            if activity_data.max_participants <= 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="max_participants must be greater than 0"
                )
            if activity_data.activity_date <= datetime.now(activity_data.activity_date.tzinfo):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Activity must be scheduled for a future date and time"
            )
            activity_dict = activity_data.model_dump()
            return self.activity_repo.create_activity(activity_dict, creator_id)
        
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create activity"
            )
    def get_activity(self, activity_id: int):
        """Fetch Activity for activity_id."""
        activity = self.activity_repo.get_by_id(activity_id)
        self._update_status_if_needed(activity)
        if not activity:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")
        return activity

    def list_activities(self, filters: dict | None):
        """List all activities."""
        activities = self.activity_repo.get_all(filters)
        for act in activities:
            self._update_status_if_needed(act)
        return activities

    def update_activity(self, activity_id: int, update_data: ActivityUpdate, user_id: int):
        """Update a prexisting activity."""
        activity = self.activity_repo.get_by_id(activity_id)
        if not activity:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")
        if activity.creator_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
        if activity.status in [ActivityStatus.CANCELLED, ActivityStatus.COMPLETED]:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot edit cancelled or completed activity")
        return self.activity_repo.update_activity(activity_id, update_data.model_dump(exclude_unset=True))

    def cancel_activity(self, activity_id: int, user_id: int):
        """Cancel a prexisting activity."""
        activity = self.activity_repo.get_by_id(activity_id)
        if not activity:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")
        if activity.creator_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
        if activity.status == ActivityStatus.COMPLETED:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot cancel completed activity")
        return self.activity_repo.update_status(activity_id, ActivityStatus.CANCELLED)

    def can_accept_new_requests(self, activity_id: int) -> bool:
        """Is Activity OPEN?"""
        activity = self.activity_repo.get_by_id(activity_id)
        if not activity:
            return False
        return activity.status == ActivityStatus.OPEN
    
    def _update_status_if_needed(self, activity):
        """Laze Status Update for all activities."""
        if activity.status in [ActivityStatus.CANCELLED, ActivityStatus.COMPLETED]:
            return
        if activity.activity_date < datetime.now(activity.activity_date.tzinfo):
            activity.status = ActivityStatus.COMPLETED
            self.db.commit()
            return