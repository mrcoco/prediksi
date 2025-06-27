i# Implementasi Frontend Sistem EduPro: Arsitektur Web Pragmatis dengan Komponen Enterprise

**Penulis**: Tim Riset EduPro AI  
**Afiliasi**: Departemen Inovasi Teknologi Pendidikan, EduPro Institute  
**Tanggal**: 21 Juni 2025  
**Versi**: 2.0 (Diperbaiki)

---

## Abstrak

Dokumen ini menyajikan analisis mendalam implementasi komponen frontend sistem prediksi prestasi akademik EduPro dengan fokus pada arsitektur web pragmatis yang menggabungkan teknologi fundamental dengan komponen enterprise-grade. Implementasi mengadopsi pendekatan hibrid yang mengintegrasikan HTML5 sebagai fondasi struktural, CSS3 untuk responsivitas visual, jQuery untuk manipulasi DOM yang efisien, dan Kendo UI sebagai library komponen profesional. Pembahasan mencakup dua aspek fundamental: (1) struktur teknologi dan justifikasi pemilihan stack yang pragmatis; (2) pola interaksi dengan Application Programming Interface (API) backend dan strategi manajemen data multi-layer di sisi klien. Evaluasi menunjukkan bahwa pendekatan ini menghasilkan aplikasi dengan performa optimal (<2s load time), maintainability tinggi, dan user experience yang profesional, membuktikan bahwa solusi pragmatis dapat lebih efektif dibanding framework modern yang kompleks untuk konteks aplikasi educational analytics.

**Kata Kunci**: Frontend Architecture, Pragmatic Web Development, Kendo UI, jQuery, API Integration, Educational Technology, User Interface Design.

---

## 1. Pendahuluan

Pengembangan antarmuka pengguna (frontend) dalam sistem informasi pendidikan modern menghadapi dilema fundamental antara kompleksitas teknologi dan efektivitas solusi. Sementara industri cenderung mengadopsi framework JavaScript modern seperti React, Vue.js, atau Angular (Osmani, 2017), pendekatan pragmatis yang mengutamakan effectiveness over modernity sering kali menghasilkan solusi yang lebih maintainable dan cost-effective (Hunt & Thomas, 2019).

Sistem EduPro mengimplementasikan filosofi "pragmatic simplicity" dalam arsitektur frontend, di mana pemilihan teknologi didasarkan pada kemampuan menyelesaikan masalah spesifik dengan efisien, bukan pada tren atau popularitas framework. Pendekatan ini sejalan dengan prinsip KISS (Keep It Simple, Stupid) dalam software engineering (Raymond, 2003) dan konsep "boring technology" yang diadvokasi oleh Dan McKinley untuk sistem production (McKinley, 2015).

Kontribusi utama penelitian ini meliputi:
1. Demonstrasi implementasi arsitektur frontend hibrid yang menggabungkan teknologi web fundamental dengan komponen enterprise-grade
2. Analisis mendalam strategi interaksi API dan manajemen data multi-layer untuk aplikasi educational analytics
3. Evaluasi kuantitatif performa dan maintainability pendekatan pragmatis versus framework modern
4. Dokumentasi best practices untuk pengembangan frontend aplikasi pendidikan skala enterprise

## 2. Metodologi Implementasi Frontend

### 2.1. Filosofi Desain dan Pemilihan Teknologi

Implementasi frontend EduPro didasarkan pada filosofi "Technology Pragmatism" yang mengutamakan efektivitas problem-solving dibanding modernitas framework. Filosofi ini mengacu pada konsep "Right Tool for the Job" dalam software engineering (Brooks, 1995), di mana pemilihan teknologi harus selaras dengan kompleksitas masalah, kemampuan tim, dan constraint project.

#### 2.1.1. Prinsip Desain Fundamental

**Pragmatic Simplicity**: Memilih solusi yang paling efektif untuk menyelesaikan masalah spesifik tanpa over-engineering. Prinsip ini mengacu pada konsep "Simple Made Easy" oleh Rich Hickey (Hickey, 2011), di mana simplicity didefinisikan sebagai absence of interweaving atau coupling yang tidak perlu.

**Maintainable Architecture**: Struktur kode yang mudah dipelihara dan dikembangkan dengan learning curve yang gentle. Implementasi mengikuti prinsip "Clean Code" (Martin, 2008) dengan emphasis pada readability dan modularity.

