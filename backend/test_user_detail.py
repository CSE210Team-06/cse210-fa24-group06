import sys
sys.path.append('./')
import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch
from backend.main import app
from backend.db import models
from backend.routers import create_apis

client = TestClient(app)
# Centralized test data .You need to specify these according to user user info and jounal info and needs to be hardcoded
user_id = 13
journal_id = 23
entry_id = 53
first_name ="bro"
last_name = "no"
journal_title = "Test Journal"
entry_text = "This is a test entry"
TEST_USER = {
    "user_id": user_id,
    "email": "user@example.com",
    "password": "string",
    "first_name": first_name,
    "last_name": last_name,
}

TEST_JOURNAL = {
    "journal_id": journal_id,
    "journal_title": journal_title,
    "created_at": "2024-12-09 15:34:06",
    "updated_at": "2024-12-09 15:34:06",
}

TEST_ENTRY = {
    "entry_id": entry_id,
    "entry_text": entry_text,
    "page_number": 0,
    "journal_id": journal_id,
}

@pytest.fixture
def login_user():
    """Fixture to login and fetch the auth token."""
    response = client.post(
        "/login", json={"email": TEST_USER["email"], "password": TEST_USER["password"]}
    )
    assert response.status_code == 200
    response_data = response.json()
    print(response_data)
    return response_data["access_token"]


@pytest.fixture
def mock_db_session():
    """Fixture to mock the database session."""
    with patch("backend.db.database.SessionLocal") as mock_session:
        db = MagicMock()
        mock_session.return_value = db
        yield db


@pytest.fixture
def mock_user(mock_db_session):
    """Fixture to mock a user in the database."""
    user = MagicMock()
    user.user_id = TEST_USER["user_id"]
    user.email = TEST_USER["email"]
    user.first_name = TEST_USER["first_name"]
    user.last_name = TEST_USER["last_name"]
    mock_db_session.query.return_value.filter_by.return_value.first.return_value = user
    return user


@pytest.fixture
def mock_create_journal():
    """Fixture to mock the create_journal function."""
    with patch("backend.routers.create_apis.create_journal") as mock_create:
        mock_create.return_value = {
            "status": "success",
            **TEST_JOURNAL,
        }
        yield mock_create

@pytest.fixture
def mock_journals(mock_db_session, mock_user):
    """Fixture to mock journals for a user."""
    journal = MagicMock()
    journal.journal_id = TEST_JOURNAL["journal_id"]
    journal.journal_title = TEST_JOURNAL["journal_title"]
    journal.created_at = TEST_JOURNAL["created_at"]
    journal.updated_at = TEST_JOURNAL["updated_at"]

    mock_db_session.query.return_value.filter.return_value.all.return_value = [journal]
    return [journal]

@pytest.fixture
def mock_entries(mock_db_session, mock_user):
    """Fixture to mock journal entries."""
    entry1 = MagicMock()
    entry1.entry_id = TEST_ENTRY["entry_id"]
    entry1.entry_text = TEST_ENTRY["entry_text"]
    entry1.journal_id = TEST_ENTRY["journal_id"]

    mock_db_session.query.return_value.filter.return_value.all.return_value = [entry1]
    return [entry1]


def test_get_user_details_success(login_user):
    """Test the get_user_details endpoint."""
    auth_token = login_user

    response = client.get("/get_user/user_details", params={"auth_token": auth_token})

    # Verify the response
    assert response.status_code == 200
    response_data = response.json()
    assert response_data["status"] == "success"
    assert response_data["first_name"] == TEST_USER["first_name"]
    assert response_data["last_name"] == TEST_USER["last_name"]
    assert response_data["email"] == TEST_USER["email"]


def test_create_and_read_journal(login_user, mock_create_journal, mock_db_session):
    """Test creating a journal and then reading it."""
    auth_token = login_user
    journal_title = TEST_JOURNAL["journal_title"]

    # Call the create_journal function
    response = create_apis.create_journal(
        auth_token=auth_token, journal_title=journal_title
    )

    # Verify the response
    assert response["status"] == "success"
    # assert response["journal_title"] == journal_title

    # Read the journals for the user
    response2 = client.get("/get_user/user_journals", params={"auth_token": auth_token})

    # Extract the JSON content
    response_data = response2.json()

    # Verify the response
    assert response_data["status"] == "success"
    # assert response_data["journals"][0]["journal_title"] == response["journal_title"]


def test_create_and_read_entry(login_user, mock_journals):
    """Test creating an entry and then reading it."""
    auth_token = login_user
    journal_id = TEST_ENTRY["journal_id"]
    entry_text = TEST_ENTRY["entry_text"]

    # Create an entry
    create_response = client.post(
        "/create/create_entry",
        params={
            "auth_token": auth_token,
            "journal_id": journal_id,
            "entry_text": entry_text,
        },
    )

    # Verify the creation response
    assert create_response.status_code == 200
    create_data = create_response.json()

    assert create_data["status"] == "success"
    # assert create_data["entry_text"] == entry_text

    # Read the entries for the journal
    read_response = client.get(
        "/get_user/journal_entries",
        params={"auth_token": auth_token, "journal_id": journal_id},
    )

    # Verify the reading response
    assert read_response.status_code == 200
    read_data = read_response.json()
    assert read_data["status"] == "success"
    assert len(read_data["entries"]) > 0  # Ensure the entry exists
    # assert read_data["entries"][-1]["entry_text"] == entry_text
