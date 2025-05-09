import json
import time
from db import Base,get_db

from pydantic import BaseModel, ConfigDict
from sqlalchemy import JSON, Boolean, Column, BigInteger, String, Text, cast, text


class Group(Base):
    __tablename__ = "group"

    id = Column(String, primary_key=True)
    name = Column(String)
    description = Column(Text)
    created_by = Column(String)
    members = Column(JSON)  
    created_at = Column(BigInteger)
    updated_at = Column(BigInteger)
    active_status = Column(Boolean)

class GroupModel(BaseModel):
    id: str
    name: str
    description: str
    created_by: str
    members: list[str]
    created_at: int
    updated_at: int
    active_status: bool = True

    model_config = ConfigDict(from_attributes=True, extra="allow")

class GroupCreateModel(BaseModel):
    name: str
    description: str

class GroupTable:
    def get_groups(self) -> list[GroupModel]:
        with get_db() as db:
            try:
                query = db.query(Group)
                query = query.order_by(Group.created_at.desc())
                query = query.filter(Group.active_status == 'true')
                results = query.all()
                return GroupModel.model_validate(results) if results else None

            except Exception as e:
                return None
            
    def get_group_by_id(self, id: str) -> GroupModel:
        with get_db() as db:
            try:
                group = db.query(Group).filter_by(id=id).filter(Group.active_status == "true").first()
                return GroupModel.model_validate(group) if group else None

            except Exception as e:
                return None
            
    def get_group_by_user_id(self, user_id: str) -> list[GroupModel] :
        with get_db() as db:
            try:

                results = (
                db.query(Group)
                .filter(text(f"members::text LIKE '%{user_id}%'"))
                .filter(Group.active_status == True)
                .all()
                )
                return [GroupModel.model_validate(result) for result in results] 

            except Exception as e:
                return None
            
    def create_group(self,
        id: str,
        name: str,
        description: str,
        created_by: str,
        members: list[str]
    ) -> GroupModel:
        with get_db() as db:
            try:
                group = GroupModel(
                    **{
                        "id": id,
                        "name": name,
                        "description": description,
                        "created_by": created_by,
                        "members": members,
                        "created_at": int(time.time()),
                        "updated_at": int(time.time()),
                        "active_status": True,
                    }
                )
                result = Group(**group.model_dump())
                db.add(result)
                db.commit()
                db.refresh(result)
                return GroupModel.model_validate(result) if result else None

            except Exception as e:
                return None
            
Groups = GroupTable()