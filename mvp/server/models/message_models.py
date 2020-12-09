from pydantic import UUID4, Field
from datetime import datetime
from .mongo_base_model import MongoModel
import uuid

# Shared properties
class MessageBase(MongoModel):
    email: str = ""  # This is going to be json string

# Props to receive on message creation
class MessageCreate(MessageBase):
    id: UUID4 = Field(default_factory=uuid.uuid4)
    email: str


# Props to receive on message update
class MessageUpdate(MessageBase):
    pass


# Props to return to client
class Message(MessageBase):
    id: UUID4


# Props in the DB
class MessageInDB(MessageBase):
    id: UUID4
    email: str
