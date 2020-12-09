"""
Provides helper functions to interact with the database
"""

from bson.objectid import ObjectId
from mvp.server.database import jobs_collection
from mvp.server.models.job_models import JobInDB, JobCreate, JobUpdate
from typing import List

import mvp.server.actions.todo_actions as todo_actions


# Get all jobs for this user
async def get_all(user_id):
    cursor = jobs_collection.find({
        "user_id": { "$eq": user_id}
    })
    found_jobs = []
    async for job in cursor:
        found_jobs.append(JobInDB.from_mongo(job))
    return found_jobs


# Get one job
async def get_one(id, user_id):
    found_job = await jobs_collection.find_one({"_id": id})
    if found_job and found_job["user_id"] == user_id:
        return JobInDB.from_mongo(found_job)
    else:
        return {}


# Create one job
async def create(data: JobCreate):
    new_job = await jobs_collection.insert_one(data.mongo())
    created_job = await jobs_collection.find_one({"_id": new_job.inserted_id})
    return JobInDB.from_mongo(created_job)


# Update a job
async def update(id, data: JobUpdate):
    update_data = data.mongo(exclude_unset=True)
    
    await jobs_collection.update_one(
        {"_id": id}, {"$set": update_data}
    )
    updated_job = await jobs_collection.find_one({"_id": id})
    return JobInDB.from_mongo(updated_job)
        

# Delete a job and all things with it
# Todos and Messages
async def delete(id):
    job = await jobs_collection.find_one({"_id": id})
    job = JobInDB.from_mongo(job)

    # Delete all todos
    for todo_id in job.todos:
        await todo_actions.delete(todo_id)

    # Delete the job
    result = await jobs_collection.delete_one({"_id": id})
    return result.deleted_count == 1