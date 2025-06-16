# Dokumentasi Confusion Matrix dan Model Metrics API

## Overview

Sistem prediksi prestasi siswa telah ditingkatkan dengan fitur evaluasi model yang komprehensif, termasuk confusion matrix dan berbagai metrik evaluasi untuk model C4.5.

## 🚀 Fitur Baru

### 1. Confusion Matrix API
- **Endpoint**: `GET /api/prediksi/confusion-matrix`
- **Fungsi**: Mendapatkan confusion matrix dari model C4.5 yang sudah dilatih
- **Authentication**: Required (Bearer Token)

### 2. Model Metrics API
- **Endpoint**: `GET /api/prediksi/model-metrics`
- **Fungsi**: Mendapatkan metrik evaluasi model (Accuracy, Precision, Recall, F1-Score)
- **Authentication**: Required (Bearer Token)

## 📊 API Endpoints Detail

### GET `/api/prediksi/confusion-matrix`

#### Response Success
```json
{
    "status": "success",
    "confusion_matrix": [
        [10, 2, 1],
        [1, 15, 2],
        [0, 1, 12]
    ],
    "labels": ["Rendah", "Sedang", "Tinggi"]
}
```

### GET `/api/prediksi/model-metrics`

#### Response Success
```json
{
    "status": "success",
    "metrics": {
        "accuracy": 0.8571428571428571,
        "precision": 0.8456140350877193,
        "recall": 0.8571428571428571,
        "f1_score": 0.8456140350877193
    },
    "last_trained": "2024-12-19T10:30:00.123456"
}
```

## 🎯 Interpretasi Hasil

### Confusion Matrix
Confusion matrix menunjukkan performa klasifikasi model:
- **Diagonal utama**: Prediksi yang benar
- **Off-diagonal**: Prediksi yang salah

### Model Metrics
- **Accuracy**: Persentase prediksi yang benar
- **Precision**: Persentase prediksi positif yang benar
- **Recall**: Persentase kelas aktual yang berhasil diprediksi
- **F1-Score**: Harmonic mean dari precision dan recall

## 🔧 Implementasi Backend

### Model Enhancement
```python
class C45Model:
    def __init__(self):
        self.confusion_matrix = None
        self.model_metrics = None
        self.class_labels = ['Rendah', 'Sedang', 'Tinggi']
        self.last_trained = None
```

### API Endpoints
```python
@router.get("/confusion-matrix")
def get_confusion_matrix():
    # Implementation

@router.get("/model-metrics")
def get_model_metrics():
    # Implementation
```

## 🔄 Integrasi dengan Frontend

Frontend sudah memiliki fungsi untuk mengintegrasikan endpoint baru:
- `loadModelEvaluation()`
- `displayConfusionMatrix()`
- `displayModelMetrics()`

## 🛡️ Security

- Authentication required untuk semua endpoint
- Proper error handling
- Secure error messages

## 📈 Performance

- Cached results setelah training
- Efficient memory usage
- Minimal API calls

## 🔍 Troubleshooting

### Common Issues

#### 1. "Model belum dilatih"
**Penyebab**: Model C4.5 belum pernah dilatih
**Solusi**: Jalankan endpoint `/api/prediksi/train` terlebih dahulu

#### 2. "Could not validate credentials"
**Penyebab**: Token authentication tidak valid
**Solusi**: Login ulang untuk mendapatkan token baru

#### 3. "Confusion matrix tidak tersedia"
**Penyebab**: Model dilatih dengan versi lama yang belum support metrics
**Solusi**: Latih ulang model dengan versi terbaru

### Debugging Tips

1. **Check Model Status**: Pastikan model sudah dilatih
2. **Verify Authentication**: Pastikan token valid
3. **Check Data**: Pastikan ada cukup data untuk training
4. **Monitor Logs**: Check server logs untuk error details

## 📝 Best Practices

### Model Training
1. Pastikan data cukup (minimal 10 samples berlabel)
2. Latih model secara berkala dengan data terbaru
3. Monitor metrics untuk mendeteksi degradasi performa

### API Usage
1. Selalu check status response sebelum menggunakan data
2. Handle error cases dengan graceful fallback
3. Cache hasil di frontend untuk mengurangi API calls

### Performance Optimization
1. Load metrics hanya saat diperlukan
2. Gunakan loading states untuk better UX
3. Implement retry logic untuk network errors

## 🚀 Future Enhancements

### Planned Features
1. **Cross-validation Metrics**: K-fold cross-validation results
2. **Feature Importance**: Detailed feature importance analysis
3. **ROC Curves**: ROC curves untuk binary classification
4. **Model Comparison**: Compare multiple model versions
5. **Export Functionality**: Export metrics ke Excel/PDF

### API Versioning
- Current version: v1
- Backward compatibility maintained
- New features added incrementally

---

**Dokumentasi ini akan terus diperbarui seiring dengan pengembangan fitur baru.** 