from pydantic import UUID4, Field
from datetime import datetime
from typing import Optional
from .mongo_base_model import MongoModel
import uuid

# Shared properties
class TodoBase(MongoModel):
    title: str = ""
    done: bool = 0
    due_date: datetime = datetime.utcnow().isoformat()


# Props when creating
class TodoCreate(TodoBase):
    id: UUID4 = Field(default_factory=uuid.uuid4)
    title: str


# Props when updating
class TodoUpdate(TodoBase):
    pass


# Props to return to client
class Todo(TodoBase):
    id: UUID4


# Props stored in DB
class TodoInDB(TodoBase):
    id: UUID4
    title: str
    done: bool
    due_date: datetime