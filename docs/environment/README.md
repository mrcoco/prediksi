# 🌍 Environment & Configuration Documentation

Dokumentasi terkait environment variables, konfigurasi aplikasi, dan setup environment untuk aplikasi EduPro.

## 📋 **Files dalam Directory Ini**

### **ENVIRONMENT-SETUP.md**
- **Deskripsi**: Panduan lengkap setup environment variables
- **Target Audience**: Developer, DevOps Engineer, System Administrator
- **Konten**:
  - Quick setup guide
  - Environment-specific configurations
  - Deployment scenarios
  - Verification & testing
  - Troubleshooting guide

### **IMPLEMENTASI_ENVIRONMENT_VARIABLES_2025-01-16.md**
- **Deskripsi**: Dokumentasi implementasi environment variables (16 Januari 2025)
- **Target Audience**: Developer, Technical Lead
- **Konten**:
  - Implementasi detail environment variables
  - Enhanced config.js dengan fallback mechanisms
  - Docker entrypoint script
  - Testing dan verification

## 🔧 **Environment Variables yang Diperlukan**

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `EDUPRO_API_URL` | Backend API endpoint | `http://backend:8000/api` | ✅ |
| `EDUPRO_APP_NAME` | Application name in UI | `EduPro` | ✅ |
| `EDUPRO_APP_VERSION` | Application version | `1.0.0` | ✅ |
| `EDUPRO_DEBUG` | Debug mode (true/false) | `true` | ✅ |

## 🌍 **Environment Configurations**

### **Development**
```bash
EDUPRO_API_URL=http://backend:8000/api
EDUPRO_APP_NAME=EduPro Dev
EDUPRO_APP_VERSION=1.0.0-dev
EDUPRO_DEBUG=true
```

### **Staging**
```bash
EDUPRO_API_URL=https://api-staging.yourdomain.com/api
EDUPRO_APP_NAME=EduPro Staging
EDUPRO_APP_VERSION=1.0.0-staging
EDUPRO_DEBUG=true
```

### **Production**
```bash
EDUPRO_API_URL=https://api.yourdomain.com/api
EDUPRO_APP_NAME=EduPro
EDUPRO_APP_VERSION=1.0.0
EDUPRO_DEBUG=false
```

## 🚀 **Quick Setup**

### **1. Buat File .env**
```bash
# Di root project (sama level dengan docker-compose.yml)
cat > .env << 'EOF'
EDUPRO_API_URL=http://backend:8000/api
EDUPRO_APP_NAME=EduPro
EDUPRO_APP_VERSION=1.0.0
EDUPRO_DEBUG=true
EOF
```

### **2. Atau Gunakan Helper Script**
```bash
# Interactive setup
./setup-env.sh
```

### **3. Verifikasi Setup**
```bash
# Test konfigurasi
docker-compose config

# Test di browser
open http://localhost/test-config.html
```

## 🔍 **Testing & Verification**

### **Browser Console Testing**
```javascript
// Cek konfigurasi yang dimuat
console.log(window.AppConfig.config);

// Cek environment variables dari Docker
console.log(window.ENV);

// Cek environment info
console.log(window.AppConfig.getEnvironmentInfo());
```

### **Container Testing**
```bash
# Cek environment variables di container
docker exec -it prestasi-siswa-frontend env | grep EDUPRO

# Cek file yang di-generate
docker exec -it prestasi-siswa-frontend cat /usr/share/nginx/html/env-config.js
```

## 🐛 **Common Issues**

### **Issue 1: Container gagal start**
```
ERROR: Invalid interpolation format for "environment" option
```
**Solution**: Pastikan file `.env` ada di root project

### **Issue 2: Environment variables tidak terbaca**
```
window.ENV is undefined
```
**Solution**: Rebuild container dan cek entrypoint script

### **Issue 3: API connection failed**
**Solution**: Gunakan `http://backend:8000/api` untuk Docker internal network

## 🔗 **Related Documentation**

- [`../docker/DOCKER-COMPOSE-REVIEW.md`](../docker/DOCKER-COMPOSE-REVIEW.md) - Docker configuration review
- [`../frontend/README-DOCKER-CONFIG.md`](../frontend/README-DOCKER-CONFIG.md) - Frontend Docker config
- [`../../setup-env.sh`](../../setup-env.sh) - Helper script untuk setup

## 📝 **Best Practices**

1. **File Management**:
   - ✅ Commit `.env.example` ke repository
   - ❌ **JANGAN** commit `.env` ke repository
   - ✅ Gunakan `.gitignore` untuk exclude `.env`

2. **Security**:
   - ❌ **JANGAN** hardcode sensitive data
   - ✅ Gunakan environment variables
   - ✅ Validate environment variables di entrypoint script

3. **Development Workflow**:
   - Setup environment → Build → Test → Deploy

## 🚨 **Breaking Changes**

**PENTING**: Setelah update docker-compose.yml, **WAJIB** membuat file `.env` sebelum menjalankan `docker-compose up`.

## 📞 **Support**

Jika mengalami masalah dengan environment setup:
1. Cek dokumentasi troubleshooting di ENVIRONMENT-SETUP.md
2. Gunakan helper script: `./setup-env.sh`
3. Test dengan: http://localhost/test-config.html 