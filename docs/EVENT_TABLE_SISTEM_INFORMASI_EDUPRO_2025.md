# Event Table Sistem Informasi EduPro 2025

## Executive Summary

Dokumen ini menyajikan **Event Table** yang komprehensif untuk sistem informasi EduPro. Event Table ini berfungsi sebagai **central logging system** untuk mendokumentasikan semua peristiwa penting yang terjadi dalam sistem, mulai dari aktivitas user hingga operasi machine learning.

## Tujuan Event Table

1. **Audit Trail** - Melacak semua aktivitas dalam sistem
2. **Security Monitoring** - Mendeteksi aktivitas mencurigakan
3. **Performance Analysis** - Menganalisis performa sistem
4. **Compliance** - Memenuhi requirement audit dan regulasi
5. **Troubleshooting** - Membantu diagnosis masalah sistem
6. **Business Intelligence** - Menganalisis pola penggunaan sistem

## Event Categories

### 1. Authentication Events (AUTH)
### 2. Data Management Events (DATA)
### 3. Prediction Events (PRED)
### 4. Model Management Events (MODEL)
### 5. System Events (SYSTEM)
### 6. Security Events (SECURITY)
### 7. Analytics Events (ANALYTICS)
### 8. Administration Events (ADMIN)

---

## Event Table Schema

```sql
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    event_id VARCHAR(50) UNIQUE NOT NULL,
    event_category VARCHAR(20) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    event_name VARCHAR(100) NOT NULL,
    event_description TEXT,
    user_id INTEGER,
    username VARCHAR(50),
    user_role VARCHAR(20),
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(100),
    resource_type VARCHAR(50),
    resource_id VARCHAR(50),
    resource_name VARCHAR(200),
    action VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    http_method VARCHAR(10),
    endpoint VARCHAR(200),
    request_data JSONB,
    response_data JSONB,
    error_message TEXT,
    error_code VARCHAR(20),
    processing_time_ms INTEGER,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB,
    tags TEXT[],
    severity VARCHAR(20) DEFAULT 'INFO',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_events_category ON events(event_category);
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_timestamp ON events(timestamp);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_severity ON events(severity);
```

---

## 1. AUTHENTICATION EVENTS (AUTH)

| Event ID | Event Name | Description | Severity | Typical Data |
|----------|------------|-------------|----------|--------------|
| AUTH-001 | User Login Success | User berhasil login ke sistem | INFO | username, ip_address, session_id |
| AUTH-002 | User Login Failed | Gagal login karena kredensial salah | WARNING | username, ip_address, error_reason |
| AUTH-003 | User Logout | User melakukan logout dari sistem | INFO | username, session_duration |
| AUTH-004 | Password Changed | User mengubah password | INFO | username, ip_address |
| AUTH-005 | Account Locked | Akun dikunci karena terlalu banyak percobaan login | CRITICAL | username, ip_address, attempt_count |
| AUTH-006 | Token Generated | JWT token baru dibuat | DEBUG | username, token_expiry |
| AUTH-007 | Token Expired | JWT token sudah expired | WARNING | username, token_age |
| AUTH-008 | Token Refreshed | JWT token di-refresh | INFO | username, old_expiry, new_expiry |
| AUTH-009 | Unauthorized Access | Akses ditolak karena tidak ada permission | WARNING | username, resource, action |
| AUTH-010 | Session Timeout | Session user timeout | INFO | username, session_duration |

### Sample Event - User Login Success
```json
{
  "event_id": "AUTH-001-20250619-143052-001",
  "event_category": "AUTH",
  "event_type": "USER_LOGIN",
  "event_name": "User Login Success",
  "event_description": "User guru01 berhasil login ke sistem EduPro",
  "user_id": 15,
  "username": "guru01",
  "user_role": "GURU",
  "ip_address": "192.168.1.100",
  "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  "session_id": "sess_abc123def456",
  "action": "LOGIN",
  "status": "SUCCESS",
  "http_method": "POST",
  "endpoint": "/api/auth/login",
  "processing_time_ms": 245,
  "severity": "INFO",
  "metadata": {
    "login_method": "password",
    "browser": "Chrome 91.0",
    "device_type": "desktop"
  },
  "tags": ["authentication", "login", "success"]
}
```


---

## 2. DATA MANAGEMENT EVENTS (DATA)

