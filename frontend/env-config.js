// Environment variables injected by Docker
window.ENV = {
    'EDUPRO_API_URL': 'http://localhost/api',
    'EDUPRO_APP_NAME': 'EduPro',
    'EDUPRO_APP_VERSION': '1.0.0',
    'EDUPRO_DEBUG': 'false'
};

console.log('[Docker] Environment variables injected:', window.ENV);
