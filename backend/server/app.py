"""
This is the heart of the application. It exposes all the routes of the API via router objects.
"""

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from .routes import user_routes, job_routes, template_routes, tag_routes
from .database import client


# The primary FastAPI app object
app = FastAPI()

# Configure CORS policy so the front-end can communicate with it
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:3001"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# The app object can accept routers defined in other modules, which makes things a lot more modular

# Login router
app.include_router(user_routes.auth_router, tags=["auth"], prefix="/auth/jwt")

# Register router
app.include_router(user_routes.register_router, tags=["auth"], prefix="/auth")

# Users router
app.include_router(user_routes.users_router, tags=["users"], prefix="/users")

# Jobs router
app.include_router(job_routes.router, tags=["jobs"], prefix="/jobs")

# Template router
app.include_router(template_routes.router, tags=["templates"], prefix="/templates")

# Tags router
app.include_router(tag_routes.router, tags=["tags"], prefix="/tags")


@app.get("/", tags=["index"])
async def index():
    return {"message": "Welcome to the demo"}


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()