| Event ID | Event Name | Description | Severity | Typical Data |
|----------|------------|-------------|----------|--------------|
| DATA-001 | Student Created | Data siswa baru ditambahkan | INFO | student_id, student_name, creator |
| DATA-002 | Student Updated | Data siswa diperbarui | INFO | student_id, changed_fields, updater |
| DATA-003 | Student Deleted | Data siswa dihapus | WARNING | student_id, student_name, deleter |
| DATA-004 | Academic Score Added | Nilai akademik siswa ditambahkan | INFO | student_id, subject, score, semester |
| DATA-005 | Academic Score Updated | Nilai akademik siswa diperbarui | INFO | student_id, old_score, new_score |
| DATA-006 | Attendance Record Created | Data kehadiran siswa ditambahkan | INFO | student_id, attendance_data, period |
| DATA-007 | Attendance Updated | Data kehadiran siswa diperbarui | INFO | student_id, old_data, new_data |
| DATA-008 | Parent Income Added | Data penghasilan orang tua ditambahkan | INFO | student_id, income_data, category |
| DATA-009 | Parent Income Updated | Data penghasilan orang tua diperbarui | INFO | student_id, old_income, new_income |
| DATA-010 | Data Validation Failed | Validasi data gagal | ERROR | resource_type, validation_errors |
| DATA-011 | Bulk Data Import | Import data dalam jumlah besar | INFO | record_count, import_type, status |
| DATA-012 | Data Export | Export data ke file | INFO | export_type, record_count, format |

### Sample Event - Student Created
```json
{
  "event_id": "DATA-001-20250619-143052-002",
  "event_category": "DATA",
  "event_type": "STUDENT_MANAGEMENT",
  "event_name": "Student Created",
  "event_description": "Data siswa baru 'Ahmad Rizki' berhasil ditambahkan",
  "user_id": 12,
  "username": "admin01",
  "user_role": "ADMIN",
  "resource_type": "STUDENT",
  "resource_id": "STD-2025-001",
  "resource_name": "Ahmad Rizki",
  "action": "CREATE",
  "status": "SUCCESS",
  "http_method": "POST",
  "endpoint": "/api/siswa",
  "request_data": {
    "nama_lengkap": "Ahmad Rizki",
    "nis": "12345678",
    "jenis_kelamin": "L",
    "agama": "Islam"
  },
  "processing_time_ms": 156,
  "severity": "INFO",
  "metadata": {
    "grade": "10",
    "class": "A",
    "academic_year": "2024/2025"
  },
  "tags": ["data_management", "student", "create"]
}
```

---

## 3. PREDICTION EVENTS (PRED)

| Event ID | Event Name | Description | Severity | Typical Data |
|----------|------------|-------------|----------|--------------|
| PRED-001 | Individual Prediction Started | Prediksi individual dimulai | INFO | student_id, model_version |
| PRED-002 | Individual Prediction Completed | Prediksi individual selesai | INFO | student_id, prediction_result, confidence |
| PRED-003 | Individual Prediction Failed | Prediksi individual gagal | ERROR | student_id, error_reason |
| PRED-004 | Batch Prediction Started | Prediksi batch dimulai | INFO | batch_size, semester, tahun_ajaran |
| PRED-005 | Batch Prediction Completed | Prediksi batch selesai | INFO | total_processed, success_count, failed_count |
| PRED-006 | Batch Prediction Failed | Prediksi batch gagal | ERROR | batch_id, error_reason |
| PRED-007 | Prediction History Viewed | Riwayat prediksi dilihat | DEBUG | user_id, filter_criteria |
| PRED-008 | Prediction Exported | Hasil prediksi di-export | INFO | export_format, record_count |
| PRED-009 | Low Confidence Warning | Prediksi dengan confidence rendah | WARNING | student_id, confidence_score |
| PRED-010 | Data Completeness Check | Pengecekan kelengkapan data untuk prediksi | DEBUG | student_id, completeness_score |

