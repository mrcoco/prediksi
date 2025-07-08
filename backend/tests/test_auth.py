import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from backend.main import app
from backend.database import get_db
from backend.routes.auth_router import (
    get_current_user,
    create_access_token,
    pwd_context,
    SECRET_KEY,
    ALGORITHM
)

# Test client
@pytest.fixture
def client():
    return TestClient(app)

# Mock database session
@pytest.fixture
def db_session_mock():
    db = MagicMock()
    return db

# Override database dependency
@pytest.fixture(autouse=True)
def override_dependencies(db_session_mock):
    app.dependency_overrides[get_db] = lambda: db_session_mock
    yield
    app.dependency_overrides = {}

def test_register_user_success(client, db_session_mock):
    """Test successful user registration."""
    # Mock that username doesn't exist yet
    db_session_mock.query.return_value.filter.return_value.first.return_value = None
    
    user_data = {
        "username": "newuser",
        "password": "strongpassword123",
        "email": "newuser@example.com",
        "full_name": "New User",
        "role": "guru"
    }
    
    response = client.post("/api/auth/register", json=user_data)
    assert response.status_code == 201
    assert "id" in response.json()
    assert response.json()["username"] == user_data["username"]
    assert response.json()["email"] == user_data["email"]
    assert "password" not in response.json()  # Password should not be in response

def test_register_user_duplicate_username(client, db_session_mock):
    """Test registration with existing username."""
    # Mock that username already exists
    db_session_mock.query.return_value.filter.return_value.first.return_value = MagicMock()
    
    user_data = {
        "username": "existinguser",
        "password": "password123",
        "email": "user@example.com",
        "full_name": "Existing User",
        "role": "guru"
    }
    
    response = client.post("/api/auth/register", json=user_data)
    assert response.status_code == 400
    assert "Username already registered" in response.json()["detail"]

def test_login_success(client, db_session_mock):
    """Test successful login."""
    # Mock user in database
    mock_user = MagicMock()
    mock_user.username = "testuser"
    mock_user.hashed_password = pwd_context.hash("correctpassword")
    mock_user.disabled = False
    db_session_mock.query.return_value.filter.return_value.first.return_value = mock_user
    
    login_data = {
        "username": "testuser",
        "password": "correctpassword"
    }
    
    response = client.post("/api/auth/login", data=login_data)
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"

def test_login_invalid_credentials(client, db_session_mock):
    """Test login with invalid credentials."""
    # Mock user in database
    mock_user = MagicMock()
    mock_user.username = "testuser"
    mock_user.hashed_password = pwd_context.hash("correctpassword")
    db_session_mock.query.return_value.filter.return_value.first.return_value = mock_user
    
    login_data = {
        "username": "testuser",
        "password": "wrongpassword"
    }
    
    response = client.post("/api/auth/login", data=login_data)
    assert response.status_code == 401
    assert "Incorrect username or password" in response.json()["detail"]

def test_login_disabled_user(client, db_session_mock):
    """Test login with disabled user account."""
    # Mock disabled user in database
    mock_user = MagicMock()
    mock_user.username = "testuser"
    mock_user.hashed_password = pwd_context.hash("password")
    mock_user.disabled = True
    db_session_mock.query.return_value.filter.return_value.first.return_value = mock_user
    
    login_data = {
        "username": "testuser",
        "password": "password"
    }
    
    response = client.post("/api/auth/login", data=login_data)
    assert response.status_code == 400
    assert "User account is disabled" in response.json()["detail"]

def test_get_current_user_valid_token():
    """Test getting current user with valid token."""
    # Create a valid token
    access_token = create_access_token(
        data={"sub": "testuser"},
        expires_delta=timedelta(minutes=30)
    )
    
    # Mock database session and user
    mock_db = MagicMock()
    mock_user = MagicMock()
    mock_user.username = "testuser"
    mock_user.disabled = False
    mock_db.query.return_value.filter.return_value.first.return_value = mock_user
    
    # Get current user
    current_user = get_current_user(access_token, mock_db)
    assert current_user.username == "testuser"

def test_get_current_user_expired_token():
    """Test getting current user with expired token."""
    # Create an expired token
    access_token = create_access_token(
        data={"sub": "testuser"},
        expires_delta=timedelta(minutes=-30)  # Negative minutes for expired token
    )
    
    mock_db = MagicMock()
    with pytest.raises(Exception):
        get_current_user(access_token, mock_db)

def test_get_current_user_invalid_token():
    """Test getting current user with invalid token."""
    mock_db = MagicMock()
    with pytest.raises(Exception):
        get_current_user("invalid_token", mock_db)

def test_token_expiration():
    """Test that tokens expire at the correct time."""
    expires_delta = timedelta(minutes=30)
    token = create_access_token(
        data={"sub": "testuser"},
        expires_delta=expires_delta
    )
    
    # Decode token and verify expiration time
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    exp = datetime.fromtimestamp(payload["exp"])
    now = datetime.utcnow()
    
    # Token should expire in approximately 30 minutes (allowing for small time differences)
    assert (exp - now) < timedelta(minutes=31)
    assert (exp - now) > timedelta(minutes=29)

def test_password_hashing():
    """Test password hashing functionality."""
    password = "mysecretpassword"
    hashed = pwd_context.hash(password)
    
    # Verify that the hash is different from the original password
    assert hashed != password
    
    # Verify that the password verifies correctly
    assert pwd_context.verify(password, hashed) is True
    
    # Verify that wrong password fails
    assert pwd_context.verify("wrongpassword", hashed) is False 