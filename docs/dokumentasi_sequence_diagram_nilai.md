# Dokumentasi Sequence Diagram Manajemen Nilai Raport - Sistem EduPro

## Executive Summary

Dokumen ini berisi sequence diagram untuk modul manajemen nilai raport siswa dalam aplikasi EduPro. Diagram menggambarkan alur interaksi yang komprehensif antara User, Frontend, Backend API, dan Database untuk operasi CRUD lengkap dengan fitur auto-calculation rata-rata dari 11 mata pelajaran, real-time validation, dan export Excel.

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

Modul manajemen nilai raport siswa memiliki fitur-fitur utama:
- **Create**: Menambah data nilai baru dengan validasi semester & tahun ajaran
- **Read**: Menampilkan daftar nilai dengan JOIN ke tabel siswa
- **Update**: Mengubah data dengan perhitungan ulang rata-rata
- **Delete**: Menghapus data nilai dengan konfirmasi detail
- **Export**: Export data ke format Excel dengan formatting lengkap
- **Filter**: Filter data berdasarkan siswa_id (optional)
- **Authentication**: Semua operasi memerlukan Bearer token

### Fitur Khusus:
- **Auto Calculation**: Rata-rata = (sum of 11 subjects) / 11
- **11 Mata Pelajaran**: matematika, bahasa_indonesia, bahasa_inggris, bahasa_jawa, ipa, agama, pjok, pkn, sejarah, seni, dasar_kejuruan
- **Real-time Calculation**: Form menghitung otomatis saat input berubah
- **Duplicate Prevention**: Satu siswa hanya boleh punya satu data per semester & tahun ajaran
- **JOIN Query**: Data ditampilkan dengan nama siswa
- **Column Optimization**: Beberapa kolom disembunyikan untuk optimasi tampilan

## Sequence Diagram - Format Mermaid

File diagram Mermaid tersimpan di: `docs/sequence_diagram_manajemen_nilai.mmd`

### Cara Menggunakan Diagram Mermaid:
1. **Mermaid Live Editor**: https://mermaid.live/
2. **VS Code Extension**: Mermaid Preview
3. **GitHub**: Otomatis render di README.md
4. **Documentation Tools**: GitBook, Notion, Confluence

## Sequence Diagram - Format PlantUML

File diagram PlantUML tersimpan di: `docs/sequence_diagram_manajemen_nilai.puml`

### Cara Menggunakan Diagram PlantUML:
1. **PlantUML Server**: http://www.plantuml.com/plantuml/
2. **VS Code Extension**: PlantUML
3. **IntelliJ Plugin**: PlantUML Integration
4. **CLI Tool**: plantuml.jar

### Generate Images:
```bash
# Generate PNG
java -jar plantuml.jar sequence_diagram_manajemen_nilai.puml

# Generate SVG
java -jar plantuml.jar -tsvg sequence_diagram_manajemen_nilai.puml
```

## Penjelasan Alur Sistem

### 1. Arsitektur Sistem

Sistem manajemen nilai raport menggunakan arsitektur 4-layer:

1. **Presentation Layer**: Frontend dengan Kendo UI Grid
2. **API Layer**: FastAPI dengan RESTful endpoints
3. **Business Logic Layer**: Auto-calculation, validasi, dan aturan bisnis
4. **Data Layer**: PostgreSQL database dengan relasi

### 2. Fitur-Fitur Khusus

#### Auto Calculation Engine
- **11 Mata Pelajaran**: matematika, bahasa_indonesia, bahasa_inggris, bahasa_jawa, ipa, agama, pjok, pkn, sejarah, seni, dasar_kejuruan
- **Rata-rata**: Otomatis dihitung = (sum of 11 subjects) / 11
- **Range Validation**: Semua nilai harus dalam rentang 0-100
- **Decimal Precision**: Rata-rata diformat dengan 1 decimal place

#### Real-time Form Calculation
- **Frontend Calculation**: Form menghitung otomatis saat user mengetik
- **Live Update**: Rata-rata berubah real-time
- **Visual Feedback**: User melihat hasil perhitungan sebelum save
- **Validation**: Real-time validation untuk range 0-100

#### Data Integrity
- **Unique Constraint**: Satu siswa hanya boleh punya satu data nilai per semester & tahun ajaran
- **Foreign Key**: siswa_id harus valid (ada di tabel siswa)
- **Validation**: Semua field mata pelajaran wajib diisi dengan format yang benar

#### Performance Optimization
- **JOIN Query**: Data ditampilkan dengan nama siswa tanpa N+1 query
- **Pagination**: Mendukung skip/limit untuk data besar
- **Column Hiding**: Beberapa kolom disembunyikan untuk optimasi tampilan
- **Filter Support**: Optional filter berdasarkan siswa_id

### 3. Security Features

