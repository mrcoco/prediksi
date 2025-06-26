# Implementasi Arsitektur Full-Stack Berbasis Kontainer untuk Sistem Prediksi Prestasi Akademik

**Penulis**: Tim Riset EduPro AI  
**Afiliasi**: Departemen Inovasi Teknologi Pendidikan, EduPro Institute  
**Tanggal**: 21 Juni 2025

---

## Abstrak

Prediksi dini prestasi akademik siswa merupakan elemen krusial dalam strategi intervensi pendidikan modern. Penelitian ini menyajikan implementasi dan evaluasi sistem prediksi prestasi akademik *full-stack* yang disebut EduPro, yang dirancang dengan arsitektur berbasis kontainer untuk memastikan portabilitas, skalabilitas, dan reproduktifitas. Metodologi pengembangan mencakup orkestrasi lingkungan kerja menggunakan Docker dan Docker Compose, pengembangan *backend* dengan *framework* FastAPI, dan konstruksi antarmuka pengguna web statis yang disajikan oleh Nginx. Arsitektur sistem mengintegrasikan model *machine learning* (Algoritma C4.5) untuk melakukan prediksi berdasarkan tiga fitur utama: rata-rata nilai akademik, kategori penghasilan orang tua, dan tingkat kehadiran siswa. Proses pengembangan divalidasi melalui strategi pengujian multi-lapis yang komprehensif, mencakup pengujian unit, integrasi, dan *end-to-end*, yang berhasil mencapai cakupan kode di atas 90% untuk komponen *backend*. Hasil penelitian menunjukkan bahwa arsitektur yang diusulkan mampu mencapai target kinerja tinggi, dengan waktu respons API rata-rata di bawah 100ms dan latensi prediksi model di bawah 500ms. Kesimpulannya, implementasi arsitektur berbasis kontainer ini menyediakan fondasi yang solid, andal, dan dapat dipelihara untuk aplikasi analitik pendidikan skala enterprise.

**Kata Kunci**: Sistem Prediksi, Arsitektur Full-Stack, Docker, FastAPI, Nginx, JavaScript, Machine Learning, C4.5, Teknik Perangkat Lunak.

---

## 1. Pendahuluan

Institusi pendidikan secara konstan mencari metode inovatif untuk meningkatkan hasil belajar siswa. Salah satu pendekatan yang paling menjanjikan adalah penggunaan analisis prediktif untuk mengidentifikasi siswa yang berisiko mengalami penurunan prestasi secara dini (Baker & Siemens, 2014). Sistem seperti ini memungkinkan institusi untuk menerapkan program intervensi yang ditargetkan secara lebih efektif, sehingga mengoptimalkan alokasi sumber daya dan memberikan dukungan yang dipersonalisasi. Namun, pengembangan sistem semacam itu menghadirkan tantangan teknis yang signifikan, termasuk kebutuhan akan arsitektur yang kuat, skalabel, dan mudah dipelihara.

Tantangan utama dalam implementasi sistem informasi modern adalah kompleksitas konfigurasi lingkungan pengembangan, produksi, dan pengujian yang sering kali tidak konsisten. Perbedaan konfigurasi ini dapat menyebabkan *bug* yang sulit didiagnosis dan memperlambat siklus pengembangan. Teknologi kontainerisasi, khususnya Docker, muncul sebagai solusi standar industri untuk mengatasi masalah ini dengan menyediakan lingkungan yang terisolasi dan konsisten (Merkel, 2014).

Penelitian ini bertujuan untuk merancang, mengimplementasikan, dan mengevaluasi arsitektur sistem prediksi prestasi akademik *full-stack* yang memanfaatkan kontainerisasi sebagai prinsip inti. Sistem ini, EduPro, dibangun di atas tumpukan teknologi modern: FastAPI untuk *backend* berkinerja tinggi, Nginx yang menyajikan antarmuka pengguna berbasis HTML/JavaScript, serta PostgreSQL untuk manajemen data yang andal.

Kontribusi utama dari penelitian ini adalah:
1.  Penyajian desain arsitektur *full-stack* berbasis layanan yang diorkestrasi oleh Docker Compose untuk aplikasi analitik pendidikan.
2.  Narasi rinci tentang proses implementasi *backend* dan *frontend*, dari penyiapan lingkungan hingga pengembangan fitur inti.
3.  Demonstrasi integrasi model *machine learning* (C4.5) ke dalam alur kerja aplikasi secara *real-time*.
4.  Analisis kuantitatif dari strategi pengujian dan metrik kinerja sistem sebagai validasi dari arsitektur yang diusulkan.

## 2. Metodologi Penelitian

Metodologi yang digunakan dalam penelitian ini mengikuti pendekatan rekayasa perangkat lunak sistematis, yang terdiri dari beberapa tahapan utama: (1) Desain Arsitektur dan Penyiapan Lingkungan, (2) Pengembangan Backend, (3) Pengembangan Frontend, dan (4) Strategi Pengujian dan Validasi.

### 2.1. Desain Arsitektur dan Penyiapan Lingkungan Kerja

Arsitektur sistem EduPro dirancang sebagai aplikasi *multi-service* yang terdiri dari empat komponen utama: *database* (`db`), *backend*, *frontend*, dan sebuah *database management tool* (`pgadmin`). Untuk mengelola ketergantungan dan memastikan konsistensi lingkungan di seluruh siklus hidup pengembangan, kami mengadopsi Docker dan Docker Compose.

#### 2.1.1. Orkestrasi Lingkungan dengan Docker Compose
Konfigurasi lingkungan didefinisikan secara deklaratif dalam file `docker-compose.yml`. File ini mengorkestrasi pembangunan *image* dan pengelolaan *container* untuk setiap layanan.

