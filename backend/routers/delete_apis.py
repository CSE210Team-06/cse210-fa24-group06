from fastapi import HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
from backend.db import models
from backend.auth import verify_token
from backend.db.database import SessionLocal
from datetime import datetime

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.delete("/delete_user")
def delete_user(auth_token: str, db: Session = Depends(get_db)):
    """
    Deletes a user from the database.
    """
    # Verify the token and get the email
    user_email = verify_token(auth_token)

    # Delete the user
    user = db.query(models.User).filter(models.User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()

    return {"status": "success", "message": "User deleted successfully"}


@router.patch("/delete_from_group")
def delete_from_group(journal_id: int, db: Session = Depends(get_db)):
    """
    Removes a journal from a group and updates the updated_at field.
    """
    journal = (
        db.query(models.Journal).filter(models.Journal.journal_id == journal_id).first()
    )
    if not journal:
        raise HTTPException(status_code=404, detail="Journal not found")

    journal.group_id = None
    journal.updated_at = datetime.utcnow()
    db.commit()

    return {"status": "success", "message": "Journal removed from group successfully"}


@router.delete("/delete_codes")
def delete_codes(
    auth_token: str, journal_id: int, page_num: int, db: Session = Depends(get_db)
):
    """
    Deletes code from a journal and shifts subsequent code snippets to left.
    """
    # Verify the token and get the email
    user_email = verify_token(auth_token)

    # Check if the journal belongs to the user
    journal = (
        db.query(models.Journal).filter(models.Journal.journal_id == journal_id).first()
    )
    if not journal:
        raise HTTPException(status_code=404, detail="Journal not found")

    if journal.user.email != user_email:
        raise HTTPException(
            status_code=403, detail="Not authorized to access this journal"
        )

    # Get the code to delete
    code = (
        db.query(models.CodeSnippet)
        .filter(
            models.CodeSnippet.journal_id == journal_id,
            models.CodeSnippet.page_number == page_num,
        )
        .first()
    )
    if not code:
        raise HTTPException(status_code=404, detail="Code not found")

    db.delete(code)

    # Shift subsequent codes left
    subsequent_codes = (
        db.query(models.CodeSnippet)
        .filter(
            models.CodeSnippet.journal_id == journal_id,
            models.CodeSnippet.page_number > page_num,
        )
        .all()
    )
    for subsequent_code in subsequent_codes:
        subsequent_code.code_id -= 1

    db.commit()

    return {
        "status": "success",
        "message": "Code deleted and entries shifted successfully",
    }


@router.delete("/delete_entry")
def delete_entry(
    auth_token: str, journal_id: int, page_num: int, db: Session = Depends(get_db)
):
    """
    Deletes an entry from a journal and shifts subsequent entries left.
    """
    # Verify the token and get the email
    user_email = verify_token(auth_token)

    # Check if the journal belongs to the user
    journal = (
        db.query(models.Journal).filter(models.Journal.journal_id == journal_id).first()
    )
    if not journal:
        raise HTTPException(status_code=404, detail="Journal not found")

    if journal.user.email != user_email:
        raise HTTPException(
            status_code=403, detail="Not authorized to access this journal"
        )

    # Get the entry to delete
    entry = (
        db.query(models.Entry)
        .filter(
            models.Entry.journal_id == journal_id, models.Entry.page_number == page_num
        )
        .first()
    )
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    db.delete(entry)

    # Shift subsequent entries left
    subsequent_entries = (
        db.query(models.Entry)
        .filter(
            models.Entry.journal_id == journal_id, models.Entry.page_number > page_num
        )
        .all()
    )
    for subsequent_entry in subsequent_entries:
        subsequent_entry.page_number -= 1

    db.commit()

    return {
        "status": "success",
        "message": "Entry deleted and entries shifted successfully",
    }


@router.delete("/delete_journal")
def delete_journal(auth_token: str, journal_id: int, db: Session = Depends(get_db)):
    """
    Deletes a journal and all its entries.
    """
    # Verify the token and get the email
    user_email = verify_token(auth_token)

    # Check if the journal belongs to the user
    journal = (
        db.query(models.Journal).filter(models.Journal.journal_id == journal_id).first()
    )
    if not journal:
        raise HTTPException(status_code=404, detail="Journal not found")

    if journal.user.email != user_email:
        raise HTTPException(
            status_code=403, detail="Not authorized to access this journal"
        )

    # Delete all entries in the journal
    db.query(models.Entry).filter(models.Entry.journal_id == journal_id).delete()

    # Delete the journal
    db.delete(journal)
    db.commit()

    return {
        "status": "success",
        "message": "Journal and its entries deleted successfully",
    }


@router.delete("/delete_group")
def delete_group(group_id: int, db: Session = Depends(get_db)):
    """
    Deletes a group without deleting the journals inside it.
    """
    group = db.query(models.Group).filter(models.Group.group_id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    # Set group_id to NULL for all journals in the group
    journals = (
        db.query(models.Journal).filter(models.Journal.group_id == group_id).all()
    )
    for journal in journals:
        journal.group_id = None

    # Delete the group
    db.delete(group)
    db.commit()

    return {
        "status": "success",
        "message": "Group deleted and journals unlinked successfully",
    }


@router.delete("/delete_tag")
def delete_tag(tag_id: int, db: Session = Depends(get_db)):
    """
    Deletes a tag and removes it from all journals.
    """
    tag = db.query(models.Tag).filter(models.Tag.tag_id == tag_id).first()
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")

    # Remove the tag from all journals
    db.query(models.journals_and_tags).filter(
        models.journals_and_tags.c.tag_id == tag_id
    ).delete()

    # Delete the tag
    db.delete(tag)
    db.commit()

    return {
        "status": "success",
        "message": "Tag deleted and removed from journals successfully",
    }
