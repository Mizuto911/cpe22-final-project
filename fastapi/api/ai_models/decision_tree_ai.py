import pickle
from api.basemodels import MeasurementRecord
from api.basemodels import FatigueDataRecord
from datetime import date
from api.models import User
from pathlib import Path

base_dir = Path(__file__).resolve().parent
filepath = base_dir/'fatigued_decision_tree.pkl'

def load_ai_model():
    try:
        with open(filepath, 'rb') as file:
            return pickle.load(file)
    except Exception as e:
        return e

def is_abnormal_reading(measurement: MeasurementRecord, user_data: User):
    if measurement.bpm > (220 - get_age(user_data.birthday)):
        return True
    if measurement.temperature<33.0 or measurement.temperature>37.0:
        return True
    return False

def has_fatigue_risk(fatigue_data: FatigueDataRecord, user_data: User):
    ai_model = load_ai_model()

    if ai_model is not Exception:
        y_prediction = ai_model.predict([[
            get_age(user_data.birthday), 
            user_data.is_female, 
            fatigue_data.train_time,
            fatigue_data.rhh, 
            fatigue_data.hrr
            ]])
        return y_prediction[0] == 1
    else:
        return str(ai_model)

def get_age(birthday: date) -> int:
    today = date.today()
    return today.year - birthday.year - ((today.month, today.day) < (birthday.month, birthday.day))