# 🎓 Sistem Prediksi Prestasi Siswa

Sistem prediksi prestasi siswa menggunakan algoritma C4.5 Decision Tree untuk memprediksi performa akademik siswa berdasarkan berbagai faktor seperti nilai raport, presensi, dan kondisi ekonomi orang tua.

## 🚀 Fitur Utama

- **🔮 Prediksi Prestasi**: Algoritma C4.5 untuk prediksi performa siswa
- **📊 Dashboard**: Visualisasi data dan statistik prestasi
- **👥 Manajemen Data**: CRUD untuk siswa, nilai, presensi, dan penghasilan
- **📱 Responsive Design**: Interface yang optimal untuk desktop dan mobile
- **🎛️ Sidebar Collapse**: Fitur collapse/expand sidebar untuk UX yang lebih baik
- **👤 User Management**: Sistem autentikasi dan manajemen user
- **🔄 Token Management**: Auto-refresh token dan monitoring session
- **📈 Advanced Analytics**: Visualisasi interaktif dengan D3.js
- **📋 Batch Processing**: Prediksi massal untuk seluruh siswa
- **📤 Export Features**: Export data ke Excel untuk semua modul

## ✨ Fitur Terbaru (Juni 2025)

### 🔐 **Token Management System**
- **Auto Refresh Token**: Perpanjangan session otomatis sebelum expired
- **Token Expiry Checker**: Monitoring real-time status token dengan 5-level indicator
- **Session Information**: Modal informasi lengkap token dan profile user
- **Smart Notifications**: Peringatan bertingkat sebelum session timeout
- **Profile Integration**: Tampilan informasi user lengkap dalam token dialog

### 📊 **Advanced Data Visualization**
- **Bar Chart Analysis**: Visualisasi interaktif untuk Penghasilan Orang Tua, Kehadiran Siswa, dan Nilai Raport
- **Correlation Heatmap**: Heatmap korelasi antar fitur dengan D3.js
- **Feature Statistics**: Analisis statistik mendalam untuk decision making
- **Interactive Charts**: Hover tooltips, animations, dan multiple color schemes
- **Dashboard Integration**: Bar chart terintegrasi di dashboard utama

### 🔄 **Batch Processing**
- **Mass Prediction**: Prediksi prestasi untuk seluruh siswa sekaligus
- **Smart Processing**: Isolasi error untuk data tidak lengkap
- **Progress Tracking**: Summary dengan success rate dan error count
- **Results Display**: Grid hasil dengan export capability

### 📤 **Enhanced Export System**
- **Excel Export**: Export ke Excel untuk semua modul (Siswa, Nilai, Presensi, Penghasilan, Riwayat Prediksi)
- **Professional Formatting**: File Excel dengan formatting yang rapi
- **Complete Data**: Export data lengkap dengan JOIN query
- **One-Click Export**: Export mudah dengan satu klik

### 🎨 **UI/UX Improvements**
- **Grid Layout Consistency**: Perfect alignment untuk semua grid utama
- **Professional Modal**: Image modal untuk visualisasi pohon keputusan
- **Enhanced Delete Confirmation**: Konfirmasi hapus dengan informasi lengkap
- **Responsive Design**: Optimized untuk desktop dan mobile
- **Error Handling**: Professional error messages dan handling

## 🎯 Fitur Terbaru

### ✅ Advanced Analytics & Visualization (Juni 2025)
- **📊 Bar Chart Analysis**: Visualisasi interaktif dengan D3.js untuk 3 kategori utama
  - Penghasilan Orang Tua dengan klasifikasi ekonomi
  - Kehadiran Siswa dengan kategori presensi  
  - Nilai Raport dengan range prestasi
- **🔥 Correlation Heatmap**: Heatmap interaktif korelasi antar 6 fitur numerik
- **📈 Feature Statistics**: Dashboard statistik komprehensif untuk data-driven decisions
- **🎨 Interactive Elements**: Hover tooltips, smooth animations, responsive design

