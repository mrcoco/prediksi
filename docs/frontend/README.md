# 🎨 Frontend Documentation

Dokumentasi terkait frontend, konfigurasi Docker frontend, dan implementasi UI untuk aplikasi EduPro.

## 📋 **Files dalam Directory Ini**

### **README-DOCKER-CONFIG.md**
- **Deskripsi**: Konfigurasi Docker untuk frontend dan environment variables
- **Target Audience**: Frontend Developer, DevOps Engineer
- **Konten**:
  - Masalah yang dipecahkan (static files di Docker)
  - Solusi environment variables injection
  - Enhanced config.js dengan fallback mechanisms
  - Docker entrypoint script implementation
  - Testing dan troubleshooting

## 🔧 **Frontend Architecture**

### **Environment Variables Management**
- **Enhanced config.js**: Multiple fallback mechanisms untuk membaca environment variables
- **Auto-detection environment**: Berdasarkan hostname dan protocol
- **Dynamic API URL**: Berdasarkan environment (development/staging/production)
- **Development helpers**: Override konfigurasi untuk testing

### **Docker Integration**
- **Entrypoint Script**: Inject environment variables ke static HTML files
- **Environment Detection**: Production, Development, Docker environments
- **API Connectivity Testing**: Automatic testing untuk debugging

## 🚀 **Frontend Setup**

### **Development (Local)**
```bash
# Tidak perlu environment variables, akan menggunakan default
# API_URL: http://localhost:8000/api
# DEBUG: true
```

### **Docker Development**
```bash
# Environment variables akan di-inject otomatis
# API_URL: http://backend:8000/api (internal container network)

# Test konfigurasi
open http://localhost/test-config.html
```

### **Production**
```bash
# Set environment variables untuk production
export EDUPRO_API_URL=https://api.yourdomain.com/api
export EDUPRO_DEBUG=false
```

## 🔍 **Testing Frontend Configuration**

### **Test Page**
Akses: `http://localhost/test-config.html`

### **Browser Console Testing**
```javascript
// Cek konfigurasi yang dimuat
console.log(window.AppConfig.config);

// Cek environment variables yang di-inject Docker
console.log(window.ENV);

// Cek environment info
console.log(window.AppConfig.getEnvironmentInfo());

// Override konfigurasi (development only)
window.AppConfig.setConfigOverride('EDUPRO_API_URL', 'http://localhost:3000/api');

// Clear overrides
window.AppConfig.clearConfigOverrides();
```

## 🐛 **Frontend Troubleshooting**

### **Issue 1: API URL tidak terbaca**
**Gejala**: Aplikasi tidak bisa connect ke backend API

**Solusi**:
1. Cek environment variables di Docker container
2. Cek apakah `env-config.js` ter-generate
3. Cek browser console untuk error

### **Issue 2: Environment variables tidak ter-inject**
**Gejala**: `window.ENV` undefined di browser

**Solusi**:
1. Pastikan `docker-entrypoint.sh` executable
2. Rebuild Docker image
3. Cek logs container

### **Issue 3: CORS Error**
**Gejala**: Browser menampilkan CORS error saat akses API

**Solusi**:
1. Untuk Docker, gunakan internal network: `http://backend:8000/api`
2. Untuk external access, pastikan backend mengizinkan CORS

## 📁 **Frontend File Structure**

```
frontend/
├── docker-entrypoint.sh       # Script untuk inject env vars
├── Dockerfile                 # Docker configuration
├── js/
│   └── config.js              # Enhanced configuration management
├── index.html                 # Main application (akan di-inject)
├── login.html                 # Login page (akan di-inject)
└── test-config.html           # Configuration testing page
```

## 🔧 **Environment Detection Logic**

1. **Production**: HTTPS protocol atau domain bukan localhost
2. **Development**: localhost, 127.0.0.1, atau IP 192.168.x.x
3. **Docker**: Hostname bukan localhost tapi HTTP protocol

## 🎯 **API URL Priority**

1. Environment variable `EDUPRO_API_URL`
2. Auto-detection berdasarkan environment:
   - Production: `https://api.edupro.com/api`
   - Docker: `http://{hostname}:8000/api`
   - Development: `http://localhost:8000/api`

## 🔗 **Related Documentation**

- [`../environment/ENVIRONMENT-SETUP.md`](../environment/ENVIRONMENT-SETUP.md) - Setup environment variables
- [`../docker/DOCKER-COMPOSE-REVIEW.md`](../docker/DOCKER-COMPOSE-REVIEW.md) - Docker configuration
- [`../../setup-env.sh`](../../setup-env.sh) - Helper script untuk setup

## 📝 **Frontend Best Practices**

### **1. Configuration Management**
- Gunakan environment variables untuk konfigurasi
- Implement fallback mechanisms untuk robustness
- Auto-detect environment untuk dynamic configuration

### **2. Development Workflow**
- Test konfigurasi dengan test-config.html
- Gunakan browser console untuk debugging
- Override konfigurasi untuk testing (development only)

### **3. Production Deployment**
- Set environment variables dengan benar
- Disable debug mode untuk production
- Test konektivitas API sebelum deployment

## 📈 **Monitoring & Logging**

### **Browser Console Logging**
Jika debug mode aktif, akan ada logging di browser console:

```javascript
[2025-01-16T10:30:00.000Z] [EduPro] Configuration loaded
[Docker] Environment variables injected: {EDUPRO_API_URL: "http://backend:8000/api", ...}
```

### **API Connectivity Testing**
Jika debug mode aktif, aplikasi akan otomatis test konektivitas ke API dan menampilkan hasilnya di console.

## 📞 **Support**

Jika mengalami masalah dengan frontend configuration:
1. Cek dokumentasi troubleshooting di README-DOCKER-CONFIG.md
2. Test dengan: http://localhost/test-config.html
3. Cek browser console untuk error messages
4. Validate environment variables di container 