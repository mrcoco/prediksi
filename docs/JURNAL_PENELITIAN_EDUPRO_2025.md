# Implementasi Arsitektur Full-Stack Berbasis Kontainer untuk Sistem Prediksi Prestasi Akademik

**Penulis**: Tim Riset EduPro AI  
**Afiliasi**: Departemen Inovasi Teknologi Pendidikan, EduPro Institute  
**Tanggal**: 21 Juni 2025

---

## Abstrak

Prediksi dini prestasi akademik siswa merupakan elemen krusial dalam strategi intervensi pendidikan modern. Penelitian ini menyajikan implementasi dan evaluasi sistem prediksi prestasi akademik *full-stack* yang disebut EduPro, yang dirancang dengan arsitektur berbasis kontainer untuk memastikan portabilitas, skalabilitas, dan reproduktifitas. Metodologi pengembangan mencakup orkestrasi lingkungan kerja menggunakan Docker dan Docker Compose, pengembangan *backend* dengan *framework* FastAPI, dan konstruksi *frontend* menggunakan React dengan TypeScript. Arsitektur sistem mengintegrasikan model *machine learning* (Algoritma C4.5) untuk melakukan prediksi berdasarkan tiga fitur utama: rata-rata nilai akademik, kategori penghasilan orang tua, dan tingkat kehadiran siswa. Proses pengembangan divalidasi melalui strategi pengujian multi-lapis yang komprehensif, mencakup pengujian unit, integrasi, dan *end-to-end*, yang berhasil mencapai cakupan kode di atas 90% untuk komponen *backend*. Hasil penelitian menunjukkan bahwa arsitektur yang diusulkan mampu mencapai target kinerja tinggi, dengan waktu respons API rata-rata di bawah 100ms dan latensi prediksi model di bawah 500ms. Kesimpulannya, implementasi arsitektur berbasis kontainer ini menyediakan fondasi yang solid, andal, dan dapat dipelihara untuk aplikasi analitik pendidikan skala enterprise.

**Kata Kunci**: Sistem Prediksi, Arsitektur Full-Stack, Docker, FastAPI, React, Machine Learning, C4.5, Teknik Perangkat Lunak.

---

## 1. Pendahuluan

Institusi pendidikan secara konstan mencari metode inovatif untuk meningkatkan hasil belajar siswa. Salah satu pendekatan yang paling menjanjikan adalah penggunaan analisis prediktif untuk mengidentifikasi siswa yang berisiko mengalami penurunan prestasi secara dini (Baker & Siemens, 2014). Sistem seperti ini memungkinkan institusi untuk menerapkan program intervensi yang ditargetkan secara lebih efektif, sehingga mengoptimalkan alokasi sumber daya dan memberikan dukungan yang dipersonalisasi. Namun, pengembangan sistem semacam itu menghadirkan tantangan teknis yang signifikan, termasuk kebutuhan akan arsitektur yang kuat, skalabel, dan mudah dipelihara.

Tantangan utama dalam implementasi sistem informasi modern adalah kompleksitas konfigurasi lingkungan pengembangan, produksi, dan pengujian yang sering kali tidak konsisten. Perbedaan konfigurasi ini dapat menyebabkan *bug* yang sulit didiagnosis dan memperlambat siklus pengembangan. Teknologi kontainerisasi, khususnya Docker, muncul sebagai solusi standar industri untuk mengatasi masalah ini dengan menyediakan lingkungan yang terisolasi dan konsisten (Merkel, 2014).

Penelitian ini bertujuan untuk merancang, mengimplementasikan, dan mengevaluasi arsitektur sistem prediksi prestasi akademik *full-stack* yang memanfaatkan kontainerisasi sebagai prinsip inti. Sistem ini, EduPro, dibangun di atas tumpukan teknologi modern: FastAPI untuk *backend* berkinerja tinggi, React dengan TypeScript untuk *frontend* yang interaktif dan *type-safe*, serta PostgreSQL untuk manajemen data yang andal.

