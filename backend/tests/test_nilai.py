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
    user.role = "guru"
    return user

# Override dependencies
@pytest.fixture(autouse=True)
def override_dependencies(db_session_mock, current_user_mock):
    app.dependency_overrides[get_db] = lambda: db_session_mock
    app.dependency_overrides[get_current_user] = lambda: current_user_mock
    yield
    app.dependency_overrides = {}

def test_input_nilai_raport(client, db_session_mock):
    """Test inputting report card grades."""
    # Mock existing student
    mock_siswa = MagicMock(id=1, nama="Test Student")
    db_session_mock.query.return_value.filter.return_value.first.return_value = mock_siswa
    
    nilai_data = {
        "siswa_id": 1,
        "semester": "Ganjil",
        "tahun_ajaran": "2023/2024",
        "nilai_pengetahuan": 85.5,
        "nilai_keterampilan": 88.0,
        "nilai_sikap": "A",
        "mata_pelajaran": "Matematika"
    }
    
    response = client.post("/api/nilai/raport", json=nilai_data)
    assert response.status_code == 201
    assert response.json()["siswa_id"] == nilai_data["siswa_id"]
    assert response.json()["nilai_pengetahuan"] == nilai_data["nilai_pengetahuan"]

def test_input_nilai_invalid_range(client):
    """Test inputting grades with invalid values."""
    nilai_data = {
        "siswa_id": 1,
        "semester": "Ganjil",
        "tahun_ajaran": "2023/2024",
        "nilai_pengetahuan": 101,  # Invalid: > 100
        "nilai_keterampilan": -1,  # Invalid: < 0
        "nilai_sikap": "X",  # Invalid: not in [A, B, C, D]
        "mata_pelajaran": "Matematika"
    }
    
    response = client.post("/api/nilai/raport", json=nilai_data)
    assert response.status_code == 422

def test_get_nilai_by_siswa(client, db_session_mock):
    """Test getting grades for a specific student."""
    # Mock grade data
    mock_nilai = MagicMock(
        id=1,
        siswa_id=1,
        nilai_pengetahuan=85.5,
        nilai_keterampilan=88.0,
        nilai_sikap="A",
        mata_pelajaran="Matematika"
    )
    db_session_mock.query.return_value.filter.return_value.all.return_value = [mock_nilai]
    
    response = client.get("/api/nilai/siswa/1?semester=Ganjil&tahun_ajaran=2023/2024")
    assert response.status_code == 200
    assert len(response.json()) > 0
    assert response.json()[0]["nilai_pengetahuan"] == 85.5

def test_update_nilai_raport(client, db_session_mock):
    """Test updating report card grades."""
    # Mock existing grade
    mock_nilai = MagicMock(id=1, siswa_id=1)
    db_session_mock.query.return_value.filter.return_value.first.return_value = mock_nilai
    
    update_data = {
        "nilai_pengetahuan": 90.0,
        "nilai_keterampilan": 92.0,
        "nilai_sikap": "A"
    }
    
    response = client.put("/api/nilai/raport/1", json=update_data)
    assert response.status_code == 200
    assert response.json()["nilai_pengetahuan"] == update_data["nilai_pengetahuan"]

def test_delete_nilai_raport(client, db_session_mock):
    """Test deleting report card grades."""
    # Mock existing grade
    mock_nilai = MagicMock(id=1)
    db_session_mock.query.return_value.filter.return_value.first.return_value = mock_nilai
    
    response = client.delete("/api/nilai/raport/1")
    assert response.status_code == 204

