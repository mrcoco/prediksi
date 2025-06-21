# EVENT TABLE SISTEM INFORMASI EDUPRO
**Sistem Prediksi Prestasi Siswa**

---

## INFORMASI DOKUMEN
- **Judul**: Event Table Sistem Informasi EduPro
- **Versi**: 1.0
- **Tanggal**: 19 Juni 2025
- **Sistem**: EduPro - Sistem Prediksi Prestasi Siswa
- **Status**: Production Ready

---

## 1. PENGANTAR

Event Table adalah komponen fundamental dalam analisis dan desain sistem informasi EduPro. Tabel ini mendokumentasikan seluruh peristiwa (event) yang dapat terjadi dalam sistem, mulai dari interaksi pengguna hingga proses internal sistem.

### 1.1 Tujuan Event Table
- Mendokumentasikan seluruh alur kerja sistem EduPro
- Mengidentifikasi semua stakeholder dan peran mereka
- Memetakan interaksi antar komponen sistem
- Menjadi acuan untuk pengembangan dan testing
- Memfasilitasi pemeliharaan dan pengembangan sistem

### 1.2 Ruang Lingkup
Event Table ini mencakup semua modul utama dalam sistem EduPro:
- **Modul Autentikasi**: Login, logout, manajemen session
- **Modul Manajemen Data**: CRUD siswa, nilai, presensi, penghasilan
- **Modul Machine Learning**: Training model, prediksi prestasi
- **Modul Visualisasi**: Dashboard, laporan, statistik
- **Modul Sistem**: Backup, monitoring, error handling

---

## 2. STRUKTUR EVENT TABLE

Setiap event memiliki struktur sebagai berikut:

| Komponen | Deskripsi |
|----------|-----------|
| **Event ID** | Identifier unik untuk setiap event |
| **Event Name** | Nama event yang deskriptif |
| **Category** | Kategori event |
| **Priority** | Tingkat prioritas |
| **Trigger** | Apa yang memicu terjadinya event |
| **Actor** | Siapa yang terlibat dalam event |
| **Input** | Data atau parameter yang diperlukan |
| **Process** | Langkah-langkah yang dilakukan sistem |
| **Output** | Hasil yang dihasilkan sistem |
| **Exception** | Kondisi error yang mungkin terjadi |

---

## 3. EVENT TABLE LENGKAP

### 3.1 AUTHENTICATION EVENTS

| Event ID | Event Name | Category | Priority | Trigger | Actor | Input | Process | Output | Exception |
|----------|------------|----------|----------|---------|-------|-------|---------|--------|-----------|
| AUTH-001 | User Login | Authentication | Critical | User mengklik tombol login | Admin/Guru/Staf | Username, Password | 1. Validasi kredensial<br>2. Generate JWT token<br>3. Set session | JWT token, User profile | Invalid credentials |
| AUTH-002 | User Logout | Authentication | High | User mengklik logout | Admin/Guru/Staf | JWT token | 1. Invalidate token<br>2. Clear session<br>3. Redirect to login | Success message | Token expired |
| AUTH-003 | Token Refresh | Authentication | High | Token mendekati expired | System | Current JWT token | 1. Validate token<br>2. Generate new token<br>3. Update session | New JWT token | Invalid token |
| AUTH-004 | Session Timeout | Authentication | Medium | Session idle > 2 jam | System | Session data | 1. Check duration<br>2. Force logout<br>3. Clear session | Timeout notification | - |
| AUTH-005 | Password Change | Authentication | High | User mengubah password | Admin/Guru/Staf | Old password, New password | 1. Validate old password<br>2. Hash new password<br>3. Update database | Success message | Wrong password |

### 3.2 DATA MANAGEMENT EVENTS

#### 3.2.1 Siswa Management Events

| Event ID | Event Name | Category | Priority | Trigger | Actor | Input | Process | Output | Exception |
|----------|------------|----------|----------|---------|-------|-------|---------|--------|-----------|
| DATA-001 | Create Siswa | Data Management | High | User mengisi form siswa baru | Admin/Staf | Data siswa lengkap | 1. Validate input<br>2. Check duplicate NISN<br>3. Insert database | Success message, Siswa ID | Duplicate NISN |
| DATA-002 | Read Siswa | Data Management | High | User membuka halaman siswa | Admin/Guru/Staf | Pagination parameters | 1. Query database<br>2. Apply filters<br>3. Format data | List siswa | Database error |
| DATA-003 | Update Siswa | Data Management | High | User mengedit data siswa | Admin/Staf | Siswa ID, Updated data | 1. Validate exists<br>2. Validate input<br>3. Update database | Success message | Not found |
| DATA-004 | Delete Siswa | Data Management | Critical | User menghapus siswa | Admin | Siswa ID | 1. Check exists<br>2. Check related data<br>3. Soft delete | Success message | Has related data |
| DATA-005 | Export Siswa Excel | Data Management | Medium | User mengklik export | Admin/Guru/Staf | Export parameters | 1. Query data<br>2. Generate Excel<br>3. Stream download | Excel file | No data |

