'''
Stores SQLAlchemy models for database schema
'''
from sqlalchemy import Column, Integer, String, ForeignKey, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import declarative_base, sessionmaker

from datetime import datetime

Base = declarative_base()

class CodeSnippet(Base):
    __tablename__ = 'code'

    code_id = Column(Integer, primary_key=True, index=True)
    journal_id = Column(Integer, ForeignKey('journal.journal_id'), nullable=False)
    code_text = Column(String, nullable=False)
    Language = Column(String, nullable=False)
    created_at = Column(String, default=datetime.now(datetime.timezone.utc)) 
    updated_at = Column(String, default=datetime.now(datetime.timezone.utc), onupdate=datetime.now(datetime.timezone.utc))

DATABASE_URL = "sqlite:///./codesnippets.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)