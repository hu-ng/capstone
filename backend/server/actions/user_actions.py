"""
Helper database actions involving users
"""

from backend.server.database import user_collection
from backend.server.models.user_models import User

# Get all users of the app, returns a list of Pydantic User models
async def get_all():
    cursor = user_collection.find({})
    users = []
    async for user in cursor:
        users.append(User(**user))
    return users