# Class Diagram Sistem Prediksi EduPro 2025

## Executive Summary

Dokumen ini menyajikan class diagram komprehensif untuk sistem prediksi prestasi siswa dalam aplikasi EduPro. Class diagram ini menggambarkan arsitektur berorientasi objek yang terdiri dari 25+ kelas yang diorganisir dalam 7 layer utama untuk mendukung prediksi prestasi siswa menggunakan algoritma C4.5 Decision Tree.

## Tujuan Dokumentasi

1. **Architectural Overview** - Memberikan gambaran menyeluruh arsitektur sistem prediksi
2. **Class Specifications** - Mendefinisikan struktur dan perilaku setiap kelas
3. **Relationship Mapping** - Menjelaskan hubungan antar kelas dan dependencies
4. **Implementation Guide** - Panduan implementasi untuk developer
5. **Maintenance Reference** - Referensi untuk maintenance dan pengembangan

## Arsitektur Sistem

### 7-Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CONTROLLER LAYER                         │
│          PredictionController, ModelController              │
├─────────────────────────────────────────────────────────────┤
│                     SERVICE LAYER                           │
│    PredictionService, FeatureEngineeringService,           │
│    ModelTrainingService, DataValidationService             │
├─────────────────────────────────────────────────────────────┤
│                  MACHINE LEARNING LAYER                     │
│           MLModel, DecisionTree, TreeNode                   │
├─────────────────────────────────────────────────────────────┤
│                   PREDICTION LAYER                          │
│    PredictionRequest, FeatureVector, PredictionResult       │
├─────────────────────────────────────────────────────────────┤
│                   REPOSITORY LAYER                          │
│   StudentRepository, MLModelRepository,                     │
│   PredictionRepository                                      │
├─────────────────────────────────────────────────────────────┤
│                    DOMAIN LAYER                             │
│   Student, AcademicScore, AttendanceRecord,                 │
│   ParentIncome, Achievement                                 │
├─────────────────────────────────────────────────────────────┤
│                    UTILITY LAYER                            │
│         ValidationResult, ModelInfo                         │
└─────────────────────────────────────────────────────────────┘
```

## File Class Diagram

Class diagram sistem prediksi tersedia dalam format Mermaid:
- **File**: `docs/class_diagram_prediction_system.mmd`
- **Format**: Mermaid Diagram
- **Viewer**: [Mermaid Live Editor](https://mermaid.live/)

## Spesifikasi Kelas

### 1. Domain Layer Classes

#### 1.1 Student Class
**Tujuan**: Representasi data siswa utama

**Atribut Utama**:
- `id`: Unique identifier siswa
- `nama`: Nama lengkap siswa
- `nis`: Nomor Induk Siswa
- `jenis_kelamin`: Gender siswa
- `agama`: Agama siswa
- `status_keluarga`: Status keluarga
- `jumlah_saudara`: Jumlah saudara
- `anak_ke`: Posisi anak dalam keluarga
- `sekolah_asal`: Asal sekolah
- `diterima_beasiswa`: Status beasiswa
- `tanggal_lahir`: Tanggal lahir

**Method Utama**:
- `calculateAge()`: Menghitung usia siswa
- `isEligibleForPrediction()`: Cek kelayakan prediksi
- `getDataCompleteness()`: Persentase kelengkapan data
- `toFeatureVector()`: Konversi ke feature vector

#### 1.2 AcademicScore Class
**Tujuan**: Manajemen nilai akademik siswa

**Atribut Utama**:
- `matematika`, `bahasa_indonesia`, `bahasa_inggris`, `ipa`: Nilai mata pelajaran
- `semester`: Semester nilai
- `tahun_ajaran`: Tahun ajaran

**Method Utama**:
- `calculateAverage()`: Hitung rata-rata nilai
- `getPerformanceCategory()`: Kategori performa (TINGGI/SEDANG/RENDAH)
- `validateScores()`: Validasi nilai (0-100)

#### 1.3 AttendanceRecord Class
**Tujuan**: Tracking kehadiran siswa

**Atribut Utama**:
- `hadir`: Jumlah hari hadir
- `sakit`: Jumlah hari sakit
- `izin`: Jumlah hari izin
- `alpha`: Jumlah hari alpha

**Method Utama**:
- `calculateAttendanceRate()`: Persentase kehadiran
- `getAttendanceCategory()`: Kategori kehadiran

#### 1.4 ParentIncome Class
**Tujuan**: Data ekonomi orang tua

**Atribut Utama**:
- `penghasilan_ayah`, `penghasilan_ibu`: Penghasilan orang tua
- `pekerjaan_ayah`, `pekerjaan_ibu`: Pekerjaan orang tua
- `pendidikan_ayah`, `pendidikan_ibu`: Pendidikan orang tua

**Method Utama**:
- `getTotalIncome()`: Total penghasilan
- `getIncomeCategory()`: Kategori penghasilan (TINGGI/SEDANG/RENDAH)
- `getSocioeconomicScore()`: Skor sosial ekonomi

#### 1.5 Achievement Class
**Tujuan**: Pencatatan prestasi siswa

**Atribut Utama**:
- `jenis_prestasi`: Jenis prestasi (Akademik/Non-Akademik)
- `tingkat_prestasi`: Tingkat (Sekolah/Kabupaten/Provinsi/Nasional)
- `poin_prestasi`: Poin prestasi

### 2. Prediction Layer Classes

#### 2.1 PredictionRequest Class
**Tujuan**: Manajemen permintaan prediksi

**Atribut Utama**:
- `student_id`: ID siswa yang diprediksi
- `request_type`: Jenis prediksi (SINGLE/BATCH)
- `status`: Status permintaan (PENDING/PROCESSING/COMPLETED/FAILED)
- `priority`: Prioritas permintaan

**Method Utama**:
- `validate()`: Validasi permintaan
- `process()`: Proses prediksi
- `calculatePriority()`: Hitung prioritas

#### 2.2 FeatureVector Class
**Tujuan**: Representasi fitur untuk ML

**Atribut Utama**:
- `academic_average`: Rata-rata nilai akademik
- `attendance_rate`: Persentase kehadiran
- `income_score`: Skor penghasilan
- `socioeconomic_score`: Skor sosial ekonomi
- `achievement_score`: Skor prestasi

**Method Utama**:
- `normalize()`: Normalisasi fitur
- `toArray()`: Konversi ke array
- `validate()`: Validasi fitur

#### 2.3 PredictionResult Class
**Tujuan**: Hasil prediksi

**Atribut Utama**:
- `prediction`: Hasil prediksi (TINGGI/SEDANG/RENDAH)
- `confidence`: Tingkat kepercayaan (0-1)
- `feature_importance`: Kepentingan fitur
- `decision_path`: Jalur keputusan
- `explanation`: Penjelasan hasil

**Method Utama**:
- `getConfidenceLevel()`: Level kepercayaan
- `explainPrediction()`: Penjelasan prediksi
- `generateRecommendations()`: Rekomendasi

### 3. Machine Learning Layer Classes

#### 3.1 MLModel Class
**Tujuan**: Model machine learning utama

**Atribut Utama**:
- `algorithm`: Algoritma yang digunakan (C4.5)
- `accuracy`, `precision`, `recall`, `f1_score`: Metrik evaluasi
- `confusion_matrix`: Confusion matrix
- `feature_importance`: Kepentingan fitur
- `model_path`: Path file model

**Method Utama**:
- `train(data)`: Training model
- `predict(features)`: Prediksi
- `evaluate(testData)`: Evaluasi model
- `save()`: Simpan model
- `load()`: Load model

#### 3.2 DecisionTree Class
**Tujuan**: Implementasi algoritma C4.5

**Atribut Utama**:
- `root`: Root node pohon
- `max_depth`: Kedalaman maksimum
- `min_samples_split`: Minimum sampel untuk split
- `criterion`: Kriteria split (information_gain)

**Method Utama**:
- `buildTree()`: Membangun pohon keputusan
- `predict()`: Prediksi menggunakan pohon
- `calculateInformationGain()`: Hitung information gain
- `findBestSplit()`: Cari split terbaik

#### 3.3 TreeNode Class
**Tujuan**: Node dalam decision tree

**Atribut Utama**:
- `feature_name`: Nama fitur untuk split
- `split_value`: Nilai split
- `left_child`, `right_child`: Child nodes
- `prediction`: Prediksi jika leaf node
- `confidence`: Kepercayaan prediksi

**Method Utama**:
- `isLeaf()`: Cek apakah leaf node
- `getDecision()`: Dapatkan keputusan
- `calculateImpurity()`: Hitung impurity

### 4. Service Layer Classes

#### 4.1 PredictionService Class
**Tujuan**: Orchestrator prediksi utama

**Dependencies**:
- `MLModelRepository`: Akses model
- `FeatureEngineeringService`: Feature engineering
- `DataValidationService`: Validasi data

**Method Utama**:
- `predictSingle()`: Prediksi tunggal
- `predictBatch()`: Prediksi batch
- `loadActiveModel()`: Load model aktif
- `processFeatures()`: Proses fitur

#### 4.2 FeatureEngineeringService Class
**Tujuan**: Feature engineering dan preprocessing

**Method Utama**:
- `extractFeatures()`: Ekstrak fitur dari data siswa
- `normalizeFeatures()`: Normalisasi fitur
- `handleMissingFeatures()`: Handle missing values
- `calculateFeatureImportance()`: Hitung kepentingan fitur

#### 4.3 ModelTrainingService Class
**Tujuan**: Training dan manajemen model

**Method Utama**:
- `trainNewModel()`: Training model baru
- `collectTrainingData()`: Kumpulkan data training
- `evaluateModel()`: Evaluasi model
- `compareWithPreviousModel()`: Bandingkan dengan model lama

#### 4.4 DataValidationService Class
**Tujuan**: Validasi data dan kualitas

**Method Utama**:
- `validateStudentData()`: Validasi data siswa
- `checkDataCompleteness()`: Cek kelengkapan data
- `calculateDataScore()`: Hitung skor data

### 5. Controller Layer Classes

#### 5.1 PredictionController Class
**Tujuan**: REST API untuk prediksi

**Endpoints**:
- `POST /predict`: Prediksi tunggal
- `POST /batch-predict`: Prediksi batch
- `GET /result/{id}`: Dapatkan hasil
- `GET /history/{studentId}`: Riwayat prediksi

#### 5.2 ModelController Class
**Tujuan**: REST API untuk model management

**Endpoints**:
- `POST /train`: Training model
- `GET /model/{id}`: Info model
- `GET /active-model`: Model aktif
- `GET /model-history`: Riwayat model

### 6. Repository Layer Classes

#### 6.1 StudentRepository Class
**Tujuan**: Data access untuk siswa

**Method Utama**:
- `findEligibleForPrediction()`: Siswa yang layak prediksi
- `findWithCompleteData()`: Siswa dengan data lengkap
- `getDataCompleteness()`: Kelengkapan data siswa

#### 6.2 MLModelRepository Class
**Tujuan**: Data access untuk model

**Method Utama**:
- `findActiveModel()`: Model aktif
- `findByVersion()`: Model berdasarkan versi
- `archiveOldModels()`: Arsip model lama

#### 6.3 PredictionRepository Class
**Tujuan**: Data access untuk hasil prediksi

**Method Utama**:
- `findByStudentId()`: Prediksi berdasarkan siswa
- `getStatistics()`: Statistik prediksi
- `deleteOldResults()`: Hapus hasil lama

### 7. Utility Layer Classes

#### 7.1 ValidationResult Class
**Tujuan**: Hasil validasi

**Atribut**:
- `isValid`: Status validasi
- `errors`: Daftar error
- `warnings`: Daftar warning

#### 7.2 ModelInfo Class
**Tujuan**: Informasi model

**Atribut**:
- `modelId`: ID model
- `accuracy`: Akurasi model
- `trainedAt`: Waktu training
- `status`: Status model

## Relationship Mapping

### 1. Domain Relationships
```
Student (1) -----> (N) AcademicScore
Student (1) -----> (N) AttendanceRecord
Student (1) -----> (N) ParentIncome
Student (1) -----> (N) Achievement
Student (1) -----> (N) PredictionRequest
Student (1) -----> (N) PredictionResult
Student (1) -----> (1) FeatureVector
```

### 2. Prediction Flow Relationships
```
PredictionRequest (1) -----> (1) PredictionResult
FeatureVector (1) -----> (N) PredictionResult
MLModel (1) -----> (N) PredictionResult
MLModel (1) -----> (1) DecisionTree
DecisionTree (1) -----> (N) TreeNode
TreeNode (1) -----> (N) TreeNode [parent-child]
```

### 3. Service Dependencies
```
PredictionService -----> MLModelRepository
PredictionService -----> FeatureEngineeringService
PredictionService -----> DataValidationService
FeatureEngineeringService -----> StudentRepository
ModelTrainingService -----> MLModelRepository
```

### 4. Controller Dependencies
```
PredictionController -----> PredictionService
PredictionController -----> DataValidationService
ModelController -----> ModelTrainingService
ModelController -----> MLModelRepository
```

## Implementation Guidelines

### 1. Design Patterns

#### 1.1 Repository Pattern
```python
class StudentRepository:
    def __init__(self, database):
        self.db = database
    
    def findEligibleForPrediction(self):
        # Implementation
        pass
