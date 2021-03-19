"""
Initialize Pydantic models for to-dos. 
This helps FastAPI deal with data conversions.
"""

from pydantic import UUID4, Field, validator
from typing import Any
from datetime import datetime, timezone
from .mongo_base_model import MongoModel
import uuid

# Shared properties
class TodoBase(MongoModel):
    title: str = ""
    done: bool = 0
    due_date: datetime = Field(default_factory=datetime.utcnow)

# Props when creating
class TodoCreate(TodoBase):
    id: UUID4 = Field(default_factory=uuid.uuid4)
    title: str

    # The due date must be today or later
    @validator("due_date")
    def validate_due_date(cls, value: Any) -> Any:
        # Compare with a timezone-aware datetime object
        if value.date() < datetime.now(tz=timezone.utc).date():
            raise ValueError("Due date must be today or later")
        return value


# Props when updating
class TodoUpdate(TodoBase):

    # The due date must be today or later
    @validator("due_date")
    def validate_due_date(cls, value: Any) -> Any:
        # Compare with a timezone-aware datetime object
        if value.date() < datetime.now(tz=timezone.utc).date():
            raise ValueError("Due date must be today or later")
        return value


# Props to return to client
class Todo(TodoBase):
    id: UUID4


# Props stored in DB
class TodoInDB(TodoBase):
    id: UUID4
    title: str
    done: bool
    due_date: datetime