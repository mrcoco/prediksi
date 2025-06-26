# Analisis Implementasi Arsitektur Backend Sistem EduPro: Pendekatan Modular dan Aman

**Penulis**: Tim Riset EduPro AI  
**Afiliasi**: Departemen Inovasi Teknologi Pendidikan, EduPro Institute  
**Tanggal**: 21 Juni 2025  
**Versi Revisi**: 1.1

---

## Abstrak

Dokumen ini menyajikan analisis terperinci mengenai arsitektur dan implementasi komponen backend dari sistem prediksi prestasi akademik EduPro. Pembahasan difokuskan pada tiga pilar utama: (1) desain arsitektur modular dan strategi *routing*; (2) desain *Application Programming Interface* (API) dan mekanisme validasi data; serta (3) pola interaksi dengan basis data dan implementasi keamanan berlapis. Tujuan dari dokumen ini adalah untuk menyediakan sebuah eksplanasi yang secara teknis mendalam namun tetap dapat diakses, menjembatani prinsip-prinsip rekayasa perangkat lunak teoretis dengan studi kasus implementasi praktis pada sistem EduPro. Setiap konsep teknologi dielaborasi dengan definisi formal, justifikasi penggunaannya, contoh implementasi nyata dalam *codebase* EduPro, dan didukung oleh referensi akademik serta standar industri.

---

## Pendahuluan

Backend sebuah aplikasi perangkat lunak dapat dianalogikan sebagai sistem saraf pusat dari sebuah organisme digital. Komponen ini bertanggung jawab atas pemrosesan logika bisnis, orkestrasi aliran data, interaksi dengan sistem persistensi (database), dan penegakan aturan keamanan. Kualitas desain arsitektur backend secara langsung menentukan atribut non-fungsional sistem, seperti skalabilitas, *maintainability* (kemudahan pemeliharaan), dan keamanan.

Dalam pengembangan sistem EduPro, pemilihan arsitektur backend menjadi keputusan strategis yang krusial. Kami mengadopsi tumpukan teknologi modern berbasis Python yang berpusat pada *framework* FastAPI. Keputusan ini didasari oleh kebutuhan akan performa eksekusi yang tinggi, dukungan kelas satu untuk komputasi asinkron, dan ekosistem yang matang untuk validasi data dan pembuatan dokumentasi otomatis.

Dokumen ini akan menguraikan tiga aspek fundamental dari implementasi backend sistem EduPro secara sistematis.

---

## 2.2.1. Arsitektur Modular dan Strategi Routing

Prinsip dasar dari rekayasa perangkat lunak yang andal adalah pengelolaan kompleksitas. Arsitektur modular adalah strategi fundamental untuk mencapai tujuan ini dengan menerapkan prinsip *separation of concerns*.

### Konsep Arsitektur Modular

Arsitektur modular adalah paradigma desain perangkat lunak yang menekankan dekomposisi sistem menjadi unit-unit fungsional yang independen dan dapat diganti, yang disebut modul (Parnas, 1972). Setiap modul merangkum sekumpulan fungsionalitas yang terkait erat (*high cohesion*) dan memiliki antarmuka yang terdefinisi dengan baik, sambil meminimalkan ketergantungan antar modul (*low coupling*).

**Dalam Sistem EduPro**:
Pendekatan ini diwujudkan dengan menstrukturkan direktori backend berdasarkan domain fungsional. Setiap domain utama (misalnya, `siswa`, `nilai`, `autentikasi`) diimplementasikan dalam file *router* terpisah di dalam direktori `routes/`.

```
backend/
├── main.py           # Titik integrasi utama (Composition Root)
└── routes/           # Direktori modul-modul fungsional
    ├── siswa_router.py
    ├── nilai_router.py
    └── auth_router.py
    # ... router lainnya
```

Struktur ini memungkinkan tim pengembang untuk bekerja secara paralel pada fitur yang berbeda dan menyederhanakan proses pengujian dan pemeliharaan, karena perubahan dalam satu modul memiliki dampak minimal pada modul lainnya.

**Referensi**:
- Parnas, D. L. (1972). On the criteria to be used in decomposing systems into modules. *Communications of the ACM*, 15(12), 1053-1058.
- Martin, R. C. (2017). *Clean Architecture: A Craftsman's Guide to Software Structure and Design*. Prentice Hall.

### Implementasi dengan FastAPI dan Application Factory Pattern

**FastAPI** adalah *framework* web modern berkinerja tinggi untuk Python yang dibangun di atas Starlette (untuk komponen web) dan Pydantic (untuk validasi data). Sifatnya yang berbasis standar ASGI (*Asynchronous Server Gateway Interface*) memungkinkannya menangani konkurensi tinggi secara efisien.

