# Dokumentasi Function - Sistem Prediksi Prestasi Siswa

## Daftar Isi
1. [Backend Functions](#backend-functions)
   - [Main Application](#main-application)
   - [Database Functions](#database-functions)
   - [Authentication Functions](#authentication-functions)
   - [Siswa Router Functions](#siswa-router-functions)
   - [Nilai Router Functions](#nilai-router-functions)
   - [Presensi Router Functions](#presensi-router-functions)
   - [Penghasilan Router Functions](#penghasilan-router-functions)
   - [Prediksi Router Functions](#prediksi-router-functions)
2. [Frontend Functions](#frontend-functions)
   - [Main App Functions](#main-app-functions)
   - [Dashboard Functions](#dashboard-functions)
   - [Grid Functions](#grid-functions)

---

## Backend Functions

### Main Application

#### `root()`
**File:** `backend/main.py`  
**Endpoint:** `GET /`  
**Deskripsi:** Endpoint root yang menampilkan pesan selamat datang  
**Return:** `{"message": "Selamat datang di API Sistem Prediksi Prestasi Siswa"}`

#### `health_check()`
**File:** `backend/main.py`  
**Endpoint:** `GET /health`  
**Deskripsi:** Memeriksa status kesehatan API  
**Return:** `{"status": "ok", "message": "API berjalan dengan baik"}`

#### `get_decision_tree()`
**File:** `backend/main.py`  
**Endpoint:** `GET /api/decision_tree`  
**Deskripsi:** Menampilkan file gambar decision tree dari direktori static  
**Return:** FileResponse dengan file `decision_tree.png`

#### `startup_event()`
**File:** `backend/main.py`  
**Event:** Startup  
**Deskripsi:** Menginisialisasi database saat aplikasi dimulai  
**Aksi:** Memanggil `init_db()` dan mencetak pesan konfirmasi

---

### Database Functions

#### `get_db()`
**File:** `backend/database.py`  
**Deskripsi:** Generator function untuk mendapatkan koneksi database  
**Return:** Session database yang akan ditutup otomatis setelah digunakan  
**Usage:** Digunakan sebagai dependency injection di FastAPI

#### `init_db()`
**File:** `backend/database.py`  
**Deskripsi:** Menginisialisasi database dengan membuat semua tabel  
**Aksi:** Memanggil `Base.metadata.create_all(bind=engine)`

---

### Authentication Functions

#### `verify_password(plain_password: str, hashed_password: str)`
**File:** `backend/routes/auth_router.py`  
**Deskripsi:** Memverifikasi password plain text dengan password yang di-hash  
**Parameter:**
- `plain_password`: Password dalam bentuk plain text
- `hashed_password`: Password yang sudah di-hash
**Return:** Boolean (True jika cocok, False jika tidak)

#### `get_password_hash(password: str)`
**File:** `backend/routes/auth_router.py`  
**Deskripsi:** Menghasilkan hash dari password plain text  
**Parameter:** `password` - Password dalam bentuk plain text  
**Return:** String password yang sudah di-hash

#### `get_user(db: Session, username: str)`
**File:** `backend/routes/auth_router.py`  
**Deskripsi:** Mengambil data user berdasarkan username  
**Parameter:**
- `db`: Session database
- `username`: Username yang dicari
**Return:** Object User atau None jika tidak ditemukan

#### `authenticate_user(db: Session, username: str, password: str)`
**File:** `backend/routes/auth_router.py`  
**Deskripsi:** Mengautentikasi user dengan username dan password  
**Parameter:**
- `db`: Session database
- `username`: Username user
- `password`: Password user
**Return:** Object User jika berhasil, False jika gagal

#### `create_access_token(data: dict, expires_delta: Optional[timedelta] = None)`
**File:** `backend/routes/auth_router.py`  
**Deskripsi:** Membuat JWT access token  
**Parameter:**
- `data`: Data yang akan di-encode dalam token
- `expires_delta`: Waktu kadaluarsa token (opsional)
**Return:** String JWT token

#### `get_current_user(token: str, db: Session)`
**File:** `backend/routes/auth_router.py`  
**Deskripsi:** Mendapatkan user yang sedang login berdasarkan JWT token  
**Parameter:**
- `token`: JWT token dari header Authorization
- `db`: Session database
**Return:** Object User yang sedang login

#### `login_for_access_token(form_data: OAuth2PasswordRequestForm, db: Session)`
**File:** `backend/routes/auth_router.py`  
**Endpoint:** `POST /api/auth/token`  
**Deskripsi:** Login user dan menghasilkan access token  
**Parameter:**
- `form_data`: Data form login (username, password)
- `db`: Session database
**Return:** `{"access_token": token, "token_type": "bearer"}`

#### `register_user(user: UserCreate, db: Session)`
**File:** `backend/routes/auth_router.py`  
**Endpoint:** `POST /api/auth/register`  
**Deskripsi:** Mendaftarkan user baru  
**Parameter:**
- `user`: Data user baru (username, password)
- `db`: Session database
**Return:** `{"message": "User created successfully"}`

#### `get_users(db: Session, current_user: User)`
**File:** `backend/routes/auth_router.py`  
**Endpoint:** `GET /api/auth/users`  
**Deskripsi:** Mengambil daftar semua user  
**Parameter:**
- `db`: Session database
- `current_user`: User yang sedang login
**Return:** List user dengan id dan username

#### `delete_user(user_id: int, db: Session, current_user: User)`
**File:** `backend/routes/auth_router.py`  
**Endpoint:** `DELETE /api/auth/users/{user_id}`  
**Deskripsi:** Menghapus user berdasarkan ID  
**Parameter:**
- `user_id`: ID user yang akan dihapus
- `db`: Session database
- `current_user`: User yang sedang login
**Return:** `{"message": "User deleted successfully"}`

#### `create_dummy_users(db: Session)`
**File:** `backend/routes/auth_router.py`  
**Endpoint:** `POST /api/auth/create-dummy-users`  
**Deskripsi:** Membuat user dummy untuk testing  
**Parameter:** `db` - Session database  
**Return:** `{"message": "Dummy users created", "users": created_users}`

---

### Siswa Router Functions

#### `upload_siswa_excel(file: UploadFile, db: Session, current_user: User)`
**File:** `backend/routes/siswa_router.py`  
**Endpoint:** `POST /api/siswa/upload/excel`  
**Deskripsi:** Upload data siswa dari file Excel  
**Parameter:**
- `file`: File Excel yang diupload
- `db`: Session database
- `current_user`: User yang sedang login
**Return:** Status upload dan jumlah data yang berhasil/gagal diproses

#### `export_siswa_excel(db: Session, current_user: User)`
**File:** `backend/routes/siswa_router.py`  
**Endpoint:** `GET /api/siswa/export/excel`  
**Deskripsi:** Export data siswa ke file Excel  
**Parameter:**
- `db`: Session database
- `current_user`: User yang sedang login
**Return:** StreamingResponse dengan file Excel

#### `create_siswa(siswa: SiswaCreate, db: Session, current_user: User)`
**File:** `backend/routes/siswa_router.py`  
**Endpoint:** `POST /api/siswa/`  
**Deskripsi:** Membuat data siswa baru  
**Parameter:**
- `siswa`: Data siswa yang akan dibuat
- `db`: Session database
- `current_user`: User yang sedang login
**Return:** Data siswa yang baru dibuat

#### `get_all_siswa(skip: int, limit: int, search: Optional[str], db: Session, current_user: User)`
**File:** `backend/routes/siswa_router.py`  
**Endpoint:** `GET /api/siswa/`  
**Deskripsi:** Mengambil daftar semua siswa dengan pagination dan pencarian  
**Parameter:**
- `skip`: Jumlah data yang dilewati (untuk pagination)
- `limit`: Batas jumlah data yang diambil
- `search`: Kata kunci pencarian (opsional)
- `db`: Session database
- `current_user`: User yang sedang login
**Return:** List data siswa

#### `get_siswa(siswa_id: int, db: Session, current_user: User)`
**File:** `backend/routes/siswa_router.py`  
**Endpoint:** `GET /api/siswa/{siswa_id}`  
**Deskripsi:** Mengambil data siswa berdasarkan ID  
**Parameter:**
- `siswa_id`: ID siswa yang dicari
- `db`: Session database
- `current_user`: User yang sedang login
**Return:** Data siswa

#### `update_siswa(siswa_id: int, siswa_update: SiswaUpdate, db: Session, current_user: User)`
**File:** `backend/routes/siswa_router.py`  
**Endpoint:** `PUT /api/siswa/{siswa_id}`  
**Deskripsi:** Mengupdate data siswa  
**Parameter:**
- `siswa_id`: ID siswa yang akan diupdate
- `siswa_update`: Data update siswa
- `db`: Session database
- `current_user`: User yang sedang login
**Return:** Data siswa yang sudah diupdate

#### `delete_siswa(siswa_id: int, db: Session, current_user: User)`
**File:** `backend/routes/siswa_router.py`  
**Endpoint:** `DELETE /api/siswa/{siswa_id}`  
**Deskripsi:** Menghapus data siswa  
**Parameter:**
- `siswa_id`: ID siswa yang akan dihapus
- `db`: Session database
- `current_user`: User yang sedang login
**Return:** None (status 204)

#### `get_siswa_dropdown(db: Session, current_user: User)`
**File:** `backend/routes/siswa_router.py`  
**Endpoint:** `GET /api/siswa/dropdown`  
**Deskripsi:** Mengambil daftar siswa untuk dropdown  
**Parameter:**
- `db`: Session database
- `current_user`: User yang sedang login
**Return:** List siswa dengan format `{"id": id, "text": "nama (kelas)"}`

---

### Nilai Router Functions

#### `create_nilai(nilai: NilaiRaportCreate, db: Session)`
**File:** `backend/routes/nilai_router.py`  
**Endpoint:** `POST /api/nilai/`  
**Deskripsi:** Membuat data nilai raport baru dengan perhitungan rata-rata otomatis  
**Parameter:**
- `nilai`: Data nilai raport yang akan dibuat
- `db`: Session database
**Return:** Data nilai raport yang baru dibuat

#### `get_all_nilai(skip: int, limit: int, siswa_id: Optional[int], db: Session)`
**File:** `backend/routes/nilai_router.py`  
**Endpoint:** `GET /api/nilai/`  
**Deskripsi:** Mengambil daftar semua nilai raport dengan pagination dan filter siswa  
**Parameter:**
- `skip`: Jumlah data yang dilewati
- `limit`: Batas jumlah data yang diambil
- `siswa_id`: ID siswa untuk filter (opsional)
- `db`: Session database
**Return:** List data nilai raport

#### `get_nilai(nilai_id: int, db: Session)`
**File:** `backend/routes/nilai_router.py`  
**Endpoint:** `GET /api/nilai/{nilai_id}`  
**Deskripsi:** Mengambil data nilai raport berdasarkan ID  
**Parameter:**
- `nilai_id`: ID nilai raport yang dicari
- `db`: Session database
**Return:** Data nilai raport

#### `update_nilai(nilai_id: int, nilai_update: NilaiRaportUpdate, db: Session)`
**File:** `backend/routes/nilai_router.py`  
**Endpoint:** `PUT /api/nilai/{nilai_id}`  
**Deskripsi:** Mengupdate data nilai raport dengan perhitungan ulang rata-rata  
**Parameter:**
- `nilai_id`: ID nilai raport yang akan diupdate
- `nilai_update`: Data update nilai raport
- `db`: Session database
**Return:** Data nilai raport yang sudah diupdate

#### `delete_nilai(nilai_id: int, db: Session)`
**File:** `backend/routes/nilai_router.py`  
**Endpoint:** `DELETE /api/nilai/{nilai_id}`  
**Deskripsi:** Menghapus data nilai raport  
**Parameter:**
- `nilai_id`: ID nilai raport yang akan dihapus
- `db`: Session database
**Return:** None (status 204)

---

### Presensi Router Functions

#### `create_presensi(presensi: PresensiCreate, db: Session)`
**File:** `backend/routes/presensi_router.py`  
**Endpoint:** `POST /api/presensi/`  
**Deskripsi:** Membuat data presensi baru  
**Parameter:**
- `presensi`: Data presensi yang akan dibuat
- `db`: Session database
**Return:** Data presensi yang baru dibuat

#### `get_all_presensi(skip: int, limit: int, siswa_id: Optional[int], db: Session)`
**File:** `backend/routes/presensi_router.py`  
**Endpoint:** `GET /api/presensi/`  
**Deskripsi:** Mengambil daftar semua presensi dengan pagination dan filter siswa  
**Parameter:**
- `skip`: Jumlah data yang dilewati
- `limit`: Batas jumlah data yang diambil
- `siswa_id`: ID siswa untuk filter (opsional)
- `db`: Session database
**Return:** List data presensi

#### `get_presensi(presensi_id: int, db: Session)`
**File:** `backend/routes/presensi_router.py`  
**Endpoint:** `GET /api/presensi/{presensi_id}`  
**Deskripsi:** Mengambil data presensi berdasarkan ID  
**Parameter:**
- `presensi_id`: ID presensi yang dicari
- `db`: Session database
**Return:** Data presensi

#### `update_presensi(presensi_id: int, presensi_update: PresensiUpdate, db: Session)`
**File:** `backend/routes/presensi_router.py`  
**Endpoint:** `PUT /api/presensi/{presensi_id}`  
**Deskripsi:** Mengupdate data presensi dengan perhitungan ulang persentase dan kategori kehadiran  
**Parameter:**
- `presensi_id`: ID presensi yang akan diupdate
- `presensi_update`: Data update presensi
- `db`: Session database
**Return:** Data presensi yang sudah diupdate

#### `delete_presensi(presensi_id: int, db: Session)`
**File:** `backend/routes/presensi_router.py`  
**Endpoint:** `DELETE /api/presensi/{presensi_id}`  
**Deskripsi:** Menghapus data presensi  
**Parameter:**
- `presensi_id`: ID presensi yang akan dihapus
- `db`: Session database
**Return:** None (status 204)

---

### Penghasilan Router Functions

#### `create_penghasilan(penghasilan: PenghasilanOrtuCreate, db: Session)`
**File:** `backend/routes/penghasilan_router.py`  
**Endpoint:** `POST /api/penghasilan/`  
**Deskripsi:** Membuat data penghasilan orang tua baru  
**Parameter:**
- `penghasilan`: Data penghasilan orang tua yang akan dibuat
- `db`: Session database
**Return:** Data penghasilan orang tua yang baru dibuat

#### `get_all_penghasilan(skip: int, limit: int, siswa_id: Optional[int], db: Session)`
**File:** `backend/routes/penghasilan_router.py`  
**Endpoint:** `GET /api/penghasilan/`  
**Deskripsi:** Mengambil daftar semua penghasilan orang tua dengan pagination dan filter siswa  
**Parameter:**
- `skip`: Jumlah data yang dilewati
- `limit`: Batas jumlah data yang diambil
- `siswa_id`: ID siswa untuk filter (opsional)
- `db`: Session database
**Return:** List data penghasilan orang tua

#### `get_penghasilan(penghasilan_id: int, db: Session)`
**File:** `backend/routes/penghasilan_router.py`  
**Endpoint:** `GET /api/penghasilan/{penghasilan_id}`  
**Deskripsi:** Mengambil data penghasilan orang tua berdasarkan ID  
**Parameter:**
- `penghasilan_id`: ID penghasilan orang tua yang dicari
- `db`: Session database
**Return:** Data penghasilan orang tua

#### `update_penghasilan(penghasilan_id: int, penghasilan_update: PenghasilanOrtuUpdate, db: Session)`
**File:** `backend/routes/penghasilan_router.py`  
**Endpoint:** `PUT /api/penghasilan/{penghasilan_id}`  
**Deskripsi:** Mengupdate data penghasilan orang tua dengan perhitungan ulang total dan kategori penghasilan  
**Parameter:**
- `penghasilan_id`: ID penghasilan orang tua yang akan diupdate
- `penghasilan_update`: Data update penghasilan orang tua
- `db`: Session database
**Return:** Data penghasilan orang tua yang sudah diupdate

#### `delete_penghasilan(penghasilan_id: int, db: Session)`
**File:** `backend/routes/penghasilan_router.py`  
**Endpoint:** `DELETE /api/penghasilan/{penghasilan_id}`  
**Deskripsi:** Menghapus data penghasilan orang tua  
**Parameter:**
- `penghasilan_id`: ID penghasilan orang tua yang akan dihapus
- `db`: Session database
**Return:** None (status 204)

---

### Prediksi Router Functions

#### `train_model(db: Session, force_train: bool, current_user: User)`
**File:** `backend/routes/prediksi_router.py`  
**Endpoint:** `POST /api/prediksi/train`  
**Deskripsi:** Melatih model C4.5 dengan data yang ada di database  
**Parameter:**
- `db`: Session database
- `force_train`: Flag untuk memaksa training meskipun data tidak cukup
- `current_user`: User yang sedang login
**Return:** Status training dan informasi model

#### `predict_prestasi(request: PrediksiRequest, db: Session, force_train: bool, current_user: User)`
**File:** `backend/routes/prediksi_router.py`  
**Endpoint:** `POST /api/prediksi/`  
**Deskripsi:** Memprediksi prestasi siswa berdasarkan data nilai, presensi, dan penghasilan orang tua  
**Parameter:**
- `request`: Data request prediksi (siswa_id, semester, tahun_ajaran)
- `db`: Session database
- `force_train`: Flag untuk memaksa training jika model belum dilatih
- `current_user`: User yang sedang login
**Return:** Hasil prediksi dengan confidence dan detail faktor

#### `get_rules(db: Session, current_user: User)`
**File:** `backend/routes/prediksi_router.py`  
**Endpoint:** `GET /api/prediksi/rules`  
**Deskripsi:** Mendapatkan aturan-aturan dari model C4.5  
**Parameter:**
- `db`: Session database
- `current_user`: User yang sedang login
**Return:** Aturan-aturan decision tree dalam format teks

#### `generate_labeled_data(db: Session, current_user: User)`
**File:** `backend/routes/prediksi_router.py`  
**Endpoint:** `POST /api/prediksi/generate-labeled-data`  
**Deskripsi:** Membuat data berlabel untuk melatih model C4.5  
**Parameter:**
- `db`: Session database
- `current_user`: User yang sedang login
**Return:** Status pembuatan data berlabel dan distribusi label

#### `generate_dummy_data(jumlah_data: int, db: Session)`
**File:** `backend/routes/prediksi_router.py`  
**Endpoint:** `POST /api/prediksi/generate-dummy`  
**Deskripsi:** Generate data dummy untuk siswa, nilai, presensi, dan penghasilan orang tua  
**Parameter:**
- `jumlah_data`: Jumlah data dummy yang akan dibuat (maksimal 1000)
- `db`: Session database
**Return:** Status pembuatan data dummy

#### `get_visualization(db: Session)`
**File:** `backend/routes/prediksi_router.py`  
**Endpoint:** `GET /api/prediksi/visualization`  
**Deskripsi:** Mendapatkan visualisasi pohon keputusan dalam format base64  
**Parameter:** `db` - Session database  
**Return:** Gambar pohon keputusan dalam format base64

#### `get_prediction_history(siswa_id: Optional[int], db: Session)`
**File:** `backend/routes/prediksi_router.py`  
**Endpoint:** `GET /api/prediksi/history`  
**Deskripsi:** Mendapatkan riwayat prediksi prestasi  
**Parameter:**
- `siswa_id`: ID siswa untuk filter (opsional)
- `db`: Session database
**Return:** List riwayat prediksi prestasi

#### `generate_dummy_data(count: int, db: Session)`
**File:** `backend/routes/prediksi_router.py`  
**Endpoint:** `POST /api/prediksi/generate-dummy-data`  
**Deskripsi:** Menghasilkan data dummy untuk pengujian model (minimal 10, maksimal 1000)  
**Parameter:**
- `count`: Jumlah data dummy yang akan dibuat
- `db`: Session database
**Return:** Status pembuatan data dummy dan jumlah data yang dibuat

#### `generate_dummy_by_name(request: dict, db: Session)`
**File:** `backend/routes/prediksi_router.py`  
**Endpoint:** `POST /api/prediksi/generate-dummy-by-name`  
**Deskripsi:** Menghasilkan data dummy untuk siswa tertentu berdasarkan nama/ID dan tahun ajaran  
**Parameter:**
- `request`: Dictionary berisi siswa_id/nama_siswa dan tahun_ajaran
- `db`: Session database
**Return:** Status pembuatan data dummy untuk siswa tertentu

#### `get_data_count(db: Session)`
**File:** `backend/routes/prediksi_router.py`  
**Endpoint:** `GET /api/prediksi/data-count`  
**Deskripsi:** Mendapatkan jumlah data yang tersedia untuk pelatihan model  
**Parameter:** `db` - Session database  
**Return:** Informasi jumlah data total, berlabel, tidak berlabel, dan status kecukupan data

---

## Frontend Functions

### Main App Functions

#### `getToken()`
**File:** `frontend/js/app.js`  
**Deskripsi:** Mengambil JWT token dari localStorage  
**Return:** String token atau null jika tidak ada

#### `addAuthHeader(xhr)`
**File:** `frontend/js/app.js`  
**Deskripsi:** Menambahkan header Authorization ke AJAX requests  
**Parameter:** `xhr` - XMLHttpRequest object  
**Aksi:** Menambahkan header `Authorization: Bearer {token}`

#### `loadDashboardData()`
**File:** `frontend/js/app.js`  
**Deskripsi:** Memuat data untuk dashboard (total siswa, distribusi prestasi, visualisasi)  
**Aksi:**
- Mengambil data siswa untuk menampilkan total
- Mengambil data prediksi untuk statistik prestasi
- Mengambil visualisasi pohon keputusan
- Membuat chart distribusi prestasi

#### `createPrestasiChart(tinggi, sedang, rendah)`
**File:** `frontend/js/app.js`  
**Deskripsi:** Membuat chart pie untuk distribusi prestasi siswa  
**Parameter:**
- `tinggi`: Jumlah siswa dengan prestasi tinggi
- `sedang`: Jumlah siswa dengan prestasi sedang
- `rendah`: Jumlah siswa dengan prestasi rendah
**Aksi:** Membuat Kendo UI Chart dengan tipe pie

---

### Grid Functions

#### `initSiswaGrid()`
**File:** `frontend/js/app.js`  
**Deskripsi:** Menginisialisasi Kendo UI Grid untuk data siswa  
**Fitur:**
- CRUD operations (Create, Read, Update, Delete)
- Upload Excel
- Export Excel
- Pencarian dan pagination
- Popup editing mode

#### `initNilaiGrid()`
**File:** `frontend/js/app.js`  
**Deskripsi:** Menginisialisasi Kendo UI Grid untuk data nilai raport  
**Fitur:**
- CRUD operations
- Dropdown siswa dengan pencarian
- Validasi input nilai (0-100)
- Perhitungan rata-rata otomatis

#### `initPresensiGrid()`
**File:** `frontend/js/app.js`  
**Deskripsi:** Menginisialisasi Kendo UI Grid untuk data presensi  
**Fitur:**
- CRUD operations
- Dropdown siswa
- Perhitungan persentase kehadiran otomatis
- Kategorisasi kehadiran (Tinggi/Sedang/Rendah)

#### `initPenghasilanGrid()`
**File:** `frontend/js/app.js`  
**Deskripsi:** Menginisialisasi Kendo UI Grid untuk data penghasilan orang tua  
**Fitur:**
- CRUD operations
- Dropdown siswa
- Perhitungan total penghasilan otomatis
- Kategorisasi penghasilan (Tinggi/Menengah/Rendah)

#### `initUsersGrid()`
**File:** `frontend/js/app.js`  
**Deskripsi:** Menginisialisasi Kendo UI Grid untuk manajemen user  
**Fitur:**
- Tampil daftar user
- Hapus user (kecuali user yang sedang login)
- Konfirmasi sebelum menghapus

#### `initGenerateDummyForm()`
**File:** `frontend/js/app.js`  
**Deskripsi:** Menginisialisasi form untuk generate data dummy  
**Fitur:**
- Input jumlah data dummy
- Validasi input (maksimal 1000)
- Progress indicator saat generate

#### `initPrediksiPage()`
**File:** `frontend/js/app.js`  
**Deskripsi:** Menginisialisasi halaman prediksi  
**Fitur:**
- Form prediksi dengan dropdown siswa
- Tampilan hasil prediksi dengan confidence
- Grid riwayat prediksi
- Tombol train model

---

### Utility Functions

#### `siswaDropDownEditor(container, options)`
**File:** `frontend/js/app.js`  
**Deskripsi:** Custom editor untuk dropdown siswa di grid  
**Parameter:**
- `container`: Container element untuk dropdown
- `options`: Options dari grid column
**Return:** Kendo UI DropDownList dengan data siswa

#### `getAlertClass(prestasi)`
**File:** `frontend/js/app.js`  
**Deskripsi:** Mendapatkan CSS class untuk alert berdasarkan prestasi  
**Parameter:** `prestasi` - Kategori prestasi (Tinggi/Sedang/Rendah)  
**Return:** String CSS class (`alert-success`, `alert-warning`, `alert-danger`)

#### `handleFileUpload(event)`
**File:** `frontend/js/app.js`  
**Deskripsi:** Menangani upload file Excel untuk data siswa  
**Parameter:** `event` - Event dari file input  
**Aksi:**
- Validasi format file (.xlsx, .xls)
- Upload file ke server
- Refresh grid setelah upload berhasil
- Tampilkan notifikasi hasil upload

#### `tampilkanHasilPrediksi(data)`
**File:** `frontend/app.js`  
**Deskripsi:** Menampilkan hasil prediksi dalam bentuk card  
**Parameter:** `data` - Data hasil prediksi dari API  
**Aksi:**
- Membuat card dengan informasi prediksi
- Menampilkan nama siswa, prediksi, confidence
- Menampilkan faktor-faktor yang mempengaruhi

---

## Catatan Teknis

### Teknologi yang Digunakan
- **Backend:** FastAPI, SQLAlchemy, PostgreSQL, Pandas, Scikit-learn
- **Frontend:** HTML, CSS, JavaScript, jQuery, Kendo UI
- **Authentication:** JWT (JSON Web Tokens)
- **Database:** PostgreSQL dengan Docker

### Pola Arsitektur
- **Backend:** RESTful API dengan pattern Repository
- **Frontend:** SPA (Single Page Application) dengan AJAX
- **Database:** ORM dengan SQLAlchemy models
- **Security:** JWT-based authentication dengan bcrypt password hashing

### Fitur Utama
1. **Manajemen Data:** CRUD untuk siswa, nilai, presensi, penghasilan orang tua
2. **Prediksi:** Algoritma C4.5 untuk prediksi prestasi siswa
3. **Visualisasi:** Chart distribusi prestasi dan pohon keputusan
4. **Import/Export:** Upload dan download data dalam format Excel
5. **Authentication:** Sistem login dengan JWT tokens
6. **Data Dummy:** Generator data dummy untuk testing dan demo

### Validasi dan Error Handling
- Validasi input di level Pydantic schemas
- Error handling dengan HTTP status codes yang sesuai
- Notifikasi user-friendly di frontend
- Logging untuk debugging dan monitoring 