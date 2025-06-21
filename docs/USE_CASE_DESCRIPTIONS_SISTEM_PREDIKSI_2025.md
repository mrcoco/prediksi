# Use Case Descriptions Sistem Prediksi EduPro 2025

## Executive Summary

Dokumen ini menyajikan **use case descriptions** yang komprehensif untuk sistem prediksi prestasi siswa dalam aplikasi EduPro. Dokumentasi ini mencakup **20+ use cases** yang diorganisir dalam **6 kategori utama** untuk mendukung prediksi prestasi siswa menggunakan algoritma C4.5 Decision Tree.

## Tujuan Dokumentasi

1. **Functional Requirements** - Mendefinisikan semua fungsi sistem prediksi
2. **Actor Interactions** - Menjelaskan interaksi antara actors dan sistem
3. **Business Rules** - Mendokumentasikan aturan bisnis yang berlaku
4. **Success Criteria** - Menetapkan kriteria keberhasilan setiap use case
5. **Error Handling** - Menjelaskan penanganan error dan exception scenarios

## System Actors

### Primary Actors
1. **Admin** - Administrator sistem dengan akses penuh
2. **Guru** - Tenaga pengajar dengan akses terbatas
3. **Staf** - Staff administrasi dengan akses data entry
4. **Siswa** - Siswa dengan akses view-only (future)

### Secondary Actors
1. **ML Engine** - Machine learning processing engine
2. **Database System** - Sistem database PostgreSQL
3. **Notification System** - Sistem notifikasi dan alerting
4. **External API** - API eksternal untuk integrasi

## Use Case Categories

### 1. Authentication & Authorization (UC-AUTH)
### 2. Data Management (UC-DATA)
### 3. Prediction Operations (UC-PRED)
### 4. Model Management (UC-MODEL)
### 5. Analytics & Reporting (UC-ANALYTICS)
### 6. System Administration (UC-ADMIN)

---

## 1. AUTHENTICATION & AUTHORIZATION USE CASES

### UC-AUTH-001: User Login
**Actor**: Admin, Guru, Staf  
**Precondition**: User memiliki akun yang valid  
**Trigger**: User mengakses halaman login  

**Main Flow**:
1. User memasukkan username dan password
2. Sistem memvalidasi kredensial
3. Sistem menggenerate JWT token
4. Sistem mengarahkan user ke dashboard sesuai role
5. Sistem mencatat aktivitas login

**Alternative Flow**:
- 2a. Kredensial tidak valid → Tampilkan error message
- 2b. Akun terkunci → Tampilkan pesan akun terkunci
- 2c. Password expired → Arahkan ke halaman reset password

**Postcondition**: User berhasil login dan mendapat akses sesuai role  
**Business Rules**:
- Maximum 3 failed login attempts
- Session timeout 120 menit
- Password harus memenuhi complexity requirements

### UC-AUTH-002: Token Validation
**Actor**: System  
**Precondition**: User sudah login  
**Trigger**: Setiap request ke protected endpoint  

**Main Flow**:
1. Sistem menerima request dengan JWT token
2. Sistem memvalidasi token signature
3. Sistem mengecek token expiry
4. Sistem memverifikasi user permissions
5. Sistem mengizinkan akses ke resource

**Alternative Flow**:
- 2a. Token invalid → Return 401 Unauthorized
- 3a. Token expired → Return 401 dengan refresh instruction
- 4a. Insufficient permissions → Return 403 Forbidden

**Postcondition**: Request diproses atau ditolak dengan error yang sesuai

### UC-AUTH-003: Role-Based Access Control
**Actor**: Admin, Guru, Staf  
**Precondition**: User sudah terautentikasi  
**Trigger**: User mengakses fitur tertentu  

**Main Flow**:
1. Sistem mengidentifikasi user role
2. Sistem mengecek permissions untuk fitur yang diakses
3. Sistem memberikan akses sesuai role permissions
4. Sistem mencatat aktivitas akses

**Role Permissions**:
- **Admin**: Full access (CRUD semua data, model training, system admin)
- **Guru**: Read/Write student data, view predictions, basic analytics
- **Staf**: Data entry only, view basic reports

**Alternative Flow**:
- 2a. Insufficient permissions → Tampilkan access denied message

