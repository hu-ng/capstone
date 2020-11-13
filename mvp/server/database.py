"""
Makes a connection to the database
"""

import motor.motor_tornado
from mvp import settings
from server.models.user_models import UserDB
from fastapi_users.db import MongoDBUserDatabase

MONGO_DETAILS = settings.MONGO_DETAILS

client = motor.motor_tornado.MotorClient(MONGO_DETAILS)

database = client.app

# Student collection
student_collection = database.get_collection("students_collection")

# Users collection
user_collection = database.get_collection("users_collection")

# Bucket collection
bucket_collection = database.get_collection("buckets_collection")

# Connection collection
connection_collection = database.get_collection("connections_collection")

# MongoDB Database adapter
user_db = MongoDBUserDatabase(UserDB, user_collection)