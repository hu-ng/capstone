"""
Makes a connection to the database on the cloud, and initialize the variables that we need
"""

import motor.motor_asyncio
from mvp import settings
from .models.user_models import UserDB
from fastapi_users.db import MongoDBUserDatabase

MONGO_DETAILS = settings.MONGO_DETAILS

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS, uuidRepresentation="standard")

database = client.app

# Users collection
user_collection = database.get_collection("users_collection")

# Jobs collection
jobs_collection = database.get_collection("jobs_collection")

# Todos collection
todos_collection = database.get_collection("todos_collection")

# MongoDB Database adapter
user_db = MongoDBUserDatabase(UserDB, user_collection)