#### 3.2.2 Nilai Management Events

| Event ID | Event Name | Category | Priority | Trigger | Actor | Input | Process | Output | Exception |
|----------|------------|----------|----------|---------|-------|-------|---------|--------|-----------|
| DATA-006 | Create Nilai | Data Management | High | User mengisi form nilai | Admin/Guru/Staf | Siswa ID, Nilai data | 1. Validate siswa<br>2. Validate range<br>3. Calculate rata-rata<br>4. Insert database | Success message | Invalid range |
| DATA-007 | Read Nilai | Data Management | High | User membuka halaman nilai | Admin/Guru/Staf | Filter parameters | 1. Query with join<br>2. Apply filters<br>3. Format data | List nilai | Database error |
| DATA-008 | Update Nilai | Data Management | High | User mengedit nilai | Admin/Guru/Staf | Nilai ID, Updated data | 1. Validate exists<br>2. Validate input<br>3. Recalculate rata-rata<br>4. Update database | Success message | Not found |
| DATA-009 | Delete Nilai | Data Management | High | User menghapus nilai | Admin/Guru | Nilai ID | 1. Check exists<br>2. Delete from database | Success message | Not found |
| DATA-010 | Export Nilai Excel | Data Management | Medium | User mengklik export | Admin/Guru/Staf | Export parameters | 1. Query with siswa<br>2. Generate Excel<br>3. Stream download | Excel file | No data |

#### 3.2.3 Presensi Management Events

| Event ID | Event Name | Category | Priority | Trigger | Actor | Input | Process | Output | Exception |
|----------|------------|----------|----------|---------|-------|-------|---------|--------|-----------|
| DATA-011 | Create Presensi | Data Management | High | User mengisi form presensi | Admin/Guru/Staf | Siswa ID, Presensi data | 1. Validate siswa<br>2. Validate data<br>3. Calculate persentase<br>4. Insert database | Success message | Invalid data |
| DATA-012 | Read Presensi | Data Management | High | User membuka halaman presensi | Admin/Guru/Staf | Filter parameters | 1. Query with join<br>2. Apply filters<br>3. Format data | List presensi | Database error |
| DATA-013 | Update Presensi | Data Management | High | User mengedit presensi | Admin/Guru/Staf | Presensi ID, Updated data | 1. Validate exists<br>2. Validate input<br>3. Recalculate persentase<br>4. Update database | Success message | Not found |
| DATA-014 | Delete Presensi | Data Management | High | User menghapus presensi | Admin/Guru | Presensi ID | 1. Check exists<br>2. Delete database | Success message | Not found |
| DATA-015 | Export Presensi Excel | Data Management | Medium | User mengklik export | Admin/Guru/Staf | Export parameters | 1. Query with siswa<br>2. Generate Excel<br>3. Stream download | Excel file | No data |

#### 3.2.4 Penghasilan Management Events

| Event ID | Event Name | Category | Priority | Trigger | Actor | Input | Process | Output | Exception |
|----------|------------|----------|----------|---------|-------|-------|---------|--------|-----------|
| DATA-016 | Create Penghasilan | Data Management | High | User mengisi form penghasilan | Admin/Staf | Siswa ID, Penghasilan data | 1. Validate siswa<br>2. Validate amount<br>3. Calculate total<br>4. Determine kategori<br>5. Insert database | Success message | Invalid amount |
| DATA-017 | Read Penghasilan | Data Management | High | User membuka halaman penghasilan | Admin/Staf | Filter parameters | 1. Query with join<br>2. Apply filters<br>3. Format currency | List penghasilan | Database error |
| DATA-018 | Update Penghasilan | Data Management | High | User mengedit penghasilan | Admin/Staf | Penghasilan ID, Updated data | 1. Validate exists<br>2. Validate input<br>3. Recalculate total<br>4. Update kategori<br>5. Update database | Success message | Not found |
| DATA-019 | Delete Penghasilan | Data Management | High | User menghapus penghasilan | Admin | Penghasilan ID | 1. Check exists<br>2. Delete database | Success message | Not found |
| DATA-020 | Export Penghasilan Excel | Data Management | Medium | User mengklik export | Admin/Staf | Export parameters | 1. Query with siswa<br>2. Generate Excel<br>3. Stream download | Excel file | No data |

