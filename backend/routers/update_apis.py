from fastapi import HTTPException, Depends, status, APIRouter
from sqlalchemy.orm import Session
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


@router.put("/update_user_first_name")
def update_user_first_name(auth_token: str, first_name: str, db: Session = Depends(get_db)):
    # Verify the token and get the email
    user_email = verify_token(auth_token)

    # Find the user in the database
    db_user = db.query(models.User).filter(models.User.email == user_email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update the first name
    db_user.first_name = first_name
    db.commit()
    db.refresh(db_user)

    return {"status": "success", "updated_first_name": db_user.first_name}



@router.put("/update_user_last_name")
def update_user_last_name(auth_token: str, last_name: str, db: Session = Depends(get_db)):
    # Verify the token and get the email
    user_email = verify_token(auth_token)

    # Find the user in the database
    db_user = db.query(models.User).filter(models.User.email == user_email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update the last name
    db_user.last_name = last_name
    db.commit()
    db.refresh(db_user)

    return {"status": "success", "updated_last_name": db_user.last_name}



@router.put("/update_user_entry")
def update_entry(auth_token: str, page_num: int, journal_id: int, entry_text: str, db: Session = Depends(get_db)):
    # Verify the token and get the email
    user_email = verify_token(auth_token)

    # Find the journal entry by journal_id and page_num (or some other criteria)
    db_entry = db.query(models.Entry).filter(models.Entry.journal_id == journal_id,
                                             models.Entry.page_number == page_num).first()
    if not db_entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    # Find the journal to check if the user owns it
    db_journal = db.query(models.Journal).filter(models.Journal.journal_id == journal_id).first()
    if not db_journal:
        raise HTTPException(status_code=404, detail="Journal not found")

    # Check if the user is the owner of the journal
    if db_journal.user.email != user_email:
        raise HTTPException(status_code=403, detail="Not authorized to modify this journal")

    # Update the entry text
    db_entry.entry_text = entry_text
    db.commit()
    db.refresh(db_entry)

    return {"status": "success", "updated_entry_text": db_entry.entry_text}


@router.put("/update_journal")
def update_journal(auth_token: str, journal_id: int, journal_title: str, db: Session = Depends(get_db)):
    # Verify the token and get the email
    user_email = verify_token(auth_token)

    # Find the journal entry by journal_id
    db_journal = db.query(models.Journal).filter(models.Journal.journal_id == journal_id).first()
    if not db_journal:
        raise HTTPException(status_code=404, detail="Journal not found")

    # Check if the user is the owner of the journal
    if db_journal.user.email != user_email:
        raise HTTPException(status_code=403, detail="Not authorized to modify this journal")

    # Update the journal title and updated_at field
    db_journal.journal_title = journal_title
    db_journal.updated_at = datetime.now(timezone.utc)  # Set updated_at to current UTC time
    db.commit()
    db.refresh(db_journal)

    return {"status": "success", "updated_journal_title": db_journal.journal_title}

@router.put("/update_tag_name")
def update_tag_name(auth_token: str, tag_id: int, new_name: str, db: Session = Depends(get_db)):
    '''
    Updates the name of a tag with the given tag_id.
    '''

    # Verify the token and get the email
    user_email = verify_token(auth_token)

    # Find the tag by tag_id
    db_tag = db.query(models.Tag).filter(models.Tag.tag_id == tag_id).first()
    if not db_tag:
        raise HTTPException(status_code=404, detail="Tag not found")

    # Update the tag name
    db_tag.tag_name = new_name
    db.commit()
    db.refresh(db_tag)

    return {"status": "success", "updated_tag_name": db_tag.tag_name}

@router.put("/add_tag_to_journal")
def add_tag_to_journal(auth_token: str, journal_id: int, tag_id: int, db: Session = Depends(get_db)):
    '''
    Adds a tag to a journal by creating a new entry in the journals_and_tags table.
    '''

    # Verify the token and get the email
    user_email = verify_token(auth_token)

    # Create a new entry in the journals_and_tags table
    new_entry = models.journals_and_tags.insert().values(journal_id=journal_id, tag_id=tag_id)

    # Return status 
    return {"status": "success", "message": "Tag added to journal successfully"}

@router.put("/delete_tag_from_journal")
def delete_tag_from_journal(auth_token: str, journal_id: int, tag_id: int, db: Session = Depends(get_db)):
    '''
    Deletes a tag from a journal by deleting the entry in the journals_and_tags table.
    '''

    # Verify the token and get the email
    user_email = verify_token(auth_token)

    # Delete the entry in the journals_and_tags table
    db.execute(models.journals_and_tags.delete().where(models.journals_and_tags.c.journal_id == journal_id).where(models.journals_and_tags.c.tag_id == tag_id))

    # Return status 
    return {"status": "success", "message": "Tag deleted from journal successfully"}