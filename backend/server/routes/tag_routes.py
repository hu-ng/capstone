
"""
Defines all API endpoints for the tags resource
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import Response
from typing import List, Optional
from pydantic import UUID4


import backend.server.actions.tag_actions as tag_actions
from backend.server.models.tag_models import Tag, TagCreate
from backend.server.models.user_models import User
from .user_routes import fastapi_users


# A router object, acts like a mini-app that we can hook up to our main app later.
router = APIRouter()


# Get all tags for logged-in user
@router.get("/", response_description="Return all tags for this user.", response_model=List[Optional[Tag]])
async def get_all_tags(user: User = Depends(fastapi_users.get_current_active_user)):
    tags = await tag_actions.get_all(user.id)
    return tags


# Get a single tag for the user
@router.get("/{tag_id}", response_description="Return one tag based on id", response_model=Tag)
async def get_tag(tag_id: UUID4, user: User = Depends(fastapi_users.get_current_active_user)):
    tag = await tag_actions.get_one(tag_id, user.id)
    if tag:
        return tag
    raise HTTPException(status_code=404, detail=f"Tag {tag_id} not found")


# Create a tag for the logged-in user
@router.post("/", response_description="Create and return a new tag", response_model=Tag)
async def create_tag(tag: TagCreate, user: User = Depends(fastapi_users.get_current_active_user)):
    # Add the user_id in the input data, and convert to TagCreate model
    data = tag.mongo()
    data["user_id"] = user.id
    data = TagCreate(**data)
    new_tag = await tag_actions.create(data)
    return new_tag