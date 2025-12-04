from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQL_ALCHEMY_DATABASE_URL = 'postgresql+psycopg://postgres:109789090054HG911@localhost/vital_sphere'

engine = create_engine(SQL_ALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

