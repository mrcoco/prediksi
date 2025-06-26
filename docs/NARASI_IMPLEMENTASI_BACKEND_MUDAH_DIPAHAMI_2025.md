# Narasi Implementasi Backend Sistem EduPro: Penjelasan Mudah Dipahami

**Penulis**: Tim Riset EduPro AI  
**Afiliasi**: Departemen Inovasi Teknologi Pendidikan, EduPro Institute  
**Tanggal**: 21 Juni 2025  
**Versi**: 1.0  

---

## Pendahuluan

Dokumen ini menjelaskan implementasi backend sistem EduPro dengan bahasa yang mudah dipahami. Backend adalah bagian "belakang layar" dari aplikasi yang menangani data, logika bisnis, dan komunikasi dengan database. Bayangkan backend seperti dapur restoran - pelanggan tidak melihat prosesnya, tetapi semua makanan (data) diproses di sana sebelum disajikan ke meja (frontend).

Sistem EduPro menggunakan teknologi modern untuk membangun backend yang handal, aman, dan mudah dikembangkan. Mari kita pelajari tiga aspek utama implementasinya.

---

## 2.2.1. Arsitektur Modular dan Routing

### Apa itu Arsitektur Modular?

**Arsitektur Modular** adalah cara membangun aplikasi dengan membagi kode menjadi bagian-bagian kecil yang terpisah, seperti menyusun rumah dengan blok-blok LEGO. Setiap blok memiliki fungsi spesifik dan dapat diganti tanpa merusak bagian lain.

**Referensi**: 
- Martin, R. C. (2017). *Clean Architecture: A Craftsman's Guide to Software Structure and Design*. Prentice Hall.
- Evans, E. (2003). *Domain-Driven Design: Tackling Complexity in the Heart of Software*. Addison-Wesley.

### Mengapa Menggunakan FastAPI?

**FastAPI** adalah framework (kerangka kerja) Python modern untuk membangun API. Bayangkan FastAPI seperti blueprint rumah yang sudah jadi - Anda tinggal mengisi ruang-ruangnya dengan furniture (kode aplikasi).

**Keunggulan FastAPI**:
- **Cepat**: Performa tinggi, hampir secepat Node.js
- **Mudah**: Sintaks Python yang sederhana
- **Otomatis**: Dokumentasi API dibuat sendiri
- **Aman**: Validasi data built-in

**Referensi**:
- Ramirez, S. (2024). *FastAPI Documentation*. https://fastapi.tiangolo.com/
- Starlette Framework. (2024). *ASGI Framework Documentation*. https://www.starlette.io/

### Struktur Aplikasi EduPro

Aplikasi EduPro dibagi menjadi beberapa modul seperti ini:

```
backend/
├── main.py           # Pintu masuk utama aplikasi
├── routes/           # Folder berisi semua rute API
│   ├── siswa_router.py      # Menangani data siswa
│   ├── nilai_router.py      # Menangani data nilai
│   ├── presensi_router.py   # Menangani data kehadiran
│   ├── penghasilan_router.py # Menangani data ekonomi
│   ├── prediksi_router.py   # Menangani prediksi AI
│   └── auth_router.py       # Menangani login/logout
├── database.py       # Koneksi ke database
├── models.py         # Struktur data
└── schemas.py        # Validasi data
```

### Application Factory Pattern

**Application Factory Pattern** adalah pola desain yang membuat aplikasi seperti pabrik. Alih-alih membuat aplikasi langsung, kita membuat "pabrik" yang bisa menghasilkan aplikasi dengan konfigurasi berbeda.

**Referensi**:
- Gamma, E., et al. (1994). *Design Patterns: Elements of Reusable Object-Oriented Software*. Addison-Wesley.

**Implementasi di EduPro**:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Membuat "pabrik" aplikasi
def create_app():
    app = FastAPI(
        title="🎓 EduPro - Sistem Prediksi Prestasi Siswa",
        description="API untuk prediksi prestasi siswa",
        version="2.0.0"
    )
    
    # Menambahkan middleware (perantara)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Izinkan akses dari mana saja
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    return app

