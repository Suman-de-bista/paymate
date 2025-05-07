from fastapi import APIRouter, HTTPException, Request, Response
from app.models.auths import Auths, SignUpForm
from app.utils.auths import get_password_hash
from app.models.users import Users


router = APIRouter()


@router.post('/signup')
async def add_new_user(request: Request, response: Response, form_data: SignUpForm):
    try:
        if not Users.get_user_by_email(form_data.email):
            hashed = get_password_hash(form_data.password)
            user = Auths.add_new_user(
                    form_data.email.lower(),
                    hashed,
                    form_data.name
                    )
            return user
        raise HTTPException(400, detail="Email Already Exists")
    except Exception as e:
        raise HTTPException(400, detail=e.detail)
