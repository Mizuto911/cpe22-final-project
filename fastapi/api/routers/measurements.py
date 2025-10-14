from fastapi import APIRouter, status
from api.models import Measurement
from api.deps import db_dependency, user_dependency, user_object_dependency
from api.ai_models.decision_tree_ai import is_abnormal_reading
from api.basemodels import MeasurementRecord, OverworkAssessment

router = APIRouter(prefix='/measurements', tags=['measurements'])

@router.get('/')
def get_measurement(db: db_dependency, user: user_dependency, measurement_id: int):
    return db.query(Measurement).filter(Measurement.id == measurement_id).first()

@router.get('/measurements')
def get_measurements(db: db_dependency, user: user_dependency):
    return db.query(Measurement).filter(Measurement.user_id == user.get('id')).all()

@router.post('/', status_code=status.HTTP_201_CREATED, response_model=OverworkAssessment)
def record_measurement(db: db_dependency, user: user_dependency, measurement: MeasurementRecord, user_object: user_object_dependency):
    db_measurement = Measurement(**measurement.model_dump(), user_id=user.get('id'))
    db.add(db_measurement)
    db.commit()
    db.refresh(db_measurement)
    return {'data': db_measurement, 'overworked': is_abnormal_reading(measurement, user_object)}

@router.delete('/')
def delete_measurement(db: db_dependency, user: user_dependency, measurement_id: int):
    db_measurement = db.query(Measurement).filter(Measurement.id == measurement_id).first()
    if(db_measurement):
        db.delete(db_measurement)
        db.commit()
    return db_measurement