**Postcondition**: User mendapat akses sesuai role atau ditolak

---

## 2. DATA MANAGEMENT USE CASES

### UC-DATA-001: Input Data Siswa
**Actor**: Admin, Guru, Staf  
**Precondition**: User memiliki permission untuk input data  
**Trigger**: User memilih menu input data siswa  

**Main Flow**:
1. User mengisi form data siswa (nama, NIS, jenis kelamin, dll)
2. Sistem memvalidasi format dan kelengkapan data
3. Sistem mengecek duplikasi NIS
4. Sistem menyimpan data siswa ke database
5. Sistem menampilkan konfirmasi berhasil

**Data Fields**:
- Nama lengkap, NIS, jenis kelamin, agama
- Status keluarga, jumlah saudara, anak ke-
- Alamat, no telp, sekolah asal
- Status beasiswa, tahun masuk, tanggal lahir

**Alternative Flow**:
- 2a. Data tidak valid → Tampilkan error validation
- 3a. NIS sudah ada → Tampilkan error duplikasi
- 4a. Database error → Tampilkan error simpan data

**Postcondition**: Data siswa tersimpan di database  
**Business Rules**:
- NIS harus unik
- Semua field mandatory harus diisi
- Format tanggal harus valid

### UC-DATA-002: Input Nilai Akademik
**Actor**: Admin, Guru, Staf  
**Precondition**: Data siswa sudah ada  
**Trigger**: User memilih menu input nilai  

**Main Flow**:
1. User memilih siswa dari dropdown
2. User mengisi nilai mata pelajaran (MTK, B.IND, B.ING, IPA, dll)
3. User memilih semester dan tahun ajaran
4. Sistem menghitung rata-rata nilai otomatis
5. Sistem menyimpan data nilai ke database

**Validation Rules**:
- Nilai harus dalam range 0-100
- Semua mata pelajaran harus diisi
- Tidak boleh duplikasi siswa-semester-tahun

**Alternative Flow**:
- 2a. Nilai di luar range → Error validation
- 4a. Siswa tidak ditemukan → Error siswa tidak valid
- 5a. Duplikasi data → Error data sudah ada

**Postcondition**: Data nilai tersimpan dan rata-rata terhitung

### UC-DATA-003: Input Data Kehadiran
**Actor**: Admin, Guru, Staf  
**Precondition**: Data siswa sudah ada  
**Trigger**: User memilih menu input presensi  

**Main Flow**:
1. User memilih siswa dari dropdown
2. User mengisi jumlah hari hadir, sakit, izin, alpha
3. User memilih semester dan tahun ajaran
4. Sistem menghitung persentase kehadiran otomatis
5. Sistem menentukan kategori kehadiran (Baik/Cukup/Kurang)

**Calculation Rules**:
- Persentase = (hadir / total_hari) * 100
- Kategori: Baik (≥80%), Cukup (60-79%), Kurang (<60%)

**Alternative Flow**:
- 2a. Total hari tidak valid → Error validation
- 4a. Perhitungan error → Error sistem

**Postcondition**: Data kehadiran tersimpan dengan kategori yang tepat


### UC-DATA-004: Input Data Penghasilan Orang Tua
**Actor**: Admin, Guru, Staf  
**Precondition**: Data siswa sudah ada  
**Trigger**: User memilih menu input penghasilan  

**Main Flow**:
1. User memilih siswa dari dropdown
2. User mengisi penghasilan ayah dan ibu
3. User mengisi pekerjaan dan pendidikan orang tua
4. Sistem menghitung total penghasilan
5. Sistem menentukan kategori penghasilan (Tinggi/Sedang/Rendah)

**Categorization Rules**:
- Tinggi: > Rp 5,000,000
- Sedang: Rp 2,000,000 - Rp 5,000,000
- Rendah: < Rp 2,000,000

**Alternative Flow**:
- 2a. Format penghasilan tidak valid → Error validation
- 4a. Perhitungan error → Error sistem

**Postcondition**: Data penghasilan tersimpan dengan kategori yang tepat

### UC-DATA-005: Validasi Kelengkapan Data
**Actor**: System  
**Precondition**: Data siswa tersedia  
**Trigger**: Request prediksi atau validasi manual  

