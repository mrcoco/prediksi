import pytest
import pandas as pd
from unittest.mock import MagicMock, patch
from backend.models.c45_model import C45Model

@pytest.fixture
def mock_db_session():
    """Fixture to create a mock database session."""
    db_session = MagicMock()
    return db_session

@pytest.fixture
def c45_model_instance():
    """Fixture to create a C45Model instance."""
    return C45Model()

@pytest.fixture
def mock_student_data():
    """Fixture to create mock data for students, grades, etc."""
    # Mock Siswa
    mock_siswa_1 = MagicMock()
    mock_siswa_1.id = 1
    mock_siswa_1.nama = "Test Siswa 1"

    mock_siswa_2 = MagicMock()
    mock_siswa_2.id = 2
    mock_siswa_2.nama = "Test Siswa 2"

    # Mock Nilai
    mock_nilai_1 = MagicMock()
    mock_nilai_1.siswa_id = 1
    mock_nilai_1.rata_rata = 85.0

    # Mock Presensi
    mock_presensi_1 = MagicMock()
    mock_presensi_1.siswa_id = 1
    mock_presensi_1.kategori_kehadiran = 'Tinggi'

    # Mock Penghasilan
    mock_penghasilan_1 = MagicMock()
    mock_penghasilan_1.siswa_id = 1
    mock_penghasilan_1.kategori_penghasilan = 'Tinggi'

    # Mock Prestasi (sebagai label)
    mock_prestasi_1 = MagicMock()
    mock_prestasi_1.siswa_id = 1
    mock_prestasi_1.prediksi_prestasi = 'Tinggi'

    # Setup mock returns
    mock_db = MagicMock()
    
    # This setup simulates that the DB returns two students.
    # We will then build more specific scenarios in each test.
    mock_db.query.return_value.all.return_value = [mock_siswa_1, mock_siswa_2]
    
    # Default mocks for filter queries
    mock_db.query.return_value.filter.return_value.order_by.return_value.first.side_effect = [
        mock_nilai_1, mock_presensi_1, mock_penghasilan_1, mock_prestasi_1, # Siswa 1
        None, None, None, None # Siswa 2 (to simulate missing data)
    ]

    return mock_db, [mock_siswa_1, mock_siswa_2]

def create_mock_df():
    "Helper function to create a mock DataFrame for training."
    data = {
        'rata_rata': [85, 75, 65, 90, 80, 70, 60, 95, 88, 78, 55],
        'kategori_penghasilan': ['Tinggi', 'Menengah', 'Rendah', 'Tinggi', 'Menengah', 'Rendah', 'Rendah', 'Tinggi', 'Tinggi', 'Menengah', 'Rendah'],
        'kategori_kehadiran': ['Tinggi', 'Tinggi', 'Sedang', 'Tinggi', 'Tinggi', 'Sedang', 'Rendah', 'Tinggi', 'Tinggi', 'Sedang', 'Rendah'],
        'prediksi_prestasi': ['Tinggi', 'Sedang', 'Rendah', 'Tinggi', 'Sedang', 'Rendah', 'Rendah', 'Tinggi', 'Tinggi', 'Sedang', 'Rendah']
    }
    return pd.DataFrame(data)

def test_generate_label(c45_model_instance):
    """Test the label generation logic."""
    assert c45_model_instance.generate_label(86, 'Tinggi', 'Tinggi') == 'Tinggi'
    assert c45_model_instance.generate_label(78, 'Menengah', 'Tinggi') == 'Sedang'
    assert c45_model_instance.generate_label(70, 'Rendah', 'Sedang') == 'Rendah'

@patch('backend.models.c45_model.pd.DataFrame')
def test_prepare_data(mock_pd_dataframe, c45_model_instance, mock_db_session):
    """Test the data preparation logic."""
    # For this test, we assume student 2 has no data.
    mock_siswa_1 = MagicMock()
    mock_siswa_1.id = 1
    mock_nilai_1 = MagicMock(rata_rata=85.0)
    mock_presensi_1 = MagicMock(kategori_kehadiran='Tinggi')
    mock_penghasilan_1 = MagicMock(kategori_penghasilan='Tinggi')
    mock_prestasi_1 = MagicMock(prediksi_prestasi='Tinggi')

    mock_siswa_2 = MagicMock()
    mock_siswa_2.id = 2
    
    mock_db_session.query.return_value.all.return_value = [mock_siswa_1, mock_siswa_2]
    
    # Configure side_effect for multiple calls within the loop
    mock_db_session.query.return_value.filter.return_value.order_by.return_value.first.side_effect = [
        # First student calls
        mock_nilai_1, mock_presensi_1, mock_penghasilan_1, mock_prestasi_1,
        # Second student calls (simulating missing data for nilai)
        None, MagicMock(), MagicMock(), MagicMock()
    ]

    c45_model_instance.prepare_data(mock_db_session)

    # Assert that pd.DataFrame was called with data only for the student who had complete data.
    mock_pd_dataframe.assert_called_once()
    call_args, _ = mock_pd_dataframe.call_args
    assert len(call_args[0]) == 1
    assert call_args[0][0]['siswa_id'] == 1


