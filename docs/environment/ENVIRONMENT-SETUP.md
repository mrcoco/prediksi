# Environment Variables Setup Guide

## 📋 Overview

Dokumen ini menjelaskan cara setup environment variables untuk aplikasi EduPro setelah perubahan docker-compose.yml yang menggunakan environment variables untuk konfigurasi frontend.

## 🚨 **PENTING: Perubahan Breaking**

Setelah update docker-compose.yml, **WAJIB** membuat file `.env` di root project sebelum menjalankan `docker-compose up`.

## 🛠️ **Quick Setup**

### 1. **Buat File .env**

Di root project (sama level dengan docker-compose.yml):

```bash
# Buat file .env dengan konfigurasi default
cat > .env << 'EOF'
# Frontend Configuration
EDUPRO_API_URL=http://backend:8000/api
EDUPRO_APP_NAME=EduPro
EDUPRO_APP_VERSION=1.0.0
EDUPRO_DEBUG=true
EOF
```

### 2. **Jalankan Docker Compose**

```bash
docker-compose up --build
```

### 3. **Verifikasi Setup**

Akses: http://localhost/test-config.html

## 📁 **File Structure**

```
prestasi-siswa/
├── .env                    # Environment variables (WAJIB dibuat)
├── .env.example           # Template (akan dibuat)
├── docker-compose.yml     # Updated dengan env vars
├── DOCKER-COMPOSE-REVIEW.md
├── ENVIRONMENT-SETUP.md   # Dokumen ini
├── frontend/
│   ├── docker-entrypoint.sh
│   ├── Dockerfile
│   ├── js/config.js
│   ├── test-config.html
│   └── README-DOCKER-CONFIG.md
└── backend/
```

## 🔧 **Environment Variables yang Diperlukan**

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `EDUPRO_API_URL` | URL endpoint backend API | `http://backend:8000/api` | ✅ |
| `EDUPRO_APP_NAME` | Nama aplikasi di UI | `EduPro` | ✅ |
| `EDUPRO_APP_VERSION` | Versi aplikasi | `1.0.0` | ✅ |
| `EDUPRO_DEBUG` | Debug mode (true/false) | `true` | ✅ |

## 🌍 **Environment-Specific Configurations**

### **Development (.env)**
```bash
EDUPRO_API_URL=http://backend:8000/api
EDUPRO_APP_NAME=EduPro Dev
EDUPRO_APP_VERSION=1.0.0-dev
EDUPRO_DEBUG=true
```

### **Staging (.env.staging)**
```bash
EDUPRO_API_URL=https://api-staging.yourdomain.com/api
EDUPRO_APP_NAME=EduPro Staging
EDUPRO_APP_VERSION=1.0.0-staging
EDUPRO_DEBUG=true
```

### **Production (.env.production)**
```bash
EDUPRO_API_URL=https://api.yourdomain.com/api
EDUPRO_APP_NAME=EduPro
EDUPRO_APP_VERSION=1.0.0
EDUPRO_DEBUG=false
```

## 🚀 **Deployment Scenarios**

### **Local Development**
```bash
# Setup
cp .env.example .env
nano .env  # Edit as needed

# Run
docker-compose up --build
```

### **CI/CD Pipeline**
```bash
# Set environment variables in CI/CD
export EDUPRO_API_URL=https://api.yourdomain.com/api
export EDUPRO_APP_NAME="EduPro Production"
export EDUPRO_APP_VERSION=1.0.0
export EDUPRO_DEBUG=false

# Deploy
docker-compose up -d --build
```

### **Docker Swarm/Kubernetes**
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  frontend:
    environment:
      - EDUPRO_API_URL=https://api.yourdomain.com/api
      - EDUPRO_DEBUG=false
```

## 🔍 **Verification & Testing**

### 1. **Cek Environment Variables**
```bash
# Lihat konfigurasi yang akan digunakan
docker-compose config

# Cek environment variables di container
docker exec -it prestasi-siswa-frontend env | grep EDUPRO
```

### 2. **Test Configuration**
```bash
# Akses test page
curl http://localhost/test-config.html

# Atau buka di browser
open http://localhost/test-config.html
```

### 3. **Browser Console Testing**
```javascript
// Cek konfigurasi yang dimuat
console.log(window.AppConfig.config);

// Cek environment variables dari Docker
console.log(window.ENV);

// Cek environment info
console.log(window.AppConfig.getEnvironmentInfo());
```

## 🐛 **Troubleshooting**

### **Error: Container gagal start**

**Gejala:**
```
ERROR: The Compose file './docker-compose.yml' is invalid because:
Invalid interpolation format for "environment" option
```

**Solusi:**
```bash
# Pastikan file .env ada
ls -la .env

# Jika tidak ada, buat file .env
cat > .env << 'EOF'
EDUPRO_API_URL=http://backend:8000/api
EDUPRO_APP_NAME=EduPro
EDUPRO_APP_VERSION=1.0.0
EDUPRO_DEBUG=true
EOF
```

### **Error: Environment variables tidak terbaca**

**Gejala:** window.ENV undefined di browser

**Solusi:**
```bash
# Cek apakah env-config.js ter-generate
docker exec -it prestasi-siswa-frontend cat /usr/share/nginx/html/env-config.js

# Cek logs container
docker-compose logs frontend

# Restart container
docker-compose restart frontend
```

### **Error: API tidak bisa diakses**

**Gejala:** CORS error atau connection refused

**Solusi:**
```bash
# Untuk Docker internal network, gunakan:
EDUPRO_API_URL=http://backend:8000/api

# Untuk external access, gunakan:
EDUPRO_API_URL=http://localhost:8000/api

# Cek network connectivity
docker exec -it prestasi-siswa-frontend ping backend
```

## 📝 **Best Practices**

### 1. **File Management**
- ✅ Commit `.env.example` ke repository
- ❌ Jangan commit `.env` ke repository
- ✅ Gunakan `.gitignore` untuk exclude `.env`
- ✅ Dokumentasikan semua environment variables

### 2. **Security**
- ❌ Jangan hardcode sensitive data di docker-compose.yml
- ✅ Gunakan environment variables untuk konfigurasi
- ✅ Validate environment variables di entrypoint script
- ✅ Gunakan secrets untuk production deployment

### 3. **Development Workflow**
```bash
# 1. Clone repository
git clone <repo>

# 2. Setup environment
cp .env.example .env
nano .env

# 3. Build and run
docker-compose up --build

# 4. Test configuration
open http://localhost/test-config.html
```

## 📊 **Migration Checklist**

Jika upgrade dari versi sebelumnya:

- [ ] Backup docker-compose.yml lama
- [ ] Update docker-compose.yml dengan environment variables
- [ ] Buat file .env dengan konfigurasi yang sesuai
- [ ] Test dengan `docker-compose config`
- [ ] Build dan test dengan `docker-compose up --build`
- [ ] Verifikasi dengan test-config.html
- [ ] Update dokumentasi deployment
- [ ] Inform team tentang perubahan

## 🎯 **Summary**

Perubahan ini meningkatkan:
- **Fleksibilitas**: Konfigurasi per environment
- **Keamanan**: Tidak ada hardcoded values
- **Maintainability**: Mudah dikelola
- **Scalability**: Mendukung multiple deployment

**Action Required**: Semua developer dan deployment pipeline harus membuat file `.env` sebelum menjalankan docker-compose. 