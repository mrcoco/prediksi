#!/usr/bin/env python3
"""
Script untuk mengupdate rata_rata pada tabel nilai_raport
Menggunakan logika yang sama dengan function create_nilai di backend
"""

import os
import sys
import psycopg2
from datetime import datetime
import time

# Konfigurasi database
DATABASE_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': os.getenv('DB_PORT', '5432'),
    'database': os.getenv('DB_NAME', 'prestasi_siswa'),
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', 'postgres')
}

def print_with_timestamp(message, emoji="ℹ️"):
    """Print message dengan timestamp dan emoji"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"{emoji} [{timestamp}] {message}")

def connect_to_database():
    """Koneksi ke database PostgreSQL"""
    try:
        print_with_timestamp("🔌 Mencoba koneksi ke database...")
        conn = psycopg2.connect(**DATABASE_CONFIG)
        print_with_timestamp("✅ Berhasil terhubung ke database", "✅")
        return conn
    except psycopg2.Error as e:
        print_with_timestamp(f"❌ Gagal terhubung ke database: {e}", "❌")
        sys.exit(1)

def execute_query(cursor, query, description=""):
    """Execute query dengan error handling"""
    try:
        if description:
            print_with_timestamp(f"🔄 {description}...")
        
        cursor.execute(query)
        
        # Jika query SELECT, return hasil
        if query.strip().upper().startswith('SELECT'):
            return cursor.fetchall()
        
        return None
        
    except psycopg2.Error as e:
        print_with_timestamp(f"❌ Error saat {description.lower()}: {e}", "❌")
        raise

def check_data_before_update(cursor):
    """Cek kondisi data sebelum update"""
    print_with_timestamp("📊 Mengecek kondisi data sebelum update...", "📊")
    
    # Cek jumlah record dengan rata_rata kosong
    query_kosong = """
    SELECT COUNT(*) as total_kosong_rata_rata
    FROM nilai_raport 
    WHERE rata_rata IS NULL OR rata_rata = 0;
    """
    
    result = execute_query(cursor, query_kosong, "Cek record dengan rata_rata kosong")
    kosong_count = result[0][0] if result else 0
    print_with_timestamp(f"📈 Record dengan rata_rata kosong: {kosong_count}", "📈")
    
    # Cek data yang tidak konsisten
    query_inkonsisten = """
    SELECT COUNT(*) as inkonsisten_count
    FROM nilai_raport 
    WHERE rata_rata IS NOT NULL 
      AND rata_rata != 0
      AND ABS(rata_rata - (
          (COALESCE(matematika,0) + COALESCE(bahasa_indonesia,0) + COALESCE(bahasa_inggris,0) + 
           COALESCE(bahasa_jawa,0) + COALESCE(ipa,0) + COALESCE(agama,0) + COALESCE(pjok,0) + 
           COALESCE(pkn,0) + COALESCE(sejarah,0) + COALESCE(seni,0) + COALESCE(dasar_kejuruan,0)) / 11
      )) > 0.1;
    """
    
    result = execute_query(cursor, query_inkonsisten, "Cek record dengan rata_rata tidak konsisten")
    inkonsisten_count = result[0][0] if result else 0
    print_with_timestamp(f"📈 Record dengan rata_rata tidak konsisten: {inkonsisten_count}", "📈")
    
    # Cek record dengan nilai NULL
    query_null = """
    SELECT COUNT(*) as nilai_null_count
    FROM nilai_raport 
    WHERE matematika IS NULL OR bahasa_indonesia IS NULL OR bahasa_inggris IS NULL OR 
          bahasa_jawa IS NULL OR ipa IS NULL OR agama IS NULL OR pjok IS NULL OR 
          pkn IS NULL OR sejarah IS NULL OR seni IS NULL OR dasar_kejuruan IS NULL;
    """
    
    result = execute_query(cursor, query_null, "Cek record dengan nilai mata pelajaran NULL")
    null_count = result[0][0] if result else 0
    print_with_timestamp(f"📈 Record dengan nilai mata pelajaran NULL: {null_count}", "📈")
    
    total_to_update = kosong_count + inkonsisten_count
    print_with_timestamp(f"📊 Total record yang akan diupdate: {total_to_update}", "📊")
    
    return {
        'kosong_count': kosong_count,
        'inkonsisten_count': inkonsisten_count,
        'null_count': null_count,
        'total_to_update': total_to_update
    }

def update_rata_rata(cursor):
    """Update rata_rata pada nilai_raport"""
    print_with_timestamp("🔄 Memulai update rata_rata...", "🔄")
    
    update_query = """
    UPDATE nilai_raport 
    SET 
        rata_rata = ROUND(CAST((
            COALESCE(matematika, 0) + 
            COALESCE(bahasa_indonesia, 0) + 
            COALESCE(bahasa_inggris, 0) + 
            COALESCE(bahasa_jawa, 0) + 
            COALESCE(ipa, 0) + 
            COALESCE(agama, 0) + 
            COALESCE(pjok, 0) + 
            COALESCE(pkn, 0) + 
            COALESCE(sejarah, 0) + 
            COALESCE(seni, 0) + 
            COALESCE(dasar_kejuruan, 0)
        ) / 11.0 AS numeric), 2),
        updated_at = CURRENT_TIMESTAMP
    WHERE 
        -- Update record yang kosong atau tidak konsisten
        rata_rata IS NULL OR rata_rata = 0 
        OR ABS(rata_rata - (
            (COALESCE(matematika,0) + COALESCE(bahasa_indonesia,0) + COALESCE(bahasa_inggris,0) + 
             COALESCE(bahasa_jawa,0) + COALESCE(ipa,0) + COALESCE(agama,0) + COALESCE(pjok,0) + 
             COALESCE(pkn,0) + COALESCE(sejarah,0) + COALESCE(seni,0) + COALESCE(dasar_kejuruan,0)) / 11
        )) > 0.1;
    """
    
    start_time = time.time()
    execute_query(cursor, update_query, "Update rata_rata nilai raport")
    end_time = time.time()
    
    # Get jumlah record yang diupdate
    updated_count = cursor.rowcount
    duration = end_time - start_time
    
    print_with_timestamp(f"✅ Update selesai! {updated_count} record berhasil diupdate dalam {duration:.2f} detik", "✅")
    
    return updated_count

def verify_update_results(cursor):
    """Verifikasi hasil update"""
    print_with_timestamp("🔍 Memverifikasi hasil update...", "🔍")
    
    # Cek apakah masih ada rata_rata yang kosong
    query_sisa_kosong = """
    SELECT COUNT(*) as sisa_kosong_rata_rata
    FROM nilai_raport 
    WHERE rata_rata IS NULL OR rata_rata = 0;
    """
    
    result = execute_query(cursor, query_sisa_kosong, "Cek sisa record dengan rata_rata kosong")
    sisa_kosong = result[0][0] if result else 0
    
    if sisa_kosong == 0:
        print_with_timestamp("✅ Semua record sudah memiliki rata_rata yang valid", "✅")
    else:
        print_with_timestamp(f"⚠️ Masih ada {sisa_kosong} record dengan rata_rata kosong", "⚠️")
    
    # Cek distribusi rata-rata setelah update
    query_distribusi = """
    SELECT 
        CASE 
            WHEN rata_rata >= 85 THEN 'Sangat Baik (>=85)'
            WHEN rata_rata >= 75 THEN 'Baik (75-84)'
            WHEN rata_rata >= 65 THEN 'Cukup (65-74)'
            ELSE 'Kurang (<65)'
        END as kategori_rata_rata,
        COUNT(*) as jumlah,
        MIN(rata_rata) as min_rata_rata,
        MAX(rata_rata) as max_rata_rata,
        ROUND(AVG(rata_rata), 2) as avg_rata_rata,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM nilai_raport), 2) as persentase_distribusi
    FROM nilai_raport 
    GROUP BY 
        CASE 
            WHEN rata_rata >= 85 THEN 'Sangat Baik (>=85)'
            WHEN rata_rata >= 75 THEN 'Baik (75-84)'
            WHEN rata_rata >= 65 THEN 'Cukup (65-74)'
            ELSE 'Kurang (<65)'
        END
    ORDER BY 
        CASE 
            WHEN rata_rata >= 85 THEN 1
            WHEN rata_rata >= 75 THEN 2
            WHEN rata_rata >= 65 THEN 3
            ELSE 4
        END;
    """
    
    result = execute_query(cursor, query_distribusi, "Cek distribusi rata-rata setelah update")
    
    print_with_timestamp("📊 Distribusi rata-rata setelah update:", "📊")
    print("=" * 80)
    print(f"{'Kategori':<20} {'Jumlah':<8} {'Min':<6} {'Max':<6} {'Avg':<6} {'Persentase':<10}")
    print("=" * 80)
    
    total_records = 0
    for row in result:
        kategori, jumlah, min_val, max_val, avg_val, persentase = row
        total_records += jumlah
        print(f"{kategori:<20} {jumlah:<8} {min_val:<6.1f} {max_val:<6.1f} {avg_val:<6.1f} {persentase:<10.1f}%")
    
    print("=" * 80)
    print(f"{'Total':<20} {total_records:<8}")
    print("=" * 80)
    
    # Cek konsistensi data setelah update
    query_konsistensi = """
    SELECT COUNT(*) as jumlah_inkonsisten
    FROM nilai_raport 
    WHERE rata_rata IS NOT NULL 
      AND rata_rata != 0
      AND ABS(rata_rata - (
          (COALESCE(matematika,0) + COALESCE(bahasa_indonesia,0) + COALESCE(bahasa_inggris,0) + 
           COALESCE(bahasa_jawa,0) + COALESCE(ipa,0) + COALESCE(agama,0) + COALESCE(pjok,0) + 
           COALESCE(pkn,0) + COALESCE(sejarah,0) + COALESCE(seni,0) + COALESCE(dasar_kejuruan,0)) / 11
      )) > 0.1;
    """
    
    result = execute_query(cursor, query_konsistensi, "Cek konsistensi data setelah update")
    inkonsisten_count = result[0][0] if result else 0
    
    if inkonsisten_count == 0:
        print_with_timestamp("✅ Semua data sudah konsisten", "✅")
    else:
        print_with_timestamp(f"⚠️ Masih ada {inkonsisten_count} record yang tidak konsisten", "⚠️")
    
    return {
        'sisa_kosong': sisa_kosong,
        'inkonsisten_count': inkonsisten_count,
        'total_records': total_records
    }

def generate_summary_report(cursor, before_stats, updated_count, after_stats):
    """Generate summary report"""
    print_with_timestamp("📋 Generating summary report...", "📋")
    
    # Get overall statistics
    query_summary = """
    SELECT 
        (SELECT COUNT(*) FROM nilai_raport) as total_record,
        (SELECT COUNT(*) FROM nilai_raport WHERE rata_rata >= 85) as sangat_baik_count,
        (SELECT COUNT(*) FROM nilai_raport WHERE rata_rata >= 75 AND rata_rata < 85) as baik_count,
        (SELECT COUNT(*) FROM nilai_raport WHERE rata_rata >= 65 AND rata_rata < 75) as cukup_count,
        (SELECT COUNT(*) FROM nilai_raport WHERE rata_rata < 65) as kurang_count,
        (SELECT COUNT(*) FROM nilai_raport WHERE rata_rata IS NULL OR rata_rata = 0) as rata_rata_kosong,
        (SELECT COUNT(*) FROM nilai_raport WHERE matematika IS NULL OR bahasa_indonesia IS NULL OR bahasa_inggris IS NULL OR 
                 bahasa_jawa IS NULL OR ipa IS NULL OR agama IS NULL OR pjok IS NULL OR 
                 pkn IS NULL OR sejarah IS NULL OR seni IS NULL OR dasar_kejuruan IS NULL) as nilai_null_count;
    """
    
    result = execute_query(cursor, query_summary, "Generate summary statistics")
    
    if result:
        total_record, sangat_baik, baik, cukup, kurang, rata_rata_kosong, nilai_null = result[0]
        
        print("\n" + "=" * 60)
        print("📋 SUMMARY REPORT - UPDATE RATA-RATA NILAI RAPORT")
        print("=" * 60)
        print(f"⏰ Waktu selesai: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"📊 Total record: {total_record}")
        print(f"🔄 Record yang diupdate: {updated_count}")
        print()
        print("📈 DISTRIBUSI NILAI:")
        print(f"   🟢 Sangat Baik (>=85): {sangat_baik} ({sangat_baik/total_record*100:.1f}%)")
        print(f"   🔵 Baik (75-84): {baik} ({baik/total_record*100:.1f}%)")
        print(f"   🟡 Cukup (65-74): {cukup} ({cukup/total_record*100:.1f}%)")
        print(f"   🔴 Kurang (<65): {kurang} ({kurang/total_record*100:.1f}%)")
        print()
        print("🔍 STATUS DATA:")
        print(f"   📊 Rata-rata kosong: {rata_rata_kosong}")
        print(f"   ❓ Nilai mata pelajaran NULL: {nilai_null}")
        print(f"   ⚠️ Data tidak konsisten: {after_stats['inkonsisten_count']}")
        print()
        print("📊 PERUBAHAN:")
        print(f"   📉 Sebelum: {before_stats['kosong_count']} kosong, {before_stats['inkonsisten_count']} tidak konsisten")
        print(f"   📈 Sesudah: {after_stats['sisa_kosong']} kosong, {after_stats['inkonsisten_count']} tidak konsisten")
        print("=" * 60)
        
        if rata_rata_kosong == 0 and after_stats['inkonsisten_count'] == 0:
            print("🎉 UPDATE BERHASIL SEMPURNA! Semua data sudah konsisten.")
        elif rata_rata_kosong == 0:
            print("✅ UPDATE BERHASIL! Tidak ada lagi rata-rata yang kosong.")
        else:
            print("⚠️ UPDATE SELESAI dengan beberapa catatan. Periksa data yang masih bermasalah.")
        
        print("=" * 60)

def main():
    """Main function"""
    print("=" * 60)
    print("🚀 UPDATE RATA-RATA NILAI RAPORT")
    print("=" * 60)
    print("📝 Script untuk mengupdate rata_rata pada tabel nilai_raport")
    print("🧮 Logika: rata_rata = (sum of 11 mata pelajaran) / 11")
    print("=" * 60)
    
    # Koneksi ke database
    conn = connect_to_database()
    cursor = conn.cursor()
    
    try:
        # Cek data sebelum update
        before_stats = check_data_before_update(cursor)
        
        if before_stats['total_to_update'] == 0:
            print_with_timestamp("ℹ️ Tidak ada data yang perlu diupdate", "ℹ️")
            return
        
        # Konfirmasi dari user
        print_with_timestamp(f"❓ Akan mengupdate {before_stats['total_to_update']} record. Lanjutkan? (y/N): ", "❓")
        confirmation = input().strip().lower()
        
        if confirmation not in ['y', 'yes']:
            print_with_timestamp("❌ Update dibatalkan oleh user", "❌")
            return
        
        # Mulai transaction
        print_with_timestamp("🔄 Memulai transaction...", "🔄")
        
        # Update rata_rata
        updated_count = update_rata_rata(cursor)
        
        # Commit transaction
        conn.commit()
        print_with_timestamp("✅ Transaction berhasil di-commit", "✅")
        
        # Verifikasi hasil
        after_stats = verify_update_results(cursor)
        
        # Generate summary report
        generate_summary_report(cursor, before_stats, updated_count, after_stats)
        
    except Exception as e:
        # Rollback jika ada error
        conn.rollback()
        print_with_timestamp(f"❌ Error occurred, transaction rolled back: {e}", "❌")
        sys.exit(1)
        
    finally:
        # Tutup koneksi
        cursor.close()
        conn.close()
        print_with_timestamp("🔌 Koneksi database ditutup", "🔌")

if __name__ == "__main__":
    main() 