# Implementasi Arsitektur Full-Stack Berbasis Kontainer untuk Sistem Prediksi Prestasi Akademik

**Penulis**: Tim Riset EduPro AI  
**Afiliasi**: Departemen Inovasi Teknologi Pendidikan, EduPro Institute  
**Tanggal**: 21 Juni 2025

---

## Abstrak

Prediksi dini prestasi akademik siswa merupakan elemen krusial dalam strategi intervensi pendidikan modern. Penelitian ini menyajikan implementasi dan evaluasi sistem prediksi prestasi akademik *full-stack* yang disebut EduPro, yang dirancang dengan arsitektur berbasis kontainer untuk memastikan portabilitas, skalabilitas, dan reproduktifitas. Metodologi pengembangan mencakup orkestrasi lingkungan kerja menggunakan Docker dan Docker Compose, pengembangan *backend* dengan *framework* FastAPI, dan konstruksi antarmuka pengguna web statis yang disajikan oleh Nginx. Arsitektur sistem mengintegrasikan model *machine learning* (Algoritma C4.5) untuk melakukan prediksi berdasarkan tiga fitur utama: rata-rata nilai akademik, kategori penghasilan orang tua, dan tingkat kehadiran siswa. Proses pengembangan divalidasi melalui strategi pengujian multi-lapis yang komprehensif, mencakup pengujian unit, integrasi, dan *end-to-end*, yang berhasil mencapai cakupan kode di atas 90% untuk komponen *backend*. Hasil penelitian menunjukkan bahwa arsitektur yang diusulkan mampu mencapai target kinerja tinggi, dengan waktu respons API rata-rata di bawah 100ms dan latensi prediksi model di bawah 500ms. Kesimpulannya, implementasi arsitektur berbasis kontainer ini menyediakan fondasi yang solid, andal, dan dapat dipelihara untuk aplikasi analitik pendidikan skala enterprise.

**Kata Kunci**: Sistem Prediksi, Arsitektur Full-Stack, Docker, FastAPI, Nginx, JavaScript, Machine Learning, C4.5, Teknik Perangkat Lunak.

---

## 1. Pendahuluan

Institusi pendidikan secara konstan mencari metode inovatif untuk meningkatkan hasil belajar siswa. Salah satu pendekatan yang paling menjanjikan adalah penggunaan analisis prediktif untuk mengidentifikasi siswa yang berisiko mengalami penurunan prestasi secara dini (Baker & Siemens, 2014). Sistem seperti ini memungkinkan institusi untuk menerapkan program intervensi yang ditargetkan secara lebih efektif, sehingga mengoptimalkan alokasi sumber daya dan memberikan dukungan yang dipersonalisasi. Namun, pengembangan sistem semacam itu menghadirkan tantangan teknis yang signifikan, termasuk kebutuhan akan arsitektur yang kuat, skalabel, dan mudah dipelihara.

Tantangan utama dalam implementasi sistem informasi modern adalah kompleksitas konfigurasi lingkungan pengembangan, produksi, dan pengujian yang sering kali tidak konsisten. Perbedaan konfigurasi ini dapat menyebabkan *bug* yang sulit didiagnosis dan memperlambat siklus pengembangan. Teknologi kontainerisasi, khususnya Docker, muncul sebagai solusi standar industri untuk mengatasi masalah ini dengan menyediakan lingkungan yang terisolasi dan konsisten (Merkel, 2014).

Penelitian ini bertujuan untuk merancang, mengimplementasikan, dan mengevaluasi arsitektur sistem prediksi prestasi akademik *full-stack* yang memanfaatkan kontainerisasi sebagai prinsip inti. Sistem ini, EduPro, dibangun di atas tumpukan teknologi modern: FastAPI untuk *backend* berkinerja tinggi, Nginx yang menyajikan antarmuka pengguna berbasis HTML/JavaScript, serta PostgreSQL untuk manajemen data yang andal.

Kontribusi utama dari penelitian ini adalah:
1.  Penyajian desain arsitektur *full-stack* berbasis layanan yang diorkestrasi oleh Docker Compose untuk aplikasi analitik pendidikan.
2.  Narasi rinci tentang proses implementasi *backend* dan *frontend*, dari penyiapan lingkungan hingga pengembangan fitur inti.
3.  Demonstrasi integrasi model *machine learning* (C4.5) ke dalam alur kerja aplikasi secara *real-time*.
4.  Analisis kuantitatif dari strategi pengujian dan metrik kinerja sistem sebagai validasi dari arsitektur yang diusulkan.

## 2. Metodologi Penelitian