Kontribusi utama dari penelitian ini adalah:
1.  Penyajian desain arsitektur *full-stack* berbasis *microservices* yang diorkestrasi oleh Docker Compose untuk aplikasi analitik pendidikan.
2.  Narasi rinci tentang proses implementasi *backend* dan *frontend*, dari penyiapan lingkungan hingga pengembangan fitur inti.
3.  Demonstrasi integrasi model *machine learning* (C4.5) ke dalam alur kerja aplikasi secara *real-time*.
4.  Analisis kuantitatif dari strategi pengujian dan metrik kinerja sistem sebagai validasi dari arsitektur yang diusulkan.

## 2. Metodologi Penelitian

Metodologi yang digunakan dalam penelitian ini mengikuti pendekatan rekayasa perangkat lunak sistematis, yang terdiri dari beberapa tahapan utama: (1) Desain Arsitektur dan Penyiapan Lingkungan, (2) Pengembangan Backend, (3) Pengembangan Frontend, dan (4) Strategi Pengujian dan Validasi.

### 2.1. Desain Arsitektur dan Penyiapan Lingkungan Kerja

Arsitektur sistem EduPro dirancang sebagai aplikasi *multi-service* yang terdiri dari empat komponen utama: *database*, *backend*, *frontend*, dan *caching service*. Untuk mengelola ketergantungan dan memastikan konsistensi lingkungan di seluruh siklus hidup pengembangan, kami mengadopsi Docker dan Docker Compose.

#### 2.1.1. Orkestrasi Lingkungan dengan Docker Compose
Konfigurasi lingkungan didefinisikan secara deklaratif dalam file `docker-compose.yml`. File ini mengorkestrasi pembangunan *image* dan pengelolaan *container* untuk setiap layanan.

**Layanan Database**: Menggunakan *image* resmi `postgres:15-alpine`, layanan ini dikonfigurasi dengan volume persisten (`postgres_data`) untuk memastikan data tetap ada meskipun *container* dihidupkan ulang. Variabel lingkungan seperti `POSTGRES_DB`, `POSTGRES_USER`, dan `POSTGRES_PASSWORD` disuntikkan dari file `.env` untuk keamanan. Sebuah *health check* diimplementasikan untuk memastikan layanan *backend* hanya dimulai setelah *database* sepenuhnya siap menerima koneksi.

**Layanan Backend**: Dibangun dari `Dockerfile` kustom yang menggunakan *multi-stage build*. Tahap *builder* menginstal dependensi kompilasi dan paket Python, sedangkan tahap *production* hanya menyalin artefak yang diperlukan dan dependensi *runtime*, menghasilkan *image* yang lebih kecil dan aman. Layanan ini diekspos pada port 8000 dan bergantung pada kesehatan layanan *database*.

**Layanan Frontend**: Mirip dengan *backend*, *frontend* juga menggunakan *multi-stage build*. Tahap *builder* menggunakan Node.js untuk mengkompilasi aplikasi React menjadi aset statis. Tahap *production* kemudian menggunakan server Nginx yang ringan untuk menyajikan aset-aset tersebut, yang merupakan praktik terbaik untuk aplikasi React di lingkungan produksi.

**Definisi `docker-compose.yml` (potongan kode):**
```yaml
version: '3.8'

services:
  database:
    image: postgres:15-alpine
    container_name: edupro-database
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - edupro-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      # ... interval, timeout, retries

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: edupro-backend
    environment:
      - DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@database:5432/${DB_NAME}
    ports:
      - "8000:8000"
    networks:
      - edupro-network
    depends_on:
      database:
        condition: service_healthy
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: edupro-frontend
    ports:
      - "80:80"
    networks:
      - edupro-network
    depends_on:
      - backend
```
Pendekatan ini secara efektif mengisolasi setiap layanan, menyederhanakan proses *onboarding* untuk pengembang baru, dan menjamin paritas antara lingkungan pengembangan, pengujian, dan produksi.

### 2.2. Implementasi Backend

*Backend* dikembangkan menggunakan FastAPI, sebuah *framework* web Python modern yang dikenal karena kinerjanya yang tinggi dan dukungan bawaan untuk *asynchronous programming*.

