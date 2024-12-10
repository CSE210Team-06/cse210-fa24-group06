'''
Stores SQLAlchemy models for database schema
'''
from sqlalchemy import Column, Integer, String, ForeignKey, create_engine, Index
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime,timezone
from sqlalchemy.orm import relationship

Base = declarative_base()


class Journal(Base):
    __tablename__ = 'journal'

    journal_id = Column(Integer, primary_key=True, index=True)  # PK
    group_id = Column(Integer, index=True, nullable=True)  # FK references Group.group_id
    journal_title = Column(String, nullable=False)
    created_at = Column(String, default=datetime.now(timezone.utc))
    updated_at = Column(String, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    # Relationship to Entry (One-to-Many)
    entries = relationship("Entry", back_populates="journal", cascade="all, delete-orphan")

    # Relationship to User (Many-to-One)
    user_id = Column(Integer, ForeignKey('user.user_id'))
    user = relationship("User", back_populates="journals")


# Group Model
class Group(Base):
    __tablename__ = 'group'

    group_id = Column(Integer, primary_key=True, index=True)
    group_name = Column(String, nullable=False)
    group_desc = Column(String, nullable=True)
    created_at = Column(String)
    updated_at = Column(String)
    user_id = Column(Integer, ForeignKey('user.user_id'), nullable=False, index=True) # FK references User.user_id 

    # Relationship to User (Many Groups to One User)
    user = relationship("User", back_populates="groups", cascade="all, delete-orphan", single_parent=True)


# User Model
class User(Base):
    __tablename__ = 'user'

    user_id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)

    # Relationship to Journal (One-to-Many)
    journals = relationship("Journal", back_populates="user", cascade="all, delete-orphan")

    # Relationship to Group (One-to-Many)
    groups = relationship("Group", back_populates="user", cascade="all, delete-orphan")


# Entry Model
class Entry(Base):
    __tablename__ = 'entry'

    entry_id = Column(Integer, primary_key=True, index=True)  # PK
    journal_id = Column(Integer, ForeignKey('journal.journal_id'), nullable=False)  # FK references Journal.journal_id
    entry_text = Column(String, nullable=False)
    word_count = Column(Integer, nullable=True)  # DB handles this
    page_number = Column(Integer, nullable=False)  # Added field to represent the order of pages

    # Relationship back to Journal (Many-to-One)
    journal = relationship("Journal", back_populates="entries")

    # Ensures that the entries for a journal are ordered
    __table_args__ = (
        Index('ix_entry_journal_page', 'journal_id', 'page_number'),  # Index to optimize page_number lookups
    )


# because DB handles this

# Create the DB
DATABASE_URL = "sqlite:///./journaler.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create all tables in the database
Base.metadata.create_all(bind=engine)