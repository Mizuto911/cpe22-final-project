from sqlalchemy import Column, Integer, Float, String, ForeignKey, Table, DateTime
from sqlalchemy.orm import relationship
import datetime
from .database import Base

class User(Base):
    __tablename__='users'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    hashed_password = Column(String)
    measurements = relationship('Measurement', back_populates='user')

class Measurement(Base):
    __tablename__='measurements'
    id = Column(Integer, primary_key=True)
    timestamp = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc))
    bpm = Column(Integer)
    temperature = Column(Float)
    user = relationship('User', back_populates='measurements')