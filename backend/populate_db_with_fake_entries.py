from faker import Faker
from sqlalchemy.orm import Session
from .db.models import Base, engine, Journal, Group, User, Entry  # Import your models
import random

# Initialize Faker
fake = Faker()

# Create a database session
session = Session(engine)


# Generate fake data for the Group table
def create_fake_groups(n=5):
    for _ in range(n):
        group = Group(
            group_name=fake.company(),
            group_desc=fake.text(max_nb_chars=100),
            created_at=fake.date_time_this_year().isoformat(),
            updated_at=fake.date_time_this_year().isoformat(),
        )
        session.add(group)
    session.commit()

    # Generate fake data for the User table


def create_fake_users(n=10):
    for _ in range(n):
        user = User(
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            email=fake.unique.email(),
            password=fake.password(length=12),
        )
        session.add(user)
    session.commit()


# Generate fake data for the Journal table
def create_fake_journals(n=20):
    users = session.query(User).all()
    groups = session.query(Group).all()
    for _ in range(n):
        journal = Journal(
            group_id=random.choice(groups).group_id if groups else None,
            journal_title=fake.sentence(nb_words=6),
            created_at=fake.date_time_this_year().isoformat(),
            updated_at=fake.date_time_this_year().isoformat(),
            user_id=random.choice(users).user_id if users else None,
        )
        session.add(journal)
    session.commit()


# Generate fake data for the Entry table
def create_fake_entries(n=50):
    journals = session.query(Journal).all()
    for _ in range(n):
        journal = random.choice(journals) if journals else None
        if journal:
            entry = Entry(
                journal_id=journal.journal_id,
                entry_text=fake.text(max_nb_chars=200),
                word_count=random.randint(50, 500),
                page_number=random.randint(1, 10),
            )
            session.add(entry)
    session.commit()

    # Run the functions to populate


def populate_database():
    print("Creating fake groups...")
    create_fake_groups(5)
    print("Creating fake users...")
    create_fake_users(10)
    print("Creating fake journals...")
    create_fake_journals(20)
    print("Creating fake entries...")
    create_fake_entries(50)
    print("Database successfully populated with fake data!")


if __name__ == "__main__":
    # Ensure all tables exist
    Base.metadata.create_all(bind=engine)

    # Populate the database
    populate_database()

    # Close the session
    session.close()
