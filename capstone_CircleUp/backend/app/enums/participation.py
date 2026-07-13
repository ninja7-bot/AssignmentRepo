"""
Participation Status Enum file created to handle the status of the participation request created by a user.
"""

import enum

class ParticipationStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    CANCELLED = "cancelled"