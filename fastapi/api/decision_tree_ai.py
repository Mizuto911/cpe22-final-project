def is_abnormal_reading(bpm: int, temperature: float, age: int):
    if bpm > (220 - age):
        return True
    if temperature<35.0 or temperature>38.3:
        return True
    return False