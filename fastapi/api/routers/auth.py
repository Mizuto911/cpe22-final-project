from datetime import timedelta, datetime, timezone
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt
from dotenv import load_dotenv
import os
from api.models import User, Measurement, FatigueData
from api.deps import db_dependency, bcrypt_context, user_dependency
from api.basemodels import UserCreateRequest, Token, UserGetRequest, UserUpdateRequest, UserUpdateResponse, UserPassUpdateRequest
from sqlalchemy.exc import IntegrityError

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
    create_user_request = User(name=create_user_request.username, 
                               hashed_password=bcrypt_context.hash(create_user_request.password),
                               birthday=create_user_request.birthday,
                               is_female=create_user_request.is_female)
    db.add(create_user_request)
    try: 
        db.commit()
        return { 
            'ok': True, 
            'message': f'User created successfully!', 
            'data': { 
                'name': create_user_request.name,
                'hashed_password': create_user_request.hashed_password,
                'birthday': create_user_request.birthday,
                'is_female': create_user_request.is_female
            } 
        }
    except IntegrityError as e:
        db.rollback()
        return {
            'ok': False,
            'message': 'User Name already exists!',
            'data': 'Status Code 409'
        }

@router.post('/token', response_model=Token)
async def login_for_access_token(formdata: Annotated[OAuth2PasswordRequestForm, Depends()], db: db_dependency):
    user = authenticate_user(formdata.username, formdata.password, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Unable to validate user')
    token = create_access_token(user.name, user.id, timedelta(hours=2))
    return {'access_token': token, 'token_type': 'bearer'}

@router.get('/data', response_model=UserGetRequest)
async def get_user_data(db: db_dependency, user: user_dependency):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Must be Authorized to access data.')
    return db.query(User).filter(User.id == user.get('id')).first()

@router.put('/data', status_code=status.HTTP_200_OK, response_model=UserUpdateResponse)
async def update_user_data(db: db_dependency, user: user_dependency, user_data: UserUpdateRequest):
    update_user = db.query(User).filter(User.id == user.get('id'))
    user_info = update_user.first()
    db_user = {'name': user_data.name, 'birthday': user_data.birthday, 'is_female': user_data.is_female, 'hashed_password': user_info.hashed_password}

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Must be Authorized to access data.')
    
    if not bcrypt_context.verify(user_data.password, user_info.hashed_password):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Forbidden: Wrong Password Entered.')

    try:
        if update_user.first():
            update_user.update(db_user, synchronize_session=False)
            db.commit()
            return update_user.first()
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail='User Cannot Be Found.')
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status.HTTP_409_CONFLICT, detail='User Name already exists!')

@router.put('/password', status_code=status.HTTP_200_OK, response_model=UserUpdateResponse)
async def update_user_data(db: db_dependency, user: user_dependency, user_data: UserPassUpdateRequest):
    update_user = db.query(User).filter(User.id == user.get('id'))
    user_info = update_user.first()

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Must be Authorized to access data.')
    
    if not bcrypt_context.verify(user_data.old_password, user_info.hashed_password):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Forbidden: Wrong Password Entered.')

    db_user = {'name': user_info.name, 'birthday': user_info.birthday, 'is_female': user_info.is_female, 
               'hashed_password': bcrypt_context.hash(user_data.password)}

    if update_user.first():
        update_user.update(db_user, synchronize_session=False)
        db.commit()
        return update_user.first()
    raise HTTPException(status.HTTP_404_NOT_FOUND, detail='User Cannot Be Found.')

@router.delete('/clear-data', status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_logs(db: db_dependency, user: user_dependency):

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Must be Authorized to access data.')
    
    delete_measurement = db.query(Measurement).filter(Measurement.user_id == user.get('id'))
    delete_fatigue_data = db.query(FatigueData).filter(FatigueData.user_id == user.get('id'))

    if delete_measurement.first() or delete_fatigue_data.first():
        delete_measurement.delete(synchronize_session=False)
        delete_fatigue_data.delete(synchronize_session=False)
        db.commit()
        return None
    raise HTTPException(status.HTTP_404_NOT_FOUND, detail='User Data Cannot Be Found.')