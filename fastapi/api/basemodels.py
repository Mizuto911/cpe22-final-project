from pydantic import BaseModel

class MeasurementBase(BaseModel):
    bpm: int
    temperature: float

class MeasurementRecord(MeasurementBase):
    pass

class UserCreateRequest(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token:str
    token_type:str