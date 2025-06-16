/**
 * Configuration Management for EduPro Frontend
 * Mengelola environment variables dan konfigurasi aplikasi
 * Mendukung Docker environment dan static file deployment
 */

// Fungsi untuk membaca environment variables dengan fallback yang lebih robust
function getEnvVar(name, defaultValue = '') {
    // 1. Cek window.ENV (injected by Docker/server)
    if (typeof window !== 'undefined' && window.ENV && window.ENV[name]) {
        return window.ENV[name];
    }
    
    // 2. Cek apakah running di environment yang mendukung import.meta.env (Vite)
    if (typeof window !== 'undefined' && window.import && window.import.meta && window.import.meta.env) {
        return window.import.meta.env[name] || defaultValue;
    }
    
    // 3. Fallback untuk Node.js environment
    if (typeof process !== 'undefined' && process.env) {
        return process.env[name] || defaultValue;
    }
    
    // 4. Cek localStorage untuk override (development)
    if (typeof window !== 'undefined' && window.localStorage) {
        const localValue = window.localStorage.getItem(`config_${name}`);
        if (localValue !== null) {
            return localValue;
        }
    }
    
    // 5. Cek data attributes di HTML
    if (typeof document !== 'undefined') {
        const configElement = document.querySelector('[data-config]');
        if (configElement && configElement.dataset[name.toLowerCase()]) {
            return configElement.dataset[name.toLowerCase()];
        }
    }
    
    return defaultValue;
}

// Deteksi environment berdasarkan URL dan context
function detectEnvironment() {
    if (typeof window === 'undefined') return 'server';
    
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')) {
        return 'development';
    }
    
    if (protocol === 'https:') {
        return 'production';
    }
    
    return 'development';
}

// Konfigurasi aplikasi dengan environment-specific defaults
const environment = detectEnvironment();
const config = {
    // API Configuration - Dynamic based on environment
    API_URL: getEnvVar('EDUPRO_API_URL', 
        environment === 'production' 
            ? 'https://api.edupro.com/api'  // Production default
            : (typeof window !== 'undefined' && window.location.hostname !== 'localhost')
                ? `http://${window.location.hostname}:8000/api`  // Docker/network default
                : 'http://localhost:8000/api'  // Local development default
    ),
    
    // App Information
    APP_NAME: getEnvVar('EDUPRO_APP_NAME', 'EduPro'),
    APP_VERSION: getEnvVar('EDUPRO_APP_VERSION', '1.0.0'),
    
    // Debug Settings - Auto-detect based on environment
    DEBUG: getEnvVar('EDUPRO_DEBUG', environment === 'development' ? 'true' : 'false') === 'true',
    
    // Environment info
    ENVIRONMENT: environment,
    
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
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] [${config.APP_NAME}] ${message}`, data || '');
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
    
    // Test API connectivity (optional)
    if (typeof window !== 'undefined' && config.DEBUG) {
        testApiConnectivity();
    }
    
    if (errors.length > 0) {
        console.error('Konfigurasi tidak valid:', errors);
        return false;
    }
    
    return true;
}

// Fungsi untuk test konektivitas API
function testApiConnectivity() {
    if (typeof fetch === 'undefined') return;
    
    const testUrl = config.API_URL.replace('/api', '/health');
    
    fetch(testUrl, { 
        method: 'GET',
        timeout: 5000 
    })
    .then(response => {
        if (response.ok) {
            debugLog('API connectivity test: SUCCESS', testUrl);
        } else {
            debugLog('API connectivity test: FAILED', `${testUrl} - Status: ${response.status}`);
        }
    })
    .catch(error => {
        debugLog('API connectivity test: ERROR', `${testUrl} - ${error.message}`);
    });
}

// Fungsi untuk mendapatkan environment info
function getEnvironmentInfo() {
    return {
        environment: config.ENVIRONMENT,
        apiUrl: config.API_URL,
        debug: config.DEBUG,
        version: config.APP_VERSION,
        hostname: typeof window !== 'undefined' ? window.location.hostname : 'unknown',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
    };
}

// Fungsi untuk override konfigurasi (development helper)
function setConfigOverride(key, value) {
    if (typeof window !== 'undefined' && window.localStorage && config.DEBUG) {
        window.localStorage.setItem(`config_${key}`, value);
        debugLog(`Configuration override set: ${key} = ${value}`);
        // Reload config
        location.reload();
    }
}

// Fungsi untuk clear override konfigurasi
function clearConfigOverrides() {
    if (typeof window !== 'undefined' && window.localStorage) {
        const keys = Object.keys(window.localStorage);
        keys.forEach(key => {
            if (key.startsWith('config_')) {
                window.localStorage.removeItem(key);
            }
        });
        debugLog('All configuration overrides cleared');
    }
}

// Export konfigurasi
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = {
        config,
        debugLog,
        validateConfig,
        getEnvironmentInfo,
        setConfigOverride,
        clearConfigOverrides
    };
} else {
    // Browser environment
    window.AppConfig = {
        config,
        debugLog,
        validateConfig,
        getEnvironmentInfo,
        setConfigOverride,
        clearConfigOverrides
    };
    
    // Auto-validate on load
    if (typeof window !== 'undefined') {
        window.addEventListener('DOMContentLoaded', function() {
            validateConfig();
        });
    }
}

// Log informasi environment saat config dimuat
debugLog('Configuration loaded', getEnvironmentInfo()); 