from pydantic import BaseModel, ConfigDict
from datetime import datetime
from ..enums.participation import ParticipationStatus

class ParticipationRequestCreate(BaseModel):
    activity_id: int

class ParticipationRequestResponse(BaseModel):
    id: int
    user_id: int
    activity_id: int
    status: ParticipationStatus
    requested_at: datetime
    updated_at: datetime | None = None
    model_config = ConfigDict(from_attributes=True)

class ParticipationRequestDetail(ParticipationRequestResponse):
    user_name: str | None = None
    activity_title: str | None = None