### 3.3 MACHINE LEARNING EVENTS

| Event ID | Event Name | Category | Priority | Trigger | Actor | Input | Process | Output | Exception |
|----------|------------|----------|----------|---------|-------|-------|---------|--------|-----------|
| ML-001 | Train Model C4.5 | Machine Learning | Critical | User mengklik train model | Admin | Training dataset | 1. Prepare data<br>2. Apply C4.5 algorithm<br>3. Build tree<br>4. Validate model<br>5. Save model | Model accuracy, Decision tree | Training failed |
| ML-002 | Single Prediction | Machine Learning | High | User melakukan prediksi siswa | Admin/Guru/Staf | Siswa ID | 1. Get siswa data<br>2. Prepare features<br>3. Apply model<br>4. Generate prediction<br>5. Save history | Prediction result, Confidence | Incomplete data |
| ML-003 | Batch Prediction | Machine Learning | High | User prediksi massal | Admin/Guru/Staf | Semester, Tahun ajaran | 1. Query eligible siswa<br>2. Prepare batch features<br>3. Apply model<br>4. Generate results<br>5. Save batch history | Batch results, Summary | No eligible data |
| ML-004 | View Prediction History | Machine Learning | Medium | User membuka riwayat prediksi | Admin/Guru/Staf | Filter parameters | 1. Query history<br>2. Join with siswa<br>3. Apply filters<br>4. Format results | History list | No history |
| ML-005 | Delete Prediction History | Machine Learning | Medium | User menghapus riwayat | Admin | History ID | 1. Validate exists<br>2. Delete database | Success message | Not found |
| ML-006 | Export Prediction Excel | Machine Learning | Medium | User export prediksi | Admin/Guru/Staf | Export parameters | 1. Query history<br>2. Generate Excel<br>3. Stream download | Excel file | No data |
| ML-007 | View Decision Tree | Machine Learning | Medium | User melihat visualisasi tree | Admin/Guru/Staf | - | 1. Load model<br>2. Generate visualization<br>3. Render image | Tree image | Model not found |

### 3.4 VISUALIZATION EVENTS

| Event ID | Event Name | Category | Priority | Trigger | Actor | Input | Process | Output | Exception |
|----------|------------|----------|----------|---------|-------|-------|---------|--------|-----------|
| VIZ-001 | Load Dashboard | Visualization | High | User membuka dashboard | Admin/Guru/Staf | - | 1. Count data<br>2. Generate statistics<br>3. Create charts<br>4. Load activities | Dashboard dengan statistik | Database error |
| VIZ-002 | View Pie Chart Distribution | Visualization | Medium | User melihat distribusi prestasi | Admin/Guru/Staf | Chart parameters | 1. Query prediction data<br>2. Group by categories<br>3. Generate pie chart | Interactive pie chart | No data |
| VIZ-003 | View Bar Chart Analysis | Visualization | Medium | User melihat analisis bar chart | Admin/Guru/Staf | Chart type, Display mode | 1. Query statistics<br>2. Process by type<br>3. Generate bar chart<br>4. Apply color scheme | Interactive bar chart | No data |
| VIZ-004 | View Correlation Heatmap | Visualization | Medium | User melihat korelasi fitur | Admin/Guru/Staf | - | 1. Calculate correlation matrix<br>2. Generate heatmap<br>3. Add interactivity | Correlation heatmap | Insufficient data |
| VIZ-005 | Export Chart Image | Visualization | Low | User mengekspor chart | Admin/Guru/Staf | Chart element | 1. Capture SVG<br>2. Convert to image<br>3. Download file | Image file | Chart not rendered |
| VIZ-006 | View Confusion Matrix | Visualization | Medium | User melihat akurasi model | Admin/Guru/Staf | - | 1. Get model metrics<br>2. Generate matrix<br>3. Calculate metrics | Confusion matrix | Model not trained |

### 3.5 SYSTEM EVENTS

