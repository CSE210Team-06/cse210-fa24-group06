import sys

sys.path.append("./")
import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch
from backend.main import app

# from backend.db import models

client = TestClient(app)

# Centralized test data needs to be hardcoded
TEST_DATA = {
    "user": {
        "email": "user@example.com",
        "password": "string",
    },
    "journal": {
        "journal_id": 23,
        "page_num": 0,
    },
    "group": {
        "group_id": 6,
    },
}


@pytest.fixture
def login_user():
    """Fixture to login and fetch the auth token."""
    response = client.post(
        "/login",
        json={
            "email": TEST_DATA["user"]["email"],
            "password": TEST_DATA["user"]["password"],
        },
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


def test_delete_entry_success(login_user, mock_db_session):
    """Test the /delete_entry endpoint."""
    auth_token = login_user
    journal_id = TEST_DATA["journal"]["journal_id"]
    page_num = TEST_DATA["journal"]["page_num"]

    # Create and delete a mock journal
    mock_journal = MagicMock()
    mock_journal.user.email = TEST_DATA["user"]["email"]
    mock_db_session.query.return_value.filter.return_value.first.side_effect = [
        mock_journal
    ]

    # Create and delete a mock entry
    mock_entry = MagicMock()
    mock_entry.page_number = page_num
    mock_db_session.query.return_value.filter.return_value.first.side_effect = [
        mock_journal,
        mock_entry,
    ]

    # Delete entry
    response = client.delete(
        "/delete/delete_entry",
        params={
            "auth_token": auth_token,
            "journal_id": journal_id,
            "page_num": page_num,
        },
    )

    assert response.status_code == 200
    assert response.json() == {
        "status": "success",
        "message": "Entry deleted and entries shifted successfully",
    }


def test_delete_journal_success(login_user, mock_db_session):
    """Test the /delete_journal endpoint."""
    auth_token = login_user
    journal_id = TEST_DATA["journal"]["journal_id"]

    # Create and delete a mock journal
    mock_journal = MagicMock()
    mock_journal.user.email = TEST_DATA["user"]["email"]
    mock_db_session.query.return_value.filter.return_value.first.return_value = (
        mock_journal
    )

    response = client.delete(
        "/delete/delete_journal",
        params={"auth_token": auth_token, "journal_id": journal_id},
    )

    assert response.status_code == 200
    assert response.json() == {
        "status": "success",
        "message": "Journal and its entries deleted successfully",
    }


def test_delete_group_success(mock_db_session):
    """Test the /delete_group endpoint."""
    group_id = TEST_DATA["group"]["group_id"]

    # Create and delete a mock group
    mock_group = MagicMock()
    mock_group.group_id = group_id

    mock_db_session.query.return_value.filter.return_value.first.return_value = (
        mock_group
    )
    mock_db_session.query.return_value.filter.return_value.all.return_value = []

    response = client.delete("/delete/delete_group", params={"group_id": group_id})

    assert response.status_code == 200
    assert response.json() == {
        "status": "success",
        "message": "Group deleted and journals unlinked successfully",
    }


def test_delete_user_success(login_user, mock_db_session):
    """Test the /delete_user endpoint."""
    auth_token = login_user

    # Create and delete a mock user
    mock_user = MagicMock()
    mock_user.email = TEST_DATA["user"]["email"]
    mock_db_session.query.return_value.filter.return_value.first.return_value = (
        mock_user
    )

    response = client.delete("/delete/delete_user", params={"auth_token": auth_token})

    assert response.status_code == 200
    assert response.json() == {
        "status": "success",
        "message": "User deleted successfully",
    }
