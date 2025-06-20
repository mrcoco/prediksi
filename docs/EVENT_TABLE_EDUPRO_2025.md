# 📊 EVENT TABLE SISTEM EDUPRO - DOKUMENTASI LENGKAP

**Tanggal**: 19 Juni 2025  
**Versi**: 2.0.0  
**Sistem**: EduPro - Sistem Prediksi Prestasi Akademik Siswa  
**Event Tracking**: Comprehensive System Activity Monitoring

---

## 📋 **OVERVIEW EVENT SYSTEM**

Event Table dalam sistem EduPro dirancang untuk melacak semua aktivitas pengguna dan sistem secara real-time. Sistem ini mendukung audit trail, monitoring, analytics, dan troubleshooting dengan comprehensive event logging.

### **🎯 Tujuan Event System**
- **Audit Trail** - Pelacakan semua aktivitas pengguna
- **Security Monitoring** - Deteksi aktivitas mencurigakan
- **Performance Analytics** - Analisis penggunaan sistem
- **Error Tracking** - Monitoring dan debugging
- **Business Intelligence** - Insight untuk decision making

---

## 🗂️ **STRUKTUR EVENT TABLE**

### **📚 Event (Main Event Entity)**
```sql
CREATE TABLE events (
    -- Primary Key
    id BIGSERIAL PRIMARY KEY,
    
    -- Event Identification
    event_type VARCHAR(100) NOT NULL,           -- Jenis event (USER_LOGIN, DATA_CREATE, etc.)
    event_category VARCHAR(50) NOT NULL,        -- Kategori (AUTH, CRUD, ML, SYSTEM)
    event_name VARCHAR(200) NOT NULL,           -- Nama event yang readable
    
    -- User & Session Information
    user_id INTEGER REFERENCES users(id),       -- FK ke user table
    username VARCHAR(100),                      -- Username untuk quick access
    user_role VARCHAR(50),                      -- Role saat event terjadi
    session_id VARCHAR(255),                    -- Session identifier
    
    -- Request Information
    ip_address INET,                            -- IP address pengguna
    user_agent TEXT,                            -- Browser/client information
    request_method VARCHAR(10),                 -- HTTP method (GET, POST, etc.)
    request_url TEXT,                           -- URL endpoint yang diakses
    request_headers JSONB,                      -- HTTP headers
    request_body JSONB,                         -- Request payload (filtered)
    
    -- Response Information
    response_status INTEGER,                    -- HTTP status code
    response_time_ms INTEGER,                   -- Response time dalam milliseconds
    response_size_bytes INTEGER,                -- Response size
    
    -- Event Details
    entity_type VARCHAR(100),                   -- Tipe entity (siswa, nilai, etc.)
    entity_id INTEGER,                          -- ID entity yang terkait
    entity_name VARCHAR(200),                   -- Nama entity untuk reference
    
    -- Event Data
    event_data JSONB,                           -- Data detail event
    previous_values JSONB,                      -- Nilai sebelum perubahan (untuk UPDATE)
    new_values JSONB,                           -- Nilai setelah perubahan
    
    -- System Information
    server_name VARCHAR(100),                   -- Server yang memproses
    application_version VARCHAR(50),            -- Versi aplikasi
    
    -- Status & Results
    event_status VARCHAR(50) DEFAULT 'SUCCESS', -- SUCCESS, FAILED, ERROR
    error_message TEXT,                         -- Pesan error jika ada
    error_code VARCHAR(50),                     -- Kode error
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    
    -- Indexing & Search
    tags VARCHAR(500)[],                        -- Tags untuk kategorisasi
    search_text TEXT,                           -- Text untuk full-text search
    
    -- Audit & Compliance
    retention_period INTEGER DEFAULT 365,       -- Periode retensi (hari)
    is_sensitive BOOLEAN DEFAULT FALSE,         -- Apakah data sensitif
    
    -- Performance
    cpu_usage_percent DECIMAL(5,2),            -- CPU usage saat event
    memory_usage_mb INTEGER,                    -- Memory usage
    
    CONSTRAINT valid_event_status CHECK (event_status IN ('SUCCESS', 'FAILED', 'ERROR', 'PENDING'))
);
```

