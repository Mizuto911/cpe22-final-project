import pickle
from api.basemodels import MeasurementRecord

filename = 'fatigued_decision_tree.pkl'

try:
    with open(filename, 'rb') as file:
        ai_model = pickle.load(file)
except FileNotFoundError:
    ai_model = None
except pickle.UnpicklingError:
    ai_model = None
except Exception:
    ai_model = None
    

def is_abnormal_reading(measurement: MeasurementRecord, age: int):
    if measurement.bpm > (220 - age):
        return True
    if measurement.temperature<35.0 or measurement.temperature>38.3:
        return True
    return False