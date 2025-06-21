# Use Case Diagram Manajemen Siswa - Sistem EduPro

## Executive Summary

Dokumen ini berisi use case diagram untuk modul manajemen siswa dalam aplikasi EduPro. Diagram menggambarkan semua fitur dan fungsionalitas yang tersedia untuk pengelolaan data siswa, termasuk operasi CRUD lengkap, import/export Excel, pencarian dan filtering, serta sistem autentikasi yang terintegrasi.

## Daftar Isi

1. [Overview Sistem](#overview-sistem)
2. [Actors](#actors)
3. [Use Cases](#use-cases)
4. [Relationships](#relationships)
5. [Business Rules](#business-rules)
6. [Kesimpulan](#kesimpulan)

## Overview Sistem

Sistem manajemen siswa adalah modul inti dalam aplikasi EduPro yang menyediakan fungsionalitas lengkap untuk mengelola data siswa.

### 🎯 **Fitur Utama:**
- **CRUD Operations**: Create, Read, Update, Delete data siswa
- **Search & Filter**: Pencarian dan filtering data siswa
- **Data Management**: Import/Export Excel, counting, dropdown
- **Validation**: Validasi NIS, data integrity, duplicate check
- **Authentication**: Login, authorization, token validation
- **Notification**: Success, error, dan info notifications

### 👥 **Target Users:**
- **Guru**: Mengelola data siswa di kelas mereka
- **Admin**: Mengelola semua data siswa di sekolah
- **Staff TU**: Input dan maintenance data siswa

### 🔒 **Security Features:**
- Bearer JWT Token authentication
- Role-based access control
- Data validation dan sanitization
- Audit trail dengan timestamps

## Actors

### 1. 👤 User (Guru/Admin)
**Deskripsi**: Pengguna utama sistem yang memiliki akses untuk mengelola data siswa

**Responsibilities**:
- Mengelola data siswa (CRUD operations)
- Melakukan pencarian dan filtering data
- Import/export data dari/ke Excel
- Melihat statistik dan informasi siswa

**Permissions**:
- **Guru**: Akses terbatas pada siswa di kelas mereka
- **Admin**: Akses penuh ke semua data siswa

### 2. 🔐 Authentication System
**Deskripsi**: Sistem autentikasi yang menangani login, authorization, dan token validation

**Responsibilities**:
- Memproses login dan logout
- Validasi credentials pengguna
- Generate dan validate JWT tokens
- Manage user sessions

## Use Cases

### 🔄 CRUD Operations

#### UC1: ➕ Tambah Data Siswa (Create)
**Deskripsi**: Menambahkan data siswa baru ke dalam sistem

**Main Flow**:
1. User mengakses form tambah siswa
2. User mengisi data siswa (nama, NIS, jenis kelamin, kelas, tanggal lahir, alamat)
3. Sistem melakukan validasi data
4. Sistem mengecek duplikasi NIS
5. Sistem menyimpan data ke database
6. Sistem menampilkan notifikasi sukses

**Business Rules**:
- NIS harus unik
- Nama, NIS, jenis kelamin, kelas, tanggal lahir wajib diisi
- Jenis kelamin hanya L (Laki-laki) atau P (Perempuan)
- Alamat bersifat opsional

#### UC2: 📋 Lihat Daftar Siswa (Read All)
**Deskripsi**: Menampilkan daftar semua siswa dengan fitur pagination dan search

**Features**:
- **Pagination**: 10 data per halaman (configurable)
- **Search**: Berdasarkan nama, NIS, atau kelas
- **Sorting**: Semua kolom dapat diurutkan
- **Filtering**: Filter berdasarkan berbagai kriteria

#### UC3: 👤 Lihat Detail Siswa (Read Single)
**Deskripsi**: Menampilkan detail lengkap data siswa tertentu

**Data Displayed**:
- Semua field siswa (nama, NIS, jenis kelamin, kelas, tanggal lahir, alamat)
- Timestamps (created_at, updated_at)
- Informasi terkait (nilai, presensi, dll)

#### UC4: ✏️ Edit Data Siswa (Update)
**Deskripsi**: Mengubah data siswa yang sudah ada

**Main Flow**:
1. User memilih siswa yang akan diedit
2. Sistem menampilkan form edit dengan data existing
3. User mengubah data yang diperlukan
4. Sistem melakukan validasi data
5. Sistem mengecek duplikasi NIS (jika NIS diubah)
6. Sistem menyimpan perubahan ke database
7. Sistem menampilkan notifikasi sukses

#### UC5: 🗑️ Hapus Data Siswa (Delete)
**Deskripsi**: Menghapus data siswa dari sistem

**Main Flow**:
1. User memilih siswa yang akan dihapus
2. Sistem menampilkan konfirmasi penghapusan
3. User mengkonfirmasi penghapusan
4. Sistem menghapus data siswa dari database
5. Sistem menampilkan notifikasi sukses

**⚠️ Warning**:
- Data yang dihapus tidak dapat dikembalikan
- Pastikan tidak ada data terkait (nilai, presensi) sebelum menghapus

### 🔍 Search & Filter Operations

#### UC6: 🔎 Cari Siswa (Search)
**Deskripsi**: Mencari siswa berdasarkan kriteria tertentu

**Search Criteria**:
- **Nama**: Pencarian partial match (LIKE)
- **NIS**: Pencarian exact atau partial match
- **Kelas**: Pencarian berdasarkan kelas

**Features**:
- Case-insensitive search
- Real-time search (search as you type)
- Multiple field search (OR logic)
- Clear search functionality

#### UC7: 📊 Filter Siswa (Filter)
**Deskripsi**: Memfilter siswa berdasarkan kriteria spesifik

**Filter Options**:
- **Jenis Kelamin**: L/P
- **Kelas**: Dropdown kelas yang tersedia
- **Tahun Lahir**: Range tahun
- **Status**: Aktif/Tidak Aktif

#### UC8: 📄 Pagination (Paging)
**Deskripsi**: Navigasi halaman untuk data siswa yang banyak

**Features**:
- Configurable page size (10, 25, 50, 100)
- First, Previous, Next, Last navigation
- Page number display
- Total records indicator

### 📁 Data Management Operations

#### UC9: 📤 Upload Excel (Import)
**Deskripsi**: Import data siswa dari file Excel

**Excel Format Requirements**:
```
Kolom yang diperlukan:
- Nama (required)
- NIS (required, unique)
- Jenis Kelamin (required, L/P)
- Kelas (required)
- Tanggal Lahir (required, format date)
- Alamat (optional)
```

**Features**:
- Batch processing untuk performa optimal
- Skip duplicate NIS dengan notifikasi
- Error handling per baris data
- Summary report (success count, error count)

#### UC10: 📥 Export Excel (Export)
**Deskripsi**: Export data siswa ke file Excel

**Excel Output Features**:
- **Filename**: Data_Siswa.xlsx
- **Sheet Name**: Data Siswa
- **Columns**: Semua field siswa + timestamps
- **Formatting**: Proper date formatting, column width optimization

#### UC11: 🔢 Hitung Total Siswa (Count)
**Deskripsi**: Menampilkan jumlah total siswa dalam sistem

**Features**:
- Real-time count
- Filter-aware count (count berdasarkan filter aktif)
- Statistics breakdown (per kelas, per jenis kelamin)

#### UC12: 📝 Dropdown Siswa (Dropdown)
**Deskripsi**: Menyediakan daftar siswa untuk dropdown/select option

**Usage**:
- Form input nilai
- Form input presensi
- Form input penghasilan orang tua
- Form prediksi prestasi

### ✅ Validation Operations

#### UC13: 🆔 Validasi NIS (NIS Validation)
**Validation Rules**:
- NIS tidak boleh kosong
- NIS harus unik dalam sistem
- Format NIS sesuai standar sekolah

#### UC14: 📋 Validasi Data (Data Validation)
**Validation Rules**:
- **Nama**: Required, max 100 karakter
- **NIS**: Required, unique, max 20 karakter
- **Jenis Kelamin**: Required, hanya L atau P
- **Kelas**: Required, max 20 karakter
- **Tanggal Lahir**: Required, format date valid
- **Alamat**: Optional, max 255 karakter

#### UC15: 🔍 Cek Duplikasi (Duplicate Check)
**Check Points**:
- NIS duplicate check saat create
- NIS duplicate check saat update (exclude current record)
- Nama + Kelas duplicate warning (optional)

### 🔐 Authentication Operations

#### UC16: 🔑 Login (Authentication)
**Main Flow**:
1. User memasukkan username/email dan password
2. Sistem validasi credentials
3. Sistem generate JWT token
4. Sistem redirect ke dashboard

#### UC17: 🛡️ Autorisasi (Authorization)
**Role-based Access**:
- **Admin**: Full access ke semua fitur
- **Guru**: Limited access berdasarkan kelas yang diajar
- **Staff**: Read-only access

#### UC18: 🔒 Validasi Token (Token Validation)
**Process**:
- Extract token dari Authorization header
- Validate token signature dan expiry
- Extract user information dari token
- Check user permissions

### 🔔 Notification Operations

#### UC19: ✅ Notifikasi Sukses (Success Notification)
**Examples**:
- "Siswa berhasil ditambahkan"
- "Data siswa berhasil diupdate"
- "Data siswa berhasil dihapus"
- "File Excel berhasil diupload"

#### UC20: ❌ Notifikasi Error (Error Notification)
**Examples**:
- "NIS sudah terdaftar"
- "Data tidak valid"
- "Siswa tidak ditemukan"
- "Gagal mengupload file"

#### UC21: ℹ️ Notifikasi Info (Info Notification)
**Examples**:
- "Data sedang diproses..."
- "File sedang didownload..."
- "Session akan berakhir dalam 5 menit"

## Relationships

### Include Relationships (<<include>>)
**UC1 (Create Siswa)** includes:
- UC13 (Validasi NIS)
- UC14 (Validasi Data)
- UC15 (Cek Duplikasi)
- UC18 (Validasi Token)

**UC2 (Read All Siswa)** includes:
- UC18 (Validasi Token)
- UC6 (Search) - optional
- UC7 (Filter) - optional
- UC8 (Pagination)

**UC4 (Update Siswa)** includes:
- UC18 (Validasi Token)
- UC13 (Validasi NIS)
- UC14 (Validasi Data)
- UC15 (Cek Duplikasi)

### Extend Relationships (<<extend>>)
- Semua CRUD operations dapat extend ke UC19 (Success) atau UC20 (Error)
- Validation use cases dapat extend ke UC20 (Error)
- Search dan Filter dapat extend dari Read operations

## Business Rules

### 1. Data Integrity Rules

#### NIS (Nomor Induk Siswa)
- **Uniqueness**: NIS harus unik dalam sistem
- **Format**: Numeric atau alphanumeric sesuai standar sekolah
- **Length**: Maximum 20 karakter
- **Required**: Wajib diisi

#### Nama Siswa
- **Required**: Wajib diisi
- **Length**: Maximum 100 karakter
- **Format**: Huruf dan spasi, tidak boleh hanya angka

#### Jenis Kelamin
- **Values**: Hanya L (Laki-laki) atau P (Perempuan)
- **Required**: Wajib diisi

#### Kelas
- **Required**: Wajib diisi
- **Format**: Sesuai format kelas sekolah (contoh: X RPL 1, XI TKJ 2)
- **Length**: Maximum 20 karakter

#### Tanggal Lahir
- **Required**: Wajib diisi
- **Format**: Date format (YYYY-MM-DD)
- **Validation**: Tanggal valid dan tidak di masa depan

#### Alamat
- **Optional**: Tidak wajib diisi
- **Length**: Maximum 255 karakter

### 2. Security Rules

#### Authentication
- Semua operasi memerlukan valid JWT token
- Token harus di-refresh sebelum expired
- Failed login attempts dibatasi (rate limiting)

#### Authorization
- **Admin**: Full access ke semua data siswa
- **Guru**: Hanya akses ke siswa di kelas yang diajar
- **Staff**: Read-only access

#### Data Protection
- Input sanitization untuk mencegah XSS
- SQL injection prevention dengan parameterized queries
- Sensitive data tidak di-log

### 3. Business Process Rules

#### Data Import
- File Excel harus sesuai template yang disediakan
- Duplicate NIS akan di-skip dengan notifikasi
- Maximum 1000 records per upload session
- Transaction rollback jika terjadi critical error

#### Data Export
- Export hanya data yang user berhak akses
- Include audit trail (timestamps)
- File naming convention: Data_Siswa_YYYYMMDD.xlsx

#### Search & Filter
- Search case-insensitive
- Multiple search terms menggunakan OR logic
- Multiple filters menggunakan AND logic
- Search history disimpan per session

### 4. Performance Rules

#### Pagination
- Default page size: 10 records
- Maximum page size: 100 records
- Efficient database queries dengan LIMIT dan OFFSET

#### Caching
- Dropdown data di-cache selama 5 menit
- Count queries di-cache selama 1 menit
- Cache invalidation saat ada perubahan data

## Kesimpulan

Use case diagram manajemen siswa menunjukkan sistem yang komprehensif dengan fitur:

- ✅ **Complete CRUD Operations** dengan validation lengkap
- ✅ **Advanced Search & Filter** untuk user experience yang baik
- ✅ **Excel Import/Export** untuk kemudahan data management
- ✅ **Role-based Security** dengan JWT authentication
- ✅ **Data Validation** yang ketat untuk data integrity
- ✅ **User-friendly Notifications** untuk feedback yang jelas
- ✅ **Performance Optimization** dengan pagination dan caching
- ✅ **Audit Trail** dengan timestamps untuk accountability

### File yang Dibuat:

1. **Dokumentasi Utama**: `docs/use_case_siswa.md`
2. **Diagram Mermaid**: `docs/use_case_diagram_manajemen_siswa.mmd`
3. **Diagram PlantUML**: `docs/use_case_diagram_manajemen_siswa.puml`

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

1. **User-Centric Design**: Semua use case dirancang dari perspektif user
2. **Security First**: Authentication dan authorization terintegrasi di semua level
3. **Data Integrity**: Validation rules yang ketat dan comprehensive
4. **Performance Optimized**: Pagination, caching, dan efficient queries
5. **Maintainable**: Clear separation of concerns dan modular design
6. **Scalable**: Designed untuk handle large dataset dengan pagination
7. **User-Friendly**: Intuitive interface dengan clear feedback

Sistem ini siap untuk production dengan dokumentasi lengkap dan implementasi yang robust untuk manajemen siswa dalam aplikasi EduPro! 🎉

---

**Dibuat pada**: 21 Juni 2025  
**Versi**: 1.0  
**Status**: Production Ready  
**Sistem**: EduPro - Sistem Informasi Manajemen Siswa 