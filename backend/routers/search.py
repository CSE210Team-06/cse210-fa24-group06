from fastapi import HTTPException, Depends, status, APIRouter
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


@router.get("/search_entry")
def search_entry(auth_token: str, search_text: str, db: Session = Depends(get_db)):
    """
    Search for a text in all entries of all journals owned by the user.
    """
    # Verify the token and get the email
    user_email = verify_token(auth_token)

    # Get all journals owned by the user
    db_journals = db.query(models.Journal).filter(models.Journal.user.has(email=user_email)).all()
    if not db_journals:
        raise HTTPException(status_code=404, detail="No journals found for the user")

    results = []

    # Search for the text in all entries of the user's journals
    for journal in db_journals:
        entries = db.query(models.Entry).filter(models.Entry.journal_id == journal.journal_id).all()
        for entry in entries:
            start_idx = entry.entry_text.find(search_text)
            if start_idx != -1:
                results.append({
                    "journal_id": journal.journal_id,
                    "entry_id": entry.entry_id,
                    "char_index": start_idx
                })

    if not results:
        return {"status": "success", "message": "No matching entries found"}

    return {"status": "success", "matches": results}


@router.get("/search_entry_in_journal")
def search_entry_in_journal(auth_token: str, journal_id: int, search_text: str, db: Session = Depends(get_db)):
    """
    Search for a text in entries of a specific journal owned by the user.
    """
    # Verify the token and get the email
    user_email = verify_token(auth_token)

    # Get the journal by ID and check ownership
    db_journal = db.query(models.Journal).filter(models.Journal.journal_id == journal_id).first()
    if not db_journal:
        raise HTTPException(status_code=404, detail="Journal not found")

    if db_journal.user.email != user_email:
        raise HTTPException(status_code=403, detail="Not authorized to access this journal")

    results = []

    # Search for the text in entries of the specified journal
    entries = db.query(models.Entry).filter(models.Entry.journal_id == journal_id).all()
    for entry in entries:
        start_idx = entry.entry_text.find(search_text)
        if start_idx != -1:
            results.append({
                "entry_id": entry.entry_id,
                "char_index": start_idx
            })

    if not results:
        return {"status": "success", "message": "No matching entries found in the journal"}

    return {"status": "success", "matches": results}