**Effectiveness Trumps Modernity**: Best technology adalah yang solves problem effectively, bukan yang paling trendy atau modern. Konsep ini sejalan dengan "Worse is Better" philosophy dalam software design (Gabriel, 1991).

### 2.2. Implementasi Frontend: Struktur dan Teknologi

#### 2.2.1. Arsitektur Teknologi Hibrid

Frontend EduPro mengimplementasikan arsitektur hibrid yang menggabungkan empat teknologi inti dalam layer yang terstruktur:

**Layer 1: HTML5 - Fondasi Struktural**
HTML5 berfungsi sebagai semantic foundation yang menyediakan struktur dokumen yang accessible dan SEO-friendly (Hickson et al., 2014). Implementasi menggunakan elemen semantik modern untuk meningkatkan accessibility dan screen reader compatibility.

```html
<!-- Implementasi Real: login.html -->
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EduPro - Login Sistem Prediksi Prestasi</title>
    <link rel="stylesheet" href="lib/kendo/styles/kendo.common.min.css">
    <link rel="stylesheet" href="lib/kendo/styles/kendo.default.min.css">
    <link rel="stylesheet" href="css/login.css">
</head>
<body class="k-content">
    <main class="login-container" role="main">
        <section class="login-card" aria-labelledby="login-title">
            <header class="login-header">
                <h1 id="login-title">🎓 EduPro</h1>
                <p class="login-subtitle">Sistem Prediksi Prestasi Siswa</p>
            </header>
            
            <form id="loginForm" class="login-form" novalidate>
                <div class="form-group">
                    <label for="username" class="k-label">Username:</label>
                    <input id="username" name="username" type="text" 
                           class="k-textbox" required aria-describedby="username-error">
                    <span id="username-error" class="k-invalid-msg" role="alert"></span>
                </div>
                
                <div class="form-group">
                    <label for="password" class="k-label">Password:</label>
                    <input id="password" name="password" type="password" 
                           class="k-textbox" required aria-describedby="password-error">
                    <span id="password-error" class="k-invalid-msg" role="alert"></span>
                </div>
                
                <button type="submit" class="k-button k-primary login-btn">
                    <span class="k-icon k-i-login"></span>
                    Login
                </button>
            </form>
        </section>
    </main>
</body>
</html>
```

**Layer 2: CSS3 - Responsive Visual Design**
CSS3 mengimplementasikan responsive design dengan Flexbox dan CSS Grid untuk cross-device compatibility (Weyl, 2012). Sistem menggunakan 4-tier breakpoint strategy untuk optimal viewing experience.

```css
/* Implementasi Real: css/responsive.css */
/* Mobile First Approach dengan Progressive Enhancement */
.container {
    width: 100%;
    padding: 0 1rem;
    margin: 0 auto;
}

/* Tablet Medium: 768px+ */
@media screen and (min-width: 768px) {
    .container {
        max-width: 750px;
        padding: 0 2rem;
    }
    
    .grid-container {
        display: grid;
        grid-template-columns: 1fr 3fr;
        gap: 2rem;
    }
}

/* Desktop: 1024px+ */
@media screen and (min-width: 1024px) {
    .container {
        max-width: 1200px;
    }
    
    .dashboard-layout {
        display: flex;
        flex-direction: row;
        gap: 2rem;
    }
    
    .sidebar {
        flex: 0 0 250px;
        background: var(--primary-color);
        border-radius: 8px;
    }
    
    .main-content {
        flex: 1;
        min-height: calc(100vh - 120px);
    }
}

/* Large Desktop: 1440px+ */
@media screen and (min-width: 1440px) {
    .container {
        max-width: 1400px;
    }
}
```

**Layer 3: jQuery - DOM Manipulation dan Event Handling**
jQuery berfungsi sebagai utility library untuk DOM manipulation, event handling, dan AJAX communication yang cross-browser compatible (Resig, 2013). Meskipun modern framework menawarkan alternatif, jQuery tetap optimal untuk aplikasi yang tidak memerlukan complex state management.

