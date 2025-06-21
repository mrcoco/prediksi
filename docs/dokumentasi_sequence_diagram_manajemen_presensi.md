# Dokumentasi Sequence Diagram Manajemen Presensi - Sistem EduPro

## Executive Summary

Dokumen ini berisi sequence diagram untuk modul manajemen presensi siswa dalam aplikasi EduPro. Diagram menggambarkan alur interaksi yang komprehensif antara User, Frontend, Backend API, dan Database untuk operasi CRUD lengkap dengan fitur auto-calculation, real-time validation, dan export Excel.

## Daftar Isi

1. [Overview Sistem](#overview-sistem)
2. [Sequence Diagram - Format Mermaid](#sequence-diagram-format-mermaid)
3. [Sequence Diagram - Format PlantUML](#sequence-diagram-format-plantuml)
4. [Penjelasan Alur Sistem](#penjelasan-alur-sistem)
5. [Komponen Sistem](#komponen-sistem)
6. [Business Logic](#business-logic)
7. [Error Handling](#error-handling)
8. [Kesimpulan](#kesimpulan)

## Overview Sistem

Modul manajemen presensi siswa memiliki fitur-fitur utama:
- **Create**: Menambah data presensi baru dengan validasi semester & tahun ajaran
- **Read**: Menampilkan daftar presensi dengan JOIN ke tabel siswa
- **Update**: Mengubah data dengan perhitungan ulang persentase dan kategori
- **Delete**: Menghapus data presensi dengan konfirmasi detail
- **Export**: Export data ke format Excel dengan formatting
- **Filter**: Filter data berdasarkan siswa_id (optional)
- **Authentication**: Semua operasi memerlukan Bearer token

### Fitur Khusus:
- **Auto Calculation**: Persentase kehadiran = (hadir/total_hari) × 100
- **Auto Categorization**: Kategori berdasarkan persentase (Tinggi ≥80%, Sedang ≥75%, Rendah <75%)
- **Real-time Calculation**: Form menghitung otomatis saat input berubah
- **Duplicate Prevention**: Satu siswa hanya boleh punya satu data per semester & tahun ajaran
- **JOIN Query**: Data ditampilkan dengan nama siswa

## Sequence Diagram - Format Mermaid

File diagram Mermaid tersimpan di: `docs/sequence_diagram_manajemen_presensi.mmd`

### Cara Menggunakan Diagram Mermaid:
1. **Mermaid Live Editor**: https://mermaid.live/
2. **VS Code Extension**: Mermaid Preview
3. **GitHub**: Otomatis render di README.md
4. **Documentation Tools**: GitBook, Notion, Confluence

## Sequence Diagram - Format PlantUML

File diagram PlantUML tersimpan di: `docs/sequence_diagram_manajemen_presensi.puml`

### Cara Menggunakan Diagram PlantUML:
1. **PlantUML Server**: http://www.plantuml.com/plantuml/
2. **VS Code Extension**: PlantUML
3. **IntelliJ Plugin**: PlantUML Integration
4. **CLI Tool**: plantuml.jar

### Generate Images:
```bash
# Generate PNG
java -jar plantuml.jar sequence_diagram_manajemen_presensi.puml

# Generate SVG
java -jar plantuml.jar -tsvg sequence_diagram_manajemen_presensi.puml
```

## Penjelasan Alur Sistem

### 1. Arsitektur Sistem

Sistem manajemen presensi menggunakan arsitektur 4-layer:

1. **Presentation Layer**: Frontend dengan Kendo UI Grid
2. **API Layer**: FastAPI dengan RESTful endpoints
3. **Business Logic Layer**: Auto-calculation, validasi, dan aturan bisnis
4. **Data Layer**: PostgreSQL database dengan relasi

### 2. Fitur-Fitur Khusus

#### Auto Calculation Engine
- **Total Hari**: Otomatis dihitung dari jumlah_hadir + jumlah_sakit + jumlah_izin + jumlah_alpa
- **Persentase Kehadiran**: Otomatis dihitung = (jumlah_hadir / total_hari) × 100
- **Kategori Kehadiran**: Otomatis ditentukan berdasarkan persentase:
  - Tinggi: ≥ 80% (standar kehadiran baik)
  - Sedang: ≥ 75% (standar kehadiran cukup)
  - Rendah: < 75% (perlu perhatian khusus)

#### Real-time Form Calculation
- **Frontend Calculation**: Form menghitung otomatis saat user mengetik
- **Live Update**: Persentase dan kategori berubah real-time
- **Visual Feedback**: User melihat hasil perhitungan sebelum save

#### Data Integrity
- **Unique Constraint**: Satu siswa hanya boleh punya satu data presensi per semester & tahun ajaran
- **Foreign Key**: siswa_id harus valid (ada di tabel siswa)
- **Validation**: Semua field wajib diisi dengan format yang benar

#### Performance Optimization
- **JOIN Query**: Data ditampilkan dengan nama siswa tanpa N+1 query
- **Pagination**: Mendukung skip/limit untuk data besar
- **Indexing**: Primary key dan foreign key terindex
- **Filter Support**: Optional filter berdasarkan siswa_id

### 3. Security Features

#### Authentication & Authorization
- **Bearer Token**: Semua endpoint memerlukan JWT token
- **Role-based Access**: User harus punya akses ke modul presensi
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
            read: { url: "/api/presensi", beforeSend: addAuthHeader },
            create: { url: "/api/presensi", beforeSend: addAuthHeader },
            update: { url: "/api/presensi/{id}", beforeSend: addAuthHeader }
        }
    },
    columns: [
        { field: "nama_siswa", title: "Nama Siswa", width: 180 },
        { field: "semester", title: "Semester", width: 100 },
        { field: "tahun_ajaran", title: "Tahun Ajaran", width: 120 },
        { field: "jumlah_hadir", title: "Hadir", width: 100 },
        { field: "jumlah_sakit", title: "Sakit", width: 75 },
        { field: "jumlah_izin", title: "Izin", width: 75 },
        { field: "jumlah_alpa", title: "Alpa", width: 75 },
        { field: "persentase_kehadiran", title: "%", format: "{0:n1}%", width: 75 },
        { field: "kategori_kehadiran", title: "Kategori", width: 100 }
    ]
}
```

#### Real-time Calculation Function
```javascript
function calculateAttendancePercentage() {
    const jumlahHadir = parseInt(form.find("[name='jumlah_hadir']").val()) || 0;
    const jumlahSakit = parseInt(form.find("[name='jumlah_sakit']").val()) || 0;
    const jumlahIzin = parseInt(form.find("[name='jumlah_izin']").val()) || 0;
    const jumlahAlpa = parseInt(form.find("[name='jumlah_alpa']").val()) || 0;
    
    const totalHari = jumlahHadir + jumlahSakit + jumlahIzin + jumlahAlpa;
    
    let persentase = 0;
    let kategori = "Rendah";
    
    if (totalHari > 0) {
        persentase = (jumlahHadir / totalHari) * 100;
        
        if (persentase >= 80) {
            kategori = "Tinggi";
        } else if (persentase >= 75) {
            kategori = "Sedang";
        } else {
            kategori = "Rendah";
        }
    }
    
    // Update form display
    form.find("[name='persentase_kehadiran']").val(persentase.toFixed(1));
    form.find("[name='kategori_kehadiran']").val(kategori);
}
```

### 2. Backend Components

#### API Router Structure
```python
@router.post("/", response_model=PresensiResponse, status_code=201)
@router.get("/", response_model=List[Dict])
@router.get("/{presensi_id}", response_model=PresensiResponse)
@router.put("/{presensi_id}", response_model=PresensiResponse)
@router.delete("/{presensi_id}", status_code=204)
@router.get("/export/excel")
```

#### Database Schema
```sql
CREATE TABLE presensi (
    id SERIAL PRIMARY KEY,
    siswa_id INTEGER REFERENCES siswa(id),
    semester VARCHAR(20) NOT NULL,
    tahun_ajaran VARCHAR(20) NOT NULL,
    jumlah_hadir INTEGER NOT NULL,
    jumlah_sakit INTEGER NOT NULL,
    jumlah_izin INTEGER NOT NULL,
    jumlah_alpa INTEGER NOT NULL,
    persentase_kehadiran DECIMAL(5,2) NOT NULL,
    kategori_kehadiran VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(siswa_id, semester, tahun_ajaran)
);
```

### 3. Business Logic Components

#### Calculation Engine
```python
def calculate_attendance_category(persentase_kehadiran: float) -> str:
    if persentase_kehadiran >= 80:
        return "Tinggi"
    elif persentase_kehadiran >= 75:
        return "Sedang"
    else:
        return "Rendah"

def calculate_attendance_percentage(hadir: int, sakit: int, izin: int, alpa: int) -> float:
    total_hari = hadir + sakit + izin + alpa
    if total_hari > 0:
        return (hadir / total_hari) * 100
    return 0
```

#### Validation Rules
```python
def validate_presensi_data(data: PresensiCreate, db: Session):
    # Check if student exists
    siswa = db.query(Siswa).filter(Siswa.id == data.siswa_id).first()
    if not siswa:
        raise HTTPException(404, f"Siswa dengan ID {data.siswa_id} tidak ditemukan")
    
    # Check for duplicates (semester & tahun ajaran)
    existing = db.query(Presensi).filter(
        Presensi.siswa_id == data.siswa_id,
        Presensi.semester == data.semester,
        Presensi.tahun_ajaran == data.tahun_ajaran
    ).first()
    if existing:
        raise HTTPException(400, f"Presensi untuk semester {data.semester} tahun ajaran {data.tahun_ajaran} sudah ada")
```

## Business Logic

### 1. Perhitungan Kehadiran

#### Formula Dasar
```
Total Hari = Jumlah Hadir + Jumlah Sakit + Jumlah Izin + Jumlah Alpa
Persentase Kehadiran = (Jumlah Hadir / Total Hari) × 100
```

#### Kategorisasi
| Persentase | Kategori | Keterangan |
|------------|----------|------------|
| ≥ 80% | Tinggi | Kehadiran sangat baik |
| ≥ 75% | Sedang | Kehadiran cukup baik |
| < 75% | Rendah | Perlu perhatian khusus |

### 2. Validasi Data

#### Duplicate Prevention
- **Rule**: Satu siswa hanya boleh punya satu data presensi per semester & tahun ajaran
- **Check**: `siswa_id + semester + tahun_ajaran` harus unique
- **Error**: HTTP 400 jika data sudah ada

#### Student Validation
- **Rule**: siswa_id harus valid (ada di tabel siswa)
- **Check**: Foreign key constraint
- **Error**: HTTP 404 jika siswa tidak ditemukan

### 3. Default Values

#### Form Defaults
- **semester**: "Ganjil" (semester aktif)
- **tahun_ajaran**: "2024/2025" (tahun ajaran aktif)
- **jumlah_hadir**: 0
- **jumlah_sakit**: 0
- **jumlah_izin**: 0
- **jumlah_alpa**: 0

## Error Handling

### 1. HTTP Status Codes

| Status Code | Scenario | Response |
|-------------|----------|----------|
| 200 | Success (Read/Update) | Data returned |
| 201 | Success (Create) | New data returned |
| 204 | Success (Delete) | No content |
| 400 | Bad Request | Duplicate data/validation error |
| 401 | Unauthorized | Invalid/missing token |
| 404 | Not Found | Student/Record doesn't exist |
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
    } else if (e.status === 404) {
        showErrorNotification("Data tidak ditemukan");
    } else {
        showErrorNotification("Terjadi kesalahan sistem");
    }
}
```

### 4. Common Error Scenarios

1. **Siswa tidak ditemukan**: Create/update dengan siswa_id invalid
2. **Data duplikat**: Create untuk siswa yang sudah punya data presensi di semester & tahun yang sama
3. **Token expired**: Operasi dengan token kadaluarsa → redirect login
4. **Validation error**: Input tidak sesuai format/constraint
5. **Network error**: Koneksi backend bermasalah → retry mechanism

## Kesimpulan

Sequence diagram manajemen presensi menunjukkan alur sistem yang komprehensif dengan fitur:

- ✅ **Complete CRUD Operations** dengan validasi dan error handling
- ✅ **Auto Calculation** untuk persentase dan kategori kehadiran
- ✅ **Real-time Form Calculation** untuk user experience yang baik
- ✅ **Data Integrity** dengan unique constraints dan foreign key
- ✅ **Security** dengan Bearer token authentication
- ✅ **Performance** dengan JOIN query, pagination, dan optional filtering
- ✅ **Export Functionality** ke format Excel dengan proper formatting
- ✅ **User Experience** dengan confirmation modal, notifications, dan real-time feedback

### File yang Dibuat:

1. **Dokumentasi Utama**: `docs/dokumentasi_sequence_diagram_manajemen_presensi.md`
2. **Diagram Mermaid**: `docs/sequence_diagram_manajemen_presensi.mmd`
3. **Diagram PlantUML**: `docs/sequence_diagram_manajemen_presensi.puml`

### Tools untuk Visualisasi:

**Mermaid:**
- Mermaid Live Editor: https://mermaid.live/
- VS Code Extension: Mermaid Preview
- GitHub integration (otomatis render)

**PlantUML:**
- PlantUML Server: http://www.plantuml.com/plantuml/
- VS Code Extension: PlantUML
- CLI: `java -jar plantuml.jar file.puml`

### Keunggulan Sistem Presensi:

1. **Smart Calculation**: Auto-calculation dengan real-time feedback
2. **Data Validation**: Comprehensive validation untuk data integrity
3. **User-Friendly**: Form yang intuitif dengan default values
4. **Performance**: Efficient queries dengan JOIN dan pagination
5. **Security**: Full authentication dan authorization
6. **Export Ready**: Excel export dengan proper formatting

Sistem ini siap untuk production dengan dokumentasi lengkap dan implementasi yang robust untuk manajemen presensi siswa.

---

**Dibuat pada**: 21 Juni 2025  
**Versi**: 1.0  
**Status**: Production Ready  
**Sistem**: EduPro - Sistem Informasi Prediksi Prestasi Siswa 