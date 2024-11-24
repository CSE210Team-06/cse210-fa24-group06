'''
Stores SQLAlchemy models for database schema
'''
from sqlalchemy import Column, Integer, String, ForeignKey, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime,timezone

Base = declarative_base()

class Journal(Base):
    __tablename__ = 'journal'

    journal_id = Column(Integer, primary_key=True, index=True) # PK
    group_id = Column(Integer, index=True, nullable=True)  # FK references Group.group_id
    journal_title = Column(String, nullable=False)
    created_at = Column(String, default=datetime.now(timezone.utc)) # Set as String here, but will be datetime in schemas. This is okay.
    updated_at = Column(String, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

class Group(Base):
    __tablename__ = 'group'

    group_id = Column(Integer, primary_key=True, index=True)
    group_name = Column(String, nullable=False)
    group_desc = Column(String, nullable=True)
    created_at = Column(String)
    updated_at = Column(String)

class User(Base):
    __tablename__ = 'user'

    user_id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)

class Entry(Base):
    __tablename__ = 'entry'

    entry_id = Column(Integer, primary_key=True, index=True)
    journal_id = Column(Integer, ForeignKey('journal.journal_id'), nullable=False) # FK references Journal.journal_id
    entry_text = Column(String, nullable=False)
    word_count = Column(Integer, nullable=True) # because DB handles this

# Create the DB
DATABASE_URL = "sqlite:///./journaler.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create all tables in the database
Base.metadata.create_all(bind=engine)