### Sample Event - Individual Prediction Completed
```json
{
  "event_id": "PRED-002-20250619-143052-003",
  "event_category": "PRED",
  "event_type": "INDIVIDUAL_PREDICTION",
  "event_name": "Individual Prediction Completed",
  "event_description": "Prediksi prestasi siswa Ahmad Rizki berhasil diselesaikan",
  "user_id": 15,
  "username": "guru01",
  "user_role": "GURU",
  "resource_type": "STUDENT",
  "resource_id": "STD-2025-001",
  "resource_name": "Ahmad Rizki",
  "action": "PREDICT",
  "status": "SUCCESS",
  "http_method": "POST",
  "endpoint": "/api/prediksi/individual",
  "response_data": {
    "prediction": "TINGGI",
    "confidence": 87.5,
    "features": {
      "academic_average": 85.2,
      "attendance_rate": 92.0,
      "income_category": "SEDANG"
    }
  },
  "processing_time_ms": 1245,
  "severity": "INFO",
  "metadata": {
    "model_version": "v2025.06.15.001",
    "algorithm": "C4.5",
    "feature_count": 8
  },
  "tags": ["prediction", "individual", "success"]
}
```


---

## 4. MODEL MANAGEMENT EVENTS (MODEL)

| Event ID | Event Name | Description | Severity | Typical Data |
|----------|------------|-------------|----------|--------------|
| MODEL-001 | Model Training Started | Training model ML dimulai | INFO | training_data_size, parameters |
| MODEL-002 | Model Training Completed | Training model ML selesai | INFO | accuracy, training_time, model_version |
| MODEL-003 | Model Training Failed | Training model ML gagal | ERROR | error_reason, training_duration |
| MODEL-004 | Model Evaluation Started | Evaluasi model dimulai | INFO | model_version, test_data_size |
| MODEL-005 | Model Evaluation Completed | Evaluasi model selesai | INFO | accuracy, precision, recall, f1_score |
| MODEL-006 | Model Deployed | Model baru di-deploy ke production | CRITICAL | model_version, previous_version |
| MODEL-007 | Model Rollback | Model di-rollback ke versi sebelumnya | CRITICAL | current_version, rollback_version, reason |
| MODEL-008 | Model Performance Alert | Alert performa model menurun | WARNING | current_accuracy, threshold, degradation |
| MODEL-009 | Model Backup Created | Backup model dibuat | INFO | model_version, backup_location |
| MODEL-010 | Feature Importance Updated | Feature importance model diperbarui | DEBUG | top_features, importance_scores |

### Sample Event - Model Training Completed
```json
{
  "event_id": "MODEL-002-20250619-143052-004",
  "event_category": "MODEL",
  "event_type": "MODEL_TRAINING",
  "event_name": "Model Training Completed",
  "event_description": "Training model C4.5 berhasil diselesaikan dengan akurasi 87.3%",
  "user_id": 1,
  "username": "admin",
  "user_role": "ADMIN",
  "resource_type": "ML_MODEL",
  "resource_id": "v2025.06.19.001",
  "resource_name": "C4.5 Decision Tree Model",
  "action": "TRAIN",
  "status": "SUCCESS",
  "http_method": "POST",
  "endpoint": "/api/prediksi/train",
  "response_data": {
    "accuracy": 87.3,
    "precision": 85.6,
    "recall": 88.1,
    "f1_score": 86.8,
    "training_samples": 245,
    "test_samples": 61
  },
  "processing_time_ms": 187456,
  "severity": "INFO",
  "metadata": {
    "algorithm": "C4.5",
    "max_depth": 10,
    "min_samples_leaf": 5,
    "cross_validation_folds": 5
  },
  "tags": ["model", "training", "c45", "success"]
}
```

---

## 5. SYSTEM EVENTS (SYSTEM)

| Event ID | Event Name | Description | Severity | Typical Data |
|----------|------------|-------------|----------|--------------|
| SYS-001 | Application Started | Aplikasi EduPro dimulai | INFO | version, startup_time |
| SYS-002 | Application Stopped | Aplikasi EduPro dihentikan | INFO | uptime, shutdown_reason |
| SYS-003 | Database Connected | Koneksi database berhasil | INFO | database_name, connection_pool |
| SYS-004 | Database Disconnected | Koneksi database terputus | WARNING | database_name, disconnect_reason |
| SYS-005 | High Memory Usage | Penggunaan memory tinggi | WARNING | memory_usage_percent, threshold |
| SYS-006 | High CPU Usage | Penggunaan CPU tinggi | WARNING | cpu_usage_percent, threshold |
| SYS-007 | Slow Response Time | Response time lambat | WARNING | endpoint, response_time, threshold |
| SYS-008 | Error Rate High | Error rate tinggi | CRITICAL | error_rate_percent, time_window |
| SYS-009 | Backup Completed | Backup sistem selesai | INFO | backup_type, backup_size, duration |
| SYS-010 | Backup Failed | Backup sistem gagal | ERROR | backup_type, error_reason |
| SYS-011 | Configuration Changed | Konfigurasi sistem diubah | WARNING | config_key, old_value, new_value |
| SYS-012 | Health Check Failed | Health check sistem gagal | CRITICAL | component, check_type, error |

