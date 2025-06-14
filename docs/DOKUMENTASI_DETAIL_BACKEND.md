# Dokumentasi Detail Backend - Sistem Prediksi Prestasi Siswa

## Daftar Isi
1. [main.py](#mainpy)
2. [database.py](#databasepy)
3. [schemas.py](#schemaspy)
4. [models/user.py](#modelsuserpy)
5. [models/c45_model.py](#modelsc45_modelpy)
6. [routes/auth_router.py](#routesauth_routerpy)
7. [routes/siswa_router.py](#routessiswa_routerpy)
8. [routes/nilai_router.py](#routesnilai_routerpy)
9. [routes/presensi_router.py](#routespresensi_routerpy)
10. [routes/penghasilan_router.py](#routespenghasilan_routerpy)
11. [routes/prediksi_router.py](#routesprediksi_routerpy)

---

## main.py

### Import Statements
```python
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import uvicorn
import os
```
**Penjelasan:**
- `FastAPI`: Framework web utama untuk membuat API
- `Depends`: Dependency injection untuk parameter function
- `HTTPException`: Exception khusus untuk HTTP errors
- `status`: HTTP status codes constants
- `CORSMiddleware`: Middleware untuk Cross-Origin Resource Sharing
- `FileResponse`: Response untuk mengirim file
- `Session`: SQLAlchemy session untuk database operations
- `uvicorn`: ASGI server untuk menjalankan aplikasi
- `os`: Module untuk operasi sistem operasi

### Local Module Imports
```python
from database import get_db, init_db
from routes import siswa_router, nilai_router, presensi_router, penghasilan_router, prediksi_router, auth_router
```
**Penjelasan:**
- Import function database dan semua router modules
- `get_db`: Function untuk mendapatkan database session
- `init_db`: Function untuk inisialisasi database
- Import semua router untuk endpoint management

### FastAPI Application Initialization
```python
app = FastAPI(
    title="Sistem Prediksi Prestasi Siswa",
    description="API untuk sistem prediksi prestasi siswa menggunakan algoritma C4.5",
    version="1.0.0"
)
```
**Penjelasan:**
- Membuat instance FastAPI dengan metadata
- `title`: Judul aplikasi yang akan muncul di dokumentasi
- `description`: Deskripsi aplikasi
- `version`: Versi aplikasi

### CORS Configuration
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```
**Penjelasan:**
- Menambahkan CORS middleware untuk mengizinkan cross-origin requests
- `allow_origins=["*"]`: Mengizinkan semua domain (dalam produksi sebaiknya dibatasi)
- `allow_credentials=True`: Mengizinkan cookies dan credentials
- `allow_methods=["*"]`: Mengizinkan semua HTTP methods
- `allow_headers=["*"]`: Mengizinkan semua headers

### Router Registration
```python
app.include_router(siswa_router.router, prefix="/api/siswa", tags=["Siswa"])
app.include_router(nilai_router.router, prefix="/api/nilai", tags=["Nilai Raport"])
app.include_router(presensi_router.router, prefix="/api/presensi", tags=["Presensi"])
app.include_router(penghasilan_router.router, prefix="/api/penghasilan", tags=["Penghasilan Ortu"])
app.include_router(prediksi_router.router, prefix="/api/prediksi", tags=["Prediksi Prestasi"])
app.include_router(auth_router.router, prefix="/api/auth", tags=["Authentication"])
```
**Penjelasan:**
- Mendaftarkan semua router ke aplikasi utama
- `prefix`: URL prefix untuk semua endpoint dalam router
- `tags`: Grouping untuk dokumentasi API

### Root Endpoint
```python
@app.get("/", tags=["Root"])
async def root():
    return {"message": "Selamat datang di API Sistem Prediksi Prestasi Siswa"}
```
**Penjelasan:**
- Endpoint root yang memberikan pesan selamat datang
- `@app.get("/")`: Decorator untuk HTTP GET method pada path "/"
- `async def`: Asynchronous function
- Return JSON response dengan pesan

### Health Check Endpoint
```python
@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "message": "API berjalan dengan baik"}
```
**Penjelasan:**
- Endpoint untuk memeriksa status kesehatan API
- Berguna untuk monitoring dan load balancer health checks
- Return status dan pesan konfirmasi

### Decision Tree Visualization Endpoint
```python
@app.get("/api/decision_tree", tags=["Visualisasi"])
async def get_decision_tree():
    """
    Menampilkan file gambar decision_tree.png dari direktori static
    """
    return FileResponse("static/decision_tree.png")
```
**Penjelasan:**
- Endpoint untuk menampilkan visualisasi pohon keputusan
- `FileResponse`: Mengirim file sebagai response
- File diambil dari direktori static

### Database Initialization Event
```python
@app.on_event("startup")
async def startup_event():
    init_db()
    print("Database telah diinisialisasi")
```
**Penjelasan:**
- Event handler yang dijalankan saat aplikasi startup
- `@app.on_event("startup")`: Decorator untuk startup event
- `init_db()`: Memanggil function untuk inisialisasi database
- Print konfirmasi ke console

### Application Runner
```python
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
```
**Penjelasan:**
- Menjalankan aplikasi jika file dieksekusi langsung
- `uvicorn.run()`: Menjalankan ASGI server
- `"main:app"`: Module dan variable aplikasi
- `host="0.0.0.0"`: Listen pada semua interface
- `port=8000`: Port yang digunakan
- `reload=True`: Auto-reload saat ada perubahan code

---

## database.py

### Import Statements
```python
from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import os
from datetime import datetime
```
**Penjelasan:**
- SQLAlchemy imports untuk ORM functionality
- `create_engine`: Membuat koneksi database engine
- Column types: Integer, String, Float, ForeignKey, DateTime, Boolean, Text
- `declarative_base`: Base class untuk model definitions
- `sessionmaker`: Factory untuk database sessions
- `relationship`: Untuk mendefinisikan relasi antar tabel
- `os`: Untuk environment variables
- `datetime`: Untuk timestamp operations

### Database Configuration
```python
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db:5432/prestasi_siswa")
```
**Penjelasan:**
- Mengambil URL database dari environment variable
- Jika tidak ada, menggunakan default PostgreSQL connection string
- Format: `postgresql://username:password@host:port/database_name`

### Engine and Session Setup
```python
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
```
**Penjelasan:**
- `create_engine()`: Membuat database engine dengan URL
- `SessionLocal`: Session factory dengan konfigurasi
  - `autocommit=False`: Manual commit transactions
  - `autoflush=False`: Manual flush operations
  - `bind=engine`: Mengikat ke engine yang dibuat
- `Base`: Base class untuk semua model

### Siswa Model
```python
class Siswa(Base):
    __tablename__ = "siswa"
    
    id = Column(Integer, primary_key=True, index=True)
    nama = Column(String, index=True)
    nis = Column(String, unique=True, index=True)
    jenis_kelamin = Column(String)
    kelas = Column(String)
    tanggal_lahir = Column(DateTime)
    alamat = Column(Text)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
```
**Penjelasan:**
- Model untuk tabel siswa
- `__tablename__`: Nama tabel di database
- `id`: Primary key dengan auto-increment dan index
- `nama`: Nama siswa dengan index untuk pencarian cepat
- `nis`: Nomor Induk Siswa, unique dan indexed
- `jenis_kelamin`: Gender siswa
- `kelas`: Kelas siswa
- `tanggal_lahir`: Tanggal lahir dengan tipe DateTime
- `alamat`: Alamat dengan tipe Text untuk data panjang
- `created_at`: Timestamp pembuatan dengan default datetime.now
- `updated_at`: Timestamp update dengan onupdate trigger

### Relationships in Siswa Model
```python
nilai_raport = relationship("NilaiRaport", back_populates="siswa")
penghasilan_ortu = relationship("PenghasilanOrtu", back_populates="siswa")
presensi = relationship("Presensi", back_populates="siswa")
prestasi = relationship("Prestasi", back_populates="siswa")
```
**Penjelasan:**
- Mendefinisikan relasi one-to-many dengan tabel lain
- `relationship()`: SQLAlchemy relationship function
- `back_populates`: Bidirectional relationship
- Memungkinkan akses data terkait melalui object attribute

### NilaiRaport Model
```python
class NilaiRaport(Base):
    __tablename__ = "nilai_raport"
    
    id = Column(Integer, primary_key=True, index=True)
    siswa_id = Column(Integer, ForeignKey("siswa.id"))
    semester = Column(String)
    tahun_ajaran = Column(String)
    matematika = Column(Float)
    bahasa_indonesia = Column(Float)
    bahasa_inggris = Column(Float)
    bahasa_jawa = Column(Float)
    ipa = Column(Float)
    agama = Column(Float)
    pjok = Column(Float)
    pkn = Column(Float)
    sejarah = Column(Float)
    seni = Column(Float)
    dasar_kejuruan = Column(Float)
    rata_rata = Column(Float)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
```
**Penjelasan:**
- Model untuk tabel nilai raport siswa
- `siswa_id`: Foreign key ke tabel siswa
- `semester/tahun_ajaran`: Periode nilai
- Semua mata pelajaran dengan tipe float
- `rata_rata`: Rata-rata semua mata pelajaran

### PenghasilanOrtu Model
```python
class PenghasilanOrtu(Base):
    __tablename__ = "penghasilan_ortu"
    
    id = Column(Integer, primary_key=True, index=True)
    siswa_id = Column(Integer, ForeignKey("siswa.id"))
    penghasilan_ayah = Column(Float)
    penghasilan_ibu = Column(Float)
    pekerjaan_ayah = Column(String)
    pekerjaan_ibu = Column(String)
    pendidikan_ayah = Column(String)
    pendidikan_ibu = Column(String)
    total_penghasilan = Column(Float)
    kategori_penghasilan = Column(String)  # Rendah, Menengah, Tinggi
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
```
**Penjelasan:**
- Model untuk data penghasilan orang tua siswa
- `penghasilan_ayah/ibu`: Penghasilan masing-masing orang tua
- `pekerjaan_ayah/ibu`: Jenis pekerjaan orang tua
- `pendidikan_ayah/ibu`: Tingkat pendidikan orang tua
- `total_penghasilan`: Total penghasilan keluarga
- `kategori_penghasilan`: Kategorisasi berdasarkan total penghasilan

### Presensi Model
```python
class Presensi(Base):
    __tablename__ = "presensi"
    
    id = Column(Integer, primary_key=True, index=True)
    siswa_id = Column(Integer, ForeignKey("siswa.id"))
    semester = Column(String)
    tahun_ajaran = Column(String)
    jumlah_hadir = Column(Integer)
    jumlah_sakit = Column(Integer)
    jumlah_izin = Column(Integer)
    jumlah_alpa = Column(Integer)
    persentase_kehadiran = Column(Float)
    kategori_kehadiran = Column(String)  # Rendah, Sedang, Tinggi
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
```
**Penjelasan:**
- Model untuk data presensi/kehadiran siswa
- `jumlah_hadir`: Total hari hadir
- `jumlah_sakit/izin/alpa`: Total hari tidak hadir dengan kategori
- `persentase_kehadiran`: Persentase kehadiran dari total hari efektif
- `kategori_kehadiran`: Kategorisasi tingkat kehadiran

### Prestasi Model
```python
class Prestasi(Base):
    __tablename__ = "prestasi"
    
    id = Column(Integer, primary_key=True, index=True)
    siswa_id = Column(Integer, ForeignKey("siswa.id"))
    semester = Column(String)
    tahun_ajaran = Column(String)
    prediksi_prestasi = Column(String)  # Rendah, Sedang, Tinggi
    confidence = Column(Float)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
```
**Penjelasan:**
- Model untuk menyimpan hasil prediksi prestasi siswa
- `prediksi_prestasi`: Hasil prediksi (Rendah/Sedang/Tinggi)
- `confidence`: Tingkat kepercayaan prediksi (0.0 - 1.0)
- Data ini dihasilkan dari algoritma C4.5

### Database Session Function
```python
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```
**Penjelasan:**
- Generator function untuk dependency injection
- `SessionLocal()`: Membuat session baru
- `yield db`: Memberikan session ke caller
- `finally`: Memastikan session ditutup setelah digunakan
- Pattern ini memastikan proper resource management

### Database Initialization Function
```python
def init_db():
    Base.metadata.create_all(bind=engine)
```
**Penjelasan:**
- Function untuk membuat semua tabel di database
- `Base.metadata.create_all()`: Membuat tabel berdasarkan model definitions
- `bind=engine`: Menggunakan engine yang sudah dikonfigurasi
- Hanya membuat tabel yang belum ada (idempotent)

---

## schemas.py

### Import Statements
```python
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
```
**Penjelasan:**
- `BaseModel`: Base class untuk semua Pydantic models
- `Field`: Untuk field validation dan metadata
- `Optional, List`: Type hints untuk optional dan list fields
- `datetime`: Untuk timestamp fields

### Siswa Schemas

#### Base Schema
```python
class SiswaBase(BaseModel):
    nama: str
    nis: str
    jenis_kelamin: str
    kelas: str
    tanggal_lahir: datetime
    alamat: Optional[str] = None
```
**Penjelasan:**
- Base schema dengan field-field umum untuk siswa
- `nama`: Nama lengkap siswa (required)
- `nis`: Nomor Induk Siswa (required, unique)
- `jenis_kelamin`: L/P (required)
- `kelas`: Kelas siswa (required)
- `tanggal_lahir`: Tanggal lahir dalam format datetime
- `alamat`: Alamat siswa (optional)

#### Create Schema
```python
class SiswaCreate(SiswaBase):
    pass
```
**Penjelasan:**
- Schema untuk create siswa baru
- Inherit semua field dari SiswaBase
- Semua field required kecuali alamat

#### Update Schema
```python
class SiswaUpdate(BaseModel):
    nama: Optional[str] = None
    nis: Optional[str] = None
    jenis_kelamin: Optional[str] = None
    kelas: Optional[str] = None
    tanggal_lahir: Optional[datetime] = None
    alamat: Optional[str] = None
```
**Penjelasan:**
- Schema untuk update siswa
- Semua field optional untuk partial update
- Hanya field yang di-set yang akan diupdate

#### Response Schema
```python
class SiswaResponse(SiswaBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True
```
**Penjelasan:**
- Schema untuk response API
- Include field database: id, created_at, updated_at
- `orm_mode = True`: Enable ORM object serialization

### NilaiRaport Schemas

#### Base Schema
```python
class NilaiRaportBase(BaseModel):
    siswa_id: int
    semester: str
    tahun_ajaran: str
    matematika: float
    bahasa_indonesia: float
    bahasa_inggris: float
    ipa: float
    bahasa_jawa: float
    agama: float
    pjok: float
    pkn: float
    sejarah: float
    seni: float
    dasar_kejuruan: float
    rata_rata: float
```
**Penjelasan:**
- Base schema untuk nilai raport siswa
- `siswa_id`: Foreign key ke tabel siswa
- `semester`: Semester (1/2)
- `tahun_ajaran`: Format "2023/2024"
- 11 mata pelajaran dengan nilai float
- `rata_rata`: Calculated field dari semua mata pelajaran

#### Create Schema
```python
class NilaiRaportCreate(NilaiRaportBase):
    pass
```
**Penjelasan:**
- Schema untuk create nilai raport baru
- Rata-rata akan dihitung otomatis di backend

#### Update Schema
```python
class NilaiRaportUpdate(BaseModel):
    semester: Optional[str] = None
    tahun_ajaran: Optional[str] = None
    matematika: Optional[float] = None
    bahasa_indonesia: Optional[float] = None
    bahasa_inggris: Optional[float] = None
    ipa: Optional[float] = None
    bahasa_jawa: Optional[float] = None
    agama: Optional[float] = None
    pjok: Optional[float] = None
    pkn: Optional[float] = None
    sejarah: Optional[float] = None
    seni: Optional[float] = None
    dasar_kejuruan: Optional[float] = None
    rata_rata: Optional[float] = None
```
**Penjelasan:**
- Schema untuk update nilai raport
- Semua field optional untuk partial update
- Rata-rata akan dihitung ulang jika ada perubahan nilai

### PenghasilanOrtu Schemas

#### Base Schema
```python
class PenghasilanOrtuBase(BaseModel):
    siswa_id: int
    penghasilan_ayah: float
    penghasilan_ibu: float
    pekerjaan_ayah: str
    pekerjaan_ibu: str
    pendidikan_ayah: str
    pendidikan_ibu: str
    total_penghasilan: float
    kategori_penghasilan: str
```
**Penjelasan:**
- Base schema untuk data penghasilan orang tua
- Penghasilan dalam rupiah (float)
- Pekerjaan dan pendidikan dalam string
- `total_penghasilan`: Sum dari penghasilan ayah dan ibu
- `kategori_penghasilan`: Rendah/Sedang/Tinggi

### Presensi Schemas

#### Base Schema
```python
class PresensiBase(BaseModel):
    siswa_id: int
    semester: str
    tahun_ajaran: str
    jumlah_hadir: int
    jumlah_sakit: int
    jumlah_izin: int
    jumlah_alpa: int
    persentase_kehadiran: float
    kategori_kehadiran: str
```
**Penjelasan:**
- Base schema untuk data presensi siswa
- Jumlah hari untuk setiap kategori kehadiran
- `persentase_kehadiran`: Calculated field
- `kategori_kehadiran`: Baik/Cukup/Kurang

### Prestasi Schemas

#### Base Schema
```python
class PrestasiBase(BaseModel):
    siswa_id: int
    semester: str
    tahun_ajaran: str
    prediksi_prestasi: str
    confidence: float
```
**Penjelasan:**
- Base schema untuk hasil prediksi prestasi
- `prediksi_prestasi`: Baik/Cukup/Kurang
- `confidence`: Tingkat kepercayaan model (0.0-1.0)

### Prediction Schemas

#### Request Schema
```python
class PrediksiRequest(BaseModel):
    siswa_id: int
    semester: str
    tahun_ajaran: str
```
**Penjelasan:**
- Schema untuk request prediksi
- Minimal info untuk identify data yang diperlukan

#### Response Schema
```python
class PrediksiResponse(BaseModel):
    siswa_id: int
    nama_siswa: str
    prediksi_prestasi: str
    confidence: float
    detail_faktor: dict
```
**Penjelasan:**
- Schema untuk response prediksi
- Include nama siswa untuk user-friendly response
- `detail_faktor`: Dictionary berisi faktor-faktor yang mempengaruhi prediksi
- Include feature importances untuk explainability

---

*Dokumentasi telah mencakup semua file utama dalam backend sistem prediksi prestasi siswa.*

## models/user.py

### Import Statements
```python
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import declarative_base
```
**Penjelasan:**
- Import SQLAlchemy components untuk model definition
- `Column`: Untuk mendefinisikan kolom tabel
- `Integer, String`: Tipe data kolom
- `declarative_base`: Base class untuk model

### Base Declaration
```python
Base = declarative_base()
```
**Penjelasan:**
- Membuat base class untuk model User
- Terpisah dari database.py untuk modularitas

### User Model
```python
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
```
**Penjelasan:**
- Model untuk tabel users
- `__tablename__ = "users"`: Nama tabel di database
- `id`: Primary key dengan auto-increment dan index
- `username`: Username unik dengan index untuk pencarian cepat
- `hashed_password`: Password yang sudah di-hash (tidak plain text)

### String Representation
```python
def __repr__(self):
    return f"<User(id={self.id}, username='{self.username}')>"
```
**Penjelasan:**
- Method untuk representasi string object User
- Berguna untuk debugging dan logging
- Menampilkan id dan username (tidak termasuk password untuk keamanan)

---

## models/c45_model.py

### Import Statements
```python
import pandas as pd
import numpy as np
from sklearn.tree import DecisionTreeClassifier, export_graphviz
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sqlalchemy.orm import Session
import pydotplus
import graphviz
import os
import json
from io import StringIO
import base64
```
**Penjelasan:**
- `pandas`: Library untuk manipulasi dan analisis data
- `numpy`: Library untuk komputasi numerik
- `sklearn.tree`: Decision tree classifier dan export utilities
- `sklearn.model_selection`: Tools untuk splitting data
- `sklearn.metrics`: Metrics untuk evaluasi model
- `sqlalchemy.orm.Session`: Database session untuk query
- `pydotplus`: Wrapper GraphViz untuk Python
- `graphviz`: Library untuk visualisasi graph
- `os`: Operasi sistem file
- `json`: Parsing dan serialization JSON
- `StringIO`: Buffer string in-memory
- `base64`: Encoding untuk gambar

### Database Model Imports
```python
from database import Siswa, NilaiRaport, PenghasilanOrtu, Presensi, Prestasi
```
**Penjelasan:**
- Import semua model database yang diperlukan
- Untuk mengakses data dari berbagai tabel untuk training model

### C45Model Class Initialization
```python
class C45Model:
    def __init__(self):
        self.model = DecisionTreeClassifier(criterion='entropy')
        self.features = ['rata_rata', 'kategori_penghasilan', 'kategori_kehadiran']
        self.target = 'prediksi_prestasi'
        self.trained = False
        self.tree_visualization = None
```
**Penjelasan:**
- Constructor untuk class C45Model
- `DecisionTreeClassifier(criterion='entropy')`: Menggunakan entropy untuk splitting (implementasi C4.5)
- `features`: List fitur yang digunakan untuk prediksi (3 fitur utama)
- `target`: Target variable yang akan diprediksi
- `trained`: Boolean flag untuk status training model
- `tree_visualization`: Storage untuk visualisasi pohon keputusan

### Data Preparation Method - Part 1
```python
def prepare_data(self, db: Session):
    """Menyiapkan data dari database untuk pelatihan model"""
    siswa_data = db.query(Siswa).all()
    
    data_list = []
    for siswa in siswa_data:
        # Ambil data nilai raport terbaru
        nilai = db.query(NilaiRaport).filter(NilaiRaport.siswa_id == siswa.id).order_by(NilaiRaport.updated_at.desc()).first()
        # Ambil data presensi terbaru
        presensi = db.query(Presensi).filter(Presensi.siswa_id == siswa.id).order_by(Presensi.updated_at.desc()).first()
        # Ambil data penghasilan terbaru
        penghasilan = db.query(PenghasilanOrtu).filter(PenghasilanOrtu.siswa_id == siswa.id).order_by(Presensi.updated_at.desc()).first()
        # Ambil data prestasi terbaru (jika ada)
        prestasi = db.query(Prestasi).filter(Prestasi.siswa_id == siswa.id).order_by(Prestasi.updated_at.desc()).first()
```
**Penjelasan:**
- Method untuk menyiapkan data training dari database
- `db.query(Siswa).all()`: Mengambil semua data siswa dari database
- Loop untuk setiap siswa mengambil data terkait terbaru:
  - `nilai`: Data nilai raport terbaru berdasarkan updated_at
  - `presensi`: Data presensi terbaru
  - `penghasilan`: Data penghasilan orang tua terbaru
  - `prestasi`: Data prestasi existing jika ada
- Menggunakan `.first()` untuk mengambil record terbaru

### Data Preparation Method - Part 2
```python
        if nilai and presensi and penghasilan:
            data_entry = {
                'siswa_id': siswa.id,
                'nama': siswa.nama,
                'rata_rata': nilai.rata_rata,
                'kategori_penghasilan': penghasilan.kategori_penghasilan,
                'kategori_kehadiran': presensi.kategori_kehadiran,
                'prediksi_prestasi': prestasi.prediksi_prestasi if prestasi else self.generate_label(nilai.rata_rata, penghasilan.kategori_penghasilan, presensi.kategori_kehadiran)
            }
            data_list.append(data_entry)
```
**Penjelasan:**
- Validasi bahwa semua data required tersedia (nilai, presensi, penghasilan)
- Membuat dictionary untuk setiap entry data dengan:
  - `siswa_id`: ID siswa untuk referensi
  - `nama`: Nama siswa untuk identifikasi
  - `rata_rata`: Rata-rata nilai dari tabel nilai_raport
  - `kategori_penghasilan`: Kategori penghasilan orang tua
  - `kategori_kehadiran`: Kategori kehadiran siswa
  - `prediksi_prestasi`: Menggunakan data existing atau generate otomatis
- `self.generate_label()`: Method untuk membuat label otomatis
- Menambahkan entry ke data_list untuk processing

### Data Preparation Method - Part 3
```python
    df = pd.DataFrame(data_list)
    df_labeled = df[df['prediksi_prestasi'].notna()]
    return df, df_labeled
```
**Penjelasan:**
- Membuat pandas DataFrame dari list data
- `df`: DataFrame lengkap dengan semua data
- `df_labeled`: Filter data yang sudah memiliki label (not null)
- Return kedua DataFrame untuk keperluan berbeda
- `df_labeled` digunakan untuk training, `df` untuk prediksi

### Model Training Method - Part 1
```python
def train(self, db: Session):
    """Melatih model C4.5 dengan data dari database"""
    df, df_labeled = self.prepare_data(db)
    
    if len(df_labeled) < 5:
        raise ValueError("Data tidak cukup untuk pelatihan model (minimal 5 data berlabel)")
    
    # Persiapan data untuk training
    X = df_labeled[self.features]
    y = df_labeled[self.target]
```
**Penjelasan:**
- Method untuk melatih model C4.5
- `self.prepare_data(db)`: Mengambil data yang sudah dipreparasi
- Validasi minimal 5 data berlabel untuk training yang valid
- `X`: Feature matrix dengan kolom sesuai self.features
- `y`: Target vector dengan prediksi prestasi
- Pemisahan features dan target untuk supervised learning

### Model Training Method - Part 2
```python
    # Encoding categorical variables
    from sklearn.preprocessing import LabelEncoder
    le_penghasilan = LabelEncoder()
    le_kehadiran = LabelEncoder()
    le_target = LabelEncoder()
    
    X_encoded = X.copy()
    X_encoded['kategori_penghasilan'] = le_penghasilan.fit_transform(X['kategori_penghasilan'])
    X_encoded['kategori_kehadiran'] = le_kehadiran.fit_transform(X['kategori_kehadiran'])
    y_encoded = le_target.fit_transform(y)
```
**Penjelasan:**
- Import LabelEncoder untuk encoding categorical variables
- Membuat encoder terpisah untuk setiap categorical feature
- `X_encoded`: Copy dari X untuk menyimpan data yang sudah di-encode
- Encoding categorical features ke numerical values:
  - `kategori_penghasilan`: Rendah/Menengah/Tinggi → 0/1/2
  - `kategori_kehadiran`: Rendah/Sedang/Tinggi → 0/1/2
- `y_encoded`: Target variable yang sudah di-encode
- Menyimpan encoder untuk digunakan saat prediksi

### Model Training Method - Part 3
```python
    # Simpan encoder untuk prediksi nanti
    self.le_penghasilan = le_penghasilan
    self.le_kehadiran = le_kehadiran
    self.le_target = le_target
    
    # Split data untuk training dan testing
    X_train, X_test, y_train, y_test = train_test_split(
        X_encoded, y_encoded, test_size=0.2, random_state=42
    )
```
**Penjelasan:**
- Menyimpan encoder sebagai instance variable untuk digunakan saat prediksi
- `train_test_split()`: Membagi data untuk training dan testing
  - `test_size=0.2`: 20% data untuk testing, 80% untuk training
  - `random_state=42`: Seed untuk reproducible results
- `X_train, y_train`: Data untuk training model
- `X_test, y_test`: Data untuk evaluasi model

### Model Training Method - Part 4
```python
    # Training model
    self.model.fit(X_train, y_train)
    
    # Evaluasi model
    y_pred = self.model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    # Generate classification report
    report = classification_report(y_test, y_pred, target_names=le_target.classes_)
    
    self.trained = True
    
    # Generate visualization
    self.visualize()
    
    return {
        'accuracy': accuracy,
        'classification_report': report,
        'training_samples': len(X_train),
        'test_samples': len(X_test)
    }
```
**Penjelasan:**
- `self.model.fit()`: Training decision tree dengan data training
- `self.model.predict()`: Prediksi pada data test untuk evaluasi
- `accuracy_score()`: Menghitung akurasi model
- `classification_report()`: Laporan detail precision, recall, f1-score
- `self.trained = True`: Menandai model sudah dilatih
- `self.visualize()`: Generate visualisasi pohon keputusan
- Return dictionary dengan metrics evaluasi dan informasi training

### Prediction Method - Part 1
```python
def predict(self, data):
    """Melakukan prediksi prestasi siswa"""
    if not self.trained:
        raise ValueError("Model belum dilatih. Jalankan train() terlebih dahulu.")
    
    # Persiapan data untuk prediksi
    if isinstance(data, dict):
        df_pred = pd.DataFrame([data])
    else:
        df_pred = pd.DataFrame(data)
```
**Penjelasan:**
- Method untuk melakukan prediksi pada data baru
- Validasi bahwa model sudah dilatih sebelumnya
- Handling input data yang bisa berupa dictionary atau list
- Konversi ke DataFrame untuk consistency

### Prediction Method - Part 2
```python
    # Encoding categorical variables menggunakan encoder yang sudah dilatih
    df_encoded = df_pred.copy()
    df_encoded['kategori_penghasilan'] = self.le_penghasilan.transform(df_pred['kategori_penghasilan'])
    df_encoded['kategori_kehadiran'] = self.le_kehadiran.transform(df_pred['kategori_kehadiran'])
    
    # Prediksi
    X_pred = df_encoded[self.features]
    predictions = self.model.predict(X_pred)
    probabilities = self.model.predict_proba(X_pred)
```
**Penjelasan:**
- Encoding categorical variables menggunakan encoder yang sudah difit saat training
- `transform()`: Menggunakan encoder existing (bukan fit_transform)
- `X_pred`: Feature matrix untuk prediksi
- `predictions`: Hasil prediksi class
- `probabilities`: Probabilitas untuk setiap class

### Prediction Method - Part 3
```python
    # Decode hasil prediksi
    decoded_predictions = self.le_target.inverse_transform(predictions)
    
    # Hitung confidence (probabilitas maksimum)
    confidences = np.max(probabilities, axis=1)
    
    # Feature importance
    feature_importance = dict(zip(self.features, self.model.feature_importances_))
    
    results = []
    for i, pred in enumerate(decoded_predictions):
        results.append({
            'prediksi_prestasi': pred,
            'confidence': confidences[i],
            'feature_importance': feature_importance,
            'probabilities': dict(zip(self.le_target.classes_, probabilities[i]))
        })
    
    return results
```
**Penjelasan:**
- `inverse_transform()`: Decode hasil prediksi kembali ke label asli
- `confidences`: Ambil probabilitas maksimum sebagai confidence score
- `feature_importance`: Importance setiap feature dalam model
- Loop untuk membuat hasil detail setiap prediksi:
  - `prediksi_prestasi`: Label hasil prediksi
  - `confidence`: Tingkat kepercayaan prediksi
  - `feature_importance`: Kontribusi setiap feature
  - `probabilities`: Probabilitas untuk semua class

### Rule Extraction Method
```python
def get_rules(self):
    """Mengekstrak aturan dari decision tree"""
    if not self.trained:
        raise ValueError("Model belum dilatih.")
    
    tree = self.model.tree_
    feature_names = self.features
    
    def recurse(node, depth=0):
        indent = "  " * depth
        if tree.feature[node] != -2:  # Bukan leaf node
            feature = feature_names[tree.feature[node]]
            threshold = tree.threshold[node]
            print(f"{indent}if {feature} <= {threshold:.2f}:")
            recurse(tree.children_left[node], depth + 1)
            print(f"{indent}else:  # if {feature} > {threshold:.2f}")
            recurse(tree.children_right[node], depth + 1)
        else:  # Leaf node
            class_counts = tree.value[node][0]
            predicted_class = np.argmax(class_counts)
            class_name = self.le_target.classes_[predicted_class]
            confidence = class_counts[predicted_class] / np.sum(class_counts)
            print(f"{indent}return {class_name} (confidence: {confidence:.2f})")
    
    print("Decision Tree Rules:")
    recurse(0)
```
**Penjelasan:**
- Method untuk mengekstrak aturan decision tree dalam bentuk if-else
- `tree_`: Akses internal structure decision tree
- `recurse()`: Recursive function untuk traverse tree
- Logic untuk membedakan internal node dan leaf node:
  - Internal node: Memiliki feature dan threshold untuk splitting
  - Leaf node: Memiliki class prediction dan confidence
- Print aturan dalam format yang mudah dibaca

### Label Generation Method
```python
def generate_label(self, rata_rata, kategori_penghasilan, kategori_kehadiran):
    """Generate label otomatis berdasarkan aturan sederhana"""
    score = 0
    
    # Scoring berdasarkan rata-rata nilai
    if rata_rata >= 85:
        score += 3
    elif rata_rata >= 75:
        score += 2
    else:
        score += 1
    
    # Scoring berdasarkan kategori penghasilan
    if kategori_penghasilan == "Tinggi":
        score += 2
    elif kategori_penghasilan == "Menengah":
        score += 1
    
    # Scoring berdasarkan kategori kehadiran
    if kategori_kehadiran == "Tinggi":
        score += 2
    elif kategori_kehadiran == "Sedang":
        score += 1
    
    # Tentukan label berdasarkan total score
    if score >= 6:
        return "Tinggi"
    elif score >= 4:
        return "Sedang"
    else:
        return "Rendah"
```
**Penjelasan:**
- Method untuk generate label otomatis jika belum ada data prestasi
- Sistem scoring berdasarkan 3 faktor utama:
  - Rata-rata nilai: 85+ (3 poin), 75+ (2 poin), <75 (1 poin)
  - Kategori penghasilan: Tinggi (2 poin), Menengah (1 poin), Rendah (0 poin)
  - Kategori kehadiran: Tinggi (2 poin), Sedang (1 poin), Rendah (0 poin)
- Total score menentukan label:
  - 6+ poin: Prestasi Tinggi
  - 4-5 poin: Prestasi Sedang
  - <4 poin: Prestasi Rendah

### Visualization Method - Part 1
```python
def visualize(self):
    """Membuat visualisasi decision tree"""
    if not self.trained:
        raise ValueError("Model belum dilatih.")
    
    # Export tree ke format DOT
    dot_data = StringIO()
    export_graphviz(
        self.model,
        out_file=dot_data,
        feature_names=self.features,
        class_names=self.le_target.classes_,
        filled=True,
        rounded=True,
        special_characters=True
    )
```
**Penjelasan:**
- Method untuk membuat visualisasi pohon keputusan
- `StringIO()`: Buffer untuk menyimpan data DOT format
- `export_graphviz()`: Export decision tree ke format GraphViz
  - `feature_names`: Nama features untuk label node
  - `class_names`: Nama classes untuk leaf nodes
  - `filled=True`: Warna node berdasarkan majority class
  - `rounded=True`: Node dengan sudut rounded
  - `special_characters=True`: Support karakter khusus

### Visualization Method - Part 2
```python
    # Konversi DOT ke gambar
    graph = pydotplus.graph_from_dot_data(dot_data.getvalue())
    
    # Simpan sebagai PNG
    png_data = graph.create_png()
    
    # Simpan ke file
    with open("static/decision_tree.png", "wb") as f:
        f.write(png_data)
    
    # Konversi ke base64 untuk response API
    png_base64 = base64.b64encode(png_data).decode('utf-8')
    self.tree_visualization = png_base64
    
    return png_base64
```
**Penjelasan:**
- `pydotplus.graph_from_dot_data()`: Konversi DOT data ke graph object
- `create_png()`: Generate gambar PNG dari graph
- Simpan gambar ke file `static/decision_tree.png` untuk endpoint
- `base64.b64encode()`: Encode gambar ke base64 untuk API response
- `self.tree_visualization`: Simpan visualisasi untuk akses nanti
- Return base64 string untuk immediate use

### Get Visualization Method
```python
def get_visualization(self):
    """Mendapatkan visualisasi tree yang sudah dibuat"""
    return self.tree_visualization
```
**Penjelasan:**
- Method sederhana untuk mengambil visualisasi yang sudah dibuat
- Return base64 string dari visualisasi pohon keputusan
- Digunakan untuk endpoint yang membutuhkan visualisasi

---

## routes/auth_router.py

### Import Statements
```python
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, validator
from sqlalchemy.orm import Session,Mapped,mapped_column
from database import get_db
from models.user import User
```
**Penjelasan:**
- `datetime, timedelta`: Untuk handling waktu dan durasi token
- `APIRouter`: Router untuk grouping endpoints authentication
- `OAuth2PasswordBearer`: OAuth2 authentication scheme
- `jose`: Library untuk JWT token handling
- `passlib.context.CryptContext`: Password hashing utilities
- `BaseModel, validator`: Pydantic untuk data validation
- Local imports untuk database dan user model

### Authentication Configuration
```python
SECRET_KEY = "wfdrmGsTH4oRbZKe8gGNNnIjziDJZgsH"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
router = APIRouter()
```
**Penjelasan:**
- `SECRET_KEY`: Kunci rahasia untuk signing JWT tokens
- `ALGORITHM`: Algoritma HS256 untuk JWT signing
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token valid selama 2 jam
- `pwd_context`: Context untuk bcrypt password hashing
- `oauth2_scheme`: OAuth2 scheme dengan token endpoint
- `router`: Instance APIRouter untuk authentication

### Pydantic Models
```python
class Token(BaseModel):
    access_token: str
    token_type: str

class UserCreate(BaseModel):
    username: str
    password: str
    
    @validator('username')
    def username_alphanumeric(cls, v):
        if not v.isalnum():
            raise ValueError('username harus berupa huruf dan angka')
        if len(v) < 3:
            raise ValueError('username minimal 3 karakter')
        return v
```
**Penjelasan:**
- `Token`: Model response untuk access token
- `UserCreate`: Model untuk registrasi user baru
- Validator untuk username (alphanumeric, minimal 3 karakter)
- Validator untuk password (minimal 6 karakter)

### Utility Functions
```python
def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str):
    return pwd_context.hash(password)

def authenticate_user(db: Session, username: str, password: str):
    user = get_user(db, username)
    if not user or not verify_password(password, user.hashed_password):
        return False
    return user
```
**Penjelasan:**
- `verify_password()`: Verifikasi password dengan bcrypt
- `get_password_hash()`: Hash password dengan bcrypt
- `authenticate_user()`: Autentikasi user dengan credentials
- Return user object jika berhasil, False jika gagal

### JWT Token Functions
```python
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
```
**Penjelasan:**
- Function untuk membuat JWT access token
- Set expiration time (default 15 menit)
- Encode payload dengan secret key dan algorithm
- Return JWT token string

### Authentication Endpoints
```python
@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect credentials")
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}
```
**Penjelasan:**
- Endpoint POST `/token` untuk login
- Validasi credentials dengan `authenticate_user()`
- Buat JWT token jika berhasil
- Return access token dan token type

---

*Dokumentasi lengkap telah dibuat untuk sistem prediksi prestasi siswa. File ini mencakup penjelasan detail setiap baris kode dari semua file Python di backend.*

## routes/siswa_router.py

### Import Statements
```python
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Optional, Dict
from database import get_db, Siswa
from schemas import SiswaCreate, SiswaUpdate, SiswaResponse
from datetime import datetime
from routes.auth_router import get_current_user
from models.user import User
import pandas as pd
from io import BytesIO
from sqlalchemy.exc import IntegrityError
```
**Penjelasan:**
- `UploadFile, File`: Untuk handling file upload
- `StreamingResponse`: Untuk streaming file download
- `pandas`: Library untuk manipulasi data Excel
- `BytesIO`: In-memory binary stream untuk file operations
- `IntegrityError`: Exception untuk constraint violations
- Import model Siswa dan schemas terkait

### Router Initialization
```python
router = APIRouter()
```
**Penjelasan:**
- Membuat instance APIRouter untuk endpoint siswa

### Excel Upload Endpoint
```python
@router.post("/upload/excel")
async def upload_siswa_excel(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
```
**Penjelasan:**
- Endpoint POST untuk upload data siswa dari file Excel
- `UploadFile = File(...)`: Parameter file yang wajib diisi
- Memerlukan authentication dengan `get_current_user`

#### File Validation
```python
if not file.filename.endswith(('.xlsx', '.xls')):
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="File harus berformat Excel (.xlsx atau .xls)"
    )
```
**Penjelasan:**
- Validasi ekstensi file harus Excel (.xlsx atau .xls)
- Raise 400 Bad Request jika format tidak sesuai

#### Excel Processing
```python
contents = await file.read()
df = pd.read_excel(BytesIO(contents))

required_columns = ['Nama', 'NIS', 'Jenis Kelamin', 'Kelas', 'Tanggal Lahir', 'Alamat']
missing_columns = [col for col in required_columns if col not in df.columns]
if missing_columns:
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=f"Kolom yang diperlukan tidak ditemukan: {', '.join(missing_columns)}"
    )
```
**Penjelasan:**
- `await file.read()`: Baca konten file secara asynchronous
- `pd.read_excel(BytesIO(contents))`: Parse Excel ke DataFrame
- Validasi kolom yang diperlukan ada dalam file
- Raise exception jika ada kolom yang hilang

#### Data Processing Loop
```python
success_count = 0
error_count = 0
for index, row in df.iterrows():
    try:
        existing_siswa = db.query(Siswa).filter(Siswa.nis == str(row['NIS'])).first()
        if existing_siswa:
            error_count += 1
            continue
        
        new_siswa = Siswa(
            nama=row['Nama'],
            nis=str(row['NIS']),
            jenis_kelamin=row['Jenis Kelamin'],
            kelas=str(row['Kelas']),
            tanggal_lahir=pd.to_datetime(row['Tanggal Lahir']).date(),
            alamat=row['Alamat'] if pd.notna(row['Alamat']) else None
        )
        
        db.add(new_siswa)
        success_count += 1
        
    except Exception as e:
        error_count += 1
        continue
```
**Penjelasan:**
- Loop setiap baris dalam DataFrame
- Check duplikasi NIS sebelum insert
- `pd.to_datetime().date()`: Convert string ke date object
- `pd.notna()`: Check apakah value bukan NaN
- Counter untuk tracking success dan error
- Exception handling per row untuk mencegah rollback total

### Excel Export Endpoint
```python
@router.get("/export/excel")
def export_siswa_excel(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
```
**Penjelasan:**
- Endpoint GET untuk export data siswa ke Excel
- Memerlukan authentication

#### Data Preparation
```python
siswa = db.query(Siswa).all()

data = [{
    'ID': s.id,
    'Nama': s.nama,
    'NIS': s.nis,
    'Jenis Kelamin': s.jenis_kelamin,
    'Kelas': s.kelas,
    'Tanggal Lahir': s.tanggal_lahir.strftime('%Y-%m-%d'),
    'Alamat': s.alamat,
    'Dibuat': s.created_at.strftime('%Y-%m-%d %H:%M:%S'),
    'Diperbarui': s.updated_at.strftime('%Y-%m-%d %H:%M:%S') if s.updated_at else ''
} for s in siswa]
```
**Penjelasan:**
- Query semua data siswa dari database
- Transform ke dictionary dengan format yang sesuai
- `strftime()`: Format datetime ke string
- Conditional formatting untuk updated_at yang bisa None

#### Excel Generation
```python
df = pd.DataFrame(data)

output = BytesIO()
with pd.ExcelWriter(output, engine='openpyxl') as writer:
    df.to_excel(writer, index=False, sheet_name='Data Siswa')

output.seek(0)

headers = {
    'Content-Disposition': 'attachment; filename=Data_Siswa.xlsx'
}
return StreamingResponse(
    output,
    media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    headers=headers
)
```
**Penjelasan:**
- Convert dictionary ke DataFrame
- `BytesIO()`: In-memory binary stream
- `pd.ExcelWriter()`: Writer untuk membuat file Excel
- `output.seek(0)`: Reset pointer ke awal stream
- `StreamingResponse`: Return file sebagai streaming response
- Headers untuk download attachment

### CRUD Operations

#### Create Siswa
```python
@router.post("/", response_model=SiswaResponse, status_code=status.HTTP_201_CREATED)
def create_siswa(
    siswa: SiswaCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_siswa = db.query(Siswa).filter(Siswa.nis == siswa.nis).first()
    if db_siswa:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Siswa dengan NIS {siswa.nis} sudah terdaftar"
        )
    
    new_siswa = Siswa(
        nama=siswa.nama,
        nis=siswa.nis,
        jenis_kelamin=siswa.jenis_kelamin,
        kelas=siswa.kelas,
        tanggal_lahir=siswa.tanggal_lahir,
        alamat=siswa.alamat
    )
    
    db.add(new_siswa)
    db.commit()
    db.refresh(new_siswa)
    
    return new_siswa
```
**Penjelasan:**
- Endpoint POST untuk membuat siswa baru
- Validasi NIS tidak duplikat
- Create instance Siswa dengan data dari request
- `db.refresh()`: Refresh object dengan data dari database (termasuk ID)

#### Read All Siswa
```python
@router.get("/", response_model=List[SiswaResponse])
def get_all_siswa(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Siswa)
    
    if search:
        query = query.filter(
            Siswa.nama.ilike(f"%{search}%") | 
            Siswa.nis.ilike(f"%{search}%") |
            Siswa.kelas.ilike(f"%{search}%")
        )
    
    siswa = query.offset(skip).limit(limit).all()
    return siswa
```
**Penjelasan:**
- Endpoint GET untuk mengambil semua data siswa
- Parameter pagination: `skip` dan `limit`
- Parameter search optional untuk filtering
- `ilike()`: Case-insensitive LIKE query
- OR operator (`|`) untuk multiple search fields

---

*Dokumentasi akan dilanjutkan dengan router lainnya...*

## routes/nilai_router.py

### Import Statements
```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db, NilaiRaport, Siswa
from schemas import NilaiRaportCreate, NilaiRaportUpdate, NilaiRaportResponse
from datetime import datetime
```
**Penjelasan:**
- Import standard FastAPI dan SQLAlchemy components
- Import model NilaiRaport dan Siswa dari database
- Import schemas untuk validasi data nilai raport
- datetime untuk timestamp operations

### Router Initialization
```python
router = APIRouter()
```
**Penjelasan:**
- Membuat instance APIRouter untuk endpoint nilai raport

### Create Nilai Endpoint
```python
@router.post("/", response_model=NilaiRaportResponse, status_code=status.HTTP_201_CREATED)
def create_nilai(nilai: NilaiRaportCreate, db: Session = Depends(get_db)):
```
**Penjelasan:**
- Endpoint POST untuk membuat data nilai raport baru
- Return model NilaiRaportResponse dengan status 201 Created

#### Student Validation
```python
siswa = db.query(Siswa).filter(Siswa.id == nilai.siswa_id).first()
if not siswa:
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Siswa dengan ID {nilai.siswa_id} tidak ditemukan"
    )
```
**Penjelasan:**
- Validasi apakah siswa dengan ID tersebut ada di database
- Raise 404 Not Found jika siswa tidak ditemukan

#### Duplicate Check
```python
existing_nilai = db.query(NilaiRaport).filter(
    NilaiRaport.siswa_id == nilai.siswa_id,
    NilaiRaport.semester == nilai.semester,
    NilaiRaport.tahun_ajaran == nilai.tahun_ajaran
).first()

if existing_nilai:
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=f"Nilai untuk siswa ID {nilai.siswa_id} pada semester {nilai.semester} tahun ajaran {nilai.tahun_ajaran} sudah ada"
    )
```
**Penjelasan:**
- Check duplikasi berdasarkan siswa_id, semester, dan tahun_ajaran
- Satu siswa hanya boleh punya satu nilai per semester per tahun ajaran
- Raise 400 Bad Request jika data sudah ada

#### Average Calculation
```python
nilai_dict = nilai.dict()
matematika = nilai_dict.get('matematika', 0)
bahasa_indonesia = nilai_dict.get('bahasa_indonesia', 0)
bahasa_inggris = nilai_dict.get('bahasa_inggris', 0)
bahasa_jawa = nilai_dict.get('bahasa_jawa', 0)
ipa = nilai_dict.get('ipa', 0)
agama = nilai_dict.get('agama', 0)
pjok = nilai_dict.get('pjok', 0)
pkn = nilai_dict.get('pkn', 0)
sejarah = nilai_dict.get('sejarah', 0)
seni = nilai_dict.get('seni', 0)
dasar_kejuruan = nilai_dict.get('dasar_kejuruan', 0)

rata_rata = (matematika + bahasa_indonesia + bahasa_inggris + bahasa_jawa + ipa + agama + pjok + pkn + sejarah + seni+ dasar_kejuruan) / 11
nilai_dict['rata_rata'] = rata_rata
```
**Penjelasan:**
- Convert Pydantic model ke dictionary
- Extract semua nilai mata pelajaran dengan default 0
- Hitung rata-rata dari 11 mata pelajaran
- Tambahkan rata-rata ke dictionary

#### Data Persistence
```python
new_nilai = NilaiRaport(**nilai_dict)
db.add(new_nilai)
db.commit()
db.refresh(new_nilai)
return new_nilai
```
**Penjelasan:**
- Create instance NilaiRaport dengan unpacking dictionary
- Add ke session, commit, dan refresh untuk mendapatkan ID
- Return object yang sudah tersimpan

### Read All Nilai Endpoint
```python
@router.get("/", response_model=List[NilaiRaportResponse])
def get_all_nilai(skip: int = 0, limit: int = 100, siswa_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(NilaiRaport)
    
    if siswa_id:
        query = query.filter(NilaiRaport.siswa_id == siswa_id)
    
    nilai_list = query.offset(skip).limit(limit).all()
    return nilai_list
```
**Penjelasan:**
- Endpoint GET untuk mengambil semua data nilai raport
- Parameter pagination: skip dan limit
- Optional filter berdasarkan siswa_id
- Return list nilai dengan pagination

### Read Single Nilai Endpoint
```python
@router.get("/{nilai_id}", response_model=NilaiRaportResponse)
def get_nilai(nilai_id: int, db: Session = Depends(get_db)):
    nilai = db.query(NilaiRaport).filter(NilaiRaport.id == nilai_id).first()
    if not nilai:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Nilai dengan ID {nilai_id} tidak ditemukan"
        )
    return nilai
```
**Penjelasan:**
- Endpoint GET untuk mengambil satu data nilai berdasarkan ID
- Path parameter nilai_id
- Raise 404 jika data tidak ditemukan

### Update Nilai Endpoint
```python
@router.put("/{nilai_id}", response_model=NilaiRaportResponse)
def update_nilai(nilai_id: int, nilai_update: NilaiRaportUpdate, db: Session = Depends(get_db)):
```
**Penjelasan:**
- Endpoint PUT untuk update data nilai raport
- Path parameter nilai_id dan request body nilai_update

#### Update Logic
```python
db_nilai = db.query(NilaiRaport).filter(NilaiRaport.id == nilai_id).first()
if not db_nilai:
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Nilai dengan ID {nilai_id} tidak ditemukan"
    )

update_data = nilai_update.dict(exclude_unset=True)
```
**Penjelasan:**
- Cari data nilai yang akan diupdate
- `exclude_unset=True`: Hanya ambil field yang di-set dalam request
- Validasi data exists sebelum update

#### Recalculate Average
```python
nilai_fields = ['matematika', 'bahasa_indonesia', 'bahasa_inggris', 'ipa', 'ips']
nilai_updated = False

for field in nilai_fields:
    if field in update_data:
        nilai_updated = True
        break

if nilai_updated:
    matematika = update_data.get('matematika', db_nilai.matematika)
    bahasa_indonesia = update_data.get('bahasa_indonesia', db_nilai.bahasa_indonesia)
    bahasa_inggris = update_data.get('bahasa_inggris', db_nilai.bahasa_inggris)
    ipa = update_data.get('ipa', db_nilai.ipa)
    ips = update_data.get('ips', db_nilai.ips)
    
    rata_rata = (matematika + bahasa_indonesia + bahasa_inggris + ipa + ips) / 5
    update_data['rata_rata'] = rata_rata
```
**Penjelasan:**
- Check apakah ada field nilai yang diupdate
- Jika ada, hitung ulang rata-rata dengan nilai terbaru
- Gunakan nilai lama jika field tidak diupdate
- Update rata-rata dalam update_data

#### Apply Updates
```python
for key, value in update_data.items():
    setattr(db_nilai, key, value)

db_nilai.updated_at = datetime.now()
db.commit()
db.refresh(db_nilai)
return db_nilai
```
**Penjelasan:**
- Loop semua field dalam update_data dan set ke object
- Update timestamp updated_at
- Commit dan refresh untuk mendapatkan data terbaru

### Delete Nilai Endpoint
```python
@router.delete("/{nilai_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_nilai(nilai_id: int, db: Session = Depends(get_db)):
    db_nilai = db.query(NilaiRaport).filter(NilaiRaport.id == nilai_id).first()
    if not db_nilai:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Nilai dengan ID {nilai_id} tidak ditemukan"
        )
    
    db.delete(db_nilai)
    db.commit()
    return None
```
**Penjelasan:**
- Endpoint DELETE untuk menghapus data nilai raport
- Status 204 No Content untuk successful deletion
- Validasi data exists sebelum delete
- Return None setelah berhasil delete

---

*Dokumentasi akan dilanjutkan dengan router lainnya...*

## routes/prediksi_router.py

### Import Statements
```python
from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db, Siswa, NilaiRaport, PenghasilanOrtu, Presensi, Prestasi
from schemas import PrestasiCreate, PrestasiResponse, PrediksiRequest, PrediksiResponse
from models.c45_model import c45_model
from datetime import datetime
import os
import random
import pandas as pd
from routes.auth_router import get_current_user
from models.user import User
```
**Penjelasan:**
- Import semua model database yang diperlukan untuk prediksi
- Import schemas untuk request dan response prediksi
- Import c45_model instance untuk machine learning operations
- Import random dan pandas untuk data generation
- Body untuk request body parsing

### Router Initialization
```python
router = APIRouter()
```
**Penjelasan:**
- Membuat instance APIRouter untuk endpoint prediksi

### Train Model Endpoint
```python
@router.post("/train", status_code=status.HTTP_200_OK)
def train_model(
    db: Session = Depends(get_db),
    force_train: bool = False,
    current_user: User = Depends(get_current_user)
):
```
**Penjelasan:**
- Endpoint POST untuk melatih model C4.5
- Parameter force_train untuk memaksa training meski data kurang
- Memerlukan authentication

#### Training Logic
```python
try:
    result = c45_model.train(db)
    return {
        "status": "success",
        "message": "Model berhasil dilatih",
        "data": result
    }
except ValueError as e:
    if "Data berlabel tidak cukup" in str(e) and not force_train:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"{str(e)}. Gunakan endpoint /prediksi/generate-dummy-data untuk membuat data dummy, atau gunakan parameter force_train=True untuk melatih dengan data yang ada."
        )
```
**Penjelasan:**
- Try-catch untuk handling training errors
- Specific handling untuk insufficient labeled data
- Memberikan saran solusi dalam error message
- Return training result jika berhasil

### Predict Prestasi Endpoint
```python
@router.post("/", response_model=PrediksiResponse)
def predict_prestasi(
    request: PrediksiRequest,
    db: Session = Depends(get_db),
    force_train: bool = False,
    current_user: User = Depends(get_current_user)
):
```
**Penjelasan:**
- Endpoint POST utama untuk prediksi prestasi siswa
- Request body berisi siswa_id, semester, tahun_ajaran
- Return model PrediksiResponse

#### Student Validation
```python
siswa = db.query(Siswa).filter(Siswa.id == request.siswa_id).first()
if not siswa:
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Siswa dengan ID {request.siswa_id} tidak ditemukan"
    )
```
**Penjelasan:**
- Validasi siswa exists di database
- Raise 404 jika siswa tidak ditemukan

#### Data Collection
```python
nilai = db.query(NilaiRaport).filter(
    NilaiRaport.siswa_id == request.siswa_id,
    NilaiRaport.semester == request.semester,
    NilaiRaport.tahun_ajaran == request.tahun_ajaran
).first()

presensi = db.query(Presensi).filter(
    Presensi.siswa_id == request.siswa_id,
    Presensi.semester == request.semester,
    Presensi.tahun_ajaran == request.tahun_ajaran
).first()

penghasilan = db.query(PenghasilanOrtu).filter(PenghasilanOrtu.siswa_id == request.siswa_id).first()
```
**Penjelasan:**
- Collect semua data yang diperlukan untuk prediksi
- Nilai raport dan presensi berdasarkan semester/tahun ajaran
- Penghasilan ortu tidak terikat semester (data tetap)
- Validasi setiap data exists sebelum prediksi

#### Model Training Check
```python
if not c45_model.trained:
    try:
        c45_model.train(db)
    except ValueError as e:
        if "Data berlabel tidak cukup" in str(e):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"{str(e)}. Gunakan endpoint /prediksi/generate-dummy-data untuk membuat data dummy untuk pengujian."
            )
```
**Penjelasan:**
- Check apakah model sudah dilatih
- Auto-train jika belum dilatih
- Handle insufficient data error dengan pesan informatif

#### Prediction Process
```python
prediction_data = {
    'rata_rata': nilai.rata_rata,
    'kategori_penghasilan': penghasilan.kategori_penghasilan,
    'kategori_kehadiran': presensi.kategori_kehadiran
}

result = c45_model.predict(prediction_data)
```
**Penjelasan:**
- Prepare data dalam format yang dibutuhkan model
- Tiga fitur utama: rata-rata nilai, kategori penghasilan, kategori kehadiran
- Call model predict method

#### Save Prediction Result
```python
prestasi_data = {
    'siswa_id': request.siswa_id,
    'semester': request.semester,
    'tahun_ajaran': request.tahun_ajaran,
    'prediksi_prestasi': result['prediksi'],
    'confidence': result['confidence']
}

existing_prestasi = db.query(Prestasi).filter(
    Prestasi.siswa_id == request.siswa_id,
    Prestasi.semester == request.semester,
    Prestasi.tahun_ajaran == request.tahun_ajaran
).first()

if existing_prestasi:
    for key, value in prestasi_data.items():
        setattr(existing_prestasi, key, value)
    existing_prestasi.updated_at = datetime.now()
    db.commit()
    db.refresh(existing_prestasi)
else:
    new_prestasi = Prestasi(**prestasi_data)
    db.add(new_prestasi)
    db.commit()
```
**Penjelasan:**
- Prepare data untuk disimpan ke database
- Check apakah sudah ada prediksi untuk kombinasi siswa/semester/tahun
- Update existing record atau create new record
- Update timestamp untuk tracking

#### Response Preparation
```python
response = {
    'siswa_id': request.siswa_id,
    'nama_siswa': siswa.nama,
    'prediksi_prestasi': result['prediksi'],
    'confidence': result['confidence'],
    'detail_faktor': {
        'nilai_rata_rata': nilai.rata_rata,
        'kategori_penghasilan': penghasilan.kategori_penghasilan,
        'kategori_kehadiran': presensi.kategori_kehadiran,
        'feature_importances': result['feature_importances']
    }
}
```
**Penjelasan:**
- Compile comprehensive response dengan detail faktor
- Include feature importances untuk explainability
- Return semua informasi yang relevan untuk user

### Get Rules Endpoint
```python
@router.get("/rules")
def get_rules(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not c45_model.trained:
        try:
            c45_model.train(db)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
    
    try:
        rules = c45_model.get_rules()
        return {
            "status": "success",
            "rules": rules
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi kesalahan saat mendapatkan aturan: {str(e)}"
        )
```
**Penjelasan:**
- Endpoint GET untuk mendapatkan decision rules dari model
- Auto-train model jika belum dilatih
- Extract dan return rules dalam format readable
- Berguna untuk understanding model behavior

---

*Dokumentasi akan dilanjutkan dengan endpoint lainnya...* 