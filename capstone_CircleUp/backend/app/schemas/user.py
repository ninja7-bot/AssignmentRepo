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
    id: int
    created_at: datetime
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class UserContactInfo(BaseModel):
    id: int
    name: str
    phone_number: str

    model_config = ConfigDict(from_attributes=True)