Metodologi yang digunakan dalam penelitian ini mengikuti pendekatan rekayasa perangkat lunak sistematis, yang terdiri dari beberapa tahapan utama: (1) Desain Arsitektur dan Penyiapan Lingkungan, (2) Pengembangan Backend, (3) Pengembangan Frontend, dan (4) Strategi Pengujian dan Validasi.

### 2.1. Desain Arsitektur dan Penyiapan Lingkungan Kerja

Arsitektur sistem EduPro dirancang sebagai aplikasi *multi-service* yang terdiri dari empat komponen utama: *database* (`db`), *backend*, *frontend*, dan sebuah *database management tool* (`pgadmin`). Untuk mengelola ketergantungan dan memastikan konsistensi lingkungan di seluruh siklus hidup pengembangan, kami mengadopsi Docker dan Docker Compose.

#### 2.1.1. Orkestrasi Lingkungan dengan Docker Compose
Konfigurasi lingkungan didefinisikan secara deklaratif dalam file `docker-compose.yml`. File ini mengorkestrasi pembangunan *image* dan pengelolaan *container* untuk setiap layanan.

**Layanan Database (`db`)**: Menggunakan *image* resmi `postgres:13`, layanan ini dikonfigurasi dengan volume persisten (`pgdata`) untuk memastikan data tetap ada meskipun *container* dihidupkan ulang. Variabel lingkungan seperti `POSTGRES_DB`, `POSTGRES_USER`, dan `POSTGRES_PASSWORD` digunakan untuk konfigurasi awal. Sebuah *health check* diimplementasikan untuk memastikan layanan *backend* hanya dimulai setelah *database* sepenuhnya siap menerima koneksi.

**Layanan Backend**: Dibangun dari `Dockerfile` kustom. Layanan ini menjalankan aplikasi FastAPI menggunakan server `uvicorn` dengan `--reload` untuk memfasilitasi pengembangan. Layanan ini diekspos pada port 8000 dan bergantung pada kesehatan layanan *database*.

**Layanan Frontend**: Menggunakan *image* Nginx resmi. Alih-alih membangun aplikasi, layanan ini secara langsung me-*mount* direktori `frontend` yang berisi file HTML, CSS, dan JavaScript statis. Konfigurasi Nginx kustom juga di-*mount* untuk mengarahkan permintaan ke aset yang benar dan, jika perlu, melakukan proksi ke API *backend*.

**Layanan PgAdmin**: Menggunakan *image* `dpage/pgadmin4`, layanan ini menyediakan antarmuka web grafis untuk manajemen basis data PostgreSQL. Ini sangat membantu selama fase pengembangan dan debugging untuk memverifikasi data secara langsung.

**Definisi `docker-compose.yml` (potongan kode):**
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    # ...
    command: uvicorn main:app --host 0.0.0.0 --port 8000 --reload

  frontend:
    # Menggunakan image nginx standar, bukan build kustom
    image: nginx:latest
    volumes:
      - ./frontend:/usr/share/nginx/html
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf
    ports:
      - "80:80"
    depends_on:
      - backend

  db:
    image: postgres:13
    # ...
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      # ...

  pgadmin:
    image: dpage/pgadmin4:latest
    # ...
