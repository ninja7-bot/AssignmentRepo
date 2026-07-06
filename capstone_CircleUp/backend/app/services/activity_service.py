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
        activity = self.activity_repo.get_by_id(activity_id)
        if not activity:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")
        return activity

    def list_activities(self, filters: dict | None):
        activities = self.activity_repo.get_all(filters)
        for act in activities:
            self._update_status_if_needed(act)
        return activities

    def get_user_activities(self, user_id: int):
        """Activities created (hosted) by this user, regardless of status."""
        activities = self.activity_repo.get_user_activities(user_id)
        for act in activities:
            self._update_status_if_needed(act)
        return activities

    def update_activity(self, activity_id: int, update_data: ActivityUpdate, user_id: int):
        activity = self.activity_repo.get_by_id(activity_id)
        if not activity:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")
        if activity.creator_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
        if activity.status in [ActivityStatus.CANCELLED, ActivityStatus.COMPLETED]:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot edit cancelled or completed activity")

        update_dict = update_data.model_dump(exclude_unset=True)
        current_count = self.get_current_participants_count(activity_id)

        if "max_participants" in update_dict and update_dict["max_participants"] < current_count:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    f"max_participants cannot be less than the current number of "
                    f"approved participants ({current_count})"
                )
            )

        updated_activity = self.activity_repo.update_activity(activity_id, update_dict)
        if updated_activity is None:
            return

        # Capacity may have just changed enough to flip FULL <-> OPEN.
        if updated_activity.status == ActivityStatus.FULL and current_count < updated_activity.max_participants:
            updated_activity = self.activity_repo.update_status(activity_id, ActivityStatus.OPEN)
        elif updated_activity.status == ActivityStatus.OPEN and current_count >= updated_activity.max_participants:
            updated_activity = self.activity_repo.update_status(activity_id, ActivityStatus.FULL)

        return updated_activity

    def cancel_activity(self, activity_id: int, user_id: int):
        activity = self.activity_repo.get_by_id(activity_id)
        if not activity:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")
        if activity.creator_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
        if activity.status == ActivityStatus.COMPLETED:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot cancel completed activity")
        return self.activity_repo.update_status(activity_id, ActivityStatus.CANCELLED)

    def can_accept_new_requests(self, activity_id: int) -> bool:
        activity = self.activity_repo.get_by_id(activity_id)
        if not activity:
            return False
        return activity.status == ActivityStatus.OPEN
    
    def _update_status_if_needed(self, activity):
        if activity.status in [ActivityStatus.CANCELLED, ActivityStatus.COMPLETED]:
            return
        if activity.activity_date < datetime.now(activity.activity_date.tzinfo):
            activity.status = ActivityStatus.COMPLETED
            self.db.commit()
            return

        approved = self.participation_repo.get_approved_for_activity(activity.id)
        if len(approved) >= activity.max_participants:
            activity.status = ActivityStatus.FULL
            self.db.commit()
        
    def get_current_participants_count(self, activity_id: int) -> int:
        approved = self.participation_repo.get_approved_for_activity(activity_id)
        return len(approved)     