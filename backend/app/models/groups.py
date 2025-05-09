import json
import time
from typing import List, Optional, Union
from db import Base,get_db

from pydantic import BaseModel, ConfigDict
from sqlalchemy import JSON, Boolean, Column, BigInteger, String, Text, cast, text
from app.models.users import User, UserModel


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
    members: Union[List[str], List[dict]]  # Can be list of IDs or list of user objects
    created_at: int
    updated_at: int
    active_status: bool = True

    model_config = ConfigDict(from_attributes=True, extra="allow")

class GroupCreateModel(BaseModel):
    name: str
    description: str

class UpdateGroupModel(BaseModel):
    id: str
    name: Optional[str] = None
    description: Optional[str] = None

class AddMembersModel(BaseModel):
     member_ids: List[str]

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
            
    def get_group_and_members_by_id(self, id: str) -> GroupModel:
        with get_db() as db:
            try:
                # Join with User table to get member information
                group = (
                    db.query(Group)
                    .filter_by(id=id)
                    .filter(Group.active_status == "true")
                    .first()
                )
                
                if not group:
                    return None
                
                # Get user information for each member
                member_users = (
                    db.query(User)
                    .filter(User.id.in_(group.members))
                    .all()
                )
                
                # Create a dictionary of user information
                member_info = {
                    user.id: UserModel.model_validate(user).model_dump()
                    for user in member_users
                }
                
                # Convert group to model and add member information
                group_model = GroupModel.model_validate(group)
                group_model.members = [member_info.get(member_id, {"id": member_id}) for member_id in group.members]
                
                return group_model

            except Exception as e:
                print(f"Error in get_group_by_id: {str(e)}")
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

    def add_members(self, group_id: str, member_ids: List[str]) -> Optional[GroupModel]:
        with get_db() as db:
            try:
                # Get the group
                group = db.query(Group).filter_by(id=group_id).filter(Group.active_status == True).first()
                if not group:
                    return None

                # Add new members if they're not already in the group
                current_members = set(group.members)
                new_members = set(member_ids)
                
                # Update group members with unique members
                group.members = list(current_members.union(new_members))
                group.updated_at = int(time.time())
                
                db.commit()
                db.refresh(group)
                
                return GroupModel.model_validate(group)
            except Exception as e:
                return None
            
    def update_group(self, group_id: str, update_data: UpdateGroupModel) -> Optional[GroupModel]:
        with get_db() as db:
            try:
                # Get the group
                group = db.query(Group).filter_by(id=group_id).filter(Group.active_status == True).first()
                if not group:
                    return None

                # Update fields if provided
                if update_data.name is not None:
                    group.name = update_data.name
                if update_data.description is not None:
                    group.description = update_data.description
                
                # Update the timestamp
                group.updated_at = int(time.time())
                
                db.commit()
                db.refresh(group)
                
                return GroupModel.model_validate(group)
            except Exception as e:
                print(f"Error in update_group: {str(e)}")
                return None
            
    def search_users_by_email_in_group(self, email: str, group_id: str, limit: int = 10) -> List[UserModel]:
        try:
            with get_db() as db:
                # First get the group to check its members
                group = db.query(Group).filter_by(id=group_id).first()
                if not group:
                    return []
                
                # Get existing member IDs
                existing_member_ids = group.members if group.members else []
                print(f"Group ID: {group_id}")
                print(f"Existing members: {existing_member_ids}")
                
                # Query users that match email and are not already members
                users = db.query(User).filter(
                    User.email.ilike(f"%{email}%"),
                    User.active_status == True,
                    ~User.id.in_(existing_member_ids)  # Exclude existing members
                ).limit(limit).all()
                
                # Debug: Print found users
                found_user_ids = [user.id for user in users]
                print(f"Found users: {found_user_ids}")
                
                return [UserModel.model_validate(user) for user in users]
        except Exception as e:
            print(f"Error in search_users_by_email_in_group: {str(e)}")
            return []

            
Groups = GroupTable()