app = create_app()
```

### Apa itu Routing?

**Routing** adalah sistem yang menentukan bagaimana aplikasi merespons permintaan dari pengguna. Bayangkan seperti peta jalan - ketika seseorang ingin pergi ke tempat tertentu (endpoint), routing menunjukkan jalan yang harus ditempuh.

**Referensi**:
- Fielding, R. T. (2000). *Architectural Styles and the Design of Network-based Software Architectures*. Doctoral dissertation, University of California, Irvine.

### Router Modules di EduPro

Setiap router menangani satu area fungsional:

**1. Siswa Router** - Mengelola data siswa
```python
from fastapi import APIRouter

router = APIRouter()

@router.get("/")  # GET /api/siswa
async def get_all_siswa():
    """Mendapatkan daftar semua siswa"""
    return {"message": "Daftar siswa"}

@router.post("/")  # POST /api/siswa
async def create_siswa():
    """Membuat data siswa baru"""
    return {"message": "Siswa berhasil dibuat"}
```

**2. Nilai Router** - Mengelola data nilai akademik
**3. Presensi Router** - Mengelola data kehadiran
**4. Penghasilan Router** - Mengelola data ekonomi keluarga
**5. Prediksi Router** - Mengelola prediksi AI
**6. Auth Router** - Mengelola login dan keamanan

### Middleware Stack

**Middleware** adalah perangkat lunak yang berada di antara sistem operasi dan aplikasi. Bayangkan seperti satpam di gedung - setiap orang yang masuk harus melewati pemeriksaan terlebih dahulu.

**Jenis Middleware di EduPro**:
- **CORS Middleware**: Mengizinkan akses dari domain lain
- **Authentication Middleware**: Memeriksa apakah pengguna sudah login
- **Logging Middleware**: Mencatat semua aktivitas

**Referensi**:
- Mozilla Developer Network. (2024). *Cross-Origin Resource Sharing (CORS)*. https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

### Separation of Concerns

**Separation of Concerns** adalah prinsip yang memisahkan kode berdasarkan fungsinya. Seperti rumah yang memiliki ruang tamu, kamar tidur, dan dapur - setiap ruang memiliki fungsi khusus.

**Manfaat**:
- **Mudah dipelihara**: Jika ada masalah di satu bagian, tidak mempengaruhi bagian lain
- **Tim dapat bekerja parallel**: Setiap developer bisa fokus pada satu modul
- **Testing lebih mudah**: Setiap bagian bisa ditest secara terpisah

**Referensi**:
- Dijkstra, E. W. (1982). *On the role of scientific thought*. Selected writings on computing: a personal perspective, 60-66.

---

## 2.2.2. Desain API dan Validasi Data

### Apa itu API?

**API (Application Programming Interface)** adalah cara aplikasi berkomunikasi satu sama lain. Bayangkan API seperti pelayan di restoran - Anda memesan makanan (request), pelayan memberitahu dapur (backend), dan dapur mengirim makanan (response) melalui pelayan.

**Referensi**:
- Richardson, L., & Ruby, S. (2007). *RESTful Web Services*. O'Reilly Media.

### RESTful API Design

**REST (Representational State Transfer)** adalah gaya arsitektur untuk API yang menggunakan HTTP methods secara konsisten.

**HTTP Methods yang digunakan**:
- **GET**: Mengambil data (seperti membaca buku)
- **POST**: Membuat data baru (seperti menulis halaman baru)
- **PUT**: Mengupdate data lengkap (seperti mengganti halaman)
- **PATCH**: Mengupdate sebagian data (seperti mengoreksi kata)
- **DELETE**: Menghapus data (seperti merobek halaman)

**Referensi**:
- Fielding, R. T., & Taylor, R. N. (2002). *Principled design of the modern Web architecture*. ACM Transactions on Internet Technology, 2(2), 115-150.

### Pydantic untuk Validasi Data

**Pydantic** adalah library Python yang memvalidasi data secara otomatis. Bayangkan seperti security scanner di bandara - setiap barang yang masuk harus sesuai aturan.

**Referensi**:
- Colvin, S. (2024). *Pydantic Documentation*. https://docs.pydantic.dev/

### Schema Design Pattern

**Schema** adalah blueprint atau cetak biru yang mendefinisikan struktur data. Seperti formulir yang memiliki kolom-kolom yang harus diisi.

**Contoh Schema Siswa**:
```python
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SiswaBase(BaseModel):
    """Schema dasar untuk data siswa"""
    nama: str                    # Nama wajib diisi (string)
    nis: str                     # NIS wajib diisi (string)
    jenis_kelamin: str           # Jenis kelamin wajib diisi
    kelas: str                   # Kelas wajib diisi
    tanggal_lahir: datetime      # Tanggal lahir wajib diisi
    alamat: Optional[str] = None # Alamat boleh kosong

