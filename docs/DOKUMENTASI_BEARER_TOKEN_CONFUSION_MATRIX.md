# Dokumentasi Bearer Token untuk Confusion Matrix dan Model Metrics

## ✅ Implementasi Selesai

Header bearer token telah berhasil ditambahkan untuk akses confusion matrix dan model metrics di frontend.

## 🔧 Implementasi Frontend

### JavaScript Functions dengan Bearer Token

#### File: `frontend/js/app.js`

```javascript
// ========== FUNGSI LOAD MODEL EVALUATION ==========
function loadModelEvaluation() {
    // Load confusion matrix
    $.ajax({
        url: `${API_URL}/prediksi/confusion-matrix`,
        method: "GET",
        beforeSend: function(xhr) {
            $("#confusion-matrix-container").addClass("loading").html("");
            const token = getToken();
            if (token) {
                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            }
        },
        success: function(data) {
            $("#confusion-matrix-container").removeClass("loading");
            if (data.status === "success" && data.confusion_matrix) {
                displayConfusionMatrix(data.confusion_matrix, data.labels);
            } else {
                $("#confusion-matrix-container").html('<p>Confusion matrix tidak tersedia. Silakan latih model terlebih dahulu.</p>');
            }
        },
        error: function(xhr) {
            $("#confusion-matrix-container").removeClass("loading");
            console.error("Error loading confusion matrix:", xhr.responseText);
            const errorMsg = xhr.responseJSON ? xhr.responseJSON.detail : 'Gagal memuat confusion matrix';
            $("#confusion-matrix-container").html(`<p>${errorMsg}. Silakan coba lagi.</p>`);
        }
    });
    
    // Load model metrics
    $.ajax({
        url: `${API_URL}/prediksi/model-metrics`,
        method: "GET",
        beforeSend: function(xhr) {
            const token = getToken();
            if (token) {
                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            }
        },
        success: function(data) {
            if (data.status === "success" && data.metrics) {
                displayModelMetrics(data.metrics, data.last_trained);
            } else {
                resetModelMetrics();
            }
        },
        error: function(xhr) {
            console.error("Error loading model metrics:", xhr.responseText);
            const errorMsg = xhr.responseJSON ? xhr.responseJSON.detail : 'Gagal memuat model metrics';
            console.warn(`Model metrics error: ${errorMsg}`);
            resetModelMetrics();
        }
    });
}
```

## 🛡️ Security Features

### Authentication Headers
- ✅ **Bearer Token**: Menggunakan `Authorization: Bearer <token>`
- ✅ **Token Validation**: Token diambil dari `localStorage` menggunakan `getToken()`
- ✅ **Automatic Header**: Header otomatis ditambahkan di `beforeSend`
- ✅ **Error Handling**: Proper error handling untuk unauthorized access

### Token Management
```javascript
// Fungsi untuk mendapatkan token dari localStorage
function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

// Header ditambahkan otomatis di beforeSend
beforeSend: function(xhr) {
    const token = getToken();
    if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }
}
```

## 📊 API Response dengan Authentication

### Dengan Token Valid
```json
// GET /api/prediksi/confusion-matrix
{
    "status": "success",
    "confusion_matrix": [[10, 2, 1], [1, 15, 2], [0, 1, 12]],
    "labels": ["Rendah", "Sedang", "Tinggi"]
}

// GET /api/prediksi/model-metrics
{
    "status": "success",
    "metrics": {
        "accuracy": 0.857,
        "precision": 0.845,
        "recall": 0.857,
        "f1_score": 0.845
    },
    "last_trained": "2024-12-19T10:30:00"
}
```

### Tanpa Token atau Token Invalid
```json
{
    "detail": "Not authenticated"
}
```

## 🔍 Testing Authentication

### Test Tanpa Token
```bash
curl -X GET "http://localhost:8000/api/prediksi/confusion-matrix" \
  -H "Content-Type: application/json"
# Response: {"detail":"Not authenticated"}

curl -X GET "http://localhost:8000/api/prediksi/model-metrics" \
  -H "Content-Type: application/json"
# Response: {"detail":"Not authenticated"}
```

### Test Dengan Token Valid
```bash
curl -X GET "http://localhost:8000/api/prediksi/confusion-matrix" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <valid-token>"
# Response: Success dengan data confusion matrix

curl -X GET "http://localhost:8000/api/prediksi/model-metrics" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <valid-token>"
# Response: Success dengan data model metrics
```

## 🔄 Integration Flow

### 1. User Login
```javascript
// User login dan mendapatkan token
localStorage.setItem('access_token', response.access_token);
```

### 2. Dashboard Load
```javascript
// Dashboard load dan panggil loadModelEvaluation()
loadDashboardData(); // Memanggil loadModelEvaluation()
```

### 3. Automatic Token Injection
```javascript
// Token otomatis ditambahkan ke header
const token = getToken(); // Ambil dari localStorage
xhr.setRequestHeader('Authorization', `Bearer ${token}`);
```

### 4. API Call dengan Authentication
```javascript
// API call dengan header authorization
GET /api/prediksi/confusion-matrix
Authorization: Bearer <token>
```

### 5. Response Handling
```javascript
// Handle response berdasarkan status
if (data.status === "success") {
    displayConfusionMatrix(data.confusion_matrix, data.labels);
} else {
    // Handle error atau model belum dilatih
}
```

## 🚨 Error Handling

### Authentication Errors
```javascript
error: function(xhr) {
    if (xhr.status === 401) {
        // Token expired atau invalid
        console.error("Authentication failed");
        // Redirect ke login atau refresh token
    } else {
        // Error lainnya
        const errorMsg = xhr.responseJSON ? xhr.responseJSON.detail : 'Gagal memuat data';
        console.error(errorMsg);
    }
}
```

### Model Not Trained
```javascript
if (data.status === "error" && data.message.includes("belum dilatih")) {
    $("#confusion-matrix-container").html('<p>Model belum dilatih. Silakan latih model terlebih dahulu.</p>');
}
```

## ✅ Verification Checklist

- ✅ **Bearer token ditambahkan** ke confusion matrix endpoint
- ✅ **Bearer token ditambahkan** ke model metrics endpoint
- ✅ **Token diambil dari localStorage** menggunakan `getToken()`
- ✅ **Header authorization** ditambahkan di `beforeSend`
- ✅ **Error handling** untuk unauthorized access
- ✅ **Consistent error messages** untuk better UX
- ✅ **Backend authentication** berfungsi dengan baik
- ✅ **Frontend integration** terintegrasi dengan dashboard

## 🎯 Benefits

### Security
- **Protected endpoints**: Semua endpoint evaluation dilindungi authentication
- **Token validation**: Token divalidasi di setiap request
- **Unauthorized access prevention**: Mencegah akses tanpa authorization

### User Experience
- **Seamless integration**: Token otomatis ditambahkan tanpa user intervention
- **Error feedback**: Clear error messages untuk authentication issues
- **Consistent behavior**: Sama dengan endpoint lainnya di sistem

### Maintainability
- **Centralized token management**: Token management terpusat di `getToken()`
- **Reusable pattern**: Pattern yang sama digunakan di seluruh aplikasi
- **Easy debugging**: Clear error logging untuk troubleshooting

---

**Bearer token authentication untuk confusion matrix dan model metrics telah berhasil diimplementasi!** 🔐✅ 