#### Authentication & Authorization
- **Bearer Token**: Semua endpoint memerlukan JWT token
- **Role-based Access**: User harus punya akses ke modul nilai
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
            read: { url: "/api/nilai", beforeSend: addAuthHeader },
            create: { url: "/api/nilai", beforeSend: addAuthHeader },
            update: { url: "/api/nilai/{id}", beforeSend: addAuthHeader }
        }
    },
    columns: [
        { field: "nama_siswa", title: "Nama Siswa", width: 180 },
        { field: "semester", title: "Semester", width: 100 },
        { field: "tahun_ajaran", title: "Tahun Ajaran", width: 120 },
        { field: "matematika", title: "MTK", format: "{0:n1}", width: 85 },
        { field: "bahasa_indonesia", title: "B.IND", format: "{0:n1}", width: 85 },
        { field: "bahasa_inggris", title: "B.ING", format: "{0:n1}", width: 85 },
        { field: "ipa", title: "IPA", format: "{0:n1}", width: 85 },
        { field: "rata_rata", title: "Rata²", format: "{0:n1}", width: 85 }
    ]
}
```

#### Real-time Calculation Function
```javascript
function calculateAverage() {
    const matematika = parseFloat(form.find("[name='matematika']").val()) || 0;
    const bahasa_indonesia = parseFloat(form.find("[name='bahasa_indonesia']").val()) || 0;
    const bahasa_inggris = parseFloat(form.find("[name='bahasa_inggris']").val()) || 0;
    const bahasa_jawa = parseFloat(form.find("[name='bahasa_jawa']").val()) || 0;
    const ipa = parseFloat(form.find("[name='ipa']").val()) || 0;
    const agama = parseFloat(form.find("[name='agama']").val()) || 0;
    const pjok = parseFloat(form.find("[name='pjok']").val()) || 0;
    const pkn = parseFloat(form.find("[name='pkn']").val()) || 0;
    const sejarah = parseFloat(form.find("[name='sejarah']").val()) || 0;
    const seni = parseFloat(form.find("[name='seni']").val()) || 0;
    const dasar_kejuruan = parseFloat(form.find("[name='dasar_kejuruan']").val()) || 0;
    
    const rata_rata = (matematika + bahasa_indonesia + bahasa_inggris + bahasa_jawa + 
                      ipa + agama + pjok + pkn + sejarah + seni + dasar_kejuruan) / 11;
    
    // Update rata-rata field
    form.find("[name='rata_rata']").val(rata_rata.toFixed(1));
}
```

### 2. Backend Components

#### API Router Structure
```python
@router.post("/", response_model=NilaiRaportResponse, status_code=201)
@router.get("/", response_model=List[Dict])
@router.get("/{nilai_id}", response_model=NilaiRaportResponse)
@router.put("/{nilai_id}", response_model=NilaiRaportResponse)
@router.delete("/{nilai_id}", status_code=204)
@router.get("/export/excel")
```

#### Database Schema
```sql
CREATE TABLE nilai_raport (
    id SERIAL PRIMARY KEY,
    siswa_id INTEGER REFERENCES siswa(id),
    semester VARCHAR(20) NOT NULL,
    tahun_ajaran VARCHAR(20) NOT NULL,
    matematika DECIMAL(5,2) NOT NULL,
    bahasa_indonesia DECIMAL(5,2) NOT NULL,
    bahasa_inggris DECIMAL(5,2) NOT NULL,
    bahasa_jawa DECIMAL(5,2) NOT NULL,
    ipa DECIMAL(5,2) NOT NULL,
    agama DECIMAL(5,2) NOT NULL,
    pjok DECIMAL(5,2) NOT NULL,
    pkn DECIMAL(5,2) NOT NULL,
    sejarah DECIMAL(5,2) NOT NULL,
    seni DECIMAL(5,2) NOT NULL,
    dasar_kejuruan DECIMAL(5,2) NOT NULL,
    rata_rata DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(siswa_id, semester, tahun_ajaran)
);
```

### 3. Business Logic Components

#### Calculation Engine
```python
def calculate_average(nilai_dict: dict) -> float:
    subjects = [
        'matematika', 'bahasa_indonesia', 'bahasa_inggris', 'bahasa_jawa',
        'ipa', 'agama', 'pjok', 'pkn', 'sejarah', 'seni', 'dasar_kejuruan'
    ]
    
    total = sum(nilai_dict.get(subject, 0) for subject in subjects)
    return total / len(subjects)

def validate_subject_scores(nilai_dict: dict) -> bool:
    subjects = [
        'matematika', 'bahasa_indonesia', 'bahasa_inggris', 'bahasa_jawa',
        'ipa', 'agama', 'pjok', 'pkn', 'sejarah', 'seni', 'dasar_kejuruan'
    ]
    
    for subject in subjects:
        score = nilai_dict.get(subject, 0)
        if not (0 <= score <= 100):
            return False
    return True
```

#### Validation Rules
```python
def validate_nilai_data(data: NilaiRaportCreate, db: Session):
    # Check if student exists
    siswa = db.query(Siswa).filter(Siswa.id == data.siswa_id).first()
    if not siswa:
        raise HTTPException(404, f"Siswa dengan ID {data.siswa_id} tidak ditemukan")
    
    # Check for duplicates (semester & tahun ajaran)
    existing = db.query(NilaiRaport).filter(
        NilaiRaport.siswa_id == data.siswa_id,
        NilaiRaport.semester == data.semester,
        NilaiRaport.tahun_ajaran == data.tahun_ajaran
    ).first()
    if existing:
        raise HTTPException(400, f"Nilai untuk semester {data.semester} tahun ajaran {data.tahun_ajaran} sudah ada")