**Main Flow**:
1. Sistem mengecek keberadaan data siswa
2. Sistem mengecek keberadaan data nilai
3. Sistem mengecek keberadaan data kehadiran
4. Sistem mengecek keberadaan data penghasilan
5. Sistem menghitung skor kelengkapan data (0-100%)

**Completeness Scoring**:
- Data siswa: 25%
- Data nilai: 25%
- Data kehadiran: 25%
- Data penghasilan: 25%

**Alternative Flow**:
- 2a-4a. Data tidak lengkap → Catat data yang missing

**Postcondition**: Skor kelengkapan data tersedia

---

## 3. PREDICTION OPERATIONS USE CASES

### UC-PRED-001: Prediksi Prestasi Individual
**Actor**: Admin, Guru  
**Precondition**: Data siswa lengkap, model ML tersedia  
**Trigger**: User memilih menu prediksi individual  

**Main Flow**:
1. User memilih siswa dari dropdown
2. Sistem memvalidasi kelengkapan data siswa
3. Sistem mengekstrak fitur dari data siswa
4. Sistem melakukan normalisasi fitur
5. Sistem menjalankan model prediksi C4.5
6. Sistem menghasilkan prediksi dengan confidence score
7. Sistem menampilkan hasil prediksi dan penjelasan

**Feature Extraction**:
- Academic average (rata-rata nilai)
- Attendance rate (persentase kehadiran)
- Income score (skor penghasilan)
- Socioeconomic factors (faktor sosial ekonomi)

**Prediction Output**:
- Prediksi: TINGGI/SEDANG/RENDAH
- Confidence: 0-100%
- Feature importance
- Decision path explanation
- Recommendations

**Alternative Flow**:
- 2a. Data tidak lengkap → Tampilkan missing data warning
- 3a. Feature extraction error → Error processing
- 5a. Model error → Error prediksi
- 6a. Low confidence → Warning low confidence

**Postcondition**: Hasil prediksi tersimpan dan ditampilkan  
**Business Rules**:
- Minimum data completeness: 80%
- Confidence threshold untuk warning: 70%

### UC-PRED-002: Prediksi Prestasi Batch
**Actor**: Admin, Guru  
**Precondition**: Multiple students data tersedia, model ML tersedia  
**Trigger**: User memilih menu prediksi batch  

**Main Flow**:
1. User memilih semester dan tahun ajaran
2. Sistem mengidentifikasi siswa yang eligible untuk prediksi
3. Sistem memproses prediksi untuk setiap siswa secara batch
4. Sistem mengumpulkan hasil prediksi
5. Sistem menampilkan summary dan detail results
6. Sistem menyediakan opsi export ke Excel

**Batch Processing**:
- Process max 100 siswa per batch
- Parallel processing untuk performance
- Progress indicator untuk user feedback

**Summary Output**:
- Total siswa diproses
- Jumlah prediksi per kategori
- Success rate
- Average confidence score

**Alternative Flow**:
- 2a. Tidak ada siswa eligible → Pesan tidak ada data
- 3a. Batch processing error → Error dengan detail
- 5a. Partial failure → Tampilkan yang berhasil dan gagal

**Postcondition**: Batch prediction results tersimpan dan dapat diexport

### UC-PRED-003: View Riwayat Prediksi
**Actor**: Admin, Guru  
**Precondition**: Prediksi pernah dilakukan  
**Trigger**: User memilih menu riwayat prediksi  

**Main Flow**:
1. User mengakses halaman riwayat prediksi
2. Sistem menampilkan list prediksi dengan pagination
3. User dapat filter berdasarkan tanggal, siswa, atau hasil
4. User dapat view detail prediksi
5. User dapat export riwayat ke Excel

**Display Information**:
- Tanggal prediksi
- Nama siswa
- Hasil prediksi
- Confidence score
- Model version yang digunakan

**Filter Options**:
- Date range
- Student name
- Prediction result
- Confidence level

**Alternative Flow**:
- 2a. Tidak ada riwayat → Tampilkan pesan kosong
- 4a. Detail tidak ditemukan → Error not found

**Postcondition**: User dapat melihat dan menganalisis riwayat prediksi

