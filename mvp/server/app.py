"""
This is the heart of the application. It exposes all the routes of the API
"""

from fastapi import FastAPI, Depends
from .routes import user_routes, job_routes
from .models.user_models import User
from .database import client


app = FastAPI()

# Login router
app.include_router(user_routes.auth_router, tags=["auth"], prefix="/auth/jwt")

# Register router
app.include_router(user_routes.register_router, tags=["auth"], prefix="/auth")

# Users router
app.include_router(user_routes.users_router, tags=["users"], prefix="/users")

# Jobs router
app.include_router(job_routes.router, tags=["jobs"], prefix="/jobs")


@app.get("/", tags=["index"])
async def index():
    return {"message": "Welcome to the demo"}

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()