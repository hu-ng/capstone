"""
Defines all actions that authenticated users can take with templates
"""

from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import Response
from typing import List, Optional
from pydantic import UUID4


import mvp.server.actions.template_actions as template_actions
from mvp.server.models.template_models import Template, TemplateCreate, TemplateUpdate, TemplateInDB
from mvp.server.models.user_models import User
from .user_routes import fastapi_users


router = APIRouter()


@router.get("/", response_model=List[Template])
async def get_templates(user: User = Depends(fastapi_users.get_current_active_user)):
    templates = await template_actions.get_templates(user)
    return templates


@router.get("/{id}", response_model=Template)
async def get_template(id: UUID4, user: User = Depends(fastapi_users.get_current_active_user)):
    template = await template_actions.get_template(id)

    # If the user does not own this resource
    if template.user_id == user.id:
        return template
    
    raise HTTPException(status_code=404, detail=f"Tempalte {id} not found") 


@router.post("/", response_model=Template)
async def create_template(template: TemplateCreate, user: User = Depends(fastapi_users.get_current_active_user)):
    # Create a new template
    template = await template_actions.create_template(template, user.id)
    return template


@router.put("/{id}", response_model=Template)
async def update_template(id: UUID4, template: TemplateUpdate, user: User = Depends(fastapi_users.get_current_active_user)):
    # Find the template
    found_template = await template_actions.get_template(id)

    if not found_template:
        raise HTTPException(status_code=404, detail=f"Template {id} not found")

    # Update template if user owns it
    if found_template.user_id == user.id:
        updated_template = await template_actions.update_template(id, template)

        return updated_template
    else:
        raise HTTPException(status_code=401, detail=f"You don't own this template")


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_template(id: UUID4, user: User = Depends(fastapi_users.get_current_active_user)):
    # Find the template
    found_template = await template_actions.get_template(id)

    if not found_template:
        raise HTTPException(status_code=404, detail=f"Template {id} not found")
    
    # Update template if user owns it
    if found_template.user_id == user.id:
        await template_actions.delete_template(id)
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    
    raise HTTPException(status_code=401, detail=f"You don't own this template")

