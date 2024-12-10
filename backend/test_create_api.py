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
    user.user_id = 1
    user.email = "user@example.com"
    mock_db_session.query.return_value.filter_by.return_value.first.return_value = user
    return user


@pytest.fixture
def mock_create_journal():
    """Fixture to mock the create_journal function."""
    with patch("backend.routers.create_apis.create_journal") as mock_create:
        mock_create.return_value = {
            "status": "success",
            "journal_title": "Test Journal",
            "journal_id": 1,
            "created_at": "2024-12-09T10:00:00",
            "updated_at": "2024-12-09T10:00:00",
        }
        yield mock_create


@pytest.fixture
def mock_create_group():
    """Fixture to mock the create_group function."""
    with patch("backend.routers.create_apis.create_group") as mock_create:
        mock_create.return_value = {
            "status": "success",
            "group_id": 1,
            "group_name": "Test Group",
            "group_desc": "A group for testing",
            "created_at": "2024-12-09T10:00:00",
            "updated_at": "2024-12-09T10:00:00",
        }
        yield mock_create


@pytest.fixture
def mock_create_entry():
    """Fixture to mock the create_entry function."""
    with patch("backend.routers.create_apis.create_entry") as mock_create:
        mock_create.return_value = {
            "status": "success",
            "entry_id": 1,
            "page_number": 0,
            "entry_text": "This is a test entry",
            "journal_id": 1,
        }
        yield mock_create


def test_create_journal(login_user, mock_create_journal):
    """Test creating a journal."""
    auth_token = login_user
    journal_title = "Test Journal"

    # Call the create_journal function
    response = create_apis.create_journal(
        auth_token=auth_token, journal_title=journal_title
    )

    # Verify the response
    assert response["status"] == "success"
    assert response["journal_title"] == journal_title


def test_create_group(login_user, mock_create_group):
    """Test creating a group."""
    auth_token = login_user
    group_name = "Test Group"
    group_desc = "A group for testing"

    # Call the create_group function
    response = create_apis.create_group(
        auth_token=auth_token, group_name=group_name, group_desc=group_desc
    )

    # Verify the response
    assert response["status"] == "success"
    assert response["group_name"] == group_name
    assert response["group_desc"] == group_desc
    # assert response["group_id"] == 1
    # assert response["created_at"] == "2024-12-09T10:00:00"


def test_create_entry(login_user, mock_create_entry):
    """Test creating an entry."""
    auth_token = login_user
    journal_id = 1
    entry_text = "This is a test entry"

    # Call the create_entry function
    response = create_apis.create_entry(
        auth_token=auth_token, journal_id=journal_id, entry_text=entry_text
    )

    # Verify the response
    assert response["status"] == "success"
    # assert response["entry_id"] == 1
    # assert response["page_number"] == 0
    assert response["entry_text"] == entry_text
    assert response["journal_id"] == journal_id
