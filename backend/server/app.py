"""
This is the heart of the application. It exposes all the routes of the API via router objects.
"""

from fastapi import FastAPI
from fastapi_utils.tasks import repeat_every
from fastapi.middleware.cors import CORSMiddleware
from fastapi_mail import FastMail, MessageSchema
import logging

from backend.server.actions import user_actions
from .email_helpers import build_template, email_config
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


# This is a toy endpoint. Nothing useful is returned here
@app.get("/", tags=["index"])
async def index():
    return {"message": "Welcome to Jobful"}


# On app shutdown, close the database client
@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


# ------------ Repeated tasks --------------
"""
Defines the emailling task that should run on a loop.
Basic implementation, works for now, but scalability is an issue, would need an event driven solution.
"""

conf = email_config
logger = logging.getLogger(__name__)

@app.on_event("startup")
@repeat_every(seconds=(60*60*24), logger=logger, wait_first=True)  #  This task runs every 24 hours
async def send_mail():
    """
    Send users notifications on their action items everyday.
    """
    # Get all users
    users = await user_actions.get_all()
    
    # For each user, build a template
    for user in users:
        template = await build_template(user)

        # Message to send
        message = MessageSchema(
            subject="Your job search action items!",
            recipients=[user.email],
            body=template,
            subtype="html"
        )

        # Create the email client and send the message!
        fm = FastMail(conf)
        await fm.send_message(message)
        print(message)