class SiswaCreate(SiswaBase):
    """Schema untuk membuat siswa baru"""
    pass  # Menggunakan semua field dari SiswaBase

class SiswaUpdate(BaseModel):
    """Schema untuk mengupdate siswa"""
    # Semua field optional untuk update parsial
    nama: Optional[str] = None
    nis: Optional[str] = None
    jenis_kelamin: Optional[str] = None
    kelas: Optional[str] = None
    tanggal_lahir: Optional[datetime] = None
    alamat: Optional[str] = None

class SiswaResponse(SiswaBase):
    """Schema untuk response API"""
    id: int                      # ID otomatis dari database
    created_at: datetime         # Waktu pembuatan
    updated_at: datetime         # Waktu update terakhir
    
    class Config:
        orm_mode = True          # Kompatibel dengan SQLAlchemy
```

### Type Safety

**Type Safety** adalah fitur yang memastikan data memiliki tipe yang benar. Seperti kotak yang hanya bisa diisi dengan barang tertentu.

**Manfaat Type Safety**:
- **Mengurangi bug**: Error terdeteksi sebelum aplikasi jalan
- **IDE Support**: Editor kode bisa memberikan saran otomatis
- **Dokumentasi hidup**: Kode menjadi self-documenting

**Referensi**:
- Pierce, B. C. (2002). *Types and Programming Languages*. MIT Press.

### Automatic Documentation

**OpenAPI (Swagger)** adalah standar untuk mendokumentasikan API. FastAPI secara otomatis membuat dokumentasi interaktif yang bisa diakses di `/docs`.

**Fitur Dokumentasi**:
- **Interactive Testing**: Bisa test API langsung dari browser
- **Schema Visualization**: Melihat struktur data dengan jelas
- **Code Generation**: Bisa generate client code untuk berbagai bahasa

**Referensi**:
- OpenAPI Initiative. (2024). *OpenAPI Specification*. https://swagger.io/specification/

### Comprehensive Error Handling

**Error Handling** adalah cara aplikasi menangani kesalahan. Seperti sistem alarm yang memberitahu jika ada masalah.

```python
from fastapi import HTTPException, status

@router.post("/siswa")
async def create_siswa(siswa: SiswaCreate):
    try:
        # Cek apakah NIS sudah ada
        existing = db.query(Siswa).filter(Siswa.nis == siswa.nis).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="NIS sudah terdaftar dalam sistem"
            )
        
        # Simpan data siswa
        new_siswa = Siswa(**siswa.dict())
        db.add(new_siswa)
        db.commit()
        
        return {"message": "Siswa berhasil dibuat"}
        
    except Exception as e:
        db.rollback()  # Batalkan perubahan jika ada error
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Gagal menyimpan data: {str(e)}"
        )
