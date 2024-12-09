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
        "/login",
        json={"email": "user@example.com", "password": "string"}
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
            "journal_title": "Test Journal"
        }
        yield mock_create


def test_get_user_details_success(login_user):
    """Test the get_user_details endpoint."""
    auth_token = login_user

    response = client.get(
        "/get_user/user_details",
        params={"auth_token": auth_token}
    )

    # Verify the response
    assert response.status_code == 200
    response_data = response.json()
    assert response_data["status"] == "success"
    assert response_data["user_id"] == 1
    assert response_data["first_name"] == "bro"
    assert response_data["last_name"] == "no"
    assert response_data["email"] == "user@example.com"


def test_create_journal(login_user, mock_create_journal):
    """Test creating a journal."""
    auth_token = login_user
    journal_title = "Test Journal"

    # Call the create_journal function
    response = create_apis.create_journal(
        auth_token=auth_token,
        journal_title=journal_title
    )

    # Verify the response
    assert response["status"] == "success"
    assert response["journal_title"] == journal_title
