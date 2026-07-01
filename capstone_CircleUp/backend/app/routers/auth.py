from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.auth import LoginRequest
from ..schemas.user import UserResponse, UserCreate
from ..services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/register", response_model=dict)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    try:
        user = auth_service.register_user(user_data)
        access_token = auth_service.create_access_token_for_user(user)
        
        return {
            "message": "User registered successfully",
            "access_token": access_token,
            "token_type": "bearer",
            "user": UserResponse.model_validate(user)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed"
        )

@router.post("/login", response_model=dict)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    try:
        user = auth_service.authenticate_user(login_data.email, login_data.password)
        access_token = auth_service.create_access_token_for_user(user)
        
        return {
            "message": "Login successful",
            "access_token": access_token,
            "token_type": "bearer",
            "user": UserResponse.model_validate(user)
        }
    except HTTPException:
        raise
    except Exception as e:
        print(e)

@router.post("/logout")
def logout():
    return {"message": "Logged out successfully"}