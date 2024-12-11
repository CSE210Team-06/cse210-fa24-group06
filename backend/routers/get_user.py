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


@router.get("/user_details")
def get_user_details(auth_token: str, db: Session = Depends(get_db)):
    # Verify the token and extract the email
    user_email = verify_token(auth_token)

    # Fetch user details from the database
    db_user = db.query(models.User).filter(models.User.email == user_email).first()

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    # Return user details
    return {
        "status": "success",
        "user_id": db_user.user_id,
        "first_name": db_user.first_name,
        "last_name": db_user.last_name,
        "email": db_user.email,
    }


# get all journals for a user
@router.get("/user_journals")
def get_user_journals(auth_token: str, db: Session = Depends(get_db)):

    # Verify the token and get the email
    user_email = verify_token(auth_token)

    # Find the user
    user = db.query(models.User).filter(models.User.email == user_email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Find all journals for the user
    journals = (
        db.query(models.Journal).filter(models.Journal.user_id == user.user_id).all()
    )

    if not journals:
        return {"status": "success", "message": "No journals found for this user"}

    result = [
        {"journal_id": journal.journal_id, "journal_title": journal.journal_title}
        for journal in journals
    ]

    return {"status": "success", "journals": result}


# get all the codes for a journal
@router.get("/journal_codes")
def get_journal_codes(
    auth_token: str, journal_id: int, db: Session = Depends(get_db)
):

    # Verify the token and get the email
    user_email = verify_token(auth_token)

    # Find the journal in the database
    db_journal = (
        db.query(models.Journal).filter(models.Journal.journal_id == journal_id).first()
    )
    if not db_journal:
        raise HTTPException(status_code=404, detail="Journal not found")

    # Check if the journal belongs to the user
    if db_journal.user.email != user_email:
        raise HTTPException(
            status_code=403, detail="Not authorized to access this journal"
        )

    # Retrieve all codes for the journal
    codes = db.query(models.CodeSnippet).filter(models.CodeSnippet.journal_id == journal_id).all()

    if not codes:
        return {"status": "success", "message": "No codes found for this journal"}

    result = [
        {"code_id": code.code_id, "entry_text": code.code_text}
        for code in codes
    ]

    return {"status": "success", "codes": result}

# get all the entries for a journal
@router.get("/journal_entries")
def get_journal_entries(
    auth_token: str, journal_id: int, db: Session = Depends(get_db)
):

    # Verify the token and get the email
    user_email = verify_token(auth_token)

    # Find the journal in the database
    db_journal = (
        db.query(models.Journal).filter(models.Journal.journal_id == journal_id).first()
    )
    if not db_journal:
        raise HTTPException(status_code=404, detail="Journal not found")

    # Check if the journal belongs to the user
    if db_journal.user.email != user_email:
        raise HTTPException(
            status_code=403, detail="Not authorized to access this journal"
        )

    # Retrieve all entries for the journal
    entries = db.query(models.Entry).filter(models.Entry.journal_id == journal_id).all()

    if not entries:
        return {"status": "success", "message": "No entries found for this journal"}

    result = [
        {"entry_id": entry.entry_id, "entry_text": entry.entry_text}
        for entry in entries
    ]

    return {"status": "success", "entries": result}