### UC-PRED-004: Explanation Generation
**Actor**: System  
**Precondition**: Prediksi telah dilakukan  
**Trigger**: Request untuk explanation  

**Main Flow**:
1. Sistem menganalisis decision path dari pohon keputusan
2. Sistem mengidentifikasi fitur yang paling berpengaruh
3. Sistem menggenerate penjelasan dalam bahasa natural
4. Sistem membuat rekomendasi berdasarkan hasil
5. Sistem menampilkan explanation yang user-friendly

**Explanation Components**:
- Decision path visualization
- Feature importance ranking
- Natural language explanation
- Actionable recommendations

**Sample Explanation**:
"Prediksi TINGGI dengan confidence 85%. Faktor utama: Nilai akademik tinggi (rata-rata 87), kehadiran baik (92%), dan dukungan ekonomi keluarga memadai."

**Postcondition**: Explanation tersedia untuk user


---

## 4. MODEL MANAGEMENT USE CASES

### UC-MODEL-001: Training Model Baru
**Actor**: Admin  
**Precondition**: Data training sufficient (min 30 siswa)  
**Trigger**: Admin memilih menu training model  

**Main Flow**:
1. Admin mengkonfigurasi parameter training
2. Sistem mengumpulkan data training dari database
3. Sistem memproses feature engineering
4. Sistem melakukan data preprocessing (cleaning, normalization)
5. Sistem menjalankan algoritma C4.5 untuk build decision tree
6. Sistem mengevaluasi model dengan cross-validation
7. Sistem menyimpan model jika akurasi memenuhi threshold

**Training Parameters**:
- Max depth pohon keputusan
- Min samples per leaf
- Cross-validation folds
- Train-test split ratio

**Evaluation Metrics**:
- Accuracy (target: >85%)
- Precision, Recall, F1-Score
- Confusion Matrix
- Feature Importance

**Alternative Flow**:
- 2a. Data insufficient → Error data tidak cukup
- 6a. Model accuracy rendah → Warning low accuracy
- 7a. Model gagal save → Error simpan model

**Postcondition**: Model baru tersimpan dan siap digunakan  
**Business Rules**:
- Minimum accuracy threshold: 80%
- Minimum training data: 30 siswa
- Maximum training time: 10 menit

### UC-MODEL-002: Model Evaluation
**Actor**: Admin  
**Precondition**: Model tersedia untuk evaluasi  
**Trigger**: Admin memilih menu evaluasi model  

**Main Flow**:
1. Admin memilih model yang akan dievaluasi
2. Sistem mengumpulkan test data
3. Sistem menjalankan prediksi pada test data
4. Sistem menghitung metrics evaluasi
5. Sistem menggenerate confusion matrix
6. Sistem menampilkan hasil evaluasi

**Evaluation Output**:
- Accuracy, Precision, Recall, F1-Score
- Confusion Matrix visualization
- ROC Curve (jika applicable)
- Feature Importance chart
- Model comparison dengan versi sebelumnya

**Alternative Flow**:
- 2a. Test data tidak ada → Error no test data
- 4a. Evaluation error → Error dalam perhitungan

**Postcondition**: Hasil evaluasi tersedia untuk analisis

### UC-MODEL-003: Model Versioning
**Actor**: System  
**Precondition**: Model baru berhasil di-training  
**Trigger**: Model training completion  

**Main Flow**:
1. Sistem menggenerate version number untuk model baru
2. Sistem menyimpan model dengan metadata lengkap
3. Sistem membandingkan dengan model aktif saat ini
4. Sistem menentukan apakah model baru layak jadi aktif
5. Sistem mengupdate status model (active/archived)

**Version Naming**: `v{YYYY}.{MM}.{DD}.{sequence}`  
**Metadata**:
- Training date
- Data size
- Accuracy metrics
- Parameters used
- Training duration

**Auto-activation Rules**:
- Accuracy improvement >2%
- All metrics better than current
- Admin approval required

**Postcondition**: Model baru tersimpan dengan versioning yang tepat

### UC-MODEL-004: Model Deployment
**Actor**: Admin  
**Precondition**: Model telah di-training dan dievaluasi  
**Trigger**: Admin mengaktifkan model baru  