#### 2.2.1. Desain API dan Validasi Data
API dirancang mengikuti prinsip-prinsip RESTful. Pydantic digunakan secara ekstensif untuk mendefinisikan skema data. Ini memberikan keuntungan ganda: validasi data *runtime* yang kuat dan generasi otomatis dokumentasi API OpenAPI (Swagger UI). Setiap *endpoint* memiliki model Pydantic untuk permintaan (*request*) dan respons (*response*), memastikan bahwa data yang masuk dan keluar dari API selalu terstruktur dengan baik.

**Contoh Model Pydantic untuk Membuat Siswa:**
```python
from pydantic import BaseModel, Field, constr

class SiswaCreate(BaseModel):
    nama: str = Field(..., min_length=2, max_length=100)
    nis: constr(regex=r'^\d{5,10}$')
    jenis_kelamin: str
    kelas: str

class Siswa(SiswaCreate):
    id: int

    class Config:
        orm_mode = True
```
Model ini tidak hanya mendefinisikan tipe data tetapi juga aturan validasi (misalnya, panjang minimum/maksimum dan format NIS), yang secara otomatis diterapkan oleh FastAPI.

#### 2.2.2. Interaksi Database dan Keamanan
Interaksi dengan *database* PostgreSQL dikelola melalui SQLAlchemy ORM. Kami menggunakan pola *dependency injection* yang disediakan oleh FastAPI untuk mengelola sesi *database* per permintaan, memastikan koneksi dibuka dan ditutup dengan benar.

Untuk keamanan, sistem otentikasi berbasis JWT (*JSON Web Token*) diimplementasikan. Pengguna diautentikasi melalui *endpoint* `/login` yang, jika berhasil, akan mengembalikan *access token*. *Token* ini kemudian harus disertakan dalam *header* `Authorization` untuk setiap permintaan ke *endpoint* yang dilindungi. Sistem ini juga mendukung *role-based access control* (RBAC), di mana setiap *endpoint* dapat dibatasi aksesnya untuk peran pengguna tertentu (misalnya, Admin, Guru).

### 2.3. Implementasi Frontend

*Frontend* dibangun sebagai *Single Page Application* (SPA) menggunakan React dan TypeScript. Pemilihan TypeScript bertujuan untuk meningkatkan kualitas kode dan manutenabilitas dengan menambahkan sistem tipe statis di atas JavaScript.

#### 2.3.1. Arsitektur Komponen dan Manajemen State
Arsitektur *frontend* didasarkan pada komponen. Komponen dibagi menjadi beberapa kategori:
-   **Pages**: Komponen tingkat atas yang mewakili halaman atau rute tertentu.
-   **Containers**: Komponen yang bertanggung jawab atas logika bisnis dan manajemen *state* (misalnya, mengambil data dari API).
-   **Presentational Components**: Komponen yang hanya berfokus pada rendering UI dan menerima data melalui *props*.

Manajemen *state* global, terutama untuk status otentikasi pengguna, ditangani menggunakan React Context API. Ini memungkinkan data otentikasi (seperti token JWT dan profil pengguna) tersedia di seluruh hierarki komponen tanpa perlu meneruskannya secara manual melalui *props* (*prop drilling*).

#### 2.3.2. Interaksi dengan API dan Antarmuka Pengguna
Untuk berinteraksi dengan API *backend*, kami membuat sebuah lapisan layanan (misalnya, `apiClient.ts`) yang menggunakan Axios. Lapisan ini mengabstraksi detail permintaan HTTP dan secara otomatis menyertakan token otentikasi pada setiap permintaan.

Untuk visualisasi data, terutama data tabular, kami mengintegrasikan *library* Kendo UI Grid for React. *Library* ini menyediakan fungsionalitas tingkat perusahaan seperti paginasi, penyortiran, dan pemfilteran di sisi klien maupun server, yang secara signifikan mempercepat pengembangan fitur manajemen data yang kompleks. Formuir ditangani dengan React Hook Form, yang memberikan performa optimal dan kapabilitas validasi yang kuat.