```

### HTTP Status Codes

**HTTP Status Codes** adalah kode angka yang menunjukkan hasil dari request API.

**Kode yang sering digunakan**:
- **200 OK**: Request berhasil
- **201 Created**: Data berhasil dibuat
- **400 Bad Request**: Data yang dikirim salah
- **401 Unauthorized**: Belum login
- **403 Forbidden**: Tidak punya izin
- **404 Not Found**: Data tidak ditemukan
- **500 Internal Server Error**: Error di server

**Referensi**:
- Mozilla Developer Network. (2024). *HTTP response status codes*. https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

---

## 2.2.3. Interaksi Database dan Keamanan

### Apa itu Database?

**Database** adalah tempat penyimpanan data yang terorganisir. Bayangkan seperti perpustakaan raksasa yang menyimpan jutaan buku (data) dengan sistem katalog yang rapi.

### Mengapa PostgreSQL?

**PostgreSQL** adalah sistem database yang sangat handal dan canggih. Seperti brankas bank yang sangat aman untuk menyimpan data berharga.

**Keunggulan PostgreSQL**:
- **ACID Compliance**: Menjamin integritas data
- **Scalable**: Bisa menangani data besar
- **Reliable**: Jarang crash atau corrupt
- **Feature Rich**: Banyak fitur canggih

**Referensi**:
- PostgreSQL Global Development Group. (2024). *PostgreSQL Documentation*. https://www.postgresql.org/docs/
- Stonebraker, M., & Rowe, L. A. (1986). *The design of POSTGRES*. ACM SIGMOD Record, 15(2), 340-355.

### SQLAlchemy ORM

**ORM (Object-Relational Mapping)** adalah teknologi yang menerjemahkan antara bahasa pemrograman dan database. Seperti penerjemah yang membantu dua orang berbeda bahasa berkomunikasi.

**SQLAlchemy** adalah ORM terpopuler untuk Python.

**Referensi**:
- Bayer, M. (2024). *SQLAlchemy Documentation*. https://docs.sqlalchemy.org/

### Database Configuration

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

# URL koneksi database
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:postgres@db:5432/prestasi_siswa"
)

# Membuat engine database
engine = create_engine(DATABASE_URL)

# Membuat session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """Fungsi untuk mendapatkan koneksi database"""
    db = SessionLocal()
    try:
        yield db  # Memberikan koneksi ke aplikasi
    finally:
        db.close()  # Tutup koneksi setelah selesai
```

### Database Models

**Model** adalah representasi tabel database dalam kode Python. Seperti blueprint rumah yang menunjukkan ruang-ruang yang ada.

```python
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

class Siswa(Base):
    """Model untuk tabel siswa"""
    __tablename__ = "siswa"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Data siswa
    nama = Column(String, index=True)
    nis = Column(String, unique=True, index=True)  # NIS harus unik
    jenis_kelamin = Column(String)
    kelas = Column(String)
    
    # Timestamp otomatis
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    
    # Relasi dengan tabel lain
    nilai_raport = relationship("NilaiRaport", back_populates="siswa")
    presensi = relationship("Presensi", back_populates="siswa")
```

### ACID Properties

**ACID** adalah prinsip yang menjamin keandalan database:

- **Atomicity**: Transaksi berhasil semua atau gagal semua
- **Consistency**: Data selalu dalam keadaan valid
- **Isolation**: Transaksi tidak saling mengganggu
- **Durability**: Data yang sudah disimpan tidak hilang

**Referensi**:
- Gray, J., & Reuter, A. (1992). *Transaction Processing: Concepts and Techniques*. Morgan Kaufmann.

### Connection Pooling

**Connection Pooling** adalah teknik menggunakan kembali koneksi database untuk efisiensi. Seperti taksi online yang bisa digunakan bergantian oleh banyak penumpang.

**Manfaat**:
- **Performance**: Tidak perlu buat koneksi baru terus-menerus
- **Resource Efficiency**: Menghemat memory dan CPU
- **Scalability**: Bisa menangani banyak user bersamaan

### Keamanan Database

#### 1. JWT Authentication

**JWT (JSON Web Token)** adalah cara aman untuk mengirim informasi antar aplikasi. Bayangkan seperti tiket bioskop yang memiliki informasi terenkripsi dan tidak bisa dipalsukan.

**Referensi**:
- Jones, M., Bradley, J., & Sakimura, N. (2015). *JSON Web Token (JWT)*. RFC 7519.

```python
from jose import JWTError, jwt
from datetime import datetime, timedelta

SECRET_KEY = "kunci-rahasia-yang-sangat-panjang"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120

def create_access_token(data: dict):
    """Membuat JWT token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    """Memverifikasi JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        return username
    except JWTError:
        return None
```