**Main Flow**:
1. Admin memilih model yang akan diaktifkan
2. Sistem memvalidasi model integrity
3. Sistem melakukan backup model aktif saat ini
4. Sistem mengaktifkan model baru
5. Sistem mengupdate konfigurasi aplikasi
6. Sistem melakukan smoke test dengan sample data

**Validation Checks**:
- Model file integrity
- Required dependencies
- Performance benchmarks
- Security validation

**Alternative Flow**:
- 2a. Model corrupt → Error model tidak valid
- 6a. Smoke test gagal → Rollback ke model sebelumnya

**Postcondition**: Model baru aktif dan siap untuk prediksi

---

## 5. ANALYTICS & REPORTING USE CASES

### UC-ANALYTICS-001: Dashboard Statistik
**Actor**: Admin, Guru  
**Precondition**: Data prediksi tersedia  
**Trigger**: User mengakses dashboard analytics  

**Main Flow**:
1. Sistem mengumpulkan data statistik terbaru
2. Sistem menghitung distribusi prediksi
3. Sistem menggenerate visualisasi charts
4. Sistem menampilkan key performance indicators
5. Sistem menyediakan filter dan drill-down options

**Dashboard Components**:
- Pie chart distribusi prediksi (Tinggi/Sedang/Rendah)
- Bar chart trend prediksi per bulan
- Heatmap korelasi fitur
- Summary statistics
- Recent predictions list

**KPIs**:
- Total prediksi bulan ini
- Accuracy rate model aktif
- Average confidence score
- Data completeness rate

**Alternative Flow**:
- 1a. Data tidak tersedia → Tampilkan dashboard kosong
- 3a. Chart generation error → Tampilkan error message

**Postcondition**: Dashboard analytics ditampilkan dengan data terkini

### UC-ANALYTICS-002: Feature Importance Analysis
**Actor**: Admin, Guru  
**Precondition**: Model telah di-training  
**Trigger**: User memilih menu feature analysis  

**Main Flow**:
1. Sistem mengambil feature importance dari model aktif
2. Sistem menghitung korelasi antar fitur
3. Sistem menggenerate visualisasi feature importance
4. Sistem menampilkan interpretasi business insights
5. Sistem menyediakan recommendations untuk improvement

**Analysis Output**:
- Feature importance ranking
- Correlation heatmap
- Business interpretation
- Actionable insights
- Data quality recommendations

**Sample Insights**:
- "Nilai akademik memiliki pengaruh tertinggi (35%)"
- "Kehadiran dan penghasilan berkorelasi positif"
- "Perlu fokus pada improvement data kehadiran"

**Postcondition**: Feature analysis tersedia untuk decision making

### UC-ANALYTICS-003: Trend Analysis
**Actor**: Admin, Guru  
**Precondition**: Historical prediction data tersedia  
**Trigger**: User memilih menu trend analysis  

**Main Flow**:
1. User memilih periode analisis (bulan/semester/tahun)
2. Sistem mengumpulkan data historis
3. Sistem menghitung trend perubahan prediksi
4. Sistem mengidentifikasi pattern dan anomali
5. Sistem menggenerate trend visualization dan insights

**Trend Metrics**:
- Perubahan distribusi prediksi over time
- Seasonal patterns
- Model performance trend
- Data quality trend

**Visualization**:
- Line charts untuk trend
- Seasonal decomposition
- Anomaly detection highlights
- Comparative analysis

**Postcondition**: Trend analysis insights tersedia

### UC-ANALYTICS-004: Export Reports
**Actor**: Admin, Guru  
**Precondition**: Data analytics tersedia  
**Trigger**: User memilih export report  

**Main Flow**:
1. User memilih jenis report yang akan diexport
2. User mengkonfigurasi parameter export (format, periode)
3. Sistem menggenerate report sesuai template
4. Sistem mengcompile data dan visualizations
5. Sistem menggenerate file download

**Report Types**:
- Executive Summary Report
- Detailed Prediction Report
- Model Performance Report
- Student Analysis Report

**Export Formats**:
- PDF untuk presentation
- Excel untuk data analysis
- CSV untuk raw data

**Alternative Flow**:
- 3a. Report generation error → Error message
- 5a. File generation gagal → Error export

**Postcondition**: Report file tersedia untuk download

