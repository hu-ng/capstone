"""
Makes a connection to the database on the cloud, and initialize the variables that we need
"""

import motor.motor_asyncio
from mvp import settings
from .models.user_models import UserDB
from fastapi_users.db import MongoDBUserDatabase

MONGO_DETAILS = settings.MONGO_DETAILS

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)

database = client.app

# Users collection
user_collection = database.get_collection("users_collection")

# Bucket collection
bucket_collection = database.get_collection("buckets_collection")

# Connection collection
connection_collection = database.get_collection("connections_collection")

# MongoDB Database adapter
user_db = MongoDBUserDatabase(UserDB, user_collection)