**Referensi**:
- Ramirez, S. (2024). *FastAPI Documentation*. Diakses dari https://fastapi.tiangolo.com/

Untuk mengintegrasikan berbagai modul, sistem EduPro menggunakan **Application Factory Pattern**. Ini adalah pola desain di mana sebuah fungsi khusus digunakan untuk membuat dan mengonfigurasi instans aplikasi. Pola ini meningkatkan fleksibilitas untuk pengujian dan pengelolaan konfigurasi yang berbeda (misalnya, pengembangan vs. produksi).

**Implementasi Nyata dalam `main.py`**:
Titik masuk utama aplikasi, `main.py`, berfungsi sebagai *composition root* yang mengimpor semua *router* modular dan menyatukannya ke dalam satu instans aplikasi FastAPI.

```python
# Di dalam main.py
from fastapi import FastAPI
from routes import siswa_router, nilai_router, auth_router # Impor modul

# Inisialisasi aplikasi utama
app = FastAPI(
    title="🎓 EduPro - Sistem Prediksi Prestasi Siswa API",
    description="API komprehensif untuk sistem prediksi...",
    version="2.0.0"
)

# Registrasi setiap router modular ke aplikasi utama
# Setiap router diberi prefix unik untuk menghindari konflik nama
# dan tag untuk pengelompokan dalam dokumentasi.
app.include_router(auth_router.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(siswa_router.router, prefix="/api/siswa", tags=["Siswa"])
app.include_router(nilai_router.router, prefix="/api/nilai", tags=["Nilai Raport"])
```
Metode `app.include_router()` adalah mekanisme kunci yang memungkinkan arsitektur modular ini. Ini secara efektif "menempelkan" semua *endpoint* yang didefinisikan dalam sebuah modul ke dalam pohon URL aplikasi utama.

### Strategi Routing

**Routing** adalah mekanisme yang memetakan permintaan HTTP yang masuk (misalnya, `GET /api/siswa/123`) ke fungsi penangan (*handler function*) yang sesuai dalam kode. Di FastAPI, ini ditangani oleh *decorators* seperti `@router.get`, `@router.post`, dll.

**Implementasi Nyata dalam `routes/siswa_router.py`**:
Setiap file *router* mendefinisikan *endpoint* yang relevan dengan domainnya.

```python
# Di dalam routes/siswa_router.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
# ... impor lainnya

# Membuat instance router untuk modul ini
router = APIRouter()

@router.get(
    "/{siswa_id}", 
    response_model=schemas.SiswaResponse,
    summary="Get Siswa by ID"
)
def get_siswa_by_id(siswa_id: int, db: Session = Depends(get_db)):
    # Logika untuk mengambil data siswa dari database...
    # ...
    return db_siswa
```
Dengan demikian, logika untuk menangani data siswa sepenuhnya terkandung dalam `siswa_router.py`, menjadikannya mandiri dan mudah dikelola.

---

## 2.2.2. Desain API dan Validasi Data

Antarmuka pemrograman aplikasi (API) berfungsi sebagai "kontrak" formal antara *frontend* dan *backend*. Desain API yang baik bersifat intuitif, konsisten, dan dapat diandalkan.

### Desain API Berbasis REST

Sistem EduPro mengadopsi gaya arsitektur **REST (Representational State Transfer)**. REST bukanlah protokol, melainkan serangkaian batasan arsitektural untuk merancang aplikasi jaringan. Prinsip utamanya adalah interaksi berbasis sumber daya (*resource*) yang dimanipulasi menggunakan antarmuka seragam (misalnya, metode HTTP seperti GET, POST, PUT, DELETE).

**Referensi**:
- Fielding, R. T. (2000). *Architectural Styles and the Design of Network-based Software Architectures*. (Disertasi Doktoral, University of California, Irvine).

**Implementasi Nyata dalam EduPro**:
- **Sumber Daya**: Siswa, Nilai, Presensi (misalnya, `/api/siswa`, `/api/nilai`).
- **Identifier**: ID unik untuk setiap sumber daya (misalnya, `/api/siswa/123`).
- **Metode HTTP**:
    - `POST /api/siswa`: Membuat data siswa baru.
    - `GET /api/siswa`: Mendapatkan daftar semua siswa.
    - `GET /api/siswa/123`: Mendapatkan detail siswa dengan ID 123.
    - `PUT /api/siswa/123`: Memperbarui data siswa dengan ID 123.
    - `DELETE /api/siswa/123`: Menghapus data siswa dengan ID 123.

### Validasi Data dengan Pydantic

Salah satu risiko terbesar dalam aplikasi web adalah menerima data yang tidak valid atau berbahaya dari klien. **Validasi data** adalah garda pertahanan pertama untuk memastikan integritas dan keamanan data.

