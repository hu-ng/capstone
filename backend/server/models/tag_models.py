"""
Initialize Pydantic models for tags. 
This helps FastAPI deal with data conversions.
"""

from pydantic import UUID4, Field
from datetime import datetime
from .mongo_base_model import MongoModel
import uuid


# Shared properties
class TagBase(MongoModel):
    name: str = None
    added_date: datetime = Field(default_factory=datetime.utcnow)


# Props to receive when creating
class TagCreate(TagBase):
    id: UUID4 = Field(default_factory=uuid.uuid4)
    name: str
    user_id: UUID4 = None


# Props to return to client
class Tag(TagBase):
    id: UUID4
    user_id: UUID4


# Props to store in DB
class TagInDB(TagBase):
    id: UUID4
    name: str
    user_id: UUID4