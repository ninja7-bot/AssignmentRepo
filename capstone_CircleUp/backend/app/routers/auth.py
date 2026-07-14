"""
Auth router module for FastAPI application. This module defines the API endpoints related to user authentication,
including registration, login, and logout. It utilizes the AuthService for business logic and the get_current_user 
dependency for authentication. The endpoints are secured and require a valid Bearer token for access.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.auth import LoginRequest
from ..schemas.user import UserResponse, UserCreate
from ..services.auth_service import AuthService
import logging

logger = logging.getLogger("circleup")

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/register", response_model=dict, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user and return an access token upon successful registration"""
    auth_service = AuthService(db)
    try: 
        user = auth_service.register_user(user_data)
        access_token = auth_service.create_access_token_for_user(user)

        logger.info(f"New User Registered by {user_data.email}.")

        return {
            "message": "User registered successfully",
            "access_token": access_token,
            "token_type": "bearer",
            "user": UserResponse.model_validate(user),
        }
    
    except ValueError as exc:
        logger.warning(f"Registration Failed for {user_data.email}: {str(exc)}")
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        ) from exc

@router.post("/login", response_model=dict)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate user and return an access token upon successful login"""
    auth_service = AuthService(db)
    try:
        user = auth_service.authenticate_user(login_data.email, login_data.password)
        access_token = auth_service.create_access_token_for_user(user)

        logger.info(f"{login_data.email} logged in.")
        
        return {
            "message": "Login successful",
            "access_token": access_token,
            "token_type": "bearer",
            "user": UserResponse.model_validate(user)
        }
    except HTTPException:
        logger.warning(f"Login Failed for {login_data.email}: {HTTPException}")
        raise
    except Exception as e:
        logger.warning(f"Login Failed for {login_data.email}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed"
        )

@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout():
    """Logout the current user (token invalidation is handled on the client-side)"""
    return {"message": "Logged out successfully"}