#### 2. Password Hashing

**Password Hashing** adalah proses mengubah password menjadi kode acak yang tidak bisa dibaca. Seperti mengubah tulisan menjadi kode rahasia.

```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Mengubah password menjadi hash"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Memverifikasi password"""
    return pwd_context.verify(plain_password, hashed_password)
```

**Referensi**:
- Provos, N., & Mazières, D. (1999). *A future-adaptable password scheme*. Proceedings of the USENIX Annual Technical Conference.

#### 3. OAuth2 Integration

**OAuth2** adalah standar industri untuk authorization. Seperti sistem kartu akses di gedung kantor - setiap orang punya level akses berbeda.

```python
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Mendapatkan user yang sedang login"""
    username = verify_token(token)
    if username is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token tidak valid"
        )
    
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User tidak ditemukan"
        )
    
    return user
```

**Referensi**:
- Hardt, D. (2012). *The OAuth 2.0 Authorization Framework*. RFC 6749.

#### 4. Role-Based Access Control (RBAC)

**RBAC** adalah sistem yang mengatur siapa boleh mengakses apa berdasarkan peran mereka. Seperti sistem pangkat di militer - setiap pangkat punya wewenang berbeda.

```python
from enum import Enum

class UserRole(Enum):
    ADMIN = "admin"      # Akses penuh
    GURU = "guru"        # Akses terbatas
    STAF = "staf"        # Akses minimal

def require_role(required_role: UserRole):
    """Decorator untuk memeriksa peran user"""
    def decorator(func):
        async def wrapper(*args, **kwargs):
            current_user = kwargs.get('current_user')
            if current_user.role != required_role.value:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Tidak memiliki izin untuk aksi ini"
                )
            return await func(*args, **kwargs)
        return wrapper
    return decorator

@router.delete("/siswa/{siswa_id}")
@require_role(UserRole.ADMIN)  # Hanya admin yang bisa hapus siswa
async def delete_siswa(siswa_id: int, current_user: User = Depends(get_current_user)):
    """Menghapus data siswa (hanya admin)"""
    pass
```

### Input Validation dan SQL Injection Prevention

**SQL Injection** adalah serangan yang memasukkan kode berbahaya melalui input. Seperti orang jahat yang menyamar sebagai tamu untuk masuk ke rumah.

**Cara Pencegahan**:
1. **Parameterized Queries**: Menggunakan placeholder untuk data
2. **ORM Protection**: SQLAlchemy otomatis melindungi dari SQL injection
3. **Input Validation**: Pydantic memvalidasi semua input

```python
# SALAH - Rentan SQL injection
query = f"SELECT * FROM siswa WHERE nama = '{nama_input}'"

# BENAR - Aman dari SQL injection
siswa = db.query(Siswa).filter(Siswa.nama == nama_input).first()
```

**Referensi**:
- OWASP Foundation. (2024). *SQL Injection Prevention Cheat Sheet*. https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html

### Session Management

**Session Management** adalah cara aplikasi mengingat siapa yang sudah login. Seperti gelang di waterpark yang menunjukkan Anda sudah bayar tiket masuk.

```python
from fastapi import Depends

def get_db():
    """Dependency untuk mendapatkan database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()  # Pastikan koneksi selalu ditutup

@router.get("/siswa")
async def get_siswa(db: Session = Depends(get_db)):
    """Endpoint yang menggunakan database session"""
    siswa = db.query(Siswa).all()
    return siswa
```

### Transaction Handling

**Transaction** adalah sekelompok operasi database yang harus berhasil semua atau gagal semua. Seperti transfer uang - uang harus keluar dari rekening A dan masuk ke rekening B, tidak boleh setengah-setengah.

