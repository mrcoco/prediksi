# Update Persentase dan Kategori Kehadiran

## 📋 Deskripsi
Script dan query SQL untuk mengupdate `persentase_kehadiran` dan `kategori_kehadiran` yang kosong atau tidak konsisten pada tabel `presensi`. Menggunakan logika yang sama dengan function `create_presensi` dan `update_presensi` di backend.

## 🎯 Tujuan
- Mengupdate field `persentase_kehadiran` yang NULL atau 0
- Mengupdate field `kategori_kehadiran` yang NULL atau kosong
- Memperbaiki data yang tidak konsisten antara persentase dan kategori
- Memastikan semua data presensi memiliki perhitungan yang akurat

## 📊 Logika Perhitungan

### Persentase Kehadiran
```
persentase_kehadiran = (jumlah_hadir / total_hari) * 100
total_hari = jumlah_hadir + jumlah_sakit + jumlah_izin + jumlah_alpa
```

### Kategori Kehadiran
- **Tinggi**: >= 80%
- **Sedang**: 75% - 79%
- **Rendah**: < 75%

### Kasus Khusus
- Jika `total_hari = 0`, maka `persentase_kehadiran = 0` dan `kategori_kehadiran = 'Rendah'`

## 📁 File yang Tersedia

### 1. `update_persentase_kehadiran.sql`
Query SQL lengkap dengan:
- ✅ Pengecekan data sebelum update
- ✅ Update query dengan logika PostgreSQL
- ✅ Verifikasi hasil setelah update
- ✅ Laporan statistik detail
- ✅ Opsi backup data

### 2. `backend/update_persentase_kehadiran.py`
Script Python dengan fitur:
- ✅ Progress monitoring real-time
- ✅ Error handling yang robust
- ✅ Validasi data sebelum dan sesudah update
- ✅ Laporan detail dan statistik
- ✅ Rollback otomatis jika error

## 🚀 Cara Penggunaan

### Opsi 1: Menggunakan Script Python (Recommended)
```bash
# Jalankan melalui Docker
docker-compose exec backend python update_persentase_kehadiran.py

# Atau jalankan langsung di server
cd backend
python update_persentase_kehadiran.py
```

### Opsi 2: Menggunakan Query SQL
```bash
# Melalui psql
psql -h localhost -U postgres -d prestasi_siswa -f update_persentase_kehadiran.sql

# Atau melalui Docker
docker-compose exec db psql -U postgres -d prestasi_siswa -f /path/to/update_persentase_kehadiran.sql
```

## 📊 Hasil Eksekusi Terakhir

### Status Update
- ✅ **Total record diupdate**: 100
- ✅ **Record dengan persentase kosong**: 0 (setelah update)
- ✅ **Record dengan kategori kosong**: 0 (setelah update)
- ✅ **Data inkonsisten**: 0 (setelah update)

### Distribusi Kategori Final
| Kategori | Jumlah | Persentase | Range Persentase | Rata-rata |
|----------|--------|------------|------------------|-----------|
| **Tinggi** | 96 record | 96.0% | 80.0% - 100.0% | 95.5% |
| **Sedang** | 3 record | 3.0% | 75.3% - 79.6% | 77.7% |
| **Rendah** | 1 record | 1.0% | 71.3% - 71.3% | 71.3% |

### Statistik Persentase Kehadiran
- 📈 **Rata-rata**: 94.7%
- 📊 **Tertinggi**: 100.0%
- 📉 **Terendah**: 71.3%

## 🔍 Fitur Validasi

### Pre-Update Checks
- Menghitung jumlah record dengan persentase kosong
- Menghitung jumlah record dengan kategori kosong
- Mengidentifikasi data yang tidak konsisten
- Menampilkan distribusi kategori yang akan diupdate

### Post-Update Verification
- Memverifikasi tidak ada data kosong tersisa
- Mengecek konsistensi antara persentase dan kategori
- Menampilkan distribusi final
- Memberikan statistik detail

### Consistency Checks
Script akan mengidentifikasi dan memperbaiki:
- Kategori 'Tinggi' dengan persentase < 80%
- Kategori 'Sedang' dengan persentase < 75% atau >= 80%
- Kategori 'Rendah' dengan persentase >= 75%

## ⚠️ Keamanan Data

### Backup (Opsional)
Uncomment bagian backup di file SQL untuk membuat backup:
```sql
-- Buat tabel backup
CREATE TABLE presensi_backup AS 
SELECT * FROM presensi 
WHERE persentase_kehadiran IS NULL OR persentase_kehadiran = 0 
   OR kategori_kehadiran IS NULL OR kategori_kehadiran = '';
```

### Rollback
Jika diperlukan rollback:
```sql
UPDATE presensi 
SET persentase_kehadiran = backup.persentase_kehadiran,
    kategori_kehadiran = backup.kategori_kehadiran
FROM presensi_backup backup
WHERE presensi.id = backup.id;
```

## 🔧 Troubleshooting

### Error: function round(double precision, integer) does not exist
**Solusi**: Gunakan `ROUND(CAST(value AS numeric), 2)` untuk PostgreSQL

### Error: IndentationError
**Solusi**: Pastikan indentasi Python konsisten (4 spaces)

### Error: Connection refused
**Solusi**: Pastikan database service berjalan
```bash
docker-compose up -d db
```

## 📈 Monitoring

### Log Output
Script Python memberikan output detail:
- 🚀 Status mulai
- 📊 Analisis data sebelum update
- 🔧 Progress update
- 🔍 Verifikasi hasil
- 📈 Summary report
- 📊 Statistik detail

### Success Indicators
- ✅ "Update persentase kehadiran berhasil sempurna!"
- ✅ Record kosong = 0
- ✅ Data inkonsisten = 0

## 🔄 Integrasi dengan Backend

### Auto-Calculation
Setelah update ini, function `create_presensi` dan `update_presensi` akan otomatis menghitung:
- `persentase_kehadiran` berdasarkan data kehadiran
- `kategori_kehadiran` berdasarkan persentase
- `total_hari` untuk validasi

### Schema Consistency
Update ini memastikan konsistensi dengan:
- `PresensiCreate` schema (tidak perlu input manual persentase/kategori)
- `PresensiResponse` schema (selalu ada nilai persentase/kategori)
- Business logic di backend

## 📝 Catatan Penting

1. **Backup Data**: Selalu backup data sebelum menjalankan update massal
2. **Test Environment**: Test script di development environment terlebih dahulu
3. **Monitoring**: Monitor log output untuk memastikan tidak ada error
4. **Validation**: Selalu validasi hasil setelah update
5. **Documentation**: Update dokumentasi jika ada perubahan logika

## 🎉 Kesimpulan

Update berhasil dilakukan dengan sempurna:
- ✅ 100 record berhasil diupdate
- ✅ Semua data konsisten
- ✅ Tidak ada data kosong
- ✅ Distribusi kategori realistis (96% Tinggi, 3% Sedang, 1% Rendah)
- ✅ Rata-rata persentase kehadiran tinggi (94.7%)

Script ini dapat dijalankan ulang kapan saja untuk memastikan konsistensi data presensi. 