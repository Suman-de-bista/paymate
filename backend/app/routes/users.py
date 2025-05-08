from typing import Optional
from app.utils.auths import get_user
from fastapi import APIRouter,Depends

from app.models.users import Users


router = APIRouter()

@router.get('/')
async def get_users(skip: Optional[int] = None,imit: Optional[int] = None,user = Depends(get_user)):
    return Users.get_users()