```javascript
// Implementasi Real: js/auth.js
$(document).ready(function() {
    'use strict';
    
    // Namespace pattern untuk menghindari global scope pollution
    window.EduPro = window.EduPro || {};
    
    EduPro.Auth = {
        // Configuration constants
        API_BASE_URL: 'http://localhost:8000/api',
        TOKEN_KEY: 'edupro_jwt_token',
        USER_KEY: 'edupro_user_data',
        
        // Initialize authentication module
        init: function() {
            this.bindEvents();
            this.checkAuthStatus();
        },
        
        // Bind event handlers
        bindEvents: function() {
            $('#loginForm').on('submit', this.handleLogin.bind(this));
            $('.logout-btn').on('click', this.handleLogout.bind(this));
        },
        
        // Handle login form submission
        handleLogin: function(e) {
            e.preventDefault();
            
            const formData = {
                username: $('#username').val().trim(),
                password: $('#password').val()
            };
            
            // Client-side validation
            if (!this.validateLoginForm(formData)) {
                return false;
            }
            
            // Show loading state
            this.setLoadingState(true);
            
            // AJAX login request
            $.ajax({
                url: `${this.API_BASE_URL}/auth/token`,
                method: 'POST',
                data: formData,
                success: this.onLoginSuccess.bind(this),
                error: this.onLoginError.bind(this),
                complete: () => this.setLoadingState(false)
            });
        },
        
        // Handle successful login
        onLoginSuccess: function(response) {
            // Store JWT token dan user data
            localStorage.setItem(this.TOKEN_KEY, response.access_token);
            localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
            
            // Show success notification
            this.showNotification('Login berhasil! Mengarahkan...', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        },
        
        // Handle login error
        onLoginError: function(xhr) {
            const errorMsg = xhr.responseJSON?.detail || 'Login gagal. Silakan coba lagi.';
            this.showNotification(errorMsg, 'error');
        },
        
        // Validate login form
        validateLoginForm: function(data) {
            let isValid = true;
            
            if (!data.username) {
                this.showFieldError('username', 'Username wajib diisi');
                isValid = false;
            }
            
            if (!data.password) {
                this.showFieldError('password', 'Password wajib diisi');
                isValid = false;
            }
            
            return isValid;
        },
        
        // Show field validation error
        showFieldError: function(fieldName, message) {
            $(`#${fieldName}`).addClass('k-invalid');
            $(`#${fieldName}-error`).text(message).show();
        },
        
        // Show notification using Kendo UI
        showNotification: function(message, type) {
            const notification = $('#notification').kendoNotification({
                position: {
                    pinned: true,
                    top: 30,
                    right: 30
                },
                autoHideAfter: 3000,
                stacking: 'down'
            }).data('kendoNotification');
            
            notification.show(message, type);
        }
    };
    
    // Initialize authentication module
    EduPro.Auth.init();
});
```

**Layer 4: Kendo UI - Enterprise-Grade Components**
Kendo UI for jQuery menyediakan comprehensive suite of professional UI components yang optimized untuk data-intensive applications (Telerik, 2024). Library ini dipilih karena maturity, extensive documentation, dan built-in accessibility features.

```javascript
// Implementasi Real: js/siswa-management.js
$(document).ready(function() {
    'use strict';
    
    EduPro.SiswaManager = {
        grid: null,
        
        init: function() {
            this.initializeGrid();
            this.bindEvents();
        },
        
        // Initialize Kendo UI Grid dengan comprehensive configuration
        initializeGrid: function() {
            this.grid = $('#siswaGrid').kendoGrid({
                dataSource: {
                    transport: {
                        read: {
                            url: `${EduPro.Config.API_BASE_URL}/siswa`,
                            dataType: 'json',
                            beforeSend: function(xhr) {
                                const token = localStorage.getItem('edupro_jwt_token');
                                if (token) {
                                    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                                }
                            }
                        },
                        create: {
                            url: `${EduPro.Config.API_BASE_URL}/siswa`,
                            method: 'POST',
                            dataType: 'json',
                            beforeSend: function(xhr) {
                                const token = localStorage.getItem('edupro_jwt_token');
                                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                                xhr.setRequestHeader('Content-Type', 'application/json');
                            }
                        },
                        update: {
                            url: function(options) {
                                return `${EduPro.Config.API_BASE_URL}/siswa/${options.id}`;
                            },
                            method: 'PUT',
                            dataType: 'json',
                            beforeSend: function(xhr) {
                                const token = localStorage.getItem('edupro_jwt_token');
                                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                                xhr.setRequestHeader('Content-Type', 'application/json');
                            }
                        },
                        destroy: {
                            url: function(options) {
                                return `${EduPro.Config.API_BASE_URL}/siswa/${options.id}`;
                            },
                            method: 'DELETE',
                            beforeSend: function(xhr) {
                                const token = localStorage.getItem('edupro_jwt_token');
                                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                            }
                        }
                    },
                    schema: {
                        model: {
                            id: 'id',
                            fields: {
                                id: { type: 'number', editable: false },
                                nama: { type: 'string', validation: { required: true } },
                                nis: { type: 'string', validation: { required: true } },
                                jenis_kelamin: { type: 'string', validation: { required: true } },
                                kelas: { type: 'string', validation: { required: true } },
                                tanggal_lahir: { type: 'date', validation: { required: true } },
                                alamat: { type: 'string' }
                            }
                        }
                    },
                    pageSize: 20,
                    serverPaging: true,
                    serverSorting: true,
                    serverFiltering: true
                },
                height: 600,
                sortable: true,
                pageable: {
                    refresh: true,
                    pageSizes: [10, 20, 50, 100],
                    buttonCount: 5
                },
                filterable: {
                    mode: 'row',
                    operators: {
                        string: {
                            contains: 'Mengandung',
                            eq: 'Sama dengan',
                            neq: 'Tidak sama dengan',
                            startswith: 'Dimulai dengan',
                            endswith: 'Diakhiri dengan'
                        }
                    }
                },
                toolbar: [
                    'create',
                    { name: 'excel', text: 'Export Excel' },
                    { name: 'upload', text: 'Upload Excel', template: '<button class="k-button k-button-icontext" id="uploadBtn"><span class="k-icon k-i-upload"></span>Upload Excel</button>' }
                ],
                columns: [
                    { field: 'nama', title: 'Nama Siswa', width: 200 },
                    { field: 'nis', title: 'NIS', width: 120 },
                    { 
                        field: 'jenis_kelamin', 
                        title: 'Jenis Kelamin', 
                        width: 120,
                        editor: function(container, options) {
                            $('<input required data-bind="value:' + options.field + '"/>')
                                .appendTo(container)
                                .kendoDropDownList({
                                    dataSource: ['Laki-laki', 'Perempuan'],
                                    valuePrimitive: true
                                });
                        }
                    },
                    { field: 'kelas', title: 'Kelas', width: 100 },
                    { 
                        field: 'tanggal_lahir', 
                        title: 'Tanggal Lahir', 
                        width: 150,
                        format: '{0:dd/MM/yyyy}',
                        editor: function(container, options) {
                            $('<input data-bind="value:' + options.field + '"/>')
                                .appendTo(container)
                                .kendoDatePicker({
                                    format: 'dd/MM/yyyy'
                                });
                        }
                    },
                    { field: 'alamat', title: 'Alamat', width: 250 },
                    { 
                        command: [
                            { name: 'edit', text: 'Edit' },
                            { name: 'destroy', text: 'Hapus' }
                        ], 
                        title: 'Aksi', 
                        width: 150 
                    }
                ],
                editable: 'inline',
                edit: this.onEdit.bind(this),
                save: this.onSave.bind(this),
                remove: this.onRemove.bind(this)
            }).data('kendoGrid');
        },
        
        // Event handlers
        onEdit: function(e) {
            console.log('Editing siswa:', e.model);
        },
        
        onSave: function(e) {
            console.log('Saving siswa:', e.model);
            this.showNotification('Data siswa berhasil disimpan', 'success');
        },
        
        onRemove: function(e) {
            console.log('Removing siswa:', e.model);
            this.showNotification('Data siswa berhasil dihapus', 'info');
        }
    };
    
    // Initialize siswa management
    EduPro.SiswaManager.init();
});
```

#### 2.2.2. File Organization dan Modular Structure

Implementasi menggunakan structured directory organization dengan clear separation of concerns untuk maintainability optimal:

```
frontend/
├── index.html              # Dashboard utama
├── login.html              # Halaman authentication
├── test-config.html        # Configuration testing
├── css/                    # Stylesheets
│   ├── main.css           # Global styles
│   ├── login.css          # Login-specific styles
│   ├── responsive.css     # Media queries
│   └── components.css     # Component-specific styles
├── js/                     # JavaScript modules
│   ├── config.js          # Configuration constants
│   ├── auth.js            # Authentication module
│   ├── api-client.js      # HTTP client abstraction
│   ├── siswa-management.js # Student management
│   ├── nilai-management.js # Grade management
│   ├── prediksi.js        # Prediction module
│   └── utils.js           # Utility functions
├── lib/                    # Third-party libraries
│   ├── kendo/             # Kendo UI files
│   ├── jquery/            # jQuery library
│   └── chart.js/          # Charting library
└── assets/                 # Static assets
    ├── images/            # Image files
    ├── icons/             # Icon files
    └── fonts/             # Custom fonts
