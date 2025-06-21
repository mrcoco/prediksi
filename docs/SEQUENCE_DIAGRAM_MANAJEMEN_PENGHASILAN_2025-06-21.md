# Sequence Diagram Manajemen Penghasilan - Sistem EduPro

## Executive Summary

Dokumen ini berisi sequence diagram untuk modul manajemen penghasilan orang tua dalam aplikasi EduPro. Diagram menggambarkan alur interaksi antara User, Frontend, Backend API, dan Database untuk operasi CRUD (Create, Read, Update, Delete) data penghasilan orang tua siswa.

## Daftar Isi

1. [Overview Sistem](#overview-sistem)
2. [Sequence Diagram - Format Mermaid](#sequence-diagram-format-mermaid)
3. [Sequence Diagram - Format PlantUML](#sequence-diagram-format-plantuml)
4. [Penjelasan Alur Sistem](#penjelasan-alur-sistem)
5. [Komponen Sistem](#komponen-sistem)
6. [Error Handling](#error-handling)

## Overview Sistem

Modul manajemen penghasilan orang tua memiliki fitur-fitur utama:
- **Create**: Menambah data penghasilan baru dengan validasi siswa
- **Read**: Menampilkan daftar penghasilan dengan JOIN ke tabel siswa
- **Update**: Mengubah data dengan perhitungan ulang total dan kategori
- **Delete**: Menghapus data penghasilan
- **Export**: Export data ke format Excel
- **Authentication**: Semua operasi memerlukan Bearer token

### Fitur Khusus:
- **Auto Calculation**: Total penghasilan = penghasilan_ayah + penghasilan_ibu
- **Auto Categorization**: Kategori berdasarkan total (Rendah/Menengah/Tinggi)
- **Duplicate Prevention**: Satu siswa hanya boleh punya satu data penghasilan
- **JOIN Query**: Data ditampilkan dengan nama siswa

## Sequence Diagram - Format Mermaid

### 1. Create Penghasilan (Tambah Data Baru)

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (Kendo Grid)
    participant A as Backend API
    participant D as Database
    participant S as Siswa Table
    participant P as Penghasilan Table

    Note over U,P: Create Penghasilan Orang Tua

    U->>F: Click "Add New" button
    F->>U: Show form popup
    U->>F: Fill form (siswa_id, penghasilan_ayah, penghasilan_ibu, etc.)
    U->>F: Click "Save" button
    
    F->>A: POST /api/penghasilan/<br/>Bearer Token + Data
    
    Note over A: Authentication Check
    A->>A: Validate Bearer Token
    
    Note over A: Student Validation
    A->>S: SELECT * FROM siswa WHERE id = siswa_id
    S-->>A: Return siswa data or null
    
    alt Siswa tidak ditemukan
        A-->>F: HTTP 404 - Siswa tidak ditemukan
        F-->>U: Show error notification
    else Siswa valid
        Note over A: Duplicate Check
        A->>P: SELECT * FROM penghasilan_ortu WHERE siswa_id = ?
        P-->>A: Return existing data or null
        
        alt Data sudah ada
            A-->>F: HTTP 400 - Data sudah ada
            F-->>U: Show error notification
        else Data belum ada
            Note over A: Business Logic
            A->>A: Calculate total_penghasilan = ayah + ibu
            A->>A: Determine kategori_penghasilan<br/>(Tinggi ≥5jt, Menengah ≥2.3jt, Rendah <2.3jt)
            
            Note over A: Data Persistence
            A->>P: INSERT INTO penghasilan_ortu
            P-->>A: Return new record with ID
            
            A-->>F: HTTP 201 - Created with data
            F->>F: Refresh grid data
            F-->>U: Show success notification
        end
    end
```

### 2. Read Penghasilan (Tampil Data)

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (Kendo Grid)
    participant A as Backend API
    participant D as Database
    participant S as Siswa Table
    participant P as Penghasilan Table

    Note over U,P: Load Penghasilan Data

    U->>F: Navigate to Penghasilan page
    F->>A: GET /api/penghasilan?skip=0&limit=100<br/>Bearer Token
    
    Note over A: Authentication Check
    A->>A: Validate Bearer Token
    
    Note over A: JOIN Query
    A->>D: SELECT p.*, s.nama as nama_siswa<br/>FROM penghasilan_ortu p<br/>JOIN siswa s ON p.siswa_id = s.id<br/>LIMIT 100 OFFSET 0
    
    D-->>A: Return joined data with siswa names
    A-->>F: HTTP 200 - Array of penghasilan with nama_siswa
    
    F->>F: Populate Kendo Grid
    F-->>U: Display data table with columns:<br/>Nama Siswa, Penghasilan Ayah/Ibu,<br/>Total, Kategori, Actions
```

### 3. Update Penghasilan (Edit Data)

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (Kendo Grid)
    participant A as Backend API
    participant D as Database
    participant P as Penghasilan Table

    Note over U,P: Update Penghasilan Data

    U->>F: Click "Edit" button on row
    F->>A: GET /api/penghasilan/{id}<br/>Bearer Token
    A->>P: SELECT * FROM penghasilan_ortu WHERE id = ?
    P-->>A: Return penghasilan data
    A-->>F: HTTP 200 - Penghasilan data
    
    F->>U: Show edit form with current data
    U->>F: Modify fields (penghasilan_ayah, penghasilan_ibu, etc.)
    U->>F: Click "Update" button
    
    F->>A: PUT /api/penghasilan/{id}<br/>Bearer Token + Updated Data
    
    Note over A: Authentication & Validation
    A->>A: Validate Bearer Token
    A->>P: SELECT * FROM penghasilan_ortu WHERE id = ?
    P-->>A: Return existing record or null
    
    alt Record tidak ditemukan
        A-->>F: HTTP 404 - Data tidak ditemukan
        F-->>U: Show error notification
    else Record ditemukan
        Note over A: Business Logic Update
        A->>A: Check if penghasilan_ayah or penghasilan_ibu changed
        
        alt Penghasilan berubah
            A->>A: Recalculate total_penghasilan = ayah + ibu
            A->>A: Redetermine kategori_penghasilan<br/>(Tinggi ≥5jt, Menengah ≥2.3jt, Rendah <2.3jt)
        end
        
        A->>A: Update timestamp = now()
        
        Note over A: Data Persistence
        A->>P: UPDATE penghasilan_ortu SET ... WHERE id = ?
        P-->>A: Return updated record
        
        A-->>F: HTTP 200 - Updated data
        F->>F: Refresh grid data
        F-->>U: Show success notification
    end
```

### 4. Delete Penghasilan (Hapus Data)

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (Kendo Grid)
    participant A as Backend API
    participant D as Database
    participant P as Penghasilan Table

    Note over U,P: Delete Penghasilan Data

    U->>F: Click "Delete" button on row
    F->>U: Show confirmation modal with:<br/>Nama Siswa, Penghasilan details
    U->>F: Click "Confirm Delete"
    
    F->>A: DELETE /api/penghasilan/{id}<br/>Bearer Token
    
    Note over A: Authentication & Validation
    A->>A: Validate Bearer Token
    A->>P: SELECT * FROM penghasilan_ortu WHERE id = ?
    P-->>A: Return record or null
    
    alt Record tidak ditemukan
        A-->>F: HTTP 404 - Data tidak ditemukan
        F-->>U: Show error notification
    else Record ditemukan
        Note over A: Data Deletion
        A->>P: DELETE FROM penghasilan_ortu WHERE id = ?
        P-->>A: Confirm deletion
        
        A-->>F: HTTP 204 - No Content (Success)
        F->>F: Refresh grid data
        F-->>U: Show success notification<br/>Remove row from grid
    end
```

### 5. Export Excel

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as Backend API
    participant D as Database
    participant S as Siswa Table
    participant P as Penghasilan Table

    Note over U,P: Export Penghasilan to Excel

    U->>F: Click "Export Excel" button
    F->>A: GET /api/penghasilan/export/excel<br/>Bearer Token
    
    Note over A: Authentication Check
    A->>A: Validate Bearer Token
    
    Note over A: Data Collection
    A->>D: SELECT p.*, s.nama as nama_siswa<br/>FROM penghasilan_ortu p<br/>JOIN siswa s ON p.siswa_id = s.id<br/>ORDER BY s.nama
    
    D-->>A: Return all penghasilan data with siswa names
    
    Note over A: Excel Generation
    A->>A: Convert data to pandas DataFrame
    A->>A: Generate Excel file in memory (BytesIO)
    A->>A: Set filename: "Data_Penghasilan_Orang_Tua.xlsx"
    
    A-->>F: HTTP 200 - StreamingResponse<br/>Content-Type: application/vnd.openxmlformats-<br/>officedocument.spreadsheetml.sheet
    
    F->>F: Create download link
    F->>F: Trigger file download
    F-->>U: Download Excel file<br/>Show success notification
```

## Sequence Diagram - Format PlantUML

### 1. Create Penghasilan (Tambah Data Baru)

```plantuml
@startuml Create_Penghasilan
!define RECTANGLE class

participant "User" as U
participant "Frontend\n(Kendo Grid)" as F
participant "Backend API\n(/api/penghasilan)" as A
participant "Database" as D
participant "Siswa Table" as S
participant "Penghasilan Table" as P

title Create Penghasilan Orang Tua - EduPro System

note over U,P: Create New Penghasilan Data

U -> F: Click "Add New" button
F -> U: Show form popup
U -> F: Fill form data:\n- siswa_id\n- penghasilan_ayah\n- penghasilan_ibu\n- pekerjaan_ayah/ibu\n- pendidikan_ayah/ibu
U -> F: Click "Save" button

F -> A: POST /api/penghasilan/\nBearer Token + Form Data

note over A: Authentication & Authorization
A -> A: Validate Bearer Token\nCheck user permissions

note over A: Student Validation
A -> S: SELECT * FROM siswa\nWHERE id = siswa_id
S --> A: Return siswa record or null

alt Siswa tidak ditemukan
    A --> F: HTTP 404\n"Siswa dengan ID tidak ditemukan"
    F --> U: Show error notification
else Siswa valid
    note over A: Duplicate Prevention
    A -> P: SELECT * FROM penghasilan_ortu\nWHERE siswa_id = ?
    P --> A: Return existing record or null
    
    alt Data penghasilan sudah ada
        A --> F: HTTP 400\n"Data penghasilan sudah ada"
        F --> U: Show error notification
    else Data belum ada
        note over A: Business Logic Calculation
        A -> A: total_penghasilan = \npenghasilan_ayah + penghasilan_ibu
        A -> A: Determine kategori_penghasilan:\n- Tinggi: ≥ 5,000,000\n- Menengah: ≥ 2,300,000\n- Rendah: < 2,300,000
        
        note over A: Data Persistence
        A -> P: INSERT INTO penghasilan_ortu\n(siswa_id, penghasilan_ayah, penghasilan_ibu,\ntotal_penghasilan, kategori_penghasilan, ...)\nVALUES (...)
        P --> A: Return new record with generated ID
        
        A --> F: HTTP 201 Created\nReturn new penghasilan data
        F -> F: Refresh Kendo Grid datasource
        F --> U: Show success notification\n"Data penghasilan berhasil ditambahkan"
    end
end

@enduml
```

### 2. Read Penghasilan (Tampil Data)

```plantuml
@startuml Read_Penghasilan
!define RECTANGLE class

participant "User" as U
participant "Frontend\n(Kendo Grid)" as F
participant "Backend API\n(/api/penghasilan)" as A
participant "Database" as D
participant "Siswa Table" as S
participant "Penghasilan Table" as P

title Read Penghasilan Data - EduPro System

note over U,P: Load and Display Penghasilan Data

U -> F: Navigate to Penghasilan page\nOr refresh grid
F -> A: GET /api/penghasilan\n?skip=0&limit=100\nBearer Token

note over A: Authentication Check
A -> A: Validate Bearer Token\nExtract user info

note over A: Data Retrieval with JOIN
A -> D: SELECT p.id, p.siswa_id,\ns.nama as nama_siswa,\np.penghasilan_ayah, p.penghasilan_ibu,\np.pekerjaan_ayah, p.pekerjaan_ibu,\np.pendidikan_ayah, p.pendidikan_ibu,\np.total_penghasilan, p.kategori_penghasilan,\np.created_at, p.updated_at\nFROM penghasilan_ortu p\nJOIN siswa s ON p.siswa_id = s.id\nORDER BY s.nama\nLIMIT 100 OFFSET 0

D --> A: Return joined records with siswa names

note over A: Data Transformation
A -> A: Convert query results to JSON array\nFormat currency values\nFormat timestamps

A --> F: HTTP 200 OK\nArray of penghasilan objects with nama_siswa

F -> F: Populate Kendo Grid:\n- Configure columns\n- Set data source\n- Enable pagination, sorting, filtering

F --> U: Display data table with columns:\n- Nama Siswa\n- Penghasilan Ayah (formatted)\n- Penghasilan Ibu (formatted)\n- Pekerjaan Ayah/Ibu\n- Pendidikan Ayah/Ibu\n- Total Penghasilan (formatted)\n- Kategori Penghasilan (badge)\n- Actions (Edit/Delete)

@enduml
```

### 3. Update Penghasilan (Edit Data)

```plantuml
@startuml Update_Penghasilan
!define RECTANGLE class

participant "User" as U
participant "Frontend\n(Kendo Grid)" as F
participant "Backend API\n(/api/penghasilan)" as A
participant "Database" as D
participant "Penghasilan Table" as P

title Update Penghasilan Data - EduPro System

note over U,P: Edit Existing Penghasilan Data

U -> F: Click "Edit" button on grid row
F -> A: GET /api/penghasilan/{id}\nBearer Token
A -> P: SELECT * FROM penghasilan_ortu\nWHERE id = ?
P --> A: Return penghasilan record
A --> F: HTTP 200\nPenghasilan data for editing

F -> U: Show edit form popup\nPre-filled with current data
U -> F: Modify form fields:\n- penghasilan_ayah\n- penghasilan_ibu\n- pekerjaan fields\n- pendidikan fields
U -> F: Click "Update" button

F -> A: PUT /api/penghasilan/{id}\nBearer Token + Updated Data

note over A: Authentication & Validation
A -> A: Validate Bearer Token
A -> P: SELECT * FROM penghasilan_ortu\nWHERE id = ?
P --> A: Return existing record or null

alt Record tidak ditemukan
    A --> F: HTTP 404\n"Data penghasilan tidak ditemukan"
    F --> U: Show error notification
else Record ditemukan
    note over A: Business Logic for Updates
    A -> A: Check if penghasilan_ayah\nor penghasilan_ibu changed
    
    alt Penghasilan amounts changed
        A -> A: Recalculate:\ntotal_penghasilan = \nnew_ayah + new_ibu
        A -> A: Redetermine kategori_penghasilan:\n- Tinggi: ≥ 5,000,000\n- Menengah: ≥ 2,300,000\n- Rendah: < 2,300,000
    end
    
    A -> A: Set updated_at = current_timestamp()
    
    note over A: Data Update
    A -> P: UPDATE penghasilan_ortu\nSET penghasilan_ayah = ?,\npenghasilan_ibu = ?,\npekerjaan_ayah = ?, ...,\ntotal_penghasilan = ?,\nkategori_penghasilan = ?,\nupdated_at = ?\nWHERE id = ?
    P --> A: Return updated record
    
    A --> F: HTTP 200 OK\nUpdated penghasilan data
    F -> F: Refresh grid data source
    F --> U: Show success notification\n"Data penghasilan berhasil diperbarui"
end

@enduml
```

### 4. Delete Penghasilan (Hapus Data)

```plantuml
@startuml Delete_Penghasilan
!define RECTANGLE class

participant "User" as U
participant "Frontend\n(Kendo Grid)" as F
participant "Backend API\n(/api/penghasilan)" as A
participant "Database" as D
participant "Penghasilan Table" as P

title Delete Penghasilan Data - EduPro System

note over U,P: Delete Penghasilan Record

U -> F: Click "Delete" button on grid row
F -> U: Show confirmation modal:\n"Hapus data penghasilan untuk [Nama Siswa]?\nPenghasilan Ayah: Rp X\nPenghasilan Ibu: Rp Y\nTotal: Rp Z\nKategori: [Kategori]"

U -> F: Click "Confirm Delete" button

F -> A: DELETE /api/penghasilan/{id}\nBearer Token

note over A: Authentication & Validation
A -> A: Validate Bearer Token\nCheck delete permissions
A -> P: SELECT * FROM penghasilan_ortu\nWHERE id = ?
P --> A: Return record or null

alt Record tidak ditemukan
    A --> F: HTTP 404\n"Data penghasilan tidak ditemukan"
    F --> U: Show error notification
else Record ditemukan
    note over A: Data Deletion
    A -> P: DELETE FROM penghasilan_ortu\nWHERE id = ?
    P --> A: Confirm successful deletion
    
    A --> F: HTTP 204 No Content\n(Successful deletion)
    F -> F: Remove row from grid\nRefresh data source
    F --> U: Show success notification\n"Data penghasilan berhasil dihapus"
end

@enduml
```

### 5. Export Excel

```plantuml
@startuml Export_Penghasilan_Excel
!define RECTANGLE class

participant "User" as U
participant "Frontend" as F
participant "Backend API\n(/api/penghasilan)" as A
participant "Database" as D
participant "Siswa Table" as S
participant "Penghasilan Table" as P

title Export Penghasilan to Excel - EduPro System

note over U,P: Export All Penghasilan Data to Excel

U -> F: Click "Export Excel" button in toolbar
F -> A: GET /api/penghasilan/export/excel\nBearer Token

note over A: Authentication Check
A -> A: Validate Bearer Token\nCheck export permissions

note over A: Data Collection for Export
A -> D: SELECT p.id, s.nama as nama_siswa,\np.penghasilan_ayah, p.penghasilan_ibu,\np.pekerjaan_ayah, p.pekerjaan_ibu,\np.pendidikan_ayah, p.pendidikan_ibu,\np.total_penghasilan, p.kategori_penghasilan,\np.created_at, p.updated_at\nFROM penghasilan_ortu p\nJOIN siswa s ON p.siswa_id = s.id\nORDER BY s.nama

D --> A: Return all penghasilan records\nwith siswa names

note over A: Excel File Generation
A -> A: Transform query results to\nstandardized format:\n- Format currency values\n- Format dates\n- Clean text fields
A -> A: Create pandas DataFrame\nfrom transformed data
A -> A: Generate Excel file using\nopenpyxl engine in BytesIO buffer
A -> A: Set worksheet name:\n"Data Penghasilan Orang Tua"
A -> A: Set download filename:\n"Data_Penghasilan_Orang_Tua.xlsx"

A --> F: HTTP 200 OK\nStreamingResponse with:\n- Content-Type: application/vnd.\nopenxmlformats-officedocument.\nspreadsheetml.sheet\n- Content-Disposition: attachment

F -> F: Create temporary download link\nTrigger browser download
F --> U: File download starts\nShow success notification:\n"File Excel berhasil diunduh"

note over U: User receives Excel file with:\n- Complete penghasilan data\n- Proper formatting\n- Ready for analysis

@enduml
```

## Penjelasan Alur Sistem

### 1. Arsitektur Sistem

Sistem manajemen penghasilan menggunakan arsitektur 4-layer:

1. **Presentation Layer**: Frontend dengan Kendo UI Grid
2. **API Layer**: FastAPI dengan RESTful endpoints
3. **Business Logic Layer**: Validasi, kalkulasi, dan aturan bisnis
4. **Data Layer**: PostgreSQL database dengan relasi

### 2. Fitur-Fitur Khusus

#### Auto Calculation
- **Total Penghasilan**: Otomatis dihitung dari penghasilan_ayah + penghasilan_ibu
- **Kategori Penghasilan**: Otomatis ditentukan berdasarkan total:
  - Tinggi: ≥ Rp 5.000.000 (2x UMK Jogja)
  - Menengah: Rp 2.300.000 - Rp 4.999.999 (UMK Jogja)
  - Rendah: < Rp 2.300.000

#### Data Integrity
- **Unique Constraint**: Satu siswa hanya boleh punya satu data penghasilan
- **Foreign Key**: siswa_id harus valid (ada di tabel siswa)
- **Validation**: Semua field wajib diisi dengan format yang benar

#### Performance Optimization
- **JOIN Query**: Data ditampilkan dengan nama siswa tanpa N+1 query
- **Pagination**: Mendukung skip/limit untuk data besar
- **Indexing**: Primary key dan foreign key terindex

### 3. Security Features

#### Authentication & Authorization
- **Bearer Token**: Semua endpoint memerlukan JWT token
- **Role-based Access**: User harus punya akses ke modul penghasilan
- **Token Validation**: Setiap request divalidasi token-nya

#### Data Protection
- **SQL Injection Prevention**: Menggunakan parameterized query
- **Input Validation**: Validasi di level schema dan database
- **Error Handling**: Error message tidak expose sensitive data

## Komponen Sistem

### 1. Frontend Components

#### Kendo Grid Configuration
```javascript
{
    dataSource: {
        transport: {
            read: { url: "/api/penghasilan", beforeSend: addAuthHeader },
            create: { url: "/api/penghasilan", beforeSend: addAuthHeader },
            update: { url: "/api/penghasilan/{id}", beforeSend: addAuthHeader }
        }
    },
    columns: [
        { field: "nama_siswa", title: "Nama Siswa", width: 180 },
        { field: "penghasilan_ayah", title: "Penghasilan Ayah", width: 125 },
        { field: "penghasilan_ibu", title: "Penghasilan Ibu", width: 100 },
        { field: "total_penghasilan", title: "Total", width: 100 },
        { field: "kategori_penghasilan", title: "Kategori", width: 85 }
    ]
}
```

#### Form Template
```html
<div id="penghasilan-template">
    <div class="form-group">
        <label>Siswa:</label>
        <select data-bind="value: siswa_id" data-role="dropdownlist"></select>
    </div>
    <div class="form-group">
        <label>Penghasilan Ayah:</label>
        <input data-bind="value: penghasilan_ayah" type="number" min="0" />
    </div>
    <!-- ... other fields ... -->
</div>
```

### 2. Backend Components

#### API Router Structure
```python
@router.post("/", response_model=PenghasilanOrtuResponse)
@router.get("/", response_model=List[Dict])
@router.get("/{penghasilan_id}", response_model=PenghasilanOrtuResponse)
@router.put("/{penghasilan_id}", response_model=PenghasilanOrtuResponse)
@router.delete("/{penghasilan_id}", status_code=204)
@router.get("/export/excel")
```

#### Database Schema
```sql
CREATE TABLE penghasilan_ortu (
    id SERIAL PRIMARY KEY,
    siswa_id INTEGER REFERENCES siswa(id),
    penghasilan_ayah DECIMAL(15,2) NOT NULL,
    penghasilan_ibu DECIMAL(15,2) NOT NULL,
    pekerjaan_ayah VARCHAR(100),
    pekerjaan_ibu VARCHAR(100),
    pendidikan_ayah VARCHAR(100),
    pendidikan_ibu VARCHAR(100),
    total_penghasilan DECIMAL(15,2) NOT NULL,
    kategori_penghasilan VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(siswa_id)
);
```

### 3. Business Logic Components

#### Calculation Engine
```python
def calculate_income_category(total_penghasilan: float) -> str:
    if total_penghasilan >= 5000000:
        return "Tinggi"
    elif total_penghasilan >= 2300000:
        return "Menengah"
    else:
        return "Rendah"
```

#### Validation Rules
```python
def validate_penghasilan_data(data: PenghasilanOrtuCreate, db: Session):
    # Check if student exists
    siswa = db.query(Siswa).filter(Siswa.id == data.siswa_id).first()
    if not siswa:
        raise HTTPException(404, "Siswa tidak ditemukan")
    
    # Check for duplicates
    existing = db.query(PenghasilanOrtu).filter(
        PenghasilanOrtu.siswa_id == data.siswa_id
    ).first()
    if existing:
        raise HTTPException(400, "Data penghasilan sudah ada")
```

## Error Handling

### 1. HTTP Status Codes

| Status Code | Scenario | Response |
|-------------|----------|----------|
| 200 | Success (Read/Update) | Data returned |
| 201 | Success (Create) | New data returned |
| 204 | Success (Delete) | No content |
| 400 | Bad Request | Validation error/duplicate |
| 401 | Unauthorized | Invalid/missing token |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Internal server error |

### 2. Error Response Format

```json
{
    "detail": "Error message in Indonesian",
    "status_code": 400,
    "timestamp": "2025-06-21T10:30:00Z"
}
```

### 3. Frontend Error Handling

```javascript
// Kendo Grid error handling
error: function(e) {
    if (e.status === 401) {
        showErrorNotification("Sesi telah berakhir, silakan login kembali");
        redirectToLogin();
    } else if (e.status === 400) {
        showErrorNotification(e.responseJSON.detail);
    } else {
        showErrorNotification("Terjadi kesalahan sistem");
    }
}
```

### 4. Common Error Scenarios

1. **Siswa tidak ditemukan**: Saat create/update dengan siswa_id invalid
2. **Data duplikat**: Saat create untuk siswa yang sudah punya data penghasilan  
3. **Token expired**: Saat melakukan operasi dengan token yang sudah kadaluarsa
4. **Validation error**: Saat input data tidak sesuai format/constraint
5. **Network error**: Saat koneksi ke backend bermasalah

## Kesimpulan

Sequence diagram manajemen penghasilan menunjukkan alur sistem yang komprehensif dengan fitur:

- ✅ **Complete CRUD Operations** dengan validasi dan error handling
- ✅ **Auto Calculation** untuk total dan kategori penghasilan  
- ✅ **Data Integrity** dengan foreign key dan unique constraints
- ✅ **Security** dengan Bearer token authentication
- ✅ **Performance** dengan JOIN query dan pagination
- ✅ **Export Functionality** ke format Excel
- ✅ **User Experience** dengan confirmation modal dan notifications

Sistem ini siap untuk production dengan dokumentasi lengkap dan implementasi yang robust.

---

**Dibuat pada**: 21 Juni 2025  
**Versi**: 1.0  
**Status**: Production Ready  
**Sistem**: EduPro - Sistem Informasi Prediksi Prestasi Siswa 