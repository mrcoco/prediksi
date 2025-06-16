# Konfigurasi Environment Variables untuk Docker

## Masalah yang Dipecahkan

Aplikasi frontend EduPro berjalan sebagai static files di dalam container Docker dengan Nginx. Browser tidak dapat mengakses environment variables dari Docker container secara langsung, sehingga konfigurasi API URL dan setting lainnya tidak dapat dibaca.

## Solusi yang Diimplementasikan

### 1. Docker Entrypoint Script (`docker-entrypoint.sh`)

Script ini akan:
- Membaca environment variables dari Docker container
- Membuat file JavaScript (`env-config.js`) yang berisi konfigurasi
- Inject script tersebut ke dalam semua file HTML
- Menjalankan Nginx server

### 2. Enhanced Config.js

File `js/config.js` telah diupdate dengan:
- **Multiple fallback mechanisms** untuk membaca konfigurasi
- **Auto-detection environment** berdasarkan hostname dan protocol
- **Dynamic API URL** berdasarkan environment
- **Development helpers** untuk override konfigurasi
- **API connectivity testing** untuk debugging

### 3. Docker Configuration

#### Environment Variables yang Didukung:

```bash
EDUPRO_API_URL=http://backend:8000/api    # URL endpoint API
EDUPRO_APP_NAME=EduPro                    # Nama aplikasi
EDUPRO_APP_VERSION=1.0.0                  # Versi aplikasi
EDUPRO_DEBUG=true                         # Debug mode
```

#### Docker Compose Configuration:

**⚠️ PENTING: Perubahan Konfigurasi**

Docker Compose sekarang menggunakan environment variables untuk fleksibilitas:

```yaml
frontend:
  build: ./frontend
  environment:
    - EDUPRO_API_URL=${EDUPRO_API_URL}
    - EDUPRO_APP_NAME=${EDUPRO_APP_NAME}
    - EDUPRO_APP_VERSION=${EDUPRO_APP_VERSION}
    - EDUPRO_DEBUG=${EDUPRO_DEBUG}
  volumes:
    - ./frontend:/usr/share/nginx/html  # Restored for development
```

**Diperlukan file .env di root project:**

```bash
# Frontend Configuration
EDUPRO_API_URL=http://backend:8000/api
EDUPRO_APP_NAME=EduPro
EDUPRO_APP_VERSION=1.0.0
EDUPRO_DEBUG=true
```

## Cara Penggunaan

### 1. Development Local

```bash
# Tidak perlu environment variables, akan menggunakan default
# API_URL: http://localhost:8000/api
# DEBUG: true
```

### 2. Docker Development

```bash
# WAJIB: Buat file .env terlebih dahulu
cat > .env << EOF
EDUPRO_API_URL=http://backend:8000/api
EDUPRO_APP_NAME=EduPro
EDUPRO_APP_VERSION=1.0.0
EDUPRO_DEBUG=true
EOF

# Build dan jalankan dengan docker-compose
docker-compose up --build

# Environment variables akan di-inject otomatis
# API_URL: http://backend:8000/api (internal container network)
```

### 3. Production Deployment

```bash
# Set environment variables untuk production
export EDUPRO_API_URL=https://api.yourdomain.com/api
export EDUPRO_APP_NAME=EduPro
export EDUPRO_APP_VERSION=1.0.0
export EDUPRO_DEBUG=false

# Build dan deploy
docker build -t edupro-frontend .
docker run -p 80:80 \
  -e EDUPRO_API_URL=https://api.yourdomain.com/api \
  -e EDUPRO_DEBUG=false \
  edupro-frontend
```

## Debugging

### 1. Cek Environment Variables

Buka browser console dan jalankan:

```javascript
// Lihat konfigurasi yang dimuat
console.log(window.AppConfig.config);

// Lihat informasi environment
console.log(window.AppConfig.getEnvironmentInfo());

// Lihat environment variables yang di-inject Docker
console.log(window.ENV);
```

### 2. Override Konfigurasi (Development)

```javascript
// Override API URL untuk testing
window.AppConfig.setConfigOverride('EDUPRO_API_URL', 'http://localhost:3000/api');

// Clear semua override
window.AppConfig.clearConfigOverrides();
```

### 3. Test API Connectivity

Jika debug mode aktif, aplikasi akan otomatis test konektivitas ke API dan menampilkan hasilnya di console.

## Troubleshooting

### 1. API URL Tidak Terbaca

**Gejala:** Aplikasi tidak bisa connect ke backend API

**Solusi:**
1. Cek environment variables di Docker container:
   ```bash
   docker exec -it prestasi-siswa-frontend env | grep EDUPRO
   ```

2. Cek apakah `env-config.js` ter-generate:
   ```bash
   docker exec -it prestasi-siswa-frontend cat /usr/share/nginx/html/env-config.js
   ```

3. Cek browser console untuk error

### 2. Environment Variables Tidak Ter-inject

**Gejala:** `window.ENV` undefined di browser

**Solusi:**
1. Pastikan `docker-entrypoint.sh` executable:
   ```bash
   chmod +x frontend/docker-entrypoint.sh
   ```

2. Rebuild Docker image:
   ```bash
   docker-compose build frontend
   ```

### 3. CORS Error

**Gejala:** Browser menampilkan CORS error saat akses API

**Solusi:**
1. Untuk Docker, gunakan internal network:
   ```
   EDUPRO_API_URL=http://backend:8000/api
   ```

2. Untuk external access, pastikan backend mengizinkan CORS dari frontend domain

## File Structure

```
frontend/
├── docker-entrypoint.sh       # Script untuk inject env vars
├── Dockerfile                 # Docker configuration
├── js/
│   └── config.js              # Enhanced configuration management
├── index.html                 # Main application (akan di-inject)
├── login.html                 # Login page (akan di-inject)
└── README-DOCKER-CONFIG.md    # Dokumentasi ini
```

## Environment Detection Logic

1. **Production**: HTTPS protocol atau domain bukan localhost
2. **Development**: localhost, 127.0.0.1, atau IP 192.168.x.x
3. **Docker**: Hostname bukan localhost tapi HTTP protocol

## API URL Priority

1. Environment variable `EDUPRO_API_URL`
2. Auto-detection berdasarkan environment:
   - Production: `https://api.edupro.com/api`
   - Docker: `http://{hostname}:8000/api`
   - Development: `http://localhost:8000/api` 