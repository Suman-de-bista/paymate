from typing import Optional
from fastapi import APIRouter, Depends
import uuid 

from app.models.groups import GroupCreateModel, GroupModel, Groups, AddMembersModel, UpdateGroupModel
from app.utils.auths import get_user


router = APIRouter()

@router.get('/',response_model=list[GroupModel])
async def get_group_by_user_id(skip: Optional[int] = None, limit: Optional[int] = None,user = Depends(get_user)):
    return await Groups.get_group_by_user_id(user.id,skip,limit)

@router.get('/{group_id}', response_model=GroupModel)
async def get_group_and_members_by_id(group_id: str, user = Depends(get_user)):
    return Groups.get_group_and_members_by_id(id=group_id)



@router.post('/create', response_model=GroupModel)
async def create_group(form_data:GroupCreateModel, user = Depends(get_user)):
    return Groups.create_group(
        id=str(uuid.uuid4()),
        name=form_data.name,
        description=form_data.description,
        created_by=user.id,
        members=[user.id]
    )

@router.post('/{group_id}/members', response_model=GroupModel)
async def add_group_members(
    group_id: str,
    member_data: AddMembersModel,
    user = Depends(get_user)
):
    group = Groups.get_group_by_id(group_id)
    if not group or user.id != group.created_by:
        return None
        
    return Groups.add_members(group_id, member_data.member_ids)

@router.post('/update', response_model=GroupModel)
async def update_group_info(
    update_data: UpdateGroupModel,
    user = Depends(get_user)
):
    # Check if user is a member of the group
    group = Groups.get_group_by_id(update_data.id)
    if not group or user.id != group.created_by:
        return None
        
    return Groups.update_group(update_data.id, update_data)