### Sample Event - High Memory Usage
```json
{
  "event_id": "SYS-005-20250619-143052-005",
  "event_category": "SYSTEM",
  "event_type": "PERFORMANCE_ALERT",
  "event_name": "High Memory Usage",
  "event_description": "Penggunaan memory mencapai 85% dari kapasitas maksimum",
  "action": "MONITOR",
  "status": "ALERT",
  "processing_time_ms": 0,
  "severity": "WARNING",
  "metadata": {
    "memory_usage_mb": 3400,
    "memory_total_mb": 4000,
    "memory_usage_percent": 85.0,
    "threshold_percent": 80.0,
    "top_processes": [
      {"name": "python", "memory_mb": 1200},
      {"name": "postgres", "memory_mb": 800}
    ]
  },
  "tags": ["system", "performance", "memory", "alert"]
}
```


---

## 6. SECURITY EVENTS (SECURITY)

| Event ID | Event Name | Description | Severity | Typical Data |
|----------|------------|-------------|----------|--------------|
| SEC-001 | Suspicious Login Activity | Aktivitas login mencurigakan | CRITICAL | ip_address, login_attempts, pattern |
| SEC-002 | Brute Force Attack | Serangan brute force terdeteksi | CRITICAL | ip_address, attempt_count, timeframe |
| SEC-003 | SQL Injection Attempt | Percobaan SQL injection | CRITICAL | ip_address, payload, endpoint |
| SEC-004 | XSS Attempt | Percobaan Cross-Site Scripting | WARNING | ip_address, payload, endpoint |
| SEC-005 | Unauthorized API Access | Akses API tanpa otorisasi | WARNING | ip_address, endpoint, user_agent |
| SEC-006 | Data Breach Attempt | Percobaan pelanggaran data | CRITICAL | resource_type, access_pattern |
| SEC-007 | Privilege Escalation | Percobaan eskalasi privilege | CRITICAL | user_id, attempted_action |
| SEC-008 | Malicious File Upload | Upload file berbahaya | WARNING | filename, file_type, user_id |
| SEC-009 | Anomalous User Behavior | Perilaku user yang tidak normal | WARNING | user_id, behavior_pattern |
| SEC-010 | Security Policy Violation | Pelanggaran kebijakan keamanan | WARNING | policy_name, violation_type |

### Sample Event - Brute Force Attack
```json
{
  "event_id": "SEC-002-20250619-143052-006",
  "event_category": "SECURITY",
  "event_type": "ATTACK_DETECTION",
  "event_name": "Brute Force Attack",
  "event_description": "Serangan brute force terdeteksi dari IP 192.168.1.999",
  "ip_address": "192.168.1.999",
  "user_agent": "curl/7.68.0",
  "action": "BLOCK",
  "status": "BLOCKED",
  "http_method": "POST",
  "endpoint": "/api/auth/login",
  "processing_time_ms": 0,
  "severity": "CRITICAL",
  "metadata": {
    "attempt_count": 25,
    "timeframe_minutes": 5,
    "targeted_usernames": ["admin", "root", "administrator"],
    "attack_pattern": "sequential_dictionary",
    "blocked_duration_minutes": 60
  },
  "tags": ["security", "attack", "brute_force", "blocked"]
}
```

---

## 7. ANALYTICS EVENTS (ANALYTICS)

| Event ID | Event Name | Description | Severity | Typical Data |
|----------|------------|-------------|----------|--------------|
| ANLY-001 | Dashboard Accessed | Dashboard analytics diakses | DEBUG | user_id, dashboard_type |
| ANLY-002 | Report Generated | Report analytics dibuat | INFO | report_type, parameters, record_count |
| ANLY-003 | Chart Rendered | Chart/grafik di-render | DEBUG | chart_type, data_points |
| ANLY-004 | Data Aggregation | Agregasi data untuk analytics | DEBUG | aggregation_type, record_count |
| ANLY-005 | Export Analytics | Export data analytics | INFO | export_format, data_range |
| ANLY-006 | Filter Applied | Filter diterapkan pada analytics | DEBUG | filter_criteria, result_count |
| ANLY-007 | Drill Down Analysis | Analisis drill-down dilakukan | INFO | source_metric, target_detail |
| ANLY-008 | Trend Analysis | Analisis trend dilakukan | INFO | time_period, trend_direction |
| ANLY-009 | Correlation Analysis | Analisis korelasi dilakukan | INFO | variables, correlation_coefficient |
| ANLY-010 | Performance Metrics | Metrics performa sistem | DEBUG | metric_type, value, benchmark |

