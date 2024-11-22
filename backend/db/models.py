'''
Stores SQLAlchemy models for database schema
'''
from sqlalchemy import Column, Integer, String, ForeignKey, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import declarative_base, sessionmaker

Base = declarative_base()

class Journal(Base):
    __tablename__ == 'journal'

    journal_id = Column(Integer, primary_key=True, index=True)
    journal_text = Column(String)
    group_id = Column(Integer, index=True)
    journal_title = Column(String)
    created_at = Column(String) # SQLite doesn't have a datetime type, so we will store dates as ISO8601 Strings
    updated_at = Column(String)

class Group(Base):
    __tablename__ == 'group'

    group_id = Column(Integer, primary_key=True, index=True)
    group_name = Column(String)
    group_desc = Column(String)
    created_at = Column(String)
    updated_at = Column(String)