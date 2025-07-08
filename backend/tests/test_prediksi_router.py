import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from backend.main import app  # Import your FastAPI app
from backend.routes.auth_router import get_current_user
from backend.database import get_db

# Fixture for the TestClient
@pytest.fixture(scope="module")
def client():
    return TestClient(app)

# Fixture to mock database dependency
@pytest.fixture
def db_session_mock():
    db_mock = MagicMock()
    # Configure mock behavior as needed for your tests
    # For example, mock a query result
    mock_siswa = MagicMock()
    mock_siswa.id = 1
    mock_siswa.nama = "Test Siswa"
    db_mock.query.return_value.filter.return_value.first.return_value = mock_siswa
    return db_mock

# Fixture to mock user authentication
@pytest.fixture
def current_user_mock():
    user_mock = MagicMock()
    user_mock.username = "testuser"
    user_mock.role = "admin"
    return user_mock

# Override dependencies for the tests
@pytest.fixture(autouse=True)
def override_dependencies(db_session_mock, current_user_mock):
    app.dependency_overrides[get_db] = lambda: db_session_mock
    app.dependency_overrides[get_current_user] = lambda: current_user_mock
    yield
    app.dependency_overrides = {}


# --- Test Cases ---

def test_train_model_success(client):
    """Test the /train endpoint for a successful training."""
    with patch('backend.models.c45_model.c45_model.train') as mock_train:
        mock_train.return_value = {"accuracy": 0.95, "samples": 100}
        response = client.post("/api/prediksi/train")
        assert response.status_code == 200
        json_response = response.json()
        assert json_response["message"] == "Model berhasil dilatih"
        assert json_response["data"]["accuracy"] == 0.95
        mock_train.assert_called_once()

def test_train_model_insufficient_data(client):
    """Test the /train endpoint when there is not enough data."""
    with patch('backend.models.c45_model.c45_model.train') as mock_train:
        mock_train.side_effect = ValueError("Data berlabel tidak cukup untuk melatih model")
        response = client.post("/api/prediksi/train")
        assert response.status_code == 400
        assert "Data berlabel tidak cukup" in response.json()["detail"]

def test_predict_prestasi_success(client, db_session_mock):
    """Test the individual prediction endpoint for a successful case."""
    # Mock database returns for nilai, presensi, penghasilan
    mock_nilai = MagicMock(rata_rata=85.0)
    mock_presensi = MagicMock(kategori_kehadiran='Tinggi')
    mock_penghasilan = MagicMock(kategori_penghasilan='Tinggi')
    
    db_session_mock.query.return_value.filter.return_value.first.side_effect = [
        MagicMock(id=1, nama="Test Siswa"), # Siswa
        mock_nilai,
        mock_presensi,
        mock_penghasilan,
    ]

    with patch('backend.models.c45_model.c45_model.predict') as mock_predict:
        # Mock that the model is trained
        with patch('backend.models.c45_model.c45_model.trained', True):
            mock_predict.return_value = {
                'prediksi': 'Tinggi',
                'confidence': 0.9,
                'feature_importances': {'rata_rata': 0.6}
            }
            
            request_data = {
                "siswa_id": 1,
                "semester": "Ganjil",
                "tahun_ajaran": "2023/2024"
            }
            response = client.post("/api/prediksi/", json=request_data)
            
            assert response.status_code == 200
            json_response = response.json()
            assert json_response['prediksi_prestasi'] == 'Tinggi'
            assert json_response['confidence'] == 0.9
            mock_predict.assert_called_once()


def test_predict_prestasi_siswa_not_found(client):
    """Test prediction when the student ID is not found."""
    with patch('backend.database.get_db') as mock_get_db:
        mock_db = MagicMock()
        # Simulate student not found
        mock_db.query.return_value.filter.return_value.first.return_value = None
        mock_get_db.return_value = mock_db

        app.dependency_overrides[get_db] = lambda: mock_db
        
        request_data = {"siswa_id": 999, "semester": "Ganjil", "tahun_ajaran": "2023/2024"}
        response = client.post("/api/prediksi/", json=request_data)
        
        assert response.status_code == 404
        assert "Siswa dengan ID 999 tidak ditemukan" in response.json()["detail"]
        
        app.dependency_overrides = {}

def test_predict_batch_success(client, db_session_mock):
    """Test the batch prediction endpoint."""
    # Mock the query to return a list of students
    mock_siswa = MagicMock(id=1)
    db_session_mock.query.return_value.join.return_value.join.return_value.filter.return_value.all.return_value = [mock_siswa]

    # Mock the individual data queries within the loop
    db_session_mock.query.return_value.filter.return_value.first.side_effect = [
        MagicMock(rata_rata=85.0),
        MagicMock(kategori_kehadiran='Tinggi'),
        MagicMock(kategori_penghasilan='Tinggi')
    ]

    with patch('backend.models.c45_model.c45_model.predict') as mock_predict:
        with patch('backend.models.c45_model.c45_model.trained', True):
            mock_predict.return_value = {'prediksi': 'Tinggi', 'confidence': 0.9}
            
            response = client.post("/api/prediksi/batch", json={"semester": "Ganjil", "tahun_ajaran": "2023/2024"})
            
            assert response.status_code == 200
            json_response = response.json()
            assert json_response["summary"]["total_siswa"] == 1
            assert json_response["summary"]["success_count"] == 1
            assert len(json_response["results"]) == 1
            assert json_response["results"][0]["prediksi"] == "Tinggi"

