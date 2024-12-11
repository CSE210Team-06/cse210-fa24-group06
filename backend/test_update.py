import sys

sys.path.append("./")
import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch
from backend.main import app

# from backend.db import models

client = TestClient(app)


# Fixture for logging in the user and obtaining the auth token
@pytest.fixture
def login_user():
    """Fixture to login and fetch the auth token."""
    response = client.post(
        "/login", json={"email": "user@example.com", "password": "string"}
    )
    assert response.status_code == 200
    response_data = response.json()
    return response_data["access_token"]


# Fixture to mock the database session
@pytest.fixture
def mock_db_session():
    """Fixture to mock the database session."""
    with patch("backend.db.database.SessionLocal") as mock_session:
        db = MagicMock()
        mock_session.return_value = db
        yield db


# Fixture to mock a user in the database
@pytest.fixture
def mock_user(mock_db_session):
    """Fixture to mock a user in the database."""
    user = MagicMock()
    user.user_id = 12
    user.email = "user@example.com"
    user.first_name = "string"
    user.last_name = "string"
    mock_db_session.query.return_value.filter_by.return_value.first.return_value = user
    return user


# Test for updating the user's first name
def test_update_user_first_name(login_user, mock_db_session, mock_user):
    """Test the update_user_first_name endpoint."""
    auth_token = login_user
    first_name = "NewFirstName"

    response = client.put(
        "/update/update_user_first_name",
        params={"auth_token": auth_token, "first_name": first_name},
    )

    assert response.status_code == 200
    response_data = response.json()
    assert response_data["status"] == "success"
    assert response_data["updated_first_name"] == first_name


# Test for updating the user's last name
def test_update_user_last_name(login_user, mock_db_session, mock_user):
    """Test the update_user_last_name endpoint."""
    auth_token = login_user
    last_name = "NewLastName"

    response = client.put(
        "/update/update_user_last_name",
        params={"auth_token": auth_token, "last_name": last_name},
    )

    assert response.status_code == 200
    response_data = response.json()
    assert response_data["status"] == "success"
    assert response_data["updated_last_name"] == last_name


# Test for updating an entry's text
def test_update_user_entry(login_user, mock_db_session, mock_user):
    """Test the update_user_entry endpoint."""
    auth_token = login_user
    journal_id = 23  # Mocked journal ID
    page_num = 0
    new_entry_text = "Updated entry text"

    # Mock journal and entry
    entry = MagicMock()
    entry.entry_id = 53
    entry.entry_text = "Old entry text"
    mock_db_session.query.return_value.filter.return_value.first.return_value = entry

    response = client.put(
        "/update/update_user_entry",
        params={
            "auth_token": auth_token,
            "page_num": page_num,
            "journal_id": journal_id,
            "entry_text": new_entry_text,
        },
    )

    assert response.status_code == 200
    response_data = response.json()
    assert response_data["status"] == "success"
    assert response_data["updated_entry_text"] == new_entry_text


# Test for updating the journal's title
def test_update_journal(login_user, mock_db_session, mock_user):
    """Test the update_journal endpoint."""
    auth_token = login_user
    journal_id = 23  # Mocked journal ID
    new_journal_title = "Updated Journal Title"

    # Mock journal
    journal = MagicMock()
    journal.journal_id = journal_id
    journal.journal_title = "Old Title"
    mock_db_session.query.return_value.filter.return_value.first.return_value = journal

    response = client.put(
        "/update/update_journal",
        params={
            "auth_token": auth_token,
            "journal_id": journal_id,
            "journal_title": new_journal_title,
        },
    )

    assert response.status_code == 200
    response_data = response.json()
    assert response_data["status"] == "success"
    assert response_data["updated_journal_title"] == new_journal_title
