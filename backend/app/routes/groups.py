from typing import Optional
from fastapi import APIRouter, Depends
import uuid 

from app.models.groups import GroupCreateModel, GroupModel, Groups
from app.utils.auths import get_user


router = APIRouter()

@router.get('/',response_model=list[GroupModel])
async def get_group_by_user_id(skip: Optional[int] = None, limit: Optional[int] = None,user = Depends(get_user)):
    return Groups.get_group_by_user_id(user_id=user.id)

@router.get('/{group_id}', response_model=GroupModel)
async def get_group_by_id(group_id: str, user = Depends(get_user)):
    return Groups.get_group_by_id(id=group_id)

@router.post('/create', response_model=GroupModel)
async def create_group(form_data:GroupCreateModel, user = Depends(get_user)):
    return Groups.create_group(
        id=str(uuid.uuid4()),
        name=form_data.name,
        description=form_data.description,
        created_by=user.id,
        members=[user.id]
    )
