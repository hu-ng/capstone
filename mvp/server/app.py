from fastapi import FastAPI, Depends
from .routes import user_routes, connection_routes, bucket_routes
from .models.user_models import User


app = FastAPI()

# Login router
app.include_router(user_routes.auth_router, tags=["auth"], prefix="/auth/jwt")

# Register router
app.include_router(user_routes.register_router, tags=["auth"], prefix="/auth")

# Users router
app.include_router(user_routes.users_router, tags=["users"], prefix="/users")

# Connections router
app.include_router(connection_routes.router, tags=["connections"], prefix="/connections")

# Buckets router
app.include_router(bucket_routes.router, tags=["buckets"], prefix="/buckets")

@app.get("/", tags=["index"])
async def index():
    return {"message": "Welcome to this fantastic app!"}