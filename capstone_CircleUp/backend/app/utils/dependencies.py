"""
Dependencies module for FastAPI application. This module provides utility functions to handle authentication and 
user retrieval based on Bearer tokens. It includes a dependency function `get_current_user` that resolves the authenticated user 
from the provided token, raising an HTTP 401 Unauthorized error if the token is invalid or the user does not exist.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User
from ..utils.security import verify_token

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    """ Resolve the authenticated user from the Bearer token. Raises 401 if the token is invalid or the user does not exist. """
    sub = verify_token(credentials.credentials)
    
    if sub is None:
        raise credentials_exception
    try:
        user_id = int(sub)
    except ValueError:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user