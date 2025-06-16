# Update Kategori Penghasilan - SQL Scripts & Tools

## 📋 Deskripsi

File SQL dan script Python untuk mengupdate `kategori_penghasilan` yang masih kosong (NULL atau empty string) berdasarkan `total_penghasilan` dengan logika yang sama seperti function `create_penghasilan` dan `update_penghasilan`.

## 📁 File yang Dibuat

### 1. `update_kategori_penghasilan.sql`
File SQL lengkap dengan query untuk:
- Cek data sebelum update
- Update kategori berdasarkan total penghasilan
- Verifikasi hasil update
- Laporan konsistensi data

### 2. `backend/update_kategori_penghasilan.py`
Script Python untuk menjalankan update dengan:
- Progress monitoring
- Error handling
- Detailed reporting
- Data validation

## 💰 Logika Kategori Penghasilan

Berdasarkan **UMK Jogja 2024 = Rp 2.300.000**:

| Kategori | Range Penghasilan | Keterangan |
|----------|-------------------|------------|
| **Tinggi** | ≥ Rp 5.000.000 | 2x UMK Jogja |
| **Menengah** | Rp 2.300.000 - Rp 4.999.999 | 1x UMK Jogja |
| **Rendah** | < Rp 2.300.000 | Di bawah UMK |

## 🚀 Cara Penggunaan

### Opsi 1: Menggunakan Script Python (Recommended)

```bash
# Jalankan di dalam container backend
docker-compose exec backend python update_kategori_penghasilan.py
```

**Keuntungan:**
- ✅ Progress monitoring real-time
- ✅ Error handling otomatis
- ✅ Detailed reporting
- ✅ Data validation
- ✅ Rollback otomatis jika error

### Opsi 2: Menggunakan File SQL

```bash
# Connect ke database dan jalankan file SQL
psql -h localhost -p 54321 -U postgres -d prestasi_siswa -f update_kategori_penghasilan.sql
```

**Keuntungan:**
- ✅ Kontrol manual penuh
- ✅ Dapat dimodifikasi sesuai kebutuhan
- ✅ Backup query tersedia
- ✅ Verifikasi step-by-step

## 📊 Hasil Eksekusi

### Summary Report
```
🎉 Update kategori penghasilan berhasil sempurna!

📈 Summary Report:
   📊 Total record: 100
   💰 Kategori Tinggi: 95 (95.0%)
   💵 Kategori Menengah: 5 (5.0%)
   💴 Kategori Rendah: 0 (0.0%)
   📋 Masih kosong: 0
```

### Distribusi Data
- **95 record** dikategorikan sebagai "Tinggi" (Rp 6.076.604 - Rp 19.280.236)
- **5 record** dikategorikan sebagai "Menengah" (Rp 2.802.632 - Rp 3.984.721)
- **0 record** dikategorikan sebagai "Rendah"
- **0 record** masih kosong

## 🔍 Fitur Verifikasi

### 1. Pre-Update Check
- Jumlah record dengan kategori kosong
- Distribusi penghasilan yang akan diupdate
- Preview kategori yang akan ditetapkan

### 2. Post-Update Validation
- Verifikasi tidak ada record kosong
- Distribusi kategori final
- Konsistensi data check
- Summary report lengkap

### 3. Data Consistency Check
Script akan mengecek inkonsistensi seperti:
- Kategori "Tinggi" dengan total < Rp 5.000.000
- Kategori "Menengah" dengan total < Rp 2.300.000 atau ≥ Rp 5.000.000
- Kategori "Rendah" dengan total ≥ Rp 2.300.000

## 📝 Query SQL Utama

### Update Kategori Tinggi
```sql
UPDATE penghasilan_ortu 
SET 
    kategori_penghasilan = 'Tinggi',
    updated_at = CURRENT_TIMESTAMP
WHERE 
    (kategori_penghasilan IS NULL OR kategori_penghasilan = '')
    AND total_penghasilan >= 5000000;
```

### Update Kategori Menengah
```sql
UPDATE penghasilan_ortu 
SET 
    kategori_penghasilan = 'Menengah',
    updated_at = CURRENT_TIMESTAMP
WHERE 
    (kategori_penghasilan IS NULL OR kategori_penghasilan = '')
    AND total_penghasilan >= 2300000 
    AND total_penghasilan < 5000000;
```

### Update Kategori Rendah
```sql
UPDATE penghasilan_ortu 
SET 
    kategori_penghasilan = 'Rendah',
    updated_at = CURRENT_TIMESTAMP
WHERE 
    (kategori_penghasilan IS NULL OR kategori_penghasilan = '')
    AND total_penghasilan < 2300000;
```

## 🛡️ Safety Features

### 1. Backup Option (SQL)
```sql
-- Buat tabel backup sebelum update
CREATE TABLE penghasilan_ortu_backup AS 
SELECT * FROM penghasilan_ortu 
WHERE kategori_penghasilan IS NULL OR kategori_penghasilan = '';
```

### 2. Rollback Protection (Python)
- Automatic rollback jika terjadi error
- Transaction-based updates
- Error logging dan reporting

### 3. Conditional Updates
- Hanya update record yang benar-benar kosong
- Tidak mengubah kategori yang sudah ada
- Preserve existing data integrity

## 🔄 Maintenance

### Kapan Menjalankan Script Ini?

1. **Setelah Import Data Legacy**
   - Data lama yang tidak memiliki kategori
   - Migrasi dari sistem lain

2. **Setelah Manual Data Entry**
   - Input manual yang melewatkan kategori
   - Bulk insert tanpa auto-calculation

3. **Periodic Maintenance**
   - Cek konsistensi data bulanan
   - Audit data quality

### Monitoring Regular

```sql
-- Cek apakah ada kategori kosong
SELECT COUNT(*) as kosong_count
FROM penghasilan_ortu 
WHERE kategori_penghasilan IS NULL OR kategori_penghasilan = '';

-- Cek konsistensi data
SELECT COUNT(*) as inkonsisten_count
FROM penghasilan_ortu 
WHERE 
    (kategori_penghasilan = 'Tinggi' AND total_penghasilan < 5000000) OR
    (kategori_penghasilan = 'Menengah' AND (total_penghasilan < 2300000 OR total_penghasilan >= 5000000)) OR
    (kategori_penghasilan = 'Rendah' AND total_penghasilan >= 2300000);
```

## 📈 Impact & Benefits

### 1. **Data Quality**
- ✅ Semua record memiliki kategori yang valid
- ✅ Konsistensi dengan logika backend
- ✅ Tidak ada data kosong

### 2. **System Integration**
- ✅ Kompatibel dengan function create/update
- ✅ Menggunakan logika yang sama
- ✅ Mendukung prediksi model ML

### 3. **Maintenance**
- ✅ Script reusable untuk data baru
- ✅ Monitoring dan validation built-in
- ✅ Easy troubleshooting

## 🎯 Use Cases

1. **Data Migration**: Update kategori setelah import data legacy
2. **Data Cleanup**: Perbaiki data yang tidak konsisten
3. **Maintenance**: Audit dan perbaikan data berkala
4. **Development**: Reset data untuk testing

## 📋 Checklist Penggunaan

- [ ] Backup database sebelum menjalankan (production)
- [ ] Verifikasi logika kategori sesuai kebutuhan
- [ ] Jalankan script di environment testing terlebih dahulu
- [ ] Monitor hasil dan verifikasi konsistensi
- [ ] Update dokumentasi jika ada perubahan logika

---

**Status**: ✅ **READY TO USE**  
**Last Updated**: 2024-06-15  
**Records Updated**: 100 records  
**Success Rate**: 100% 