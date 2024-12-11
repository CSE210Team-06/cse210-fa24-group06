"""
Helps validate requests and responses to and from the database.
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime, timezone
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

"""
BaseModels are used to validate the request body of some requests.
Some fields are optional because they are not required for the request, and are instead generated by DB
"""


class JournalBase(BaseModel):
    journal_id: Optional[int] = None  # PK
    group_id: Optional[int] = None  # FK references Group.group_id
    journal_title: str
    created_at: Optional[datetime] = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )  # using a factory prevents all instances from having the same time
    updated_at: Optional[datetime] = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    """
    Required when working with SQLAlchemy ORM
    """

    class Config:
        orm_mode = True


class GroupBase(BaseModel):
    group_id: Optional[int]  # PK
    group_name: str
    group_desc: Optional[str] = None
    created_at: Optional[datetime] = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: Optional[datetime] = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    user_id: Optional[int] = None
    first_name: str
    last_name: str
    email: EmailStr  # Pydantic type that ensures correct format

    class Config:
        orm_mode = True


class UserCreate(UserBase):
    password: str  # Password is required only during signup


class UserInDB(UserBase):
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class LoginRequest(BaseModel):
    email: str
    password: str

    class Config:
        # Ensures the input is compatible with SQLAlchemy models (ORM)
        orm_mode = True


class EntryBase(BaseModel):
    entry_id: Optional[int] = None  # PK
    journal_id: int  # FK references Journal.journal_id
    entry_text: str
    word_count: Optional[int] = None  # generated by DB

    class Config:
        orm_mode = True

class TagBase(BaseModel):
    tag_id: Optional[int] = None # PK
    tag_name: str

    class Config:
        orm_mode = True


"""
These classes are used to create new items via API request.
They involve fields involved from request
"""


class JournalCreate(BaseModel):
    journal_title: str
    group_id: Optional[int]  # Journals can be created without a group


class GroupCreate(BaseModel):
    group_name: str
    group_desc: Optional[str]  # Optional description


class EntryCreate(BaseModel):
    journal_id: int
    entry_text: str

class TagCreate(BaseModel):
    tag_name: str


#These classes represent the actual data of the items.
#Empty for now because they inherit all necessary info from the BaseModels

class Journal(JournalBase):
    pass


class Group(GroupBase):
    pass


class User(UserBase):
    pass


class Entry(EntryBase):
    pass