---

## 8. ADMINISTRATION EVENTS (ADMIN)

| Event ID | Event Name | Description | Severity | Typical Data |
|----------|------------|-------------|----------|--------------|
| ADMIN-001 | User Account Created | Akun user baru dibuat | INFO | new_user_id, role, creator |
| ADMIN-002 | User Account Modified | Akun user dimodifikasi | INFO | user_id, changed_fields, modifier |
| ADMIN-003 | User Account Deleted | Akun user dihapus | WARNING | user_id, username, deleter |
| ADMIN-004 | Role Permission Changed | Permission role diubah | WARNING | role, old_permissions, new_permissions |
| ADMIN-005 | System Configuration Updated | Konfigurasi sistem diperbarui | WARNING | config_section, changes |
| ADMIN-006 | Database Maintenance | Maintenance database dilakukan | INFO | maintenance_type, duration |
| ADMIN-007 | Log Cleanup | Pembersihan log sistem | INFO | log_type, deleted_count, retention_days |
| ADMIN-008 | Security Audit | Audit keamanan dilakukan | INFO | audit_scope, findings_count |
| ADMIN-009 | System Upgrade | Upgrade sistem dilakukan | CRITICAL | old_version, new_version |
| ADMIN-010 | Emergency Shutdown | Shutdown darurat sistem | CRITICAL | shutdown_reason, initiated_by |

---

## Event Severity Levels

| Severity | Description | Response Required | Retention |
|----------|-------------|-------------------|-----------|
| **DEBUG** | Informasi detail untuk debugging | None | 7 days |
| **INFO** | Informasi normal operasi sistem | None | 30 days |
| **WARNING** | Kondisi yang perlu perhatian | Monitor | 90 days |
| **ERROR** | Error yang perlu ditangani | Investigate | 180 days |
| **CRITICAL** | Kondisi kritis yang butuh tindakan segera | Immediate Action | 1 year |

## Event Retention Policy

```sql
-- Automated cleanup policy
DELETE FROM events 
WHERE severity = 'DEBUG' AND timestamp < NOW() - INTERVAL '7 days';

DELETE FROM events 
WHERE severity = 'INFO' AND timestamp < NOW() - INTERVAL '30 days';

DELETE FROM events 
WHERE severity = 'WARNING' AND timestamp < NOW() - INTERVAL '90 days';

DELETE FROM events 
WHERE severity = 'ERROR' AND timestamp < NOW() - INTERVAL '180 days';

DELETE FROM events 
WHERE severity = 'CRITICAL' AND timestamp < NOW() - INTERVAL '1 year';
```


## Monitoring Queries

### 1. Recent Critical Events
```sql
SELECT event_name, event_description, username, timestamp
FROM events 
WHERE severity = 'CRITICAL' 
  AND timestamp >= NOW() - INTERVAL '24 hours'
ORDER BY timestamp DESC;
```

### 2. User Activity Summary
```sql
SELECT username, COUNT(*) as event_count, 
       MAX(timestamp) as last_activity
FROM events 
WHERE timestamp >= NOW() - INTERVAL '24 hours'
GROUP BY username
ORDER BY event_count DESC;
```

### 3. Error Rate by Endpoint
```sql
SELECT endpoint, 
       COUNT(*) as total_requests,
       SUM(CASE WHEN status = 'ERROR' THEN 1 ELSE 0 END) as error_count,
       ROUND(SUM(CASE WHEN status = 'ERROR' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as error_rate
FROM events 
WHERE endpoint IS NOT NULL 
  AND timestamp >= NOW() - INTERVAL '1 hour'
GROUP BY endpoint
HAVING COUNT(*) > 10
ORDER BY error_rate DESC;
```