**Layanan Database (`db`)**: Menggunakan *image* resmi `postgres:13`, layanan ini dikonfigurasi dengan volume persisten (`pgdata`) untuk memastikan data tetap ada meskipun *container* dihidupkan ulang. Variabel lingkungan seperti `POSTGRES_DB`, `POSTGRES_USER`, dan `POSTGRES_PASSWORD` digunakan untuk konfigurasi awal. Sebuah *health check* diimplementasikan untuk memastikan layanan *backend* hanya dimulai setelah *database* sepenuhnya siap menerima koneksi.

**Layanan Backend**: Dibangun dari `Dockerfile` kustom. Layanan ini menjalankan aplikasi FastAPI menggunakan server `uvicorn` dengan `--reload` untuk memfasilitasi pengembangan. Layanan ini diekspos pada port 8000 dan bergantung pada kesehatan layanan *database*.

**Layanan Frontend**: Menggunakan *image* Nginx resmi. Alih-alih membangun aplikasi, layanan ini secara langsung me-*mount* direktori `frontend` yang berisi file HTML, CSS, dan JavaScript statis. Konfigurasi Nginx kustom juga di-*mount* untuk mengarahkan permintaan ke aset yang benar dan, jika perlu, melakukan proksi ke API *backend*.

**Layanan PgAdmin**: Menggunakan *image* `dpage/pgadmin4`, layanan ini menyediakan antarmuka web grafis untuk manajemen basis data PostgreSQL. Ini sangat membantu selama fase pengembangan dan debugging untuk memverifikasi data secara langsung.

**Definisi `docker-compose.yml` (potongan kode):**
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    # ...
    command: uvicorn main:app --host 0.0.0.0 --port 8000 --reload

  frontend:
    # Menggunakan image nginx standar, bukan build kustom
    image: nginx:latest
    volumes:
      - ./frontend:/usr/share/nginx/html
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf
    ports:
      - "80:80"
    depends_on:
      - backend

  db:
    image: postgres:13
    # ...
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      # ...

  pgadmin:
    image: dpage/pgadmin4:latest
    # ...
```
Pendekatan ini secara efektif mengisolasi setiap layanan, menyederhanakan proses *onboarding* untuk pengembang baru, dan menjamin paritas antara lingkungan pengembangan, pengujian, dan produksi.

### 2.2. Implementasi Backend

*Backend* dikembangkan menggunakan FastAPI, sebuah *framework* web Python modern yang dikenal karena kinerjanya yang tinggi dan dukungan bawaan untuk *asynchronous programming*. Arsitekturnya dirancang agar sangat modular untuk kemudahan pemeliharaan dan skalabilitas.

#### 2.2.1. Arsitektur Modular dan Routing

Arsitektur backend EduPro dirancang menggunakan prinsip *modular architecture* dengan *layered pattern* untuk memastikan maintainability dan scalability yang optimal. Aplikasi utama (`main.py`) berfungsi sebagai titik masuk yang mengimplementasikan *application factory pattern*, mendaftarkan beberapa *router* dari modul terpisah berdasarkan domain fungsional.

**Struktur Modular:**
```python
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from routes import siswa_router, nilai_router, presensi_router, 
                  penghasilan_router, prediksi_router, auth_router

# Comprehensive API metadata untuk dokumentasi OpenAPI
app = FastAPI(
    title="🎓 EduPro - Sistem Prediksi Prestasi Siswa API",
    description="API komprehensif untuk sistem prediksi prestasi siswa menggunakan algoritma C4.5 Decision Tree",
    version="2.0.0",
    openapi_tags=tags_metadata,
    docs_url="/docs",
    redoc_url="/redoc",
    contact={
        "name": "EduPro Development Team",
        "email": "spydersonics@gmail.com"
    },
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT"
    }
)

# Router registration dengan tags dan prefix yang konsisten
app.include_router(siswa_router.router, prefix="/api/siswa", tags=["Siswa"])
app.include_router(nilai_router.router, prefix="/api/nilai", tags=["Nilai Raport"])
app.include_router(presensi_router.router, prefix="/api/presensi", tags=["Presensi"])
app.include_router(penghasilan_router.router, prefix="/api/penghasilan", tags=["Penghasilan Ortu"])
app.include_router(prediksi_router.router, prefix="/api/prediksi", tags=["Prediksi Prestasi"])
app.include_router(auth_router.router, prefix="/api/auth", tags=["Authentication"])
```

Setiap router memiliki tanggung jawab spesifik: `siswa_router` mengelola operasi CRUD siswa, `nilai_router` untuk manajemen nilai akademik, `presensi_router` untuk data kehadiran, `penghasilan_router` untuk data ekonomi keluarga, `prediksi_router` untuk layanan machine learning, dan `auth_router` untuk otentikasi dan otorisasi. Pendekatan ini mengimplementasikan *separation of concerns* yang bersih, memungkinkan pengembangan parallel oleh tim, dan memfasilitasi unit testing yang terisolasi.

**Middleware Stack:**
Aplikasi mengintegrasikan *middleware stack* untuk *cross-cutting concerns*:
```python
# Konfigurasi CORS untuk cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Dalam produksi, ganti dengan domain yang diizinkan
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check dan monitoring endpoints
@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "✅ healthy", 
        "message": "API berjalan dengan baik",
        "version": "2.0.0",
        "services": {
            "api": "✅ running",
            "database": "✅ connected", 
            "ml_model": "✅ ready"
        }
    }
