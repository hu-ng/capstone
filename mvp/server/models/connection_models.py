"""
Initialize Pydantic models for connections. This helps FastAPI do what it's supposed to do
"""

from pydantic import BaseModel, UUID4
from typing import Optional


class Connection(BaseModel):
    name: str
    description: str
    user_id: Optional[UUID4] = ""
    bucket_id: Optional[str] = ""


class ConnectionIn(Connection):
    pass


class ConnectionOut(Connection):
    id: str


class ConnectionUpdate(BaseModel):
    name: Optional[str]
    description: Optional[str]
    bucket_id: Optional[str]