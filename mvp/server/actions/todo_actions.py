from bson.objectid import ObjectId
from mvp.server.database import jobs_collection, todos_collection
from mvp.server.models.job_models import JobInDB, JobCreate, JobUpdate
from mvp.server.models.todo_models import TodoInDB, TodoCreate, TodoUpdate
from typing import List

# Get all todos for a job
async def get_todos(job: JobInDB):
    todos = []
    for todo_id in job.todos:
        todo = await todos_collection.find_one({"_id": todo_id})
        todos.append(TodoInDB.from_mongo(todo))

    return todos


# find a todo
async def get_todo(id):
    todo = await todos_collection.find_one({"_id": id})
    return TodoInDB.from_mongo(todo)


# create a new todo
async def add_todo(todo: TodoCreate):
    # Create todo document
    new_todo = await todos_collection.insert_one(todo.mongo())
    created_todo = await todos_collection.find_one({"_id": new_todo.inserted_id})

    return TodoInDB.from_mongo(created_todo)


# Update existing todo
async def update_todo(id, todo: TodoUpdate):
    # Transform data
    update_data = todo.mongo(exclude_unset=True)
    
    await todos_collection.update_one(
        {"_id": id}, {"$set": update_data}
    )

    # Find updated document
    updated_todo = await todos_collection.find_one({"_id": id})
    return TodoInDB.from_mongo(updated_todo)


# Delete a job
async def delete_todo(id):
    result = await todos_collection.delete_one({"_id": id})
    return result.deleted_count == 1