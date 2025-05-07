import time
from typing import Optional
from pydantic import BaseModel, ConfigDict
from sqlalchemy import BigInteger, Boolean, Column, Integer, String, Text

from db import Base, get_db



class User(Base):
    __tablename__ = "users"
    
    id = Column(String,primary_key=True)
    name = Column(String)
    email = Column(String)
    created_at = Column(BigInteger)
    last_active = Column(BigInteger)
    profile_image = Column(Text)
    active_status = Column(Boolean)
    

class UserModel(BaseModel):
    id: str
    name:str
    email:str
    created_at:int
    last_active:int
    profile_image:str
    active_status:bool
    
    model_config = ConfigDict(from_attributes=True,extra="allow")
    

class UserTable:
    def get_users(self,skip: int = None, limit: int = None):
        with get_db() as db:
            try:
                query = db.query(User)
                query = query.order_by(User.created_at.desc())
                query = query.filter(User.active_status =='true')
                query = query.offset(skip)
                query = query.limit(limit)
                results = query.all()
                return results
            except Exception as e:
                return None
            
    def add_user(self,
        id: str,
        name: str,
        email: str,
        profile_image: str= "/user.png"):
        with get_db() as db:
            user = UserModel(
                **{
                    "id": id,
                    "name": name,
                    "email": email,
                    "profile_image": profile_image,
                    "last_active": int(time.time()),
                    "created_at": int(time.time()),   
                    "active_status":True,
                }
            )
            result = User(**user.model_dump())
            db.add(result)
            db.commit()
            db.refresh(result)
    
            if result:
                return user
            else:
                return None
            
    def get_user_by_email(self, email: str) -> Optional[UserModel]:
        try:
            with get_db() as db:
                user = db.query(User).filter_by(email=email).first()
                return UserModel.model_validate(user)
        except Exception:
            return None
            

Users = UserTable()