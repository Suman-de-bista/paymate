import os
from typing import Optional
import uuid
from fastapi import APIRouter, Depends, Path, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse

from app.models.qr import QRTables, QRModel, QRModelForm
from app.utils.auths import get_user


router = APIRouter()

UPLOAD_DIR = "static/qr/uploads"
URL_PREFIX = "/static/qr/uploads"  # URL prefix for accessing the files

# Ensure upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.get('/',response_model=list[QRModel])
async def get_qr_by_userid(skip: Optional[int] = None, limit: Optional[int] = None,user = Depends(get_user)):
    try:
        return QRTables.get_qr(user.id)
    except Exception as e:
        return str(e)
    
@router.get('/{qr_id}',response_model=Optional[QRModel])
async def get_qr_by_id(qr_id:str,user = Depends(get_user)):
    try:
        return QRTables.get_active_qr_by_id(qr_id)
    except Exception as e:
        return str(e)

@router.post('/add', response_model=QRModel)
async def add_new_qr(
    name: str = Form(...),
    description: str = Form(...),
    qr_image: UploadFile = File(...),
    is_active:bool = Form(...),
    user = Depends(get_user)
):
    try:
        # Generate unique filename
        file_extension = os.path.splitext(qr_image.filename)[1]
        filename = f"{uuid.uuid4()}{file_extension}"
        file_location = os.path.join(UPLOAD_DIR, filename)
        url_path = f"{URL_PREFIX}/{filename}"  # URL path for accessing the file

        # Save the file
        with open(file_location, "wb") as f:
            content = await qr_image.read()
            f.write(content)

        # Create QR record with URL path
        if is_active:
            QRTables.update_default_qr(user)
        qr = QRTables.add_new_qr(
            id=str(uuid.uuid4()),
            user_id=user.id,
            name=name,
            description=description,
            qr_image=url_path,
            is_active = is_active
        )
        
        if qr:
            return qr
        return JSONResponse(status_code=400, content={"message": "Failed to create QR code"})

    except Exception as e:
        return JSONResponse(status_code=500, content={"message": str(e)})


@router.delete('/{qr_id}')
async def delete_qr(qr_id: str, user = Depends(get_user)):
    try:
        # Get the QR code first to check ownership and get file path
        qr = QRTables.get_qr_by_id(qr_id)
        if not qr or qr.user_id != user.id:
            raise HTTPException(status_code=404, detail="QR code not found")

        # Delete the file
        file_path = qr.qr_image.replace(URL_PREFIX, UPLOAD_DIR)
        if os.path.exists(file_path):
            os.remove(file_path)

        # Delete from database
        success = QRTables.delete_qr(qr_id)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to delete QR code")

        return JSONResponse(status_code=200, content={"message": "QR code deleted successfully"})

    #except HTTPException as he:
     #   raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    