@patch('backend.models.c45_model.C45Model.prepare_data')
def test_train_model_sufficient_data(mock_prepare_data, c45_model_instance, mock_db_session):
    """Test model training with sufficient data."""
    mock_df = create_mock_df()
    mock_prepare_data.return_value = (mock_df, mock_df) # Return for df and df_labeled

    result = c45_model_instance.train(mock_db_session)
    
    assert c45_model_instance.trained is True
    assert 'accuracy' in result
    assert result['accuracy'] > 0.0 # Should have some accuracy
    assert c45_model_instance.tree_visualization is not None


@patch('backend.models.c45_model.C45Model.prepare_data')
def test_train_model_insufficient_data(mock_prepare_data, c45_model_instance, mock_db_session):
    """Test model training with insufficient data."""
    mock_df = create_mock_df().head(5) # only 5 rows
    mock_prepare_data.return_value = (mock_df, mock_df)

    with pytest.raises(ValueError, match="Data berlabel tidak cukup"):
        c45_model_instance.train(mock_db_session)
    
    assert c45_model_instance.trained is False

def test_predict_untrained_model(c45_model_instance):
    """Test prediction on an untrained model."""
    with pytest.raises(ValueError, match="Model belum dilatih"):
        c45_model_instance.predict({})

@patch('backend.models.c45_model.C45Model.prepare_data')
def test_predict_successful(mock_prepare_data, c45_model_instance, mock_db_session):
    """Test a successful prediction after training."""
    # 1. Train the model
    mock_df = create_mock_df()
    mock_prepare_data.return_value = (mock_df, mock_df)
    c45_model_instance.train(mock_db_session)
    assert c45_model_instance.trained is True

    # 2. Predict
    prediction_data = {
        'rata_rata': 88,
        'kategori_penghasilan': 'Tinggi',
        'kategori_kehadiran': 'Tinggi'
    }
    result = c45_model_instance.predict(prediction_data)

    assert 'prediksi' in result
    assert result['prediksi'] in ['Rendah', 'Sedang', 'Tinggi']
    assert 'confidence' in result
    assert 0 <= result['confidence'] <= 1

def test_predict_missing_feature(c45_model_instance):
    """Test prediction with missing feature data."""
    c45_model_instance.trained = True # Mock trained state
    prediction_data = {
        'rata_rata': 88,
        'kategori_penghasilan': 'Tinggi',
        # 'kategori_kehadiran' is missing
    }
    with pytest.raises(ValueError, match="Data tidak memiliki fitur kategori_kehadiran"):
        c45_model_instance.predict(prediction_data)

def test_get_rules(c45_model_instance):
    """Test getting rules from a trained model."""
    # First train the model with mock data
    mock_df = create_mock_df()
    with patch('backend.models.c45_model.C45Model.prepare_data') as mock_prepare_data:
        mock_prepare_data.return_value = (mock_df, mock_df)
        c45_model_instance.train(MagicMock())
    
    # Now test get_rules
    rules = c45_model_instance.get_rules()
    assert isinstance(rules, list)
    assert len(rules) > 0
    
    # Check rule structure
    for rule in rules:
        assert 'conditions' in rule
        assert 'class' in rule
        assert 'samples' in rule
        assert 'probability' in rule
        assert rule['class'] in ['Rendah', 'Sedang', 'Tinggi']
        assert isinstance(rule['conditions'], list)
        assert isinstance(rule['samples'], int)
        assert 0 <= rule['probability'] <= 1

def test_get_rules_untrained_model(c45_model_instance):
    """Test getting rules from an untrained model."""
    with pytest.raises(ValueError, match="Model belum dilatih"):
        c45_model_instance.get_rules()

def test_get_confusion_matrix(c45_model_instance):
    """Test getting confusion matrix from a trained model."""
    # Train model first
    mock_df = create_mock_df()
    with patch('backend.models.c45_model.C45Model.prepare_data') as mock_prepare_data:
        mock_prepare_data.return_value = (mock_df, mock_df)
        c45_model_instance.train(MagicMock())
    
    # Get confusion matrix
    cm = c45_model_instance.get_confusion_matrix()
    assert isinstance(cm, list)
    assert len(cm) == 3  # Should be 3x3 for our three classes
    for row in cm:
        assert len(row) == 3
        assert all(isinstance(x, (int, float)) for x in row)

