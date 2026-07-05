"""
UserService class provides methods for user management, including retrieving and updating user information. It interacts with the 
database to perform CRUD operations on user data.
"""

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from ..repository.user_repository import UserRepository
from ..schemas.user import UserUpdate

class UserService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)

    def get_user_by_id(self, user_id: int):
        """Get user by ID"""
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return user

    def get_user_by_email(self, email: str):
        """Get user by email"""
        user = self.user_repo.get_by_email(email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return user

    def update_user(self, user_id: int, user_update: UserUpdate):
        """Update user profile"""
        try:
            updated_user = self.user_repo.update_user(user_id, user_update)
            
            if not updated_user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )
            
            return updated_user
            
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
    
    def delete_user(self, user_id: int):
        """Delete user account"""
        success = self.user_repo.delete_user(user_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

    def search_users(self, query: str, limit: int = 10):
        """Search users by name or email"""
        return self.user_repo.search_users(query, limit)