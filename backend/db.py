from contextlib import contextmanager
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

PAYMATE_DB = 'postgresql://postgres:admin@localhost:5432/paymate'

engine = create_engine(PAYMATE_DB)

sessionLocal = sessionmaker(autocommit=False,autoflush=False,bind=engine)

Base = declarative_base()

def get_session():
    db = sessionLocal()
    try:
        yield db
    finally:
        db.close()

get_db = contextmanager(get_session)
