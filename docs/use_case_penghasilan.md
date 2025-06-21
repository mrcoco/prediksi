# Use Case Diagram Manajemen Penghasilan Orang Tua - Sistem EduPro

## Executive Summary

Dokumen ini berisi use case diagram untuk modul manajemen penghasilan orang tua siswa dalam aplikasi EduPro. Diagram menggambarkan semua fitur dan fungsionalitas yang tersedia untuk pengelolaan data penghasilan orang tua, termasuk operasi CRUD lengkap, business logic calculation, export Excel, dan sistem kategorisasi otomatis berdasarkan total penghasilan.

## Daftar Isi

1. [Overview Sistem](#overview-sistem)
2. [Actors](#actors)
3. [Use Cases](#use-cases)
4. [Relationships](#relationships)
5. [Business Rules](#business-rules)
6. [Kesimpulan](#kesimpulan)

## Overview Sistem

Sistem manajemen penghasilan orang tua adalah modul penting dalam aplikasi EduPro yang menyediakan fungsionalitas lengkap untuk mengelola data ekonomi keluarga siswa. Sistem ini mencakup:

### 💰 **Fitur Utama:**
- **CRUD Operations**: Create, Read, Update, Delete data penghasilan
- **Business Logic**: Auto-calculation total penghasilan dan kategorisasi
- **Search & Filter**: Pencarian dan filtering data penghasilan
- **Data Management**: Export Excel, counting, dropdown integration
- **Validation**: Validasi siswa, data integrity, duplicate prevention
- **Authentication**: Login, authorization, token validation
- **Notification**: Success, error, dan info notifications

### 👥 **Target Users:**
- **Guru**: Mengelola data penghasilan orang tua siswa di kelas mereka
- **Admin**: Mengelola semua data penghasilan orang tua di sekolah
- **Staff TU**: Input dan maintenance data penghasilan

### 🔒 **Security Features:**
- Bearer JWT Token authentication
- Role-based access control
- Data validation dan sanitization
- Audit trail dengan timestamps

### 💼 **Business Logic Features:**
- Auto-calculation total penghasilan (ayah + ibu)
- Kategorisasi otomatis berdasarkan UMK Yogyakarta
- Currency formatting untuk tampilan yang user-friendly
- Duplicate prevention per siswa

## Actors

### 1. 👤 User (Guru/Admin)
**Deskripsi**: Pengguna utama sistem yang memiliki akses untuk mengelola data penghasilan orang tua siswa

**Responsibilities**:
- Mengelola data penghasilan orang tua (CRUD operations)
- Melakukan pencarian dan filtering data
- Export data ke Excel untuk reporting
- Melihat statistik dan informasi penghasilan

**Permissions**:
- **Guru**: Akses terbatas pada data penghasilan siswa di kelas mereka
- **Admin**: Akses penuh ke semua data penghasilan orang tua

### 2. 🔐 Authentication System
**Deskripsi**: Sistem autentikasi yang menangani login, authorization, dan token validation

**Responsibilities**:
- Memproses login dan logout
- Validasi credentials pengguna
- Generate dan validate JWT tokens
- Manage user sessions

## Use Cases

### 🔄 CRUD Operations

#### UC1: ➕ Tambah Data Penghasilan (Create)
**Deskripsi**: Menambahkan data penghasilan orang tua siswa baru ke dalam sistem

**Main Flow**:
1. User mengakses form tambah penghasilan
2. User memilih siswa dari dropdown
3. User mengisi data penghasilan ayah dan ibu
4. User mengisi data pekerjaan dan pendidikan orang tua
5. Sistem melakukan validasi data
6. Sistem mengecek duplikasi data per siswa
7. Sistem menghitung total penghasilan otomatis
8. Sistem menentukan kategori penghasilan berdasarkan business rules
9. Sistem menyimpan data ke database
10. Sistem menampilkan notifikasi sukses

**Business Rules**:
- Satu siswa hanya boleh memiliki satu data penghasilan
- Penghasilan ayah dan ibu harus berupa angka positif
- Total penghasilan dihitung otomatis (ayah + ibu)
- Kategori ditentukan otomatis berdasarkan total penghasilan

**Field Requirements**:
- **siswa_id**: Required, must exist in siswa table
- **penghasilan_ayah**: Required, numeric, >= 0
- **penghasilan_ibu**: Required, numeric, >= 0
- **pekerjaan_ayah**: Required, string
- **pekerjaan_ibu**: Required, string
- **pendidikan_ayah**: Required, string
- **pendidikan_ibu**: Required, string

#### UC2: 📋 Lihat Daftar Penghasilan (Read All)
**Deskripsi**: Menampilkan daftar semua data penghasilan dengan fitur pagination dan search

**Features**:
- **JOIN Query**: Data ditampilkan dengan nama siswa
- **Pagination**: 10 data per halaman (configurable)
- **Search**: Berdasarkan nama siswa atau kategori penghasilan
- **Sorting**: Semua kolom dapat diurutkan
- **Currency Formatting**: Format rupiah untuk penghasilan

**Data Displayed**:
- Nama Siswa (dari JOIN dengan tabel siswa)
- Penghasilan Ayah (formatted currency)
- Penghasilan Ibu (formatted currency)
- Pekerjaan Ayah dan Ibu
- Pendidikan Ayah dan Ibu
- Total Penghasilan (formatted currency)
- Kategori Penghasilan (Tinggi/Menengah/Rendah)
- Created/Updated timestamps

#### UC3: 👤 Lihat Detail Penghasilan (Read Single)
**Deskripsi**: Menampilkan detail lengkap data penghasilan tertentu

**Data Displayed**:
- Semua field penghasilan dengan format yang proper
- Informasi siswa terkait
- Timestamps (created_at, updated_at)
- History perubahan data

#### UC4: ✏️ Edit Data Penghasilan (Update)
**Deskripsi**: Mengubah data penghasilan orang tua yang sudah ada

**Main Flow**:
1. User memilih data penghasilan yang akan diedit
2. Sistem menampilkan form edit dengan data existing
3. User mengubah data yang diperlukan
4. Sistem melakukan validasi data
5. Sistem recalculate total penghasilan jika ada perubahan
6. Sistem redetermine kategori penghasilan
7. Sistem menyimpan perubahan ke database
8. Sistem update timestamp updated_at
9. Sistem menampilkan notifikasi sukses

**Auto-Recalculation**:
- Total penghasilan dihitung ulang jika penghasilan ayah/ibu berubah
- Kategori penghasilan ditentukan ulang berdasarkan total baru
- Update timestamp otomatis

#### UC5: 🗑️ Hapus Data Penghasilan (Delete)
**Deskripsi**: Menghapus data penghasilan dari sistem

**Main Flow**:
1. User memilih data penghasilan yang akan dihapus
2. Sistem menampilkan konfirmasi penghapusan dengan detail data
3. User mengkonfirmasi penghapusan
4. Sistem menghapus data dari database
5. Sistem menampilkan notifikasi sukses

**⚠️ Warning**:
- Data yang dihapus tidak dapat dikembalikan
- Pastikan data tidak digunakan untuk prediksi prestasi

### 🔍 Search & Filter Operations

#### UC6: 🔎 Cari Penghasilan (Search)
**Deskripsi**: Mencari data penghasilan berdasarkan kriteria tertentu

**Search Criteria**:
- **Nama Siswa**: Pencarian partial match (LIKE)
- **Kategori Penghasilan**: Exact match (Tinggi/Menengah/Rendah)
- **Pekerjaan**: Pencarian pada pekerjaan ayah atau ibu
- **Range Penghasilan**: Pencarian berdasarkan range total penghasilan

**Features**:
- Case-insensitive search
- Real-time search (search as you type)
- Multiple field search (OR logic)
- Clear search functionality

#### UC7: 📊 Filter Penghasilan (Filter)
**Deskripsi**: Memfilter data penghasilan berdasarkan kriteria spesifik

**Filter Options**:
- **Kategori Penghasilan**: Tinggi/Menengah/Rendah
- **Range Total Penghasilan**: Custom range input
- **Tingkat Pendidikan**: Filter berdasarkan pendidikan orang tua
- **Jenis Pekerjaan**: Filter berdasarkan kategori pekerjaan

#### UC8: 📄 Pagination (Paging)
**Deskripsi**: Navigasi halaman untuk data penghasilan yang banyak

**Features**:
- Configurable page size (10, 25, 50, 100)
- First, Previous, Next, Last navigation
- Page number display
- Total records indicator

### 📁 Data Management Operations

#### UC9: 📥 Export Excel (Export)
**Deskripsi**: Export data penghasilan ke file Excel

**Excel Output Features**:
- **Filename**: Data_Penghasilan_Orang_Tua.xlsx
- **Sheet Name**: Data Penghasilan Orang Tua
- **Columns**: Semua field dengan nama siswa
- **Formatting**: Currency formatting, proper column width

**Data Included**:
- ID, Siswa ID, Nama Siswa
- Penghasilan Ayah, Penghasilan Ibu
- Pekerjaan Ayah, Pekerjaan Ibu
- Pendidikan Ayah, Pendidikan Ibu
- Total Penghasilan, Kategori Penghasilan
- Created At, Updated At

#### UC10: 🔢 Hitung Total Data (Count)
**Deskripsi**: Menampilkan jumlah total data penghasilan dalam sistem

**Features**:
- Real-time count
- Filter-aware count (count berdasarkan filter aktif)
- Statistics breakdown per kategori penghasilan

#### UC11: 📝 Dropdown Siswa (Dropdown)
**Deskripsi**: Menyediakan daftar siswa untuk dropdown/select option

**Usage**:
- Form input penghasilan baru
- Form edit penghasilan
- Filter berdasarkan siswa
- Integration dengan modul lain

### 💼 Business Logic Operations

#### UC12: 🧮 Hitung Total Penghasilan (Calculate Total)
**Deskripsi**: Menghitung total penghasilan otomatis

**Calculation Logic**:
```
total_penghasilan = penghasilan_ayah + penghasilan_ibu
```

**Features**:
- Auto-calculation saat input/update
- Real-time calculation di frontend
- Server-side validation untuk consistency

#### UC13: 📊 Tentukan Kategori (Categorize)
**Deskripsi**: Menentukan kategori penghasilan berdasarkan business rules

**Categorization Rules (berdasarkan UMK Yogyakarta)**:
```
IF total_penghasilan >= 5,000,000 THEN "Tinggi"    // 2x UMK Yogyakarta
ELIF total_penghasilan >= 2,300,000 THEN "Menengah" // 1x UMK Yogyakarta  
ELSE "Rendah"                                        // < UMK Yogyakarta
```

**Features**:
- Auto-categorization saat input/update
- Business rules dapat dikonfigurasi
- Consistent categorization across system

#### UC14: 💱 Format Currency (Format)
**Deskripsi**: Format currency untuk tampilan yang user-friendly

**Formatting Rules**:
- Format: Rp 1,000,000
- Thousand separator dengan koma
- Currency symbol "Rp"
- No decimal places untuk rupiah

### ✅ Validation Operations

#### UC15: 🆔 Validasi Siswa (Student Validation)
**Deskripsi**: Memastikan siswa yang dipilih valid dan ada di database

**Validation Rules**:
- siswa_id harus ada di tabel siswa
- Siswa harus aktif (jika ada status)
- Foreign key constraint validation

#### UC16: 📋 Validasi Data (Data Validation)
**Deskripsi**: Validasi semua data penghasilan sebelum disimpan

**Validation Rules**:
- **penghasilan_ayah**: Required, numeric, >= 0, max 999,999,999
- **penghasilan_ibu**: Required, numeric, >= 0, max 999,999,999
- **pekerjaan_ayah**: Required, string, max 100 karakter
- **pekerjaan_ibu**: Required, string, max 100 karakter
- **pendidikan_ayah**: Required, string, max 50 karakter
- **pendidikan_ibu**: Required, string, max 50 karakter

#### UC17: 🔍 Cek Duplikasi (Duplicate Check)
**Deskripsi**: Mengecek duplikasi data penghasilan per siswa

**Check Points**:
- Satu siswa hanya boleh memiliki satu data penghasilan
- Duplicate check saat create
- Skip duplicate check saat update (same siswa_id)

### 🔐 Authentication Operations

#### UC18: 🔑 Login (Authentication)
**Main Flow**:
1. User memasukkan username/email dan password
2. Sistem validasi credentials
3. Sistem generate JWT token
4. Sistem redirect ke dashboard

#### UC19: 🛡️ Autorisasi (Authorization)
**Role-based Access**:
- **Admin**: Full access ke semua data penghasilan
- **Guru**: Limited access berdasarkan kelas yang diajar
- **Staff**: Read-only access

#### UC20: 🔒 Validasi Token (Token Validation)
**Process**:
- Extract token dari Authorization header
- Validate token signature dan expiry
- Extract user information dari token
- Check user permissions

### 🔔 Notification Operations

#### UC21: ✅ Notifikasi Sukses (Success Notification)
**Examples**:
- "Data penghasilan berhasil ditambahkan"
- "Data penghasilan berhasil diupdate"
- "Data penghasilan berhasil dihapus"
- "File Excel berhasil diunduh"

#### UC22: ❌ Notifikasi Error (Error Notification)
**Examples**:
- "Data penghasilan untuk siswa ini sudah ada"
- "Siswa tidak ditemukan"
- "Data tidak valid"
- "Gagal menyimpan data"

#### UC23: ℹ️ Notifikasi Info (Info Notification)
**Examples**:
- "Data sedang diproses..."
- "File sedang didownload..."
- "Total penghasilan dihitung otomatis"

## Relationships

### Include Relationships (<<include>>)
**UC1 (Create Penghasilan)** includes:
- UC15 (Validasi Siswa)
- UC16 (Validasi Data)
- UC17 (Cek Duplikasi)
- UC12 (Hitung Total Penghasilan)
- UC13 (Tentukan Kategori)
- UC20 (Validasi Token)

**UC2 (Read All Penghasilan)** includes:
- UC20 (Validasi Token)
- UC6 (Search) - optional
- UC7 (Filter) - optional
- UC8 (Pagination)
- UC14 (Format Currency)

**UC4 (Update Penghasilan)** includes:
- UC20 (Validasi Token)
- UC15 (Validasi Siswa)
- UC16 (Validasi Data)
- UC12 (Hitung Total Penghasilan)
- UC13 (Tentukan Kategori)

### Extend Relationships (<<extend>>)
- Semua CRUD operations dapat extend ke UC21 (Success) atau UC22 (Error)
- Validation use cases dapat extend ke UC22 (Error)
- Business logic operations dapat extend ke UC23 (Info)

## Business Rules

### 1. Data Integrity Rules

#### Penghasilan Fields
- **penghasilan_ayah**: Required, numeric, >= 0, max 999,999,999
- **penghasilan_ibu**: Required, numeric, >= 0, max 999,999,999
- **total_penghasilan**: Auto-calculated, sum of ayah + ibu
- **kategori_penghasilan**: Auto-determined based on total

#### Personal Information
- **pekerjaan_ayah**: Required, string, max 100 characters
- **pekerjaan_ibu**: Required, string, max 100 characters
- **pendidikan_ayah**: Required, string, max 50 characters
- **pendidikan_ibu**: Required, string, max 50 characters

#### Relational Integrity
- **siswa_id**: Required, must exist in siswa table
- **One-to-One Relationship**: Satu siswa hanya boleh memiliki satu data penghasilan

### 2. Business Logic Rules

#### Total Penghasilan Calculation
```
total_penghasilan = penghasilan_ayah + penghasilan_ibu
```

#### Kategori Penghasilan Rules (UMK Yogyakarta 2024: Rp 2,300,000)
```
IF total_penghasilan >= 5,000,000 THEN "Tinggi"    // 2x UMK (well above average)
ELIF total_penghasilan >= 2,300,000 THEN "Menengah" // 1x UMK (around average)
ELSE "Rendah"                                        // < UMK (below average)
```

#### Auto-Recalculation Rules
- Total dan kategori dihitung ulang setiap kali ada perubahan penghasilan
- Calculation terjadi di backend untuk consistency
- Frontend dapat melakukan preview calculation

### 3. Security Rules

#### Authentication
- Semua operasi memerlukan valid JWT token
- Token harus di-refresh sebelum expired
- Failed login attempts dibatasi (rate limiting)

#### Authorization
- **Admin**: Full access ke semua data penghasilan
- **Guru**: Hanya akses ke data penghasilan siswa di kelas yang diajar
- **Staff**: Read-only access

#### Data Protection
- Input sanitization untuk mencegah XSS
- SQL injection prevention dengan parameterized queries
- Sensitive financial data tidak di-log

### 4. Performance Rules

#### Database Optimization
- Proper indexing pada siswa_id untuk JOIN performance
- Pagination untuk handle large datasets
- Efficient JOIN queries untuk minimize N+1 problems

#### Caching Strategy
- Dropdown siswa data di-cache selama 5 menit
- Count queries di-cache selama 1 menit
- Cache invalidation saat ada perubahan data

#### Currency Formatting
- Client-side formatting untuk performance
- Server-side validation untuk data integrity
- Consistent formatting across all displays

## Kesimpulan

Use case diagram manajemen penghasilan orang tua menunjukkan sistem yang komprehensif dengan fitur:

- ✅ **Complete CRUD Operations** dengan auto-calculation dan categorization
- ✅ **Smart Business Logic** dengan UMK-based categorization
- ✅ **Advanced Search & Filter** untuk analisis data ekonomi
- ✅ **Excel Export** untuk reporting dan analysis
- ✅ **Role-based Security** dengan JWT authentication
- ✅ **Data Validation** yang ketat untuk financial data integrity
- ✅ **User-friendly Interface** dengan currency formatting
- ✅ **Performance Optimization** dengan efficient queries dan caching
- ✅ **Audit Trail** dengan timestamps untuk accountability
- ✅ **Integration Ready** untuk modul prediksi prestasi

### File yang Dibuat:

1. **Dokumentasi Utama**: `docs/use_case_penghasilan.md`
2. **Diagram Mermaid**: `docs/use_case_diagram_manajemen_penghasilan.mmd`
3. **Diagram PlantUML**: `docs/use_case_diagram_manajemen_penghasilan.puml`

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

1. **Economic Data Management**: Specialized untuk data ekonomi keluarga
2. **Smart Categorization**: Auto-categorization berdasarkan UMK regional
3. **Financial Data Security**: Extra security untuk sensitive financial information
4. **Integration Ready**: Siap terintegrasi dengan modul prediksi prestasi
5. **User-Friendly**: Currency formatting dan intuitive interface
6. **Business Rule Compliance**: Mengikuti standar UMK dan business requirements
7. **Performance Optimized**: Efficient handling untuk financial calculations
8. **Audit Compliant**: Complete audit trail untuk financial data

Sistem ini siap untuk production dengan dokumentasi lengkap dan implementasi yang robust untuk manajemen penghasilan orang tua siswa dalam aplikasi EduPro! 💰

---

**Dibuat pada**: 21 Juni 2025  
**Versi**: 1.0  
**Status**: Production Ready  
**Sistem**: EduPro - Sistem Informasi Manajemen Penghasilan Orang Tua 