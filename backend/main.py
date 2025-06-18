from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.openapi.utils import get_openapi
from sqlalchemy.orm import Session
import uvicorn
import os

# Import modul lokal
from database import get_db, init_db
from routes import siswa_router, nilai_router, presensi_router, penghasilan_router, prediksi_router, auth_router

# Metadata untuk dokumentasi API
description = """
## 🎓 Sistem Prediksi Prestasi Siswa API

API komprehensif untuk sistem prediksi prestasi siswa menggunakan **algoritma C4.5 Decision Tree**.
Sistem ini memungkinkan manajemen data siswa, analisis prestasi, dan prediksi performa akademik berdasarkan berbagai faktor.

### 🚀 **Fitur Utama**

* **👥 Manajemen Siswa**: CRUD operations untuk data siswa
* **📊 Nilai Raport**: Manajemen nilai akademik siswa
* **📅 Presensi**: Tracking kehadiran dan absensi siswa  
* **💰 Penghasilan Orang Tua**: Data kondisi ekonomi keluarga
* **🔮 Prediksi Prestasi**: Machine learning untuk prediksi performa
* **🔐 Authentication**: Sistem keamanan dan manajemen user
* **📤 Export**: Export data ke Excel untuk semua modul
* **📈 Analytics**: Statistik dan visualisasi data

### 🛠️ **Teknologi**

* **Framework**: FastAPI dengan Python 3.8+
* **Database**: PostgreSQL dengan SQLAlchemy ORM
* **Machine Learning**: scikit-learn dengan algoritma C4.5
* **Authentication**: JWT Bearer Token
* **Documentation**: OpenAPI 3.0 dengan Swagger UI

### 📚 **Cara Penggunaan**

1. **Authentication**: Login menggunakan endpoint `/api/auth/login` untuk mendapatkan JWT token
2. **Authorization**: Sertakan token dalam header `Authorization: Bearer <token>`
3. **CRUD Operations**: Gunakan endpoints yang tersedia untuk operasi data
4. **Prediksi**: Gunakan endpoint prediksi untuk analisis prestasi siswa

### 🔐 **Autentikasi**

Untuk menggunakan API ini, Anda perlu:

1. **Login** melalui endpoint `/api/auth/login` dengan username dan password
2. **Copy JWT token** dari response login
3. **Klik tombol "Authorize" 🔓** di bagian atas Swagger UI
4. **Masukkan token** dalam format: `Bearer <your-jwt-token>`
5. **Klik "Authorize"** untuk mengaktifkan autentikasi

### 🔗 **Links**

* **Frontend Application**: [http://localhost:3000](http://localhost:3000)
* **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
* **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
"""

# Tags metadata untuk organisasi endpoint yang lebih baik
tags_metadata = [
    {
        "name": "Root",
        "description": "🏠 **Root endpoints** - Basic application information dan health checks"
    },
    {
        "name": "Authentication", 
        "description": "🔐 **Authentication & Authorization** - Login, logout, user management, dan token operations"
    },
    {
        "name": "Siswa",
        "description": "👥 **Manajemen Data Siswa** - CRUD operations untuk data siswa, upload Excel, dan export data"
    },
    {
        "name": "Nilai Raport",
        "description": "📊 **Nilai Akademik** - Manajemen nilai raport siswa semua mata pelajaran dengan auto-calculation rata-rata"
    },
    {
        "name": "Presensi", 
        "description": "📅 **Kehadiran Siswa** - Tracking presensi, absensi, dan perhitungan persentase kehadiran otomatis"
    },
    {
        "name": "Penghasilan Ortu",
        "description": "💰 **Data Ekonomi Keluarga** - Informasi penghasilan dan pekerjaan orang tua dengan kategorisasi otomatis"
    },
    {
        "name": "Prediksi Prestasi",
        "description": "🔮 **Machine Learning** - Prediksi prestasi siswa menggunakan C4.5, batch processing, dan analytics"
    },
    {
        "name": "Visualisasi",
        "description": "📈 **Data Visualization** - Decision tree visualization dan static assets"
    },
    {
        "name": "Health",
        "description": "🏥 **System Health** - API status monitoring dan health checks"
    }
]

