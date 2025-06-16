/**
 * Configuration Management for Prestasi Siswa Frontend
 * Mengelola environment variables dan konfigurasi aplikasi
 */

// Fungsi untuk membaca environment variables
function getEnvVar(name, defaultValue = '') {
    // Cek apakah running di environment yang mendukung import.meta.env (Vite)
    if (typeof window !== 'undefined' && window.import && window.import.meta && window.import.meta.env) {
        return window.import.meta.env[name] || defaultValue;
    }
    
    // Fallback untuk environment lain atau jika tidak ada Vite
    if (typeof process !== 'undefined' && process.env) {
        return process.env[name] || defaultValue;
    }
    
    // Fallback untuk browser environment tanpa bundler
    if (typeof window !== 'undefined' && window.ENV) {
        return window.ENV[name] || defaultValue;
    }
    
    return defaultValue;
}

// Konfigurasi aplikasi
const config = {
    // API Configuration
    API_URL: getEnvVar('EDUPRO', 'http://localhost:8000/api'),
    
    // App Information
    APP_NAME: getEnvVar('EDUPRO', 'EduPro'),
    APP_VERSION: getEnvVar('EDUPRO', '1.0.0'),
    
    // Debug Settings
    DEBUG: getEnvVar('EDUPRO', 'false') === 'true',
    
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

// Fungsi helper untuk logging (hanya jika debug mode aktif)
function debugLog(message, data = null) {
    if (config.DEBUG) {
        console.log(`[${config.APP_NAME}] ${message}`, data || '');
    }
}

// Fungsi untuk validasi konfigurasi
function validateConfig() {
    const errors = [];
    
    if (!config.API_URL) {
        errors.push('API_URL tidak boleh kosong');
    }
    
    if (!config.API_URL.startsWith('http')) {
        errors.push('API_URL harus dimulai dengan http:// atau https://');
    }
    
    if (errors.length > 0) {
        console.error('Konfigurasi tidak valid:', errors);
        return false;
    }
    
    return true;
}

// Fungsi untuk mendapatkan environment info
function getEnvironmentInfo() {
    return {
        name: config.API_URL.includes('localhost') ? 'development' : 'production',
        apiUrl: config.API_URL,
        debug: config.DEBUG,
        version: config.APP_VERSION
    };
}

// Export konfigurasi
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = {
        config,
        debugLog,
        validateConfig,
        getEnvironmentInfo
    };
} else {
    // Browser environment
    window.AppConfig = {
        config,
        debugLog,
        validateConfig,
        getEnvironmentInfo
    };
}

// Log informasi environment saat config dimuat
debugLog('Configuration loaded', getEnvironmentInfo()); 