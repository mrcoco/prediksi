# 📊 Update Rata-rata Nilai Raport

Script untuk mengupdate field `rata_rata` pada tabel `nilai_raport` berdasarkan perhitungan 11 mata pelajaran yang konsisten dengan logika backend.

## 🎯 Tujuan

Mengupdate field `rata_rata` yang kosong, NULL, atau tidak konsisten dengan perhitungan yang benar berdasarkan 11 mata pelajaran:

1. **matematika**
2. **bahasa_indonesia** 
3. **bahasa_inggris**
4. **bahasa_jawa**
5. **ipa**
6. **agama**
7. **pjok**
8. **pkn**
9. **sejarah**
10. **seni**
11. **dasar_kejuruan**

## 🧮 Logika Perhitungan

```sql
rata_rata = (matematika + bahasa_indonesia + bahasa_inggris + bahasa_jawa + ipa + 
             agama + pjok + pkn + sejarah + seni + dasar_kejuruan) / 11
```

**Catatan Penting:**
- Nilai NULL akan dianggap sebagai 0 dalam perhitungan
- Hasil dibulatkan hingga 2 desimal
- Menggunakan logika yang sama dengan function `create_nilai` di backend

## 📁 File yang Tersedia

### 1. SQL Script
- **File:** `update_rata_rata_nilai_raport.sql`
- **Deskripsi:** Query SQL lengkap dengan validasi dan verifikasi
- **Fitur:**
  - ✅ Validasi data sebelum update
  - ✅ Update dengan PostgreSQL syntax yang benar
  - ✅ Verifikasi hasil setelah update
  - ✅ Statistik detail dan distribusi nilai
  - ✅ Backup query (optional)

### 2. Python Script
- **File:** `backend/update_rata_rata_nilai_raport.py`
- **Deskripsi:** Script Python dengan monitoring real-time
- **Fitur:**
  - ✅ Koneksi database dengan error handling
  - ✅ Progress monitoring dengan emoji
  - ✅ Transaction safety (rollback on error)
  - ✅ Detailed reporting dan statistik
  - ✅ User confirmation sebelum update

## 🚀 Cara Penggunaan

### Opsi 1: Menggunakan SQL Script

#### Via psql (Command Line)
```bash
# Masuk ke container database
docker exec -it prestasi-siswa-db-1 psql -U postgres -d prestasi_siswa

# Jalankan script
\i /path/to/update_rata_rata_nilai_raport.sql
```

#### Via pgAdmin atau Database Client
1. Buka file `update_rata_rata_nilai_raport.sql`
2. Copy-paste ke query editor
3. Execute query

### Opsi 2: Menggunakan Python Script

#### Persiapan Environment
```bash
# Install dependencies
pip install psycopg2-binary

# Set environment variables (optional)
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=prestasi_siswa
export DB_USER=postgres
export DB_PASSWORD=postgres
```

#### Eksekusi Script
```bash
# Dari direktori backend
cd backend
python update_rata_rata_nilai_raport.py

# Atau dengan Python3
python3 update_rata_rata_nilai_raport.py

# Atau langsung executable
chmod +x update_rata_rata_nilai_raport.py
./update_rata_rata_nilai_raport.py
```

#### Via Docker
```bash
# Jika menggunakan Docker
docker exec -it prestasi-siswa-backend-1 python update_rata_rata_nilai_raport.py
```

## 📊 Output dan Monitoring