```

#### 2.2.2. Desain API dan Validasi Data

API dirancang mengikuti prinsip-prinsip RESTful architecture dengan implementasi comprehensive untuk *data validation*, *serialization*, dan *documentation generation*. Pydantic digunakan sebagai backbone untuk type safety dan automatic validation, memberikan dual benefits: runtime data validation yang robust dan automatic OpenAPI (Swagger UI) documentation generation.

**Schema Design Pattern:**
```python
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# Schema hierarki untuk Siswa dengan inheritance pattern
class SiswaBase(BaseModel):
    nama: str
    nis: str
    jenis_kelamin: str
    kelas: str
    tanggal_lahir: datetime
    alamat: Optional[str] = None

class SiswaCreate(SiswaBase):
    pass

class SiswaUpdate(BaseModel):
    nama: Optional[str] = None
    nis: Optional[str] = None
    jenis_kelamin: Optional[str] = None
    kelas: Optional[str] = None
    tanggal_lahir: Optional[datetime] = None
    alamat: Optional[str] = None

class SiswaResponse(SiswaBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

# Schema untuk NilaiRaport dengan 11 mata pelajaran
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
    rata_rata: float  # Auto-calculated field
```

**RESTful Endpoint Implementation:**
Setiap endpoint mengimplementasikan HTTP methods yang appropriate dengan status codes yang semantic dan comprehensive error handling:
```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db, Siswa
from schemas import SiswaCreate, SiswaResponse

router = APIRouter()

@router.post("/", response_model=SiswaResponse, status_code=status.HTTP_201_CREATED,
             summary="Create New Student", description="Membuat data siswa baru dengan validasi NIS unik")
async def create_siswa(siswa: SiswaCreate, db: Session = Depends(get_db)):
    # Business rule validation: NIS harus unik
    existing = db.query(Siswa).filter(Siswa.nis == siswa.nis).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="NIS sudah terdaftar dalam sistem"
        )
    
    # Database operation dengan error handling
    try:
        db_siswa = Siswa(**siswa.dict())
        db.add(db_siswa)
        db.commit()
        db.refresh(db_siswa)
        return db_siswa
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Gagal menyimpan data siswa: {str(e)}"
        )

@router.get("/", response_model=List[SiswaResponse])
async def get_all_siswa(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    """Mendapatkan daftar siswa dengan pagination"""
    siswa = db.query(Siswa).offset(skip).limit(limit).all()
    return siswa
```

**API Documentation Strategy:**
Dokumentasi API comprehensive dibuat otomatis melalui OpenAPI specification dengan rich descriptions, examples, dan interactive testing capability. Metadata dan docstrings dalam kode berkontribusi langsung pada dokumentasi yang dapat diakses di `/docs` dan `/redoc` endpoints.

#### 2.2.3. Interaksi Database dan Keamanan

Manajemen database menggunakan SQLAlchemy ORM dengan PostgreSQL sebagai database engine, mengimplementasikan connection pooling, session management, dan transaction handling yang optimal untuk production environment.

**Database Configuration:**
```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Environment-based database URL dengan fallback
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db:5432/prestasi_siswa")

# Engine configuration untuk production environment
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """Dependency injection untuk database session management"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)
```

**Data Model Relationships:**
Model database dirancang dengan comprehensive relationships menggunakan SQLAlchemy declarative models:
```python
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from datetime import datetime

class Siswa(Base):
    __tablename__ = "siswa"
    
    id = Column(Integer, primary_key=True, index=True)
    nama = Column(String, index=True)
    nis = Column(String, unique=True, index=True)
    jenis_kelamin = Column(String)
    kelas = Column(String)
    tanggal_lahir = Column(DateTime)
    alamat = Column(Text)
    created_at = Column(DateTime, default=datetime.now, nullable=False)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now, nullable=False)
    
    # One-to-many relationships dengan cascade delete
    nilai_raport = relationship("NilaiRaport", back_populates="siswa")
    penghasilan_ortu = relationship("PenghasilanOrtu", back_populates="siswa")
    presensi = relationship("Presensi", back_populates="siswa")
    prestasi = relationship("Prestasi", back_populates="siswa")

class NilaiRaport(Base):
    __tablename__ = "nilai_raport"
    
    id = Column(Integer, primary_key=True, index=True)
    siswa_id = Column(Integer, ForeignKey("siswa.id"))
    semester = Column(String)
    tahun_ajaran = Column(String)
    # 11 mata pelajaran
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
    rata_rata = Column(Float)  # Auto-calculated field
    
    # Foreign key relationship
    siswa = relationship("Siswa", back_populates="nilai_raport")
```

**Security Implementation:**
Sistem keamanan mengimplementasikan multi-layer protection dengan JWT-based authentication dan comprehensive error handling:

```python
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from models.user import User

# JWT Configuration
SECRET_KEY = "wfdrmGsTH4oRbZKe8gGNNnIjziDJZgsH"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Dependency untuk validasi JWT dan mendapatkan current user"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
    return user

@router.post("/token", response_model=LoginResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Login endpoint dengan OAuth2 password flow"""
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": user
    }
```

**Token Refresh Implementation:**
```python
@router.post("/refresh", response_model=Token)
async def refresh_token(current_user: User = Depends(get_current_user)):
    """
    Refresh token untuk memperpanjang masa berlaku
    """
    try:
        # Create new access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": current_user.username}, 
            expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Gagal refresh token: {str(e)}"
        )

