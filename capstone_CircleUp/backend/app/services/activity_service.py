from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from ..repository.activity_repository import ActivityRepository
from ..repository.participation_repository import ParticipationRepository
from ..schemas.activity import ActivityCreate

class ActivityService:
    def __init__(self, db: Session):
        self.db = db
        self.activity_repo = ActivityRepository(db)
        self.participation_repo = ParticipationRepository(db)

    def create_activity(self, activity_data: ActivityCreate, creator_id: int):
        """Create a new activity"""
        try:
            activity_dict = activity_data.model_dump()
            return self.activity_repo.create_activity(activity_dict, creator_id)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create activity"
            )