"""
Define API endpoints for the users resource. Most of it has been included by the fastapi_users helper package.
"""

from fastapi_users import FastAPIUsers
from fastapi import Request
from typing import Dict, Any

from backend.server.models.user_models import User, UserCreate, UserUpdate, UserDB
from backend.server.auth import auth_backends
from backend.server.database import user_db

fastapi_users = FastAPIUsers(
    user_db,
    auth_backends,
    User,
    UserCreate,
    UserUpdate,
    UserDB,
)

def on_after_register(user: UserDB, request: Request):
    print(f"User {user.id} has registered.")


def on_after_update(user: UserDB, updated_user_data: Dict[str, Any], request: Request):
    print(f"User {user.id} has been updated with the following data: {updated_user_data}")


auth_router = fastapi_users.get_auth_router(auth_backends[0])
register_router = fastapi_users.get_register_router(on_after_register)
users_router = fastapi_users.get_users_router(on_after_update)