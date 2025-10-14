from pydantic import BaseModel
from typing import Optional
from fastapi import APIRouter, status
from api.models import Measurement
from api.deps import db_dependency, user_dependency
from api.decision_tree_ai import is_abnormal_reading

router = APIRouter(prefix='/measurements', tags=['measurements'])

class MeasurementBase(BaseModel):
    bpm: int
    temperature: float

class MeasurementRecord(MeasurementBase):
    pass

@router.get('/')
def get_measurement(db: db_dependency, user: user_dependency, measurement_id: int):
    return db.query(Measurement).filter(Measurement.id == measurement_id).first()

@router.get('/measurements')
def get_measurements(db: db_dependency, user: user_dependency, user_id: int):
    return db.query(Measurement).filter(Measurement.user_id == user.get('id')).all()

@router.post('/', status_code=status.HTTP_201_CREATED)
def record_measurement(db: db_dependency, user: user_dependency, measurement: MeasurementRecord):
    db_measurement = Measurement(**measurement.model_dump(), user_id=user.get('id'))
    db.add(db_measurement)
    db.commit()
    db.refresh(db_measurement)
    output = str(db_measurement) + ('User at Risk!' if is_abnormal_reading(measurement.bpm, measurement.temperature, 22) else 'User readings normal!')
    return output

@router.delete('/')
def delete_measurement(db: db_dependency, user: user_dependency, measurement_id: int):
    db_measurement = db.query(Measurement).filter(Measurement.id == measurement_id).first()
    if(db_measurement):
        db.delete(db_measurement)
        db.commit()
    return db_measurement