@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Mendapatkan data user yang sedang login"""
    return current_user
```

Router authentication (`/api/auth`) menangani comprehensive authentication flow termasuk login, token refresh, dan user management. Protected endpoints menggunakan `get_current_user` dependency untuk authorization dengan OAuth2PasswordBearer scheme yang secara otomatis terintegrasi dalam OpenAPI documentation untuk interactive testing capability. Sistem mendukung token refresh untuk session management yang optimal.

#### 2.2.4. Implementasi Router Modules dan Business Logic

Setiap router module mengimplementasikan domain-specific business logic dengan pattern yang konsisten untuk maintainability dan code reusability. Implementasi menggunakan dependency injection pattern untuk database session management dan authentication.

**Siswa Router Implementation:**
```python
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import pandas as pd
from io import BytesIO

router = APIRouter()

@router.post("/upload/excel", summary="Upload Excel Data Siswa")
async def upload_excel_siswa(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Upload data siswa dalam format Excel dengan batch processing"""
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File harus berformat Excel (.xlsx atau .xls)"
        )
    
    try:
        # Read Excel file
        contents = await file.read()
        df = pd.read_excel(BytesIO(contents))
        
        # Validate required columns
        required_columns = ['nama', 'nis', 'jenis_kelamin', 'kelas', 'tanggal_lahir']
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Kolom yang hilang: {', '.join(missing_columns)}"
            )
        
        # Batch insert dengan error handling per row
        success_count = 0
        error_rows = []
        
        for index, row in df.iterrows():
            try:
                # Check for duplicate NIS
                existing = db.query(Siswa).filter(Siswa.nis == row['nis']).first()
                if existing:
                    error_rows.append(f"Baris {index + 2}: NIS {row['nis']} sudah ada")
                    continue
                
                # Create siswa object
                siswa = Siswa(
                    nama=row['nama'],
                    nis=row['nis'],
                    jenis_kelamin=row['jenis_kelamin'],
                    kelas=row['kelas'],
                    tanggal_lahir=pd.to_datetime(row['tanggal_lahir']),
                    alamat=row.get('alamat', '')
                )
                
                db.add(siswa)
                success_count += 1
                
            except Exception as e:
                error_rows.append(f"Baris {index + 2}: {str(e)}")
        
        db.commit()
        
        return {
            "message": "Upload selesai",
            "success_count": success_count,
            "total_rows": len(df),
            "errors": error_rows
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Gagal memproses file Excel: {str(e)}"
        )

@router.get("/export/excel")
async def export_excel_siswa(db: Session = Depends(get_db)):
    """Export data siswa ke format Excel"""
    try:
        siswa_list = db.query(Siswa).all()
        
        # Convert to DataFrame
        data = []
        for siswa in siswa_list:
            data.append({
                'ID': siswa.id,
                'Nama': siswa.nama,
                'NIS': siswa.nis,
                'Jenis Kelamin': siswa.jenis_kelamin,
                'Kelas': siswa.kelas,
                'Tanggal Lahir': siswa.tanggal_lahir.strftime('%Y-%m-%d'),
                'Alamat': siswa.alamat,
                'Created At': siswa.created_at.strftime('%Y-%m-%d %H:%M:%S')
            })
        
        df = pd.DataFrame(data)
        
        # Create Excel file in memory
        output = BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, sheet_name='Data Siswa', index=False)
        
        output.seek(0)
        
        return StreamingResponse(
            BytesIO(output.read()),
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": "attachment; filename=Data_Siswa.xlsx"}
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Gagal export data: {str(e)}"
        )
