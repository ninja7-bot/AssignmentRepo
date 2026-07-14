"""
UserRepository provides database operations for the User model, including CRUD operations and additional methods 
for user-specific queries and validations.
"""

from typing import Optional, List, Any
from sqlalchemy.orm import Session
from sqlalchemy import or_
from ..models.user import User
from .base import BaseRepository
from ..schemas.user import UserCreate, UserUpdate

class UserRepository(BaseRepository[User]):
    """Repository for User model operations"""
    
    def __init__(self, db: Session):
        super().__init__(db, User)

    def get_by_email(self, email: str) -> Optional[User]:
        """Get user by email address"""
        return self.db.query(User).filter(User.email == email).first()

    def email_exists(self, email: str, exclude_user_id: Optional[int] = None) -> bool:
        """Check if email exists (optionally excluding a specific user)"""
        query = self.db.query(User).filter(User.email == email)
        if exclude_user_id is not None:
            query = query.filter(User.id != exclude_user_id)
        return query.first() is not None
    
    def phone_exists(self, phone_number: str, exclude_user_id: int | None = None) -> bool:
        """Check if a phone number exists."""
        query = self.db.query(User).filter(
            User.phone_number == phone_number
        )

        if exclude_user_id is not None:
            query = query.filter(User.id != exclude_user_id)

        return query.first() is not None

    def create_user(self, user_data: dict[str, Any]) -> User:
        """Create a new user with validation"""
        if self.email_exists(user_data["email"]):
            raise ValueError("Email already registered")
        
        if self.phone_exists(user_data["phone_number"]):
            raise ValueError("Phone number already registered")
        
        return self.create(user_data)

    def update_user(self, user_id: int, update_data: UserUpdate) -> Optional[User]:
        """Update user with email uniqueness validation"""
        user = self.get_by_id(user_id)
        if not user:
            return None

        if update_data.email and update_data.email != user.email:
            if self.email_exists(update_data.email, exclude_user_id=user_id):
                raise ValueError("Email already registered")
        if update_data.phone_number and update_data.phone_number != user.phone_number:
            if self.phone_exists(update_data.phone_number, exclude_user_id=user_id):
                raise ValueError("Phone Number already registered")

        return self.update(user_id, update_data.model_dump(exclude_unset=True))

    def delete_user(self, user_id: int) -> bool:
        """Delete user and handle related data"""
        user = self.get_by_id(user_id)
        if not user:
            return False
        
        return self.delete(user_id)