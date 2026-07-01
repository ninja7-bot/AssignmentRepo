"""
Simple Pydantic model for authentication requests and responses. This model is used to validate and serialize data for 
login requests and token responses.
"""

from pydantic import BaseModel, EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str