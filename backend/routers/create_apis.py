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


@router.post("/create_journal")
def create_journal(auth_token: str, journal_title: str, db: Session = Depends(get_db)):
    # Verify the token and get the email

    user_email = verify_token(auth_token)

    # get user id from db

    user = db.query(models.User).filter(models.User.email == user_email).first()

    uid = user.user_id

    # Create a new journal with no entries
    new_journal = models.Journal(
        journal_title=journal_title,
        created_at=func.now(),
        updated_at=func.now(),
        user_id=uid,
    )  # TODO: see if user_email is the correct field

    # Insert the journal into the database
    db.add(new_journal)
    db.commit()
    db.refresh(new_journal)

    # TODO: determine if try-catch blocks are good ideas

    return {
        "status": "success",
        "journal_id": new_journal.journal_id,
        "journal_title": new_journal.journal_title,
        "created_at": new_journal.created_at,
        "updated_at": new_journal.updated_at,
    }


@router.post("/create_group")
def create_group(
    auth_token: str,
    group_name: str,
    group_desc: str = None,
    db: Session = Depends(get_db),
):

    # Verify the token and get the email
    user_email = verify_token(
        auth_token
    )  # TODO: determine if user_email will also be used in group creation

    # Create a new group
    new_group = models.Group(
        group_name=group_name,
        group_desc=group_desc,
        created_at=func.now(),
        updated_at=func.now(),
    )

    # Insert the group into the database
    db.add(new_group)
    db.commit()
    db.refresh(new_group)

    return {
        "status": "success",
        "group_id": new_group.group_id,
        "group_name": new_group.group_name,
        "group_desc": new_group.group_desc,
        "created_at": new_group.created_at,
        "updated_at": new_group.updated_at,
    }

@router.post("/create_codes")
def create_codes(
    auth_token: str, 
    journal_id: int, 
    code_text: str, 
    Language: str, 
    db: Session = Depends(get_db)
    ):
    # Verify the token and get the email
    user_email = verify_token(auth_token)


    # Find the journal in the database
    db_journal = db.query(models.Journal).filter(models.Journal.journal_id == journal_id).first()
    if not db_journal:
        raise HTTPException(status_code=404, detail="Journal not found")


    # Check if the user is the owner of the journal
    if db_journal.user.email != user_email:
        raise HTTPException(status_code=403, detail="Not authorized to modify this journal")


    # Create a new entry
    new_codes = models.CodeSnippet(
        code_text=code_text, 
        Language=Language, 
        journal_id=journal_id, 
        created_at=func.now(), 
        updated_at=func.now()
        )


    # Insert the entry into the database
    db.add(new_codes)
    db.commit()
    db.refresh(new_codes)


    return {
        "status": "success", 
        "code_id": new_codes.code_id, 
        "code_text": new_codes.code_text,
        "Language": new_codes.language, 
        "journal_id": new_codes.journal_id,
        "created_at": new_codes.created_at,
        "updated_at": new_codes.updated_at,
        }

@router.post("/create_code")
def create_code(
    auth_token: str, journal_id: int, code_text: str, db: Session = Depends(get_db)
):
    # Verify the token and get the email
    user_email = verify_token(auth_token)

    # get all codes for the journal

    # Find the journal in the database
    db_journal = (
        db.query(models.Journal).filter(models.Journal.journal_id == journal_id).first()
    )
    if not db_journal:
        raise HTTPException(status_code=404, detail="Journal not found")

    # Check if the user is the owner of the journal
    if db_journal.user.email != user_email:
        raise HTTPException(
            status_code=403, detail="Not authorized to modify this journal"
        )

    codes = db.query(models.CodeSnippet).filter(models.CodeSnippet.journal_id == journal_id).all()

    # get the last page number
    last_page = 0
    for code in codes:
        if code.page_number > last_page:
            last_page = code.page_number

    # Create a new code
    new_code = models.CodeSnippet(
        page_number=last_page, code_text=code_text, journal_id=journal_id
    )  # TODO: determine if page_num should be generated instead

    # Insert the code into the database
    db.add(new_code)
    db.commit()
    db.refresh(new_code)

    return {
        "status": "success",
        "code_id": new_code.code_id,
        "page_number": new_code.page_number,
        "code_text": new_code.code_text,
        "journal_id": new_code.journal_id,
    }

@router.post("/create_entry")
def create_entry(
    auth_token: str, journal_id: int, entry_text: str, db: Session = Depends(get_db)
):
    # Verify the token and get the email
    user_email = verify_token(auth_token)

    # get all entries for the journal

    # Find the journal in the database
    db_journal = (
        db.query(models.Journal).filter(models.Journal.journal_id == journal_id).first()
    )
    if not db_journal:
        raise HTTPException(status_code=404, detail="Journal not found")

    # Check if the user is the owner of the journal
    if db_journal.user.email != user_email:
        raise HTTPException(
            status_code=403, detail="Not authorized to modify this journal"
        )

    entries = db.query(models.Entry).filter(models.Entry.journal_id == journal_id).all()

    # get the last page number
    last_page = 0
    for entry in entries:
        if entry.page_number > last_page:
            last_page = entry.page_number

    # Create a new entry
    new_entry = models.Entry(
        page_number=last_page, entry_text=entry_text, journal_id=journal_id
    )  # TODO: determine if page_num should be generated instead

    # Insert the entry into the database
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)

    return {
        "status": "success",
        "entry_id": new_entry.entry_id,
        "page_number": new_entry.page_number,
        "entry_text": new_entry.entry_text,
        "journal_id": new_entry.journal_id,
    }

@router.post("/create_tag")
def create_tag(auth_token: str, tag_name: str, db: Session = Depends(get_db)):
    # Verify the token and get the email
    #user_email = verify_token(auth_token)

    # Create a new tag entry
    new_tag = models.Tag(tag_name=tag_name)

    # Insert the tag into the database
    db.add(new_tag)
    db.commit()
    db.refresh(new_tag)

    return {"status": "success", "tag_id": new_tag.tag_id, "tag_name": new_tag.tag_name}
