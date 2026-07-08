from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.user import UserResponse, UserUpdate, UserProfile
from ..services.user_service import UserService
from ..utils.dependencies import get_current_user
from ..models.user import User
import logging

logger = logging.getLogger("CircleUp")


router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Get current user's profile"""
    return UserResponse.model_validate(current_user)

@router.put("/me", response_model=UserResponse)
def update_current_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user's profile"""
    user_service = UserService(db)
    updated_user = user_service.update_user(current_user.id, user_update)
    logger.info(f"{current_user.id} triggered an update for their profile.")
    return UserResponse.model_validate(updated_user)

@router.get("/{user_id}", response_model=UserProfile)
def get_user_profile(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user profile by ID (limited info for privacy)"""
    user_service = UserService(db)
    user = user_service.get_user_by_id(user_id)
    return UserProfile.model_validate(user)

@router.delete("/me")
def delete_current_user_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete current user's account"""
    user_service = UserService(db)
    user_service.delete_user(current_user.id)
    logger.info(f"{current_user.id} triggered a delete for their account.")
    return {"message": "Account deleted successfully"}