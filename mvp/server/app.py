from fastapi import FastAPI, Depends
from .routes import student_routes, user_routes
from .models.user_models import User


app = FastAPI()

app.include_router(student_routes.router, tags=["student"], prefix="/student")

# Login router
app.include_router(user_routes.auth_router, tags=["auth"], prefix="/auth/jwt")

# Register router
app.include_router(user_routes.register_router, tags=["auth"], prefix="/auth")

# Users router
app.include_router(user_routes.users_router, tags=["users"], prefix="/users")


@app.get("/", tags=["index"])
async def index():
    return {"message": "Welcome to this fantastic app!"}


@app.get("/protected-route")
def protected_route(user: User = Depends(user_routes.fastapi_users.get_current_active_user)):
    return f"Hello, {user.email}"