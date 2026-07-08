from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.participation import ParticipationRequestCreate, ParticipationRequestResponse, ParticipationRequestDetail
from ..schemas.user import UserContactInfo
from ..services.participation_service import ParticipationService
from ..utils.dependencies import get_current_user
from ..models.user import User
from ..repository.participation_repository import ParticipationRepository
from ..enums.participation import ParticipationStatus
import logging

logger = logging.getLogger("circleup")


router = APIRouter(prefix="/participation", tags=["participation"])

@router.post("/request", response_model=ParticipationRequestResponse)
def request_participation(
    data: ParticipationRequestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = ParticipationService(db)
    req = service.request_participation(current_user.id, data.activity_id)
    logger.info(f"{current_user.id} triggered a request for {data.activity_id}.")
    return ParticipationRequestResponse.model_validate(req)

@router.post("/approve/{request_id}", response_model=ParticipationRequestResponse)
def approve_request(
    request_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = ParticipationService(db)
    req = service.approve_request(request_id, current_user.id)
    logger.info(f"{current_user.id} triggered an approve for {request_id}.")
    return ParticipationRequestResponse.model_validate(req)

@router.post("/reject/{request_id}", response_model=ParticipationRequestResponse)
def reject_request(
    request_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = ParticipationService(db)
    req = service.reject_request(request_id, current_user.id)
    logger.info(f"{current_user.id} triggered a reject for the request {request_id}.")
    return ParticipationRequestResponse.model_validate(req)

@router.get("/my-requests", response_model=list[ParticipationRequestResponse])
def my_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = ParticipationService(db)
    requests = service.get_user_requests(current_user.id)
    logger.info(f"{current_user.id} fetched their requests.")
    return [ParticipationRequestResponse.model_validate(r) for r in requests]

@router.get("/activity/{activity_id}/requests", response_model=list[ParticipationRequestDetail])
def activity_requests(
    activity_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = ParticipationService(db)
    requests = service.get_activity_requests(activity_id, current_user.id)
    result = []
    for r in requests:
        detail = ParticipationRequestDetail.model_validate(r)
        detail.user_name = r.user.name if r.user else None
        detail.activity_title = r.activity.title if r.activity else None
        result.append(detail)
    logger.info(f"Requests fetched for Activity {activity_id}.")
    return result

@router.get("/activity/{activity_id}/contacts", response_model=list[UserContactInfo])
def get_approved_contacts(
    activity_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Contact visibility based on user type, 
        if creator shows list of approved users
        if participant, shows contact details of the creator.
    """
    from ..models.activity import Activity
    from fastapi import HTTPException, status

    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        logger.warning(f"Activity ID: {activity_id} not found.")
        raise HTTPException(status_code=404, detail="Activity not found")

    participation_repo = ParticipationRepository(db)
    approved_requests = participation_repo.get_approved_for_activity(activity_id)

    is_creator = activity.creator_id == current_user.id
    is_approved_participant = any(req.user_id == current_user.id for req in approved_requests)

    if not is_creator and not is_approved_participant:
        logger.warning(f"{current_user.id} triggered forbidden request for contact visibility for Activity {activity_id}.")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Contact information is only visible after approval"
        )

    contacts = []

    if is_creator:
        for req in approved_requests:
            if req.user:
                contacts.append(UserContactInfo(
                    id=req.user.id,
                    name=req.user.name,
                    phone_number=req.user.phone_number,
                    email=req.user.email
                ))

    elif is_approved_participant:
        creator = activity.creator
        if creator:
            contacts.append(UserContactInfo(
                id=creator.id,
                name=creator.name,
                phone_number=creator.phone_number,
                email=creator.email
            ))
    logger.info(f"{current_user.id} triggered contacts fetch for Activity {activity_id}.")
    return contacts