```

#### 1.2 Service Layer Pattern
```python
class PredictionService:
    def __init__(self, model_repo, feature_service, validation_service):
        self.model_repo = model_repo
        self.feature_service = feature_service
        self.validation_service = validation_service
    
    def predictSingle(self, student_id):
        # Implementation
        pass
```

#### 1.3 Factory Pattern
```python
class MLModelFactory:
    @staticmethod
    def create_model(algorithm_type):
        if algorithm_type == "C45":
            return DecisionTree()
        # Other algorithms
```

### 2. Data Flow

#### 2.1 Prediction Flow
```
1. PredictionRequest → PredictionController
2. PredictionController → PredictionService
3. PredictionService → DataValidationService (validate)
4. PredictionService → FeatureEngineeringService (extract features)
5. PredictionService → MLModelRepository (get active model)
6. MLModel → DecisionTree (predict)
7. DecisionTree → TreeNode (traverse)
8. PredictionResult ← TreeNode (result)
9. PredictionRepository ← PredictionResult (save)
```

#### 2.2 Training Flow
```
1. TrainingRequest → ModelController
2. ModelController → ModelTrainingService
3. ModelTrainingService → StudentRepository (collect data)
4. ModelTrainingService → DataPreprocessor (preprocess)
5. ModelTrainingService → DecisionTree (train)
6. ModelTrainingService → ModelEvaluator (evaluate)
7. MLModelRepository ← MLModel (save)
```

## Performance Metrics

### 1. Response Time Targets
- **Single Prediction**: < 2 detik
- **Batch Prediction (50 siswa)**: < 10 detik
- **Model Training**: < 5 menit
- **Feature Extraction**: < 500ms per siswa

### 2. Accuracy Targets
- **Model Accuracy**: > 85%
- **Precision**: > 80%
- **Recall**: > 80%
- **F1-Score**: > 80%

### 3. Scalability Targets
- **Concurrent Users**: 100+ users
- **Daily Predictions**: 10,000+ predictions
- **Data Volume**: 50,000+ siswa records
- **Model Retraining**: Monthly

## Security Implementation

### 1. Authentication & Authorization
```python
class PredictionController:
    @require_auth
    @require_role(['admin', 'teacher'])
    def predict(self, request):
        # Implementation
