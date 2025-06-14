# 📚 Dokumentasi Sistem Prediksi Prestasi Siswa

Selamat datang di direktori dokumentasi untuk Sistem Prediksi Prestasi Siswa. Di sini Anda akan menemukan semua dokumentasi teknis dan panduan penggunaan untuk sistem ini.

## 📋 Daftar Dokumentasi

### 🎯 Fitur & Implementasi
- **[Sidebar Collapse](DOKUMENTASI_SIDEBAR_COLLAPSE.md)** - Dokumentasi lengkap fitur sidebar collapse dengan responsive design dan auto-sizing main content

## 🚀 Fitur Utama Sistem

### 1. **Prediksi Prestasi Siswa**
- Menggunakan algoritma C4.5 Decision Tree
- Prediksi berdasarkan data nilai, presensi, dan penghasilan orang tua
- Visualisasi hasil prediksi dengan confidence level

### 2. **Manajemen Data**
- **Data Siswa**: CRUD operations untuk data siswa
- **Data Nilai**: Manajemen nilai raport siswa
- **Data Presensi**: Tracking kehadiran siswa
- **Data Penghasilan**: Informasi ekonomi orang tua
- **Manajemen User**: Admin user management

### 3. **Interface & UX**
- **Responsive Design**: Optimal untuk desktop dan mobile
- **Sidebar Collapse**: Fitur collapse/expand sidebar untuk lebih banyak ruang konten
- **Dashboard**: Overview statistik dan visualisasi data
- **Real-time Updates**: AJAX-based interactions

## 🛠️ Teknologi yang Digunakan

### Frontend
- **HTML5** - Struktur halaman
- **CSS3** - Styling dan responsive design
- **JavaScript/jQuery** - Interaktivitas dan AJAX
- **Bootstrap 4** - UI framework
- **Kendo UI** - Advanced UI components
- **Font Awesome** - Icons

### Backend (Tidak termasuk dalam dokumentasi ini)
- Python/Django atau FastAPI
- Machine Learning dengan scikit-learn
- Database (PostgreSQL/MySQL)

## 📖 Cara Menggunakan Dokumentasi

1. **Untuk Developer**: Baca dokumentasi teknis untuk memahami implementasi fitur
2. **Untuk User**: Lihat panduan penggunaan untuk setiap fitur
3. **Untuk Maintenance**: Gunakan testing checklist dan troubleshooting guide

## 🔧 Struktur Project

```
prestasi-siswa/
├── docs/                           # 📚 Dokumentasi
│   ├── README.md                   # Overview dokumentasi
│   └── DOKUMENTASI_SIDEBAR_COLLAPSE.md  # Dokumentasi sidebar collapse
├── frontend/                       # 🎨 Frontend files
│   ├── index.html                  # Main application
│   ├── login.html                  # Login page
│   ├── app.js                      # Main JavaScript
│   ├── styles/
│   │   └── custom.css              # Custom styling
│   └── js/
│       └── app.js                  # Additional JavaScript
└── backend/                        # 🔧 Backend files (jika ada)
```

## 📝 Kontribusi

Jika Anda ingin menambahkan atau memperbarui dokumentasi:

1. Buat file dokumentasi baru di directory `docs/`
2. Gunakan format Markdown (.md)
3. Update file README.md ini untuk menambahkan link ke dokumentasi baru
4. Pastikan dokumentasi mengikuti struktur yang konsisten

## 📞 Kontak

Untuk pertanyaan atau saran terkait dokumentasi, silakan hubungi tim development.

---

**Terakhir diperbarui**: 2024  
**Status**: ✅ Active Development  
**Version**: 1.3.0 