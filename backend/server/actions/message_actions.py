from backend.server.database import message_collection
from backend.server.models.job_models import JobInDB
from backend.server.models.message_models import MessageInDB, MessageCreate, MessageUpdate

# Get all messages for a job
async def get_all(job: JobInDB):
    messages = []
    for message_id in job.messages:
        message = await message_collection.find_one({"_id": message_id})
        messages.append(MessageInDB.from_mongo(message))

    return messages


# find a message
async def get_one(msg_id):
    message = await message_collection.find_one({"_id": msg_id})
    return MessageInDB.from_mongo(message)


# create a new message
async def create(message: MessageCreate):
    new_message = await message_collection.insert_one(message.mongo())
    created_message = await message_collection.find_one({"_id": new_message.inserted_id})

    return MessageInDB.from_mongo(created_message)


# Update existing message
async def update(msg_id, message: MessageUpdate):
    # Transform data
    update_data = message.mongo(exclude_unset=True)
    
    await message_collection.update_one(
        {"_id": msg_id}, {"$set": update_data}
    )

    # Find updated document
    updated_message = await message_collection.find_one({"_id": msg_id})
    return MessageInDB.from_mongo(updated_message)


# Delete a message
async def delete(msg_id):
    result = await message_collection.delete_one({"_id": msg_id})
    return result.deleted_count == 1