| Event ID | Event Name | Category | Priority | Trigger | Actor | Input | Process | Output | Exception |
|----------|------------|----------|----------|---------|-------|-------|---------|--------|-----------|
| SYS-001 | Database Backup | System | Critical | Scheduled/Manual | System/Admin | Backup parameters | 1. Lock tables<br>2. Export data<br>3. Compress file<br>4. Store backup | Backup file | Storage full |
| SYS-002 | Error Logging | System | High | System error occurs | System | Error details | 1. Capture error info<br>2. Log to file/database<br>3. Send notification | Error log entry | Logging failed |
| SYS-003 | Performance Monitoring | System | Medium | Scheduled monitoring | System | Performance metrics | 1. Collect metrics<br>2. Check thresholds<br>3. Generate alerts | Performance report | Monitoring failed |
| SYS-004 | Cache Management | System | Medium | Cache policy triggered | System | Cache keys | 1. Check expiry<br>2. Clear expired<br>3. Optimize size | Cache statistics | Cache error |
| SYS-005 | Security Audit | System | High | Scheduled/Manual audit | System/Admin | Audit parameters | 1. Review access logs<br>2. Check anomalies<br>3. Generate report | Security audit report | Log corrupted |
| SYS-006 | System Health Check | System | Medium | Scheduled check | System | Health config | 1. Check database<br>2. Verify services<br>3. Test functions | Health status report | Component failure |

### 3.6 USER MANAGEMENT EVENTS

| Event ID | Event Name | Category | Priority | Trigger | Actor | Input | Process | Output | Exception |
|----------|------------|----------|----------|---------|-------|-------|---------|--------|-----------|
| USER-001 | Create User | Data Management | High | Admin membuat user baru | Admin | User data lengkap | 1. Validate input<br>2. Check duplicate<br>3. Hash password<br>4. Insert database | Success message, User ID | Duplicate username |
| USER-002 | Read Users | Data Management | High | User membuka halaman users | Admin | Pagination parameters | 1. Query users<br>2. Apply filters<br>3. Format data | List users | Database error |
| USER-003 | Update User | Data Management | High | Admin mengedit user | Admin | User ID, Updated data | 1. Validate exists<br>2. Validate input<br>3. Update database | Success message | User not found |
| USER-004 | Delete User | Data Management | Critical | Admin menghapus user | Admin | User ID | 1. Check exists<br>2. Check if admin<br>3. Soft delete | Success message | Cannot delete admin |
| USER-005 | Reset Password | Data Management | High | Admin reset password | Admin | User ID, New password | 1. Validate exists<br>2. Hash password<br>3. Update database<br>4. Send notification | Success message | User not found |

---

## 4. EVENT FLOW PATTERNS

### 4.1 Authentication Flow
```
[User] → [Login Form] → [Credential Validation] → [JWT Generation] → [Dashboard]
   ↓                                                       ↓
[Session Management] ← [Token Refresh] ← [Token Expiry Check]
```

### 4.2 Data Management Flow
```
[User] → [CRUD Form] → [Data Validation] → [Database Operation] → [Success Response]
   ↓                                                         ↓
[Error Handling] ← [Business Logic] ← [Permission Check]
```

### 4.3 Machine Learning Flow
```
[Training Data] → [Model Training] → [Model Validation] → [Model Storage]
       ↓                                                        ↓
[Feature Engineering] → [Prediction Request] → [Model Application] → [Result Storage]
```

---

## 5. EXCEPTION HANDLING

### 5.1 Error Categories
- **Validation Error**: Input data tidak valid
- **Authentication Error**: Masalah autentikasi
- **Database Error**: Masalah database
- **Business Logic Error**: Pelanggaran aturan bisnis
- **System Error**: Error sistem
- **External Service Error**: Error layanan eksternal

### 5.2 Standard Error Response
```json
{
  "success": false,
  "error_code": "ERROR_CODE",
  "message": "User-friendly message",
  "details": "Technical details",
  "timestamp": "2025-06-19T10:00:00Z"
}
```

---

## 6. IMPLEMENTASI TEKNIS

### 6.1 Backend Implementation (FastAPI)
```python
@router.post("/api/siswa")
async def create_siswa(siswa_data: SiswaCreate, current_user: User = Depends(get_current_user)):
    """Event: Create Siswa (DATA-001)"""
    try:
        # Permission check
        if not has_permission(current_user, "create_siswa"):
            raise HTTPException(403, "Insufficient permission")
        
        # Input validation
        validate_siswa_data(siswa_data)
        
        # Business logic
        if check_duplicate_nisn(siswa_data.nisn):
            raise HTTPException(400, "NISN already exists")
        
        # Database operation
        siswa = db.create_siswa(siswa_data)
        
        # Event logging
        log_event("DATA-001", current_user.id, siswa_data.dict(), "SUCCESS")
        
        return {"success": True, "data": siswa}
        
    except Exception as e:
        log_event("DATA-001", current_user.id, siswa_data.dict(), "FAILED", str(e))
        raise
```

