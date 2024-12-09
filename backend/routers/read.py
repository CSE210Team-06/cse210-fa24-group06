from fastapi import HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
from db import models
from auth import verify_token
from db.database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/read_entries")
def read_entries(auth_token: str, journal_id: int, page_number: int, db: Session = Depends(get_db)):
    """
    Retrieve the text of a specific journal entry by entry_id.
    """
    # Verify the token and get the email
    user_email = verify_token(auth_token)

    # Find the entry by entry_id
    db_entry = db.query(models.Entry).filter(models.Entry.journal_id == journal_id, models.Entry.page_number == page_number).first()
    if not db_entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    # Check if the user owns the journal the entry belongs to
    db_journal = db.query(models.Journal).filter(models.Journal.journal_id == db_entry.journal_id).first()
    if not db_journal or db_journal.user.email != user_email:
        raise HTTPException(status_code=403, detail="Not authorized to access this entry")

    return {"status": "success", "entry_text": db_entry.entry_text}


@router.get("/read_journal")
def read_journal(auth_token: str, journal_id: int, db: Session = Depends(get_db)):
    """
    Retrieve all entries for a specific journal by journal_id.
    """
    # Verify the token and get the email
    user_email = verify_token(auth_token)

    # Find the journal by journal_id and check ownership
    db_journal = db.query(models.Journal).filter(models.Journal.journal_id == journal_id).first()
    if not db_journal:
        raise HTTPException(status_code=404, detail="Journal not found")

    if db_journal.user.email != user_email:
        raise HTTPException(status_code=403, detail="Not authorized to access this journal")

    # Retrieve all entries for the journal
    entries = db.query(models.Entry).filter(models.Entry.journal_id == journal_id).all()

    if not entries:
        return {"status": "success", "message": "No entries found for this journal"}

    result = [{"entry_id": entry.entry_id, "entry_text": entry.entry_text} for entry in entries]

    return {"status": "success", "entries": result}
