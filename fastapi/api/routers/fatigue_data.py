from api.basemodels import FatigueDataRecord, FatigueAssessment
from api.models import FatigueData
from api.deps import user_dependency, db_dependency, user_object_dependency
from fastapi import APIRouter, status
from api.ai_models.decision_tree_ai import has_fatigue_risk

router = APIRouter(prefix='/fatiguedata', tags=['fatiguedata'])

@router.get('/')
def get_fatigue_data(db: db_dependency, user: user_dependency, fatigue_data_id: int):
    return db.query(FatigueData).filter(FatigueData.id == fatigue_data_id).first()

@router.get('/fatiguedata')
def get_user_fatigue_data(db: db_dependency, user: user_dependency):
    return db.query(FatigueData).filter(FatigueData.user_id == user.get('id')).all()

@router.post('/', status_code=status.HTTP_201_CREATED, response_model=FatigueAssessment)
def record_fatigue_data(db: db_dependency, user: user_dependency, fatigue_data: FatigueDataRecord, user_object: user_object_dependency):
    db_fatigue_data = FatigueData(**fatigue_data.model_dump(), user_id=user.get('id'))
    db.add(db_fatigue_data)

    try:
        db.commit()
        db.refresh(db_fatigue_data)
        return {'data': db_fatigue_data, 'fatigue_risk': has_fatigue_risk(fatigue_data, user_object)}
    
    except Exception as e:
        db.rollback()
        return {'message': f'An Unexpected Error Occured: {e}'}

@router.delete('/')
def delete_fatigue_data(db: db_dependency, user: user_dependency, fatigue_data_id: int):
    db_fatigue_data = db.query(FatigueData).filter(FatigueData.id == fatigue_data_id).first()
    if db_fatigue_data:
        db.delete(db_fatigue_data)
        db.commit()
    return db_fatigue_data