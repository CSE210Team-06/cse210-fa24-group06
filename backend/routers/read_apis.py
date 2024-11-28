from fastapi import HTTPException, Depends, status, APIRouter
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from db import models, schemas
from auth import verify_token
from db.database import SessionLocal
from datetime import datetime, timedelta, timezone

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/read_entry")
def read_entry(auth_token: str, journal_id: int, page_num: int, db: Session = Depends(get_db)):
    # Find the entry in the database
    db_entry = db.query(models.Entry).filter(models.Entry.journal_id == journal_id, models.Entry.page_number == page_num).first()


    # Return entry information
    return {"status": "success", "entry_id": db_entry.entry_id, "page_number": db_entry.page_number,
            "entry_text": db_entry.entry_text, "journal_id": db_entry.journal_id}


@router.get("/read_journal")
def read_journal(auth_token: str, journal_id: int, db: Session = Depends(get_db)):
    # Find the journal in the database
    db_journal = db.query(models.Journal).filter(models.Journal.journal_id == journal_id).first()


    # Return journal information
    return {"status": "success", "journal_id": db_journal.journal_id, "journal_title": db_journal.journal_title,
            "created_at": db_journal.created_at, "updated_at": db_journal.updated_at}