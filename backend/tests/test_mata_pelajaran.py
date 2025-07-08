import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
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

def test_create_mata_pelajaran(client, db_session_mock):
    """Test creating a new subject."""
    mapel_data = {
        "nama": "Fisika",
        "kode": "FIS001",
        "kategori": "MIPA",
        "kkm": 75,
        "kelas": ["X", "XI", "XII"],
        "deskripsi": "Mata pelajaran Fisika untuk SMA"
    }
    
    response = client.post("/api/mata-pelajaran/", json=mapel_data)
    assert response.status_code == 201
    assert response.json()["nama"] == mapel_data["nama"]
    assert response.json()["kode"] == mapel_data["kode"]

def test_create_mata_pelajaran_duplicate(client, db_session_mock):
    """Test creating a subject with existing code."""
    # Mock that subject code already exists
    db_session_mock.query.return_value.filter.return_value.first.return_value = MagicMock()
    
    mapel_data = {
        "nama": "Fisika",
        "kode": "FIS001",
        "kategori": "MIPA",
        "kkm": 75,
        "kelas": ["X", "XI", "XII"],
        "deskripsi": "Mata pelajaran Fisika untuk SMA"
    }
    
    response = client.post("/api/mata-pelajaran/", json=mapel_data)
    assert response.status_code == 400
    assert "Subject code already exists" in response.json()["detail"]

def test_get_mata_pelajaran(client, db_session_mock):
    """Test getting a subject by ID."""
    # Mock subject data
    mock_mapel = MagicMock(
        id=1,
        nama="Fisika",
        kode="FIS001",
        kategori="MIPA",
        kkm=75
    )
    db_session_mock.query.return_value.filter.return_value.first.return_value = mock_mapel
    
    response = client.get("/api/mata-pelajaran/1")
    assert response.status_code == 200
    assert response.json()["nama"] == "Fisika"
    assert response.json()["kode"] == "FIS001"

def test_get_mata_pelajaran_not_found(client, db_session_mock):
    """Test getting a non-existent subject."""
    db_session_mock.query.return_value.filter.return_value.first.return_value = None
    
    response = client.get("/api/mata-pelajaran/999")
    assert response.status_code == 404
    assert "Subject not found" in response.json()["detail"]

def test_update_mata_pelajaran(client, db_session_mock):
    """Test updating a subject."""
    # Mock existing subject
    mock_mapel = MagicMock(id=1, nama="Fisika", kode="FIS001")
    db_session_mock.query.return_value.filter.return_value.first.return_value = mock_mapel
    
    update_data = {
        "nama": "Fisika Dasar",
        "kkm": 70,
        "deskripsi": "Updated description"
    }
    
    response = client.put("/api/mata-pelajaran/1", json=update_data)
    assert response.status_code == 200
    assert response.json()["nama"] == update_data["nama"]
    assert response.json()["kkm"] == update_data["kkm"]

def test_delete_mata_pelajaran(client, db_session_mock):
    """Test deleting a subject."""
    # Mock existing subject
    mock_mapel = MagicMock(id=1)
    db_session_mock.query.return_value.filter.return_value.first.return_value = mock_mapel
    
    response = client.delete("/api/mata-pelajaran/1")
    assert response.status_code == 204

def test_get_all_mata_pelajaran(client, db_session_mock):
    """Test getting all subjects with pagination."""
    # Mock subject list
    mock_mapel_1 = MagicMock(id=1, nama="Fisika", kode="FIS001")
    mock_mapel_2 = MagicMock(id=2, nama="Kimia", kode="KIM001")
    
    db_session_mock.query.return_value.offset.return_value.limit.return_value.all.return_value = [
        mock_mapel_1, mock_mapel_2
    ]
    db_session_mock.query.return_value.count.return_value = 2
    
    response = client.get("/api/mata-pelajaran/?skip=0&limit=10")
    assert response.status_code == 200
    assert len(response.json()["items"]) == 2
    assert response.json()["total"] == 2

def test_get_mata_pelajaran_by_kategori(client, db_session_mock):
    """Test getting subjects by category."""
    # Mock subjects in category
    mock_mapel = MagicMock(id=1, nama="Fisika", kode="FIS001", kategori="MIPA")
    db_session_mock.query.return_value.filter.return_value.all.return_value = [mock_mapel]
    
    response = client.get("/api/mata-pelajaran/kategori/MIPA")
    assert response.status_code == 200
    assert len(response.json()) > 0
    assert response.json()[0]["kategori"] == "MIPA"

def test_get_mata_pelajaran_by_kelas(client, db_session_mock):
    """Test getting subjects by class level."""
    # Mock subjects for class level
    mock_mapel = MagicMock(
        id=1,
        nama="Fisika",
        kode="FIS001",
        kelas=["X", "XI"]
    )
    db_session_mock.query.return_value.filter.return_value.all.return_value = [mock_mapel]
    
    response = client.get("/api/mata-pelajaran/kelas/X")
    assert response.status_code == 200
    assert len(response.json()) > 0
    assert "X" in response.json()[0]["kelas"]

def test_get_mata_pelajaran_statistics(client, db_session_mock):
    """Test getting subject statistics."""
    response = client.get("/api/mata-pelajaran/statistics")
    assert response.status_code == 200
    stats = response.json()
    assert "total_mata_pelajaran" in stats
    assert "mata_pelajaran_per_kategori" in stats
    assert "mata_pelajaran_per_kelas" in stats

def test_bulk_import_mata_pelajaran(client, db_session_mock):
    """Test bulk importing subjects."""
    mapel_list = [
        {
            "nama": "Fisika",
            "kode": "FIS001",
            "kategori": "MIPA",
            "kkm": 75,
            "kelas": ["X", "XI", "XII"]
        },
        {
            "nama": "Kimia",
            "kode": "KIM001",
            "kategori": "MIPA",
            "kkm": 75,
            "kelas": ["X", "XI", "XII"]
        }
    ]
    
    response = client.post("/api/mata-pelajaran/bulk-import", json=mapel_list)
    assert response.status_code == 201
    assert response.json()["success"] == True
    assert response.json()["imported_count"] == 2

def test_export_mata_pelajaran(client, db_session_mock):
    """Test exporting subjects data."""
    # Mock subject data for export
    mock_mapel = MagicMock(
        id=1,
        nama="Fisika",
        kode="FIS001",
        kategori="MIPA",
        kkm=75,
        kelas=["X", "XI", "XII"],
        created_at=MagicMock()
    )
    db_session_mock.query.return_value.all.return_value = [mock_mapel]
    
    response = client.get("/api/mata-pelajaran/export")
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

def test_validate_mata_pelajaran_input(client):
    """Test input validation for subject data."""
    invalid_data = {
        "nama": "",  # Empty name
        "kode": "TOO_LONG_CODE_123456",  # Too long code
        "kategori": "INVALID",  # Invalid category
        "kkm": 101,  # KKM > 100
        "kelas": ["XIII"]  # Invalid class level
    }
    
    response = client.post("/api/mata-pelajaran/", json=invalid_data)
    assert response.status_code == 422
    errors = response.json()["detail"]
    assert any("nama" in error["loc"] for error in errors)
    assert any("kode" in error["loc"] for error in errors)
    assert any("kkm" in error["loc"] for error in errors) 