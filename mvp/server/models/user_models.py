"""
Initialize Pydantic models for users. This helps FastAPI do what it's supposed to do
"""

from fastapi_users import models
from typing import List
from pydantic import UUID4


class User(models.BaseUser):
    pass


class UserCreate(models.BaseUserCreate):
    pass


class UserUpdate(User, models.BaseUserUpdate):
    pass


class UserDB(User, models.BaseUserDB):
    pass