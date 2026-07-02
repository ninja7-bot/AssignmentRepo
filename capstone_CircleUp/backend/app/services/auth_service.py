"""
AuthService class provides methods for user registration, authentication, and access token generation. It interacts with the 
database to manage user data and handle authentication processes.
"""

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import timedelta
from ..models.user import User
from ..schemas.user import UserCreate
from ..repository.user_repository import UserRepository
from ..utils.security import verify_password, get_password_hash, create_access_token
from ..config import settings

class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)

    def register_user(self, user_data: UserCreate) -> User:
        """Register a new user with validation and password hashing"""
        try:
            # Prepare user data with hashed password
            hashed_password = get_password_hash(user_data.password)
            user_dict = user_data.model_dump()
            user_dict['hashed_password'] = hashed_password
            del user_dict['password']  # Remove plain password
            
            # Create user using repository
            return self.user_repo.create_user(user_data)
            
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )

    def authenticate_user(self, email: str, password: str) -> User:
        """Authenticate user by email and password"""
        try:
            user = self.user_repo.get_by_email(email)
            if not user or not verify_password(password, user.hashed_password):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Incorrect email or password"
                )
            return user
        except HTTPException:
            raise
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )

    def create_access_token_for_user(self, user: User) -> str:
        """Create an access token for the authenticated user"""
        access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
        return create_access_token(
            subject=str(user.id), expires_delta=access_token_expires
        )