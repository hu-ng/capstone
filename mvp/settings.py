"""
Load environment variables
"""

from dotenv import load_dotenv
import os

load_dotenv()

MONGO_DETAILS = os.getenv("MONGO_DETAILS")
JWT_SECRET = os.getenv("JWT_SECRET")

