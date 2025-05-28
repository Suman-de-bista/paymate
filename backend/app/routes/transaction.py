import time
from typing import Optional
import uuid
from fastapi import APIRouter, Depends

from app.models.transaction import TransactionCreateModel, TransactionModel, Transactions
from app.utils.auths import get_user


router = APIRouter()

@router.get('/{group_id}',response_model=Optional[list[TransactionModel]])
async def get_transaction(group_id:str,user=Depends(get_user)):
    try:
        return Transactions.get_transaction(group_id)
    except Exception as e:
        return None

@router.post('/add',response_model=TransactionModel)
async def add_transaction(form_data:TransactionCreateModel,user=Depends(get_user)):
    try:
        return Transactions.create_transaction({
                 "id": str(uuid.uuid4()),
                 "group_id":form_data.group_id,
                 "name":form_data.name,
                 "description":form_data.description,
                 "amount":form_data.amount,
                 "paid_by":form_data.paid_by,
                 "split_between":form_data.split_between,
                 "created_at":time.time(),
                 "date":form_data.date,
                 "active_status":True
            }
        )
    except Exception as e:
        return None