### Python Script Output
```
============================================================
🚀 UPDATE RATA-RATA NILAI RAPORT
============================================================
📝 Script untuk mengupdate rata_rata pada tabel nilai_raport
🧮 Logika: rata_rata = (sum of 11 mata pelajaran) / 11
============================================================

ℹ️ [2024-01-15 10:30:00] 🔌 Mencoba koneksi ke database...
✅ [2024-01-15 10:30:01] ✅ Berhasil terhubung ke database
📊 [2024-01-15 10:30:01] 📊 Mengecek kondisi data sebelum update...
📈 [2024-01-15 10:30:01] 📈 Record dengan rata_rata kosong: 25
📈 [2024-01-15 10:30:01] 📈 Record dengan rata_rata tidak konsisten: 5
📈 [2024-01-15 10:30:01] 📈 Record dengan nilai mata pelajaran NULL: 0
📊 [2024-01-15 10:30:01] 📊 Total record yang akan diupdate: 30

❓ [2024-01-15 10:30:01] ❓ Akan mengupdate 30 record. Lanjutkan? (y/N): y

🔄 [2024-01-15 10:30:02] 🔄 Memulai transaction...
🔄 [2024-01-15 10:30:02] 🔄 Memulai update rata_rata...
✅ [2024-01-15 10:30:02] ✅ Update selesai! 30 record berhasil diupdate dalam 0.15 detik
✅ [2024-01-15 10:30:02] ✅ Transaction berhasil di-commit
```

### Distribusi Nilai Setelah Update
```
================================================================================
Kategori             Jumlah   Min    Max    Avg    Persentase
================================================================================
Sangat Baik (>=85)   75       85.0   98.5   91.2   75.0%     
Baik (75-84)         20       75.2   84.8   79.5   20.0%     
Cukup (65-74)        4        65.1   73.9   69.2   4.0%      
Kurang (<65)         1        62.3   62.3   62.3   1.0%      
================================================================================
Total                100      
================================================================================
```

### Summary Report
```
============================================================
📋 SUMMARY REPORT - UPDATE RATA-RATA NILAI RAPORT
============================================================
⏰ Waktu selesai: 2024-01-15 10:30:03
📊 Total record: 100
🔄 Record yang diupdate: 30

📈 DISTRIBUSI NILAI:
   🟢 Sangat Baik (>=85): 75 (75.0%)
   🔵 Baik (75-84): 20 (20.0%)
   🟡 Cukup (65-74): 4 (4.0%)
   🔴 Kurang (<65): 1 (1.0%)

🔍 STATUS DATA:
   📊 Rata-rata kosong: 0
   ❓ Nilai mata pelajaran NULL: 0
   ⚠️ Data tidak konsisten: 0

📊 PERUBAHAN:
   📉 Sebelum: 25 kosong, 5 tidak konsisten
   📈 Sesudah: 0 kosong, 0 tidak konsisten
============================================================
🎉 UPDATE BERHASIL SEMPURNA! Semua data sudah konsisten.
============================================================
```

## ⚠️ Troubleshooting

### Error: "relation nilai_raport does not exist"
```bash
# Pastikan tabel ada
SELECT COUNT(*) FROM nilai_raport;

# Jika tidak ada, cek nama tabel yang benar
\dt
```

### Error: "function round(double precision, integer) does not exist"
**Solusi:** Gunakan syntax PostgreSQL yang benar:
```sql
-- ❌ Salah
ROUND(nilai, 2)

-- ✅ Benar
ROUND(CAST(nilai AS numeric), 2)
```

### Error: "psycopg2.OperationalError: could not connect to server"
**Solusi:**
```bash
# Cek status database
docker ps | grep postgres

# Restart database jika perlu
docker restart prestasi-siswa-db-1

# Cek environment variables
echo $DB_HOST $DB_PORT $DB_NAME $DB_USER
```

### Error: "IndentationError" pada Python Script
**Solusi:**
```bash
# Pastikan menggunakan spaces, bukan tabs
# Cek indentation dengan:
python -m py_compile update_rata_rata_nilai_raport.py
```

### Error: "ModuleNotFoundError: No module named 'psycopg2'"
**Solusi:**
```bash
# Install psycopg2
pip install psycopg2-binary

# Atau jika menggunakan conda
conda install psycopg2
```

## 🔒 Keamanan dan Backup

### Backup Sebelum Update
```sql
-- Buat backup tabel (uncomment jika diperlukan)
CREATE TABLE nilai_raport_backup AS 
SELECT * FROM nilai_raport 
WHERE rata_rata IS NULL OR rata_rata = 0 
   OR ABS(rata_rata - (
       (COALESCE(matematika,0) + COALESCE(bahasa_indonesia,0) + COALESCE(bahasa_inggris,0) + 
        COALESCE(bahasa_jawa,0) + COALESCE(ipa,0) + COALESCE(agama,0) + COALESCE(pjok,0) + 
        COALESCE(pkn,0) + COALESCE(sejarah,0) + COALESCE(seni,0) + COALESCE(dasar_kejuruan,0)) / 11
   )) > 0.1;
```

