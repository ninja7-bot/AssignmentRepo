"""
Security utility responsible for functions related to authentication like creating token, verifying password, getting password_hash and stuff.
"""

from datetime import datetime, timezone, timedelta
from typing import Any
from jose import jwt
from jose.exceptions import JWTError
from passlib.context import CryptContext
from ..config import settings

KEY = settings.secret_key
ALGO = settings.algorithm
ACCESS_TOKEN_EXPIRE_MINUTES = settings.access_token_expire_minutes

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)

def create_access_token(subject: str, expires_delta: timedelta | None = None) -> str:
    """ Creates the access token from user information and the current time + 30 minutes. """
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )
    
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, KEY, algorithm=ALGO)
    return encoded_jwt
    
def verify_password(password: str, hashed_pass: str) -> bool:
    """ Verify passsword against the hash. """
    return pwd_context.verify(password, hashed_pass)

def get_password_hash(password: str) -> str:
    """ Hash password using CryptContext. """
    return pwd_context.hash(password)

def verify_token(token: str) -> str | None:
    try:
        payload = jwt.decode(
            token, KEY, algorithms=[ALGO]
        )
        return payload.get("sub")
    except JWTError:
        return None