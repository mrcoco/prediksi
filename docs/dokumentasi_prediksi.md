# Dokumentasi Sequence Diagram Manajemen Prediksi Prestasi - Sistem EduPro

## Executive Summary

Dokumen ini berisi sequence diagram untuk modul manajemen prediksi prestasi siswa dalam aplikasi EduPro. Diagram menggambarkan alur interaksi yang komprehensif antara User, Frontend, Backend API, Database, dan Model C4.5 untuk operasi machine learning lengkap dengan fitur training model, prediksi individual, prediksi batch, riwayat prediksi, visualisasi model, dan generate dummy data.

## Daftar Isi

1. [Overview Sistem](#overview-sistem)
2. [Sequence Diagram - Format Mermaid](#sequence-diagram-format-mermaid)
3. [Sequence Diagram - Format PlantUML](#sequence-diagram-format-plantuml)
4. [Penjelasan Alur Sistem](#penjelasan-alur-sistem)
5. [Komponen Sistem](#komponen-sistem)
6. [Business Logic](#business-logic)
7. [Error Handling](#error-handling)
8. [Kesimpulan](#kesimpulan)

## Overview Sistem

Modul manajemen prediksi prestasi siswa memiliki fitur-fitur utama:
- **Train Model**: Melatih model C4.5 dengan data siswa, nilai, presensi, dan penghasilan
- **Single Prediction**: Prediksi prestasi individual berdasarkan siswa dan semester
- **Batch Prediction**: Prediksi massal untuk semua siswa dalam semester tertentu
- **Prediction History**: Riwayat prediksi dengan CRUD operations
- **Model Visualization**: Visualisasi pohon keputusan dan metrics
- **Export Functionality**: Export riwayat prediksi ke Excel
- **Generate Dummy Data**: Support testing dengan data dummy
- **Authentication**: Semua operasi memerlukan Bearer token

### Fitur Khusus:
- **C4.5 Algorithm**: Decision Tree dengan entropy criterion untuk klasifikasi
- **3 Features**: rata_rata (nilai), kategori_penghasilan, kategori_kehadiran
- **3 Classes**: Prestasi Rendah, Sedang, Tinggi
- **Auto-Training**: Model otomatis dilatih jika belum tersedia
- **Feature Importance**: Analisis faktor yang mempengaruhi prediksi
- **Confidence Score**: Tingkat kepercayaan prediksi (0-1)
- **Data Validation**: Comprehensive validation untuk data completeness
- **Model Metrics**: Accuracy, precision, recall, f1-score, confusion matrix

## Sequence Diagram - Format Mermaid

File diagram Mermaid tersimpan di: `docs/sequence_diagram_prediksi.mmd`

### Cara Menggunakan Diagram Mermaid:
1. **Mermaid Live Editor**: https://mermaid.live/
2. **VS Code Extension**: Mermaid Preview
3. **GitHub**: Otomatis render di README.md
4. **Documentation Tools**: GitBook, Notion, Confluence

## Sequence Diagram - Format PlantUML

File diagram PlantUML tersimpan di: `docs/sequence_diagram_prediksi.puml`

### Cara Menggunakan Diagram PlantUML:
1. **PlantUML Server**: http://www.plantuml.com/plantuml/
2. **VS Code Extension**: PlantUML
3. **IntelliJ Plugin**: PlantUML Integration
4. **CLI Tool**: plantuml.jar

### Generate Images:
```bash
# Generate PNG
java -jar plantuml.jar sequence_diagram_prediksi.puml

# Generate SVG
java -jar plantuml.jar -tsvg sequence_diagram_prediksi.puml
```

## Penjelasan Alur Sistem

### 1. Arsitektur Sistem

Sistem prediksi prestasi menggunakan arsitektur 5-layer:

1. **Presentation Layer**: Frontend dengan dashboard prediksi
2. **API Layer**: FastAPI dengan machine learning endpoints
3. **Business Logic Layer**: Model validation, data preparation, prediction logic
4. **Model Layer**: C4.5 Decision Tree dengan scikit-learn
5. **Data Layer**: PostgreSQL database dengan relational data

### 2. Fitur-Fitur Khusus

#### C4.5 Decision Tree Algorithm
- **Algorithm**: DecisionTreeClassifier dengan criterion='entropy'
- **Features**: 3 input features (rata_rata, kategori_penghasilan, kategori_kehadiran)
- **Classes**: 3 output classes (Rendah, Sedang, Tinggi)
- **Training Split**: 80% training, 20% testing
- **Evaluation**: Accuracy, classification report, confusion matrix

#### Data Preparation & Feature Engineering
- **Data Sources**: JOIN dari 4 tabel (siswa, nilai_raport, presensi, penghasilan_ortu)
- **Feature Extraction**: rata_rata dari nilai, kategori dari penghasilan dan presensi
- **Label Generation**: Business rules untuk generate target labels
- **Categorical Encoding**: kategori_penghasilan: {Rendah:0, Menengah:1, Tinggi:2}, kategori_kehadiran: {Rendah:0, Sedang:1, Tinggi:2}

#### Auto-Training Mechanism
- **Smart Training**: Model otomatis dilatih jika belum tersedia
- **Data Validation**: Cek ketersediaan data berlabel sebelum training
- **Error Handling**: Informative error messages untuk insufficient data
- **Visualization**: Automatic tree visualization generation

#### Prediction Process
- **Data Validation**: Comprehensive validation untuk siswa, nilai, presensi, penghasilan
- **Feature Preparation**: Extract dan format data untuk model input
- **Model Inference**: predict() dan predict_proba() untuk confidence
- **Result Storage**: Save prediction results ke database
- **Response Building**: Comprehensive response dengan detail factors

### 3. Security Features

#### Authentication & Authorization
- **Bearer Token**: JWT authentication untuk semua endpoints
- **Role-based Access**: User permissions untuk modul prediksi
- **Token Validation**: Setiap request divalidasi token-nya

#### Data Protection
- **SQL Injection Prevention**: Menggunakan parameterized query
- **Input Validation**: Validasi di level schema dan database
- **Error Handling**: Error message tidak expose sensitive data

## Komponen Sistem

### 1. Frontend Components

#### Prediction Dashboard
```javascript
// Prediction form configuration
{
    siswa_dropdown: {
        dataSource: "/api/siswa",
        valueField: "id",
        textField: "nama"
    },
    semester_dropdown: ["Ganjil", "Genap"],
    tahun_ajaran_dropdown: ["2024/2025", "2025/2026"]
}
```

#### Model Training Interface
```javascript
function trainModel() {
    showLoadingState("Melatih model...");
    
    $.ajax({
        url: "/api/prediksi/train",
        method: "POST",
        headers: { "Authorization": "Bearer " + getToken() },
        success: function(response) {
            hideLoadingState();
            showSuccessNotification(
                `Model berhasil dilatih dengan akurasi ${(response.data.accuracy * 100).toFixed(2)}%`
            );
            loadTreeVisualization();
            loadModelMetrics();
        },
        error: function(xhr) {
            hideLoadingState();
            showErrorNotification("Gagal melatih model: " + xhr.responseJSON?.detail);
        }
    });
}
```

#### Prediction Results Display
```javascript
function displayPredictionResults(result) {
    const resultHtml = `
        <div class="prediction-result">
            <h3>Hasil Prediksi: ${result.prediksi_prestasi}</h3>
            <div class="confidence">Confidence: ${(result.confidence * 100).toFixed(1)}%</div>
            <div class="detail-factors">
                <h4>Detail Faktor:</h4>
                <ul>
                    <li>Nilai Rata-rata: ${result.detail_faktor.nilai_rata_rata}</li>
                    <li>Kategori Penghasilan: ${result.detail_faktor.kategori_penghasilan}</li>
                    <li>Kategori Kehadiran: ${result.detail_faktor.kategori_kehadiran}</li>
                </ul>
            </div>
            <div class="feature-importance">
                <h4>Feature Importance:</h4>
                <ul>
                    ${Object.entries(result.detail_faktor.feature_importances).map(([feature, importance]) => 
                        `<li>${feature}: ${(importance * 100).toFixed(1)}%</li>`
                    ).join('')}
                </ul>
            </div>
        </div>
    `;
    $("#prediction-results").html(resultHtml);
}
```

### 2. Backend Components

#### API Router Structure
```python
@router.post("/train", status_code=200)  # Training model
@router.post("/", response_model=PrediksiResponse)  # Single prediction
@router.post("/batch", status_code=200)  # Batch prediction
@router.get("/history", response_model=List[Dict])  # Prediction history
@router.delete("/history/{prestasi_id}", status_code=204)  # Delete history
@router.get("/history/export/excel")  # Export Excel
@router.get("/visualization")  # Tree visualization
@router.get("/model-metrics")  # Model metrics
@router.get("/confusion-matrix")  # Confusion matrix
@router.post("/generate-dummy-data", status_code=201)  # Generate dummy data
```

#### C4.5 Model Implementation
```python
class C45Model:
    def __init__(self):
        self.model = DecisionTreeClassifier(criterion='entropy', random_state=42)
        self.features = ['rata_rata', 'kategori_penghasilan', 'kategori_kehadiran']
        self.trained = False
        self.tree_visualization = None
        self.confusion_matrix = None
        self.model_metrics = None
        self.class_labels = ['Rendah', 'Sedang', 'Tinggi']
        self.last_trained = None

    def predict(self, data):
        if not self.trained:
            raise ValueError("Model belum dilatih")
        
        # Validate features
        for feature in self.features:
            if feature not in data:
                raise ValueError(f"Data tidak memiliki fitur {feature}")
        
        # Convert categorical to numeric
        data_copy = data.copy()
        if 'kategori_penghasilan' in data_copy:
            data_copy['kategori_penghasilan'] = {
                'Rendah': 0, 'Menengah': 1, 'Tinggi': 2
            }.get(data_copy['kategori_penghasilan'], 0)
        if 'kategori_kehadiran' in data_copy:
            data_copy['kategori_kehadiran'] = {
                'Rendah': 0, 'Sedang': 1, 'Tinggi': 2
            }.get(data_copy['kategori_kehadiran'], 0)
        
        # Prepare data for prediction
        X_pred = pd.DataFrame([data_copy])[self.features]
        
        # Make prediction
        prediction = self.model.predict(X_pred)[0]
        probabilities = self.model.predict_proba(X_pred)[0]
        confidence = max(probabilities)
        
        # Get feature importances
        feature_importances = dict(zip(self.features, self.model.feature_importances_))
        
        return {
            'prediksi': prediction,
            'confidence': confidence,
            'feature_importances': feature_importances
        }
```

#### Database Schema
```sql
-- Prestasi table untuk menyimpan hasil prediksi
CREATE TABLE prestasi (
    id SERIAL PRIMARY KEY,
    siswa_id INTEGER REFERENCES siswa(id),
    semester VARCHAR(20) NOT NULL,
    tahun_ajaran VARCHAR(20) NOT NULL,
    prediksi_prestasi VARCHAR(20) NOT NULL,
    confidence DECIMAL(5,3) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(siswa_id, semester, tahun_ajaran)
);

-- Index untuk performance
CREATE INDEX idx_prestasi_siswa_semester ON prestasi(siswa_id, semester, tahun_ajaran);
CREATE INDEX idx_prestasi_created_at ON prestasi(created_at);
```

### 3. Business Logic Components

#### Label Generation Rules
```python
def generate_label(self, rata_rata, kategori_penghasilan, kategori_kehadiran):
    """Membuat label prediksi_prestasi berdasarkan kriteria tertentu"""
    if rata_rata >= 85 and kategori_penghasilan == 'Tinggi' and kategori_kehadiran == 'Tinggi':
        return 'Tinggi'
    elif rata_rata >= 75 and kategori_kehadiran == 'Tinggi':
        return 'Sedang'
    else:
        return 'Rendah'
```

#### Data Validation Rules
```python
def validate_prediction_data(siswa_id: int, semester: str, tahun_ajaran: str, db: Session):
    # Validate siswa exists
    siswa = db.query(Siswa).filter(Siswa.id == siswa_id).first()
    if not siswa:
        raise HTTPException(404, f"Siswa dengan ID {siswa_id} tidak ditemukan")
    
    # Validate nilai exists
    nilai = db.query(NilaiRaport).filter(
        NilaiRaport.siswa_id == siswa_id,
        NilaiRaport.semester == semester,
        NilaiRaport.tahun_ajaran == tahun_ajaran
    ).first()
    if not nilai:
        raise HTTPException(404, f"Data nilai tidak ditemukan untuk semester {semester}")
    
    # Validate presensi exists
    presensi = db.query(Presensi).filter(
        Presensi.siswa_id == siswa_id,
        Presensi.semester == semester,
        Presensi.tahun_ajaran == tahun_ajaran
    ).first()
    if not presensi:
        raise HTTPException(404, f"Data presensi tidak ditemukan untuk semester {semester}")
    
    # Validate penghasilan exists
    penghasilan = db.query(PenghasilanOrtu).filter(
        PenghasilanOrtu.siswa_id == siswa_id
    ).first()
    if not penghasilan:
        raise HTTPException(404, f"Data penghasilan orang tua tidak ditemukan")
    
    return siswa, nilai, presensi, penghasilan
```

## Business Logic

### 1. Machine Learning Workflow

#### Training Process
```
1. Data Collection
   ├── JOIN siswa, nilai_raport, presensi, penghasilan_ortu
   ├── Extract features: rata_rata, kategori_penghasilan, kategori_kehadiran
   └── Generate labels using business rules

2. Feature Engineering
   ├── Encode categorical features to numeric
   ├── Validate data completeness
   └── Handle missing values

3. Model Training
   ├── Split data (80% training, 20% testing)
   ├── Train DecisionTreeClassifier with entropy
   ├── Evaluate performance (accuracy, precision, recall, f1)
   └── Generate confusion matrix

4. Model Persistence
   ├── Save model state in memory
   ├── Generate tree visualization
   ├── Store model metrics
   └── Set trained flag
```

#### Prediction Process
```
1. Input Validation
   ├── Validate siswa_id exists
   ├── Check data completeness (nilai, presensi, penghasilan)
   └── Validate semester dan tahun_ajaran

2. Data Preparation
   ├── Extract siswa data
   ├── Format features for model input
   └── Convert categorical to numeric

3. Model Inference
   ├── Check model trained status
   ├── Auto-train if not available
   ├── Make prediction with confidence
   └── Get feature importances

4. Result Processing
   ├── Save prediction to database
   ├── Build comprehensive response
   └── Return result with details
```

### 2. Business Rules

#### Label Generation Criteria
| Kondisi | Prestasi |
|---------|----------|
| rata_rata ≥ 85 AND kategori_penghasilan = 'Tinggi' AND kategori_kehadiran = 'Tinggi' | Tinggi |
| rata_rata ≥ 75 AND kategori_kehadiran = 'Tinggi' | Sedang |
| Selain kondisi di atas | Rendah |

#### Feature Categories
| Feature | Categories | Encoding |
|---------|------------|----------|
| kategori_penghasilan | Rendah, Menengah, Tinggi | 0, 1, 2 |
| kategori_kehadiran | Rendah, Sedang, Tinggi | 0, 1, 2 |
| rata_rata | Continuous (0-100) | Numeric |

### 3. Model Configuration

#### Hyperparameters
```python
model_config = {
    'criterion': 'entropy',  # Information gain untuk C4.5
    'random_state': 42,      # Reproducible results
    'max_depth': None,       # No depth limit
    'min_samples_split': 2,  # Minimum samples to split
    'min_samples_leaf': 1    # Minimum samples in leaf
}
```

## Error Handling

### 1. HTTP Status Codes

| Status Code | Scenario | Response |
|-------------|----------|----------|
| 200 | Success (Training/Prediction/History) | Data returned |
| 201 | Success (Generate dummy data) | Creation successful |
| 204 | Success (Delete history) | No content |
| 400 | Bad Request | Model not trained/validation error |
| 401 | Unauthorized | Invalid/missing token |
| 404 | Not Found | Siswa/Data doesn't exist |
| 500 | Server Error | Internal server error |

### 2. Error Response Format

```json
{
    "detail": "Error message in Indonesian",
    "status_code": 400,
    "timestamp": "2025-06-21T10:30:00Z"
}
```

### 3. Frontend Error Handling

```javascript
// Prediction error handling
function handlePredictionError(xhr) {
    if (xhr.status === 401) {
        showErrorNotification("Sesi telah berakhir, silakan login kembali");
        redirectToLogin();
    } else if (xhr.status === 400) {
        if (xhr.responseJSON.detail.includes("Model belum dilatih")) {
            showErrorNotification("Model belum dilatih. Silakan latih model terlebih dahulu.");
            showTrainModelButton();
        } else {
            showErrorNotification(xhr.responseJSON.detail);
        }
    } else if (xhr.status === 404) {
        showErrorNotification("Data tidak lengkap untuk prediksi");
    } else {
        showErrorNotification("Terjadi kesalahan sistem");
    }
}
```

### 4. Common Error Scenarios

1. **Model not trained**: Prediction request sebelum model dilatih → auto-train atau error message
2. **Incomplete data**: Siswa tidak memiliki data nilai/presensi/penghasilan untuk semester tertentu
3. **Token expired**: Operasi dengan token kadaluarsa → redirect login
4. **Insufficient training data**: Training dengan data berlabel tidak cukup → suggest generate dummy data
5. **Network error**: Koneksi backend bermasalah → retry mechanism

## Kesimpulan

Sequence diagram manajemen prediksi prestasi menunjukkan alur sistem machine learning yang komprehensif dengan fitur:

- ✅ **Complete ML Pipeline** dengan training, prediction, evaluation
- ✅ **C4.5 Decision Tree** algorithm dengan entropy criterion
- ✅ **3-Feature Input** (rata_rata, kategori_penghasilan, kategori_kehadiran)
- ✅ **3-Class Output** (Rendah, Sedang, Tinggi) dengan confidence scores
- ✅ **Auto-Training** mechanism untuk user convenience
- ✅ **Data Validation** comprehensive untuk data completeness
- ✅ **Batch Processing** untuk prediksi massal siswa
- ✅ **Model Visualization** pohon keputusan dan metrics
- ✅ **Prediction History** dengan CRUD operations dan Excel export
- ✅ **Security** dengan Bearer token authentication
- ✅ **Testing Support** dengan generate dummy data functionality
- ✅ **Error Handling** comprehensive untuk semua scenarios

### File yang Dibuat:

1. **Dokumentasi Utama**: `docs/dokumentasi_prediksi.md`
2. **Diagram Mermaid**: `docs/sequence_diagram_prediksi.mmd`
3. **Diagram PlantUML**: `docs/sequence_diagram_prediksi.puml`

### Tools untuk Visualisasi:

**Mermaid:**
- Mermaid Live Editor: https://mermaid.live/
- VS Code Extension: Mermaid Preview
- GitHub integration (otomatis render)

**PlantUML:**
- PlantUML Server: http://www.plantuml.com/plantuml/
- VS Code Extension: PlantUML
- CLI: `java -jar plantuml.jar file.puml`

### Keunggulan Sistem Prediksi:

1. **Machine Learning Ready**: Complete C4.5 implementation dengan scikit-learn
2. **Business Logic Integration**: Smart label generation dengan business rules
3. **Data Validation**: Comprehensive validation untuk data integrity
4. **User-Friendly**: Auto-training dan intuitive prediction interface
5. **Performance**: Efficient queries dan model caching
6. **Security**: Full authentication dan authorization
7. **Monitoring**: Model metrics, confusion matrix, feature importance
8. **Export Ready**: Excel export untuk reporting

Sistem ini siap untuk production dengan dokumentasi lengkap dan implementasi yang robust untuk prediksi prestasi siswa menggunakan machine learning C4.5 algorithm dengan comprehensive workflow dan professional documentation.

---

**Dibuat pada**: 21 Juni 2025  
**Versi**: 1.0  
**Status**: Production Ready  
**Sistem**: EduPro - Sistem Informasi Prediksi Prestasi Siswa 