---

## 🎯 **EVENT CATEGORIES & TYPES**

### **1. AUTHENTICATION EVENTS (AUTH)**

#### **Login Events**
| Event Type | Event Name | Description |
|------------|------------|-------------|
| `USER_LOGIN_ATTEMPT` | User Login Attempt | Percobaan login pengguna |
| `USER_LOGIN_SUCCESS` | User Login Success | Login berhasil |
| `USER_LOGIN_FAILED` | User Login Failed | Login gagal |
| `USER_LOGOUT` | User Logout | Pengguna logout |
| `TOKEN_REFRESH` | Token Refresh | Refresh JWT token |
| `TOKEN_EXPIRED` | Token Expired | Token kadaluarsa |

#### **Account Management**
| Event Type | Event Name | Description |
|------------|------------|-------------|
| `USER_REGISTER` | User Registration | Registrasi pengguna baru |
| `USER_PROFILE_UPDATE` | Profile Update | Update profil pengguna |
| `PASSWORD_CHANGE` | Password Change | Perubahan password |
| `ACCOUNT_LOCK` | Account Locked | Akun dikunci |
| `ACCOUNT_UNLOCK` | Account Unlocked | Akun dibuka kembali |

### **2. CRUD OPERATIONS (CRUD)**

#### **Siswa Management**
| Event Type | Event Name | Description |
|------------|------------|-------------|
| `SISWA_CREATE` | Student Created | Penambahan data siswa baru |
| `SISWA_READ` | Student Viewed | Melihat data siswa |
| `SISWA_UPDATE` | Student Updated | Update data siswa |
| `SISWA_DELETE` | Student Deleted | Penghapusan data siswa |
| `SISWA_BULK_IMPORT` | Students Bulk Import | Import massal data siswa |
| `SISWA_EXPORT` | Students Export | Export data siswa |

#### **Nilai Raport Management**
| Event Type | Event Name | Description |
|------------|------------|-------------|
| `NILAI_CREATE` | Grade Created | Penambahan nilai raport |
| `NILAI_READ` | Grade Viewed | Melihat nilai raport |
| `NILAI_UPDATE` | Grade Updated | Update nilai raport |
| `NILAI_DELETE` | Grade Deleted | Penghapusan nilai raport |
| `NILAI_BULK_IMPORT` | Grades Bulk Import | Import massal nilai |
| `NILAI_EXPORT` | Grades Export | Export data nilai |

#### **Presensi Management**
| Event Type | Event Name | Description |
|------------|------------|-------------|
| `PRESENSI_CREATE` | Attendance Created | Penambahan data presensi |
| `PRESENSI_READ` | Attendance Viewed | Melihat data presensi |
| `PRESENSI_UPDATE` | Attendance Updated | Update data presensi |
| `PRESENSI_DELETE` | Attendance Deleted | Penghapusan data presensi |
| `PRESENSI_BULK_IMPORT` | Attendance Bulk Import | Import massal presensi |
| `PRESENSI_EXPORT` | Attendance Export | Export data presensi |

#### **Penghasilan Management**
| Event Type | Event Name | Description |
|------------|------------|-------------|
| `PENGHASILAN_CREATE` | Income Created | Penambahan data penghasilan |
| `PENGHASILAN_READ` | Income Viewed | Melihat data penghasilan |
| `PENGHASILAN_UPDATE` | Income Updated | Update data penghasilan |
| `PENGHASILAN_DELETE` | Income Deleted | Penghapusan data penghasilan |
| `PENGHASILAN_BULK_IMPORT` | Income Bulk Import | Import massal penghasilan |
| `PENGHASILAN_EXPORT` | Income Export | Export data penghasilan |

### **3. MACHINE LEARNING EVENTS (ML)**

