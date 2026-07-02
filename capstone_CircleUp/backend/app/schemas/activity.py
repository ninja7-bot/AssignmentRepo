from pydantic import BaseModel, ConfigDict, Field, field_validator
from typing import Optional, List
from datetime import datetime, timezone
from ..enums import ActivityStatus, ActivityCategory
import re

class ActivityBase(BaseModel):
    """Base Pydantic model for activity data. This model includes common fields for activity information, 
        such as title, description, category, location, date, and maximum participants."""
    title: str = Field(
        ...,
        min_length=3,
        max_length=200,
        description="Title of the activity",
    )

    description: str = Field(
        ...,
        min_length=10,
        max_length=500,
        description="Detailed description of the activity",
    )

    category: ActivityCategory = Field(
        ...,
        description="Category of the activity",
    )

    location: str = Field(
        ...,
        description="Location of the activity",
    )

    activity_date: datetime = Field(
        ...,
        description="Date and time of the activity",
    )

    max_participants: int = Field(
        ...,
        gt=0,
        description="Maximum number of participants for the activity",
    )

class ActivityCreate(ActivityBase):
    """Pydantic model for creating a new activity. This model inherits from ActivityBase and is used to validate
    the data provided when creating a new activity."""
    @field_validator('title')
    @classmethod
    def validate_title(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError('Title cannot be empty or whitespace')
        
        regex = r"^[A-Za-z0-9\s.,!?'-]+$"
        if not re.fullmatch(regex, value):
            raise ValueError('Title contains invalid characters')
        
        return value
    
    @field_validator('description')
    @classmethod
    def validate_description(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError('Description cannot be empty or whitespace')
        
        return value

    @field_validator('activity_date')
    @classmethod
    def validate_future_date(cls, date: datetime) -> datetime:
        if date <= datetime.now(timezone.utc):
            raise ValueError('Activity must be scheduled for a future date')
        return date

class ActivityUpdate(BaseModel):
    """Pydantic model for updating an existing activity. This model allows partial updates and includes optional fields
    for activity information. Validation rules are similar to those in ActivityCreate."""
    title: str | None = Field(
        default=None,
        min_length=3,
        max_length=200,
    )
    description: str | None = Field(
        default=None,
        min_length=10,
        max_length=500,
    )
    category: ActivityCategory | None = Field(default=None)
    location: str | None = Field(default=None)
    activity_date: datetime | None = Field(default=None)
    max_participants: int | None = Field(default=None, gt=0)

    @field_validator('activity_date')
    @classmethod
    def validate_future_date(cls, date: datetime) -> datetime:
        if date is not None and date <= datetime.now(timezone.utc):
            raise ValueError('Activity must be scheduled for a future date')
        return date

class ActivityResponse(ActivityBase):
    """Pydantic model for activity response. This model is used to serialize activity data in API responses, including
    additional fields such as activity ID, status, creator information, current participants, and timestamps."""
    id: int
    status: ActivityStatus
    creator_id: int
    creator_name: str
    current_participants: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class ActivityDetail(ActivityResponse):
    """Pydantic model for detailed activity information. This model extends ActivityResponse and includes additional fields
    for creator contact information, participants, and pending requests."""
    creator_contact: Optional[dict] = None
    participants: Optional[List[dict]] = None
    pending_requests: Optional[List[dict]] = None

class ActivityFilter(BaseModel):
    """Pydantic model for filtering activities. This model is used to validate the query parameters for activity filtering."""
    category: ActivityCategory | None = None
    location: str | None = None
    date_from: datetime | None = None
    date_to: datetime | None = None
    status: ActivityStatus | None = None
    sort_by: str | None = "activity_date"
    sort_order: str | None = "asc"