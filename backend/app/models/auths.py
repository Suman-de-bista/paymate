from typing import Optional
import uuid
from pydantic import BaseModel
from sqlalchemy import Boolean, Column, String, Text
from app.models.users import Users
from db import Base,get_db


class Auth(Base):
    __tablename__ = "auth"

    id = Column(String, primary_key=True)
    email = Column(String)
    password = Column(Text)
    active_status = Column(Boolean)
    

class AuthModel(BaseModel):
    id: str
    email: str
    password: str
    active_status: bool = True

class SignUpForm(BaseModel):
    name: str
    email: str
    password: str
    profile_image_url: Optional[str] = None
    
    
class AuthTable:
    def add_new_user(self,
        email: str,
        password: str,
        name: str):
        with get_db() as db: 
            try:
                id = str(uuid.uuid4())
                
                auth = AuthModel(
                    **{"id": id, "email": email, "password": password, "active_status": True}
                )
                result = Auth(**auth.model_dump())
                db.add(result)
                
                user = Users.add_user(
                    id,
                    name,
                    email,
                )
                
                db.commit()
                db.refresh(result)
                
                if result and user:
                    return user
                else:
                    return None
            except Exception as e:
                return None
            
Auths = AuthTable()