# Dokumentasi Use Case Sistem Event EduPro
**Dibuat:** 19 Juni 2025  
**Versi:** 1.0  
**Status:** Production Ready  

## Daftar Isi
1. [Overview Sistem](#overview-sistem)
2. [Aktor Sistem](#aktor-sistem)
3. [Kategori Use Case](#kategori-use-case)
4. [Detail Use Case](#detail-use-case)
5. [Alur Event Lifecycle](#alur-event-lifecycle)
6. [Business Rules](#business-rules)
7. [Metrics & KPI](#metrics--kpi)

## Overview Sistem

Sistem Event Logging EduPro adalah sistem komprehensif untuk melacak, menganalisis, dan memantau semua aktivitas dalam aplikasi prediksi prestasi siswa. Sistem ini mendukung audit trail lengkap, analisis keamanan, dan monitoring performa real-time.

### Fitur Utama
- **Event Tracking**: Pelacakan 40+ field data untuk setiap event
- **Real-time Monitoring**: Dashboard analitik real-time
- **Security Analytics**: Deteksi ancaman dan anomali
- **Audit Trail**: Jejak audit lengkap untuk compliance
- **Performance Monitoring**: Monitoring performa sistem
- **Data Analytics**: Analisis pola penggunaan dan behavior

## Aktor Sistem

### Primary Actors
1. **Admin** - Administrator sistem dengan akses penuh
2. **Teacher (Guru)** - Pengguna dengan akses terbatas untuk data siswa
3. **Student (Siswa)** - Pengguna dengan akses read-only terbatas
4. **System** - Sistem otomatis dan scheduled tasks

### Secondary Actors
1. **Database** - PostgreSQL database system
2. **ML Engine** - Machine Learning processing engine
3. **External API** - Integrasi dengan sistem eksternal

## Kategori Use Case

### 1. Authentication & Authorization (AUTH)
- Login/logout proses
- Session management
- Role-based access control
- Password management

### 2. CRUD Operations (CRUD)
- Data siswa management
- Nilai raport operations
- Presensi tracking
- Penghasilan orang tua management

### 3. Machine Learning (ML)
- Model training
- Prediction processing
- Model evaluation
- Feature analysis

### 4. System Operations (SYSTEM)
- System startup/shutdown
- Configuration changes
- Backup operations
- Maintenance tasks

### 5. File Operations (FILE)
- File upload/download
- Export operations
- Import data
- Report generation

### 6. Security (SECURITY)
- Threat detection
- Intrusion attempts
- Suspicious activities
- Security violations

### 7. Analytics & Monitoring (ANALYTICS)
- Performance monitoring
- Usage analytics
- System health checks
- Business intelligence

## Detail Use Case

### UC-AUTH-001: User Login
**Aktor:** Admin, Teacher, Student  
**Tujuan:** Melakukan autentikasi pengguna ke sistem  
**Precondition:** Pengguna memiliki kredensial valid  
**Postcondition:** Pengguna berhasil login dan session dibuat  

**Main Flow:**
1. Pengguna mengakses halaman login
2. Sistem menampilkan form login
3. Pengguna memasukkan username dan password
4. Sistem memvalidasi kredensial
5. Sistem membuat session dan JWT token
6. Sistem mencatat event login
7. Sistem mengarahkan ke dashboard

**Event Data Captured:**
- User ID dan username
- IP address dan user agent
- Timestamp login
- Session ID
- Login method
- Geolocation (jika tersedia)

### UC-CRUD-001: Create Student Data
**Aktor:** Admin, Teacher  
**Tujuan:** Menambahkan data siswa baru ke sistem  
**Precondition:** Pengguna memiliki akses create siswa  
**Postcondition:** Data siswa tersimpan dan event tercatat  

**Main Flow:**
1. Pengguna mengakses form tambah siswa
2. Sistem menampilkan form input
3. Pengguna mengisi data siswa
4. Sistem memvalidasi data
5. Sistem menyimpan data ke database
6. Sistem mencatat event create
7. Sistem menampilkan konfirmasi sukses

**Event Data Captured:**
- Student ID yang dibuat
- Data fields yang diisi
- User yang melakukan create
- Validation status
- Processing time

### UC-ML-001: Train ML Model
**Aktor:** Admin, System  
**Tujuan:** Melatih model machine learning untuk prediksi  
**Precondition:** Data training tersedia (min 30 siswa)  
**Postcondition:** Model terlatih dan siap untuk prediksi  

**Main Flow:**
1. Pengguna/System memulai training
2. Sistem mengumpulkan data training
3. Sistem memproses data dengan algoritma C4.5
4. Sistem mengevaluasi model
5. Sistem menyimpan model hasil training
6. Sistem mencatat event training
7. Sistem menampilkan hasil evaluasi

**Event Data Captured:**
- Training dataset size
- Model parameters
- Training duration
- Accuracy metrics
- Feature importance
- Model version

### UC-SEC-001: Detect Brute Force Attack
**Aktor:** System  
**Tujuan:** Mendeteksi dan mencegah serangan brute force  
**Precondition:** Sistem monitoring aktif  
**Postcondition:** Ancaman terdeteksi dan tindakan preventif diambil  

**Main Flow:**
1. Sistem memantau login attempts
2. Sistem mendeteksi multiple failed attempts
3. Sistem mengidentifikasi pola serangan
4. Sistem memblokir IP address
5. Sistem mencatat security event
6. Sistem mengirim alert ke admin
7. Sistem mengupdate security rules

**Event Data Captured:**
- IP address penyerang
- Number of attempts
- Time pattern
- Targeted accounts
- Blocking action taken
- Alert sent status

### UC-ANALYTICS-001: Generate Usage Report
**Aktor:** Admin  
**Tujuan:** Menghasilkan laporan penggunaan sistem  
**Precondition:** Data event tersedia  
**Postcondition:** Laporan analytics dihasilkan  

**Main Flow:**
1. Admin memilih periode laporan
2. Sistem mengumpulkan data event
3. Sistem memproses analytics
4. Sistem menghasilkan visualisasi
5. Sistem menyimpan laporan
6. Sistem mencatat event analytics
7. Sistem menampilkan hasil laporan

**Event Data Captured:**
- Report parameters
- Data range processed
- Report generation time
- Report format
- User who generated
- Report access log

## Alur Event Lifecycle

### 1. Event Trigger
- User action (click, submit, etc.)
- System action (scheduled task, alert)
- External trigger (API call, webhook)

### 2. Event Capture
- Middleware intercepts request/response
- Context data collection
- Timestamp recording
- User identification

### 3. Event Processing
- Data validation dan sanitization
- Business logic processing
- Performance metrics calculation
- Error handling

### 4. Event Filtering
- Sensitive data filtering
- Privacy compliance check
- Relevance assessment
- Noise reduction

### 5. Event Storage
- Database insertion
- Index updating
- Partitioning by date
- Backup scheduling

### 6. Event Indexing
- Search index creation
- Analytics aggregation
- Real-time processing
- Cache updating

### 7. Event Alerting
- Threshold monitoring
- Anomaly detection
- Notification sending
- Escalation procedures

## Business Rules

### Access Control
- Admin: Full access to all events
- Teacher: Access to student-related events only
- Student: Access to own events only
- System: Automated event creation only

### Data Retention
- Authentication events: 1 year
- CRUD operations: 3 years
- Security events: 5 years
- Analytics data: Permanent with archiving

### Security Rules
- Failed login > 5 attempts = IP block
- Suspicious pattern = Alert admin
- Data breach attempt = Immediate lockdown
- Unauthorized access = Session termination

### Performance Rules
- Event logging < 100ms overhead
- Real-time processing < 5 seconds
- Analytics query < 30 seconds
- Report generation < 5 minutes

## Metrics & KPI

### Functional Metrics
- **Event Capture Rate**: 99.9% of all actions logged
- **Data Accuracy**: 99.5% event data correctness
- **Processing Speed**: <100ms average logging time
- **Storage Efficiency**: <1MB per 1000 events

### Security Metrics
- **Threat Detection**: 95% accuracy rate
- **Response Time**: <30 seconds for critical alerts
- **False Positive Rate**: <5% for security events
- **Incident Resolution**: <1 hour average

### Performance Metrics
- **System Availability**: 99.9% uptime
- **Query Performance**: <1 second average
- **Scalability**: 1000+ events/minute capacity
- **Resource Usage**: <10% CPU overhead

### Business Metrics
- **User Engagement**: Daily/monthly active users
- **Feature Usage**: Most/least used features
- **Error Rates**: System error frequency
- **Compliance**: Audit trail completeness

---

## Implementasi Status
✅ **Event Table Schema** - Complete dengan 40+ fields  
✅ **Event Middleware** - Implemented dengan comprehensive logging  
✅ **Event Router** - API endpoints untuk event management  
✅ **Event Logger Service** - Core logging functionality  
✅ **Security Integration** - Threat detection dan alerting  
✅ **Analytics Dashboard** - Real-time monitoring  
✅ **Performance Monitoring** - System health tracking  

## Next Steps
1. **Advanced Analytics** - Machine learning pada event patterns
2. **External Integration** - SIEM dan monitoring tools
3. **Mobile App Support** - Event logging untuk mobile
4. **Compliance Enhancement** - GDPR dan audit requirements
5. **Predictive Analytics** - Forecasting based on event trends

---
**Dokumen ini adalah bagian dari EduPro Event System Documentation Suite**  
**Untuk informasi lebih lanjut, lihat dokumentasi terkait di folder docs/** 