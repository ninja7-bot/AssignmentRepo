"""
AuthService class provides methods for user registration, authentication, and access token generation. It interacts with the 
database to manage user data and handle authentication processes.
"""

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import timedelta
from ..models.user import User
from ..schemas.user import UserCreate
from ..utils.security import verify_password, get_password_hash, create_access_token
from ..config import settings

class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def register_user(self, user_data: UserCreate) -> User:
        # Check if user already exists
        existing_user = self.db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Create new user
        hashed_password = get_password_hash(user_data.password)
        db_user = User(
            name=user_data.name,
            email=user_data.email,
            hashed_password=hashed_password,
            phone_number=user_data.phone_number,
            city=user_data.city,
            bio=user_data.bio
        )
        
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def authenticate_user(self, email: str, password: str) -> User:
        user = self.db.query(User).filter(User.email == email).first()
        if not user or not verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        return user

    def create_access_token_for_user(self, user: User) -> str:
        access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
        return create_access_token(
            subject=str(user.id), expires_delta=access_token_expires
        )