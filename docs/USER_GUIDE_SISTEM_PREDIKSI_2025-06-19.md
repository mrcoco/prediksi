# User Guide: Sistem Prediksi Prestasi Siswa EduPro

## Daftar Isi
1. [Pengantar Sistem Prediksi](#pengantar-sistem-prediksi)
2. [Persiapan Data](#persiapan-data)
3. [Training Model](#training-model)
4. [Prediksi Individual](#prediksi-individual)
5. [Prediksi Batch (Massal)](#prediksi-batch-massal)
6. [Analisis Statistik](#analisis-statistik)
7. [Visualisasi Data](#visualisasi-data)
8. [Riwayat Prediksi](#riwayat-prediksi)
9. [FAQ & Troubleshooting](#faq--troubleshooting)

---

## Pengantar Sistem Prediksi

### Apa itu Sistem Prediksi Prestasi Siswa?
Sistem Prediksi Prestasi Siswa EduPro menggunakan algoritma **C4.5 Decision Tree** untuk memprediksi prestasi akademik siswa berdasarkan:
- **Nilai Raport** (Matematika, Bahasa Indonesia, Bahasa Inggris, IPA)
- **Penghasilan Orang Tua** (Ayah, Ibu, Total)
- **Kehadiran Siswa** (Persentase kehadiran)

### Hasil Prediksi
Sistem akan mengklasifikasikan prestasi siswa ke dalam 3 kategori:
- 🔴 **RENDAH** - Memerlukan perhatian khusus
- 🟡 **SEDANG** - Prestasi rata-rata
- 🟢 **TINGGI** - Prestasi sangat baik

---

## Persiapan Data

### Langkah 1: Pastikan Data Lengkap
Sebelum melakukan prediksi, pastikan data berikut telah diinput:

#### 1. Data Siswa
- Akses menu **"Data Siswa"**
- Pastikan semua siswa yang akan diprediksi sudah terdaftar
- Data yang diperlukan: Nama, NIS, Kelas, dll.

#### 2. Data Nilai Raport
- Akses menu **"Nilai Raport"**
- Input nilai untuk 4 mata pelajaran:
  - Matematika
  - Bahasa Indonesia
  - Bahasa Inggris
  - IPA
- Sistem akan otomatis menghitung rata-rata

#### 3. Data Penghasilan Orang Tua
- Akses menu **"Penghasilan Orang Tua"**
- Input penghasilan ayah dan ibu
- Sistem akan otomatis menghitung total dan kategori

#### 4. Data Presensi Kehadiran
- Akses menu **"Presensi Kehadiran"**
- Input jumlah: Hadir, Sakit, Izin, Alpa
- Sistem akan otomatis menghitung persentase kehadiran

### Verifikasi Data
✅ **Checklist Kelengkapan Data:**
- [ ] Data siswa lengkap
- [ ] Nilai raport 4 mata pelajaran
- [ ] Penghasilan orang tua
- [ ] Data presensi kehadiran
- [ ] Tidak ada data kosong atau null

---

## Training Model

### Langkah 1: Akses Halaman Prediksi
1. Login ke sistem EduPro
2. Klik menu **"Prediksi Prestasi"**
3. Pilih tab **"Training Model"**

### Langkah 2: Training Model
1. Klik tombol **"🔄 Train Model"**
2. Tunggu proses training (biasanya 5-15 detik)
3. Sistem akan menampilkan:
   - ✅ Status training berhasil
   - 📊 Akurasi model
   - 📈 Confusion Matrix
   - 🌳 Visualisasi pohon keputusan

### Interpretasi Hasil Training

#### Confusion Matrix
```
                Prediksi
Aktual    RENDAH  SEDANG  TINGGI
RENDAH      85      3       2
SEDANG       4     78       8
TINGGI       1      5      84
```

#### Metrik Evaluasi
- **Akurasi**: Persentase prediksi yang benar
- **Precision**: Ketepatan prediksi per kategori
- **Recall**: Kemampuan mendeteksi kategori
- **F1-Score**: Rata-rata harmonis precision dan recall

### Kapan Perlu Re-Training?
🔄 **Re-training diperlukan jika:**
- Ada penambahan data siswa baru (>10%)
- Perubahan signifikan pada pola nilai
- Akurasi model menurun (<80%)
- Setiap awal semester/tahun ajaran baru

---

## Prediksi Individual

### Langkah 1: Akses Form Prediksi
1. Di halaman **"Prediksi Prestasi"**
2. Pilih tab **"Prediksi Individual"**
3. Pastikan model sudah di-training

### Langkah 2: Input Data Prediksi
1. **Pilih Siswa**: Dropdown nama siswa
2. **Semester**: Pilih semester (1/2)
3. **Tahun Ajaran**: Input tahun ajaran (contoh: 2024/2025)
4. Klik **"🔮 Prediksi"**

### Langkah 3: Interpretasi Hasil
Sistem akan menampilkan:

#### Hasil Prediksi
```
🎯 HASIL PREDIKSI
Nama Siswa: Ahmad Rizki
Prediksi: TINGGI ✅
Confidence: 87.5%
```

#### Detail Analisis
- **Faktor Pendukung**: Nilai tinggi, kehadiran baik
- **Rekomendasi**: Pertahankan prestasi
- **Confidence Level**: Tingkat keyakinan sistem

### Tips Prediksi Individual
💡 **Best Practices:**
- Gunakan data terbaru untuk akurasi maksimal
- Confidence >80% = prediksi sangat reliable
- Confidence 60-80% = prediksi cukup reliable
- Confidence <60% = perlu verifikasi manual

---

## Prediksi Batch (Massal)

### Kapan Menggunakan Prediksi Batch?
- Evaluasi seluruh kelas/angkatan
- Laporan berkala ke kepala sekolah
- Identifikasi siswa berisiko
- Perencanaan program remedial

### Langkah 1: Akses Prediksi Batch
1. Di halaman **"Prediksi Prestasi"**
2. Scroll ke bagian **"Prediksi Data Keseluruhan Siswa"**

### Langkah 2: Setting Parameter
1. **Semester**: Pilih semester target
2. **Tahun Ajaran**: Input tahun ajaran
3. Klik **"🚀 Prediksi Batch"**

### Langkah 3: Analisis Hasil Batch

#### Summary Report
```
📊 RINGKASAN PREDIKSI BATCH
Total Siswa: 150
Berhasil Diprediksi: 145 (96.7%)
Error/Data Tidak Lengkap: 5 (3.3%)

Distribusi Prediksi:
🟢 TINGGI: 45 siswa (31.0%)
🟡 SEDANG: 78 siswa (53.8%)
🔴 RENDAH: 22 siswa (15.2%)
```

#### Grid Hasil Detail
Sistem menampilkan tabel dengan kolom:
- Nama Siswa
- Kelas
- Prediksi (dengan badge warna)
- Confidence (%)
- Nilai Rata-rata
- Kategori Penghasilan
- Kategori Kehadiran

### Langkah 4: Export Hasil
1. Klik **"📥 Export Excel"**
2. File akan didownload otomatis
3. Nama file: `Prediksi_Batch_[Semester]_[TahunAjaran].csv`

### Strategi Follow-up Batch
🎯 **Action Plan berdasarkan hasil:**

#### Siswa Prediksi RENDAH
- Program remedial intensif
- Konseling individual
- Monitoring kehadiran
- Komunikasi dengan orang tua

#### Siswa Prediksi SEDANG
- Program pengayaan
- Motivasi belajar
- Bimbingan belajar kelompok

#### Siswa Prediksi TINGGI
- Program akselerasi
- Kompetisi akademik
- Mentoring junior

---

## Analisis Statistik

### Akses Statistik Fitur
1. Di halaman **"Prediksi Prestasi"**
2. Klik tab **"Statistik Fitur"**

### Jenis Analisis Tersedia

#### 1. Statistik Numerik
Menampilkan analisis untuk:
- **Nilai Rata-rata**: Mean, median, std deviation
- **Penghasilan**: Distribusi pendapatan keluarga
- **Kehadiran**: Pola absensi siswa

#### 2. Statistik Kategorikal
Menampilkan distribusi:
- **Kategori Penghasilan**: Rendah/Sedang/Tinggi
- **Kategori Kehadiran**: Baik/Cukup/Kurang
- **Prediksi Prestasi**: Distribusi hasil prediksi

#### 3. Korelasi Fitur
Menunjukkan hubungan antar variabel:
- Korelasi nilai dengan prestasi
- Pengaruh penghasilan terhadap prestasi
- Dampak kehadiran pada hasil belajar

### Interpretasi Korelasi
```
Matriks Korelasi:
                    Nilai  Penghasilan  Kehadiran  Prestasi
Nilai                1.00        0.45       0.62      0.78
Penghasilan         0.45        1.00       0.23      0.41
Kehadiran           0.62        0.23       1.00      0.69
Prestasi            0.78        0.41       0.69      1.00
```

**Interpretasi:**
- 0.7-1.0: Korelasi kuat
- 0.3-0.7: Korelasi sedang
- 0.0-0.3: Korelasi lemah

---

## Visualisasi Data

### 1. Heatmap Korelasi
- **Akses**: Tab "Korelasi Fitur" → Toggle "Heatmap"
- **Fungsi**: Visualisasi hubungan antar variabel
- **Warna**: Biru (positif) → Merah (negatif)

### 2. Bar Chart Analisis
- **Akses**: Tab "Bar Chart Analisis"
- **Jenis Chart**:
  - Status Sosial Ekonomi
  - Penghasilan Orang Tua
  - Nilai Raport
- **Mode**: Count atau Percentage

### 3. Pohon Keputusan
- **Akses**: Tab "Visualisasi Model"
- **Fungsi**: Memahami logic pengambilan keputusan
- **Interaktif**: Klik gambar untuk memperbesar

### Tips Visualisasi
💡 **Cara Membaca Visualisasi:**
- Pohon keputusan menunjukkan aturan klasifikasi
- Bar chart menunjukkan distribusi data
- Heatmap menunjukkan kekuatan hubungan variabel

---

## Riwayat Prediksi

### Akses Riwayat
1. Klik menu **"Riwayat Prediksi"**
2. Sistem menampilkan semua prediksi yang pernah dilakukan

### Informasi dalam Riwayat
- **Nama Siswa**: Siswa yang diprediksi
- **Tanggal Prediksi**: Kapan prediksi dilakukan
- **Semester & Tahun Ajaran**: Periode prediksi
- **Hasil Prediksi**: RENDAH/SEDANG/TINGGI
- **Confidence**: Tingkat keyakinan (%)

### Fitur Riwayat

#### 1. Filter & Search
- Cari berdasarkan nama siswa
- Filter berdasarkan hasil prediksi
- Filter berdasarkan periode

#### 2. Export Riwayat
- Klik **"📥 Export Excel"**
- Download semua data riwayat
- Format: Excel (.xlsx)

#### 3. Hapus Riwayat
- Pilih data yang ingin dihapus
- Klik tombol **"🗑️ Hapus"**
- Konfirmasi penghapusan

### Analisis Riwayat
📈 **Gunakan riwayat untuk:**
- Tracking perkembangan siswa
- Evaluasi akurasi prediksi
- Laporan progress ke stakeholder
- Identifikasi tren prestasi

---

## FAQ & Troubleshooting

### Pertanyaan Umum

#### Q1: Model gagal training, apa penyebabnya?
**A:** Kemungkinan penyebab:
- Data tidak lengkap (kurang dari 30 siswa)
- Ada field kosong/null
- Format data tidak sesuai

**Solusi:**
1. Cek kelengkapan data di semua modul
2. Pastikan minimal 30 siswa dengan data lengkap
3. Hapus atau lengkapi data yang kosong

#### Q2: Confidence prediksi rendah (<60%), normal?
**A:** Confidence rendah bisa disebabkan:
- Data training terbatas
- Pola data tidak konsisten
- Siswa dengan karakteristik unik

**Solusi:**
1. Tambah data training
2. Verifikasi manual untuk confidence rendah
3. Re-training dengan data lebih banyak

#### Q3: Hasil prediksi tidak sesuai ekspektasi?
**A:** Kemungkinan:
- Model perlu re-training
- Data input tidak akurat
- Faktor eksternal tidak tertangkap sistem

**Solusi:**
1. Cek akurasi model saat training
2. Verifikasi data input
3. Gunakan sebagai referensi, bukan keputusan final

#### Q4: Prediksi batch gagal untuk beberapa siswa?
**A:** Siswa dengan data tidak lengkap akan di-skip otomatis.

**Solusi:**
1. Cek summary report untuk detail error
2. Lengkapi data siswa yang error
3. Ulangi prediksi batch

### Error Messages & Solusi

#### "Model belum di-training"
```
❌ Error: Model belum di-training
✅ Solusi: Klik "Train Model" terlebih dahulu
```

#### "Data tidak lengkap"
```
❌ Error: Data siswa tidak lengkap
✅ Solusi: Lengkapi data nilai, penghasilan, dan presensi
```

#### "Token expired"
```
❌ Error: Session expired
✅ Solusi: Refresh halaman dan login ulang
```

### Tips Optimisasi

#### 1. Performa System
- Training ulang maksimal 1x per hari
- Batch prediksi maksimal 200 siswa
- Tutup tab lain saat training

#### 2. Akurasi Prediksi
- Update data secara berkala
- Hapus data outlier/anomali
- Training ulang setiap semester

#### 3. Best Practices
- Backup data sebelum training
- Dokumentasikan hasil prediksi
- Validasi hasil dengan guru

---

## Kontak Support

Jika mengalami kendala teknis:
- 📧 **Email**: support@edupro.com
- 📱 **WhatsApp**: +62-xxx-xxxx-xxxx
- 🕐 **Jam Kerja**: Senin-Jumat, 08:00-17:00 WIB

---

**© 2025 EduPro - Sistem Prediksi Prestasi Siswa**
*User Guide Version 1.0 - Juni 2025* 