def test_get_rules_endpoint(client):
    """Test the /rules endpoint."""
    with patch('backend.models.c45_model.c45_model.get_rules') as mock_get_rules:
        mock_rules = [
            {
                'conditions': ['rata_rata <= 75.0'],
                'class': 'Rendah',
                'samples': 10,
                'probability': 0.8
            }
        ]
        mock_get_rules.return_value = mock_rules
        
        response = client.get("/api/prediksi/rules")
        assert response.status_code == 200
        assert response.json() == mock_rules

def test_get_rules_untrained_model(client):
    """Test the /rules endpoint with untrained model."""
    with patch('backend.models.c45_model.c45_model.get_rules') as mock_get_rules:
        mock_get_rules.side_effect = ValueError("Model belum dilatih")
        response = client.get("/api/prediksi/rules")
        assert response.status_code == 400
        assert "Model belum dilatih" in response.json()["detail"]

def test_generate_labeled_data(client, db_session_mock):
    """Test the /generate-labeled-data endpoint."""
    response = client.post("/api/prediksi/generate-labeled-data")
    assert response.status_code == 200
    assert "message" in response.json()
    assert "data_generated" in response.json()

def test_get_visualization_endpoint(client):
    """Test the /visualization endpoint."""
    with patch('backend.models.c45_model.c45_model.get_visualization') as mock_get_viz:
        # Mock a simple visualization object
        mock_get_viz.return_value = MagicMock()
        response = client.get("/api/prediksi/visualization")
        assert response.status_code == 200

def test_get_visualization_untrained_model(client):
    """Test the /visualization endpoint with untrained model."""
    with patch('backend.models.c45_model.c45_model.get_visualization') as mock_get_viz:
        mock_get_viz.side_effect = ValueError("Model belum dilatih")
        response = client.get("/api/prediksi/visualization")
        assert response.status_code == 400
        assert "Model belum dilatih" in response.json()["detail"]

def test_get_prediction_history(client, db_session_mock):
    """Test getting prediction history."""
    # Mock prestasi data
    mock_prestasi = MagicMock(
        id=1,
        siswa_id=1,
        prediksi_prestasi="Tinggi",
        confidence=0.9,
        created_at="2023-01-01T00:00:00",
        semester="Ganjil",
        tahun_ajaran="2023/2024"
    )
    db_session_mock.query.return_value.offset.return_value.limit.return_value.all.return_value = [mock_prestasi]
    db_session_mock.query.return_value.count.return_value = 1
    
    response = client.get("/api/prediksi/history?skip=0&limit=10")
    assert response.status_code == 200
    json_response = response.json()
    assert "total" in json_response
    assert "predictions" in json_response
    assert len(json_response["predictions"]) == 1

def test_get_prediction_history_with_filters(client, db_session_mock):
    """Test getting prediction history with filters."""
    response = client.post("/api/prediksi/history", json={
        "semester": "Ganjil",
        "tahun_ajaran": "2023/2024",
        "prediksi_prestasi": "Tinggi"
    })
    assert response.status_code == 200
    assert "total" in response.json()
    assert "predictions" in response.json()

def test_delete_prediction_history(client, db_session_mock):
    """Test deleting a prediction history entry."""
    # Mock existing prestasi
    mock_prestasi = MagicMock(id=1)
    db_session_mock.query.return_value.filter.return_value.first.return_value = mock_prestasi
    
    response = client.delete("/api/prediksi/history/1")
    assert response.status_code == 204

def test_delete_nonexistent_prediction_history(client, db_session_mock):
    """Test deleting a non-existent prediction history entry."""
    db_session_mock.query.return_value.filter.return_value.first.return_value = None
    response = client.delete("/api/prediksi/history/999")
    assert response.status_code == 404

def test_export_prediction_history(client, db_session_mock):
    """Test exporting prediction history to Excel."""
    # Mock prestasi data
    mock_prestasi = MagicMock(
        id=1,
        siswa_id=1,
        prediksi_prestasi="Tinggi",
        confidence=0.9,
        created_at="2023-01-01T00:00:00",
        semester="Ganjil",
        tahun_ajaran="2023/2024"
    )
    db_session_mock.query.return_value.all.return_value = [mock_prestasi]
    
    response = client.get("/api/prediksi/history/export/excel")
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

def test_get_confusion_matrix_endpoint(client):
    """Test getting confusion matrix."""
    with patch('backend.models.c45_model.c45_model.get_confusion_matrix') as mock_get_cm:
        mock_cm = [[10, 2, 1], [1, 15, 2], [0, 3, 20]]
        mock_get_cm.return_value = mock_cm
        
        response = client.get("/api/prediksi/confusion-matrix")
        assert response.status_code == 200
        assert response.json()["confusion_matrix"] == mock_cm

def test_get_model_metrics_endpoint(client):
    """Test getting model metrics."""
    with patch('backend.models.c45_model.c45_model.get_model_metrics') as mock_get_metrics:
        mock_metrics = {
            'accuracy': 0.95,
            'precision': 0.94,
            'recall': 0.93,
            'f1_score': 0.93
        }
        mock_get_metrics.return_value = mock_metrics
        
        response = client.get("/api/prediksi/model-metrics")
        assert response.status_code == 200
        assert response.json()["metrics"] == mock_metrics

def test_get_tree_data(client):
    """Test getting tree data for visualization."""
    response = client.get("/api/prediksi/tree-data")
    assert response.status_code == 200
    json_response = response.json()
    assert "nodes" in json_response
    assert "edges" in json_response

def test_get_feature_statistics(client, db_session_mock):
    """Test getting feature statistics."""
    response = client.get("/api/prediksi/feature-statistics")
    assert response.status_code == 200
    json_response = response.json()
    assert "rata_rata" in json_response
    assert "kategori_penghasilan" in json_response
    assert "kategori_kehadiran" in json_response 