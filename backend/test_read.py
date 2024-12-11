import sys
sys.path.append('./')
import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch
from backend.main import app  # Import your FastAPI app
from backend.db import models
from backend.routers import create_apis

client = TestClient(app)


@pytest.fixture
def login_user():
    """Fixture to login and fetch the auth token."""
    response = client.post(
        "/login", json={"email": "user@example.com", "password": "string"}
    )
    assert response.status_code == 200
    response_data = response.json()
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
    user.user_id = 12
    user.email = "user@example.com"
    mock_db_session.query.return_value.filter_by.return_value.first.return_value = user
    return user


def test_read_entries_success(login_user, mock_db_session):
    """Test the /read_entries endpoint for success."""
    auth_token = login_user
    entry_id = 54

    # Mock database entry and journal
    mock_entry = MagicMock()
    mock_entry.entry_id = entry_id
    mock_entry.entry_text = "test"
    mock_entry.journal_id = 23
    mock_entry.page_number = 0

    mock_journal = MagicMock()
    mock_journal.journal_id = 23
    mock_journal.user.email = "user@example.com"

    mock_db_session.query.return_value.filter.return_value.first.side_effect = [
        mock_entry,
        mock_journal,
    ]

    # Call the endpoint
    response = client.get(
        "/read/read_entries", params={"auth_token": auth_token, "journal_id": mock_journal.journal_id, "page_number": mock_entry.page_number}
    )

    # Verify the response
    assert response.status_code == 200
    assert response.json() == {
        "status": "success",
        "entry_text": "Updated entry text",
    }


def test_read_journal_success(login_user, mock_db_session):
    """Test the /read_journal endpoint for success."""
    auth_token = login_user
    journal_id = 23

    # Mock database journal and entries
    mock_journal = MagicMock()
    mock_journal.journal_id = journal_id
    mock_journal.user.email = "user@example.com"

    mock_entries = [
        MagicMock(entry_id=52, entry_text="First entry"),
        MagicMock(entry_id=53, entry_text="Second entry"),
    ]

    mock_db_session.query.return_value.filter.return_value.first.return_value = (
        mock_journal
    )
    mock_db_session.query.return_value.filter.return_value.all.return_value = (
        mock_entries
    )

    # Call the endpoint
    response = client.get(
        "/read/read_journal",
        params={"auth_token": auth_token, "journal_id": journal_id},
    )

    # Verify the response
    assert response.status_code == 200
    assert response.json() == {
        "status": "success",
        "entries": [
            {"entry_id": 53, "entry_text": "Updated entry text"},
            {"entry_id": 54, "entry_text": "test"},
        ],
    }


def test_read_journal_not_authorized(login_user, mock_db_session):
    """Test the /read_journal endpoint when the user is not authorized."""
    auth_token = login_user
    journal_id = 1

    # Mock database journal with a different user email
    mock_journal = MagicMock()
    mock_journal.journal_id = journal_id
    mock_journal.user.email = "another@example.com"

    mock_db_session.query.return_value.filter.return_value.first.return_value = (
        mock_journal
    )

    # Call the endpoint
    response = client.get(
        "/read/read_journal",
        params={"auth_token": auth_token, "journal_id": journal_id},
    )

    # Verify the response
    assert response.status_code == 403
    assert response.json() == {"detail": "Not authorized to access this journal"}


def test_read_journal_no_entries(login_user, mock_db_session):
    """Test the /read_journal endpoint when no entries are found."""
    auth_token = login_user
    journal_id = 25 

    # Mock database journal
    mock_journal = MagicMock()
    mock_journal.journal_id = journal_id
    mock_journal.user.email = "user@example.com"

    # Mock empty entries
    mock_db_session.query.return_value.filter.return_value.first.return_value = (
        mock_journal
    )
    mock_db_session.query.return_value.filter.return_value.all.return_value = []

    # Call the endpoint
    response = client.get(
        "/read/read_journal",
        params={"auth_token": auth_token, "journal_id": journal_id},
    )

    # Verify the response
    assert response.status_code == 200
    assert response.json() == {
        "status": "success",
        "message": "No entries found for this journal",
    }