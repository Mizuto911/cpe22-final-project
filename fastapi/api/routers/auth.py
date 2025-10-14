from datetime import timedelta, datetime, timezone
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt
from dotenv import load_dotenv
import os
from api.models import User
from api.deps import db_dependency, bcrypt_context
from api.basemodels import UserCreateRequest, Token

load_dotenv()

router = APIRouter(prefix='/auth', tags=['auth'])

SECRET_KEY = os.getenv('AUTH_SECRET_KEY')
ALGORITHM = os.getenv('AUTH_ALGORITHM')

def authenticate_user(username:str, password:str, db):
    user = db.query(User).filter(User.name==username).first()
    if not user:
        return False
    if not bcrypt_context.verify(password, user.hashed_password):
        return False
    return user

def create_access_token(username:str, user_id:int, expires_delta:timedelta):
    encode = {'sub': username, 'id': user_id}
    expires = datetime.now(timezone.utc) + expires_delta
    encode.update({'exp':expires})
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post('/', status_code=status.HTTP_201_CREATED)
async def create_user(db: db_dependency, create_user_request: UserCreateRequest):
    create_user_request = User(name=create_user_request.username, hashed_password=bcrypt_context.hash(create_user_request.password))
    db.add(create_user_request)
    db.commit()

@router.post('/token', response_model=Token)
async def login_for_access_token(formdata: Annotated[OAuth2PasswordRequestForm, Depends()], db: db_dependency):
    user = authenticate_user(formdata.username, formdata.password, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Unable to validate user')
    token = create_access_token(user.name, user.id, timedelta(hours=2))
    return {'access_token': token, 'token_type': 'bearer'}
    