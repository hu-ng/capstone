from mvp.server.database import templates_collection
from mvp.server.models.template_models import TemplateCreate, TemplateUpdate, TemplateInDB
from mvp.server.models.user_models import User

from typing import List


# Get all templates for a user
async def get_templates(user: User):
    cursor = templates_collection.find({
        "user_id": { "$eq": user.id}
    })
    templates = []
    async for template in cursor:
        templates.append(TemplateInDB.from_mongo(template))
    return templates


# find a template
async def get_template(id) -> TemplateInDB:
    template = await templates_collection.find_one({"_id": id})
    return TemplateInDB.from_mongo(template)


# Create a new template
async def create_template(template: TemplateCreate, user_id):
    data = template.mongo()
    data["user_id"] = user_id
    new_template = await templates_collection.insert_one(data)
    created_template = await templates_collection.find_one({"_id": new_template.inserted_id})
    return TemplateInDB.from_mongo(created_template)


# Update existing template
async def update_template(id, template: TemplateUpdate):
    # Transform data and update template
    update_data = template.mongo(exclude_unset=True)
    
    await templates_collection.update_one(
        {"_id": id}, {"$set": update_data}
    )

    # Find updated document
    updated_template = await templates_collection.find_one({"_id": id})
    return TemplateInDB.from_mongo(updated_template)


# Delete a template
async def delete_template(id):
    result = await templates_collection.delete_one({"_id": id})
    return result.deleted_count == 1