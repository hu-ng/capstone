from fastapi import APIRouter, Body, Depends
from fastapi.encoders import jsonable_encoder
from typing import List, Optional

import mvp.server.actions.connection_actions as connection_actions

from mvp.server.models.connection_models import ConnectionIn, ConnectionOut, ConnectionUpdate
from mvp.server.models.response_models import ErrorResponseModel
from mvp.server.models.user_models import User
from .user_routes import fastapi_users


router = APIRouter()

@router.get("/", response_description="Return all connections for this user", response_model=List[Optional[ConnectionOut]])
async def get_all_connections(user: User = Depends(fastapi_users.get_current_active_user)):
    connections = await connection_actions.get_all_connections(user.id)
    return connections


@router.get("/{id}", response_model=ConnectionOut)
async def get_connection(id: str, user: User = Depends(fastapi_users.get_current_active_user)):
    connection = await connection_actions.get_connection(id, user.id)
    if connection:
        return connection


@router.post("/", response_description="Return the connection that was created", response_model=ConnectionOut)
async def create_connection(connection: ConnectionIn, user: User = Depends(fastapi_users.get_current_active_user)):
    data = connection.dict()
    data["user_id"] = user.id
    new_connection = await connection_actions.create_connection(data)
    return new_connection


@router.put("/{id}", response_description="Return the connection after it is updated", response_model=ConnectionOut)
async def update_connection(id: str, data: ConnectionUpdate, user: User = Depends(fastapi_users.get_current_active_user)):
    updated_connection = await connection_actions.update_connection(id, user.id, data.dict())
    return updated_connection


@router.delete("/{id}", response_description="Return the deleted connection", response_model=ConnectionOut)
async def delete_connection(id: str, user: User = Depends(fastapi_users.get_current_active_user)):
    deleted_connection = await connection_actions.delete_connection(id, user.id)
    return deleted_connection