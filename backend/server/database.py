"""
Makes a connection to the database on the cloud, and initialize the collections that we need
"""

import motor.motor_asyncio
from backend import settings
from .models.user_models import UserDB
from fastapi_users.db import MongoDBUserDatabase

# Grab the connection URL from settings.py
MONGO_URL = settings.MONGO_MAIN if settings.ENV == "prod" else settings.MONGO_TEST

def init_motor_client():
    return motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL, uuidRepresentation="standard")

# Open a Mongo instance with the URL
client = init_motor_client()

# Get the database instance
database = client.app

if settings.ENV == "test":
    database = client.test_app

# Users collection
user_collection = database.get_collection("users_collection")

# Jobs collection
jobs_collection = database.get_collection("jobs_collection")

# Todos collection
todos_collection = database.get_collection("todos_collection")

# Templates collection
templates_collection = database.get_collection("templates_collection")

# Message collection
message_collection = database.get_collection("messages_collection")

# Tags collection
tags_collection = database.get_collection("tags_collection")

# MongoDB Database adapter
user_db = MongoDBUserDatabase(UserDB, user_collection)