from pydantic import UUID4
from datetime import datetime
from typing import Optional, Dict
from bson import ObjectId
from .mongo_base_model import MongoModel

# Shared properties
class MessageBase(MongoModel):
    keywords: Dict[str, str] = {}
    email: str = ""
    template_id: str = ""

# Props to receive on message creation
class MessageCreate(MessageBase):
    keywords: Dict
    email: str


# Props to receive on message update
class MessageUpdate(MessageBase):
    pass


# Props to return to client
class Message(MessageBase):
    id: str


# Props in the DB
class MessageInDB(MessageBase):
    id: UUID4
    keywords: Dict
    email: str
    template_id: UUID4