### Restore dari Backup
```sql
-- Restore jika diperlukan
UPDATE nilai_raport 
SET rata_rata = backup.rata_rata
FROM nilai_raport_backup backup
WHERE nilai_raport.id = backup.id;
```

## 📈 Validasi Hasil

### Cek Konsistensi Data
```sql
-- Cek apakah masih ada data yang tidak konsisten
SELECT COUNT(*) as inkonsisten_count
FROM nilai_raport 
WHERE rata_rata IS NOT NULL 
  AND rata_rata != 0
  AND ABS(rata_rata - (
      (COALESCE(matematika,0) + COALESCE(bahasa_indonesia,0) + COALESCE(bahasa_inggris,0) + 
       COALESCE(bahasa_jawa,0) + COALESCE(ipa,0) + COALESCE(agama,0) + COALESCE(pjok,0) + 
       COALESCE(pkn,0) + COALESCE(sejarah,0) + COALESCE(seni,0) + COALESCE(dasar_kejuruan,0)) / 11
  )) > 0.1;
```

### Cek Distribusi Nilai
```sql
-- Lihat distribusi nilai setelah update
SELECT 
    CASE 
        WHEN rata_rata >= 85 THEN 'Sangat Baik (>=85)'
        WHEN rata_rata >= 75 THEN 'Baik (75-84)'
        WHEN rata_rata >= 65 THEN 'Cukup (65-74)'
        ELSE 'Kurang (<65)'
    END as kategori,
    COUNT(*) as jumlah,
    ROUND(AVG(rata_rata), 2) as rata_rata_kategori
FROM nilai_raport 
GROUP BY 
    CASE 
        WHEN rata_rata >= 85 THEN 'Sangat Baik (>=85)'
        WHEN rata_rata >= 75 THEN 'Baik (75-84)'
        WHEN rata_rata >= 65 THEN 'Cukup (65-74)'
        ELSE 'Kurang (<65)'
    END
ORDER BY rata_rata_kategori DESC;
```

## 🔄 Integrasi dengan Backend

Setelah update berhasil, pastikan backend service direstart untuk menerapkan perubahan:

```bash
# Restart backend service
docker restart prestasi-siswa-backend-1

# Atau jika menggunakan docker-compose
docker-compose restart backend
```

## 📝 Catatan Penting

1. **Konsistensi Logika:** Script ini menggunakan logika yang sama dengan function `create_nilai` di backend (11 mata pelajaran)
2. **Perbedaan dengan Update Function:** Function `update_nilai` di backend memiliki bug (hanya menggunakan 5 mata pelajaran), script ini menggunakan logika yang benar
3. **Nilai NULL:** Semua nilai NULL akan dianggap sebagai 0 dalam perhitungan
4. **Pembulatan:** Hasil dibulatkan hingga 2 desimal menggunakan `ROUND(CAST(...AS numeric), 2)`
5. **Transaction Safety:** Python script menggunakan transaction untuk memastikan data consistency

## 🎯 Hasil yang Diharapkan

Setelah menjalankan script:
- ✅ Semua record memiliki `rata_rata` yang valid (tidak NULL atau 0)
- ✅ Semua `rata_rata` konsisten dengan perhitungan 11 mata pelajaran
- ✅ Data terdistribusi sesuai dengan kualitas nilai siswa
- ✅ Tidak ada data yang corrupt atau inconsistent
- ✅ Backend dapat berfungsi normal dengan data yang sudah diperbaiki

## 🆘 Support

Jika mengalami masalah:
1. Cek log error dengan detail
2. Pastikan database connection berfungsi
3. Verifikasi struktur tabel `nilai_raport`
4. Cek apakah ada constraint atau trigger yang menghalangi update
5. Hubungi tim development untuk bantuan lebih lanjut 