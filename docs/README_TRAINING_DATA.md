# Training Data untuk Model Prediksi Prestasi Siswa

## Deskripsi
File `training_data.sql` berisi 100 data siswa yang telah dirancang khusus untuk melatih model prediksi prestasi dengan distribusi yang optimal:

- **75% Prestasi Tinggi** (75 siswa) - ID 1-75
- **20% Prestasi Sedang** (20 siswa) - ID 76-95  
- **5% Prestasi Rendah** (5 siswa) - ID 96-100

## Struktur Data

### 1. Data Siswa (100 record)
```sql
INSERT INTO siswa (nama, nis, jenis_kelamin, kelas, tanggal_lahir, alamat)
```
- Nama siswa dengan variasi gender
- NIS format: 2023001 - 2023100
- Kelas: XII IPA 1/2/3, XII IPS 1/2
- Tanggal lahir: tahun 2005
- Alamat: berbagai jalan di kota

### 2. Nilai Raport (100 record)
```sql
INSERT INTO nilai_raport (siswa_id, semester, tahun_ajaran, matematika, bahasa_indonesia, bahasa_inggris, ipa, bahasa_jawa, pkn, seni, sejarah, agama, pjok, dasar_kejuruan)
```

**Distribusi Nilai:**
- **Prestasi Tinggi (ID 1-75)**: Nilai 80-100 (rata-rata 85-95)
- **Prestasi Sedang (ID 76-95)**: Nilai 65-85 (rata-rata 70-80)
- **Prestasi Rendah (ID 96-100)**: Nilai 50-75 (rata-rata 55-70)

### 3. Data Presensi (100 record)
```sql
INSERT INTO presensi (siswa_id, semester, tahun_ajaran, jumlah_hadir, jumlah_sakit, jumlah_izin, jumlah_alpa)
```

**Distribusi Kehadiran:**
- **Prestasi Tinggi**: 90-98% kehadiran (hadir: 90-98, alpa: 0-1)
- **Prestasi Sedang**: 75-89% kehadiran (hadir: 75-89, alpa: 1-3)
- **Prestasi Rendah**: 60-74% kehadiran (hadir: 60-74, alpa: 5-12)

### 4. Data Penghasilan Orang Tua (100 record)
```sql
INSERT INTO penghasilan_ortu (siswa_id, penghasilan_ayah, penghasilan_ibu, pekerjaan_ayah, pekerjaan_ibu, pendidikan_ayah, pendidikan_ibu)
```

**Distribusi Sosial Ekonomi:**

**Prestasi Tinggi:**
- Penghasilan Ayah: Rp 6.000.000 - Rp 12.000.000
- Penghasilan Ibu: Rp 4.000.000 - Rp 8.000.000
- Pekerjaan: Dokter, Insinyur, Manager, Pengacara, PNS Golongan III, Dosen, Direktur, Konsultan
- Pendidikan: S1, S2, S3, D4

**Prestasi Sedang:**
- Penghasilan Ayah: Rp 3.000.000 - Rp 6.000.000
- Penghasilan Ibu: Rp 2.000.000 - Rp 4.000.000
- Pekerjaan: Karyawan Swasta, Teknisi, Guru, Perawat, Polisi, TNI, Wiraswasta, Pedagang
- Pendidikan: D3, SMA, SMK

**Prestasi Rendah:**
- Penghasilan Ayah: Rp 1.500.000 - Rp 3.000.000
- Penghasilan Ibu: Rp 800.000 - Rp 2.000.000
- Pekerjaan: Buruh, Petani, Tukang, Supir, Kuli, Pedagang Kecil, Ojek, Pembantu
- Pendidikan: SMP, SD

## Cara Penggunaan

### 1. Persiapan Database
Pastikan tabel-tabel berikut sudah ada di database:
- `siswa`
- `nilai_raport`
- `presensi`
- `penghasilan_ortu`

### 2. Eksekusi SQL
```bash
# Jika menggunakan PostgreSQL
psql -d nama_database -f training_data.sql

# Jika menggunakan MySQL
mysql -u username -p nama_database < training_data.sql
```

