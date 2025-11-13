from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

class MeasurementBase(BaseModel):
    bpm: int
    temperature: float

class MeasurementRecord(MeasurementBase):
    pass

class UserCreateRequest(BaseModel):
    username: str
    password: str
    birthday: date
    is_female: Optional[bool] = False

class UserGetRequest(BaseModel):
    id: int
    name: str
    hashed_password: str
    birthday: date
    is_female: Optional[bool] = False

class Token(BaseModel):
    access_token:str
    token_type:str

class FatigueDataBase(BaseModel):
    rhh: int # Resting Heart Rate
    hrr: int # Heart Rate Recovery
    train_time: float # in hours

class FatigueDataRecord(FatigueDataBase):
    pass

class FatigueDataResponse(BaseModel):
    id: int
    rhh: int
    hrr: int
    train_time: float
    user_id: int

class MeasurementResponse(BaseModel):
    id: int
    bpm: int
    temperature: float
    timestamp: datetime
    user_id: int

class FatigueAssessment(BaseModel):
    data: FatigueDataResponse
    fatigue_risk: bool

class OverworkAssessment(BaseModel):
    data: MeasurementResponse
    overworked: bool