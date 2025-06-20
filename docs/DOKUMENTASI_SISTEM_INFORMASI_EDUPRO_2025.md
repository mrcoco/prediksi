# 📊 Dokumentasi Sistem Informasi EduPro 2025
**Sistem Prediksi Prestasi Siswa dengan Event Logging Komprehensif**

---

## 📋 Daftar Isi
1. [Overview Sistem](#overview-sistem)
2. [Event Table Specification](#event-table-specification)
3. [Event Categories & Types](#event-categories--types)
4. [Database Schema](#database-schema)
5. [Use Case Descriptions](#use-case-descriptions)
6. [Analytics & Monitoring](#analytics--monitoring)
7. [Security & Compliance](#security--compliance)
8. [Performance Specifications](#performance-specifications)

---

## 🎯 Overview Sistem

EduPro adalah sistem prediksi prestasi siswa berbasis machine learning dengan sistem event logging yang komprehensif. Sistem ini dirancang untuk melacak, menganalisis, dan memantau semua aktivitas dalam aplikasi dengan tingkat detail yang tinggi untuk keperluan audit, keamanan, dan analisis bisnis.

### Komponen Utama
- **Event Logging System**: Pelacakan 40+ field data untuk setiap event
- **Machine Learning Engine**: Algoritma C4.5 untuk prediksi prestasi
- **Security Monitoring**: Deteksi ancaman real-time
- **Analytics Dashboard**: Visualisasi data dan metrics
- **Audit Trail**: Jejak audit lengkap untuk compliance

---

## 📋 Event Table Specification

### SQL Schema
```sql
CREATE TABLE events (
    -- Primary Identifiers
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100) NOT NULL,
    event_category VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- User Context
    user_id UUID REFERENCES users(id),
    username VARCHAR(255),
    user_role VARCHAR(50),
    session_id VARCHAR(255),
    
    -- Request Context
    ip_address INET,
    user_agent TEXT,
    endpoint VARCHAR(500),
    method VARCHAR(10),
    status_code INTEGER,
    response_time_ms INTEGER,
    response_size_bytes INTEGER,
    
    -- Entity Context
    entity_type VARCHAR(100),
    entity_id UUID,
    entity_name VARCHAR(255),
    
    -- Data Context
    request_data JSONB,
    response_data JSONB,
    old_values JSONB,
    new_values JSONB,
    
    -- Event Status
    event_status VARCHAR(50) DEFAULT 'SUCCESS',
    error_message TEXT,
    error_code VARCHAR(100),
    
    -- Metadata
    tags TEXT[],
    search_text TEXT,
    is_sensitive BOOLEAN DEFAULT FALSE,
    
    -- Performance Metrics
    cpu_usage_percent DECIMAL(5,2),
    memory_usage_mb INTEGER,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_event_category CHECK (event_category IN ('AUTH', 'CRUD', 'ML', 'SYSTEM', 'FILE', 'SECURITY', 'ANALYTICS')),
    CONSTRAINT chk_status_code CHECK (status_code BETWEEN 100 AND 599),
    CONSTRAINT chk_response_time CHECK (response_time_ms >= 0)
);

-- Indexes for Performance
CREATE INDEX idx_events_timestamp ON events(timestamp DESC);
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_category ON events(event_category);
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_entity ON events(entity_type, entity_id);
CREATE INDEX idx_events_session ON events(session_id);
CREATE INDEX idx_events_ip ON events(ip_address);
CREATE INDEX idx_events_status ON events(event_status);
CREATE INDEX idx_events_error ON events(error_code) WHERE error_code IS NOT NULL;
CREATE INDEX idx_events_search ON events USING GIN(to_tsvector('english', search_text));
CREATE INDEX idx_events_tags ON events USING GIN(tags);
CREATE INDEX idx_events_request_data ON events USING GIN(request_data);
CREATE INDEX idx_events_response_data ON events USING GIN(response_data);
CREATE INDEX idx_events_composite ON events(event_category, timestamp DESC, user_id);
CREATE INDEX idx_events_performance ON events(response_time_ms, cpu_usage_percent);

-- Partitioning by Month
CREATE TABLE events_y2025m01 PARTITION OF events
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
CREATE TABLE events_y2025m02 PARTITION OF events
    FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
-- ... continue for all months

-- Event Summary Table
CREATE TABLE event_summary_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    summary_date DATE NOT NULL,
    event_category VARCHAR(50) NOT NULL,
    total_events INTEGER NOT NULL DEFAULT 0,
    success_count INTEGER NOT NULL DEFAULT 0,
    failed_count INTEGER NOT NULL DEFAULT 0,
    error_count INTEGER NOT NULL DEFAULT 0,
    avg_response_time DECIMAL(10,2),
    unique_users INTEGER,
    unique_ips INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(summary_date, event_category)
);
```

---

## 🏷️ Event Categories & Types

### 1. Authentication (AUTH)
- **LOGIN_SUCCESS**: Berhasil login
- **LOGIN_FAILED**: Gagal login
- **LOGOUT**: Proses logout
- **TOKEN_REFRESH**: Refresh JWT token
- **SESSION_EXPIRED**: Session habis
- **PASSWORD_CHANGE**: Ubah password
- **PASSWORD_RESET**: Reset password

### 2. CRUD Operations (CRUD)
- **SISWA_CREATE**: Tambah data siswa
- **SISWA_READ**: Lihat data siswa
- **SISWA_UPDATE**: Update data siswa
- **SISWA_DELETE**: Hapus data siswa
- **NILAI_CREATE**: Tambah nilai raport
- **NILAI_UPDATE**: Update nilai raport
- **PRESENSI_CREATE**: Tambah data presensi
- **PRESENSI_UPDATE**: Update data presensi
- **PENGHASILAN_CREATE**: Tambah data penghasilan
- **PENGHASILAN_UPDATE**: Update data penghasilan

### 3. Machine Learning (ML)
- **MODEL_TRAIN**: Training model ML
- **MODEL_EVALUATE**: Evaluasi model
- **PREDICTION_SINGLE**: Prediksi tunggal
- **PREDICTION_BATCH**: Prediksi batch
- **FEATURE_EXTRACTION**: Ekstraksi fitur
- **MODEL_SAVE**: Simpan model
- **MODEL_LOAD**: Load model

### 4. System Operations (SYSTEM)
- **SYSTEM_START**: Sistem start
- **SYSTEM_SHUTDOWN**: Sistem shutdown
- **CONFIG_UPDATE**: Update konfigurasi
- **DATABASE_BACKUP**: Backup database
- **MAINTENANCE_START**: Mulai maintenance
- **MAINTENANCE_END**: Selesai maintenance
- **HEALTH_CHECK**: Health check

### 5. File Operations (FILE)
- **FILE_UPLOAD**: Upload file
- **FILE_DOWNLOAD**: Download file
- **FILE_DELETE**: Hapus file
- **EXPORT_DATA**: Export data
- **IMPORT_DATA**: Import data
- **REPORT_GENERATE**: Generate laporan

### 6. Security (SECURITY)
- **BRUTE_FORCE_DETECTED**: Deteksi brute force
- **SQL_INJECTION_DETECTED**: Deteksi SQL injection
- **XSS_DETECTED**: Deteksi XSS
- **UNAUTHORIZED_ACCESS**: Akses tidak authorized
- **IP_BLOCKED**: IP diblokir
- **SECURITY_ALERT**: Alert keamanan

### 7. Analytics & Monitoring (ANALYTICS)
- **DASHBOARD_VIEW**: Lihat dashboard
- **REPORT_VIEW**: Lihat laporan
- **ANALYTICS_QUERY**: Query analytics
- **PERFORMANCE_MONITOR**: Monitor performa
- **USAGE_STATISTICS**: Statistik penggunaan

---

## 🗄️ Database Schema

### Core Tables
```sql
-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Students Table
CREATE TABLE siswa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama VARCHAR(255) NOT NULL,
    jenis_kelamin VARCHAR(20),
    agama VARCHAR(50),
    status_keluarga VARCHAR(50),
    jumlah_saudara INTEGER,
    anak_ke INTEGER,
    alamat_siswa TEXT,
    no_telp VARCHAR(20),
    sekolah_asal VARCHAR(255),
    diterima_beasiswa BOOLEAN DEFAULT FALSE,
    tahun_masuk VARCHAR(4),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Academic Scores Table
CREATE TABLE nilai_raport (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    siswa_id UUID REFERENCES siswa(id) ON DELETE CASCADE,
    matematika DECIMAL(4,2),
    bahasa_indonesia DECIMAL(4,2),
    bahasa_inggris DECIMAL(4,2),
    ipa DECIMAL(4,2),
    ips DECIMAL(4,2),
    semester VARCHAR(10),
    tahun_ajaran VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Attendance Table
CREATE TABLE presensi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    siswa_id UUID REFERENCES siswa(id) ON DELETE CASCADE,
    hadir INTEGER DEFAULT 0,
    sakit INTEGER DEFAULT 0,
    izin INTEGER DEFAULT 0,
    alpha INTEGER DEFAULT 0,
    semester VARCHAR(10),
    tahun_ajaran VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Parent Income Table
CREATE TABLE penghasilan_ortu (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    siswa_id UUID REFERENCES siswa(id) ON DELETE CASCADE,
    penghasilan_ayah DECIMAL(15,2),
    penghasilan_ibu DECIMAL(15,2),
    pekerjaan_ayah VARCHAR(100),
    pekerjaan_ibu VARCHAR(100),
    pendidikan_ayah VARCHAR(50),
    pendidikan_ibu VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ML Models Table
CREATE TABLE ml_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    version VARCHAR(50) NOT NULL,
    algorithm VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    parameters JSONB,
    metrics JSONB,
    accuracy DECIMAL(5,4),
    precision_score DECIMAL(5,4),
    recall_score DECIMAL(5,4),
    f1_score DECIMAL(5,4),
    trained_at TIMESTAMP WITH TIME ZONE,
    model_path VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Prediction Results Table
CREATE TABLE prediction_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    siswa_id UUID REFERENCES siswa(id) ON DELETE CASCADE,
    model_id UUID REFERENCES ml_models(id),
    prediction VARCHAR(50) NOT NULL,
    confidence DECIMAL(5,4),
    feature_values JSONB,
    feature_importance JSONB,
    predicted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    metadata JSONB
);
```

---

## 📝 Use Case Descriptions

### UC-AUTH-001: User Login
**Aktor**: Admin, Teacher, Student  
**Deskripsi**: Pengguna melakukan login ke sistem dengan kredensial yang valid  
**Precondition**: Pengguna memiliki akses ke sistem  
**Postcondition**: Pengguna berhasil login dan session dibuat  

**Main Flow**:
1. Pengguna mengakses halaman login
2. Sistem menampilkan form login
3. Pengguna memasukkan username dan password
4. Sistem memvalidasi kredensial
5. Sistem membuat JWT token dan session
6. Sistem mencatat event login (AUTH/LOGIN_SUCCESS)
7. Sistem mengarahkan ke dashboard

**Event Data**:
- User ID, username, role
- IP address, user agent
- Session ID, timestamp
- Response time, status code

### UC-CRUD-001: Create Student Data
**Aktor**: Admin, Teacher  
**Deskripsi**: Menambahkan data siswa baru ke dalam sistem  
**Precondition**: Pengguna memiliki permission create siswa  
**Postcondition**: Data siswa tersimpan dan event tercatat  

**Main Flow**:
1. Pengguna mengakses form tambah siswa
2. Sistem menampilkan form input data siswa
3. Pengguna mengisi semua field yang diperlukan
4. Sistem memvalidasi data input
5. Sistem menyimpan data ke database
6. Sistem mencatat event create (CRUD/SISWA_CREATE)
7. Sistem menampilkan konfirmasi berhasil

**Event Data**:
- Entity type: siswa, Entity ID: UUID siswa
- New values: data siswa yang dibuat
- User context: user ID, session ID
- Performance metrics: response time

### UC-ML-001: Train ML Model
**Aktor**: Admin, System  
**Deskripsi**: Melatih model machine learning untuk prediksi prestasi  
**Precondition**: Data training tersedia (minimal 30 siswa)  
**Postcondition**: Model terlatih dan siap digunakan  

**Main Flow**:
1. Sistem/Admin memulai proses training
2. Sistem mengumpulkan data training dari database
3. Sistem memproses data dengan algoritma C4.5
4. Sistem mengevaluasi performa model
5. Sistem menyimpan model hasil training
6. Sistem mencatat event training (ML/MODEL_TRAIN)
7. Sistem menampilkan hasil evaluasi

**Event Data**:
- Model parameters: algoritma, hyperparameters
- Training metrics: accuracy, precision, recall, F1-score
- Dataset info: jumlah data, features used
- Training duration: start time, end time

---

## 📊 Analytics & Monitoring

### Real-time Dashboard Queries
```sql
-- Daily Event Summary
SELECT 
    event_category,
    COUNT(*) as total_events,
    COUNT(CASE WHEN event_status = 'SUCCESS' THEN 1 END) as success_count,
    COUNT(CASE WHEN event_status = 'ERROR' THEN 1 END) as error_count,
    AVG(response_time_ms) as avg_response_time,
    COUNT(DISTINCT user_id) as unique_users
FROM events 
WHERE timestamp >= CURRENT_DATE 
GROUP BY event_category;

-- Top Active Users
SELECT 
    username,
    COUNT(*) as activity_count,
    MAX(timestamp) as last_activity
FROM events 
WHERE timestamp >= CURRENT_DATE - INTERVAL '7 days'
    AND user_id IS NOT NULL
GROUP BY username, user_id
ORDER BY activity_count DESC
LIMIT 10;

-- Security Events Analysis
SELECT 
    event_type,
    ip_address,
    COUNT(*) as event_count,
    MAX(timestamp) as last_occurrence
FROM events 
WHERE event_category = 'SECURITY'
    AND timestamp >= CURRENT_DATE - INTERVAL '24 hours'
GROUP BY event_type, ip_address
ORDER BY event_count DESC;

-- Performance Monitoring
SELECT 
    endpoint,
    COUNT(*) as request_count,
    AVG(response_time_ms) as avg_response_time,
    PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY response_time_ms) as p95_response_time,
    COUNT(CASE WHEN status_code >= 400 THEN 1 END) as error_count
FROM events 
WHERE method IS NOT NULL 
    AND timestamp >= CURRENT_DATE - INTERVAL '1 hour'
GROUP BY endpoint
ORDER BY request_count DESC;

-- ML Model Performance
SELECT 
    DATE_TRUNC('day', predicted_at) as date,
    COUNT(*) as prediction_count,
    AVG(confidence) as avg_confidence,
    COUNT(CASE WHEN prediction = 'TINGGI' THEN 1 END) as high_predictions,
    COUNT(CASE WHEN prediction = 'SEDANG' THEN 1 END) as medium_predictions,
    COUNT(CASE WHEN prediction = 'RENDAH' THEN 1 END) as low_predictions
FROM prediction_results 
WHERE predicted_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', predicted_at)
ORDER BY date DESC;
```

### Business Intelligence Queries
```sql
-- Student Performance Trends
WITH monthly_stats AS (
    SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as new_students,
        AVG(CASE WHEN pr.prediction = 'TINGGI' THEN 1.0 ELSE 0.0 END) as high_performance_rate
    FROM siswa s
    LEFT JOIN prediction_results pr ON s.id = pr.siswa_id
    WHERE s.created_at >= CURRENT_DATE - INTERVAL '12 months'
    GROUP BY DATE_TRUNC('month', created_at)
)
SELECT * FROM monthly_stats ORDER BY month;

-- Feature Importance Analysis
SELECT 
    jsonb_object_keys(feature_importance) as feature_name,
    AVG((feature_importance->>jsonb_object_keys(feature_importance))::numeric) as avg_importance
FROM prediction_results 
WHERE feature_importance IS NOT NULL
    AND predicted_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY jsonb_object_keys(feature_importance)
ORDER BY avg_importance DESC;
```

---

## 🔒 Security & Compliance

### Access Control Rules
- **Admin**: Full access to all events and analytics
- **Teacher**: Access to student-related events only
- **Student**: Access to own events only
- **System**: Automated event creation and maintenance

### Data Retention Policy
- **Authentication Events**: 1 year retention
- **CRUD Operations**: 3 years retention
- **Security Events**: 5 years retention
- **Analytics Data**: Permanent with archiving after 2 years

### Privacy Protection
- Sensitive data filtering in event logging
- PII anonymization for analytics
- GDPR compliance with data export/deletion capabilities
- Encryption at rest for sensitive event data

### Security Monitoring
```sql
-- Brute Force Detection
SELECT 
    ip_address,
    COUNT(*) as failed_attempts,
    MAX(timestamp) as last_attempt
FROM events 
WHERE event_type = 'LOGIN_FAILED'
    AND timestamp >= CURRENT_TIMESTAMP - INTERVAL '1 hour'
GROUP BY ip_address
HAVING COUNT(*) >= 5;

-- Suspicious Activity Detection
SELECT 
    user_id,
    username,
    COUNT(DISTINCT ip_address) as ip_count,
    COUNT(*) as activity_count
FROM events 
WHERE timestamp >= CURRENT_TIMESTAMP - INTERVAL '1 hour'
    AND user_id IS NOT NULL
GROUP BY user_id, username
HAVING COUNT(DISTINCT ip_address) > 3;
```

---

## ⚡ Performance Specifications

### System Requirements
- **Event Logging Overhead**: < 100ms per request
- **Event Storage**: < 1MB per 1000 events
- **Query Performance**: < 1 second for dashboard queries
- **Real-time Processing**: < 5 seconds for event processing
- **Scalability**: Support 1000+ events per minute

### Database Optimization
- Partitioning by month for events table
- Comprehensive indexing strategy
- Query optimization with EXPLAIN ANALYZE
- Connection pooling and caching
- Automated archiving of old data

### Monitoring Metrics
- **Availability**: 99.9% uptime target
- **Response Time**: P95 < 200ms for API calls
- **Error Rate**: < 1% for all operations
- **Data Accuracy**: 99.9% event capture rate
- **Security**: 95% threat detection accuracy

---

## 🚀 Implementation Status

### ✅ Completed Components
- [x] Event table schema with 40+ fields
- [x] Event logging middleware
- [x] Event service and repository
- [x] Security event detection
- [x] Analytics dashboard queries
- [x] Performance monitoring
- [x] Database indexing and optimization
- [x] Real-time event processing

### 🔄 In Progress
- [ ] Advanced ML analytics on event patterns
- [ ] External SIEM integration
- [ ] Mobile app event logging
- [ ] Compliance reporting automation

### 📋 Next Steps
1. **Production Deployment**: Deploy to production environment
2. **Performance Tuning**: Optimize based on real-world usage
3. **Advanced Analytics**: Implement predictive analytics on events
4. **Integration**: Connect with external monitoring tools
5. **Compliance**: Implement full GDPR compliance features

---

**Dokumen ini merupakan bagian dari EduPro Event System Documentation Suite 2025**  
**Untuk informasi lebih lanjut, lihat file diagram dan dokumentasi terkait di folder docs/** 