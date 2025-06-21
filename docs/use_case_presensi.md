# Use Case Diagram Manajemen Presensi Siswa - Sistem EduPro

## Executive Summary

Dokumen ini berisi use case diagram untuk modul manajemen presensi siswa dalam aplikasi EduPro. Diagram menggambarkan semua fitur dan fungsionalitas yang tersedia untuk pengelolaan data kehadiran siswa, termasuk operasi CRUD lengkap, business logic calculation untuk persentase kehadiran, kategorisasi otomatis, dan sistem validasi yang komprehensif.

## Daftar Isi

1. [Overview Sistem](#overview-sistem)
2. [Actors](#actors)
3. [Use Cases](#use-cases)
4. [Relationships](#relationships)
5. [Business Rules](#business-rules)
6. [Kesimpulan](#kesimpulan)

## Overview Sistem

Sistem manajemen presensi siswa adalah modul vital dalam aplikasi EduPro yang menyediakan fungsionalitas lengkap untuk mengelola data kehadiran siswa. Sistem ini mencakup:

### 📅 **Fitur Utama:**
- **CRUD Operations**: Create, Read, Update, Delete data presensi
- **Business Logic**: Auto-calculation persentase kehadiran dan kategorisasi
- **Search & Filter**: Pencarian dan filtering data presensi
- **Data Management**: Export Excel, counting, dropdown integration
- **Validation**: Validasi siswa, semester, data integrity, duplicate prevention
- **Authentication**: Login, authorization, token validation
- **Notification**: Success, error, dan info notifications

### 👥 **Target Users:**
- **Guru**: Mengelola data presensi siswa di kelas mereka
- **Admin**: Mengelola semua data presensi siswa di sekolah
- **Staff TU**: Input dan maintenance data presensi

### 🔒 **Security Features:**
- Bearer JWT Token authentication
- Role-based access control
- Data validation dan sanitization
- Audit trail dengan timestamps

### 📊 **Business Logic Features:**
- Auto-calculation persentase kehadiran
- Kategorisasi otomatis (Tinggi/Sedang/Rendah)
- Validasi total hari kehadiran
- Duplicate prevention per siswa per semester

## Actors

### 1. 👤 User (Guru/Admin)
**Deskripsi**: Pengguna utama sistem yang memiliki akses untuk mengelola data presensi siswa

**Responsibilities**:
- Mengelola data presensi siswa (CRUD operations)
- Melakukan pencarian dan filtering data
- Export data ke Excel untuk reporting
- Melihat statistik dan informasi kehadiran

**Permissions**:
- **Guru**: Akses terbatas pada data presensi siswa di kelas mereka
- **Admin**: Akses penuh ke semua data presensi siswa

### 2. 🔐 Authentication System
**Deskripsi**: Sistem autentikasi yang menangani login, authorization, dan token validation

**Responsibilities**:
- Memproses login dan logout
- Validasi credentials pengguna
- Generate dan validate JWT tokens
- Manage user sessions

## Use Cases

### 🔄 CRUD Operations

#### UC1: ➕ Tambah Data Presensi (Create)
**Deskripsi**: Menambahkan data presensi siswa baru ke dalam sistem

**Main Flow**:
1. User mengakses form tambah presensi
2. User memilih siswa dari dropdown
3. User mengisi semester dan tahun ajaran
4. User mengisi data kehadiran (hadir, sakit, izin, alpa)
5. Sistem melakukan validasi data
6. Sistem mengecek duplikasi data per siswa per semester
7. Sistem menghitung total hari otomatis
8. Sistem menghitung persentase kehadiran otomatis
9. Sistem menentukan kategori kehadiran berdasarkan business rules
10. Sistem menyimpan data ke database
11. Sistem menampilkan notifikasi sukses

**Business Rules**:
- Satu siswa hanya boleh memiliki satu data presensi per semester per tahun ajaran
- Semua field kehadiran harus berupa angka positif
- Total hari dihitung otomatis (hadir + sakit + izin + alpa)
- Persentase kehadiran dihitung otomatis ((hadir/total_hari) × 100)
- Kategori ditentukan otomatis berdasarkan persentase

**Field Requirements**:
- **siswa_id**: Required, must exist in siswa table
- **semester**: Required, string (Ganjil/Genap)
- **tahun_ajaran**: Required, string format (YYYY/YYYY)
- **jumlah_hadir**: Required, integer, >= 0
- **jumlah_sakit**: Required, integer, >= 0
- **jumlah_izin**: Required, integer, >= 0
- **jumlah_alpa**: Required, integer, >= 0

#### UC2: 📋 Lihat Daftar Presensi (Read All)
**Deskripsi**: Menampilkan daftar semua data presensi dengan fitur pagination dan search

**Features**:
- **JOIN Query**: Data ditampilkan dengan nama siswa
- **Pagination**: 10 data per halaman (configurable)
- **Search**: Berdasarkan nama siswa, semester, atau kategori kehadiran
- **Sorting**: Semua kolom dapat diurutkan
- **Percentage Formatting**: Format persentase kehadiran

**Data Displayed**:
- Nama Siswa (dari JOIN dengan tabel siswa)
- Semester dan Tahun Ajaran
- Jumlah Hadir, Sakit, Izin, Alpa
- Persentase Kehadiran (formatted as percentage)
- Kategori Kehadiran (Tinggi/Sedang/Rendah dengan badge styling)
- Created/Updated timestamps

#### UC3: 👤 Lihat Detail Presensi (Read Single)
**Deskripsi**: Menampilkan detail lengkap data presensi tertentu

**Data Displayed**:
- Semua field presensi dengan format yang proper
- Informasi siswa terkait
- Breakdown kehadiran per kategori
- Timestamps (created_at, updated_at)
- History perubahan data

#### UC4: ✏️ Edit Data Presensi (Update)
**Deskripsi**: Mengubah data presensi siswa yang sudah ada

**Main Flow**:
1. User memilih data presensi yang akan diedit
2. Sistem menampilkan form edit dengan data existing
3. User mengubah data kehadiran yang diperlukan
4. Sistem melakukan real-time calculation di frontend
5. Sistem melakukan validasi data
6. Sistem recalculate total hari jika ada perubahan
7. Sistem recalculate persentase kehadiran
8. Sistem redetermine kategori kehadiran
9. Sistem menyimpan perubahan ke database
10. Sistem update timestamp updated_at
11. Sistem menampilkan notifikasi sukses

**Auto-Recalculation**:
- Total hari dihitung ulang jika ada perubahan kehadiran
- Persentase kehadiran dihitung ulang berdasarkan total baru
- Kategori kehadiran ditentukan ulang berdasarkan persentase baru
- Update timestamp otomatis

#### UC5: 🗑️ Hapus Data Presensi (Delete)
**Deskripsi**: Menghapus data presensi dari sistem

**Main Flow**:
1. User memilih data presensi yang akan dihapus
2. Sistem menampilkan konfirmasi penghapusan dengan detail data
3. User mengkonfirmasi penghapusan
4. Sistem menghapus data dari database
5. Sistem menampilkan notifikasi sukses

**⚠️ Warning**:
- Data yang dihapus tidak dapat dikembalikan
- Pastikan data tidak digunakan untuk prediksi prestasi

### 🔍 Search & Filter Operations

#### UC6: 🔎 Cari Presensi (Search)
**Deskripsi**: Mencari data presensi berdasarkan kriteria tertentu

**Search Criteria**:
- **Nama Siswa**: Pencarian partial match (LIKE)
- **Semester**: Exact match (Ganjil/Genap)
- **Tahun Ajaran**: Exact match (YYYY/YYYY)
- **Kategori Kehadiran**: Exact match (Tinggi/Sedang/Rendah)

**Features**:
- Case-insensitive search
- Real-time search (search as you type)
- Multiple field search (OR logic)
- Clear search functionality

#### UC7: 📊 Filter Presensi (Filter)
**Deskripsi**: Memfilter data presensi berdasarkan kriteria spesifik

**Filter Options**:
- **Semester**: Ganjil/Genap
- **Tahun Ajaran**: Dropdown tahun ajaran yang tersedia
- **Kategori Kehadiran**: Tinggi/Sedang/Rendah
- **Range Persentase**: Custom range input (0-100%)

#### UC8: 📄 Pagination (Paging)
**Deskripsi**: Navigasi halaman untuk data presensi yang banyak

**Features**:
- Configurable page size (10, 25, 50, 100)
- First, Previous, Next, Last navigation
- Page number display
- Total records indicator

### 📁 Data Management Operations

#### UC9: 📥 Export Excel (Export)
**Deskripsi**: Export data presensi ke file Excel

**Excel Output Features**:
- **Filename**: Data_Presensi.xlsx
- **Sheet Name**: Data Presensi
- **Columns**: Semua field dengan nama siswa
- **Formatting**: Percentage formatting, proper column width

**Data Included**:
- ID, Siswa ID, Nama Siswa
- Semester, Tahun Ajaran
- Jumlah Hadir, Sakit, Izin, Alpa
- Persentase Kehadiran, Kategori Kehadiran
- Created At, Updated At

#### UC10: 🔢 Hitung Total Data (Count)
**Deskripsi**: Menampilkan jumlah total data presensi dalam sistem

**Features**:
- Real-time count
- Filter-aware count (count berdasarkan filter aktif)
- Statistics breakdown per kategori kehadiran

#### UC11: 📝 Dropdown Siswa (Dropdown)
**Deskripsi**: Menyediakan daftar siswa untuk dropdown/select option

**Usage**:
- Form input presensi baru
- Form edit presensi
- Filter berdasarkan siswa
- Integration dengan modul lain

### 📊 Business Logic Operations

#### UC12: 🧮 Hitung Persentase Kehadiran (Calculate Percentage)
**Deskripsi**: Menghitung persentase kehadiran otomatis

**Calculation Logic**:
```
total_hari = jumlah_hadir + jumlah_sakit + jumlah_izin + jumlah_alpa
persentase_kehadiran = (jumlah_hadir / total_hari) × 100
```

**Features**:
- Auto-calculation saat input/update
- Real-time calculation di frontend
- Server-side validation untuk consistency
- Handle edge case (total_hari = 0)

#### UC13: 📈 Tentukan Kategori Kehadiran (Categorize Attendance)
**Deskripsi**: Menentukan kategori kehadiran berdasarkan business rules

**Categorization Rules**:
```
IF persentase_kehadiran >= 80 THEN "Tinggi"    // Good attendance
ELIF persentase_kehadiran >= 75 THEN "Sedang"  // Average attendance
ELSE "Rendah"                                   // Poor attendance
```

**Features**:
- Auto-categorization saat input/update
- Business rules dapat dikonfigurasi
- Consistent categorization across system

#### UC14: 📋 Validasi Total Hari (Validate Total Days)
**Deskripsi**: Validasi total hari kehadiran untuk memastikan data konsisten

**Validation Rules**:
- Total hari harus > 0 untuk perhitungan persentase
- Semua komponen kehadiran harus >= 0
- Total hari reasonable (tidak terlalu besar untuk satu semester)

#### UC15: 📅 Format Periode (Format Period)
**Deskripsi**: Format periode semester dan tahun ajaran untuk tampilan

**Formatting Rules**:
- Semester: "Ganjil" atau "Genap"
- Tahun Ajaran: "YYYY/YYYY" format
- Display: "Semester Ganjil 2024/2025"

### ✅ Validation Operations

#### UC16: 🆔 Validasi Siswa (Student Validation)
**Deskripsi**: Memastikan siswa yang dipilih valid dan ada di database

**Validation Rules**:
- siswa_id harus ada di tabel siswa
- Siswa harus aktif (jika ada status)
- Foreign key constraint validation

#### UC17: 📋 Validasi Data (Data Validation)
**Deskripsi**: Validasi semua data presensi sebelum disimpan

**Validation Rules**:
- **jumlah_hadir**: Required, integer, >= 0, max 365
- **jumlah_sakit**: Required, integer, >= 0, max 365
- **jumlah_izin**: Required, integer, >= 0, max 365
- **jumlah_alpa**: Required, integer, >= 0, max 365
- **semester**: Required, enum ("Ganjil", "Genap")
- **tahun_ajaran**: Required, format "YYYY/YYYY"

#### UC18: 🔍 Cek Duplikasi (Duplicate Check)
**Deskripsi**: Mengecek duplikasi data presensi per siswa per semester

**Check Points**:
- Satu siswa hanya boleh memiliki satu data presensi per semester per tahun ajaran
- Duplicate check saat create
- Skip duplicate check saat update (same siswa_id, semester, tahun_ajaran)

#### UC19: 📊 Validasi Semester (Semester Validation)
**Deskripsi**: Validasi format semester dan tahun ajaran

**Validation Rules**:
- Semester harus "Ganjil" atau "Genap"
- Tahun ajaran harus format "YYYY/YYYY"
- Tahun kedua harus lebih besar 1 dari tahun pertama
- Tahun tidak boleh di masa depan yang terlalu jauh

### 🔐 Authentication Operations

#### UC20: 🔑 Login (Authentication)
**Main Flow**:
1. User memasukkan username/email dan password
2. Sistem validasi credentials
3. Sistem generate JWT token
4. Sistem redirect ke dashboard

#### UC21: 🛡️ Autorisasi (Authorization)
**Role-based Access**:
- **Admin**: Full access ke semua data presensi
- **Guru**: Limited access berdasarkan kelas yang diajar
- **Staff**: Read-only access

#### UC22: 🔒 Validasi Token (Token Validation)
**Process**:
- Extract token dari Authorization header
- Validate token signature dan expiry
- Extract user information dari token
- Check user permissions

### 🔔 Notification Operations

#### UC23: ✅ Notifikasi Sukses (Success Notification)
**Examples**:
- "Data presensi berhasil ditambahkan"
- "Data presensi berhasil diupdate"
- "Data presensi berhasil dihapus"
- "File Excel berhasil diunduh"

#### UC24: ❌ Notifikasi Error (Error Notification)
**Examples**:
- "Presensi untuk semester ini sudah ada"
- "Siswa tidak ditemukan"
- "Data tidak valid"
- "Gagal menyimpan data"

#### UC25: ℹ️ Notifikasi Info (Info Notification)
**Examples**:
- "Data sedang diproses..."
- "File sedang didownload..."
- "Persentase kehadiran dihitung otomatis"

## Relationships

### Include Relationships (<<include>>)
**UC1 (Create Presensi)** includes:
- UC16 (Validasi Siswa)
- UC17 (Validasi Data)
- UC18 (Cek Duplikasi)
- UC19 (Validasi Semester)
- UC12 (Hitung Persentase Kehadiran)
- UC13 (Tentukan Kategori Kehadiran)
- UC14 (Validasi Total Hari)
- UC22 (Validasi Token)

**UC2 (Read All Presensi)** includes:
- UC22 (Validasi Token)
- UC6 (Search) - optional
- UC7 (Filter) - optional
- UC8 (Pagination)
- UC15 (Format Periode)

**UC4 (Update Presensi)** includes:
- UC22 (Validasi Token)
- UC16 (Validasi Siswa)
- UC17 (Validasi Data)
- UC12 (Hitung Persentase Kehadiran)
- UC13 (Tentukan Kategori Kehadiran)
- UC14 (Validasi Total Hari)

### Extend Relationships (<<extend>>)
- Semua CRUD operations dapat extend ke UC23 (Success) atau UC24 (Error)
- Validation use cases dapat extend ke UC24 (Error)
- Business logic operations dapat extend ke UC25 (Info)

## Business Rules

### 1. Data Integrity Rules

#### Attendance Fields
- **jumlah_hadir**: Required, integer, >= 0, max 365
- **jumlah_sakit**: Required, integer, >= 0, max 365
- **jumlah_izin**: Required, integer, >= 0, max 365
- **jumlah_alpa**: Required, integer, >= 0, max 365
- **total_hari**: Auto-calculated, sum of all attendance types
- **persentase_kehadiran**: Auto-calculated, (hadir/total_hari) × 100
- **kategori_kehadiran**: Auto-determined based on percentage

#### Period Information
- **semester**: Required, enum ("Ganjil", "Genap")
- **tahun_ajaran**: Required, format "YYYY/YYYY"

#### Relational Integrity
- **siswa_id**: Required, must exist in siswa table
- **Unique Constraint**: (siswa_id, semester, tahun_ajaran) must be unique

### 2. Business Logic Rules

#### Persentase Kehadiran Calculation
```
total_hari = jumlah_hadir + jumlah_sakit + jumlah_izin + jumlah_alpa
persentase_kehadiran = (jumlah_hadir / total_hari) × 100
```

#### Kategori Kehadiran Rules
```
IF persentase_kehadiran >= 80 THEN "Tinggi"    // Excellent attendance
ELIF persentase_kehadiran >= 75 THEN "Sedang"  // Good attendance
ELSE "Rendah"                                   // Poor attendance
```

#### Auto-Recalculation Rules
- Persentase dan kategori dihitung ulang setiap kali ada perubahan attendance
- Calculation terjadi di backend untuk consistency
- Frontend dapat melakukan preview calculation

### 3. Security Rules

#### Authentication
- Semua operasi memerlukan valid JWT token
- Token harus di-refresh sebelum expired
- Failed login attempts dibatasi (rate limiting)

#### Authorization
- **Admin**: Full access ke semua data presensi
- **Guru**: Hanya akses ke data presensi siswa di kelas yang diajar
- **Staff**: Read-only access

#### Data Protection
- Input sanitization untuk mencegah XSS
- SQL injection prevention dengan parameterized queries
- Attendance data tidak di-log untuk privacy

### 4. Performance Rules

#### Database Optimization
- Proper indexing pada siswa_id untuk JOIN performance
- Composite index pada (siswa_id, semester, tahun_ajaran) untuk uniqueness
- Pagination untuk handle large datasets
- Efficient JOIN queries untuk minimize N+1 problems

#### Caching Strategy
- Dropdown siswa data di-cache selama 5 menit
- Count queries di-cache selama 1 menit
- Cache invalidation saat ada perubahan data

#### Calculation Performance
- Client-side calculation untuk preview
- Server-side calculation untuk final data
- Batch calculation untuk bulk operations

## Kesimpulan

Use case diagram manajemen presensi siswa menunjukkan sistem yang komprehensif dengan fitur:

- ✅ **Complete CRUD Operations** dengan auto-calculation dan categorization
- ✅ **Smart Business Logic** dengan attendance-based categorization
- ✅ **Advanced Search & Filter** untuk analisis data kehadiran
- ✅ **Excel Export** untuk reporting dan analysis
- ✅ **Role-based Security** dengan JWT authentication
- ✅ **Data Validation** yang ketat untuk attendance data integrity
- ✅ **Real-time Calculation** untuk user experience yang responsive
- ✅ **Performance Optimization** dengan efficient queries dan caching
- ✅ **Audit Trail** dengan timestamps untuk accountability
- ✅ **Integration Ready** untuk modul prediksi prestasi

### File yang Dibuat:

1. **Dokumentasi Utama**: `docs/use_case_presensi.md`
2. **Diagram Mermaid**: `docs/use_case_diagram_manajemen_presensi.mmd`
3. **Diagram PlantUML**: `docs/use_case_diagram_manajemen_presensi.puml`

### Tools untuk Visualisasi:

**Mermaid:**
- Mermaid Live Editor: https://mermaid.live/
- VS Code Extension: Mermaid Preview
- GitHub integration (otomatis render)

**PlantUML:**
- PlantUML Server: http://www.plantuml.com/plantuml/
- VS Code Extension: PlantUML
- CLI: `java -jar plantuml.jar file.puml`

### Keunggulan Sistem:

1. **Attendance Data Specialized**: Khusus dirancang untuk data kehadiran siswa
2. **Smart Categorization**: Auto-categorization berdasarkan persentase kehadiran
3. **Real-time Calculation**: Instant feedback untuk user experience
4. **Integration Ready**: Siap terintegrasi dengan modul prediksi prestasi
5. **User-Friendly**: Percentage formatting dan intuitive attendance display
6. **Educational Standards**: Mengikuti standar kategorisasi kehadiran pendidikan
7. **Performance Optimized**: Efficient handling untuk attendance calculations
8. **Audit Compliant**: Complete audit trail untuk attendance data

Sistem ini siap untuk production dengan dokumentasi lengkap dan implementasi yang robust untuk manajemen presensi siswa dalam aplikasi EduPro! 📅

---

**Dibuat pada**: 21 Juni 2025  
**Versi**: 1.0  
**Status**: Production Ready  
**Sistem**: EduPro - Sistem Informasi Manajemen Presensi Siswa 