### 4. Security Events Dashboard
```sql
SELECT event_type, COUNT(*) as count, MAX(timestamp) as latest
FROM events 
WHERE event_category = 'SECURITY' 
  AND timestamp >= NOW() - INTERVAL '24 hours'
GROUP BY event_type
ORDER BY count DESC;
```

### 5. Model Performance Tracking
```sql
SELECT 
    DATE_TRUNC('hour', timestamp) as hour,
    AVG(CAST(response_data->>'confidence' as FLOAT)) as avg_confidence,
    COUNT(*) as prediction_count
FROM events 
WHERE event_category = 'PRED' 
  AND event_type = 'INDIVIDUAL_PREDICTION'
  AND status = 'SUCCESS'
  AND timestamp >= NOW() - INTERVAL '24 hours'
GROUP BY hour
ORDER BY hour DESC;
```

### 6. System Performance Metrics
```sql
SELECT 
    event_name,
    AVG(processing_time_ms) as avg_response_time,
    MAX(processing_time_ms) as max_response_time,
    COUNT(*) as request_count
FROM events 
WHERE processing_time_ms IS NOT NULL
  AND timestamp >= NOW() - INTERVAL '1 hour'
GROUP BY event_name
ORDER BY avg_response_time DESC;
```

## Integration Points

### 1. Application Logging (Python)
```python
import logging
from datetime import datetime
import json
import uuid

class EduProEventLogger:
    def __init__(self, db_connection):
        self.db = db_connection
    
    def log_event(self, event_data):
        event_data['timestamp'] = datetime.now()
        event_data['event_id'] = self.generate_event_id(event_data)
        
        # Insert to database
        query = """
            INSERT INTO events (
                event_id, event_category, event_type, event_name, 
                event_description, user_id, username, user_role,
                ip_address, user_agent, session_id, resource_type,
                resource_id, resource_name, action, status,
                http_method, endpoint, request_data, response_data,
                error_message, error_code, processing_time_ms,
                timestamp, metadata, tags, severity
            ) VALUES (
                %(event_id)s, %(event_category)s, %(event_type)s, %(event_name)s,
                %(event_description)s, %(user_id)s, %(username)s, %(user_role)s,
                %(ip_address)s, %(user_agent)s, %(session_id)s, %(resource_type)s,
                %(resource_id)s, %(resource_name)s, %(action)s, %(status)s,
                %(http_method)s, %(endpoint)s, %(request_data)s, %(response_data)s,
                %(error_message)s, %(error_code)s, %(processing_time_ms)s,
                %(timestamp)s, %(metadata)s, %(tags)s, %(severity)s
            )
        """
        
        self.db.execute(query, event_data)
    
    def generate_event_id(self, event_data):
        timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        sequence = str(uuid.uuid4())[:8]
        category = event_data.get('event_category', 'UNK')
        return f"{category}-{timestamp}-{sequence}"

# Usage example
logger = EduProEventLogger(db_connection)

# Log authentication event
logger.log_event({
    'event_category': 'AUTH',
    'event_type': 'USER_LOGIN',
    'event_name': 'User Login Success',
    'event_description': f'User {username} berhasil login',
    'user_id': user_id,
    'username': username,
    'user_role': user_role,
    'ip_address': request.remote_addr,
    'action': 'LOGIN',
    'status': 'SUCCESS',
    'severity': 'INFO',
    'metadata': {'login_method': 'password'},
    'tags': ['authentication', 'login', 'success']
})
```

### 2. Frontend Integration (JavaScript)
```javascript
class EventLogger {
    static async logUserAction(action, resource, details = {}) {
        const eventData = {
            event_category: 'DATA',
            event_type: 'USER_ACTION',
            event_name: `${action} ${resource}`,
            event_description: `User performed ${action} on ${resource}`,
            action: action,
            resource_type: resource,
            user_id: getCurrentUserId(),
            username: getCurrentUsername(),
            user_role: getCurrentUserRole(),
            timestamp: new Date().toISOString(),
            metadata: details,
            severity: 'INFO',
            tags: ['user_action', action.toLowerCase(), resource.toLowerCase()]
        };
        
        try {
            await fetch('/api/events', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify(eventData)
            });
        } catch (error) {
            console.error('Failed to log event:', error);
        }
    }
    
    static async logPredictionEvent(studentId, result, confidence) {
        await this.logUserAction('PREDICT', 'STUDENT', {
            student_id: studentId,
            prediction_result: result,
            confidence: confidence,
            model_version: 'v2025.06.19.001'
        });
    }
    
    static async logSecurityEvent(eventType, details) {
        const eventData = {
            event_category: 'SECURITY',
            event_type: eventType,
            event_name: `Security Event: ${eventType}`,
            event_description: details.description,
            severity: 'WARNING',
            metadata: details,
            tags: ['security', eventType.toLowerCase()]
        };
        
        await fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData)
        });
    }
}

// Usage examples
EventLogger.logUserAction('CREATE', 'STUDENT', {student_name: 'Ahmad Rizki'});
EventLogger.logPredictionEvent('STD-001', 'TINGGI', 87.5);
EventLogger.logSecurityEvent('UNAUTHORIZED_ACCESS', {
    description: 'Attempted access to admin panel',
    ip_address: '192.168.1.100'
});
```

