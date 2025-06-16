# Implementasi Environment Variables Frontend - 16 Januari 2025

## Overview
Implementasi environment variables untuk frontend aplikasi Prestasi Siswa agar konfigurasi dapat diubah secara dinamis tanpa perlu mengubah kode. Ini memudahkan deployment ke berbagai environment (development, staging, production).

## File yang Dibuat/Dimodifikasi

### 1. File `.env` (Environment Configuration)
```bash
# Frontend Environment Configuration
# API Base URL - sesuaikan dengan environment yang digunakan
VITE_API_URL=http://localhost:8000/api

# Development settings
VITE_APP_NAME=Prestasi Siswa
VITE_APP_VERSION=1.0.0
VITE_DEBUG=true

# Production settings (uncomment untuk production)
# VITE_API_URL=https://api.prestasi-siswa.com/api
# VITE_DEBUG=false
```

### 2. File `js/config.js` (Configuration Management)
File ini mengelola pembacaan environment variables dan menyediakan konfigurasi terpusat untuk aplikasi.

#### Fitur Utama:
- **Multi-environment Support**: Mendukung Vite, Node.js, dan browser environment
- **Fallback System**: Jika environment variable tidak tersedia, menggunakan default values
- **Configuration Validation**: Validasi konfigurasi saat aplikasi dimuat
- **Debug Logging**: Logging yang dapat diaktifkan/nonaktifkan via environment
- **Centralized Config**: Semua konfigurasi aplikasi dalam satu tempat

#### Konfigurasi yang Tersedia:
```javascript
const config = {
    // API Configuration
    API_URL: getEnvVar('VITE_API_URL', 'http://localhost:8000/api'),
    
    // App Information
    APP_NAME: getEnvVar('VITE_APP_NAME', 'Prestasi Siswa'),
    APP_VERSION: getEnvVar('VITE_APP_VERSION', '1.0.0'),
    
    // Debug Settings
    DEBUG: getEnvVar('VITE_DEBUG', 'false') === 'true',
    
    // Token Configuration
    TOKEN_KEY: 'access_token',
    
    // UI Configuration
    DEFAULT_PAGE_SIZE: 10,
    NOTIFICATION_TIMEOUT: 3000,
    
    // Validation Rules
    PASSWORD_MIN_LENGTH: 6,
    USERNAME_MIN_LENGTH: 3,
    
    // File Upload
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_FILE_TYPES: ['.xlsx', '.xls'],
    
    // Chart Colors
    CHART_COLORS: {
        TINGGI: '#28a745',
        SEDANG: '#ffc107', 
        RENDAH: '#dc3545'
    }
};
```

### 3. File `js/app.js` (Updated)
Diupdate untuk menggunakan konfigurasi dari `config.js`:

```javascript
// Konfigurasi global dari environment variables
const API_URL = window.AppConfig ? window.AppConfig.config.API_URL : 'http://localhost:8000/api';
const TOKEN_KEY = window.AppConfig ? window.AppConfig.config.TOKEN_KEY : 'access_token';

// Validasi konfigurasi
if (window.AppConfig && !window.AppConfig.validateConfig()) {
    console.error('Konfigurasi aplikasi tidak valid. Menggunakan default values.');
}

// Log environment info jika debug mode aktif
if (window.AppConfig && window.AppConfig.config.DEBUG) {
    window.AppConfig.debugLog('App initialized with config', window.AppConfig.getEnvironmentInfo());
}
```

### 4. File `index.html` (Updated)
Ditambahkan script loading untuk `config.js`:

```html
<!-- Configuration JS -->
<script src="js/config.js"></script>

<!-- Custom JS -->
<script>
    var timestamp = Math.floor(Date.now() / 1000);
    document.write('<script src="js/config.js?v=' + timestamp + '"><\/script>');
    document.write('<script src="js/app.js?v=' + timestamp + '"><\/script>');
</script>
```

### 5. File `.env.example` (Template)
Template file untuk environment variables yang dapat di-copy oleh developer lain.

### 6. File `.gitignore` (Updated)
Ditambahkan `.env` agar file konfigurasi lokal tidak ter-commit ke repository.

## Cara Penggunaan

