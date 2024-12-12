"""
Responsible for creating the database connection and session by defining a dependency. 
An engine is created to connect to the database, and a session is created to interact with the database.
Foreign key constraints are enabled for SQLite databases.

Functions:
    get_db: Dependency to get the DB session
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
    """
    Enables foreign key constraints for SQLite databases.

    Args:
        dbapi_connection: The connection to the database
        connection_record: Unused parameter
    """
    if DATABASE_URL.startswith("sqlite"):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """
    Retrieves the DB session
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