Sistem EduPro memanfaatkan *library* **Pydantic** secara ekstensif, yang terintegrasi secara native dengan FastAPI. Pydantic menggunakan anotasi tipe Python untuk mendefinisikan skema data yang "bersih" dan secara otomatis memvalidasi data yang masuk terhadap skema tersebut. Jika data tidak sesuai (misalnya, tipe data salah, field yang wajib tidak ada), Pydantic secara otomatis akan menghasilkan respons error 422 (*Unprocessable Entity*) yang informatif.

**Referensi**:
- Colvin, S. (2024). *Pydantic Documentation*. Diakses dari https://docs.pydantic.dev/

**Implementasi Nyata dengan Schema Design Pattern**:
Kami menerapkan pola desain skema yang memisahkan model untuk pembuatan (*Create*), pembaruan (*Update*), dan respons (*Response*).

```python
# Di dalam schemas.py
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# Skema dasar dengan field yang sama untuk semua variasi
class SiswaBase(BaseModel):
    nama: str = Field(..., max_length=100)
    nis: str = Field(..., regex=r"^\d{10}$") # Contoh validasi regex untuk NIS
    # ... field lainnya

# Skema untuk membuat siswa baru (semua field dari base diperlukan)
class SiswaCreate(SiswaBase):
    pass

# Skema untuk respons API (termasuk field yang dibuat oleh database)
class SiswaResponse(SiswaBase):
    id: int
    created_at: datetime
    
    class Config:
        orm_mode = True # Memungkinkan model untuk membaca data dari objek ORM
```
Pola ini memberikan fleksibilitas dan keamanan. Misalnya, saat membuat siswa, `id` dan `created_at` tidak diterima dari klien, tetapi saat mengirim respons, field tersebut disertakan.

### Dokumentasi API Otomatis

Manfaat sekunder yang signifikan dari penggunaan FastAPI dan Pydantic adalah generasi otomatis dokumentasi API yang interaktif sesuai standar **OpenAPI**. Skema Pydantic yang didefinisikan di atas secara otomatis diterjemahkan menjadi skema JSON yang dapat dibaca mesin dan disajikan dalam antarmuka pengguna (UI) yang ramah pengguna.

**Referensi**:
- OpenAPI Initiative. (2024). *OpenAPI Specification*. Diakses dari https://www.openapis.org/

**Akses dalam Sistem EduPro**:
Dokumentasi ini dapat diakses secara langsung dari *endpoint* yang sedang berjalan, biasanya di `/docs` (untuk Swagger UI) dan `/redoc` (untuk ReDoc). Ini berfungsi sebagai "dokumentasi hidup" yang selalu sinkron dengan *codebase*, menyederhanakan proses integrasi bagi pengembang *frontend* atau layanan pihak ketiga.

---

## 2.2.3. Interaksi Database dan Keamanan

Lapisan ini adalah fondasi dari sistem, tempat data disimpan, dikelola, dan dilindungi.

### Interaksi Database dengan SQLAlchemy ORM

Ada "kesenjangan impedansi" konseptual antara paradigma pemrograman berorientasi objek (yang digunakan dalam kode aplikasi) dan model data relasional (yang digunakan oleh sebagian besar database). **ORM (Object-Relational Mapper)** adalah *library* yang berfungsi sebagai jembatan, memungkinkan pengembang untuk berinteraksi dengan tabel database seolah-olah mereka adalah objek Python biasa.

Sistem EduPro menggunakan **SQLAlchemy**, ORM paling matang dan kuat di ekosistem Python, untuk berinteraksi dengan basis data **PostgreSQL**.

**Referensi**:
- Bayer, M. (2024). *SQLAlchemy Documentation*. Diakses dari https://docs.sqlalchemy.org/
- PostgreSQL Global Development Group. (2024). *PostgreSQL Documentation*. Diakses dari https://www.postgresql.org/

**Implementasi Nyata**:
1.  **Model Deklaratif**: Setiap tabel dalam database direpresentasikan sebagai sebuah kelas Python di `models.py`.
    ```python
    # Di dalam models.py
    from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
    from sqlalchemy.orm import relationship
    from database import Base # Base deklaratif dari SQLAlchemy

    class Siswa(Base):
        __tablename__ = "siswa"
        id = Column(Integer, primary_key=True, index=True)
        nama = Column(String, index=True)
        nis = Column(String, unique=True, index=True)
        
        # Mendefinisikan relasi one-to-many ke nilai raport
        nilai_raport = relationship("NilaiRaport", back_populates="siswa")
    ```

