from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from ..repository.participation_repository import ParticipationRepository
from ..repository.activity_repository import ActivityRepository
from ..services.activity_service import ActivityService
from ..enums.participation import ParticipationStatus
from ..enums.activity import ActivityStatus

class ParticipationService:
    def __init__(self, db: Session):
        self.participation_repo = ParticipationRepository(db)
        self.activity_repo = ActivityRepository(db)
        self.activity_service = ActivityService(db)
        self.db = db

    def request_participation(self, user_id: int, activity_id: int):
        activity = self.activity_repo.get_by_id(activity_id)
        if not activity:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")

        if activity.creator_id == user_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot request to join your own activity")

        self.activity_service._update_status_if_needed(activity)
        if activity.status != ActivityStatus.OPEN:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Activity is not open for requests")

        existing = self.participation_repo.get_by_user_and_activity(user_id, activity_id)
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You have already requested to join this activity")

        return self.participation_repo.create_request(user_id, activity_id)

    def approve_request(self, request_id: int, owner_id: int):
        req = self.participation_repo.get_by_id(request_id)
        if not req:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found")

        activity = self.activity_repo.get_by_id(req.activity_id)
        if activity.creator_id != owner_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

        if req.status != ParticipationStatus.PENDING:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Request is not pending")

        approved_count = self.participation_repo.get_approved_for_activity(activity.id)
        if len(approved_count) >= activity.max_participants:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Activity is already full")

        self.activity_service._update_status_if_needed(activity)
        if activity.status != ActivityStatus.OPEN:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Activity cannot accept more participants")

        return self.participation_repo.update_status(request_id, ParticipationStatus.APPROVED)

    def reject_request(self, request_id: int, owner_id: int):
        req = self.participation_repo.get_by_id(request_id)
        if not req:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found")

        activity = self.activity_repo.get_by_id(req.activity_id)
        if activity.creator_id != owner_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

        if req.status != ParticipationStatus.PENDING:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Request is not pending")

        return self.participation_repo.update_status(request_id, ParticipationStatus.REJECTED)

    def get_activity_requests(self, activity_id: int, owner_id: int):
        activity = self.activity_repo.get_by_id(activity_id)
        if not activity or activity.creator_id != owner_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
        return self.participation_repo.get_pending_for_activity(activity_id)

    def get_user_requests(self, user_id: int):
        return self.participation_repo.get_user_requests(user_id)