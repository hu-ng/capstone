"""
Defines all actions that authenticated users can take with buckets
"""

from fastapi import APIRouter, Body, Depends
from fastapi.encoders import jsonable_encoder
from typing import List, Optional

import mvp.server.actions.bucket_actions as bucket_actions

from mvp.server.models.bucket_models import BucketIn, BucketOut, BucketUpdate
from mvp.server.models.response_models import ErrorResponseModel
from mvp.server.models.user_models import User
from .user_routes import fastapi_users


router = APIRouter()

# Get all buckets
@router.get("/", response_description="Return all buckets for this user", response_model=List[Optional[BucketOut]])
async def get_all_buckets(user: User = Depends(fastapi_users.get_current_active_user)):
    buckets = await bucket_actions.get_all_buckets(user.id)
    return buckets


# Get a single bucket
@router.get("/{id}", response_model=BucketOut)
async def get_bucket(id: str, user: User = Depends(fastapi_users.get_current_active_user)):
    bucket = await bucket_actions.get_bucket(id, user.id)
    if bucket:
        return bucket


# Create a bucket
@router.post("/", response_description="Return the bucket that was created", response_model=BucketOut)
async def create_bucket(bucket: BucketIn, user: User = Depends(fastapi_users.get_current_active_user)):
    data = bucket.dict()
    data["user_id"] = user.id
    new_bucket = await bucket_actions.create_bucket(data)
    return new_bucket


# Update a bucket
@router.put("/{id}", response_description="Return the bucket after it is updated", response_model=BucketOut)
async def update_bucket(id: str, data: BucketUpdate, user: User = Depends(fastapi_users.get_current_active_user)):
    updated_bucket = await bucket_actions.update_bucket(id, user.id, data.dict())
    return updated_bucket


# Delete a bucket
@router.delete("/{id}", response_description="Return the deleted bucket", response_model=BucketOut)
async def delete_bucket(id: str, user: User = Depends(fastapi_users.get_current_active_user)):
    deleted_bucket = await bucket_actions.delete_bucket(id, user.id)
    return deleted_bucket