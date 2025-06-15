#!/usr/bin/env python3
"""
Script untuk mengupdate kategori_penghasilan yang masih kosong
Menggunakan logika yang sama dengan function create_penghasilan dan update_penghasilan
"""

import os
import sys
from datetime import datetime
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Tambahkan path backend ke sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import DATABASE_URL, PenghasilanOrtu

def update_kategori_penghasilan():
    """Update kategori_penghasilan yang masih kosong berdasarkan total_penghasilan"""
    
    # Buat koneksi database
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        print("🚀 Memulai update kategori penghasilan...")
        
        # Cek data sebelum update
        print("\n📊 Cek data sebelum update:")
        
        # Cek jumlah record dengan kategori kosong
        kosong_count = db.execute(text("""
            SELECT COUNT(*) 
            FROM penghasilan_ortu 
            WHERE kategori_penghasilan IS NULL OR kategori_penghasilan = ''
        """)).scalar()
        
        print(f"   📋 Record dengan kategori_penghasilan kosong: {kosong_count}")
        
        if kosong_count == 0:
            print("   ✅ Tidak ada kategori_penghasilan yang kosong!")
            return
        
        # Cek distribusi yang akan diupdate
        distribusi = db.execute(text("""
            SELECT 
                CASE 
                    WHEN total_penghasilan >= 5000000 THEN 'Tinggi'
                    WHEN total_penghasilan >= 2300000 THEN 'Menengah'
                    ELSE 'Rendah'
                END as kategori_baru,
                COUNT(*) as jumlah,
                MIN(total_penghasilan) as min_penghasilan,
                MAX(total_penghasilan) as max_penghasilan
            FROM penghasilan_ortu 
            WHERE kategori_penghasilan IS NULL OR kategori_penghasilan = ''
            GROUP BY 
                CASE 
                    WHEN total_penghasilan >= 5000000 THEN 'Tinggi'
                    WHEN total_penghasilan >= 2300000 THEN 'Menengah'
                    ELSE 'Rendah'
                END
            ORDER BY min_penghasilan DESC
        """)).fetchall()
        
        print("   📈 Distribusi yang akan diupdate:")
        for row in distribusi:
            print(f"      {row.kategori_baru}: {row.jumlah} record (Rp {row.min_penghasilan:,} - Rp {row.max_penghasilan:,})")
        
        # Mulai update
        print("\n🔧 Memulai update kategori penghasilan...")
        
        # Update kategori "Tinggi" (>= 5 juta)
        tinggi_updated = db.execute(text("""
            UPDATE penghasilan_ortu 
            SET 
                kategori_penghasilan = 'Tinggi',
                updated_at = CURRENT_TIMESTAMP
            WHERE 
                (kategori_penghasilan IS NULL OR kategori_penghasilan = '')
                AND total_penghasilan >= 5000000
        """))
        print(f"   💰 Kategori 'Tinggi': {tinggi_updated.rowcount} record diupdate")
        
        # Update kategori "Menengah" (2.3 juta - 4.999.999)
        menengah_updated = db.execute(text("""
            UPDATE penghasilan_ortu 
            SET 
                kategori_penghasilan = 'Menengah',
                updated_at = CURRENT_TIMESTAMP
            WHERE 
                (kategori_penghasilan IS NULL OR kategori_penghasilan = '')
                AND total_penghasilan >= 2300000 
                AND total_penghasilan < 5000000
        """))
        print(f"   💵 Kategori 'Menengah': {menengah_updated.rowcount} record diupdate")
        
        # Update kategori "Rendah" (< 2.3 juta)
        rendah_updated = db.execute(text("""
            UPDATE penghasilan_ortu 
            SET 
                kategori_penghasilan = 'Rendah',
                updated_at = CURRENT_TIMESTAMP
            WHERE 
                (kategori_penghasilan IS NULL OR kategori_penghasilan = '')
                AND total_penghasilan < 2300000
        """))
        print(f"   💴 Kategori 'Rendah': {rendah_updated.rowcount} record diupdate")
        
        # Commit perubahan
        db.commit()
        
        total_updated = tinggi_updated.rowcount + menengah_updated.rowcount + rendah_updated.rowcount
        print(f"\n✅ Total {total_updated} record berhasil diupdate!")
        
        # Verifikasi hasil
        print("\n🔍 Verifikasi hasil update:")
        
        # Cek apakah masih ada yang kosong
        sisa_kosong = db.execute(text("""
            SELECT COUNT(*) 
            FROM penghasilan_ortu 
            WHERE kategori_penghasilan IS NULL OR kategori_penghasilan = ''
        """)).scalar()
        print(f"   📋 Record yang masih kosong: {sisa_kosong}")
        
        # Cek distribusi final
        distribusi_final = db.execute(text("""
            SELECT 
                kategori_penghasilan,
                COUNT(*) as jumlah,
                MIN(total_penghasilan) as min_penghasilan,
                MAX(total_penghasilan) as max_penghasilan,
                ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM penghasilan_ortu), 2) as persentase
            FROM penghasilan_ortu 
            WHERE kategori_penghasilan IS NOT NULL AND kategori_penghasilan != ''
            GROUP BY kategori_penghasilan
            ORDER BY 
                CASE kategori_penghasilan
                    WHEN 'Tinggi' THEN 1
                    WHEN 'Menengah' THEN 2
                    WHEN 'Rendah' THEN 3
                    ELSE 4
                END
        """)).fetchall()
        
        print("   📊 Distribusi kategori final:")
        for row in distribusi_final:
            print(f"      {row.kategori_penghasilan}: {row.jumlah} record ({row.persentase}%) - Rp {row.min_penghasilan:,} s/d Rp {row.max_penghasilan:,}")
        
        # Cek konsistensi data
        inkonsisten = db.execute(text("""
            SELECT COUNT(*) 
            FROM penghasilan_ortu 
            WHERE 
                (kategori_penghasilan = 'Tinggi' AND total_penghasilan < 5000000) OR
                (kategori_penghasilan = 'Menengah' AND (total_penghasilan < 2300000 OR total_penghasilan >= 5000000)) OR
                (kategori_penghasilan = 'Rendah' AND total_penghasilan >= 2300000)
        """)).scalar()
        
        if inkonsisten > 0:
            print(f"   ⚠️  Ditemukan {inkonsisten} record dengan data inkonsisten!")
            
            # Detail record inkonsisten
            detail_inkonsisten = db.execute(text("""
                SELECT 
                    id,
                    siswa_id,
                    total_penghasilan,
                    kategori_penghasilan,
                    CASE 
                        WHEN total_penghasilan >= 5000000 THEN 'Seharusnya Tinggi'
                        WHEN total_penghasilan >= 2300000 THEN 'Seharusnya Menengah'
                        ELSE 'Seharusnya Rendah'
                    END as kategori_seharusnya
                FROM penghasilan_ortu 
                WHERE 
                    (kategori_penghasilan = 'Tinggi' AND total_penghasilan < 5000000) OR
                    (kategori_penghasilan = 'Menengah' AND (total_penghasilan < 2300000 OR total_penghasilan >= 5000000)) OR
                    (kategori_penghasilan = 'Rendah' AND total_penghasilan >= 2300000)
                LIMIT 5
            """)).fetchall()
            
            print("      Detail record inkonsisten (5 pertama):")
            for row in detail_inkonsisten:
                print(f"         ID {row.id}: Rp {row.total_penghasilan:,} -> '{row.kategori_penghasilan}' ({row.kategori_seharusnya})")
        else:
            print("   ✅ Semua data konsisten!")
        
        # Summary report
        total_records = db.execute(text("SELECT COUNT(*) FROM penghasilan_ortu")).scalar()
        tinggi_count = db.execute(text("SELECT COUNT(*) FROM penghasilan_ortu WHERE kategori_penghasilan = 'Tinggi'")).scalar()
        menengah_count = db.execute(text("SELECT COUNT(*) FROM penghasilan_ortu WHERE kategori_penghasilan = 'Menengah'")).scalar()
        rendah_count = db.execute(text("SELECT COUNT(*) FROM penghasilan_ortu WHERE kategori_penghasilan = 'Rendah'")).scalar()
        
        print(f"\n📈 Summary Report:")
        print(f"   📊 Total record: {total_records}")
        print(f"   💰 Kategori Tinggi: {tinggi_count} ({tinggi_count/total_records*100:.1f}%)")
        print(f"   💵 Kategori Menengah: {menengah_count} ({menengah_count/total_records*100:.1f}%)")
        print(f"   💴 Kategori Rendah: {rendah_count} ({rendah_count/total_records*100:.1f}%)")
        print(f"   📋 Masih kosong: {sisa_kosong}")
        
        if sisa_kosong == 0 and inkonsisten == 0:
            print("\n🎉 Update kategori penghasilan berhasil sempurna!")
        elif sisa_kosong == 0:
            print("\n✅ Update kategori penghasilan selesai dengan beberapa inkonsistensi!")
        else:
            print(f"\n⚠️  Update selesai, namun masih ada {sisa_kosong} record kosong!")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Memulai update kategori penghasilan yang kosong...")
    print("📋 Logika kategori:")
    print("   💰 Tinggi: >= Rp 5.000.000 (2x UMK Jogja)")
    print("   💵 Menengah: Rp 2.300.000 - Rp 4.999.999 (UMK Jogja)")
    print("   💴 Rendah: < Rp 2.300.000")
    print("   📅 Referensi: UMK Jogja 2024 = Rp 2.300.000")
    print()
    
    update_kategori_penghasilan()
    print("\n🏁 Selesai!") 