def test_calculate_rata_rata(client, db_session_mock):
    """Test calculating average grades."""
    # Mock grade data for calculation
    mock_nilai_list = [
        MagicMock(nilai_pengetahuan=85.0, nilai_keterampilan=88.0),
        MagicMock(nilai_pengetahuan=90.0, nilai_keterampilan=92.0)
    ]
    db_session_mock.query.return_value.filter.return_value.all.return_value = mock_nilai_list
    
    response = client.get("/api/nilai/rata-rata/1?semester=Ganjil&tahun_ajaran=2023/2024")
    assert response.status_code == 200
    assert "rata_rata_pengetahuan" in response.json()
    assert "rata_rata_keterampilan" in response.json()
    assert response.json()["rata_rata_pengetahuan"] == 87.5

def test_get_nilai_kelas(client, db_session_mock):
    """Test getting grades for an entire class."""
    # Mock class grades
    mock_nilai = MagicMock(
        siswa_id=1,
        nama_siswa="Test Student",
        nilai_pengetahuan=85.0,
        nilai_keterampilan=88.0
    )
    db_session_mock.query.return_value.filter.return_value.all.return_value = [mock_nilai]
    
    response = client.get("/api/nilai/kelas/X-1?semester=Ganjil&tahun_ajaran=2023/2024")
    assert response.status_code == 200
    assert len(response.json()) > 0
    assert "nama_siswa" in response.json()[0]
    assert "nilai_pengetahuan" in response.json()[0]

def test_get_nilai_statistics(client, db_session_mock):
    """Test getting grade statistics."""
    response = client.get("/api/nilai/statistics?kelas=X-1&semester=Ganjil&tahun_ajaran=2023/2024")
    assert response.status_code == 200
    stats = response.json()
    assert "rata_rata_kelas" in stats
    assert "nilai_tertinggi" in stats
    assert "nilai_terendah" in stats
    assert "distribusi_nilai" in stats

def test_bulk_import_nilai(client, db_session_mock):
    """Test bulk importing grades."""
    nilai_list = [
        {
            "siswa_id": 1,
            "mata_pelajaran": "Matematika",
            "nilai_pengetahuan": 85.0,
            "nilai_keterampilan": 88.0,
            "nilai_sikap": "A",
            "semester": "Ganjil",
            "tahun_ajaran": "2023/2024"
        },
        {
            "siswa_id": 2,
            "mata_pelajaran": "Matematika",
            "nilai_pengetahuan": 90.0,
            "nilai_keterampilan": 92.0,
            "nilai_sikap": "A",
            "semester": "Ganjil",
            "tahun_ajaran": "2023/2024"
        }
    ]
    
    response = client.post("/api/nilai/bulk-import", json=nilai_list)
    assert response.status_code == 201
    assert response.json()["success"] == True
    assert response.json()["imported_count"] == 2

def test_export_nilai_raport(client, db_session_mock):
    """Test exporting report card grades."""
    # Mock grade data for export
    mock_nilai = MagicMock(
        siswa_id=1,
        nama_siswa="Test Student",
        mata_pelajaran="Matematika",
        nilai_pengetahuan=85.0,
        nilai_keterampilan=88.0,
        nilai_sikap="A",
        semester="Ganjil",
        tahun_ajaran="2023/2024"
    )
    db_session_mock.query.return_value.all.return_value = [mock_nilai]
    
    response = client.get("/api/nilai/export?kelas=X-1&semester=Ganjil&tahun_ajaran=2023/2024")
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

def test_get_nilai_trend(client, db_session_mock):
    """Test getting grade trends over time."""
    response = client.get("/api/nilai/trend/1")  # For student ID 1
    assert response.status_code == 200
    trend = response.json()
    assert "semester_trend" in trend
    assert "mata_pelajaran_trend" in trend

def test_get_ranking(client, db_session_mock):
    """Test getting student rankings based on grades."""
    response = client.get("/api/nilai/ranking?kelas=X-1&semester=Ganjil&tahun_ajaran=2023/2024")
    assert response.status_code == 200
    rankings = response.json()
    assert len(rankings) > 0
    assert "ranking" in rankings[0]
    assert "nama_siswa" in rankings[0]
    assert "rata_rata" in rankings[0] 