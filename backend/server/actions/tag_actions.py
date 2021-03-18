"""
All database actions involving tags
"""

from backend.server.database import tags_collection
from backend.server.models.tag_models import TagInDB, TagCreate

# Get all tags for the current user
async def get_all(user_id):
    cursor = tags_collection.find({
        "user_id": { "$eq": user_id}
    })
    tags = []
    async for tag in cursor:
        tags.append(TagInDB.from_mongo(tag))
    return tags

# Get one tag
async def get_one(tag_id, user_id):
    # Make a query to find tag with matching id
    tag = await tags_collection.find_one({"_id": tag_id})

    # If query returned something and the user_id matches, return the tag object
    if tag and tag["user_id"] == user_id:
        return TagInDB.from_mongo(tag)
    else:
        return {}


# Create a tag for the user and return it
async def create(data: TagCreate):
    tag = await tags_collection.insert_one(data.mongo())
    created_tag = await tags_collection.find_one({"_id": tag.inserted_id})
    return TagInDB.from_mongo(created_tag)