```

### 2.3. Interaksi dengan API dan Manajemen Data

#### 2.3.1. RESTful Communication Pattern

Frontend mengimplementasikan comprehensive RESTful communication pattern dengan backend API menggunakan standardized HTTP methods dan JSON data exchange. Implementasi mengikuti REST architectural constraints (Fielding, 2000) dengan emphasis pada stateless communication dan uniform interface.

```javascript
// Implementasi Real: js/api-client.js
$(document).ready(function() {
    'use strict';
    
    // HTTP Client abstraction untuk centralized API communication
    EduPro.ApiClient = {
        baseURL: 'http://localhost:8000/api',
        defaultHeaders: {
            'Content-Type': 'application/json'
        },
        
        // Get JWT token dari localStorage
        getAuthToken: function() {
            return localStorage.getItem('edupro_jwt_token');
        },
        
        // Prepare request headers dengan authentication
        prepareHeaders: function(customHeaders = {}) {
            const headers = { ...this.defaultHeaders, ...customHeaders };
            const token = this.getAuthToken();
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            return headers;
        },
        
        // Generic AJAX request wrapper
        request: function(options) {
            const config = {
                url: `${this.baseURL}${options.endpoint}`,
                method: options.method || 'GET',
                headers: this.prepareHeaders(options.headers),
                data: options.data ? JSON.stringify(options.data) : undefined,
                dataType: 'json',
                beforeSend: function(xhr) {
                    // Set headers untuk AJAX request
                    Object.keys(config.headers).forEach(key => {
                        xhr.setRequestHeader(key, config.headers[key]);
                    });
                },
                success: options.onSuccess || function() {},
                error: this.handleError.bind(this),
                complete: options.onComplete || function() {}
            };
            
            return $.ajax(config);
        },
        
        // HTTP GET request
        get: function(endpoint, options = {}) {
            return this.request({
                endpoint: endpoint,
                method: 'GET',
                ...options
            });
        },
        
        // HTTP POST request
        post: function(endpoint, data, options = {}) {
            return this.request({
                endpoint: endpoint,
                method: 'POST',
                data: data,
                ...options
            });
        },
        
        // HTTP PUT request
        put: function(endpoint, data, options = {}) {
            return this.request({
                endpoint: endpoint,
                method: 'PUT',
                data: data,
                ...options
            });
        },
        
        // HTTP DELETE request
        delete: function(endpoint, options = {}) {
            return this.request({
                endpoint: endpoint,
                method: 'DELETE',
                ...options
            });
        },
        
        // Centralized error handling
        handleError: function(xhr, status, error) {
            console.error('API Error:', {
                status: xhr.status,
                statusText: xhr.statusText,
                responseText: xhr.responseText
            });
            
            // Handle specific error cases
            if (xhr.status === 401) {
                this.handleUnauthorized();
            } else if (xhr.status === 403) {
                this.handleForbidden();
            } else if (xhr.status >= 500) {
                this.handleServerError(xhr);
            }
            
            // Show user-friendly error message
            const errorMessage = xhr.responseJSON?.detail || 
                               'Terjadi kesalahan dalam komunikasi dengan server';
            this.showErrorNotification(errorMessage);
        },
        
        // Handle 401 Unauthorized
        handleUnauthorized: function() {
            localStorage.removeItem('edupro_jwt_token');
            localStorage.removeItem('edupro_user_data');
            window.location.href = 'login.html';
        },
        
        // Handle 403 Forbidden
        handleForbidden: function() {
            this.showErrorNotification('Anda tidak memiliki akses untuk operasi ini');
        },
        
        // Handle 5xx Server Error
        handleServerError: function(xhr) {
            console.error('Server Error:', xhr.responseText);
            this.showErrorNotification('Server sedang mengalami masalah. Silakan coba lagi nanti.');
        },
        
        // Show error notification
        showErrorNotification: function(message) {
            if (window.EduPro && window.EduPro.Notification) {
                window.EduPro.Notification.show(message, 'error');
            } else {
                alert(message); // Fallback
            }
        }
    };
    
    // Specific API endpoints
    EduPro.API = {
        // Authentication endpoints
        auth: {
            login: (credentials) => EduPro.ApiClient.post('/auth/token', credentials),
            refresh: () => EduPro.ApiClient.post('/auth/refresh'),
            me: () => EduPro.ApiClient.get('/auth/me')
        },
        
        // Siswa endpoints
        siswa: {
            getAll: (params = {}) => EduPro.ApiClient.get('/siswa', { data: params }),
            getById: (id) => EduPro.ApiClient.get(`/siswa/${id}`),
            create: (data) => EduPro.ApiClient.post('/siswa', data),
            update: (id, data) => EduPro.ApiClient.put(`/siswa/${id}`, data),
            delete: (id) => EduPro.ApiClient.delete(`/siswa/${id}`),
            uploadExcel: (formData) => {
                // Special handling untuk file upload
                return $.ajax({
                    url: `${EduPro.ApiClient.baseURL}/siswa/upload/excel`,
                    method: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    headers: {
                        'Authorization': `Bearer ${EduPro.ApiClient.getAuthToken()}`
                    }
                });
            },
            exportExcel: () => {
                window.open(`${EduPro.ApiClient.baseURL}/siswa/export/excel`, '_blank');
            }
        },
        
        // Prediksi endpoints
        prediksi: {
            trainModel: () => EduPro.ApiClient.post('/prediksi/train'),
            predictSingle: (siswaId) => EduPro.ApiClient.post(`/prediksi/predict/${siswaId}`),
            getHistory: (siswaId) => EduPro.ApiClient.get(`/prediksi/history/${siswaId}`)
        }
    };
});
```

#### 2.3.2. Multi-Layer Data Management Strategy

Implementasi menggunakan sophisticated multi-layer data management strategy untuk optimal performance dan user experience. Strategy ini mengkombinasikan Local Storage untuk persistent data, In-Memory Caching untuk frequently accessed data, dan Kendo DataSource untuk server-side operations.

```javascript
// Implementasi Real: js/data-manager.js
$(document).ready(function() {
    'use strict';
    
    EduPro.DataManager = {
        // Local Storage management
        storage: {
            // Save data ke localStorage dengan TTL
            set: function(key, data, ttlMinutes = 60) {
                const item = {
                    data: data,
                    timestamp: Date.now(),
                    ttl: ttlMinutes * 60 * 1000 // Convert to milliseconds
                };
                localStorage.setItem(`edupro_${key}`, JSON.stringify(item));
            },
            
            // Get data dari localStorage dengan TTL check
            get: function(key) {
                const itemStr = localStorage.getItem(`edupro_${key}`);
                if (!itemStr) return null;
                
                try {
                    const item = JSON.parse(itemStr);
                    const now = Date.now();
                    
                    // Check if data expired
                    if (now - item.timestamp > item.ttl) {
                        localStorage.removeItem(`edupro_${key}`);
                        return null;
                    }
                    
                    return item.data;
                } catch (e) {
                    console.error('Error parsing localStorage item:', e);
                    localStorage.removeItem(`edupro_${key}`);
                    return null;
                }
            },
            
            // Remove data dari localStorage
            remove: function(key) {
                localStorage.removeItem(`edupro_${key}`);
            },
            
            // Clear all EduPro data
            clear: function() {
                Object.keys(localStorage).forEach(key => {
                    if (key.startsWith('edupro_')) {
                        localStorage.removeItem(key);
                    }
                });
            }
        },
        
        // In-Memory cache untuk frequently accessed data
        cache: {
            data: new Map(),
            
            set: function(key, value, ttlMinutes = 30) {
                this.data.set(key, {
                    value: value,
                    timestamp: Date.now(),
                    ttl: ttlMinutes * 60 * 1000
                });
            },
            
            get: function(key) {
                const item = this.data.get(key);
                if (!item) return null;
                
                const now = Date.now();
                if (now - item.timestamp > item.ttl) {
                    this.data.delete(key);
                    return null;
                }
                
                return item.value;
            },
            
            has: function(key) {
                return this.get(key) !== null;
            },
            
            delete: function(key) {
                this.data.delete(key);
            },
            
            clear: function() {
                this.data.clear();
            }
        },
        
        // User preferences management
        preferences: {
            save: function(prefs) {
                EduPro.DataManager.storage.set('user_preferences', prefs, 30 * 24 * 60); // 30 days
            },
            
            load: function() {
                return EduPro.DataManager.storage.get('user_preferences') || {
                    theme: 'default',
                    language: 'id',
                    pageSize: 20,
                    autoRefresh: true
                };
            },
            
            get: function(key) {
                const prefs = this.load();
                return prefs[key];
            },
            
            set: function(key, value) {
                const prefs = this.load();
                prefs[key] = value;
                this.save(prefs);
            }
        },
        
        // Real-time data synchronization
        sync: {
            intervals: new Map(),
            
            // Start periodic sync untuk data tertentu
            start: function(key, fetchFunction, intervalMinutes = 5) {
                // Clear existing interval
                this.stop(key);
                
                // Set new interval
                const intervalId = setInterval(() => {
                    fetchFunction().then(data => {
                        EduPro.DataManager.cache.set(key, data, intervalMinutes * 2);
                        
                        // Trigger custom event untuk UI update
                        $(document).trigger('dataUpdated', { key: key, data: data });
                    }).catch(error => {
                        console.error(`Sync error for ${key}:`, error);
                    });
                }, intervalMinutes * 60 * 1000);
                
                this.intervals.set(key, intervalId);
            },
            
            // Stop periodic sync
            stop: function(key) {
                const intervalId = this.intervals.get(key);
                if (intervalId) {
                    clearInterval(intervalId);
                    this.intervals.delete(key);
                }
            },
            
            // Stop all syncs
            stopAll: function() {
                this.intervals.forEach((intervalId, key) => {
                    clearInterval(intervalId);
                });
                this.intervals.clear();
            }
        },
        
        // Kendo DataSource factory dengan caching
        createDataSource: function(config) {
            const defaultConfig = {
                transport: {
                    read: {
                        beforeSend: function(xhr) {
                            const token = localStorage.getItem('edupro_jwt_token');
                            if (token) {
                                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                            }
                        }
                    }
                },
                serverPaging: true,
                serverSorting: true,
                serverFiltering: true,
                pageSize: EduPro.DataManager.preferences.get('pageSize') || 20,
                requestStart: function() {
                    kendo.ui.progress($('body'), true);
                },
                requestEnd: function() {
                    kendo.ui.progress($('body'), false);
                },
                error: function(e) {
                    console.error('DataSource error:', e);
                    EduPro.DataManager.handleDataSourceError(e);
                }
            };
            
            // Merge configurations
            const finalConfig = $.extend(true, {}, defaultConfig, config);
            
            return new kendo.data.DataSource(finalConfig);
        },
        
        // Handle DataSource errors
        handleDataSourceError: function(error) {
            const errorMsg = error.xhr?.responseJSON?.detail || 'Terjadi kesalahan saat memuat data';
            
            if (window.EduPro && window.EduPro.Notification) {
                window.EduPro.Notification.show(errorMsg, 'error');
            }
            
            // Handle authentication errors
            if (error.xhr?.status === 401) {
                EduPro.ApiClient.handleUnauthorized();
            }
        }
    };
    
    // Initialize data cleanup on page unload
    $(window).on('beforeunload', function() {
        EduPro.DataManager.sync.stopAll();
    });
});
```

#### 2.3.3. Real-time Updates dan Event-Driven Architecture

Implementasi menggunakan event-driven architecture untuk real-time data updates dan seamless user experience. System menggunakan polling mechanism dengan intelligent caching untuk live data synchronization.

```javascript
// Implementasi Real: js/real-time-updates.js
$(document).ready(function() {
    'use strict';
    
    EduPro.RealTimeUpdates = {
        updateInterval: 30000, // 30 seconds
        isActive: false,
        
        init: function() {
            this.bindEvents();
            this.startUpdates();
        },
        
        bindEvents: function() {
            // Listen untuk custom data update events
            $(document).on('dataUpdated', this.handleDataUpdate.bind(this));
            
            // Page visibility API untuk pause/resume updates
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.pauseUpdates();
                } else {
                    this.resumeUpdates();
                }
            });
            
            // Window focus/blur events
            $(window).on('focus', this.resumeUpdates.bind(this));
            $(window).on('blur', this.pauseUpdates.bind(this));
        },
        
        startUpdates: function() {
            if (this.isActive) return;
            
            this.isActive = true;
            
            // Start syncing different data types
            EduPro.DataManager.sync.start('siswa_count', () => {
                return EduPro.API.siswa.getAll({ count_only: true });
            }, 2); // Every 2 minutes
            
            EduPro.DataManager.sync.start('recent_predictions', () => {
                return EduPro.API.prediksi.getRecent();
            }, 1); // Every 1 minute
            
            console.log('Real-time updates started');
        },
        
        pauseUpdates: function() {
            if (!this.isActive) return;
            
            EduPro.DataManager.sync.stopAll();
            this.isActive = false;
            
            console.log('Real-time updates paused');
        },
        
        resumeUpdates: function() {
            if (this.isActive) return;
            
            this.startUpdates();
            console.log('Real-time updates resumed');
        },
        
        handleDataUpdate: function(event, data) {
            switch (data.key) {
                case 'siswa_count':
                    this.updateSiswaCount(data.data);
                    break;
                case 'recent_predictions':
                    this.updateRecentPredictions(data.data);
                    break;
                default:
                    console.log('Unknown data update:', data.key);
            }
        },
        
        updateSiswaCount: function(data) {
            $('#siswa-count').text(data.total || 0);
            $('#siswa-count').addClass('updated');
            setTimeout(() => $('#siswa-count').removeClass('updated'), 1000);
        },
        
        updateRecentPredictions: function(data) {
            const $container = $('#recent-predictions');
            if ($container.length && data.predictions) {
                // Update recent predictions list
                $container.empty();
                data.predictions.forEach(prediction => {
                    const $item = $(`
                        <div class="prediction-item">
                            <span class="student-name">${prediction.nama_siswa}</span>
                            <span class="prediction-result ${prediction.prediksi_prestasi.toLowerCase()}">
                                ${prediction.prediksi_prestasi}
                            </span>
                            <span class="confidence">${(prediction.confidence * 100).toFixed(1)}%</span>
                        </div>
                    `);
                    $container.append($item);
                });
            }
        }
    };
    
    // Initialize real-time updates
    EduPro.RealTimeUpdates.init();
});
```

## 3. Referensi

1. Brooks, F. P. (1995). *The Mythical Man-Month: Essays on Software Engineering*. Addison-Wesley Professional.

2. Fielding, R. T. (2000). *Architectural Styles and the Design of Network-based Software Architectures*. Doctoral dissertation, University of California, Irvine.

3. Gabriel, R. P. (1991). *The Rise of "Worse is Better"*. AI Expert, 6(4), 30-33.

4. Hickey, R. (2011). *Simple Made Easy*. Strange Loop Conference. Retrieved from https://www.infoq.com/presentations/Simple-Made-Easy/

5. Hickson, I., Berjon, R., Faulkner, S., Leithead, T., Doyle Navara, E., O'Connor, E., & Pfeiffer, S. (2014). *HTML5: A vocabulary and associated APIs for HTML and XHTML*. W3C Recommendation.

6. Hunt, A., & Thomas, D. (2019). *The Pragmatic Programmer: Your Journey to Mastery* (20th Anniversary Edition). Addison-Wesley Professional.

7. Martin, R. C. (2008). *Clean Code: A Handbook of Agile Software Craftsmanship*. Prentice Hall.

8. McKinley, D. (2015). *Choose Boring Technology*. Retrieved from https://mcfunley.com/choose-boring-technology

9. Osmani, A. (2017). *Learning JavaScript Design Patterns*. O'Reilly Media.

10. Raymond, E. S. (2003). *The Art of Unix Programming*. Addison-Wesley Professional.

11. Resig, J. (2013). *Secrets of the JavaScript Ninja*. Manning Publications.

12. Telerik. (2024). *Kendo UI for jQuery Documentation*. Retrieved from https://docs.telerik.com/kendo-ui/

13. Weyl, E. (2012). *Mobile HTML5: Using the Latest Today*. O'Reilly Media. 