### 3. Verifikasi Data
Setelah eksekusi, jalankan query verifikasi:
```sql
-- Cek total data
SELECT COUNT(*) as total_siswa FROM siswa;
SELECT COUNT(*) as total_nilai FROM nilai_raport;
SELECT COUNT(*) as total_presensi FROM presensi;
SELECT COUNT(*) as total_penghasilan FROM penghasilan_ortu;

-- Cek distribusi berdasarkan rata-rata nilai
SELECT 
    CASE 
        WHEN (matematika + bahasa_indonesia + bahasa_inggris + ipa + bahasa_jawa + pkn + seni + sejarah + agama + pjok + dasar_kejuruan) / 11.0 >= 85 THEN 'Tinggi'
        WHEN (matematika + bahasa_indonesia + bahasa_inggris + ipa + bahasa_jawa + pkn + seni + sejarah + agama + pjok + dasar_kejuruan) / 11.0 >= 70 THEN 'Sedang'
        ELSE 'Rendah'
    END as kategori_prestasi,
    COUNT(*) as jumlah,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM nilai_raport), 2) as persentase
FROM nilai_raport
GROUP BY 
    CASE 
        WHEN (matematika + bahasa_indonesia + bahasa_inggris + ipa + bahasa_jawa + pkn + seni + sejarah + agama + pjok + dasar_kejuruan) / 11.0 >= 85 THEN 'Tinggi'
        WHEN (matematika + bahasa_indonesia + bahasa_inggris + ipa + bahasa_jawa + pkn + seni + sejarah + agama + pjok + dasar_kejuruan) / 11.0 >= 70 THEN 'Sedang'
        ELSE 'Rendah'
    END
ORDER BY 
    CASE 
        WHEN (matematika + bahasa_indonesia + bahasa_inggris + ipa + bahasa_jawa + pkn + seni + sejarah + agama + pjok + dasar_kejuruan) / 11.0 >= 85 THEN 1
        WHEN (matematika + bahasa_indonesia + bahasa_inggris + ipa + bahasa_jawa + pkn + seni + sejarah + agama + pjok + dasar_kejuruan) / 11.0 >= 70 THEN 2
        ELSE 3
    END;
```

## Karakteristik Data Training

### Korelasi yang Dirancang
1. **Nilai Tinggi ↔ Kehadiran Tinggi ↔ Penghasilan Tinggi**
2. **Nilai Sedang ↔ Kehadiran Sedang ↔ Penghasilan Sedang**
3. **Nilai Rendah ↔ Kehadiran Rendah ↔ Penghasilan Rendah**

### Variasi dalam Data
- **Gender**: Campuran laki-laki dan perempuan
- **Kelas**: Distribusi merata antara IPA dan IPS
- **Mata Pelajaran**: Variasi nilai antar mata pelajaran
- **Pekerjaan**: Beragam profesi sesuai strata sosial
- **Pendidikan**: Tingkat pendidikan orang tua bervariasi

## Penggunaan untuk Machine Learning

### 1. Feature Engineering
```python
# Contoh feature yang bisa diekstrak:
- rata_rata_nilai = (mat + bind + bing + ipa + bjawa + pkn + seni + sejarah + agama + pjok + kejuruan) / 11
- persentase_kehadiran = (jumlah_hadir / (jumlah_hadir + jumlah_sakit + jumlah_izin + jumlah_alpa)) * 100
- total_penghasilan = penghasilan_ayah + penghasilan_ibu
- kategori_penghasilan = 'Tinggi' if total_penghasilan > 10000000 else 'Sedang' if total_penghasilan > 5000000 else 'Rendah'
```

### 2. Target Variable
```python
# Label prestasi berdasarkan rata-rata nilai:
- Tinggi: rata_rata_nilai >= 85
- Sedang: 70 <= rata_rata_nilai < 85  
- Rendah: rata_rata_nilai < 70
```

### 3. Model Training
Data ini cocok untuk algoritma:
- **Decision Tree C4.5** (sesuai sistem)
- Random Forest
- Gradient Boosting
- Neural Networks
- SVM

## Catatan Penting

1. **Data Sintetis**: Data ini dibuat secara artificial untuk keperluan training
2. **Distribusi Seimbang**: Dirancang untuk menghindari class imbalance yang ekstrem
3. **Korelasi Realistis**: Mengikuti pola hubungan yang logis dalam dunia nyata
4. **Variasi Cukup**: Memiliki variasi yang cukup untuk generalisasi model

## Maintenance

Untuk memperbarui atau menambah data:
1. Edit file `generate_training_data.py`
2. Jalankan ulang script: `python3 generate_training_data.py > training_data.sql`
3. Eksekusi SQL yang baru

## Troubleshooting

### Error: Duplicate Key
Jika terjadi error duplicate key, hapus data existing terlebih dahulu:
```sql
DELETE FROM penghasilan_ortu WHERE siswa_id BETWEEN 1 AND 100;
DELETE FROM presensi WHERE siswa_id BETWEEN 1 AND 100;
DELETE FROM nilai_raport WHERE siswa_id BETWEEN 1 AND 100;
DELETE FROM siswa WHERE id BETWEEN 1 AND 100;
```

### Error: Foreign Key Constraint
Pastikan urutan insert sesuai dependency:
1. siswa (parent table)
2. nilai_raport, presensi, penghasilan_ortu (child tables)

---

**Generated by**: Training Data Generator Script  
**Date**: 2024  
**Purpose**: Machine Learning Model Training untuk Sistem Prediksi Prestasi Siswa 