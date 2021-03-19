from backend.server.database import todos_collection
from backend.server.models.job_models import JobInDB
from backend.server.models.todo_models import TodoInDB, TodoCreate, TodoUpdate

# Get all todos for a job
async def get_all(job: JobInDB, done=None):
    """
    If done is set to either 0 or 1, filter by that as well
    """
    todos = []
    for todo_id in job.todos:
        todo = await todos_collection.find_one({"_id": todo_id})
        if done is not None:
            if todo["done"] == done:
                todos.append(TodoInDB.from_mongo(todo))
    return todos


# find a todo
async def get_one(todo_id):
    todo = await todos_collection.find_one({"_id": todo_id})
    return TodoInDB.from_mongo(todo)


# create a new todo
async def create(todo: TodoCreate):
    # Create todo document
    new_todo = await todos_collection.insert_one(todo.mongo())
    created_todo = await todos_collection.find_one({"_id": new_todo.inserted_id})

    return TodoInDB.from_mongo(created_todo)


# Update existing todo
async def update(todo_id, todo: TodoUpdate):
    # Transform data
    update_data = todo.mongo(exclude_unset=True)
    
    await todos_collection.update_one(
        {"_id": todo_id}, {"$set": update_data}
    )

    # Find updated document
    updated_todo = await todos_collection.find_one({"_id": todo_id})
    return TodoInDB.from_mongo(updated_todo)


# Delete a job
async def delete(todo_id):
    result = await todos_collection.delete_one({"_id": todo_id})
    return result.deleted_count == 1