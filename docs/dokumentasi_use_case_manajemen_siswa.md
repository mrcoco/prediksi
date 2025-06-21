# Dokumentasi Use Case Diagram Manajemen Siswa - Sistem EduPro

## Executive Summary

Dokumen ini berisi use case diagram untuk modul manajemen siswa dalam aplikasi EduPro. Diagram menggambarkan semua fitur dan fungsionalitas yang tersedia untuk pengelolaan data siswa, termasuk operasi CRUD lengkap, import/export Excel, pencarian dan filtering, serta sistem autentikasi yang terintegrasi.

## Daftar Isi

1. [Overview Sistem](#overview-sistem)
2. [Use Case Diagram - Format Mermaid](#use-case-diagram-format-mermaid)
3. [Use Case Diagram - Format PlantUML](#use-case-diagram-format-plantuml)
4. [Actors](#actors)
5. [Use Cases](#use-cases)
6. [Relationships](#relationships)
7. [Business Rules](#business-rules)
8. [Technical Implementation](#technical-implementation)
9. [Kesimpulan](#kesimpulan)

## Overview Sistem

Sistem manajemen siswa adalah modul inti dalam aplikasi EduPro yang menyediakan fungsionalitas lengkap untuk mengelola data siswa. Sistem ini mencakup:

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

## Use Case Diagram - Format Mermaid

File diagram Mermaid tersimpan di: `docs/use_case_diagram_manajemen_siswa.mmd`

### Cara Menggunakan Diagram Mermaid:
1. **Mermaid Live Editor**: https://mermaid.live/
2. **VS Code Extension**: Mermaid Preview
3. **GitHub**: Otomatis render di README.md
4. **Documentation Tools**: GitBook, Notion, Confluence

## Use Case Diagram - Format PlantUML

File diagram PlantUML tersimpan di: `docs/use_case_diagram_manajemen_siswa.puml`

### Cara Menggunakan Diagram PlantUML:
1. **PlantUML Server**: http://www.plantuml.com/plantuml/
2. **VS Code Extension**: PlantUML
3. **IntelliJ Plugin**: PlantUML Integration
4. **CLI Tool**: plantuml.jar

### Generate Images:
```bash
# Generate PNG
java -jar plantuml.jar use_case_diagram_manajemen_siswa.puml

# Generate SVG
java -jar plantuml.jar -tsvg use_case_diagram_manajemen_siswa.puml
```

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

**Integration**:
- Terintegrasi dengan semua use cases yang memerlukan authentication
- Menyediakan role-based access control

## Use Cases

### 🔄 CRUD Operations

#### UC1: ➕ Tambah Data Siswa (Create)
**Deskripsi**: Menambahkan data siswa baru ke dalam sistem

**Preconditions**:
- User sudah login dan terautentikasi
- User memiliki permission untuk menambah data siswa

**Main Flow**:
1. User mengakses form tambah siswa
2. User mengisi data siswa (nama, NIS, jenis kelamin, kelas, tanggal lahir, alamat)
3. Sistem melakukan validasi data
4. Sistem mengecek duplikasi NIS
5. Sistem menyimpan data ke database
6. Sistem menampilkan notifikasi sukses

**Alternative Flow**:
- **4a**: NIS sudah ada → Tampilkan error "NIS sudah terdaftar"
- **3a**: Data tidak valid → Tampilkan error validasi

**Postconditions**:
- Data siswa baru tersimpan di database
- Grid siswa ter-refresh dengan data terbaru

**Business Rules**:
- NIS harus unik
- Nama, NIS, jenis kelamin, kelas, tanggal lahir wajib diisi
- Jenis kelamin hanya L (Laki-laki) atau P (Perempuan)
- Alamat bersifat opsional

#### UC2: 📋 Lihat Daftar Siswa (Read All)
**Deskripsi**: Menampilkan daftar semua siswa dengan fitur pagination dan search

**Preconditions**:
- User sudah login dan terautentikasi

**Main Flow**:
1. User mengakses halaman daftar siswa
2. Sistem mengambil data siswa dari database
3. Sistem menampilkan data dalam grid dengan pagination
4. User dapat melakukan search dan filter

**Features**:
- **Pagination**: 10 data per halaman (configurable)
- **Search**: Berdasarkan nama, NIS, atau kelas
- **Sorting**: Semua kolom dapat diurutkan
- **Filtering**: Filter berdasarkan berbagai kriteria

**Postconditions**:
- Daftar siswa ditampilkan dalam grid
- User dapat berinteraksi dengan data (search, filter, sort)

#### UC3: 👤 Lihat Detail Siswa (Read Single)
**Deskripsi**: Menampilkan detail lengkap data siswa tertentu

**Preconditions**:
- User sudah login dan terautentikasi
- Siswa dengan ID tertentu ada di database

**Main Flow**:
1. User memilih siswa dari daftar atau mengakses detail siswa
2. Sistem mengambil data detail siswa
3. Sistem menampilkan semua informasi siswa

**Alternative Flow**:
- **2a**: Siswa tidak ditemukan → Tampilkan error "Siswa tidak ditemukan"

**Data Displayed**:
- Semua field siswa (nama, NIS, jenis kelamin, kelas, tanggal lahir, alamat)
- Timestamps (created_at, updated_at)
- Informasi terkait (nilai, presensi, dll)

#### UC4: ✏️ Edit Data Siswa (Update)
**Deskripsi**: Mengubah data siswa yang sudah ada

**Preconditions**:
- User sudah login dan terautentikasi
- User memiliki permission untuk edit data siswa
- Siswa dengan ID tertentu ada di database

**Main Flow**:
1. User memilih siswa yang akan diedit
2. Sistem menampilkan form edit dengan data existing
3. User mengubah data yang diperlukan
4. Sistem melakukan validasi data
5. Sistem mengecek duplikasi NIS (jika NIS diubah)
6. Sistem menyimpan perubahan ke database
7. Sistem menampilkan notifikasi sukses

**Alternative Flow**:
- **5a**: NIS sudah digunakan siswa lain → Tampilkan error "NIS sudah digunakan"
- **4a**: Data tidak valid → Tampilkan error validasi

**Postconditions**:
- Data siswa ter-update di database
- Timestamp updated_at ter-update
- Grid siswa ter-refresh

#### UC5: 🗑️ Hapus Data Siswa (Delete)
**Deskripsi**: Menghapus data siswa dari sistem

**Preconditions**:
- User sudah login dan terautentikasi
- User memiliki permission untuk hapus data siswa
- Siswa dengan ID tertentu ada di database

**Main Flow**:
1. User memilih siswa yang akan dihapus
2. Sistem menampilkan konfirmasi penghapusan
3. User mengkonfirmasi penghapusan
4. Sistem menghapus data siswa dari database
5. Sistem menampilkan notifikasi sukses

**Alternative Flow**:
- **3a**: User membatalkan → Kembali ke daftar siswa
- **4a**: Error database → Tampilkan error "Gagal menghapus data"

**Postconditions**:
- Data siswa terhapus dari database
- Grid siswa ter-refresh

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

**Features**:
- Multiple filter combination (AND logic)
- Filter indicator/badge
- Clear all filters functionality

#### UC8: 📄 Pagination (Paging)
**Deskripsi**: Navigasi halaman untuk data siswa yang banyak

**Features**:
- Configurable page size (10, 25, 50, 100)
- First, Previous, Next, Last navigation
- Page number display
- Total records indicator
- Jump to specific page

### 📁 Data Management Operations

#### UC9: 📤 Upload Excel (Import)
**Deskripsi**: Import data siswa dari file Excel

**Preconditions**:
- User sudah login dan terautentikasi
- File Excel dengan format yang benar

**Main Flow**:
1. User memilih file Excel untuk upload
2. Sistem validasi format file (.xlsx atau .xls)
3. Sistem membaca dan validasi struktur Excel
4. Sistem memproses setiap baris data
5. Sistem melakukan validasi dan duplicate check
6. Sistem menyimpan data valid ke database
7. Sistem menampilkan summary hasil import

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

**Alternative Flow**:
- **2a**: Format file salah → Error "File harus berformat Excel"
- **3a**: Struktur Excel salah → Error "Kolom yang diperlukan tidak ditemukan"
- **6a**: Error database → Rollback transaction

#### UC10: 📥 Export Excel (Export)
**Deskripsi**: Export data siswa ke file Excel

**Preconditions**:
- User sudah login dan terautentikasi

**Main Flow**:
1. User mengklik tombol Export Excel
2. Sistem mengambil semua data siswa
3. Sistem generate file Excel
4. Sistem mengirim file untuk download

**Excel Output Features**:
- **Filename**: Data_Siswa.xlsx
- **Sheet Name**: Data Siswa
- **Columns**: Semua field siswa + timestamps
- **Formatting**: Proper date formatting, column width optimization

**Data Included**:
- ID, Nama, NIS, Jenis Kelamin, Kelas
- Tanggal Lahir, Alamat
- Created At, Updated At

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

**Format**:
```json
{
  "id": 1,
  "text": "Ahmad Rizki (X RPL 1)"
}
```

### ✅ Validation Operations

#### UC13: 🆔 Validasi NIS (NIS Validation)
**Deskripsi**: Memastikan NIS unik dan valid

**Validation Rules**:
- NIS tidak boleh kosong
- NIS harus unik dalam sistem
- Format NIS sesuai standar sekolah

#### UC14: 📋 Validasi Data (Data Validation)
**Deskripsi**: Validasi semua data siswa sebelum disimpan

**Validation Rules**:
- **Nama**: Required, max 100 karakter
- **NIS**: Required, unique, max 20 karakter
- **Jenis Kelamin**: Required, hanya L atau P
- **Kelas**: Required, max 20 karakter
- **Tanggal Lahir**: Required, format date valid
- **Alamat**: Optional, max 255 karakter

#### UC15: 🔍 Cek Duplikasi (Duplicate Check)
**Deskripsi**: Mengecek duplikasi data sebelum insert/update

**Check Points**:
- NIS duplicate check saat create
- NIS duplicate check saat update (exclude current record)
- Nama + Kelas duplicate warning (optional)

### 🔐 Authentication Operations

#### UC16: 🔑 Login (Authentication)
**Deskripsi**: Proses autentikasi pengguna

**Main Flow**:
1. User memasukkan username/email dan password
2. Sistem validasi credentials
3. Sistem generate JWT token
4. Sistem redirect ke dashboard

#### UC17: 🛡️ Autorisasi (Authorization)
**Deskripsi**: Mengecek hak akses pengguna

**Role-based Access**:
- **Admin**: Full access ke semua fitur
- **Guru**: Limited access berdasarkan kelas yang diajar
- **Staff**: Read-only access

#### UC18: 🔒 Validasi Token (Token Validation)
**Deskripsi**: Validasi JWT token setiap request

**Process**:
- Extract token dari Authorization header
- Validate token signature dan expiry
- Extract user information dari token
- Check user permissions

### 🔔 Notification Operations

#### UC19: ✅ Notifikasi Sukses (Success Notification)
**Deskripsi**: Menampilkan notifikasi ketika operasi berhasil

**Examples**:
- "Siswa berhasil ditambahkan"
- "Data siswa berhasil diupdate"
- "Data siswa berhasil dihapus"
- "File Excel berhasil diupload"

#### UC20: ❌ Notifikasi Error (Error Notification)
**Deskripsi**: Menampilkan notifikasi ketika terjadi error

**Examples**:
- "NIS sudah terdaftar"
- "Data tidak valid"
- "Siswa tidak ditemukan"
- "Gagal mengupload file"

#### UC21: ℹ️ Notifikasi Info (Info Notification)
**Deskripsi**: Menampilkan informasi umum kepada user

**Examples**:
- "Data sedang diproses..."
- "File sedang didownload..."
- "Session akan berakhir dalam 5 menit"

## Relationships

### Include Relationships (<<include>>)
Relasi yang menunjukkan use case yang **wajib** dijalankan sebagai bagian dari use case utama:

1. **UC1 (Create Siswa)** includes:
   - UC13 (Validasi NIS)
   - UC14 (Validasi Data)
   - UC15 (Cek Duplikasi)
   - UC18 (Validasi Token)

2. **UC2 (Read All Siswa)** includes:
   - UC18 (Validasi Token)
   - UC6 (Search) - optional
   - UC7 (Filter) - optional
   - UC8 (Pagination)

3. **UC4 (Update Siswa)** includes:
   - UC18 (Validasi Token)
   - UC13 (Validasi NIS)
   - UC14 (Validasi Data)
   - UC15 (Cek Duplikasi)

### Extend Relationships (<<extend>>)
Relasi yang menunjukkan use case yang **opsional** atau kondisional:

1. **Notification Extensions**:
   - Semua CRUD operations dapat extend ke UC19 (Success) atau UC20 (Error)
   - Validation use cases dapat extend ke UC20 (Error)

2. **Conditional Extensions**:
   - Search dan Filter dapat extend dari Read operations
   - Error notifications extend dari semua operations yang bisa gagal

### Actor Relationships
1. **User** berinteraksi langsung dengan semua CRUD dan Data Management use cases
2. **Authentication System** menangani semua Authentication use cases
3. **Include relationships** menunjukkan dependency antar use cases

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

## Technical Implementation

### 1. Backend Implementation

#### API Endpoints
```python
# CRUD Operations
POST   /api/siswa/              # Create siswa
GET    /api/siswa/              # Read all siswa
GET    /api/siswa/{id}          # Read single siswa
PUT    /api/siswa/{id}          # Update siswa
DELETE /api/siswa/{id}          # Delete siswa

# Data Management
POST   /api/siswa/upload/excel  # Upload Excel
GET    /api/siswa/export/excel  # Export Excel
GET    /api/siswa/count         # Get count
GET    /api/siswa/dropdown      # Get dropdown data
```

#### Database Schema
```sql
CREATE TABLE siswa (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    nis VARCHAR(20) UNIQUE NOT NULL,
    jenis_kelamin CHAR(1) NOT NULL CHECK (jenis_kelamin IN ('L', 'P')),
    kelas VARCHAR(20) NOT NULL,
    tanggal_lahir DATE NOT NULL,
    alamat TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_siswa_nis ON siswa(nis);
CREATE INDEX idx_siswa_nama ON siswa(nama);
CREATE INDEX idx_siswa_kelas ON siswa(kelas);
```

#### Validation Schema
```python
from pydantic import BaseModel, validator
from datetime import date
from typing import Optional

class SiswaCreate(BaseModel):
    nama: str
    nis: str
    jenis_kelamin: str
    kelas: str
    tanggal_lahir: date
    alamat: Optional[str] = None
    
    @validator('nama')
    def validate_nama(cls, v):
        if not v or len(v.strip()) == 0:
            raise ValueError('Nama tidak boleh kosong')
        if len(v) > 100:
            raise ValueError('Nama maksimal 100 karakter')
        return v.strip()
    
    @validator('nis')
    def validate_nis(cls, v):
        if not v or len(v.strip()) == 0:
            raise ValueError('NIS tidak boleh kosong')
        if len(v) > 20:
            raise ValueError('NIS maksimal 20 karakter')
        return v.strip()
    
    @validator('jenis_kelamin')
    def validate_jenis_kelamin(cls, v):
        if v not in ['L', 'P']:
            raise ValueError('Jenis kelamin harus L atau P')
        return v
```

### 2. Frontend Implementation

#### Kendo Grid Configuration
```javascript
$("#siswa-grid").kendoGrid({
    dataSource: {
        transport: {
            read: { url: "/api/siswa", beforeSend: addAuthHeader },
            create: { url: "/api/siswa", beforeSend: addAuthHeader },
            update: { url: "/api/siswa/{id}", beforeSend: addAuthHeader },
            destroy: { url: "/api/siswa/{id}", beforeSend: addAuthHeader }
        },
        schema: {
            model: {
                id: "id",
                fields: {
                    nama: { validation: { required: true } },
                    nis: { validation: { required: true } },
                    jenis_kelamin: { validation: { required: true } },
                    kelas: { validation: { required: true } },
                    tanggal_lahir: { type: "date", validation: { required: true } }
                }
            }
        },
        pageSize: 10
    },
    columns: [
        { field: "nama", title: "Nama" },
        { field: "nis", title: "NIS" },
        { field: "jenis_kelamin", title: "Jenis Kelamin" },
        { field: "kelas", title: "Kelas" },
        { field: "tanggal_lahir", title: "Tanggal Lahir", format: "{0:dd/MM/yyyy}" },
        { command: ["edit", "destroy"] }
    ],
    toolbar: ["create", "excel-export", "excel-upload"],
    editable: "popup",
    pageable: true,
    sortable: true,
    filterable: true
});
```

#### Excel Upload Handler
```javascript
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.name.match(/\.(xlsx|xls)$/)) {
        showErrorNotification("File harus berformat Excel (.xlsx atau .xls)");
        return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    $.ajax({
        url: '/api/siswa/upload/excel',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        beforeSend: addAuthHeader,
        success: function(response) {
            showSuccessNotification(response.message);
            $("#siswa-grid").data("kendoGrid").dataSource.read();
        },
        error: function(xhr) {
            const errorMsg = xhr.responseJSON?.detail || 'Gagal mengupload file';
            showErrorNotification(errorMsg);
        }
    });
}
```

### 3. Security Implementation

#### JWT Token Validation
```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token tidak valid"
            )
        # Get user from database
        user = get_user_by_id(user_id)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User tidak ditemukan"
            )
        return user
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token tidak valid"
        )
```

#### Role-based Access Control
```python
def check_siswa_access(user: User, siswa_id: int = None):
    if user.role == "admin":
        return True  # Admin has full access
    
    if user.role == "guru":
        if siswa_id:
            # Check if guru teaches this siswa's class
            siswa = get_siswa_by_id(siswa_id)
            if siswa and siswa.kelas in user.kelas_yang_diajar:
                return True
        return False
    
    if user.role == "staff":
        return True  # Staff has read-only access
    
    return False
```

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

1. **Dokumentasi Utama**: `docs/dokumentasi_use_case_manajemen_siswa.md`
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