#### **Model Operations**
| Event Type | Event Name | Description |
|------------|------------|-------------|
| `ML_MODEL_TRAIN_START` | Model Training Started | Mulai training model |
| `ML_MODEL_TRAIN_SUCCESS` | Model Training Success | Training berhasil |
| `ML_MODEL_TRAIN_FAILED` | Model Training Failed | Training gagal |
| `ML_MODEL_EVALUATE` | Model Evaluation | Evaluasi performa model |
| `ML_MODEL_SAVE` | Model Saved | Menyimpan model |
| `ML_MODEL_LOAD` | Model Loaded | Memuat model |

#### **Prediction Operations**
| Event Type | Event Name | Description |
|------------|------------|-------------|
| `PREDICTION_SINGLE` | Single Prediction | Prediksi individual |
| `PREDICTION_BATCH` | Batch Prediction | Prediksi massal |
| `PREDICTION_HISTORY_VIEW` | Prediction History Viewed | Melihat riwayat prediksi |
| `PREDICTION_EXPORT` | Prediction Export | Export hasil prediksi |

#### **Analytics & Visualization**
| Event Type | Event Name | Description |
|------------|------------|-------------|
| `ANALYTICS_FEATURE_STATS` | Feature Statistics Viewed | Melihat statistik fitur |
| `ANALYTICS_CORRELATION` | Correlation Analysis | Analisis korelasi |
| `ANALYTICS_CONFUSION_MATRIX` | Confusion Matrix Viewed | Melihat confusion matrix |
| `ANALYTICS_DECISION_TREE` | Decision Tree Viewed | Melihat pohon keputusan |
| `ANALYTICS_BAR_CHART` | Bar Chart Generated | Generate bar chart |

### **4. SYSTEM EVENTS (SYSTEM)**

#### **Application Events**
| Event Type | Event Name | Description |
|------------|------------|-------------|
| `APP_START` | Application Started | Aplikasi dimulai |
| `APP_SHUTDOWN` | Application Shutdown | Aplikasi dimatikan |
| `HEALTH_CHECK` | Health Check | Pemeriksaan kesehatan sistem |
| `DATABASE_CONNECTION` | Database Connected | Koneksi ke database |
| `DATABASE_DISCONNECTION` | Database Disconnected | Terputus dari database |

#### **Error Events**
| Event Type | Event Name | Description |
|------------|------------|-------------|
| `ERROR_500` | Internal Server Error | Error server internal |
| `ERROR_404` | Not Found | Resource tidak ditemukan |
| `ERROR_403` | Forbidden Access | Akses ditolak |
| `ERROR_401` | Unauthorized Access | Akses tidak terotorisasi |
| `ERROR_VALIDATION` | Validation Error | Error validasi data |
| `ERROR_DATABASE` | Database Error | Error database |

#### **Performance Events**
| Event Type | Event Name | Description |
|------------|------------|-------------|
| `PERFORMANCE_SLOW_QUERY` | Slow Query Detected | Query lambat terdeteksi |
| `PERFORMANCE_HIGH_CPU` | High CPU Usage | Penggunaan CPU tinggi |
| `PERFORMANCE_HIGH_MEMORY` | High Memory Usage | Penggunaan memory tinggi |
| `PERFORMANCE_RESPONSE_TIME` | Response Time Metric | Metrik waktu respons |

### **5. FILE OPERATIONS (FILE)**

#### **Upload/Download Events**
| Event Type | Event Name | Description |
|------------|------------|-------------|
| `FILE_UPLOAD_START` | File Upload Started | Mulai upload file |
| `FILE_UPLOAD_SUCCESS` | File Upload Success | Upload berhasil |
| `FILE_UPLOAD_FAILED` | File Upload Failed | Upload gagal |
| `FILE_DOWNLOAD` | File Downloaded | Download file |
| `FILE_DELETE` | File Deleted | Penghapusan file |