def test_get_confusion_matrix_untrained_model(c45_model_instance):
    """Test getting confusion matrix from an untrained model."""
    with pytest.raises(ValueError, match="Model belum dilatih"):
        c45_model_instance.get_confusion_matrix()

def test_get_model_metrics(c45_model_instance):
    """Test getting model metrics from a trained model."""
    # Train model first
    mock_df = create_mock_df()
    with patch('backend.models.c45_model.C45Model.prepare_data') as mock_prepare_data:
        mock_prepare_data.return_value = (mock_df, mock_df)
        c45_model_instance.train(MagicMock())
    
    # Get metrics
    metrics = c45_model_instance.get_model_metrics()
    assert isinstance(metrics, dict)
    assert 'accuracy' in metrics
    assert 'precision' in metrics
    assert 'recall' in metrics
    assert 'f1_score' in metrics
    assert all(0 <= metrics[key] <= 1 for key in metrics)

def test_get_model_metrics_untrained_model(c45_model_instance):
    """Test getting model metrics from an untrained model."""
    with pytest.raises(ValueError, match="Model belum dilatih"):
        c45_model_instance.get_model_metrics()

def test_get_visualization(c45_model_instance):
    """Test getting visualization from a trained model."""
    # Train model first
    mock_df = create_mock_df()
    with patch('backend.models.c45_model.C45Model.prepare_data') as mock_prepare_data:
        mock_prepare_data.return_value = (mock_df, mock_df)
        c45_model_instance.train(MagicMock())
    
    # Get visualization
    viz = c45_model_instance.get_visualization()
    assert viz is not None

def test_get_visualization_untrained_model(c45_model_instance):
    """Test getting visualization from an untrained model."""
    with pytest.raises(ValueError, match="Model belum dilatih"):
        c45_model_instance.get_visualization()

def test_prepare_data_empty_database(c45_model_instance, mock_db_session):
    """Test prepare_data with an empty database."""
    mock_db_session.query.return_value.all.return_value = []
    df, df_labeled = c45_model_instance.prepare_data(mock_db_session)
    assert len(df) == 0
    assert len(df_labeled) == 0

def test_prepare_data_missing_values(c45_model_instance, mock_db_session):
    """Test prepare_data with missing values in some records."""
    mock_siswa = MagicMock(id=1, nama="Test Siswa")
    mock_db_session.query.return_value.all.return_value = [mock_siswa]
    
    # Configure side_effect to return None for some queries
    mock_db_session.query.return_value.filter.return_value.order_by.return_value.first.side_effect = [
        None,  # nilai is None
        MagicMock(kategori_kehadiran='Tinggi'),  # presensi exists
        MagicMock(kategori_penghasilan='Tinggi'),  # penghasilan exists
        None  # prestasi is None
    ]
    
    df, df_labeled = c45_model_instance.prepare_data(mock_db_session)
    assert len(df) == 0  # Should be empty because nilai is required but None
    assert len(df_labeled) == 0

def test_predict_with_invalid_categories(c45_model_instance):
    """Test prediction with invalid category values."""
    c45_model_instance.trained = True  # Mock trained state
    
    # Test with invalid kategori_penghasilan
    with pytest.raises(ValueError):
        c45_model_instance.predict({
            'rata_rata': 85,
            'kategori_penghasilan': 'Invalid',
            'kategori_kehadiran': 'Tinggi'
        })
    
    # Test with invalid kategori_kehadiran
    with pytest.raises(ValueError):
        c45_model_instance.predict({
            'rata_rata': 85,
            'kategori_penghasilan': 'Tinggi',
            'kategori_kehadiran': 'Invalid'
        })

def test_predict_with_edge_values(c45_model_instance):
    """Test prediction with edge case values."""
    # Train model first
    mock_df = create_mock_df()
    with patch('backend.models.c45_model.C45Model.prepare_data') as mock_prepare_data:
        mock_prepare_data.return_value = (mock_df, mock_df)
        c45_model_instance.train(MagicMock())
    
    # Test with minimum possible values
    result_min = c45_model_instance.predict({
        'rata_rata': 0,
        'kategori_penghasilan': 'Rendah',
        'kategori_kehadiran': 'Rendah'
    })
    assert result_min['prediksi'] in ['Rendah', 'Sedang', 'Tinggi']
    
    # Test with maximum possible values
    result_max = c45_model_instance.predict({
        'rata_rata': 100,
        'kategori_penghasilan': 'Tinggi',
        'kategori_kehadiran': 'Tinggi'
    })
    assert result_max['prediksi'] in ['Rendah', 'Sedang', 'Tinggi'] 