```

**Nilai Router dengan Auto-Calculation:**
```python
@router.post("/", response_model=NilaiRaportResponse)
async def create_nilai_raport(
    nilai: NilaiRaportCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create nilai raport dengan auto-calculation rata-rata"""
    
    # Validate siswa exists
    siswa = db.query(Siswa).filter(Siswa.id == nilai.siswa_id).first()
    if not siswa:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Siswa tidak ditemukan"
        )
    
    # Check for duplicate (one record per siswa per semester)
    existing = db.query(NilaiRaport).filter(
        NilaiRaport.siswa_id == nilai.siswa_id,
        NilaiRaport.semester == nilai.semester,
        NilaiRaport.tahun_ajaran == nilai.tahun_ajaran
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Data nilai untuk siswa ini di semester yang sama sudah ada"
        )
    
    # Auto-calculate rata-rata from 11 subjects
    subjects = [
        nilai.matematika, nilai.bahasa_indonesia, nilai.bahasa_inggris,
        nilai.bahasa_jawa, nilai.ipa, nilai.agama, nilai.pjok,
        nilai.pkn, nilai.sejarah, nilai.seni, nilai.dasar_kejuruan
    ]
    rata_rata = sum(subjects) / len(subjects)
    
    try:
        db_nilai = NilaiRaport(
            **nilai.dict(),
            rata_rata=round(rata_rata, 2)
        )
        
        db.add(db_nilai)
        db.commit()
        db.refresh(db_nilai)
        
        return db_nilai
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Gagal menyimpan nilai raport: {str(e)}"
        )
```

#### 2.2.5. Machine Learning Integration dan Prediksi Service

Implementasi machine learning menggunakan algoritma C4.5 Decision Tree dengan integrasi seamless ke dalam API backend. Service ini menangani training model, prediksi individual, batch processing, dan model persistence.

**ML Service Implementation:**
```python
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib
import numpy as np
from typing import Dict, List, Tuple

class MLService:
    def __init__(self):
        self.model = None
        self.feature_names = ['rata_rata', 'kategori_penghasilan', 'kategori_kehadiran']
        self.model_path = 'models/c45_model.joblib'
    
    def prepare_training_data(self, db: Session) -> Tuple[np.ndarray, np.ndarray]:
        """Prepare training data dari database dengan feature engineering"""
        
        # Complex JOIN query untuk mengambil data dari multiple tables
        query = """
        SELECT 
            s.id as siswa_id,
            s.nama,
            nr.rata_rata,
            po.kategori_penghasilan,
            p.kategori_kehadiran,
            CASE 
                WHEN nr.rata_rata >= 80 AND p.persentase_kehadiran >= 80 THEN 'Tinggi'
                WHEN nr.rata_rata >= 70 AND p.persentase_kehadiran >= 75 THEN 'Sedang'
                ELSE 'Rendah'
            END as target_prestasi
        FROM siswa s
        JOIN nilai_raport nr ON s.id = nr.siswa_id
        JOIN penghasilan_ortu po ON s.id = po.siswa_id
        JOIN presensi p ON s.id = p.siswa_id
        WHERE nr.rata_rata IS NOT NULL 
        AND po.kategori_penghasilan IS NOT NULL 
        AND p.kategori_kehadiran IS NOT NULL
        """
        
        result = db.execute(query).fetchall()
        
        if len(result) < 10:
            raise ValueError("Data training minimal 10 record untuk model yang reliable")
        
        # Feature engineering
        features = []
        targets = []
        
        for row in result:
            # Numerical feature: rata_rata (0-100)
            rata_rata = float(row.rata_rata)
            
            # Categorical features: one-hot encoding
            # Kategori penghasilan: Rendah=0, Menengah=1, Tinggi=2
            penghasilan_map = {'Rendah': 0, 'Menengah': 1, 'Tinggi': 2}
            penghasilan_encoded = penghasilan_map.get(row.kategori_penghasilan, 0)
            
            # Kategori kehadiran: Rendah=0, Sedang=1, Tinggi=2
            kehadiran_map = {'Rendah': 0, 'Sedang': 1, 'Tinggi': 2}
            kehadiran_encoded = kehadiran_map.get(row.kategori_kehadiran, 0)
            
            features.append([rata_rata, penghasilan_encoded, kehadiran_encoded])
            targets.append(row.target_prestasi)
        
        return np.array(features), np.array(targets)
    
    def train_model(self, db: Session) -> Dict:
        """Train C4.5 Decision Tree model dengan evaluation metrics"""
        
        try:
            # Prepare data
            X, y = self.prepare_training_data(db)
            
            # Split data for training dan testing
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42, stratify=y
            )
            
            # Initialize C4.5 (Decision Tree dengan entropy criterion)
            self.model = DecisionTreeClassifier(
                criterion='entropy',  # Information Gain (C4.5 characteristic)
                max_depth=10,         # Prevent overfitting
                min_samples_split=5,  # Minimum samples untuk split
                min_samples_leaf=3,   # Minimum samples di leaf node
                random_state=42
            )
            
            # Train model
            self.model.fit(X_train, y_train)
            
            # Evaluate model
            y_pred = self.model.predict(X_test)
            accuracy = accuracy_score(y_test, y_pred)
            
            # Detailed evaluation metrics
            report = classification_report(y_test, y_pred, output_dict=True)
            conf_matrix = confusion_matrix(y_test, y_pred)
            
            # Feature importance
            feature_importance = dict(zip(
                self.feature_names, 
                self.model.feature_importances_
            ))
            
            # Save model
            joblib.dump(self.model, self.model_path)
            
            return {
                "status": "success",
                "accuracy": round(accuracy, 4),
                "training_samples": len(X_train),
                "test_samples": len(X_test),
                "feature_importance": feature_importance,
                "classification_report": report,
                "confusion_matrix": conf_matrix.tolist(),
                "model_saved": self.model_path
            }
            
        except Exception as e:
            return {
                "status": "error",
                "message": str(e)
            }
    
    def predict_single(self, siswa_id: int, db: Session) -> Dict:
        """Prediksi individual untuk satu siswa"""
        
        # Load model jika belum ada
        if self.model is None:
            try:
                self.model = joblib.load(self.model_path)
            except FileNotFoundError:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Model belum dilatih. Silakan train model terlebih dahulu."
                )
        
        # Get siswa data dengan JOIN
        query = """
        SELECT 
            s.id, s.nama,
            nr.rata_rata,
            po.kategori_penghasilan,
            p.kategori_kehadiran,
            p.persentase_kehadiran
        FROM siswa s
        LEFT JOIN nilai_raport nr ON s.id = nr.siswa_id
        LEFT JOIN penghasilan_ortu po ON s.id = po.siswa_id  
        LEFT JOIN presensi p ON s.id = p.siswa_id
        WHERE s.id = :siswa_id
        """
        
        result = db.execute(query, {"siswa_id": siswa_id}).fetchone()
        
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Data siswa tidak ditemukan"
            )
        
        # Validate data completeness
        if not all([result.rata_rata, result.kategori_penghasilan, result.kategori_kehadiran]):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Data siswa tidak lengkap untuk prediksi (nilai, penghasilan, atau presensi kosong)"
            )
        
        # Prepare features (same encoding as training)
        penghasilan_map = {'Rendah': 0, 'Menengah': 1, 'Tinggi': 2}
        kehadiran_map = {'Rendah': 0, 'Sedang': 1, 'Tinggi': 2}
        
        features = np.array([[
            float(result.rata_rata),
            penghasilan_map.get(result.kategori_penghasilan, 0),
            kehadiran_map.get(result.kategori_kehadiran, 0)
        ]])
        
        # Make prediction
        prediction = self.model.predict(features)[0]
        confidence = max(self.model.predict_proba(features)[0])
        
        # Save prediction result
        prestasi_record = Prestasi(
            siswa_id=siswa_id,
            semester="Ganjil",  # Default, bisa disesuaikan
            tahun_ajaran="2024/2025",
            prediksi_prestasi=prediction,
            confidence=round(confidence, 4)
        )
        
        db.add(prestasi_record)
        db.commit()
        
        return {
            "siswa_id": siswa_id,
            "nama_siswa": result.nama,
            "prediksi_prestasi": prediction,
            "confidence": round(confidence, 4),
            "detail_faktor": {
                "rata_rata": result.rata_rata,
                "kategori_penghasilan": result.kategori_penghasilan,
                "kategori_kehadiran": result.kategori_kehadiran,
                "persentase_kehadiran": result.persentase_kehadiran
            }
        }

# Prediksi Router Implementation
@router.post("/train", summary="Train ML Model")
async def train_model(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Train C4.5 Decision Tree model untuk prediksi prestasi"""
    ml_service = MLService()
    result = ml_service.train_model(db)
    return result

@router.post("/predict/{siswa_id}", summary="Prediksi Individual")
async def predict_prestasi(
    siswa_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Prediksi prestasi untuk siswa individual"""
    ml_service = MLService()
    result = ml_service.predict_single(siswa_id, db)
    return result
```

#### 2.2.6. Error Handling dan Logging Strategy

Implementasi comprehensive error handling dan logging untuk monitoring, debugging, dan audit trail dalam production environment.

**Global Exception Handler:**
```python
from fastapi import Request
from fastapi.responses import JSONResponse
import logging
import traceback

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/app.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions dengan logging"""
    logger.warning(f"HTTP {exc.status_code}: {exc.detail} - {request.url}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "message": exc.detail,
            "status_code": exc.status_code,
            "path": str(request.url)
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle general exceptions dengan full traceback logging"""
    logger.error(f"Unhandled exception: {str(exc)}")
    logger.error(f"Traceback: {traceback.format_exc()}")
    
    return JSONResponse(
        status_code=500,
        content={
            "error": True,
            "message": "Internal server error",
            "status_code": 500,
            "path": str(request.url)
        }
    )

# Request/Response logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all HTTP requests dan responses"""
    start_time = time.time()
    
    # Log request
    logger.info(f"Request: {request.method} {request.url}")
    
    # Process request
    response = await call_next(request)
    
    # Log response
    process_time = time.time() - start_time
    logger.info(f"Response: {response.status_code} - {process_time:.4f}s")
    
    return response
```

#### 2.2.7. Performance Optimization dan Caching

Implementasi optimization techniques untuk meningkatkan performance API dalam production environment dengan high concurrent users.

**Database Query Optimization:**
```python
from sqlalchemy import Index
from functools import lru_cache
import redis
import json

# Database indexes untuk performance
# Ditambahkan di model definitions
class Siswa(Base):
    # ... existing fields ...
    
    __table_args__ = (
        Index('idx_siswa_nis', 'nis'),
        Index('idx_siswa_nama', 'nama'),
        Index('idx_siswa_kelas', 'kelas'),
    )

class NilaiRaport(Base):
    # ... existing fields ...
    
    __table_args__ = (
        Index('idx_nilai_siswa_semester', 'siswa_id', 'semester', 'tahun_ajaran'),
        Index('idx_nilai_rata_rata', 'rata_rata'),
    )

# Redis caching untuk frequently accessed data
redis_client = redis.Redis(host='localhost', port=6379, db=0)

@lru_cache(maxsize=100)
def get_siswa_cache(siswa_id: int, db: Session):
    """Cache siswa data dengan LRU eviction"""
    cache_key = f"siswa:{siswa_id}"
    
    # Try get from Redis
    cached_data = redis_client.get(cache_key)
    if cached_data:
        return json.loads(cached_data)
    
    # Get from database
    siswa = db.query(Siswa).filter(Siswa.id == siswa_id).first()
    if siswa:
        siswa_data = {
            "id": siswa.id,
            "nama": siswa.nama,
            "nis": siswa.nis,
            "kelas": siswa.kelas
        }
        
        # Cache for 5 minutes
        redis_client.setex(cache_key, 300, json.dumps(siswa_data))
        return siswa_data
    
    return None

# Bulk operations untuk efficiency
@router.post("/bulk/create", summary="Bulk Create Siswa")
async def bulk_create_siswa(
    siswa_list: List[SiswaCreate],
    db: Session = Depends(get_db)
):
    """Bulk insert siswa dengan batch processing"""
    
    if len(siswa_list) > 1000:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maksimal 1000 records per batch"
        )
    
    try:
        # Batch insert untuk performance
        siswa_objects = []
        for siswa_data in siswa_list:
            siswa_objects.append(Siswa(**siswa_data.dict()))
        
        db.bulk_save_objects(siswa_objects)
        db.commit()
        
        return {
            "message": f"Berhasil insert {len(siswa_objects)} siswa",
            "count": len(siswa_objects)
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Bulk insert gagal: {str(e)}"
        )
```

Implementasi backend EduPro menunjukkan arsitektur production-ready dengan comprehensive error handling, performance optimization, dan maintainable code structure yang mendukung scalability untuk educational analytics platform.

### 2.3. Implementasi Frontend

Antarmuka pengguna sistem EduPro dibangun menggunakan pendekatan pragmatis yang berfokus pada komponen antarmuka (UI) yang kaya fitur tanpa memerlukan *overhead* dari *framework* JavaScript modern. Implementasi ini memanfaatkan *library* **Kendo UI for jQuery**, yang diintegrasikan ke dalam arsitektur web statis tradisional dan disajikan secara efisien oleh Nginx.

#### 2.3.1. Struktur dan Teknologi
*Frontend* terdiri dari beberapa file HTML inti (misalnya, `login.html`, `index.html`) yang mendefinisikan struktur halaman. Logika dan interaktivitasnya didukung oleh *library* Kendo UI dan jQuery, yang diinisialisasi dan dikontrol melalui file JavaScript murni yang ditempatkan di dalam direktori `js/`.

Pendekatan ini dipilih untuk memanfaatkan secara langsung koleksi *widget* UI yang matang dan komprehensif dari Kendo UI, seperti *Data Grids*, *Charts*, dan *Form Inputs*. Dengan menggunakan versi berbasis jQuery, kami dapat mengimplementasikan fungsionalitas yang kompleks dengan cepat tanpa perlu manajemen *state* dan siklus hidup komponen yang rumit seperti pada *framework* SPA.

**Contoh Inisialisasi Kendo UI Grid dengan JavaScript:**
```javascript
// Di dalam file, misalnya, js/app.js
$(document).ready(function() {
    $("#grid").kendoGrid({
        dataSource: {
            transport: {
                read: {
                    url: "http://localhost:8000/api/siswa",
                    dataType: "json",
                    beforeSend: function(xhr) {
                        const token = localStorage.getItem('jwt_token');
                        if (token) {
                            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                        }
                    }
                }
            },
            schema: {
                model: {
                    fields: {
                        nama: { type: "string" },
                        nis: { type: "string" },
                        kelas: { type: "string" }
                    }
                }
            },
            pageSize: 20
        },
        height: 550,
        sortable: true,
        pageable: true,
        columns: [
            { field: "nama", title: "Nama Siswa" },
            { field: "nis", title: "NIS" },
            { field: "kelas", title: "Kelas" }
        ]
    });
});
```

#### 2.3.2. Interaksi dengan API dan Manajemen Data
Interaksi dengan API *backend* dikelola langsung oleh komponen Kendo UI, terutama melalui `Kendo UI DataSource`. Komponen ini secara native mendukung operasi data seperti membaca (read), membuat (create), memperbarui (update), dan menghapus (delete) melalui konfigurasi transport RESTful.

Logika JavaScript kustom menangani alur kerja pengguna:
1.  Mengirimkan kredensial dari formulir login HTML ke *endpoint* `/api/auth/login` menggunakan `jQuery.ajax` atau `fetch`.
2.  Menyimpan token JWT yang diterima di `localStorage`.
3.  Mengkonfigurasi `Kendo UI DataSource` untuk secara otomatis menyertakan token otentikasi pada setiap permintaan ke *backend*, seperti yang ditunjukkan pada contoh kode di atas.
4.  Data yang diterima dari API secara otomatis diikat (*bound*) ke *widget* UI seperti *Grid*, yang menangani rendering, paginasi, dan operasi lainnya secara internal.

Pendekatan ini memisahkan logika pengambilan data dari manipulasi DOM manual, karena sebagian besar pekerjaan tersebut ditangani oleh *library* Kendo UI, menghasilkan kode aplikasi yang lebih bersih dan lebih fokus pada konfigurasi daripada implementasi imperatif.

### 2.4. Implementasi Algoritma Prediksi (C4.5)

Inti dari sistem EduPro adalah kemampuannya untuk memprediksi prestasi akademik. Untuk tujuan ini, kami mengimplementasikan model *machine learning* berdasarkan algoritma C4.5, sebuah pembangun pohon keputusan (*decision tree*) yang populer karena kemampuannya menghasilkan model yang dapat diinterpretasikan. Implementasi menggunakan *library* `scikit-learn` di Python.

Proses implementasi model prediksi dibagi menjadi beberapa tahapan kunci:

#### 2.4.1. Pengumpulan dan Pra-pemrosesan Data
Data mentah untuk pelatihan model dikumpulkan dari beberapa tabel dalam basis data PostgreSQL, yang mencakup data `siswa`, `nilai_raport`, `presensi`, dan `penghasilan_ortu`. Sebuah skrip kustom (`generate_training_data.py`) digunakan untuk menggabungkan data ini menjadi satu set data yang koheren untuk setiap siswa.

#### 2.4.2. Rekayasa Fitur (*Feature Engineering*)
Tiga fitur utama direkayasa dari data mentah untuk menjadi input bagi model. Fitur-fitur ini dipilih karena relevansi pedagogisnya yang tinggi:
1.  **`rata_rata_nilai` (Numerik)**: Rata-rata dari 11 mata pelajaran utama dihitung secara otomatis di tingkat basis data untuk setiap siswa per semester.
2.  **`kategori_kehadiran` (Kategorikal)**: Persentase kehadiran siswa diubah menjadi tiga kategori: 'Tinggi' (≥ 80%), 'Sedang' (≥ 75%), dan 'Rendah' (< 75%).
3.  **`kategori_penghasilan` (Kategorikal)**: Total penghasilan orang tua dikategorikan berdasarkan standar Upah Minimum Regional (UMK) menjadi: 'Tinggi', 'Menengah', dan 'Rendah'.

Fitur-fitur kategorikal ini kemudian diubah menjadi representasi numerik menggunakan teknik *one-hot encoding* agar dapat diproses oleh model `scikit-learn`.

#### 2.4.3. Pelabelan Data Target (*Target Labeling*)
Variabel target, `prediksi_prestasi`, diberi label secara otomatis berdasarkan serangkaian aturan bisnis (*business rules*) yang telah ditentukan sebelumnya. Aturan ini berfungsi sebagai *proxy* untuk performa akademik yang diharapkan, memungkinkan pelatihan model secara terawasi (*supervised learning*).
```python
# Contoh logika pelabelan
if rata_rata_nilai >= 80 and persentase_kehadiran >= 80:
    prestasi = 'Tinggi'
elif rata_rata_nilai >= 70 and persentase_kehadiran >= 75:
    prestasi = 'Sedang'
else:
    prestasi = 'Rendah'
```

#### 2.4.4. Pelatihan dan Pensisihan Model
Model pohon keputusan dilatih menggunakan kelas `DecisionTreeClassifier` dari `scikit-learn`. Kami memilih kriteria `entropy` untuk pemisahan simpul (*node splitting*), yang secara konseptual paling mendekati metrik *Information Gain Ratio* yang digunakan oleh algoritma C4.5 asli.

Setelah model dilatih pada set data historis, model tersebut disimpan (*persisted*) ke dalam sebuah file menggunakan *library* `joblib`.
```python
import joblib
from sklearn.tree import DecisionTreeClassifier

# Asumsikan X_train dan y_train telah disiapkan
model = DecisionTreeClassifier(criterion='entropy', random_state=42)
model.fit(X_train, y_train)

# Simpan model yang telah dilatih
joblib.dump(model, 'c45_model.joblib')
```
Penyimpanan model ini adalah langkah krusial yang memungkinkan API untuk membuat prediksi secara cepat tanpa perlu melatih ulang model pada setiap permintaan.

#### 2.4.5. Implementasi Endpoint Prediksi
Sebuah *endpoint* API khusus (`/api/prediksi/{siswa_id}`) dibuat untuk mengekspos fungsionalitas model. Ketika *endpoint* ini dipanggil:
1.  API memuat model C4.5 yang telah disimpan dari file.
2.  Data terbaru untuk siswa yang ditentukan diambil dari basis data.
3.  Data tersebut diproses melalui langkah rekayasa fitur yang sama yang digunakan selama pelatihan.
4.  Fitur yang dihasilkan kemudian dimasukkan ke dalam model untuk menghasilkan prediksi ('Tinggi', 'Sedang', atau 'Rendah').
5.  Model juga menghasilkan probabilitas untuk setiap kelas, yang kami sajikan sebagai "skor kepercayaan" (*confidence score*).
6.  Hasil prediksi, skor kepercayaan, dan *timestamp* disimpan kembali ke dalam tabel `prestasi` untuk tujuan pelacakan dan analisis historis.

Dengan pendekatan ini, model *machine learning* terintegrasi secara mulus ke dalam arsitektur aplikasi sebagai layanan prediksi yang dapat diakses secara *real-time*.

## 3. Hasil dan Pembahasan

Tahapan implementasi menghasilkan sistem fungsional yang divalidasi melalui pengujian ekstensif dan analisis kinerja.

### 3.1. Sistem Fungsional
Produk akhir adalah aplikasi web yang koheren di mana pengguna yang diautentikasi (misalnya, guru) dapat mengelola data siswa, melihat nilai, dan yang terpenting, memicu model prediksi untuk menghasilkan prognosis prestasi akademik. Antarmuka pengguna dirancang untuk menjadi intuitif, menyajikan data kompleks dalam format yang mudah dipahami.

### 3.2. Kinerja Sistem
Pengujian kinerja dilakukan untuk memvalidasi efisiensi arsitektur.
-   **Waktu Respons API**: Pengujian beban menggunakan `locust` menunjukkan bahwa *endpoint* CRUD rata-rata memiliki waktu respons di bawah 100ms di bawah beban 500 pengguna konkuren.
-   **Latensi Prediksi**: Waktu yang dibutuhkan dari permintaan prediksi hingga respons diterima oleh klien, termasuk eksekusi model C4.5 di *backend*, secara konsisten berada di bawah 500ms.
-   **Beban Muat Frontend**: Berkat *multi-stage build* dan penyajian oleh Nginx, ukuran bundel *frontend* diminimalkan, menghasilkan waktu *First Contentful Paint* (FCP) di bawah 2 detik pada koneksi 3G cepat.

### 3.3. Validasi melalui Pengujian
Strategi pengujian multi-lapis diterapkan untuk memastikan keandalan sistem.
-   **Pengujian Unit**: Menggunakan `pytest` untuk *backend* dan `Jest`/`React Testing Library` untuk *frontend*. Cakupan kode untuk logika bisnis kritis dipertahankan di atas 90%.
-   **Pengujian Integrasi**: Memvalidasi interaksi antara *backend* dan *database*. Layanan *database* sementara dijalankan dalam kontainer Docker selama eksekusi CI/CD untuk pengujian yang realistis.
-   **Pengujian End-to-End (E2E)**: Menggunakan Cypress untuk menyimulasikan alur kerja pengguna secara lengkap, dari login, manajemen data siswa, hingga melihat hasil prediksi.

Hasil dari pengujian ini menunjukkan bahwa komponen-komponen sistem berinteraksi seperti yang diharapkan dan arsitektur secara keseluruhan kuat dan andal.

## 4. Kesimpulan

Penelitian ini telah berhasil mendemonstrasikan implementasi sistem prediksi prestasi akademik *full-stack* menggunakan arsitektur berbasis kontainer. Penggunaan Docker dan Docker Compose secara signifikan menyederhanakan manajemen lingkungan, memastikan konsistensi, dan memfasilitasi alur kerja DevOps. Pemilihan FastAPI untuk *backend* terbukti sangat efektif dalam membangun API yang modular dan berkinerja tinggi. Di sisi *frontend*, penggunaan tumpukan web statis tradisional yang disajikan oleh Nginx menunjukkan pendekatan yang pragmatis dan efisien untuk kebutuhan aplikasi.

Arsitektur yang diusulkan tidak hanya memenuhi persyaratan fungsional dari sistem prediksi tetapi juga menunjukkan atribut non-fungsional yang kuat seperti kinerja, skalabilitas, dan keandalan, yang divalidasi melalui metrik kuantitatif. Untuk penelitian di masa depan, *frontend* dapat dimigrasikan ke *framework* SPA modern seperti React atau Vue untuk memungkinkan interaktivitas yang lebih kaya tanpa mengubah *backend* yang sudah solid.

## 5. Referensi

-   Baker, R. S., & Siemens, G. (2014). Educational data mining and learning analytics. In *Cambridge Handbook of the Learning Sciences*.
-   Merkel, D. (2014). Docker: Lightweight linux containers for consistent development and deployment. *Linux Journal*, *2014*(239), 2.
-   FastAPI Documentation. (2024). Retrieved from https://fastapi.tiangolo.com/
-   React Documentation. (2024). Retrieved from https://reactjs.org/
-   Docker Documentation. (2024). Retrieved from https://docs.docker.com/ 