from typing import Optional
from fastapi import APIRouter

from app.models.users import Users


router = APIRouter()

@router.get('/')
async def get_users(skip: Optional[int] = None,imit: Optional[int] = None):
    return Users.get_users()


