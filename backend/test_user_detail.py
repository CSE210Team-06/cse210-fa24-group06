import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch
from main import app  # Import your FastAPI app

client = TestClient(app)

@pytest.fixture
def mock_db_session():
    with patch("db.database.SessionLocal") as mock_session:
        db = MagicMock()
        mock_session.return_value = db
        yield db

@pytest.fixture
def mock_verify_token():
    with patch("auth.verify_token") as mock_verify:
        mock_verify.return_value = "user@example.com"
        yield mock_verify

def test_get_user_details_success(mock_db_session, mock_verify_token):
    mock_user = MagicMock()
    mock_user.user_id = 1
    mock_user.first_name = "bro"
    mock_user.last_name = "no"
    mock_user.email = "user@example.com"
    print("before mock db session")
    mock_db_session.query.return_value.filter.return_value.first.return_value = mock_user

    response = client.get("/get_user/user_details", params={"auth_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIiwiZXhwIjoxNzMzNzE4NDAwfQ.m83GRqYc5wLuFhdMDWvHhkjjgBI-YzWQOyt_FLYVnVQ"})
    print(f"Response is :{response}")
    assert response.status_code == 200
    assert response.json() == {
        "status": "success",
        "user_id": 1,
        "first_name": "bro",
        "last_name": "no",
        "email": "user@example.com",
    }
