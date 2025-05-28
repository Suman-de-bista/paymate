from typing import Optional
from app.utils.auths import get_user
from fastapi import APIRouter, Depends, Query
from app.models.users import Users, UserModel
from app.models.groups import Groups

router = APIRouter()

@router.get('/')
async def get_users(skip: Optional[int] = None, limit: Optional[int] = None, user = Depends(get_user)):
    return Users.get_users()

@router.get('/search', response_model=list[UserModel])
async def search_users_by_email_in_group(
    email: str = Query(..., description="Email to search for"),
    group_id: str = Query(..., description="Group ID to search in"),
    user = Depends(get_user)
):
    return Groups.search_users_by_email_in_group(email, group_id)


