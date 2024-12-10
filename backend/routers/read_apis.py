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
def read_entries(auth_token: str, entry_id: int, db: Session = Depends(get_db)):
    """
    Retrieve the text of a specific journal entry by entry_id.
    """
    # Verify the token and get the email
    user_email = verify_token(auth_token)

    # Find the entry by entry_id
    db_entry = db.query(models.Entry).filter(models.Entry.entry_id == entry_id).first()
    if not db_entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    # Check if the user owns the journal the entry belongs to
    db_journal = (
        db.query(models.Journal)
        .filter(models.Journal.journal_id == db_entry.journal_id)
        .first()
    )
    if not db_journal or db_journal.user.email != user_email:
        raise HTTPException(
            status_code=403, detail="Not authorized to access this entry"
        )

    return {"status": "success", "entry_text": db_entry.entry_text}


@router.get("/read_journal")
def read_journal(auth_token: str, journal_id: int, db: Session = Depends(get_db)):
    """
    Retrieve all entries for a specific journal by journal_id.
    """
    # Verify the token and get the email
    user_email = verify_token(auth_token)

    # Find the journal by journal_id and check ownership
    db_journal = (
        db.query(models.Journal).filter(models.Journal.journal_id == journal_id).first()
    )
    
    if not db_journal:
        raise HTTPException(status_code=404, detail="Journal not found")

    if db_journal.user.email != user_email:
        raise HTTPException(
            status_code=403, detail="Not authorized to access this journal"
        )

    # Retrieve all entries for the journal
    entries = db.query(models.Entry).filter(models.Entry.journal_id == journal_id).all()

    if not entries:
        return {"status": "success", "message": "No entries found for this journal"}
    
    result = [
        {
            "entry_id": entry.entry_id,
            "entry_text": entry.entry_text,
            "journal_title": db_journal.journal_title,
        }
        for entry in entries
    ]
    print(result)
    return {"status": "success", "entries": result}
 
@router.get("/get_journals_by_tags")
def read_journal_by_tags(auth_token: str, tag_id: int, db: Session = Depends(get_db)):
    """
    Retrieve all entries for a specific journal by tag_id.
    NOTE: This method retrieves just the journal ids; to retrieve the entries, use the /read_journal endpoint for each journal_id.
    """
    # Verify the token and get the email
    user_email = verify_token(auth_token)

    # Check if tag exists
    db_tag = db.query(models.Tag).filter(models.Tag.tag_id == tag_id).first()
    if not db_tag:
        raise HTTPException(status_code=404, detail="Tag not found")

    # Find all journals with the tag
    journals = db.query(models.journals_and_tags).filter(models.journals_and_tags.c.tag_id == tag_id).all()
    if not journals:
        return {"status": "success", "message": "No journals found for this tag"}
    
    result = [{"journal_id": journal.journal_id} for journal in journals]
    return {"status": "success", "journals": result}

@router.get("/get_tags_by_journal")
def get_tags_by_journal(auth_token: str, journal_id: int, db: Session = Depends(get_db)):
    """
    Retrieves all tags for a specific journal by journal_id
    """
    
    # Verify the token and get the email
    user_email = verify_token(auth_token)
    
     # Check if journal exists, and if we have permission to read it
    db_journal = db.query(models.Journal).filter(models.Journal.journal_id == journal_id).first()
    if not db_journal:
        raise HTTPException(status_code=404, detail="Journal not found")
    
    if db_journal.user.email != user_email:
        raise HTTPException(status_code=403, detail="Not authorized to access this journal")
    
    # Find all tags for the journal
    tags = db.query(models.journals_and_tags).filter(models.journals_and_tags.c.journal_id == journal_id).all()
    if not tags:
        return {"status": "success", "message": "No tags found for this journal"}
        #return db.query(models.Tag).all() #sanity check 
    
    result = [{"tag_id": tag.tag_id} for tag in tags]
    return {"status": "success", "tags": result}

@router.get("/get_tag_name")
def get_tag_name(auth_token: str, tag_id: int, db: Session = Depends(get_db)):
    """
    Retrieves the name of a tag by tag_id
    """
    # Verify the token and get the email
    user_email = verify_token(auth_token)

    # Check if tag exists
    db_tag = db.query(models.Tag).filter(models.Tag.tag_id == tag_id).first()
    if not db_tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    
    return {"status": "success", "tag_name": db_tag.tag_name}

@router.get("/get_all_tags")
def get_all_tags(auth_token: str, db: Session = Depends(get_db)):
    """
    Retrieves all tags in the database (no duplicates)
    """
    # Verify the token and get the email
    user_email = verify_token(auth_token)

    # Get all tags
    tags = db.query(models.Tag).distinct().all()
    if not tags:
        return {"status": "success", "message": "No tags found in the database"}
    
    result = [{"tag_id": tag.tag_id, "tag_name": tag.tag_name} for tag in tags]
    return {"status": "success", "tags": result}
    
@router.get("/read_group")
def read_group(auth_token: str, group_id: int, db: Session = Depends(get_db)):
    """
    Retrieve all journals associated with a group via group_id.
    """
    # Verify the token and get the email
    user_email = verify_token(auth_token)
    
    # Query the database for all journals with a specific group id
    db_journals = (
        db.query(models.Journal).filter(models.Journal.group_id == group_id).all()
    )
    if not db_journals:
        raise HTTPException(status_code=404, detail="Group is empty or does not exist")

    # Check if the user is the owner of the group
    if db_journals.user.email != user_email:
        raise HTTPException(
            status_code=403, detail="Not authorized to access this group"
        )

    # Return the list of journal ids
    result = [{"journal_id": journal.journal_id} for journal in db_journals]
    return {"status": "success", "journals": result}
