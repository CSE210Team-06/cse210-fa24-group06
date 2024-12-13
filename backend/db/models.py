"""
Stores SQLAlchemy models for database schema
"""

from sqlalchemy import Column, Integer, String, ForeignKey, create_engine, Index, Table

# from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime, timezone
from sqlalchemy.orm import relationship


Base = declarative_base()

"""
Table to enable many-to-many relationship between Tag and Journal
"""
journals_and_tags = Table(
    "journals_and_tags",
    Base.metadata,
    Column("journal_id", Integer, ForeignKey("journal.journal_id")),
    Column("tag_id", Integer, ForeignKey("tag.tag_id")),
)


class Journal(Base):
    __tablename__ = "journal"

    journal_id = Column(Integer, primary_key=True, index=True)  # PK
    group_id = Column(
        Integer, index=True, nullable=True
    )  # FK references Group.group_id
    journal_title = Column(String, nullable=False)
    created_at = Column(String, default=datetime.now(timezone.utc))
    updated_at = Column(
        String, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc)
    )

    # Relationship to Entry (One-to-Many)
    entries = relationship(
        "Entry", back_populates="journal", cascade="all, delete-orphan"
    )

    # Relationship to User (Many-to-One)
    user_id = Column(Integer, ForeignKey("user.user_id"))
    user = relationship("User", back_populates="journals")

    # Relationship to Tag (Many-to-Many)
    tags = relationship("Tag", secondary=journals_and_tags, back_populates="journals")

    codes = relationship(
        "CodeSnippet", back_populates="journal", cascade="all, delete-orphan"
    )


# code Model
class CodeSnippet(Base):
    __tablename__ = "code"

    code_id = Column(Integer, primary_key=True, index=True)
    journal_id = Column(Integer, ForeignKey("journal.journal_id"), nullable=False)
    code_text = Column(String, nullable=False)
    language = Column(String, nullable=False)
    page_number = Column(Integer, nullable=False, default=0)
    created_at = Column(String, default=datetime.now(timezone.utc))
    updated_at = Column(
        String, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc)
    )
    journal = relationship("Journal", back_populates="codes")

    # Ensures that the codes for a journal are ordered
    __table_args__ = (Index("ix_code_journal_page", "journal_id", "page_number"),)


# Group Model
class Group(Base):
    __tablename__ = "group"

    group_id = Column(Integer, primary_key=True, index=True)
    group_name = Column(String, nullable=False)
    group_desc = Column(String, nullable=True)
    created_at = Column(String)
    updated_at = Column(String)


# User Model
class User(Base):
    __tablename__ = "user"

    user_id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)

    # Relationship to Journal (One-to-Many)
    journals = relationship(
        "Journal", back_populates="user", cascade="all, delete-orphan"
    )


# Entry Model
class Entry(Base):
    __tablename__ = "entry"

    entry_id = Column(Integer, primary_key=True, index=True)  # PK
    journal_id = Column(
        Integer, ForeignKey("journal.journal_id"), nullable=False
    )  # FK references Journal.journal_id
    entry_text = Column(String, nullable=False)
    word_count = Column(Integer, nullable=True)  # DB handles this
    page_number = Column(
        Integer, nullable=False
    )  # Added field to represent the order of pages

    # Relationship back to Journal (Many-to-One)
    journal = relationship("Journal", back_populates="entries")

    # Ensures that the entries for a journal are ordered
    __table_args__ = (
        Index(
            "ix_entry_journal_page", "journal_id", "page_number"
        ),  # Index to optimize page_number lookups
    )


# Tag Model
class Tag(Base):
    __tablename__ = "tag"

    tag_id = Column(Integer, primary_key=True, index=True)  # PK
    tag_name = Column(String, nullable=False, unique=True)

    # Relationship to Journal (Many-to-Many)
    journals = relationship(
        "Journal", secondary="journals_and_tags", back_populates="tags"
    )


# Create the DB
DATABASE_URL = "sqlite:///./journaler.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create all tables in the database
Base.metadata.create_all(bind=engine)
