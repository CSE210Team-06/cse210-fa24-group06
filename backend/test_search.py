import sys

sys.path.append("./")
import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch
from backend.main import app

# from backend.db import models
from datetime import datetime

client = TestClient(app)


# Fixture for logging in the user and obtaining auth token
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


# Fixture to mock a user and journals in the database
@pytest.fixture
def mock_user_and_journals(mock_db_session):
    """Fixture to mock a user and their journals."""
    user = MagicMock()
    user.user_id = 12
    user.email = "user@example.com"
    mock_db_session.query.return_value.filter_by.return_value.first.return_value = user

    journal = MagicMock()
    journal.journal_id = 23
    journal.user = user
    journal.journal_title = "Test Journal"
    mock_db_session.query.return_value.filter.return_value.all.return_value = [journal]

    return user, [journal]


# Test for searching entries in all journals
def test_search_entry(login_user, mock_db_session, mock_user_and_journals):
    """Test the search_entry endpoint."""
    auth_token = login_user
    search_text = "test"

    response = client.get(
        f"/search/search_entry?auth_token={auth_token}&search_text={search_text}"
    )

    assert response.status_code == 200
    response_data = response.json()
    assert response_data["status"] == "success"
    assert "matches" in response_data


# Test for searching entries in a specific journal
def test_search_entry_in_journal(login_user, mock_db_session, mock_user_and_journals):
    """Test the search_entry_in_journal endpoint."""
    auth_token = login_user
    journal_id = 23  # Mocked journal ID
    search_text = "test"

    response = client.get(
        f"/search_entry_in_journal?auth_token={auth_token}&journal_id={journal_id}&search_text={search_text}"  # noqa: E501
    )

    assert response.status_code == 200
    response_data = response.json()
    assert response_data["status"] == "success"
    assert "matches" in response_data


# Test for searching journals by date
def test_search_journal_by_date(login_user, mock_db_session, mock_user_and_journals):
    """Test the search_journal_by_date endpoint."""
    auth_token = login_user
    search_date = datetime.today().strftime("%Y-%m-%d")  # Use today's date

    response = client.get(
        f"/search_journal_by_date?auth_token={auth_token}&search_date={search_date}"
    )

    assert response.status_code == 200
    response_data = response.json()
    assert response_data["status"] == "success"
    assert "matches" in response_data


# Test for invalid date format in search_journal_by_date
def test_search_journal_by_date_invalid_format(login_user):
    """Test invalid date format for the search_journal_by_date endpoint."""
    auth_token = login_user
    search_date = "invalid-date"

    response = client.get(
        f"/search/search_journal_by_date?auth_token={auth_token}&search_date={search_date}"  # noqa: E501
    )

    assert response.status_code == 400
    response_data = response.json()
    assert response_data["detail"] == "Invalid date format. Use YYYY-MM-DD."