2.  **Manajemen Sesi dengan Dependency Injection**: Untuk memastikan koneksi database dikelola secara efisien dan aman, kami menggunakan pola *dependency injection* bawaan FastAPI.
    ```python
    # Di dalam database.py
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    def get_db():
        db = SessionLocal()
        try:
            yield db # Sesi database "disuntikkan" ke endpoint
        finally:
            db.close() # Sesi selalu ditutup setelah request selesai
    ```
    Setiap *endpoint* yang perlu mengakses database cukup mendeklarasikan `db: Session = Depends(get_db)` sebagai parameter. Ini memastikan setiap permintaan mendapatkan sesi database yang terisolasi dan sumber daya dilepaskan dengan benar.

### Implementasi Keamanan Berlapis

Keamanan bukanlah fitur tunggal, melainkan sebuah properti sistem yang muncul dari berbagai lapisan pertahanan (*defense-in-depth*).

1.  **Autentikasi dengan JWT**:
    Sistem menggunakan **JSON Web Tokens (JWT)** untuk autentikasi. Setelah pengguna berhasil login, *backend* akan mengeluarkan token JWT yang ditandatangani secara kriptografis. Untuk setiap permintaan selanjutnya ke *endpoint* yang dilindungi, klien harus menyertakan token ini. Karena token ditandatangani oleh server, server dapat memverifikasi keasliannya tanpa perlu mengakses database, menjadikannya sangat efisien untuk arsitektur *stateless*.

    **Referensi**:
    - Jones, M., et al. (2015). *JSON Web Token (JWT)*. RFC 7519.

2.  **Otorisasi dengan OAuth2**:
    Alur untuk mendapatkan token ini mengikuti standar **OAuth2 Password Flow**. Kerangka kerja ini menyediakan alur standar industri untuk klien mendapatkan token akses. FastAPI memiliki dukungan bawaan untuk ini, yang menyederhanakan implementasi.

    **Referensi**:
    - Hardt, D. (Ed.). (2012). *The OAuth 2.0 Authorization Framework*. RFC 6749.

    **Implementasi Nyata**:
    Sebuah dependensi `get_current_user` dibuat untuk melindungi *endpoint*.
    ```python
    # Di dalam auth_router.py
    oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")

    async def get_current_user(token: str = Depends(oauth2_scheme), ...):
        # Logika untuk mendekode token, menangani error,
        # dan mengambil data user dari database.
        # Jika token tidak valid, akan menghasilkan error 401 Unauthorized.
        # ...
        return user
    ```
    Endpoint yang memerlukan autentikasi hanya perlu menyertakan `current_user: User = Depends(get_current_user)`.

3.  **Keamanan Kata Sandi dengan Hashing**:
    Kata sandi pengguna **tidak pernah** disimpan sebagai teks biasa. Sebaliknya, kami menyimpan *hash* kriptografis dari kata sandi menggunakan algoritma **bcrypt**. Bcrypt sengaja dirancang untuk menjadi lambat, sehingga membuatnya sangat tahan terhadap serangan *brute-force*.

    **Referensi**:
    - Provos, N., & Mazières, D. (1999). A future-adaptable password scheme. *Proceedings of the USENIX Annual Technical Conference*.

    ```python
    # Menggunakan library passlib
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def verify_password(plain_password, hashed_password):
        return pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(password):
        return pwd_context.hash(password)
    ```

4.  **Pencegahan SQL Injection**:
    Dengan menggunakan SQLAlchemy ORM, risiko serangan **SQL Injection** secara drastis berkurang. ORM secara otomatis melakukan *parameterization* pada *query*, yang berarti input dari pengguna diperlakukan sebagai data, bukan sebagai bagian dari perintah SQL yang dapat dieksekusi.

    **Referensi**:
    - OWASP Foundation. (2024). *SQL Injection Prevention Cheat Sheet*. Diakses dari https://cheatsheetseries.owasp.org/

---

## Kesimpulan

Arsitektur backend sistem EduPro dirancang secara cermat dengan mengadopsi prinsip-prinsip rekayasa perangkat lunak modern dan standar industri. Pendekatan modular berbasis FastAPI memfasilitasi pengembangan yang terorganisir dan *maintainable*. Penggunaan Pydantic secara ketat untuk validasi data dan skema memastikan integritas dan keamanan pada lapisan terluar. Terakhir, interaksi database yang aman melalui SQLAlchemy ORM dan strategi keamanan berlapis (JWT, OAuth2, bcrypt hashing) membentuk fondasi yang kokoh dan andal untuk melindungi aset data yang paling berharga. Arsitektur ini tidak hanya memenuhi kebutuhan fungsional saat ini tetapi juga menyediakan landasan yang skalabel dan aman untuk evolusi sistem di masa depan. 