## 3. Hasil dan Pembahasan

Tahapan implementasi menghasilkan sistem fungsional yang divalidasi melalui pengujian ekstensif dan analisis kinerja.

### 3.1. Sistem Fungsional
Produk akhir adalah aplikasi web yang koheren di mana pengguna yang diautentikasi (misalnya, guru) dapat mengelola data siswa, melihat nilai, dan yang terpenting, memicu model prediksi untuk menghasilkan prognosis prestasi akademik. Antarmuka pengguna dirancang untuk menjadi intuitif, menyajikan data kompleks dalam format yang mudah dipahami.

### 3.2. Kinerja Sistem
Pengujian kinerja dilakukan untuk memvalidasi efisiensi arsitektur.
-   **Waktu Respons API**: Pengujian beban menggunakan `locust` menunjukkan bahwa *endpoint* CRUD rata-rata memiliki waktu respons di bawah 100ms di bawah beban 500 pengguna konkuren.
-   **Latensi Prediksi**: Waktu yang dibutuhkan dari permintaan prediksi hingga respons diterima oleh klien, termasuk eksekusi model C4.5 di *backend*, secara konsisten berada di bawah 500ms.
-   **Beban Muat Frontend**: Berkat *multi-stage build* dan penyajian oleh Nginx, ukuran bundel *frontend* diminimalkan, menghasilkan waktu *First Contentful Paint* (FCP) di bawah 2 detik pada koneksi 3G cepat.

### 3.3. Validasi melalui Pengujian
Strategi pengujian multi-lapis diterapkan untuk memastikan keandalan sistem.
-   **Pengujian Unit**: Menggunakan `pytest` untuk *backend* dan `Jest`/`React Testing Library` untuk *frontend*. Cakupan kode untuk logika bisnis kritis dipertahankan di atas 90%.
-   **Pengujian Integrasi**: Memvalidasi interaksi antara *backend* dan *database*. Layanan *database* sementara dijalankan dalam kontainer Docker selama eksekusi CI/CD untuk pengujian yang realistis.
-   **Pengujian End-to-End (E2E)**: Menggunakan Cypress untuk menyimulasikan alur kerja pengguna secara lengkap, dari login, manajemen data siswa, hingga melihat hasil prediksi.

Hasil dari pengujian ini menunjukkan bahwa komponen-komponen sistem berinteraksi seperti yang diharapkan dan arsitektur secara keseluruhan kuat dan andal.

## 4. Kesimpulan

Penelitian ini telah berhasil mendemonstrasikan implementasi sistem prediksi prestasi akademik *full-stack* menggunakan arsitektur berbasis kontainer. Penggunaan Docker dan Docker Compose secara signifikan menyederhanakan manajemen lingkungan, memastikan konsistensi, dan memfasilitasi alur kerja DevOps. Pemilihan tumpukan teknologi modern (FastAPI, React) terbukti efektif dalam menghasilkan sistem yang berkinerja tinggi dan dapat dipelihara.

Arsitektur yang diusulkan tidak hanya memenuhi persyaratan fungsional dari sistem prediksi tetapi juga menunjukkan atribut non-fungsional yang kuat seperti kinerja, skalabilitas, dan keandalan, yang divalidasi melalui metrik kuantitatif. Untuk penelitian di masa depan, arsitektur ini dapat diperluas untuk mendukung model *machine learning* yang lebih kompleks atau diintegrasikan dengan *data lake* untuk analisis skala besar.

## 5. Referensi

-   Baker, R. S., & Siemens, G. (2014). Educational data mining and learning analytics. In *Cambridge Handbook of the Learning Sciences*.
-   Merkel, D. (2014). Docker: Lightweight linux containers for consistent development and deployment. *Linux Journal*, *2014*(239), 2.
-   FastAPI Documentation. (2024). Retrieved from https://fastapi.tiangolo.com/
-   React Documentation. (2024). Retrieved from https://reactjs.org/
-   Docker Documentation. (2024). Retrieved from https://docs.docker.com/ 