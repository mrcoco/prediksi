import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from datetime import datetime
from backend.main import app
from backend.database import get_db
from backend.routes.auth_router import get_current_user

# Test client
@pytest.fixture
def client():
    return TestClient(app)

# Mock database session
@pytest.fixture
def db_session_mock():
    db = MagicMock()
    return db

# Mock authenticated user
@pytest.fixture
def current_user_mock():
    user = MagicMock()
    user.username = "testuser"
    user.role = "admin"
    return user

# Override dependencies
@pytest.fixture(autouse=True)
def override_dependencies(db_session_mock, current_user_mock):
    app.dependency_overrides[get_db] = lambda: db_session_mock
    app.dependency_overrides[get_current_user] = lambda: current_user_mock
    yield
    app.dependency_overrides = {}

def test_create_siswa(client, db_session_mock):
    """Test creating a new student."""
    siswa_data = {
        "nis": "12345",
        "nama": "Test Student",
        "jenis_kelamin": "L",
        "tempat_lahir": "Test City",
        "tanggal_lahir": "2000-01-01",
        "agama": "Islam",
        "alamat": "Test Address",
        "no_telp": "08123456789",
        "kelas": "X-1",
        "tahun_masuk": "2023"
    }
    
    response = client.post("/api/siswa/", json=siswa_data)
    assert response.status_code == 201
    assert response.json()["nis"] == siswa_data["nis"]
    assert response.json()["nama"] == siswa_data["nama"]

def test_create_siswa_duplicate_nis(client, db_session_mock):
    """Test creating a student with existing NIS."""
    # Mock that NIS already exists
    db_session_mock.query.return_value.filter.return_value.first.return_value = MagicMock()
    
    siswa_data = {
        "nis": "12345",
        "nama": "Test Student",
        "jenis_kelamin": "L",
        "tempat_lahir": "Test City",
        "tanggal_lahir": "2000-01-01",
        "agama": "Islam",
        "alamat": "Test Address",
        "no_telp": "08123456789",
        "kelas": "X-1",
        "tahun_masuk": "2023"
    }
    
    response = client.post("/api/siswa/", json=siswa_data)
    assert response.status_code == 400
    assert "NIS already exists" in response.json()["detail"]

def test_get_siswa(client, db_session_mock):
    """Test getting a student by ID."""
    # Mock student data
    mock_siswa = MagicMock()
    mock_siswa.id = 1
    mock_siswa.nis = "12345"
    mock_siswa.nama = "Test Student"
    db_session_mock.query.return_value.filter.return_value.first.return_value = mock_siswa
    
    response = client.get("/api/siswa/1")
    assert response.status_code == 200
    assert response.json()["id"] == 1
    assert response.json()["nis"] == "12345"

def test_get_siswa_not_found(client, db_session_mock):
    """Test getting a non-existent student."""
    db_session_mock.query.return_value.filter.return_value.first.return_value = None
    
    response = client.get("/api/siswa/999")
    assert response.status_code == 404
    assert "Student not found" in response.json()["detail"]

def test_update_siswa(client, db_session_mock):
    """Test updating a student's information."""
    # Mock existing student
    mock_siswa = MagicMock()
    mock_siswa.id = 1
    mock_siswa.nis = "12345"
    db_session_mock.query.return_value.filter.return_value.first.return_value = mock_siswa
    
    update_data = {
        "nama": "Updated Name",
        "alamat": "Updated Address",
        "no_telp": "08987654321"
    }
    
    response = client.put("/api/siswa/1", json=update_data)
    assert response.status_code == 200
    assert response.json()["nama"] == update_data["nama"]
    assert response.json()["alamat"] == update_data["alamat"]

def test_delete_siswa(client, db_session_mock):
    """Test deleting a student."""
    # Mock existing student
    mock_siswa = MagicMock()
    mock_siswa.id = 1
    db_session_mock.query.return_value.filter.return_value.first.return_value = mock_siswa
    
    response = client.delete("/api/siswa/1")
    assert response.status_code == 204

def test_get_all_siswa(client, db_session_mock):
    """Test getting all students with pagination."""
    # Mock student list
    mock_siswa_1 = MagicMock(id=1, nis="12345", nama="Student 1")
    mock_siswa_2 = MagicMock(id=2, nis="12346", nama="Student 2")
    
    db_session_mock.query.return_value.offset.return_value.limit.return_value.all.return_value = [
        mock_siswa_1, mock_siswa_2
    ]
    db_session_mock.query.return_value.count.return_value = 2
    
    response = client.get("/api/siswa/?skip=0&limit=10")
    assert response.status_code == 200
    assert len(response.json()["items"]) == 2
    assert response.json()["total"] == 2

def test_search_siswa(client, db_session_mock):
    """Test searching students by name or NIS."""
    # Mock search results
    mock_siswa = MagicMock(id=1, nis="12345", nama="Test Student")
    db_session_mock.query.return_value.filter.return_value.all.return_value = [mock_siswa]
    
    response = client.get("/api/siswa/search?query=Test")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["nama"] == "Test Student"

def test_get_siswa_by_kelas(client, db_session_mock):
    """Test getting students by class."""
    # Mock students in class
    mock_siswa = MagicMock(id=1, nis="12345", nama="Test Student", kelas="X-1")
    db_session_mock.query.return_value.filter.return_value.all.return_value = [mock_siswa]
    
    response = client.get("/api/siswa/kelas/X-1")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["kelas"] == "X-1"

def test_get_siswa_statistics(client, db_session_mock):
    """Test getting student statistics."""
    # Mock statistics data
    db_session_mock.query.return_value.count.return_value = 100  # Total students
    db_session_mock.query.return_value.filter.return_value.count.side_effect = [
        60,  # Male students
        40,  # Female students
        30,  # Class X
        35,  # Class XI
        35   # Class XII
    ]
    
    response = client.get("/api/siswa/statistics")
    assert response.status_code == 200
    stats = response.json()
    assert stats["total_siswa"] == 100
    assert stats["siswa_by_gender"]["L"] == 60
    assert stats["siswa_by_gender"]["P"] == 40
    assert sum(stats["siswa_by_kelas"].values()) == 100

def test_bulk_import_siswa(client, db_session_mock):
    """Test bulk importing students."""
    siswa_list = [
        {
            "nis": "12345",
            "nama": "Student 1",
            "jenis_kelamin": "L",
            "kelas": "X-1"
        },
        {
            "nis": "12346",
            "nama": "Student 2",
            "jenis_kelamin": "P",
            "kelas": "X-1"
        }
    ]
    
    response = client.post("/api/siswa/bulk-import", json=siswa_list)
    assert response.status_code == 201
    assert response.json()["success"] == True
    assert response.json()["imported_count"] == 2

def test_export_siswa(client, db_session_mock):
    """Test exporting student data."""
    # Mock student data for export
    mock_siswa = MagicMock(
        id=1,
        nis="12345",
        nama="Test Student",
        jenis_kelamin="L",
        kelas="X-1",
        created_at=datetime.now()
    )
    db_session_mock.query.return_value.all.return_value = [mock_siswa]
    
    response = client.get("/api/siswa/export")
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 