"""
Setting up log-in methods
"""

from fastapi_users.authentication import JWTAuthentication
from backend.settings import JWT_SECRET

SECRET = JWT_SECRET

# In the future, if we want to add another auth system for some reason, we would add it here
auth_backends = []

# Generate JWT auth object
jwt_authentication = JWTAuthentication(secret=SECRET, lifetime_seconds=3600)

auth_backends.append(jwt_authentication)