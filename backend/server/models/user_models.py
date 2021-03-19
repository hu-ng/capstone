"""
Initialize Pydantic models for users. 
This helps FastAPI deal with data conversions.
The base class in this file is provided by fastapi-users.
"""

from fastapi_users import models


class User(models.BaseUser):
    pass


class UserCreate(models.BaseUserCreate):
    pass


class UserUpdate(User, models.BaseUserUpdate):
    pass


class UserDB(User, models.BaseUserDB):
    pass