```

### 2. Data Privacy
- **Data Masking**: Mask sensitive student data
- **Audit Logging**: Log all prediction requests
- **Data Retention**: Automatic cleanup of old predictions

### 3. Input Validation
```python
class DataValidationService:
    def validateStudentData(self, student):
        # Validate all input fields
        # Sanitize data
        # Check business rules
        return ValidationResult()
```

## Testing Strategy

### 1. Unit Testing
```python
class TestPredictionService:
    def test_predict_single_valid_student(self):
        # Test valid prediction
        pass
    
    def test_predict_single_invalid_data(self):
        # Test invalid data handling
        pass
```

### 2. Integration Testing
```python
class TestPredictionFlow:
    def test_end_to_end_prediction(self):
        # Test complete prediction flow
        pass
```

### 3. Performance Testing
- **Load Testing**: Test dengan 1000+ concurrent predictions
- **Stress Testing**: Test dengan data volume besar
- **Memory Testing**: Monitor memory usage

## Deployment Architecture

### 1. Production Environment
```yaml
# docker-compose.yml
services:
  prediction-service:
    image: edupro/prediction-service
    replicas: 3
    resources:
      memory: 2GB
      cpu: 1
    
  ml-model-service:
    image: edupro/ml-model-service
    replicas: 2
    resources:
      memory: 4GB
      cpu: 2