### ✅ Token Management System (Juni 2025)
- **🔄 Auto Refresh Token**: Perpanjangan session otomatis dengan smart timing
- **⏰ Token Expiry Checker**: 5-level status indicator dengan real-time monitoring
- **📱 Enhanced Token Dialog**: Modal informasi lengkap dengan profile integration
- **🔔 Smart Notifications**: Sistem notifikasi bertingkat untuk session management
- **💾 State Persistence**: Preferensi dan status tersimpan di localStorage

### ✅ Batch Processing & Export (Juni 2025)
- **⚡ Mass Prediction**: Prediksi prestasi untuk seluruh siswa dalam hitungan detik
- **📊 Batch Results**: Grid hasil dengan success rate dan error handling
- **📤 Excel Export**: Export ke Excel untuk semua modul dengan formatting professional
- **🔍 Data Analysis**: Summary statistics dan progress tracking

### ✅ Grid System Enhancement (Juni 2025)
- **🎯 Perfect Alignment**: Header-row alignment yang sempurna di semua grid
- **🗑️ Enhanced Delete**: Konfirmasi hapus dengan informasi detail
- **📱 Mobile Responsive**: 4-tier responsive breakpoints
- **🎨 Professional Styling**: Consistent design language dengan hover effects

### ✅ Sidebar Collapse v1.3.0
- **Perfect Sizing**: Main content mengikuti ukuran sidebar dengan akurat
- **Responsive Design**: Optimal untuk desktop dan mobile
- **State Persistence**: Preferensi user tersimpan di localStorage
- **Smooth Animations**: Transisi yang halus dan modern
- **Auto-Correction**: Monitoring real-time untuk sizing yang konsisten

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

## 📚 **API Documentation & Testing**

### **🔗 Swagger UI & ReDoc**
Dokumentasi API interaktif tersedia dengan fitur authentication terintegrasi:

- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs) - Interactive API documentation
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc) - Alternative documentation interface  
- **OpenAPI JSON**: [http://localhost:8000/openapi.json](http://localhost:8000/openapi.json) - API specification

### **🔐 Authentication**
Untuk menggunakan API:
1. Login melalui `/api/auth/login` dengan credentials `admin/admin123`
2. Copy JWT token dari response
3. Klik tombol **"Authorize" 🔓** di Swagger UI
4. Masukkan token dengan format: `Bearer <your-jwt-token>`
5. Test API endpoints langsung dari browser

### **📋 API Categories**
- 🏠 **Root**: Basic application info dan health checks
- 🔐 **Authentication**: Login, logout, user management
- 👥 **Siswa**: CRUD operations, upload Excel, export data
- 📊 **Nilai Raport**: Manajemen nilai akademik dengan auto-calculation
- 📅 **Presensi**: Tracking kehadiran dengan perhitungan otomatis
- 💰 **Penghasilan Ortu**: Data ekonomi keluarga dengan kategorisasi
- 🔮 **Prediksi Prestasi**: Machine learning C4.5, batch processing
- 📈 **Visualisasi**: Decision tree visualization
- 🏥 **Health**: System monitoring dan health checks

## 📚 **API Documentation & Testing**
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

## 📊 Status Development

- ✅ **Frontend**: Complete dengan responsive design
- ✅ **Token Management**: Production ready dengan auto-refresh
- ✅ **Advanced Analytics**: D3.js visualizations implemented
- ✅ **Batch Processing**: Mass prediction system completed
- ✅ **Export System**: Excel export untuk semua modul
- ✅ **Grid Enhancement**: Perfect alignment semua grid utama
- ✅ **Sidebar Collapse**: Perfect implementation v1.3.0
- ✅ **UI/UX**: Modern dan user-friendly
- 🔄 **Backend Integration**: Enhanced dengan new endpoints
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

**Version**: 2.0.0  
**Last Updated**: Juni 2025  
**Status**: ✅ Production Ready dengan Advanced Features