# Inisialisasi aplikasi FastAPI dengan konfigurasi Swagger lengkap
app = FastAPI(
    title="🎓 EduPro - Sistem Prediksi Prestasi Siswa API",
    description=description,
    version="2.0.0",
    openapi_tags=tags_metadata,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    contact={
        "name": "EduPro Development Team",
        "email": "dev@edupro.com",
        "url": "https://github.com/edupro/prestasi-siswa"
    },
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT"
    },
    servers=[
        {
            "url": "http://localhost:8000",
            "description": "Development Server"
        },
        {
            "url": "https://api.edupro.com",
            "description": "Production Server"
        }
    ]
)

# Konfigurasi CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Dalam produksi, ganti dengan domain yang diizinkan
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mendaftarkan router dengan tags yang sesuai
app.include_router(siswa_router.router, prefix="/api/siswa", tags=["Siswa"])
app.include_router(nilai_router.router, prefix="/api/nilai", tags=["Nilai Raport"])
app.include_router(presensi_router.router, prefix="/api/presensi", tags=["Presensi"])
app.include_router(penghasilan_router.router, prefix="/api/penghasilan", tags=["Penghasilan Ortu"])
app.include_router(prediksi_router.router, prefix="/api/prediksi", tags=["Prediksi Prestasi"])
app.include_router(auth_router.router, prefix="/api/auth", tags=["Authentication"])

# Endpoint root dengan informasi API
@app.get(
    "/", 
    tags=["Root"],
    summary="🏠 API Information",
    description="Menampilkan informasi dasar tentang API Sistem Prediksi Prestasi Siswa",
    response_description="Informasi API dan links dokumentasi"
)
async def root():
    return {
        "message": "🎓 Selamat datang di EduPro - Sistem Prediksi Prestasi Siswa API",
        "version": "2.0.0",
        "docs": "/docs",
        "redoc": "/redoc",
        "openapi": "/openapi.json",
        "features": [
            "👥 Manajemen Data Siswa",
            "📊 Nilai Raport & Analytics", 
            "📅 Presensi & Kehadiran",
            "💰 Data Ekonomi Keluarga",
            "🔮 Prediksi Prestasi ML",
            "🔐 Authentication & Security",
            "📤 Export Excel",
            "📈 Data Visualization"
        ]
    }

# Endpoint untuk memeriksa status API
@app.get(
    "/health", 
    tags=["Health"],
    summary="🏥 Health Check",
    description="Memeriksa status kesehatan API dan koneksi database",
    response_description="Status API dan informasi sistem"
)
async def health_check():
    return {
        "status": "✅ healthy", 
        "message": "API berjalan dengan baik",
        "version": "2.0.0",
        "timestamp": "2025-06-18",
        "services": {
            "api": "✅ running",
            "database": "✅ connected", 
            "ml_model": "✅ ready"
        }
    }

# Endpoint untuk menampilkan decision tree
@app.get(
    "/api/decision_tree", 
    tags=["Visualisasi"],
    summary="🌳 Decision Tree Visualization", 
    description="Menampilkan visualisasi pohon keputusan C4.5 yang digunakan untuk prediksi prestasi siswa",
    response_description="File gambar decision tree dalam format PNG"
)
async def get_decision_tree():
    """
    Menampilkan file gambar decision_tree.png dari direktori static.
    
    **Response**: File PNG dengan visualisasi pohon keputusan C4.5
    """
    return FileResponse("static/decision_tree.png")

# Custom OpenAPI schema dengan security definitions
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
        tags=app.openapi_tags,
        servers=app.servers
    )
    
    # Tambahkan security schemes
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": "Masukkan JWT token yang didapat dari endpoint login. Format: Bearer <token>"
        }
    }
    
    # Tambahkan security requirement untuk semua endpoint kecuali auth dan root
    for path_key, path_value in openapi_schema["paths"].items():
        # Skip auth endpoints dan root endpoints
        if not path_key.startswith("/api/auth") and path_key not in ["/", "/health", "/api/decision_tree"]:
            for method_key, method_value in path_value.items():
                if method_key.lower() in ["get", "post", "put", "delete", "patch"]:
                    method_value["security"] = [{"BearerAuth": []}]
    
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

# Inisialisasi database saat aplikasi dimulai
@app.on_event("startup")
async def startup_event():
    init_db()
    print("🚀 Database telah diinisialisasi")
    print("📚 Swagger UI tersedia di: http://localhost:8000/docs")
    print("📖 ReDoc tersedia di: http://localhost:8000/redoc")

# Menjalankan aplikasi jika file ini dijalankan langsung
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)