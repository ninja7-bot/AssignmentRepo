from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from ..database import get_db
from ..schemas.activity import (
    ActivityCreate, ActivityUpdate, ActivityResponse, 
    ActivityDetail, ActivityFilter, ActivityCategory, ActivityStatus
)
from ..services.activity_service import ActivityService
from ..utils.dependencies import get_current_user
from ..models.user import User

router = APIRouter(prefix="/activities", tags=["activities"])

@router.post("/", response_model=ActivityResponse)
def create_activity(
    activity_data: ActivityCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new activity"""
    activity_service = ActivityService(db)
    activity = activity_service.create_activity(activity_data, current_user.id)
    
    # Add creator name and participant count for response
    response_data = ActivityResponse.model_validate(activity)
    #response_data.creator_name = current_user.name
    #response_data.current_participants = 0
    return response_data