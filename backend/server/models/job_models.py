"""
Initialize Pydantic models for connections. This helps FastAPI do what it's supposed to do
"""

from pydantic import UUID4, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum
from .mongo_base_model import MongoModel
import uuid

class Status(str, Enum):
    rejected = -1
    added = 0
    applied = 1
    interviewing = 2
    offer = 3


# Shared properties
class JobBase(MongoModel):
    title: str = None
    description: str = None
    company: str = None
    url: str = None
    added_date: datetime = datetime.utcnow()
    posted_date: datetime = None
    status: Status = Status.added


# Props when creating
class JobCreate(JobBase):
    id: UUID4 = Field(default_factory=uuid.uuid4)
    title: str
    description: str = None
    company: str
    url: str = None
    added_date: datetime = datetime.utcnow()
    posted_date: datetime = None  # TODO: Error might be here
    status: Status = Status.added
    todos: List[UUID4] = []
    messages: List[UUID4] = []
    user_id: UUID4 = None


# Props to receive when updating
class JobUpdate(JobBase):
    todos: List[UUID4] = []
    messages: List[UUID4] = []


# Props returned to client
class Job(JobBase):
    id: UUID4
    todos: List[UUID4] = []
    messages: List[UUID4] = []
    user_id: UUID4


# Props in DB
class JobInDB(JobBase):
    id: UUID4
    todos: List[UUID4] = []
    messages: List[UUID4] = []
    user_id: UUID4