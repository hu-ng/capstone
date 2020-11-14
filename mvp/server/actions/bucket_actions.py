"""
Provides helper functions to interact with the database
"""

from bson.objectid import ObjectId
from mvp.server.database import bucket_collection, connection_collection


# Convert what is returned by MongoDB into the correct format
def bucket_helper(bucket) -> dict:
    return {
        "id": str(bucket["_id"]),
        "name": bucket["name"],
        "frequency": bucket["frequency"],
        "user_id": bucket["user_id"],
    }


# Get all buckets for this user
async def get_all_buckets(user_id: str):
    cursor = bucket_collection.find({
        "user_id": { "$eq": user_id}
    })
    buckets = []
    async for bucket in cursor:
        buckets.append(bucket_helper(bucket))

    return buckets


# Get one bucket
async def get_bucket(id: str, user_id: str) -> dict:
    bucket = await bucket_collection.find_one({"_id": ObjectId(id)})
    if bucket and bucket["user_id"] == user_id:
        return bucket_helper(bucket)
    else:
        return False


# Create a bucket
async def create_bucket(data: dict):
    bucket = await bucket_collection.insert_one(data)
    new_bucket = await bucket_collection.find_one({"_id": bucket.inserted_id})

    return bucket_helper(new_bucket)


# Update bucket
async def update_bucket(id: str, user_id: str, data: dict):
    if len(data) < 1:
        return False

    # Check if the bucket exists, if so update it
    bucket = await bucket_collection.find_one({"_id": ObjectId(id)})
    if bucket and bucket["user_id"] == user_id:
        result = await bucket_collection.update_one(
            {"_id": ObjectId(id)}, {"$set": data}
        )
        if result.acknowledged:
            updated = await bucket_collection.find_one({"_id": ObjectId(id)})
            return bucket_helper(updated)
        else:
            return False
    return False


# Delete bucket
async def delete_bucket(id: str, user_id: str):
    bucket = await bucket_collection.find_one({"_id": ObjectId(id)})
    if bucket and bucket["user_id"] == user_id:
        # Update the affected connections in that bucket
        await connection_collection.update_many(
            {"bucket_id": {"$eq": id}},
            {'$set': {"bucket_id": None}})
    

        # Delete the bucket
        await bucket_collection.delete_one({"_id": ObjectId(id)})
        return bucket_helper(bucket)