### 3. Middleware Integration (FastAPI)
```python
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
import time

class EventLoggingMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, event_logger):
        super().__init__(app)
        self.event_logger = event_logger
    
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # Get request info
        user_info = getattr(request.state, 'user', None)
        
        response = await call_next(request)
        
        # Calculate processing time
        processing_time = int((time.time() - start_time) * 1000)
        
        # Log API request
        event_data = {
            'event_category': 'SYSTEM',
            'event_type': 'API_REQUEST',
            'event_name': f'{request.method} {request.url.path}',
            'event_description': f'API request to {request.url.path}',
            'user_id': user_info.id if user_info else None,
            'username': user_info.username if user_info else None,
            'user_role': user_info.role if user_info else None,
            'ip_address': request.client.host,
            'user_agent': request.headers.get('user-agent'),
            'http_method': request.method,
            'endpoint': str(request.url.path),
            'action': request.method,
            'status': 'SUCCESS' if response.status_code < 400 else 'ERROR',
            'processing_time_ms': processing_time,
            'severity': 'DEBUG' if response.status_code < 400 else 'WARNING',
            'metadata': {
                'status_code': response.status_code,
                'content_length': response.headers.get('content-length')
            },
            'tags': ['api', 'request', request.method.lower()]
        }
        
        self.event_logger.log_event(event_data)
        
        return response
```

## Best Practices

### 1. Event Design
- **Consistent Naming**: Gunakan naming convention yang konsisten
- **Rich Context**: Sertakan konteks yang cukup untuk analysis
- **Structured Data**: Gunakan JSON untuk data yang kompleks
- **Performance**: Jangan sampai logging mempengaruhi performa aplikasi

### 2. Data Privacy
- **PII Protection**: Jangan log data pribadi sensitif
- **Data Masking**: Mask data sensitif jika perlu di-log
- **Access Control**: Batasi akses ke event logs
- **Compliance**: Pastikan sesuai dengan regulasi data privacy

### 3. Monitoring & Alerting
- **Real-time Monitoring**: Monitor event stream secara real-time
- **Automated Alerts**: Setup alert untuk event kritis
- **Dashboard**: Buat dashboard untuk visualisasi event
- **Retention**: Implementasi retention policy yang sesuai

### 4. Performance Optimization
- **Asynchronous Logging**: Gunakan async logging untuk performa
- **Batch Processing**: Batch multiple events untuk efisiensi
- **Indexing**: Buat index yang tepat untuk query performance
- **Partitioning**: Gunakan table partitioning untuk data besar

## Conclusion

Event Table sistem informasi EduPro ini menyediakan **comprehensive logging framework** dengan:

✅ **8 Event Categories** - Complete coverage semua aspek sistem  
✅ **80+ Event Types** - Detailed event classification  
✅ **Rich Schema** - Comprehensive data structure dengan 30+ fields  
✅ **Security Focus** - Strong security event monitoring  
✅ **Performance Monitoring** - System performance tracking  
✅ **Audit Trail** - Complete audit capabilities  
✅ **Integration Ready** - Easy integration dengan aplikasi  
✅ **Query Examples** - Ready-to-use monitoring queries  
✅ **Best Practices** - Production-ready guidelines  

Dokumentasi ini akan menjadi **foundation** untuk implementasi comprehensive event logging system yang mendukung **audit**, **security monitoring**, **performance analysis**, dan **business intelligence** dalam aplikasi EduPro.

---

**Dibuat**: 19 Juni 2025  
**Versi**: 1.0  
**Status**: Production Ready  
**Maintainer**: EduPro Development Team

