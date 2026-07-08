import enum

class ActivityStatus(str, enum.Enum):
    OPEN = "open"
    FULL = "full"
    CANCELLED = "cancelled"
    COMPLETED = "completed"

class ActivityCategory(str, enum.Enum):
    SPORTS = "sports"
    SOCIAL = "social"
    EDUCATION = "education"
    ENTERTAINMENT = "entertainment"
    TRAVEL = "travel"
    OTHER = "other"