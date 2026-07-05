from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import datetime
from ..database import get_db
from ..schemas.activity import ActivityCreate, ActivityUpdate, ActivityResponse
from ..services.activity_service import ActivityService
from ..utils.dependencies import get_current_user
from ..models.user import User
from ..enums.activity import ActivityCategory

router = APIRouter(prefix="/activities", tags=["activities"])

@router.post("/", response_model=ActivityResponse)
def create_activity(
    activity_data: ActivityCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    activity_service = ActivityService(db)
    activity = activity_service.create_activity(activity_data, current_user.id)
    response = ActivityResponse.model_validate(activity)
    response.creator_name = current_user.name
    response.current_participants = 0
    return response

@router.get("/", response_model=list[ActivityResponse])
def list_activities(
    category: ActivityCategory | None = None,
    location: str | None = None,
    date_from: datetime | None = None,
    date_to: datetime | None = None,
    db: Session = Depends(get_db)
):
    activity_service = ActivityService(db)
    filters = {"category": category, "location": location, "date_from": date_from, "date_to": date_to}
    filters = {k: v for k, v in filters.items() if v is not None}
    
    activities = activity_service.list_activities(filters)
    
    result = []
    for act in activities:
        r = ActivityResponse.model_validate(act)
        r.creator_name = act.creator.name if act.creator else None
        r.current_participants = activity_service.get_current_participants_count(act.id)
        result.append(r)
    return result

@router.get("/{activity_id}", response_model=ActivityResponse)
def get_activity(activity_id: int, db: Session = Depends(get_db)):
    activity_service = ActivityService(db)
    activity = activity_service.get_activity(activity_id)
    r = ActivityResponse.model_validate(activity)
    r.creator_name = activity.creator.name if activity.creator else None
    r.current_participants = activity_service.get_current_participants_count(activity_id)
    return r

@router.put("/{activity_id}", response_model=ActivityResponse)
def update_activity(
    activity_id: int,
    update_data: ActivityUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    activity_service = ActivityService(db)
    activity = activity_service.update_activity(activity_id, update_data, current_user.id)
    r = ActivityResponse.model_validate(activity)
    r.creator_name = current_user.name
    r.current_participants = activity_service.get_current_participants_count(activity_id)
    return r

@router.delete("/{activity_id}")
def cancel_activity(
    activity_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    activity_service = ActivityService(db)
    activity_service.cancel_activity(activity_id, current_user.id)
    return {"message": "Activity cancelled successfully"}