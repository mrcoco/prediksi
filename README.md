# 🎓 Sistem Prediksi Prestasi Siswa

Sistem prediksi prestasi siswa menggunakan algoritma C4.5 Decision Tree untuk memprediksi performa akademik siswa berdasarkan berbagai faktor seperti nilai raport, presensi, dan kondisi ekonomi orang tua.

## 🚀 Fitur Utama

- **🔮 Prediksi Prestasi**: Algoritma C4.5 untuk prediksi performa siswa
- **📊 Dashboard**: Visualisasi data dan statistik prestasi
- **👥 Manajemen Data**: CRUD untuk siswa, nilai, presensi, dan penghasilan
- **📱 Responsive Design**: Interface yang optimal untuk desktop dan mobile
- **🎛️ Sidebar Collapse**: Fitur collapse/expand sidebar untuk UX yang lebih baik
- **👤 User Management**: Sistem autentikasi dan manajemen user

## 🛠️ Teknologi

### Frontend
- HTML5, CSS3, JavaScript/jQuery
- Bootstrap 4 untuk responsive design
- Kendo UI untuk komponen advanced
- Font Awesome untuk icons

### Backend
- Python dengan FastAPI/Django
- Machine Learning dengan scikit-learn
- Database PostgreSQL/MySQL

## 📚 Dokumentasi

Dokumentasi lengkap tersedia di directory [`docs/`](docs/) dengan struktur yang terorganisir:

- **[📖 docs/README.md](docs/README.md)** - Index dokumentasi lengkap dengan navigasi berdasarkan topik dan role
- **[📋 CHANGELOG.md](CHANGELOG.md)** - Riwayat perubahan aplikasi

### 🚀 Quick Links:
- **🌍 Setup**: [Environment Setup Guide](docs/environment/ENVIRONMENT-SETUP.md)
- **🐳 Docker**: [Docker Configuration](docs/docker/README.md)
- **🎨 Frontend**: [Frontend Documentation](docs/frontend/README.md)
- **🔧 Helper Script**: [setup-env.sh](setup-env.sh) - Interactive environment setup

### 📁 Dokumentasi Berdasarkan Kategori:
- **Docker & Deployment**: `docs/docker/`
- **Environment & Configuration**: `docs/environment/`
- **Frontend**: `docs/frontend/`
- **Backend & API**: `docs/` (root level)
- **Features & Enhancements**: `docs/` (root level)

## 🚀 Quick Start

### Prerequisites
- Web browser modern (Chrome, Firefox, Safari, Edge)
- Web server (untuk development bisa menggunakan Live Server)

### Menjalankan Aplikasi

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd prestasi-siswa
   ```

2. **Buka aplikasi**
   - Buka `frontend/index.html` di web browser
   - Atau gunakan web server lokal untuk development

3. **Login**
   - Gunakan kredensial yang telah dikonfigurasi
   - Atau implementasikan sistem autentikasi sesuai kebutuhan

## 📁 Struktur Project

```
prestasi-siswa/
├── docs/                           # 📚 Dokumentasi
│   ├── README.md                   # Overview dokumentasi
│   └── DOKUMENTASI_SIDEBAR_COLLAPSE.md
├── frontend/                       # 🎨 Frontend
│   ├── index.html                  # Aplikasi utama
│   ├── login.html                  # Halaman login
│   ├── app.js                      # JavaScript utama
│   ├── styles/
│   │   └── custom.css              # Custom styling
│   └── js/
│       └── app.js                  # JavaScript tambahan
├── backend/                        # 🔧 Backend (jika ada)
└── README.md                       # File ini
```

## 🎯 Fitur Terbaru

### ✅ Sidebar Collapse v1.3.0
- **Perfect Sizing**: Main content mengikuti ukuran sidebar dengan akurat
- **Responsive Design**: Optimal untuk desktop dan mobile
- **State Persistence**: Preferensi user tersimpan di localStorage
- **Smooth Animations**: Transisi yang halus dan modern
- **Auto-Correction**: Monitoring real-time untuk sizing yang konsisten

## 🔧 Development

### Menambah Fitur Baru
1. Buat branch baru untuk fitur
2. Implementasikan fitur di frontend/backend
3. Buat dokumentasi di `docs/`
4. Test di berbagai browser dan device
5. Update README.md jika diperlukan

### Testing
- Test di Chrome, Firefox, Safari, Edge
- Test responsive design di berbagai ukuran layar
- Test functionality di desktop dan mobile
- Gunakan debug mode dengan `?debug=1` untuk development

## 📊 Status Development

- ✅ **Frontend**: Complete dengan responsive design
- ✅ **Sidebar Collapse**: Perfect implementation v1.3.0
- ✅ **UI/UX**: Modern dan user-friendly
- 🔄 **Backend Integration**: In progress
- 🔄 **Machine Learning**: Model training dan deployment
- 📋 **Testing**: Comprehensive testing suite

## 🤝 Kontribusi

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Kontak

Tim Development - [contact@example.com](mailto:contact@example.com)

Project Link: [https://github.com/username/prestasi-siswa](https://github.com/username/prestasi-siswa)

---

**Version**: 1.3.0  
**Last Updated**: 2024  
**Status**: ✅ Active Development
