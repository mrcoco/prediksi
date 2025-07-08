from fastapi import FastAPI, Depends, HTTPException, status, Header, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.openapi.utils import get_openapi
from sqlalchemy.orm import Session
import uvicorn
import os
from jose import jwt, JWTError
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from redis import asyncio as aioredis
from datetime import datetime

# Import modul lokal
from database import get_db, init_db
from routes import siswa_router, nilai_router, presensi_router, penghasilan_router, prediksi_router, auth_router
from config import SECRET_KEY, ALGORITHM, REDIS_HOST, REDIS_PORT
from models.user import User

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
* **Caching**: Redis untuk optimasi performa

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

# Metadata untuk dokumentasi API
tags_metadata = [
    {
        "name": "Siswa",
        "description": "Operasi CRUD untuk data siswa"
    },
    {
        "name": "Nilai Raport",
        "description": "Manajemen nilai akademik siswa"
    },
    {
        "name": "Presensi",
        "description": "Tracking kehadiran dan absensi siswa"
    },
    {
        "name": "Penghasilan Ortu",
        "description": "Data kondisi ekonomi keluarga"
    },
    {
        "name": "Prediksi Prestasi",
        "description": "Machine learning untuk prediksi performa"
    },
    {
        "name": "Authentication",
        "description": "Manajemen user dan autentikasi"
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
        "email": "spydersonics@gmail.com",
        "url": "https://github.com/mrcoco/prediksi"
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

# Custom OpenAPI schema untuk dokumentasi yang lebih baik
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

# Inisialisasi database dan Redis cache saat aplikasi dimulai
@app.on_event("startup")
async def startup_event():
    # Initialize database
    init_db()
    
    # Initialize Redis cache
    from cache_config import init_cache
    cache_initialized = init_cache()
    
    if cache_initialized:
        print("🚀 Database dan Redis cache telah diinisialisasi")
    else:
        print("🚀 Database diinisialisasi, Redis cache tidak tersedia")
        print("⚠️ Application akan berjalan tanpa caching")
    
    print("📚 Swagger UI tersedia di: http://localhost:8000/docs")
    print("📖 ReDoc tersedia di: http://localhost:8000/redoc")

@app.on_event("shutdown")
async def shutdown_event():
    # Close Redis connection
    if hasattr(FastAPICache, '_backend'):
        try:
            await FastAPICache._backend.client.close()
            print("✅ Redis connection closed")
        except Exception as e:
            print(f"❌ Error closing Redis connection: {str(e)}")

# Endpoint untuk health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# Endpoint untuk cache statistics
@app.get("/api/cache/stats", tags=["System"], summary="📊 Cache Statistics")
async def get_cache_stats():
    """
    Menampilkan statistik penggunaan Redis cache
    
    **Response**: Informasi statistik cache meliputi hit rate, memory usage, dll.
    """
    from cache_config import get_cache_stats, cache_health_check
    
    stats = get_cache_stats()
    stats['healthy'] = cache_health_check()
    
    return {
        "status": "success",
        "message": "Cache statistics retrieved successfully",
        "data": stats
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

# Endpoint verify untuk Traefik ForwardAuth
@app.get(
    "/api/auth/verify",
    tags=["Authentication"],
    summary="🔒 Verify Token",
    description="Endpoint untuk verifikasi token JWT oleh Traefik ForwardAuth",
    response_description="Status verifikasi token dan informasi user"
)
async def verify_token(authorization: str = Header(None), response: Response = None, db: Session = Depends(get_db)):
    print(f"Received Authorization header: {authorization}")  # Debug log
    
    if not authorization:
        print("No Authorization header found")  # Debug log
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    try:
        # Extract token from Authorization header
        if not authorization.lower().startswith("bearer "):
            print(f"Invalid auth scheme: {authorization[:20]}...")  # Debug log
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication scheme",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        token = authorization.split(" ")[1]
        print(f"Extracted token: {token[:20]}...")  # Debug log
        
        # Decode and verify token
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            print(f"Decoded payload: {payload}")  # Debug log
        except JWTError as e:
            print(f"JWT Decode Error: {str(e)}")  # Debug log
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Extract user info from payload
        username = payload.get("sub")
        if not username:
            print("No username found in payload")  # Debug log
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token missing username",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Verify user exists in database
        user = db.query(User).filter(User.username == username).first()
        if not user:
            print(f"User not found in database: {username}")  # Debug log
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        print(f"User found: {user.username}, role: {user.role}")  # Debug log
        
        # Set response headers for Traefik ForwardAuth
        response.headers["X-User-ID"] = str(user.id)
        response.headers["X-User-Role"] = str(user.role)
        response.headers["X-Username"] = str(user.username)
        
        print(f"Response headers set: {dict(response.headers)}")  # Debug log
        
        # Return 200 OK with empty response
        return Response(status_code=200)
        
    except Exception as e:
        print(f"Verification Error: {str(e)}")  # Debug log
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token verification failed",
            headers={"WWW-Authenticate": "Bearer"},
        )

# Menjalankan aplikasi jika file ini dijalankan langsung
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)