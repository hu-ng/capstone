"""
Defines all actions that authenticated users can take with jobs
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import Response
from typing import List, Optional
from pydantic import UUID4

import mvp.server.actions.jobs_actions as jobs_actions
import mvp.server.actions.todo_actions as todo_actions


from mvp.server.models.job_models import Job, JobCreate, JobUpdate
from mvp.server.models.todo_models import Todo, TodoCreate, TodoUpdate
from mvp.server.models.user_models import User
from .user_routes import fastapi_users


router = APIRouter()

# Get all connections for this user
@router.get("/", response_description="Return all jobs for this user", response_model=List[Optional[Job]])
async def get_all_jobs(user: User = Depends(fastapi_users.get_current_active_user)):
    jobs = await jobs_actions.get_all_jobs(user.id)
    return jobs


# Get a single job for this user --> The id type here might be wrong
@router.get("/{id}", response_description="Return one job based on id", response_model=Job)
async def get_job(id: UUID4, user: User = Depends(fastapi_users.get_current_active_user)):
    job = await jobs_actions.get_job(id, user.id)
    if job:
        return job
    raise HTTPException(status_code=404, detail=f"Job {id} not found")


# Create a new job for this user
@router.post("/", response_description="Create and return a new job", response_model=Job)
async def create_job(job: JobCreate, user: User = Depends(fastapi_users.get_current_active_user)):
    # Add the current user in the input data, and convert to JobCreate model
    data = job.dict()
    data["user_id"] = user.id
    data = JobCreate(**data)
    new_job = await jobs_actions.create_job(data)
    return new_job


# Update a connection for this user
@router.put("/{id}", response_description="Return the job that was changed", response_model=Job)
async def update_job(id: UUID4, data: JobUpdate, user: User = Depends(fastapi_users.get_current_active_user)):
    job = await jobs_actions.get_job(id, user.id)

    if job:
        updated_job = await jobs_actions.update_job(id, data)
        return updated_job
    
    raise HTTPException(status_code=404, detail=f"Job {id} not found, can't update job")


# Delete the connection for this user
@router.delete("/{id}", response_description="Delete a job", status_code=status.HTTP_204_NO_CONTENT)
async def delete_job(id: UUID4, user: User = Depends(fastapi_users.get_current_active_user)):
    job = await jobs_actions.get_job(id, user.id)

    if job:
        result = await jobs_actions.delete_job(id)
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    
    raise HTTPException(status_code=404, detail=f"Job {id} not found, can't delete job")



# ----- Routes for todos ---------
@router.get("/{job_id}/todos/", response_description="Get all todos for the job", response_model=List[Optional[Todo]])
async def get_todos(job_id: UUID4, user: User = Depends(fastapi_users.get_current_active_user)):
    # Get the job object
    job = await jobs_actions.get_job(job_id, user.id)

    if not job:
        raise HTTPException(status_code=404, detail=f"Job {job_id} not found")

    # Get all todos for a job
    todos = await todo_actions.get_todos(job)

    return todos


@router.get("/{job_id}/todos/{todo_id}", response_description="Get a todo for a job", response_model=Todo)
async def get_todo(job_id: UUID4, todo_id: UUID4, user: User = Depends(fastapi_users.get_current_active_user)):
    # Get the job object
    job = await jobs_actions.get_job(job_id, user.id)

    if not job:
        raise HTTPException(status_code=404, detail=f"Job {job_id} not found")
    
    # If todo id in job, grab todo
    if todo_id in job.mongo()["todos"]:
        todo = await todo_actions.get_todo(todo_id)
        return todo
    
    else:
        return HTTPException(status_code=404, detail=f"Todo {todo_id} not found")


@router.post("/{job_id}/todos/", response_description="Add a todo for this job")
async def create_todo(job_id: UUID4, todo: TodoCreate, user: User = Depends(fastapi_users.get_current_active_user)):
    # Get the job object
    job = await jobs_actions.get_job(job_id, user.id)

    if job:
        # Get a new todo
        new_todo = await todo_actions.add_todo(todo)

        # Add todo to the job, and update the job
        new_job_data = job.mongo()
        new_job_data["todos"].append(new_todo.id)

        new_job = await jobs_actions.update_job(job_id, JobUpdate(**new_job_data))

        # return the job
        return new_job

    raise HTTPException(status_code=404, detail=f"Job {job_id} not found, can't add todo")


@router.put("/{job_id}/todos/{todo_id}", response_description="Update a todo for this job")
async def update_todo(job_id: UUID4, todo_id: UUID4, todo: TodoUpdate, user: User = Depends(fastapi_users.get_current_active_user)):
    # Get the job object
    job = await jobs_actions.get_job(job_id, user.id)

    # If job exists and todo belongs to job
    if job and todo_id in job.mongo()["todos"]:
        updated_todo = await todo_actions.update_todo(todo_id, todo)
        return {'job': job, 'todo': updated_todo}

    raise HTTPException(status_code=404, detail=f"Job {job_id} not found, can't update todo")


@router.delete("/{job_id}/todos/{todo_id}", response_description="Delete this todo", status_code=status.HTTP_204_NO_CONTENT)
async def delete_todo(job_id: UUID4, todo_id: UUID4, user: User = Depends(fastapi_users.get_current_active_user)):
    # Get the job object
    job = await jobs_actions.get_job(job_id, user.id)


    # If job exist, delete the todo
    if job and todo_id in job.mongo()["todos"]:

        # Delete todo
        result = await todo_actions.delete_todo(todo_id)

        # If deleted
        if result:
            # Remove reference from jobs
            new_job_data = job.mongo()
            new_job_data["todos"].remove(todo_id)
            await jobs_actions.update_job(job_id, JobUpdate(**new_job_data))         

            return Response(status_code=status.HTTP_204_NO_CONTENT)
        # If not, return error
        else:
            raise HTTPException(status_code=404, detail=f"Todo {todo_id} not found")
    
    # If job not found, return error
    else:
        raise HTTPException(status_code=404, detail=f"Job {job_id} not found, can't delete job")

    