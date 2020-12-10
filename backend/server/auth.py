"""
Setting up log-in methods
"""

from fastapi_users.authentication import JWTAuthentication

SECRET = "SECRET"

auth_backends = []

jwt_authentication = JWTAuthentication(secret=SECRET, lifetime_seconds=3600)

auth_backends.append(jwt_authentication)