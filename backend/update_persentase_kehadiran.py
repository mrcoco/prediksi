#!/usr/bin/env python3
"""
Script untuk mengupdate persentase_kehadiran dan kategori_kehadiran yang kosong atau tidak konsisten
Menggunakan logika yang sama dengan function create_presensi dan update_presensi
"""

import os
import sys
from datetime import datetime
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Tambahkan path backend ke sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import DATABASE_URL, Presensi

def update_persentase_kehadiran():
    """Update persentase_kehadiran dan kategori_kehadiran yang kosong atau tidak konsisten"""
    
    # Buat koneksi database
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        print("🚀 Memulai update persentase dan kategori kehadiran...")
        
        # Cek data sebelum update
        print("\n📊 Cek data sebelum update:")
        
        # Cek jumlah record dengan persentase kosong
        kosong_persentase = db.execute(text("""
            SELECT COUNT(*) 
            FROM presensi 
            WHERE persentase_kehadiran IS NULL OR persentase_kehadiran = 0
        """)).scalar()
        
        print(f"   📋 Record dengan persentase_kehadiran kosong: {kosong_persentase}")
        
        # Cek jumlah record dengan kategori kosong
        kosong_kategori = db.execute(text("""
            SELECT COUNT(*) 
            FROM presensi 
            WHERE kategori_kehadiran IS NULL OR kategori_kehadiran = ''
        """)).scalar()
        
        print(f"   📋 Record dengan kategori_kehadiran kosong: {kosong_kategori}")
        
        # Cek data yang tidak konsisten
        inkonsisten = db.execute(text("""
            SELECT COUNT(*) 
            FROM presensi 
            WHERE 
                (kategori_kehadiran = 'Tinggi' AND persentase_kehadiran < 80) OR
                (kategori_kehadiran = 'Sedang' AND (persentase_kehadiran < 75 OR persentase_kehadiran >= 80)) OR
                (kategori_kehadiran = 'Rendah' AND persentase_kehadiran >= 75)
        """)).scalar()
        
        print(f"   ⚠️  Record dengan data inkonsisten: {inkonsisten}")
        
        total_perlu_update = kosong_persentase + kosong_kategori + inkonsisten
        
        if total_perlu_update == 0:
            print("   ✅ Semua data sudah konsisten!")
            return
        
        # Cek distribusi yang akan diupdate
        distribusi = db.execute(text("""
            SELECT 
                CASE 
                    WHEN (jumlah_hadir + jumlah_sakit + jumlah_izin + jumlah_alpa) = 0 THEN 'Total hari = 0'
                    WHEN (jumlah_hadir::float / (jumlah_hadir + jumlah_sakit + jumlah_izin + jumlah_alpa)) * 100 >= 80 THEN 'Tinggi'
                    WHEN (jumlah_hadir::float / (jumlah_hadir + jumlah_sakit + jumlah_izin + jumlah_alpa)) * 100 >= 75 THEN 'Sedang'
                    ELSE 'Rendah'
                END as kategori_baru,
                COUNT(*) as jumlah,
                MIN(jumlah_hadir) as min_hadir,
                MAX(jumlah_hadir) as max_hadir
            FROM presensi 
            WHERE persentase_kehadiran IS NULL OR persentase_kehadiran = 0 
               OR kategori_kehadiran IS NULL OR kategori_kehadiran = ''
               OR (kategori_kehadiran = 'Tinggi' AND persentase_kehadiran < 80)
               OR (kategori_kehadiran = 'Sedang' AND (persentase_kehadiran < 75 OR persentase_kehadiran >= 80))
               OR (kategori_kehadiran = 'Rendah' AND persentase_kehadiran >= 75)
            GROUP BY 
                CASE 
                    WHEN (jumlah_hadir + jumlah_sakit + jumlah_izin + jumlah_alpa) = 0 THEN 'Total hari = 0'
                    WHEN (jumlah_hadir::float / (jumlah_hadir + jumlah_sakit + jumlah_izin + jumlah_alpa)) * 100 >= 80 THEN 'Tinggi'
                    WHEN (jumlah_hadir::float / (jumlah_hadir + jumlah_sakit + jumlah_izin + jumlah_alpa)) * 100 >= 75 THEN 'Sedang'
                    ELSE 'Rendah'
                END
            ORDER BY kategori_baru
        """)).fetchall()
        
        print("   📈 Distribusi yang akan diupdate:")
        for row in distribusi:
            print(f"      {row.kategori_baru}: {row.jumlah} record (Hadir: {row.min_hadir}-{row.max_hadir})")
        
        # Mulai update
        print("\n🔧 Memulai update persentase dan kategori kehadiran...")
        
        # Update semua record yang perlu diperbaiki
        result = db.execute(text("""
            UPDATE presensi 
            SET 
                persentase_kehadiran = CASE 
                    WHEN (jumlah_hadir + jumlah_sakit + jumlah_izin + jumlah_alpa) = 0 THEN 0
                    ELSE ROUND(CAST((jumlah_hadir::float / (jumlah_hadir + jumlah_sakit + jumlah_izin + jumlah_alpa)) * 100 AS numeric), 2)
                END,
                kategori_kehadiran = CASE 
                    WHEN (jumlah_hadir + jumlah_sakit + jumlah_izin + jumlah_alpa) = 0 THEN 'Rendah'
                    WHEN (jumlah_hadir::float / (jumlah_hadir + jumlah_sakit + jumlah_izin + jumlah_alpa)) * 100 >= 80 THEN 'Tinggi'
                    WHEN (jumlah_hadir::float / (jumlah_hadir + jumlah_sakit + jumlah_izin + jumlah_alpa)) * 100 >= 75 THEN 'Sedang'
                    ELSE 'Rendah'
                END,
                updated_at = CURRENT_TIMESTAMP
            WHERE 
                persentase_kehadiran IS NULL OR persentase_kehadiran = 0 
                OR kategori_kehadiran IS NULL OR kategori_kehadiran = ''
                OR (kategori_kehadiran = 'Tinggi' AND persentase_kehadiran < 80)
                OR (kategori_kehadiran = 'Sedang' AND (persentase_kehadiran < 75 OR persentase_kehadiran >= 80))
                OR (kategori_kehadiran = 'Rendah' AND persentase_kehadiran >= 75)
        """))
        
        total_updated = result.rowcount
        print(f"   ✅ Total {total_updated} record berhasil diupdate!")
        
        # Commit perubahan
        db.commit()
        
        # Verifikasi hasil
        print("\n🔍 Verifikasi hasil update:")
        
        # Cek apakah masih ada yang kosong
        sisa_kosong_persentase = db.execute(text("""
            SELECT COUNT(*) 
            FROM presensi 
            WHERE persentase_kehadiran IS NULL OR persentase_kehadiran = 0
        """)).scalar()
        print(f"   📋 Record dengan persentase masih kosong: {sisa_kosong_persentase}")
        
        sisa_kosong_kategori = db.execute(text("""
            SELECT COUNT(*) 
            FROM presensi 
            WHERE kategori_kehadiran IS NULL OR kategori_kehadiran = ''
        """)).scalar()
        print(f"   📋 Record dengan kategori masih kosong: {sisa_kosong_kategori}")
        
        # Cek distribusi final
        distribusi_final = db.execute(text("""
            SELECT 
                kategori_kehadiran,
                COUNT(*) as jumlah,
                MIN(persentase_kehadiran) as min_persentase,
                MAX(persentase_kehadiran) as max_persentase,
                AVG(persentase_kehadiran) as avg_persentase,
                ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM presensi), 2) as persentase_distribusi
            FROM presensi 
            GROUP BY kategori_kehadiran
            ORDER BY 
                CASE kategori_kehadiran
                    WHEN 'Tinggi' THEN 1
                    WHEN 'Sedang' THEN 2
                    WHEN 'Rendah' THEN 3
                    ELSE 4
                END
        """)).fetchall()
        
        print("   📊 Distribusi kategori final:")
        for row in distribusi_final:
            print(f"      {row.kategori_kehadiran}: {row.jumlah} record ({row.persentase_distribusi}%) - {row.min_persentase:.1f}% s/d {row.max_persentase:.1f}% (avg: {row.avg_persentase:.1f}%)")
        
        # Cek konsistensi data setelah update
        inkonsisten_final = db.execute(text("""
            SELECT COUNT(*) 
            FROM presensi 
            WHERE 
                (kategori_kehadiran = 'Tinggi' AND persentase_kehadiran < 80) OR
                (kategori_kehadiran = 'Sedang' AND (persentase_kehadiran < 75 OR persentase_kehadiran >= 80)) OR
                (kategori_kehadiran = 'Rendah' AND persentase_kehadiran >= 75)
        """)).scalar()
        
        if inkonsisten_final > 0:
            print(f"   ⚠️  Masih ditemukan {inkonsisten_final} record inkonsisten!")
            
            # Detail record inkonsisten
            detail_inkonsisten = db.execute(text("""
                SELECT 
                    id,
                    siswa_id,
                    jumlah_hadir,
                    (jumlah_hadir + jumlah_sakit + jumlah_izin + jumlah_alpa) as total_hari,
                    persentase_kehadiran,
                    kategori_kehadiran,
                    CASE 
                        WHEN persentase_kehadiran >= 80 THEN 'Seharusnya Tinggi'
                        WHEN persentase_kehadiran >= 75 THEN 'Seharusnya Sedang'
                        ELSE 'Seharusnya Rendah'
                    END as kategori_seharusnya
                FROM presensi 
                WHERE 
                    (kategori_kehadiran = 'Tinggi' AND persentase_kehadiran < 80) OR
                    (kategori_kehadiran = 'Sedang' AND (persentase_kehadiran < 75 OR persentase_kehadiran >= 80)) OR
                    (kategori_kehadiran = 'Rendah' AND persentase_kehadiran >= 75)
                LIMIT 5
            """)).fetchall()
            
            print("      Detail record inkonsisten (5 pertama):")
            for row in detail_inkonsisten:
                print(f"         ID {row.id}: {row.persentase_kehadiran:.1f}% -> '{row.kategori_kehadiran}' ({row.kategori_seharusnya})")
        else:
            print("   ✅ Semua data konsisten!")
        
        # Cek record dengan total hari = 0
        total_hari_nol = db.execute(text("""
            SELECT COUNT(*) 
            FROM presensi 
            WHERE (jumlah_hadir + jumlah_sakit + jumlah_izin + jumlah_alpa) = 0
        """)).scalar()
        
        if total_hari_nol > 0:
            print(f"   ⚠️  Ditemukan {total_hari_nol} record dengan total hari = 0")
        
        # Summary report
        total_records = db.execute(text("SELECT COUNT(*) FROM presensi")).scalar()
        tinggi_count = db.execute(text("SELECT COUNT(*) FROM presensi WHERE kategori_kehadiran = 'Tinggi'")).scalar()
        sedang_count = db.execute(text("SELECT COUNT(*) FROM presensi WHERE kategori_kehadiran = 'Sedang'")).scalar()
        rendah_count = db.execute(text("SELECT COUNT(*) FROM presensi WHERE kategori_kehadiran = 'Rendah'")).scalar()
        
        print(f"\n📈 Summary Report:")
        print(f"   📊 Total record: {total_records}")
        print(f"   🟢 Kategori Tinggi: {tinggi_count} ({tinggi_count/total_records*100:.1f}%)")
        print(f"   🟡 Kategori Sedang: {sedang_count} ({sedang_count/total_records*100:.1f}%)")
        print(f"   🔴 Kategori Rendah: {rendah_count} ({rendah_count/total_records*100:.1f}%)")
        print(f"   📋 Persentase kosong: {sisa_kosong_persentase}")
        print(f"   📋 Kategori kosong: {sisa_kosong_kategori}")
        
        # Statistik tambahan
        avg_persentase = db.execute(text("SELECT AVG(persentase_kehadiran) FROM presensi WHERE persentase_kehadiran > 0")).scalar()
        max_persentase = db.execute(text("SELECT MAX(persentase_kehadiran) FROM presensi")).scalar()
        min_persentase = db.execute(text("SELECT MIN(persentase_kehadiran) FROM presensi WHERE persentase_kehadiran > 0")).scalar()
        
        print(f"\n📊 Statistik Persentase Kehadiran:")
        print(f"   📈 Rata-rata: {avg_persentase:.1f}%")
        print(f"   📊 Tertinggi: {max_persentase:.1f}%")
        print(f"   📉 Terendah: {min_persentase:.1f}%")
        
        if sisa_kosong_persentase == 0 and sisa_kosong_kategori == 0 and inkonsisten_final == 0:
            print("\n🎉 Update persentase kehadiran berhasil sempurna!")
        elif sisa_kosong_persentase == 0 and sisa_kosong_kategori == 0:
            print("\n✅ Update persentase kehadiran selesai dengan beberapa inkonsistensi!")
        else:
            print(f"\n⚠️  Update selesai, namun masih ada data yang perlu diperbaiki!")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Memulai update persentase dan kategori kehadiran...")
    print("📋 Logika kategori:")
    print("   🟢 Tinggi: >= 80%")
    print("   🟡 Sedang: 75% - 79%")
    print("   🔴 Rendah: < 75%")
    print("   📊 Persentase = (jumlah_hadir / total_hari) * 100")
    print("   📅 Total hari = hadir + sakit + izin + alpa")
    print()
    
    update_persentase_kehadiran()
    print("\n🏁 Selesai!") 