"""
AuthService class provides methods for user registration, authentication, and access token generation. It interacts with the 
database to manage user data and handle authentication processes.
"""

from typing import Any

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import timedelta
from ..models.user import User
from ..schemas.user import UserCreate
from ..repository.user_repository import UserRepository
from ..utils.security import verify_password, get_password_hash, create_access_token
from ..config import settings
import logging

logger = logging.getLogger("circleup")
class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)

    def register_user(self, user_data: UserCreate) -> User:
        """Register a new user with validation and password hashing"""
        user_dict = user_data.model_dump()
        
        password = user_dict.pop("password")
        user_dict["hashed_password"] = get_password_hash(password)

        logger.info(f"Registration Service: User Registered w/ email {user_data.email} .")

        return self.user_repo.create_user(user_dict)

    def authenticate_user(self, email: str, password: str) -> User:
        """Authenticate user by email and password"""
        try:
            user = self.user_repo.get_by_email(email)
            if not user or not verify_password(password, user.hashed_password):
                logger.warning(f"Failed login by {email}.")
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Incorrect email or password"
                )
            logger.info(f"Login Service: {email} logged in.")
            return user
        except HTTPException as E:
            logger.warning(f"Login Service Exception Login: Attempt by {email}: {str(E)}")
            raise
        except Exception as E:
            logger.warning(f"Login Service Unauthorized Login: Attempt by {email}: {str(E)}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )

    def create_access_token_for_user(self, user: User) -> str:
        """Create an access token for the authenticated user"""
        access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
        logger.info(f"Token Generated: {user.id} generated token.")
        return create_access_token(
            subject=str(user.id), expires_delta=access_token_expires
        )