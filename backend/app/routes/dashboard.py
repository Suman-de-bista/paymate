import asyncio
from typing import Optional
from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.models.groups import GroupModel, Groups
from app.models.transaction import TransactionModel, Transactions
from app.utils.auths import get_user


router = APIRouter()

class DashboardModel(BaseModel):
   groups:list[GroupModel]
   transactions:list[TransactionModel]
   owe_transactions:list[TransactionModel]
   owed_transactions:list[TransactionModel]

@router.get('/',response_model=DashboardModel)
async def get_dashboard_details(skip: Optional[int] = None, limit: Optional[int] = None,user = Depends(get_user)):
    try:
        results = await asyncio.gather(
            Groups.get_group_by_user_id(user.id,skip,limit),
            Transactions.get_recent_transactions(user.id,skip,limit),
            Transactions.get_owe_transactions(user.id),
            Transactions.get_owed_transactions(user.id)
        )
        return {
            "groups":results[0],
            "transactions":results[1],
            "owe_transactions":results[2],
            "owed_transactions":results[3]
        }
    except Exception as e:
       return None
