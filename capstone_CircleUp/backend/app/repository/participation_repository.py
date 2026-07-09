"""
ParticipationRepository handles database operations related to the ParticipationRequest model.
"""

from sqlalchemy.orm import Session
from ..models.participation import ParticipationRequest
from ..enums import ParticipationStatus
from .base import BaseRepository

class ParticipationRepository(BaseRepository[ParticipationRequest]):
    """Repository for ParticipationRequest model operations"""
    
    def __init__(self, db: Session):
        super().__init__(db, ParticipationRequest)

    def create_request(self, user_id: int, activity_id: int) -> ParticipationRequest:
        """Create a participation request with validation"""
        request_data = {
            "activity_id": activity_id,
            "user_id": user_id,
            "status": ParticipationStatus.PENDING
        }
        return self.create(request_data)
    
    def get_by_id(self, request_id: int):
        return self.db.query(ParticipationRequest).filter(ParticipationRequest.id == request_id).first()

    def get_by_user_and_activity(self, user_id: int, activity_id: int):
        return self.db.query(ParticipationRequest).filter(
            ParticipationRequest.user_id == user_id,
            ParticipationRequest.activity_id == activity_id
        ).first()

    def get_pending_for_activity(self, activity_id: int):
        return self.db.query(ParticipationRequest).filter(
            ParticipationRequest.activity_id == activity_id,
            ParticipationRequest.status == ParticipationStatus.PENDING
        ).all()

    def get_approved_for_activity(self, activity_id: int):
        return self.db.query(ParticipationRequest).filter(
            ParticipationRequest.activity_id == activity_id,
            ParticipationRequest.status == ParticipationStatus.APPROVED
        ).all()

    def update_status(self, request_id: int, status: ParticipationStatus):
        req = self.get_by_id(request_id)
        if req:
            req.status = status
            self.db.commit()
            self.db.refresh(req)
        return req

    def get_user_requests(self, user_id: int):
        return self.db.query(ParticipationRequest).filter(
            ParticipationRequest.user_id == user_id
        ).all()
