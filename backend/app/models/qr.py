import time
from pydantic import BaseModel, ConfigDict, field_validator
from sqlalchemy import BigInteger, Boolean, Column, String
from app.models.users import UserModel
from db import Base,get_db
from fastapi import UploadFile
from typing import Union


class QR(Base):
    __tablename__ = "qr"

    id = Column(String,primary_key=True)
    user_id = Column(String)
    name = Column(String)
    description = Column(String)
    qr_image= Column(String,unique=True)
    created_at = Column(BigInteger)
    updated_at = Column(BigInteger)
    is_active = Column(Boolean)

class QRModel(BaseModel):
    id:str
    user_id:str
    name:str
    description:str
    qr_image:str
    created_at:int
    updated_at:int
    is_active: bool

    model_config = ConfigDict(from_attributes=True, extra="allow")

class QRModelForm(BaseModel):
    name: str
    description: str
    qr_image: UploadFile
    is_active: Union[bool, str]

    @field_validator('is_active')
    @classmethod
    def validate_is_active(cls, v: Union[bool, str]) -> bool:
        if isinstance(v, bool):
            return v
        if isinstance(v, str):
            return v.lower() == 'true'
        return True

    model_config = ConfigDict(arbitrary_types_allowed=True)

class QRTable:
    def get_qr(self,user_id:str)->list[QRModel]:
        with get_db() as db:
            try:
                query = db.query(QR)
                query = query.filter(QR.user_id == user_id)
                query = query.order_by(QR.created_at.desc())
                results = query.all()
                return [QRModel.model_validate(result) for result in results] 

            except Exception as e:
                return None
            
    def get_qr_by_id(self,qr_id:str)->QRModel:
        with get_db() as db:
            try:
                query = db.query(QR)
                query = query.filter(QR.id == qr_id)
                query = query.order_by(QR.created_at.desc())
                result = query.first()
                return QRModel.model_validate(result)

            except Exception as e:
                return None
    
    def get_active_qr_by_id(self, qr_id: str) -> QRModel:
        with get_db() as db:
            try:
                result = db.query(QR).filter(QR.user_id == qr_id).filter(QR.is_active == True).first()
                return QRModel.model_validate(result) if result else None
            except Exception as e:
                return None

    def delete_qr(self, qr_id: str) -> bool:
        with get_db() as db:
            try:
                result = db.query(QR).filter(QR.id == qr_id).delete()
                db.commit()
                return result > 0
            except Exception as e:
                return False

    def add_new_qr(self,
        id: str,
        user_id: str,
        name: str,
        description: str,
        qr_image:str,
        is_active:bool
    ) -> QRModel:
        with get_db() as db:
            try:
                current_time = int(time.time() * 1000)  # Convert to milliseconds
                qr = QRModel(
                    **{
                        "id": id,
                        "user_id": user_id,
                        "name": name,
                        "description": description,
                        "qr_image": qr_image,
                        "created_at": current_time,
                        "updated_at": current_time,
                        "is_active": is_active,
                    }
                )
                result = QR(**qr.model_dump())
                db.add(result)
                db.commit()
                db.refresh(result)
                return QRModel.model_validate(result) if result else None

            except Exception as e:
                return None
    
    def update_default_qr(self,user:UserModel):
        with get_db() as db:
            try:
                qr = db.query(QR).filter_by(user_id=user.id).filter(QR.is_active == True).all()
                if not qr:
                    return None
                for item in qr:
                    item.is_active = False
                    item.updated_at = int(time.time())
                db.commit()
                db.refresh(qr)
                
                return QRModel.model_validate(qr)
            except Exception as e:
                print(f"Error in update_qr: {str(e)}")
                return None
            
QRTables = QRTable()

