import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch
from backend.main import app
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
    user.first_name = "string"
    user.last_name = "string"
    mock_db_session.query.return_value.filter_by.return_value.first.return_value = user
    return user


@pytest.fixture
def mock_create_journal():
    """Fixture to mock the create_journal function."""
    with patch("backend.routers.create_apis.create_journal") as mock_create:
        mock_create.return_value = {
            "status": "success",
            "journal_id": 21,
            "journal_title": "1",
            "created_at": "2024-12-09 15:34:06",
            "updated_at": "2024-12-09 15:34:06",
        }
        yield mock_create


@pytest.fixture
def mock_journals(mock_db_session, mock_user):
    """Fixture to mock journals for a user."""
    journal = MagicMock()
    journal.journal_id = 21
    journal.journal_title = "1"  # Ensure this matches the title used in create_journal
    journal.created_at = "2024-12-09 15:34:06"
    journal.updated_at = "2024-12-09 15:34:06"

    mock_db_session.query.return_value.filter.return_value.all.return_value = [journal]


@pytest.fixture
def mock_entries(mock_db_session, mock_user):
    """Fixture to mock journal entries."""
    entry1 = MagicMock()
    entry1.entry_id = 1
    entry1.entry_text = "Entry 1 text"
    entry1.journal_id = 21  # Ensure this matches the mocked journal ID

    def filter_mock(*args, **kwargs):
        # Return the entry if the journal_id matches
        if args[0].journal_id == 21:
            return [entry1]
        return []

    mock_db_session.query.return_value.filter.return_value.all.side_effect = filter_mock
    return [entry1]


def test_get_user_details_success(login_user):
    """Test the get_user_details endpoint."""
    auth_token = login_user

    response = client.get("/get_user/user_details", params={"auth_token": auth_token})

    # Verify the response
    assert response.status_code == 200
    response_data = response.json()
    assert response_data["status"] == "success"
    # assert response_data["user_id"] == 1
    assert response_data["first_name"] == "string"
    assert response_data["last_name"] == "string"
    assert response_data["email"] == "user@example.com"


def test_create_and_read_journal(login_user, mock_create_journal, mock_journals):
    """Test creating a journal and then reading it."""
    auth_token = login_user
    journal_title = "Test Journal"

    # Call the create_journal function
    response = create_apis.create_journal(
        auth_token=auth_token, journal_title=journal_title
    )
    # print(response)
    # Verify the response
    assert response["status"] == "success"
    assert response["journal_id"] == 21
    assert response["journal_title"] == "1"

    # Read the journals for the user
    response2 = client.get("/get_user/user_journals", params={"auth_token": auth_token})

    # Extract the JSON content
    response_data = response2.json()
    # print(response_data)

    # Verify the response
    assert response_data["status"] == "success"
    assert response_data["journals"][0]["journal_id"] == response["journal_id"]
    assert response_data["journals"][0]["journal_title"] == response["journal_title"]


def test_create_and_read_entry(login_user, mock_journals):
    """Test creating an entry and then reading it."""
    auth_token = login_user
    journal_id = 21  # Use the mocked journal ID
    entry_text = "This is a test entry"

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
    assert create_data["entry_text"] == entry_text
    assert create_data["journal_id"] == journal_id

    # Read the entries for the journal
    read_response = client.get(
        "/get_user/journal_entries",
        params={"auth_token": auth_token, "journal_id": journal_id},
    )

    # Verify the reading response
    assert read_response.status_code == 200
    read_data = read_response.json()
    print(read_data)
    assert read_data["status"] == "success"
    assert len(read_data["entries"]) > 0  # Ensure the entry exists
    assert read_data["entries"][-1]["entry_text"] == entry_text
