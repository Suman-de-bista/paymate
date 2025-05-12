from pydantic import BaseModel, ConfigDict
from sqlalchemy import JSON, BigInteger, Boolean, Column, Float, String
from db import Base, get_db
import uuid
import time


class Transaction(Base):
    __tablename__ = 'transactions'

    id = Column(String,primary_key=True)
    group_id = Column(String)
    name = Column(String)
    description = Column(String)
    amount = Column(Float)
    paid_by = Column(String)
    split_between = Column(JSON)
    date = Column(BigInteger)
    created_at = Column(BigInteger)
    active_status = Column(Boolean)

class TransactionModel(BaseModel):
    id: str
    group_id: str
    name: str
    description: str
    amount: float
    paid_by: str
    split_between: list[str]
    date:int
    created_at: int
    active_status: bool = True

    model_config = ConfigDict(from_attributes=True, extra="allow")

class TransactionCreateModel(BaseModel):
    group_id: str
    name: str
    description: str
    amount: float
    paid_by: str
    split_between: list[str]
    date:int

class TransactionTable:
    def get_transaction(self,group_id:str) -> list[TransactionModel]:
        with get_db() as db:
            try:
                query = db.query(Transaction).filter_by(group_id = group_id)
                query = query.order_by(Transaction.created_at.desc())
                results = query.all()
                return results
            except Exception as e:
                return None

    def create_transaction(self,transaction: TransactionModel) -> TransactionModel:
        with get_db() as db:
            try:

                transaction = TransactionModel(
                **{
                    "id": str(uuid.uuid4()),
                    "group_id": transaction["group_id"],
                    "name": transaction["name"],
                    "description": transaction["description"],
                    "amount": transaction["amount"],
                    "paid_by": transaction["paid_by"],
                    "split_between": transaction["split_between"],
                    "date": transaction["date"],
                    "created_at": int(time.time()),
                    "active_status": True
                    }
                )
                result = Transaction(**transaction.model_dump())
                db.add(result)
                db.commit()
                db.refresh(result)
                
                if result:
                    return result
                else:
                    return None
            except Exception as e:
                print(f"Error creating transaction: {str(e)}")
                db.rollback()
                return None
            
Transactions = TransactionTable()
    