#### **Excel Operations**
| Event Type | Event Name | Description |
|------------|------------|-------------|
| `EXCEL_IMPORT_START` | Excel Import Started | Mulai import Excel |
| `EXCEL_IMPORT_SUCCESS` | Excel Import Success | Import berhasil |
| `EXCEL_IMPORT_FAILED` | Excel Import Failed | Import gagal |
| `EXCEL_EXPORT_START` | Excel Export Started | Mulai export Excel |
| `EXCEL_EXPORT_SUCCESS` | Excel Export Success | Export berhasil |
| `EXCEL_EXPORT_FAILED` | Excel Export Failed | Export gagal |

### **6. SECURITY EVENTS (SECURITY)**

#### **Security Monitoring**
| Event Type | Event Name | Description |
|------------|------------|-------------|
| `SECURITY_SUSPICIOUS_LOGIN` | Suspicious Login | Login mencurigakan |
| `SECURITY_BRUTE_FORCE` | Brute Force Attack | Serangan brute force |
| `SECURITY_SQL_INJECTION` | SQL Injection Attempt | Percobaan SQL injection |
| `SECURITY_XSS_ATTEMPT` | XSS Attack Attempt | Percobaan serangan XSS |
| `SECURITY_UNAUTHORIZED_ACCESS` | Unauthorized Access | Akses tidak sah |
| `SECURITY_DATA_BREACH` | Data Breach Detected | Pelanggaran data terdeteksi |

---

## 📊 **EVENT DATA EXAMPLES**

### **Example 1: User Login Success**
```json
{
    "event_type": "USER_LOGIN_SUCCESS",
    "event_category": "AUTH",
    "event_name": "User Login Success",
    "user_id": 123,
    "username": "guru001",
    "user_role": "guru",
    "session_id": "sess_abc123",
    "ip_address": "192.168.1.100",
    "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "request_method": "POST",
    "request_url": "/api/auth/login",
    "response_status": 200,
    "response_time_ms": 150,
    "event_data": {
        "login_method": "username_password",
        "remember_me": false,
        "device_type": "desktop"
    },
    "event_status": "SUCCESS",
    "tags": ["authentication", "login", "success"],
    "search_text": "guru001 login success desktop"
}
```

### **Example 2: Student Data Creation**
```json
{
    "event_type": "SISWA_CREATE",
    "event_category": "CRUD",
    "event_name": "Student Created",
    "user_id": 123,
    "username": "admin001",
    "user_role": "admin",
    "entity_type": "siswa",
    "entity_id": 456,
    "entity_name": "Ahmad Fauzi",
    "request_method": "POST",
    "request_url": "/api/siswa",
    "response_status": 201,
    "response_time_ms": 89,
    "new_values": {
        "nama": "Ahmad Fauzi",
        "nis": "12345678",
        "kelas": "XII IPA 1",
        "jenis_kelamin": "L"
    },
    "event_data": {
        "validation_passed": true,
        "auto_generated_fields": ["id", "created_at"]
    },
    "event_status": "SUCCESS",
    "tags": ["student", "create", "crud"],
    "search_text": "Ahmad Fauzi student created XII IPA 1"
}
```

---

## 📝 **CONCLUSION**

Event Table sistem EduPro menyediakan **comprehensive event tracking** dengan:

✅ **Complete Coverage** - Semua aktivitas sistem tercatat  
✅ **Security Monitoring** - Deteksi aktivitas mencurigakan  
✅ **Performance Analytics** - Monitoring performa real-time  
✅ **Audit Trail** - Pelacakan lengkap untuk compliance  
✅ **Business Intelligence** - Insight untuk decision making  
✅ **Scalable Design** - Optimized untuk high-volume events  
✅ **Privacy Compliant** - GDPR-ready dengan data anonymization  

Sistem ini siap untuk **production deployment** dengan monitoring dan analytics capabilities yang comprehensive untuk sistem EduPro.

---

**© 2025 EduPro Development Team**  
**Event Table Documentation v2.0.0**