```

### 2. Database Schema
```sql
-- Prediction Results Table
CREATE TABLE prediction_results (
    id UUID PRIMARY KEY,
    student_id UUID NOT NULL,
    model_id UUID NOT NULL,
    prediction VARCHAR(20) NOT NULL,
    confidence DECIMAL(5,4) NOT NULL,
    feature_values JSONB,
    predicted_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_student_id (student_id),
    INDEX idx_model_id (model_id),
    INDEX idx_predicted_at (predicted_at)
);
```

## Maintenance Guidelines

### 1. Model Retraining
- **Schedule**: Retrain model setiap 3 bulan
- **Trigger**: Retrain jika accuracy drop < 80%
- **Data**: Gunakan data 2 tahun terakhir
- **Validation**: Cross-validation dengan 5 folds

### 2. Data Cleanup
- **Old Predictions**: Hapus prediksi > 2 tahun
- **Archived Models**: Arsip model lama
- **Log Cleanup**: Hapus log > 6 bulan

### 3. Performance Tuning
- **Query Optimization**: Review slow queries monthly
- **Index Maintenance**: Rebuild indexes quarterly
- **Cache Tuning**: Adjust cache size based on usage

## Future Enhancements

### 1. Advanced ML Features
- **Ensemble Methods**: Combine multiple algorithms
- **Deep Learning**: Neural network untuk complex patterns
- **AutoML**: Automated hyperparameter tuning
- **Feature Selection**: Automated feature selection

### 2. Real-time Features
- **Streaming Predictions**: Real-time prediction updates
- **Live Monitoring**: Real-time model performance monitoring
- **Dynamic Retraining**: Automatic model updates

### 3. Advanced Analytics
- **Prediction Explanations**: SHAP/LIME explanations
- **Bias Detection**: Detect dan mitigate model bias
- **A/B Testing**: Compare different model versions
- **Causal Analysis**: Causal relationship analysis

## Conclusion

Class diagram sistem prediksi EduPro ini menyediakan arsitektur yang robust, scalable, dan maintainable untuk prediksi prestasi siswa. Dengan 25+ kelas yang terorganisir dalam 7 layer, sistem ini mendukung:

1. **Comprehensive Data Management** - Manajemen data siswa yang lengkap
2. **Advanced ML Pipeline** - Pipeline ML dengan algoritma C4.5
3. **Scalable Architecture** - Arsitektur yang dapat di-scale
4. **Robust Error Handling** - Penanganan error yang comprehensive
5. **Performance Optimization** - Optimasi performa untuk production
6. **Security & Privacy** - Keamanan dan privasi data siswa
7. **Monitoring & Alerting** - Monitoring dan alerting system

Implementasi berdasarkan class diagram ini akan menghasilkan sistem prediksi yang reliable, accurate, dan user-friendly untuk mendukung pengambilan keputusan dalam dunia pendidikan.

---

**Dibuat**: 19 Juni 2025  
**Versi**: 1.0  
**Status**: Production Ready  
**Maintainer**: EduPro Development Team 