```python
@router.post("/siswa/batch")
async def create_multiple_siswa(siswa_list: List[SiswaCreate], db: Session = Depends(get_db)):
    """Membuat banyak siswa sekaligus dengan transaction"""
    try:
        for siswa_data in siswa_list:
            siswa = Siswa(**siswa_data.dict())
            db.add(siswa)
        
        db.commit()  # Simpan semua perubahan
        return {"message": f"Berhasil membuat {len(siswa_list)} siswa"}
        
    except Exception as e:
        db.rollback()  # Batalkan semua perubahan jika ada error
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Gagal menyimpan data: {str(e)}"
        )
```

---

## Kesimpulan

Implementasi backend sistem EduPro menggunakan pendekatan modern yang mengutamakan:

1. **Modularitas**: Kode terorganisir dengan baik dan mudah dipelihara
2. **Keamanan**: Multi-layer protection untuk melindungi data sensitif
3. **Performance**: Optimasi untuk menangani banyak pengguna
4. **Reliability**: Sistem yang stabil dan dapat diandalkan

Dengan menggunakan teknologi seperti FastAPI, PostgreSQL, dan SQLAlchemy, sistem ini siap untuk digunakan dalam lingkungan produksi dengan tingkat keamanan dan performa yang tinggi.

---

## Daftar Referensi Lengkap

### Framework dan Library
1. Ramirez, S. (2024). *FastAPI Documentation*. https://fastapi.tiangolo.com/
2. Starlette Framework. (2024). *ASGI Framework Documentation*. https://www.starlette.io/
3. Bayer, M. (2024). *SQLAlchemy Documentation*. https://docs.sqlalchemy.org/
4. Colvin, S. (2024). *Pydantic Documentation*. https://docs.pydantic.dev/

### Database
5. PostgreSQL Global Development Group. (2024). *PostgreSQL Documentation*. https://www.postgresql.org/docs/
6. Stonebraker, M., & Rowe, L. A. (1986). *The design of POSTGRES*. ACM SIGMOD Record, 15(2), 340-355.

### Software Engineering Principles
7. Martin, R. C. (2017). *Clean Architecture: A Craftsman's Guide to Software Structure and Design*. Prentice Hall.
8. Evans, E. (2003). *Domain-Driven Design: Tackling Complexity in the Heart of Software*. Addison-Wesley.
9. Gamma, E., et al. (1994). *Design Patterns: Elements of Reusable Object-Oriented Software*. Addison-Wesley.
10. Dijkstra, E. W. (1982). *On the role of scientific thought*. Selected writings on computing: a personal perspective, 60-66.

### Web Architecture
11. Fielding, R. T. (2000). *Architectural Styles and the Design of Network-based Software Architectures*. Doctoral dissertation, University of California, Irvine.
12. Fielding, R. T., & Taylor, R. N. (2002). *Principled design of the modern Web architecture*. ACM Transactions on Internet Technology, 2(2), 115-150.
13. Richardson, L., & Ruby, S. (2007). *RESTful Web Services*. O'Reilly Media.

### Security
14. Jones, M., Bradley, J., & Sakimura, N. (2015). *JSON Web Token (JWT)*. RFC 7519.
15. Hardt, D. (2012). *The OAuth 2.0 Authorization Framework*. RFC 6749.
16. Provos, N., & Mazières, D. (1999). *A future-adaptable password scheme*. Proceedings of the USENIX Annual Technical Conference.
17. OWASP Foundation. (2024). *SQL Injection Prevention Cheat Sheet*. https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html

### Database Theory
18. Gray, J., & Reuter, A. (1992). *Transaction Processing: Concepts and Techniques*. Morgan Kaufmann.
19. Pierce, B. C. (2002). *Types and Programming Languages*. MIT Press.

### Web Standards
20. OpenAPI Initiative. (2024). *OpenAPI Specification*. https://swagger.io/specification/
21. Mozilla Developer Network. (2024). *Cross-Origin Resource Sharing (CORS)*. https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
22. Mozilla Developer Network. (2024). *HTTP response status codes*. https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

---

**Catatan**: Dokumen ini dibuat untuk memudahkan pemahaman implementasi backend sistem EduPro. Setiap istilah teknologi dijelaskan dengan analogi sederhana agar mudah dipahami oleh berbagai kalangan, mulai dari developer pemula hingga stakeholder non-teknis. 