### 6.2 Frontend Implementation (JavaScript)
```javascript
// Event: Create Siswa (DATA-001)
async function createSiswa(siswaData) {
    try {
        showLoading();
        
        const response = await fetch('/api/siswa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(siswaData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('success', 'Data siswa berhasil disimpan');
            refreshGrid();
        } else {
            throw new Error(result.message);
        }
        
    } catch (error) {
        showNotification('error', 'Gagal menyimpan data: ' + error.message);
    } finally {
        hideLoading();
    }
}
```

---

## 7. MONITORING DAN LOGGING

### 7.1 Event Logging Standard
Setiap event mencatat:
- **Timestamp**: Waktu kejadian
- **Event ID**: Identifier event
- **Actor**: User/sistem pemicu
- **Input Parameters**: Parameter input
- **Execution Time**: Waktu eksekusi
- **Result Status**: Success/Failed
- **Error Details**: Detail error

### 7.2 Performance Metrics
- **Response Time**: Waktu respon
- **Success Rate**: Persentase keberhasilan
- **Error Rate**: Persentase error
- **Resource Usage**: CPU, memory, storage

---

## 8. TESTING FRAMEWORK

### 8.1 Test Coverage Matrix

| Event Category | Unit Test | Integration Test | E2E Test | Performance Test |
|----------------|-----------|------------------|----------|------------------|
| Authentication | ✅ | ✅ | ✅ | ✅ |
| Data Management | ✅ | ✅ | ✅ | ✅ |
| Machine Learning | ✅ | ✅ | ✅ | ✅ |
| Visualization | ✅ | ✅ | ✅ | ✅ |
| System Events | ✅ | ✅ | ❌ | ✅ |

### 8.2 Sample Test Case
```python
def test_create_siswa_event():
    """Test Event DATA-001: Create Siswa"""
    # Test precondition
    assert user_has_permission(user, "create_siswa")
    
    # Test input validation
    assert validate_siswa_data(siswa_data)
    
    # Test business logic
    assert not check_duplicate_nisn(siswa_data.nisn)
    
    # Test process
    result = create_siswa(siswa_data)
    
    # Test postcondition
    assert result.success == True
    assert siswa_exists_in_db(result.data.id)
```

---

## 9. MAINTENANCE DAN UPDATES

### 9.1 Version Control
- **Major Version**: Perubahan struktur event table
- **Minor Version**: Penambahan event baru
- **Patch Version**: Perbaikan dokumentasi

### 9.2 Review Schedule
- **Monthly**: Review performa dan error rate
- **Quarterly**: Update berdasarkan feedback
- **Annual**: Audit menyeluruh dan optimasi

### 9.3 Change Process
1. **Proposal**: Pengajuan perubahan
2. **Review**: Review dampak sistem
3. **Approval**: Persetujuan stakeholder
4. **Implementation**: Implementasi perubahan
5. **Testing**: Testing menyeluruh
6. **Documentation**: Update dokumentasi
7. **Deployment**: Deploy ke production

---

## 10. SUMMARY

### 10.1 Event Statistics
Event Table Sistem EduPro mendokumentasikan **37 event utama**:
- **Authentication Events**: 5 events
- **Data Management Events**: 20 events  
- **Machine Learning Events**: 7 events
- **Visualization Events**: 6 events
- **System Events**: 6 events
- **User Management Events**: 5 events

### 10.2 Implementation Status
- **Documentation**: ✅ Complete
- **Backend Implementation**: ✅ Complete  
- **Frontend Implementation**: ✅ Complete
- **Testing Framework**: ✅ Complete
- **Monitoring System**: ✅ Complete

### 10.3 Key Benefits
1. **Complete Documentation**: Semua alur kerja terdokumentasi
2. **Development Guide**: Acuan pengembangan fitur
3. **Testing Framework**: Basis test case komprehensif
4. **Troubleshooting**: Bantuan debugging
5. **System Understanding**: Pemahaman menyeluruh

---

**© 2025 EduPro System - Event Table Documentation**
**Status: Production Ready | Version: 1.0 | Last Update: 19 Juni 2025** 