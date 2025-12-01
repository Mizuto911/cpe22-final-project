from fastapi import APIRouter, status, HTTPException
from api.models import Measurement
from typing import List
from api.deps import db_dependency, user_dependency, user_object_dependency
from api.ai_models.decision_tree_ai import is_abnormal_reading
from api.basemodels import MeasurementRecord, OverworkAssessment
from datetime import datetime, timezone

router = APIRouter(prefix='/measurements', tags=['measurements'])

@router.get('/')
def get_measurement(db: db_dependency, user: user_dependency, measurement_id: int):
    return db.query(Measurement).filter(Measurement.id == measurement_id).first()

@router.get('/measurements')
def get_measurements(db: db_dependency, user: user_dependency):
    measurements = db.query(Measurement).filter(Measurement.user_id == user.get('id')).all()
    if measurements:
        return {'data': measurements, 'average': get_average(measurements)}
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='User Measurements does not Exist')

@router.post('/', status_code=status.HTTP_201_CREATED, response_model=OverworkAssessment)
def record_measurement(db: db_dependency, user: user_dependency, measurement: MeasurementRecord, user_object: user_object_dependency): 
    db_measurement = Measurement(**measurement.model_dump(), user_id=user.get('id'))
    db_measurement.timestamp = datetime.now(timezone.utc)
    db.add(db_measurement)

    try:
        db.commit()
        db.refresh(db_measurement)
        return {'data': db_measurement, 'overworked': is_abnormal_reading(measurement, user_object)}
    
    except Exception as e:
        db.rollback()
        return {'message': f'An Unexpected Error Occured: {e}'}

@router.delete('/')
def delete_measurement(db: db_dependency, user: user_dependency, measurement_id: int):
    db_measurement = db.query(Measurement).filter(Measurement.id == measurement_id).all()
    if(db_measurement):
        db.delete(db_measurement)
        db.commit()
    return db_measurement

def get_average(measurements: List[Measurement]):
    length = len(measurements)
    sum_bpm = 0
    sum_temperature = 0
    for i in range(length):
        sum_bpm += measurements[i].bpm
        sum_temperature += measurements[i].temperature
    return {'bpm': round(sum_bpm / length, 2), 'temperature': round(sum_temperature / length, 2)}