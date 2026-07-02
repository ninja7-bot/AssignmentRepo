"""
Simple Pydantic model for authentication requests and responses. This model is used to validate and serialize data for 
login requests and token responses.
"""

from pydantic import BaseModel, EmailStr

class Token(BaseModel):
    """Response model for access token. This model is used to serialize the access token and its type in API responses."""
    access_token: str
    token_type: str

class LoginRequest(BaseModel):
    """Request model for user login. This model is used to validate the email and password provided by the user during login."""
    email: EmailStr
    password: str