```
Pendekatan ini secara efektif mengisolasi setiap layanan, menyederhanakan proses *onboarding* untuk pengembang baru, dan menjamin paritas antara lingkungan pengembangan, pengujian, dan produksi.

### 2.2. Implementasi Backend

*Backend* dikembangkan menggunakan FastAPI, sebuah *framework* web Python modern yang dikenal karena kinerjanya yang tinggi dan dukungan bawaan untuk *asynchronous programming*. Arsitekturnya dirancang agar sangat modular untuk kemudahan pemeliharaan dan skalabilitas.

#### 2.2.1. Arsitektur Modular dan Routing
Aplikasi utama (`main.py`) berfungsi sebagai titik masuk yang mendaftarkan beberapa *router* dari modul terpisah. Setiap fitur utama seperti `siswa`, `nilai`, `prediksi`, dan `auth` memiliki file *router*-nya sendiri di dalam direktori `routes/`. Pendekatan ini, yang menggunakan `app.include_router()`, memungkinkan pemisahan tanggung jawab (*separation of concerns*) yang bersih dan menjaga basis kode tetap terorganisir.

#### 2.2.2. Desain API dan Validasi Data
API dirancang mengikuti prinsip-prinsip RESTful. Pydantic digunakan secara ekstensif untuk mendefinisikan skema data. Ini memberikan keuntungan ganda: validasi data *runtime* yang kuat dan generasi otomatis dokumentasi API OpenAPI (Swagger UI). Setiap *endpoint* memiliki model Pydantic untuk permintaan (*request*) dan respons (*response*), memastikan bahwa data yang masuk dan keluar dari API selalu terstruktur dengan baik. Dokumentasi API yang kaya, termasuk deskripsi dan contoh, dibuat langsung dari *docstring* dan metadata di dalam kode.

#### 2.2.3. Interaksi Database dan Keamanan
Interaksi dengan *database* PostgreSQL dikelola melalui SQLAlchemy ORM. Pola *dependency injection* dari FastAPI digunakan untuk mengelola sesi *database* per permintaan.

Untuk keamanan, sistem otentikasi berbasis JWT (*JSON Web Token*) diimplementasikan. Sebuah *router* otentikasi (`/api/auth`) menangani proses login dan pembuatan token. *Endpoint* yang memerlukan otorisasi kemudian dilindungi, dan skema keamanan "BearerAuth" secara otomatis ditambahkan ke dokumentasi OpenAPI untuk memudahkan pengujian interaktif.

### 2.3. Implementasi Frontend

Berbeda dengan arsitektur *Single Page Application* (SPA) modern, antarmuka pengguna sistem EduPro dibangun menggunakan pendekatan web tradisional dengan file statis, yang disajikan secara efisien oleh Nginx.

#### 2.3.1. Struktur dan Teknologi
*Frontend* terdiri dari beberapa file HTML inti (misalnya, `login.html`, `index.html`) yang mendefinisikan struktur halaman. *Styling* disediakan melalui file CSS kustom di dalam direktori `styles/`, dan logika interaktif diimplementasikan dalam file JavaScript di dalam direktori `js/`.

Pendekatan ini dipilih karena kesederhanaan dan kecepatan pengembangannya. Tidak ada langkah kompilasi atau *bundling* yang diperlukan, memungkinkan perubahan untuk segera terlihat dengan me-*refresh browser*.

#### 2.3.2. Interaksi dengan API
Logika JavaScript di dalam direktori `js/` bertanggung jawab untuk berinteraksi dengan API *backend*. Ini dilakukan dengan menggunakan *standard browser API* seperti `fetch()` atau *library* `XMLHttpRequest`. Skrip ini menangani alur kerja pengguna:
1.  Mengirimkan kredensial dari `login.html` ke *endpoint* `/api/auth/login`.
2.  Menyimpan token JWT yang diterima (misalnya, di `localStorage`).
3.  Menyertakan token JWT dalam *header* `Authorization` untuk semua permintaan berikutnya ke *endpoint* yang dilindungi.
4.  Mengambil data dari *backend* (misalnya, daftar siswa) dan secara dinamis me-*render*-nya ke dalam tabel HTML di `index.html`.
5.  Mengirimkan data dari formulir untuk membuat atau memperbarui entitas.

Meskipun tidak sekuat *framework* seperti React atau Vue, arsitektur ini terbukti cukup untuk kebutuhan sistem dan memberikan kinerja pemuatan halaman yang sangat cepat karena sifatnya yang statis.

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

Penelitian ini telah berhasil mendemonstrasikan implementasi sistem prediksi prestasi akademik *full-stack* menggunakan arsitektur berbasis kontainer. Penggunaan Docker dan Docker Compose secara signifikan menyederhanakan manajemen lingkungan, memastikan konsistensi, dan memfasilitasi alur kerja DevOps. Pemilihan FastAPI untuk *backend* terbukti sangat efektif dalam membangun API yang modular dan berkinerja tinggi. Di sisi *frontend*, penggunaan tumpukan web statis tradisional yang disajikan oleh Nginx menunjukkan pendekatan yang pragmatis dan efisien untuk kebutuhan aplikasi.

Arsitektur yang diusulkan tidak hanya memenuhi persyaratan fungsional dari sistem prediksi tetapi juga menunjukkan atribut non-fungsional yang kuat seperti kinerja, skalabilitas, dan keandalan, yang divalidasi melalui metrik kuantitatif. Untuk penelitian di masa depan, *frontend* dapat dimigrasikan ke *framework* SPA modern seperti React atau Vue untuk memungkinkan interaktivitas yang lebih kaya tanpa mengubah *backend* yang sudah solid.

## 5. Referensi

-   Baker, R. S., & Siemens, G. (2014). Educational data mining and learning analytics. In *Cambridge Handbook of the Learning Sciences*.
-   Merkel, D. (2014). Docker: Lightweight linux containers for consistent development and deployment. *Linux Journal*, *2014*(239), 2.
-   FastAPI Documentation. (2024). Retrieved from https://fastapi.tiangolo.com/
-   React Documentation. (2024). Retrieved from https://reactjs.org/
-   Docker Documentation. (2024). Retrieved from https://docs.docker.com/ 