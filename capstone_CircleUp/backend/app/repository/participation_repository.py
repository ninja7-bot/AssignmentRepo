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

    def create_request(self, activity_id: int, user_id: int) -> ParticipationRequest:
        """Create a participation request with validation"""
        request_data = {
            "activity_id": activity_id,
            "user_id": user_id,
            "status": ParticipationStatus.PENDING
        }
        return self.create(request_data)