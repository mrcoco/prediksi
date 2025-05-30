from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import uvicorn
import os

# Import modul lokal
from database import get_db, init_db
from routes import siswa_router, nilai_router, presensi_router, penghasilan_router, prediksi_router, auth_router

# Inisialisasi aplikasi FastAPI
app = FastAPI(
    title="Sistem Prediksi Prestasi Siswa",
    description="API untuk sistem prediksi prestasi siswa menggunakan algoritma C4.5",
    version="1.0.0"
)

# Konfigurasi CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Dalam produksi, ganti dengan domain yang diizinkan
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mendaftarkan router
app.include_router(siswa_router.router, prefix="/api/siswa", tags=["Siswa"])
app.include_router(nilai_router.router, prefix="/api/nilai", tags=["Nilai Raport"])
app.include_router(presensi_router.router, prefix="/api/presensi", tags=["Presensi"])
app.include_router(penghasilan_router.router, prefix="/api/penghasilan", tags=["Penghasilan Ortu"])
app.include_router(prediksi_router.router, prefix="/api/prediksi", tags=["Prediksi Prestasi"])
app.include_router(auth_router.router, prefix="/api/auth", tags=["Authentication"])

# Endpoint root
@app.get("/", tags=["Root"])
async def root():
    return {"message": "Selamat datang di API Sistem Prediksi Prestasi Siswa"}

# Endpoint untuk memeriksa status API
@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "message": "API berjalan dengan baik"}

# Endpoint untuk menampilkan decision tree
@app.get("/api/decision_tree", tags=["Visualisasi"])
async def get_decision_tree():
    """
    Menampilkan file gambar decision_tree.png dari direktori static
    """
    return FileResponse("static/decision_tree.png")

# Inisialisasi database saat aplikasi dimulai
@app.on_event("startup")
async def startup_event():
    init_db()
    print("Database telah diinisialisasi")

# Menjalankan aplikasi jika file ini dijalankan langsung
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)