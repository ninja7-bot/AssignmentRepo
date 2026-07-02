"""
Simple Pydantic models for user-related data validation and serialization. This model defines the structure and validation rules 
for user creation, updating, and response data. Ensuring that user input adheres to specified formats and constraints, such as
email format, phone number pattern, and password complexity.
"""


from datetime import datetime
import re

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    field_validator,
)


class UserBase(BaseModel):
    """Base Pydantic model for user data. This model includes common fields for user information, 
        such as name, email, phone number,"""
    name: str = Field(
        ...,
        min_length=3,
        max_length=100,
        description="Full name of the user",
    )

    email: EmailStr

    phone_number: str = Field(
        ...,
        pattern=r"^[6-9]\d{9}$",
        description="10-digit Indian mobile number",
    )

    city: str | None = Field(
        default=None,
        max_length=100,
        description="City of residence",
    )

    bio: str | None = Field(
        default=None,
        max_length=500,
        description="Short user biography",
    )

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        value = value.strip()

        if not re.fullmatch(r"[A-Za-z]+(?:[ '-][A-Za-z]+)*", value):
            raise ValueError(
                "Name may contain only letters, spaces, hyphens, and apostrophes."
            )

        return value

    @field_validator("city")
    @classmethod
    def validate_city(cls, value: str | None) -> str | None:
        if value is None:
            return value

        value = value.strip()

        if value and not re.fullmatch(r"[A-Za-z .'-]+", value):
            raise ValueError("City contains invalid characters.")

        return value

    @field_validator("bio")
    @classmethod
    def validate_bio(cls, value: str | None) -> str | None:
        if value is None:
            return value

        return value.strip()


class UserCreate(UserBase):
    """Pydantic model for user creation. This model extends UserBase and adds a password field with validation rules to ensure
    that the password meets security requirements. It is used for validating user input during registration."""
    password: str = Field(
        ...,
        min_length=8,
        max_length=128,
        description="User password",
    )

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if " " in value:
            raise ValueError("Password must not contain spaces.")

        if not re.search(r"[A-Z]", value):
            raise ValueError(
                "Password must contain at least one uppercase letter."
            )

        if not re.search(r"[a-z]", value):
            raise ValueError(
                "Password must contain at least one lowercase letter."
            )

        if not re.search(r"\d", value):
            raise ValueError(
                "Password must contain at least one digit."
            )

        if not re.search(r"[!@#$%^&*(),.?\":{}|<>_\-+=/\\[\]`~;']", value):
            raise ValueError(
                "Password must contain at least one special character."
            )

        return value


class UserUpdate(BaseModel):
    """Pydantic model for updating user information. This model allows partial updates to user fields, with validation rules
    similar to those in UserCreate. Fields are optional, and only provided fields will be updated"""
    name: str | None = Field(
        default=None,
        min_length=3,
        max_length=100,
    )

    email: EmailStr | None = None

    phone_number: str | None = Field(
        default=None,
        pattern=r"^[6-9]\d{9}$",
    )

    city: str | None = Field(
        default=None,
        max_length=100,
    )

    bio: str | None = Field(
        default=None,
        max_length=500,
    )

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str | None) -> str | None:
        if value is None:
            return value

        value = value.strip()

        if not re.fullmatch(r"[A-Za-z]+(?:[ '-][A-Za-z]+)*", value):
            raise ValueError(
                "Name may contain only letters, spaces, hyphens, and apostrophes."
            )

        return value

    @field_validator("city")
    @classmethod
    def validate_city(cls, value: str | None) -> str | None:
        if value is None:
            return value

        value = value.strip()

        if value and not re.fullmatch(r"[A-Za-z .'-]+", value):
            raise ValueError("City contains invalid characters.")

        return value

    @field_validator("bio")
    @classmethod
    def validate_bio(cls, value: str | None) -> str | None:
        if value is None:
            return value

        return value.strip()


class UserResponse(UserBase):
    """Response model for user data, including ID and timestamps. This model is used to serialize user data 
    for API responses, ensuring that sensitive information like passwords is not exposed."""
    id: int
    created_at: datetime
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class UserContactInfo(BaseModel):
    """Limited user contact information when sharing contact info with other users"""
    id: int
    name: str
    phone_number: str
    email: EmailStr

    model_config = ConfigDict(from_attributes=True)

class UserProfile(BaseModel):
    """Limited user profile for public viewing"""
    id: int
    name: str
    city: str | None
    bio: str | None

    model_config = ConfigDict(from_attributes=True)