```

## Business Logic

### 1. Perhitungan Rata-rata

#### Formula Dasar
```
Rata-rata = (matematika + bahasa_indonesia + bahasa_inggris + bahasa_jawa + 
            ipa + agama + pjok + pkn + sejarah + seni + dasar_kejuruan) / 11
```

#### 11 Mata Pelajaran
| No | Mata Pelajaran | Kode | Range |
|----|----------------|------|-------|
| 1 | Matematika | MTK | 0-100 |
| 2 | Bahasa Indonesia | B.IND | 0-100 |
| 3 | Bahasa Inggris | B.ING | 0-100 |
| 4 | Bahasa Jawa | B.JAW | 0-100 |
| 5 | IPA | IPA | 0-100 |
| 6 | Agama | AGM | 0-100 |
| 7 | PJOK | PJOK | 0-100 |
| 8 | PKN | PKN | 0-100 |
| 9 | Sejarah | SEJ | 0-100 |
| 10 | Seni | SENI | 0-100 |
| 11 | Dasar Kejuruan | D.KEJ | 0-100 |

### 2. Validasi Data

#### Duplicate Prevention
- **Rule**: Satu siswa hanya boleh punya satu data nilai per semester & tahun ajaran
- **Check**: `siswa_id + semester + tahun_ajaran` harus unique
- **Error**: HTTP 400 jika data sudah ada

#### Student Validation
- **Rule**: siswa_id harus valid (ada di tabel siswa)
- **Check**: Foreign key constraint
- **Error**: HTTP 404 jika siswa tidak ditemukan

#### Score Validation
- **Rule**: Semua nilai mata pelajaran harus dalam range 0-100
- **Check**: Validasi di frontend dan backend
- **Error**: Validation error jika di luar range

### 3. Default Values

#### Form Defaults
- **semester**: "Ganjil" (semester aktif)
- **tahun_ajaran**: "2024/2025" (tahun ajaran aktif)
- **Semua mata pelajaran**: 0
- **rata_rata**: Calculated field (read-only)

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
2. **Data duplikat**: Create untuk siswa yang sudah punya data nilai di semester & tahun yang sama
3. **Token expired**: Operasi dengan token kadaluarsa → redirect login
4. **Validation error**: Nilai di luar range 0-100
5. **Network error**: Koneksi backend bermasalah → retry mechanism

## Kesimpulan

Sequence diagram manajemen nilai raport menunjukkan alur sistem yang komprehensif dengan fitur:

- ✅ **Complete CRUD Operations** dengan validasi dan error handling
- ✅ **Auto Calculation** untuk rata-rata dari 11 mata pelajaran
- ✅ **Real-time Form Calculation** untuk user experience yang baik
- ✅ **Data Integrity** dengan unique constraints dan foreign key
- ✅ **Security** dengan Bearer token authentication
- ✅ **Performance** dengan JOIN query, pagination, dan optional filtering
- ✅ **Export Functionality** ke format Excel dengan proper formatting
- ✅ **Column Optimization** untuk tampilan yang efisien
- ✅ **User Experience** dengan confirmation modal, notifications, dan real-time feedback

### File yang Dibuat:

1. **Dokumentasi Utama**: `docs/dokumentasi_sequence_diagram_nilai.md`
2. **Diagram Mermaid**: `docs/sequence_diagram_manajemen_nilai.mmd`
3. **Diagram PlantUML**: `docs/sequence_diagram_manajemen_nilai.puml`

### Tools untuk Visualisasi:

**Mermaid:**
- Mermaid Live Editor: https://mermaid.live/
- VS Code Extension: Mermaid Preview
- GitHub integration (otomatis render)

**PlantUML:**
- PlantUML Server: http://www.plantuml.com/plantuml/
- VS Code Extension: PlantUML
- CLI: `java -jar plantuml.jar file.puml`

### Keunggulan Sistem Nilai Raport:

1. **Comprehensive Subject Coverage**: 11 mata pelajaran sesuai kurikulum
2. **Smart Calculation**: Auto-calculation rata-rata dengan real-time feedback
3. **Data Validation**: Comprehensive validation untuk data integrity
4. **User-Friendly**: Form yang intuitif dengan default values
5. **Performance**: Efficient queries dengan JOIN dan pagination
6. **Security**: Full authentication dan authorization
7. **Export Ready**: Excel export dengan formatting lengkap

Sistem ini siap untuk production dengan dokumentasi lengkap dan implementasi yang robust untuk manajemen nilai raport siswa dengan 11 mata pelajaran.

---

**Dibuat pada**: 21 Juni 2025  
**Versi**: 1.0  
**Status**: Production Ready  
**Sistem**: EduPro - Sistem Informasi Prediksi Prestasi Siswa 