from faker import Faker
from sqlalchemy.orm import Session
from db.models import Base, engine, Journal, Group, User, Entry  # Import your models
import random

# Initialize Faker
fake = Faker()

# Create a database session
session = Session(engine)

# SQLAlchemy Model
class Code(Base):
    __tablename__ = 'codes'
    
    code_id = Column(Integer, primary_key=True, index=True)
    journal_id = Column(Integer, ForeignKey('journals.journal_id'), nullable=True)
    code_text = Column(String, nullable=False)
    language = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    
    # Relationship
    journal = relationship("Journal", back_populates="codes")

# Pydantic Schemas
class CodeBase(BaseModel):
    journal_id: Optional[int] = None
    code_text: str
    language: str
    
    class Config:
        from_attributes = True

class CodeCreate(CodeBase):
    pass

class CodeResponse(CodeBase):
    code_id: int
    created_at: datetime
    updated_at: datetime

# Faker Data Generation Function
def create_fake_codes(n=5):
    # Get existing journals
    journals = session.query(Journal).all()
    
    fake = Faker()
    languages = ['Python', 'JavaScript', 'Java', 'C++', 'Ruby', 'Go', 'Rust']
    
    for _ in range(n):
        journal = random.choice(journals) if journals else None
        if journal:
            code = Code(
                journal_id=journal.journal_id,
                





            )
        session.add(code)
    
    session.commit()

# Database Population Function
def populate_database():
    # Create a database session
    session = Session(engine)
    
    print("Creating fake code entries...")
    create_fake_codes(session)
    
    print("Code entries successfully added to the database!")
    
    # Close the session
    session.close()

# Main execution
if __name__ == "__main__":
    # Ensure all tables exist
    Base.metadata.create_all(bind=engine)
    
    # Populate the database
    populate_database()