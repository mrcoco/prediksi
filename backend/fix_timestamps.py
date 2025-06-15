#!/usr/bin/env python3
"""
Script untuk memperbaiki timestamp yang NULL di database
Menambahkan created_at dan updated_at untuk record yang tidak memiliki nilai
"""

import os
import sys
from datetime import datetime
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Tambahkan path backend ke sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import DATABASE_URL, Siswa, NilaiRaport, PenghasilanOrtu, Presensi, Prestasi

def fix_timestamps():
    """Perbaiki timestamp yang NULL di semua tabel"""
    
    # Buat koneksi database
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        current_time = datetime.now()
        
        print("🔧 Memperbaiki timestamp yang NULL...")
        
        # Perbaiki tabel siswa
        print("📚 Memperbaiki tabel siswa...")
        siswa_updated = db.execute(text("""
            UPDATE siswa 
            SET created_at = :current_time, updated_at = :current_time 
            WHERE created_at IS NULL OR updated_at IS NULL
        """), {"current_time": current_time})
        print(f"   ✅ {siswa_updated.rowcount} record siswa diperbaiki")
        
        # Perbaiki tabel nilai_raport
        print("📊 Memperbaiki tabel nilai_raport...")
        nilai_updated = db.execute(text("""
            UPDATE nilai_raport 
            SET created_at = :current_time, updated_at = :current_time 
            WHERE created_at IS NULL OR updated_at IS NULL
        """), {"current_time": current_time})
        print(f"   ✅ {nilai_updated.rowcount} record nilai_raport diperbaiki")
        
        # Perbaiki tabel penghasilan_ortu
        print("💰 Memperbaiki tabel penghasilan_ortu...")
        penghasilan_updated = db.execute(text("""
            UPDATE penghasilan_ortu 
            SET created_at = :current_time, updated_at = :current_time 
            WHERE created_at IS NULL OR updated_at IS NULL
        """), {"current_time": current_time})
        print(f"   ✅ {penghasilan_updated.rowcount} record penghasilan_ortu diperbaiki")
        
        # Perbaiki tabel presensi
        print("📅 Memperbaiki tabel presensi...")
        presensi_updated = db.execute(text("""
            UPDATE presensi 
            SET created_at = :current_time, updated_at = :current_time 
            WHERE created_at IS NULL OR updated_at IS NULL
        """), {"current_time": current_time})
        print(f"   ✅ {presensi_updated.rowcount} record presensi diperbaiki")
        
        # Perbaiki tabel prestasi
        print("🏆 Memperbaiki tabel prestasi...")
        prestasi_updated = db.execute(text("""
            UPDATE prestasi 
            SET created_at = :current_time, updated_at = :current_time 
            WHERE created_at IS NULL OR updated_at IS NULL
        """), {"current_time": current_time})
        print(f"   ✅ {prestasi_updated.rowcount} record prestasi diperbaiki")
        
        # Commit perubahan
        db.commit()
        
        print("\n🎉 Semua timestamp berhasil diperbaiki!")
        
        # Verifikasi hasil
        print("\n🔍 Verifikasi hasil:")
        
        # Cek siswa dengan timestamp NULL
        null_siswa = db.execute(text("SELECT COUNT(*) FROM siswa WHERE created_at IS NULL OR updated_at IS NULL")).scalar()
        print(f"   📚 Siswa dengan timestamp NULL: {null_siswa}")
        
        # Cek nilai_raport dengan timestamp NULL
        null_nilai = db.execute(text("SELECT COUNT(*) FROM nilai_raport WHERE created_at IS NULL OR updated_at IS NULL")).scalar()
        print(f"   📊 Nilai raport dengan timestamp NULL: {null_nilai}")
        
        # Cek penghasilan_ortu dengan timestamp NULL
        null_penghasilan = db.execute(text("SELECT COUNT(*) FROM penghasilan_ortu WHERE created_at IS NULL OR updated_at IS NULL")).scalar()
        print(f"   💰 Penghasilan ortu dengan timestamp NULL: {null_penghasilan}")
        
        # Cek presensi dengan timestamp NULL
        null_presensi = db.execute(text("SELECT COUNT(*) FROM presensi WHERE created_at IS NULL OR updated_at IS NULL")).scalar()
        print(f"   📅 Presensi dengan timestamp NULL: {null_presensi}")
        
        # Cek prestasi dengan timestamp NULL
        null_prestasi = db.execute(text("SELECT COUNT(*) FROM prestasi WHERE created_at IS NULL OR updated_at IS NULL")).scalar()
        print(f"   🏆 Prestasi dengan timestamp NULL: {null_prestasi}")
        
        total_null = null_siswa + null_nilai + null_penghasilan + null_presensi + null_prestasi
        
        if total_null == 0:
            print("\n✅ Semua record sudah memiliki timestamp yang valid!")
        else:
            print(f"\n⚠️  Masih ada {total_null} record dengan timestamp NULL")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Memulai perbaikan timestamp database...")
    fix_timestamps()
    print("🏁 Selesai!") 