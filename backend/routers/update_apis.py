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
def create_journal(auth_token:str, journal_title: str, db: Session = Depends(get_db)):
    # Verify the token and get the email
    user_email = verify_token(auth_token)
   
    # Create a new journal with no entries
    new_journal = models.Journal(journal_title=journal_title, created_at=func.now(), updated_at=func.now(), user_email=user_email) # TODO: see if user_email is the correct field


    # Insert the journal into the database
    db.add(new_journal)
    db.commit()
    db.refresh(new_journal)


    # TODO: determine if try-catch blocks are good ideas
   
    return {"status": "success", "journal_id": new_journal.journal_id,
            "journal_title": new_journal.journal_title,
            "created_at": new_journal.created_at, "updated_at": new_journal.updated_at}


@router.post("/create_group")
def create_group(auth_token: str, group_name: str, group_desc: str = None, db: Session = Depends(get_db)):


    # Verify the token and get the email
    user_email = verify_token(auth_token) # TODO: determine if user_email will also be used in group creation


    # Create a new group
    new_group = models.Group(group_name=group_name, group_desc=group_desc, created_at=func.now(), updated_at=func.now())


    # Insert the group into the database
    db.add(new_group)
    db.commit()
    db.refresh(new_group)


    return {"status": "success", "group_id": new_group.group_id,
            "group_name": new_group.group_name,
            "group_desc": new_group.group_desc,
            "created_at": new_group.created_at,
            "updated_at": new_group.updated_at}


@router.post("/create_entry")
def create_entry(auth_token: str, journal_id: int, page_num: int, entry_text: str, db: Session = Depends(get_db)):
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
    new_entry = models.Entry(page_number=page_num, entry_text=entry_text, journal_id=journal_id) # TODO: determine if page_num should be generated instead


    # Insert the entry into the database
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)


    return {"status": "success", "entry_id": new_entry.entry_id, "page_number": new_entry.page_number,
            "entry_text": new_entry.entry_text, "journal_id": new_entry.journal_id}


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

@router.put("/update_group_name")
def update_group_name(auth_token: str, group_id: int, group_name: str, db: Session = Depends(get_db)):
    # Verify the token and get the email
    user_email = verify_token(auth_token)

    # Find the group by group_id
    db_group = db.query(models.Group).filter(models.Group.group_id == group_id).first()
    if not db_group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    # Retrieve the first journal to check if the user is the owner of the journal
    db_journal = db.query(models.Journal).filter(models.Journal.group_id == group_id).first()
    if not db_journal:
        raise HTTPException(status_code=404, detail="Journal not found")



@router.put("/update_group_desc")
def update_group_desc(auth_token: str, group_id: int, group_desc: str, db: Session = Depends(get_db)):