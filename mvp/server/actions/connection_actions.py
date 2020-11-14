from bson.objectid import ObjectId
from server.database import connection_collection, bucket_collection


def connection_helper(connection) -> dict:
    return {
        "id": str(connection["_id"]),
        "name": connection["name"],
        "description": connection["description"],
        "user_id": connection["user_id"],
        "bucket_id": connection["bucket_id"]
    }


# Get all connections for this user
async def get_all_connections(user_id: str) -> dict:
    cursor = connection_collection.find({
        "user_id": { "$eq": user_id}
    })
    connections = []
    async for connection in cursor:
        connections.append(connection_helper(connection))

    return connections


# Get one connection
async def get_connection(id: str, user_id: str) -> dict:
    connection = await connection_collection.find_one({"_id": ObjectId(id)})
    if connection and connection["user_id"] == user_id:
        return connection_helper(connection)
    else:
        return False


# Create connection
async def create_connection(data: dict):
    # Check if the bucket exists
    if data["bucket_id"]:
        bucket = await bucket_collection.find_one({"_id": ObjectId(data["bucket_id"])})
        if not bucket:
            return False

    connection = await connection_collection.insert_one(data)
    new_connection = await connection_collection.find_one({"_id": connection.inserted_id})

    return connection_helper(new_connection)


# Update connection
async def update_connection(id: str, user_id: str, data: dict):
    if len(data) < 1:
        return False

    # Check if the bucket exists
    if data["bucket_id"]:
        bucket = await bucket_collection.find_one({"_id": ObjectId(data["bucket_id"])})
        if not bucket:
            return False
    
    # Get existing connection and update it
    connection = await connection_collection.find_one({"_id": ObjectId(id)})
    if connection and connection["user_id"] == user_id:
        result = await connection_collection.update_one(
            {"_id": ObjectId(id)}, {"$set": data}
        )
        if result.acknowledged:
            updated = await connection_collection.find_one({"_id": ObjectId(id)})
            return connection_helper(updated)
        else:
            return False
    return False


# Delete connection
async def delete_connection(id: str, user_id: str):
    connection = await connection_collection.find_one({"_id": ObjectId(id)})
    if connection and connection["user_id"] == user_id:
        await connection_collection.delete_one({"_id": ObjectId(id)})
        return connection_helper(connection)