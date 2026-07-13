"""
ParticipationService class provides functions to create participation request, approve request, reject requests, get requests for
a user and get requests for an activity.
"""

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from ..repository.participation_repository import ParticipationRepository
from ..repository.activity_repository import ActivityRepository
from ..services.activity_service import ActivityService
from ..enums.participation import ParticipationStatus
from ..enums.activity import ActivityStatus
import logging

logger = logging.getLogger("circleup")

class ParticipationService:
    def __init__(self, db: Session):
        self.participation_repo = ParticipationRepository(db)
        self.activity_repo = ActivityRepository(db)
        self.activity_service = ActivityService(db)
        self.db = db

    def request_participation(self, user_id: int, activity_id: int):
        """Create request for an activity ID by a user ID."""
        activity = self.activity_repo.get_by_id(activity_id)
        if not activity:
            logger.warning(f"Request Service: {activity_id} not found.")
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")

        if activity.creator_id == user_id:
            logger.warning(f"Request Service: {user_id} created this activity.")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot request to join your own activity")

        self.activity_service._update_status_if_needed(activity)
        if activity.status != ActivityStatus.OPEN:
            logger.warning(f"Request Service: {activity_id} has status {activity.status}.")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Activity is not open for requests")

        existing = self.participation_repo.get_by_user_and_activity(user_id, activity_id)
        if existing:
            logger.warning(f"Request Service: Request by {user_id} already found.")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You have already requested to join this activity")

        logger.info(f"Request Generated: {user_id} created request for {activity_id}.")
        return self.participation_repo.create_request(user_id, activity_id)

    def approve_request(self, request_id: int, owner_id: int):
        """Approve request for an activity ID by a user ID."""
        req = self.participation_repo.get_by_id(request_id)
        if not req:
            logger.warning(f"Approve Service: {request_id} not found.")
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found")

        activity = self.activity_repo.get_by_id(req.activity_id)
        if activity.creator_id != owner_id:
            logger.warning(f"Approve Service: {owner_id} has not created this event.")
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

        if req.status != ParticipationStatus.PENDING:
            logger.warning(f"Approve Service: Request by {request_id} for  Activity {activity.id} is {req.status}.")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Request is not pending")

        approved_count = self.participation_repo.get_approved_for_activity(activity.id)
        if len(approved_count) >= activity.max_participants:
            logger.warning(f"Approve Service: {activity.id} has reached full capacity.")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Activity is already full")

        self.activity_service._update_status_if_needed(activity)
        if activity.status != ActivityStatus.OPEN:
            logger.warning(f"Approve Service: Activity Status for {activity.id} is {activity.status}.")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Activity cannot accept more participants")

        return self.participation_repo.update_status(request_id, ParticipationStatus.APPROVED)

    def reject_request(self, request_id: int, owner_id: int):
        """Reject request for an activity ID by a user ID via owner."""
        req = self.participation_repo.get_by_id(request_id)
        if not req:
            logger.warning(f"Reject Request: Request by ID {request_id} not found.")
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found")

        activity = self.activity_repo.get_by_id(req.activity_id)
        if activity.creator_id != owner_id:
            logger.warning(f"Reject Request: {owner_id} is not Activity Creator.")
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

        if req.status != ParticipationStatus.PENDING:
            logger.warning(f"Reject Request: Request Status by ID {request_id} for Activity {activity.id} is {req.status}.")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Request is not pending")

        return self.participation_repo.update_status(request_id, ParticipationStatus.REJECTED)

    def get_activity_requests(self, activity_id: int, owner_id: int):
        """Fetch requests for an activity ID by the owner ID."""
        activity = self.activity_repo.get_by_id(activity_id)
        if not activity or activity.creator_id != owner_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
        return self.participation_repo.get_pending_for_activity(activity_id)

    def get_user_requests(self, user_id: int):
        """Fetch requests sent by a user ID."""
        return self.participation_repo.get_user_requests(user_id)