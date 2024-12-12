"""
Responsible for creating the database connection and session by defining a dependency
"""

from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker

# from .models import Base

DATABASE_URL = "sqlite:///./journaler.db"

# engine and session
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    pool_pre_ping=True,  # Helps handle stale connections for efficieny
)


# to enable foreign key constraints for SQLite
@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    if DATABASE_URL.startswith("sqlite"):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
