from pydantic import UUID4, Field
from datetime import datetime
from typing import Optional, List
from .mongo_base_model import MongoModel
import uuid

# Shared properties
class TemplateBase(MongoModel):
    keys: List[str] = []
    base: str = None


# Props to receive on message creation
class TemplateCreate(TemplateBase):
    id: UUID4 = Field(default_factory=uuid.uuid4)
    keys: List[str]
    base: str
    created_at: datetime = Field(default_factory=datetime.utcnow().isoformat)
    user_id: UUID4 = None


# Props to receive on message update
class TemplateUpdate(TemplateBase):
    pass


# Props to return to client
class Template(TemplateBase):
    id: UUID4
    created_at: datetime
    user_id: UUID4


# Props in the DB
class TemplateInDB(TemplateBase):
    id: UUID4
    keys: List[str]
    base: str
    created_at: datetime
    user_id: UUID4
