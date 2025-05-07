from fastapi import APIRouter, HTTPException, Request, Response
import re  # Added for email validation
from app.models.auths import Auths, SignInForm, SignUpForm
from app.utils.auths import get_password_hash, create_token, validate_email_format, verify_password  # Added create_session_token
from app.models.users import Users


router = APIRouter()


@router.post('/signup')
async def add_new_user(request: Request, response: Response, form_data: SignUpForm):
    try:
        if not validate_email_format(form_data.email):
            raise HTTPException(400, detail="Invalid email format")
        
        if not Users.get_user_by_email(form_data.email):
            hashed = get_password_hash(form_data.password)
            user = Auths.add_new_user(
                    form_data.email.lower(),
                    hashed,
                    form_data.name
                    )
            # Create session token
            if user:
                payload = {
                    "user_id": user.id,
                    "email": user.email,
                    "name": user.name
                }
                token = create_token(payload)
                return {**user.model_dump(), "token": token}
        
        raise HTTPException(400, detail="Email Already Exists")
    except Exception as e:
        raise HTTPException(400, detail=str(e))  
    

@router.post('/login')
async def login(request: Request, response: Response, form_data: SignInForm):
    try:
        if not validate_email_format(form_data.email):
            raise HTTPException(400, detail="Invalid email format")
        user = Auths.get_auth_by_email(form_data.email)
        if not user:
            raise HTTPException(400, detail="Email does not exist")
        if not verify_password(form_data.password,user.password):
            raise HTTPException(400, detail="Incorrect password")
        # Create session token
        user_details = Users.get_user_by_email(form_data.email)
        payload = {
            "user_id": user_details.id,
            "email": user_details.email,
            "name": user_details.name
        }
        token = create_token(payload)
        return {**user_details.model_dump(), "token": token}
        
    except Exception as e:
        raise HTTPException(400, detail=e.detail) 
