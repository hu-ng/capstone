"""
Extracts the logic needed to craft a notification email.
"""

from fastapi_mail import ConnectionConfig
from backend.server.actions import job_actions, todo_actions
from datetime import datetime, timedelta
from jinja2 import Environment, FileSystemLoader
import os

# Move this to env file
email_config = ConnectionConfig(
    MAIL_USERNAME = "jobful.notification@gmail.com",
    MAIL_PASSWORD = "somethingcool123HOT",
    MAIL_FROM = "jobful.notification@gmail.com",
    MAIL_PORT = 587,
    MAIL_SERVER = "smtp.gmail.com",
    MAIL_FROM_NAME="Jobful App",
    MAIL_TLS = True,
    MAIL_SSL = False,
)

# Receives a user object, returns a template to be sent
async def build_template(user):
    # Get data from DB
    incomplete_todos = []
    jobs = await job_actions.get_all_with_status(user.id, "0")  # "0" is all "Added" jobs
    
    for job in jobs:
        todos = await todo_actions.get_all(job, done=0) # Get all unfinished task
        incomplete_todos.extend(todos)

    # Pre-process todos
    todo_render_data = []
    for todo in incomplete_todos:
        data = todo.mongo()
        days_delta = (data["due_date"] - datetime.utcnow()).days
        data["days_delta"] = max(days_delta, 0)
        todo_render_data.append(data)

    # Pre-process jobs
    jobs_to_focus = []  # jobs users should focus on
    stale_jobs = []     # Jobs that are stale
    optimal_window = 4  # Window to apply for a job based on posted date
    for job in jobs:
        data = job.mongo()
        current_time = datetime.utcnow()
        posted_date = job.posted_date
        tentative_deadline = posted_date + timedelta(days=optimal_window)
        
        # If within window
        if posted_date <= current_time <= tentative_deadline:
            data["apply_in"] = (tentative_deadline - current_time).days
            jobs_to_focus.append(data)
        
        # If not
        elif current_time > tentative_deadline:
            stale_jobs.append(data)

    # Load the email template
    path=os.path.join(os.path.dirname(__file__),'./templates')
    templateLoader = FileSystemLoader(path)
    templateEnv = Environment(loader=templateLoader)
    template = templateEnv.get_template("email.html")

    # Render the template using preprocessed variables
    to_send = template.render(todos=todo_render_data, stale_jobs=stale_jobs, jobs_to_focus=jobs_to_focus)
    return to_send