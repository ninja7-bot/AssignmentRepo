"""
BaseRepository provides a generic repository pattern implementation for CRUD operations on SQLAlchemy models.
It defines common methods for creating, retrieving, updating, and deleting records, as well as checking for existence and 
counting records based on filters. This class is designed to be extended by specific model repositories.
"""

from typing import TypeVar, Generic, Type, Optional, List, Dict, Any
from sqlalchemy.orm import Session
from abc import ABC

ModelType = TypeVar("ModelType")

class BaseRepository(ABC, Generic[ModelType]):
    """Base repository with common CRUD operations"""
    
    def __init__(self, db: Session, model: Type[ModelType]):
        self.db = db
        self.model = model

    def create(self, obj_data: Dict[str, Any]) -> ModelType:
        """Create a new record"""
        db_obj = self.model(**obj_data)
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def get_by_id(self, obj_id: int) -> Optional[ModelType]:
        """Get record by ID"""
        return self.db.get(self.model, obj_id)

    def get_all(self, skip: int = 0, limit: int = 100) -> List[ModelType]:
        """Get all records with pagination"""
        return self.db.query(self.model).offset(skip).limit(limit).all()

    def update(self, obj_id: int, update_data: Dict[str, Any]) -> Optional[ModelType]:
        """Update record by ID"""
        db_obj = self.get_by_id(obj_id)
        if db_obj:
            for field, value in update_data.items():
                setattr(db_obj, field, value)
            self.db.commit()
            self.db.refresh(db_obj)
        return db_obj

    def delete(self, obj_id: int) -> bool:
        """Delete record by ID"""
        db_obj = self.get_by_id(obj_id)
        if db_obj:
            self.db.delete(db_obj)
            self.db.commit()
            return True
        return False

    def exists(self, **filters) -> bool:
        """Check if record exists with given filters"""
        query = self.db.query(self.model)
        for field, value in filters.items():
            query = query.filter(getattr(self.model, field) == value)
        return query.first() is not None

    def count(self, **filters) -> int:
        """Count records with filters"""
        query = self.db.query(self.model)
        for field, value in filters.items():
            query = query.filter(getattr(self.model, field) == value)
        return query.count()