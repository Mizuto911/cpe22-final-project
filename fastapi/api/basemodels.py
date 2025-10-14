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

class FatigueDataBase(BaseModel):
    rhh: int # Resting Heart Rate
    hrr: int # Heart Rate Recovery
    train_time: float # in hours

class FatigueDataRecord(FatigueDataBase):
    pass