### Development Environment
1. Copy `.env.example` ke `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit file `.env` sesuai kebutuhan development:
   ```bash
   VITE_API_URL=http://localhost:8000/api
   VITE_DEBUG=true
   ```

### Staging Environment
```bash
VITE_API_URL=https://staging-api.prestasi-siswa.com/api
VITE_DEBUG=true
VITE_APP_NAME=Prestasi Siswa (Staging)
```

### Production Environment
```bash
VITE_API_URL=https://api.prestasi-siswa.com/api
VITE_DEBUG=false
VITE_APP_NAME=Prestasi Siswa
```

## Keuntungan Implementasi

### ✅ Flexibility
- Konfigurasi dapat diubah tanpa mengubah kode
- Mudah beralih antar environment
- Mendukung multiple deployment scenarios

### ✅ Security
- Sensitive configuration tidak hardcoded dalam kode
- File `.env` tidak ter-commit ke repository
- Setiap environment memiliki konfigurasi terpisah

### ✅ Maintainability
- Konfigurasi terpusat dalam satu file
- Mudah untuk debugging dengan flag DEBUG
- Validation otomatis untuk konfigurasi

### ✅ Developer Experience
- Template `.env.example` untuk onboarding developer baru
- Debug logging yang dapat diaktifkan/nonaktifkan
- Environment info yang jelas di console

## Fungsi Helper yang Tersedia

### 1. `debugLog(message, data)`
```javascript
// Hanya akan log jika DEBUG=true
window.AppConfig.debugLog('User logged in', userData);
```

### 2. `validateConfig()`
```javascript
// Validasi konfigurasi aplikasi
if (!window.AppConfig.validateConfig()) {
    console.error('Invalid configuration');
}
```

### 3. `getEnvironmentInfo()`
```javascript
// Mendapatkan informasi environment
const envInfo = window.AppConfig.getEnvironmentInfo();
console.log(envInfo);
// Output: { name: 'development', apiUrl: 'http://localhost:8000/api', debug: true, version: '1.0.0' }
```

## Backward Compatibility

Implementasi ini tetap backward compatible. Jika file `config.js` tidak dimuat atau environment variables tidak tersedia, aplikasi akan menggunakan default values yang sudah ada.

```javascript
// Fallback ke default jika config tidak tersedia
const API_URL = window.AppConfig ? window.AppConfig.config.API_URL : 'http://localhost:8000/api';
```

## Best Practices

### 1. Environment Variables Naming
- Gunakan prefix `VITE_` untuk semua environment variables
- Gunakan UPPER_CASE dengan underscore
- Nama yang descriptive dan jelas

### 2. Default Values
- Selalu sediakan default values yang reasonable
- Default values harus aman untuk development
- Jangan gunakan production values sebagai default

### 3. Validation
- Validasi semua konfigurasi critical saat aplikasi start
- Berikan error message yang jelas jika konfigurasi invalid
- Fallback ke safe defaults jika memungkinkan

### 4. Documentation
- Dokumentasikan semua environment variables di `.env.example`
- Berikan komentar yang jelas untuk setiap variable
- Update dokumentasi saat menambah variable baru

## Deployment Instructions

### Development
```bash
# 1. Copy template
cp .env.example .env

# 2. Edit sesuai kebutuhan local development
nano .env

# 3. Start application
# (aplikasi akan otomatis membaca .env)
```

### Production
```bash
# 1. Set environment variables di server
export VITE_API_URL=https://api.prestasi-siswa.com/api
export VITE_DEBUG=false

# 2. Atau buat file .env di server
echo "VITE_API_URL=https://api.prestasi-siswa.com/api" > .env
echo "VITE_DEBUG=false" >> .env

# 3. Deploy aplikasi
```

## Testing

### 1. Test Different Environments
```javascript
// Test dengan berbagai konfigurasi API_URL
localStorage.setItem('test_api_url', 'http://test-api.com');
window.location.reload();
```

### 2. Test Configuration Validation
```javascript
// Test validasi konfigurasi
window.AppConfig.config.API_URL = '';
console.log(window.AppConfig.validateConfig()); // Should return false
```

### 3. Test Debug Mode
```javascript
// Test debug logging
window.AppConfig.config.DEBUG = true;
window.AppConfig.debugLog('Test message', { test: 'data' });
```

## Troubleshooting

### Problem: Environment variables tidak terbaca
**Solution**: 
1. Pastikan file `.env` ada di root directory frontend
2. Pastikan format environment variables benar (VITE_VARIABLE_NAME=value)
3. Restart development server jika menggunakan bundler

### Problem: Konfigurasi tidak ter-update
**Solution**:
1. Clear browser cache
2. Hard refresh (Ctrl+F5)
3. Pastikan `config.js` dimuat sebelum `app.js`

### Problem: Production deployment gagal
**Solution**:
1. Pastikan environment variables di-set di production server
2. Pastikan file `.env` tidak ter-commit ke repository
3. Validasi konfigurasi production sebelum deployment

## Future Enhancements

1. **Runtime Configuration**: Kemampuan mengubah konfigurasi tanpa restart
2. **Configuration UI**: Interface untuk mengubah konfigurasi via web
3. **Environment Detection**: Auto-detect environment berdasarkan domain
4. **Configuration Encryption**: Enkripsi untuk sensitive configuration
5. **Configuration Versioning**: Versioning untuk konfigurasi

## Conclusion

Implementasi environment variables ini memberikan foundation yang solid untuk manajemen konfigurasi aplikasi. Dengan pendekatan ini, aplikasi menjadi lebih flexible, secure, dan mudah di-maintain untuk berbagai environment deployment. 