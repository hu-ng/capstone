"""
Load environment variables
"""

from dotenv import load_dotenv
import os

# This function loads env from the .env file
load_dotenv()

MONGO_MAIN = os.getenv("MONGO_MAIN")  # Main connection URL, this points to a live Mongo Atlas cluster
MONGO_TEST = os.getenv("MONGO_TEST")  # This points to a local MongoDB db
JWT_SECRET = os.getenv("JWT_SECRET")  # Predefined JWT secret for the Auth system
ENV = os.getenv("ENV")

