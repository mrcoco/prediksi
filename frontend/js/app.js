$(document).ready(function() {
    // initGenerateDummyForm();
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
    
    // Fungsi untuk mendapatkan token dari localStorage
    function getToken() {
        return localStorage.getItem(TOKEN_KEY);
    }
    
    // Fungsi untuk menambahkan header Authorization ke AJAX requests
    function addAuthHeader(xhr) {
        const token = getToken();
        if (token) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
    }
    
    // Applied to all AJAX requests
    $.ajaxSetup({
        beforeSend: addAuthHeader
    });
    
    // ========== TOKEN COUNTDOWN MANAGEMENT ==========
    let countdownInterval = null;
    let tokenExpiryTime = null;
    
    // ========== TOKEN EXPIRY CHECKER VARIABLES ==========
    let tokenExpiryChecker = null;
    let lastNotificationTime = 0;
    let lastAutoRefreshTime = 0;
    let notificationShown = {
        '15min': false,
        '10min': false,
        '5min': false,
        '2min': false,
        '1min': false
    };
    
    // Dashboard Bar Chart Variables
    let dashboardBarChartData = null;
    let dashboardBarChartInstance = null;
    
    // Fungsi untuk mendapatkan waktu expired token dari JWT
    function getTokenExpiryTime() {
        const token = getToken();
        if (!token) return null;
        
        try {
            // Decode JWT token (base64)
            const payload = JSON.parse(atob(token.split('.')[1]));
            // exp adalah timestamp dalam detik, convert ke milliseconds
            return payload.exp * 1000;
        } catch (e) {
            console.error('Error decoding token:', e);
            return null;
        }
    }
    
    // Fungsi untuk memformat waktu countdown
    function formatCountdownTime(milliseconds) {
        if (milliseconds <= 0) return "00:00";
        
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Fungsi untuk memulai countdown
    function startTokenCountdown() {
        // Clear existing interval
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
        
        tokenExpiryTime = getTokenExpiryTime();
        if (!tokenExpiryTime) {
            $("#countdown-timer").text("--:--");
            return;
        }
        
        countdownInterval = setInterval(function() {
            const now = Date.now();
            const timeLeft = tokenExpiryTime - now;
            
            if (timeLeft <= 0) {
                // Token expired
                $("#countdown-timer").text("00:00").addClass("countdown-timer-danger");
                clearInterval(countdownInterval);
                
                // Show expiry notification
                showErrorNotification("Token telah expired. Silakan login kembali.", "Session Expired");
                
                // Auto logout after 3 seconds
                setTimeout(() => {
                    logout();
                }, 3000);
                
                return;
            }
            
            // Update countdown display
            const formattedTime = formatCountdownTime(timeLeft);
            const $timer = $("#countdown-timer");
            $timer.text(formattedTime);
            
            // Add warning classes based on time left
            $timer.removeClass("countdown-timer-warning countdown-timer-danger");
            
            // Update token status indicator based on time left
            const minutesLeft = Math.floor(timeLeft / (60 * 1000));
            const $indicator = $("#token-status-indicator");
            $indicator.removeClass("token-valid token-notice token-warning token-urgent token-critical");
            
            if (timeLeft <= 1 * 60 * 1000) { // 1 minute or less - CRITICAL
                $timer.addClass("countdown-timer-danger");
                $indicator.addClass("token-critical").attr("title", `Token KRITIS - ${minutesLeft} menit lagi`);
            } else if (timeLeft <= 2 * 60 * 1000) { // 2 minutes or less - URGENT
                $timer.addClass("countdown-timer-danger");
                $indicator.addClass("token-urgent").attr("title", `Token MENDESAK - ${minutesLeft} menit lagi`);
            } else if (timeLeft <= 5 * 60 * 1000) { // 5 minutes or less - WARNING
                $timer.addClass("countdown-timer-danger");
                $indicator.addClass("token-warning").attr("title", `Token PERINGATAN - ${minutesLeft} menit lagi`);
                
                // Show warning notification every minute in last 5 minutes
                if (timeLeft % (60 * 1000) < 1000 && minutesLeft > 0) {
                    showInfoNotification(`Token akan expired dalam ${minutesLeft} menit`, "Peringatan Token");
                }
            } else if (timeLeft <= 10 * 60 * 1000) { // 10 minutes or less - NOTICE
                $timer.addClass("countdown-timer-warning");
                $indicator.addClass("token-notice").attr("title", `Token PERHATIAN - ${minutesLeft} menit lagi`);
            } else { // More than 10 minutes - VALID
                $indicator.addClass("token-valid").attr("title", `Token VALID - ${minutesLeft} menit lagi`);
            }
        }, 1000);
    }
    
    // Fungsi untuk stop countdown
    function stopTokenCountdown() {
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
        $("#countdown-timer").text("--:--").removeClass("countdown-timer-warning countdown-timer-danger");
        // Reset token status indicator
        $("#token-status-indicator").removeClass("token-valid token-notice token-warning token-urgent token-critical").addClass("token-valid").attr("title", "Status Token");
    }
    
    // Fungsi untuk refresh token countdown (dipanggil setelah login atau refresh token)
    function refreshTokenCountdown() {
        startTokenCountdown();
    }
    
    kendo.culture("id-ID");
    
    // Tampilkan halaman dashboard secara default
    $(".page").hide();
    $("#dashboard-page").show();
    $(".sidebar-link").removeClass("active");
    $("[data-page='dashboard']").addClass("active");
    
    // Navigasi sidebar
    // $("body").prepend('<button id="sidebar-toggle" class="btn btn-sm btn-secondary"><i class="k-icon k-i-menu"></i></button>');
    
    // Event handler untuk toggle sidebar
    // Update tombol toggle sidebar
    // $(".wrapper").prepend('<header><div id="header-content"><h5 class="text-white">Prestasi Siswa</h5></div><button id="sidebar-toggle" class="btn btn-sm btn-secondary"><i class="k-icon k-i-menu"></i></button></header>');
    
    // CSS telah dipindahkan ke file custom.css
    
    // Update tombol toggle sidebar
    $(document).on("click", "#toggleSidebar, .sidebar-toggle-btn", function() {
        $(".sidebar").toggleClass("collapsed");
        $(".main-content").toggleClass("sidebar-collapsed");
        
        // Update icon
        const icon = $(this).find("i");
        if ($(".sidebar").hasClass("collapsed")) {
            icon.removeClass("fas fa-bars").addClass("fas fa-times");
        } else {
            icon.removeClass("fas fa-times").addClass("fas fa-bars");
        }
        
        // Simpan state sidebar di localStorage
        localStorage.setItem('sidebarState', $(".sidebar").hasClass("collapsed") ? 'collapsed' : 'expanded');
        
        // Update header toggle width
        if ($(".sidebar").hasClass("collapsed")) {
            $("#sidebar-toggle").addClass("collapsed");
        } else {
            $("#sidebar-toggle").removeClass("collapsed");
        }
        
        // Force layout recalculation for dashboard
        setTimeout(function() {
            if ($("#chart-prestasi").data("kendoChart")) {
                $("#chart-prestasi").data("kendoChart").resize();
            }
        }, 350);
    });
    
    // Load state sidebar saat halaman dimuat
    $(document).ready(function() {
        const sidebarState = localStorage.getItem('sidebarState');
        if (sidebarState === 'collapsed') {
            $(".sidebar").addClass("collapsed");
            $(".main-content").addClass("sidebar-collapsed");
            $("#sidebar-toggle").addClass("collapsed");
            $("#toggleSidebar i, .sidebar-toggle-btn i").removeClass("fas fa-bars").addClass("fas fa-times");
        }
    });
    
    // Navigasi sidebar
    $(".sidebar-link").on("click", function(e) {
        console.log("Sidebar link clicked:", $(this).data("page"));
        
        // Pastikan ini bukan guide navigation button
        if ($(this).hasClass("guide-nav-btn")) {
            console.log("Skipping - this is a guide navigation button");
            return;
        }
        
        console.log("Clicked sidebar link");
        e.preventDefault();
        const page = $(this).data("page");
        
        // Check if user has permission to access this page
        if (!hasPageAccess(page)) {
            showErrorNotification("Anda tidak memiliki akses ke halaman ini", "Akses Ditolak");
            return;
        }
        
        // Aktifkan link yang diklik
        $(".sidebar-link").removeClass("active");
        $(this).addClass("active");
        
        // Tampilkan halaman yang sesuai
        $(".page").hide();
        $(`#${page}-page`).show();
        
        // Inisialisasi halaman jika diperlukan
        if (page === "siswa" && !$("#siswa-grid").data("kendoGrid")) {
            initSiswaGrid();
        } else if (page === "nilai" && !$("#nilai-grid").data("kendoGrid")) {
            initNilaiGrid();
        } else if (page === "presensi" && !$("#presensi-grid").data("kendoGrid")) {
            initPresensiGrid();
        } else if (page === "penghasilan" && !$("#penghasilan-grid").data("kendoGrid")) {
            initPenghasilanGrid();
        } else if (page === "prediksi" && !$("#riwayat-grid").data("kendoGrid")) {
            initPrediksiPage();
        } else if (page === "users" && !$("#users-grid").data("kendoGrid")) {
            // Double check access for users page
            if (hasPageAccess('users')) {
                initUsersGrid();
            } else {
                showErrorNotification("Anda tidak memiliki akses ke halaman manajemen user", "Akses Ditolak");
                // Redirect to dashboard
                $(".sidebar-link").removeClass("active");
                $("[data-page='dashboard']").addClass("active");
                $(".page").hide();
                $("#dashboard-page").show();
                return;
            }
        } else if (page === "profile" && !$("#profile-form").data("kendoForm")) {
            initProfilePage();
        } else if (page === "user-guide") {
            console.log("Navigating to user-guide page...");
            
            // FIXED: Force reinit untuk ensure clean state
            setTimeout(() => {
                console.log("Force reinitializing User Guide for clean state...");
                window.forceReinitUserGuide();
            }, 200);
        }
    });
    
    // Event handler untuk profile link di header-right
    $(".header-right .user-menu .nav-link").on("click", function(e) {
        console.log("Clicked profile link in header");
        e.preventDefault();
        const page = $(this).data("page");
        
        if (page === "profile") {
            console.log("Navigating to profile page from header");
            
            // Check if user has permission to access profile page
            if (!hasPageAccess(page)) {
                showErrorNotification("Anda tidak memiliki akses ke halaman ini", "Akses Ditolak");
                return;
            }
            
            // Aktifkan link sidebar yang sesuai
            $(".sidebar-link").removeClass("active");
            $("[data-page='profile']").addClass("active");
            
            // Tampilkan halaman profile
            $(".page").hide();
            $("#profile-page").show();
            
            // Inisialisasi profile page jika belum
            if (!$("#profile-form").data("kendoForm")) {
                console.log("Initializing profile page from header click");
                initProfilePage();
            } else {
                console.log("Profile page already initialized, refreshing data");
                // Refresh data jika sudah diinisialisasi
                loadCurrentUserProfile();
            }
        }
    });
    
    // Event handler umum untuk semua link dengan data-page attribute (kecuali pagination)
    $(document).on("click", "[data-page]:not(.k-link):not(.k-pager-nav):not(.guide-nav-btn)", function(e) {
        // Skip jika sudah ditangani oleh event handler lain
        if ($(this).hasClass("sidebar-link")) {
            return; // Biarkan sidebar handler yang menangani
        }
        
        // Skip jika ini adalah elemen pagination Kendo UI
        if ($(this).closest('.k-pager-wrap, .k-pager, .k-grid-pager').length > 0) {
            return; // Biarkan Kendo UI pagination yang menangani
        }
        
        // Skip jika ini adalah guide navigation button
        if ($(this).hasClass("guide-nav-btn") || $(this).closest('#user-guide-page').length > 0) {
            return; // Biarkan User Guide handler yang menangani
        }
        
        console.log("Clicked data-page link:", $(this).data("page"));
        e.preventDefault();
        const page = $(this).data("page");
        
        // Validasi bahwa ini adalah halaman yang valid (bukan nomor halaman pagination)
        const validPages = ['dashboard', 'siswa', 'nilai', 'presensi', 'penghasilan', 'prediksi', 'users', 'profile', 'about', 'user-guide', 'generate-dummy'];
        if (!validPages.includes(page)) {
            return; // Bukan halaman navigasi yang valid, kemungkinan pagination
        }
        
        // Check if user has permission to access this page
        if (!hasPageAccess(page)) {
            showErrorNotification("Anda tidak memiliki akses ke halaman ini", "Akses Ditolak");
            return;
        }
        
        // Aktifkan link sidebar yang sesuai
        $(".sidebar-link").removeClass("active");
        $(`[data-page='${page}']`).addClass("active");
        
        // Tampilkan halaman yang sesuai
        $(".page").hide();
        $(`#${page}-page`).show();
        
        // Inisialisasi halaman jika diperlukan
        if (page === "siswa" && !$("#siswa-grid").data("kendoGrid")) {
            initSiswaGrid();
        } else if (page === "nilai" && !$("#nilai-grid").data("kendoGrid")) {
            initNilaiGrid();
        } else if (page === "presensi" && !$("#presensi-grid").data("kendoGrid")) {
            initPresensiGrid();
        } else if (page === "penghasilan" && !$("#penghasilan-grid").data("kendoGrid")) {
            initPenghasilanGrid();
        } else if (page === "prediksi" && !$("#riwayat-grid").data("kendoGrid")) {
            initPrediksiPage();
        } else if (page === "users" && !$("#users-grid").data("kendoGrid")) {
            // Double check access for users page
            if (hasPageAccess('users')) {
                initUsersGrid();
            } else {
                showErrorNotification("Anda tidak memiliki akses ke halaman manajemen user", "Akses Ditolak");
                // Redirect to dashboard
                $(".sidebar-link").removeClass("active");
                $("[data-page='dashboard']").addClass("active");
                $(".page").hide();
                $("#dashboard-page").show();
                return;
            }
        } else if (page === "profile" && !$("#profile-form").data("kendoForm")) {
            initProfilePage();
        } else if (page === "user-guide") {
            console.log("Navigating to user-guide page from dashboard...");
            
            // FIXED: Force reinit untuk ensure clean state - SAMA SEPERTI SIDEBAR
            setTimeout(() => {
                console.log("Force reinitializing User Guide for clean state (from dashboard)...");
                window.forceReinitUserGuide();
            }, 200);
        } else if (page === "generate-dummy" && !$("#generate-dummy-form").data("kendoForm")) {
            console.log("Initializing generate dummy form");
            initGenerateDummyForm();  }
    });
    
    // Event handler khusus untuk mencegah konflik dengan pagination Kendo UI
    $(document).on("click", ".k-pager-wrap .k-link[data-page], .k-pager .k-link[data-page], .k-grid-pager .k-link[data-page]", function(e) {
        // Jangan preventDefault() di sini, biarkan Kendo UI menangani pagination
        console.log("Pagination link clicked, letting Kendo UI handle it");
        e.stopPropagation(); // Hentikan event bubbling untuk mencegah konflik
    });
    
    // Inisialisasi dashboard saat halaman dimuat
    loadDashboardData();
    
    // Setup menu visibility based on user role
    setupMenuVisibility();
    
    // Update header user info
    updateHeaderUserInfo();
    
    // Start token countdown
    startTokenCountdown();
    
    // Start token expiry checker
    startTokenExpiryChecker();
    
    // Initialize tooltips
    $('[data-toggle="tooltip"]').tooltip();
    
    // Initialize dashboard bar chart
    initializeDashboardBarChart();
    
    // ========== FUNGSI SETUP MENU VISIBILITY ==========
    function setupMenuVisibility() {
        const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
        const userRole = userData.role;
        
        // Hide/show menu based on user role
        if (userRole !== 'admin') {
            // Hide management user menu for non-admin users
            $('[data-page="users"]').hide();
            
            // Add tooltip or info for hidden menus (optional)
            console.log(`Menu 'Manajemen User' disembunyikan untuk role: ${userRole}`);
        } else {
            // Show all menus for admin
            $('[data-page="users"]').show();
            console.log(`Semua menu ditampilkan untuk admin: ${userRole}`);
        }
        
        // You can add more role-based menu visibility here
        // Example: Hide certain features for specific roles
        /*
        if (userRole === 'guru') {
            // Hide some menus for guru role
            $('[data-page="some-menu"]').hide();
        }
        */
    }
    
    // Function to check if user has access to a specific page
    function hasPageAccess(page) {
        const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
        const userRole = userData.role;
        
        // Define page access rules
        const pageAccessRules = {
            'users': ['admin'], // Only admin can access user management
            'dashboard': ['admin', 'guru', 'staf'], // All roles can access dashboard
            'siswa': ['admin', 'guru', 'staf'], // All roles can access student data
            'nilai': ['admin', 'guru', 'staf'], // All roles can access grades
            'presensi': ['admin', 'guru', 'staf'], // All roles can access attendance
            'penghasilan': ['admin', 'guru', 'staf'], // All roles can access parent income
            'prediksi': ['admin', 'guru', 'staf'], // All roles can access prediction
            'profile': ['admin', 'guru', 'staf'], // All roles can access profile
            'about': ['admin', 'guru', 'staf'], // All roles can access about page
            'user-guide': ['admin', 'guru', 'staf'] // All roles can access user guide
        };
        
        // Check if page exists in rules
        if (!pageAccessRules[page]) {
            return true; // Allow access if no specific rule defined
        }
        
        // Check if user role is allowed for this page
        return pageAccessRules[page].includes(userRole);
    }
    
    // Function to update header user info
    function updateHeaderUserInfo() {
        const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
        
        if (userData.username) {
            $("#current-username").text(userData.username);
            $("#current-role").text(userData.role || 'user').removeClass().addClass(`badge badge-${getRoleBadgeClass(userData.role)}`);
        } else {
            $("#current-username").text('Guest');
            $("#current-role").text('-').removeClass().addClass('badge badge-secondary');
        }
    }
    
    // ========== FUNGSI DASHBOARD ==========
    function loadDashboardData() {
        // Ambil total count siswa dari endpoint khusus
        $.ajax({
            url: `${API_URL}/siswa/count`,
            method: "GET",
            beforeSend: function(xhr) {
                const token = getToken();
                if (token) {
                    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                }
            },
            success: function(data) {
                $("#total-siswa").text(data.total_count);
            },
            error: function(xhr) {
                console.error("Error loading siswa count:", xhr.responseText);
                const errorMsg = xhr.responseJSON ? xhr.responseJSON.detail : 'Terjadi kesalahan saat mengambil data';
                $("#toast-container").kendoNotification({
                    position: {
                        pinned: false,
                        top: 30,
                        right: 30
                    },
                    autoHideAfter: 3000,
                    stacking: "up"
                }).data("kendoNotification").error(errorMsg);
            }
        });
        
        // Ambil data prediksi untuk statistik
        $.ajax({
            url: `${API_URL}/prediksi/history`,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                skip: 0,
                limit: 1000 // Ambil lebih banyak data untuk statistik akurat
            }),
            beforeSend: function(xhr) {
                const token = getToken();
                if (token) {
                    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                }
            },
            success: function(response) {
                let tinggi = 0, sedang = 0, rendah = 0;
                
                // Handle new response format with pagination
                const data = response.data || response; // Support both old and new format
                
                if (Array.isArray(data)) {
                    data.forEach(item => {
                        if (item.prediksi_prestasi === "Tinggi") tinggi++;
                        else if (item.prediksi_prestasi === "Sedang") sedang++;
                        else if (item.prediksi_prestasi === "Rendah") rendah++;
                    });
                }
                
                $("#prestasi-tinggi").text(tinggi);
                $("#prestasi-sedang").text(sedang);
                $("#prestasi-rendah").text(rendah);
                
                // Buat chart distribusi prestasi
                createPrestasiChart(tinggi, sedang, rendah);
            },
            error: function(xhr) {
                console.error("Error loading prediction data:", xhr.responseText);
                const errorMsg = xhr.responseJSON ? xhr.responseJSON.detail : 'Terjadi kesalahan saat mengambil data';
                $("#toast-container").kendoNotification({
                    position: {
                        pinned: false,
                        top: 30,
                        right: 30
                    },
                    autoHideAfter: 3000,
                    stacking: "up"
                }).data("kendoNotification").error(errorMsg);
            }
        });
        
        // Ambil visualisasi pohon keputusan (dual: static + D3.js)
        loadDualTreeVisualization();
        
        // Ambil confusion matrix dan metrik evaluasi
        loadModelEvaluation();
        
        // Ambil statistik fitur
        loadFeatureStatistics();
    }
    
    // ========== FUNGSI LOAD STATIC TREE VISUALIZATION ==========
    function loadStaticTreeVisualization() {
        const staticContainer = document.getElementById('static-tree-container');
        if (!staticContainer) {
            console.error('Static tree container not found');
            return;
        }
        
        // Set loading state
        staticContainer.innerHTML = `
            <div class="loading-placeholder">
                <i class="fas fa-spinner fa-spin fa-2x text-muted mb-3"></i>
                <p class="text-muted">Memuat visualisasi static...</p>
            </div>
        `;
        
        // Load static tree image
        const token = getToken();
        $.ajax({
            url: `${API_URL}/prediksi/visualization`,
            method: "GET",
            beforeSend: function(xhr) {
                if (token) {
                    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                }
            },
            success: function(data) {
                if (data.status === "success" && data.image) {
                    staticContainer.innerHTML = `
                        <div class="static-tree-wrapper">
                            <div class="static-tree-overlay">
                                <i class="fas fa-image mr-1"></i>
                                Static PNG
                            </div>
                            <img src="${data.image}" 
                                 alt="Pohon Keputusan C4.5" 
                                 onclick="openImageModal('${data.image}')"
                                 style="max-width: 100%; height: auto; cursor: pointer;" />
                            <div class="mt-2">
                                <small class="text-muted">Klik gambar untuk memperbesar</small>
                            </div>
                        </div>
                    `;
                } else {
                    staticContainer.innerHTML = `
                        <div class="text-center p-4">
                            <i class="fas fa-exclamation-triangle fa-2x text-warning mb-3"></i>
                            <p class="text-muted">Visualisasi static tidak tersedia.<br/>Silakan latih model terlebih dahulu.</p>
                        </div>
                    `;
                }
            },
            error: function(xhr) {
                console.error("Error loading static tree:", xhr.responseText);
                staticContainer.innerHTML = `
                    <div class="text-center p-4">
                        <i class="fas fa-times-circle fa-2x text-danger mb-3"></i>
                        <p class="text-muted">Gagal memuat visualisasi static.<br/>Silakan coba lagi.</p>
                    </div>
                `;
            }
        });
    }

    // ========== FUNGSI LOAD D3 TREE VISUALIZATION ==========
    function loadD3TreeVisualization() {
        // Inisialisasi D3 Decision Tree
        const treeContainer = document.getElementById('visualization-container');
        if (!treeContainer) {
            console.error('Visualization container not found');
            return;
        }
        
        // Clear container dan set loading
        treeContainer.innerHTML = `
            <div class="loading-placeholder">
                <i class="fas fa-spinner fa-spin fa-2x text-muted mb-3"></i>
                <p class="text-muted">Memuat visualisasi interaktif...</p>
            </div>
        `;
        
        // Buat instance D3DecisionTree
        const d3Tree = new D3DecisionTree('visualization-container', {
            width: 600,  // Reduced width for side-by-side layout
            height: 400, // Reduced height for better fit
            colors: {
                'Tinggi': '#28a745',
                'Sedang': '#ffc107',
                'Rendah': '#dc3545',
                'internal': '#6c757d'
            }
        });
        
        // Load data dari API
        const token = getToken();
        const apiUrl = `${API_URL}/prediksi/tree-data`;
        
        d3Tree.loadData(apiUrl, token);
        
        // Simpan instance untuk refresh nanti
        window.d3TreeInstance = d3Tree;
            }
    
    // ========== FUNGSI LOAD DUAL TREE VISUALIZATION ==========
    function loadDualTreeVisualization() {
        // Load both static and D3.js visualizations
        loadStaticTreeVisualization();
        loadD3TreeVisualization();
    }
    
    // ========== FUNGSI LOAD MODEL EVALUATION ==========
    function loadModelEvaluation() {
        // Load confusion matrix
        $.ajax({
            url: `${API_URL}/prediksi/confusion-matrix`,
            method: "GET",
            beforeSend: function(xhr) {
                $("#confusion-matrix-container").addClass("loading").html("");
                const token = getToken();
                if (token) {
                    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                }
            },
            success: function(data) {
                $("#confusion-matrix-container").removeClass("loading");
                if (data.status === "success" && data.confusion_matrix) {
                    displayConfusionMatrix(data.confusion_matrix, data.labels);
                } else {
                    $("#confusion-matrix-container").html('<p>Confusion matrix tidak tersedia. Silakan latih model terlebih dahulu.</p>');
                }
            },
            error: function(xhr) {
                $("#confusion-matrix-container").removeClass("loading");
                console.error("Error loading confusion matrix:", xhr.responseText);
                const errorMsg = xhr.responseJSON ? xhr.responseJSON.detail : 'Gagal memuat confusion matrix';
                $("#confusion-matrix-container").html(`<p>${errorMsg}. Silakan coba lagi.</p>`);
            }
        });
        
        // Load model metrics
        $.ajax({
            url: `${API_URL}/prediksi/model-metrics`,
            method: "GET",
            beforeSend: function(xhr) {
                const token = getToken();
                if (token) {
                    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                }
            },
            success: function(data) {
                if (data.status === "success" && data.metrics) {
                    displayModelMetrics(data.metrics, data.last_trained);
                } else {
                    resetModelMetrics();
                }
            },
            error: function(xhr) {
                console.error("Error loading model metrics:", xhr.responseText);
                const errorMsg = xhr.responseJSON ? xhr.responseJSON.detail : 'Gagal memuat model metrics';
                console.warn(`Model metrics error: ${errorMsg}`);
                resetModelMetrics();
            }
        });
    }
    
    // ========== FUNGSI DISPLAY CONFUSION MATRIX ==========
    function displayConfusionMatrix(matrix, labels) {
        let tableHtml = '<table>';
        
        // Header row
        tableHtml += '<tr><th></th>';
        labels.forEach(label => {
            tableHtml += `<th>Prediksi ${label}</th>`;
        });
        tableHtml += '</tr>';
        
        // Data rows
        for (let i = 0; i < matrix.length; i++) {
            tableHtml += `<tr><td class="matrix-label">Aktual ${labels[i]}</td>`;
            for (let j = 0; j < matrix[i].length; j++) {
                const cellClass = i === j ? 'matrix-cell correct' : 'matrix-cell incorrect';
                tableHtml += `<td class="${cellClass}">${matrix[i][j]}</td>`;
            }
            tableHtml += '</tr>';
        }
        
        tableHtml += '</table>';
        $("#confusion-matrix-container").html(tableHtml);
    }
    
    // ========== FUNGSI DISPLAY MODEL METRICS ==========
    function displayModelMetrics(metrics, lastTrained) {
        $("#accuracy-value").text((metrics.accuracy * 100).toFixed(2) + '%');
        $("#precision-value").text((metrics.precision * 100).toFixed(2) + '%');
        $("#recall-value").text((metrics.recall * 100).toFixed(2) + '%');
        $("#f1-score-value").text((metrics.f1_score * 100).toFixed(2) + '%');
        
        if (lastTrained) {
            const date = new Date(lastTrained);
            $("#last-trained").text(date.toLocaleString('id-ID'));
        } else {
            $("#last-trained").text('Belum pernah');
        }
    }
    
    // ========== FUNGSI RESET MODEL METRICS ==========
    function resetModelMetrics() {
        $("#accuracy-value").text('-');
        $("#precision-value").text('-');
        $("#recall-value").text('-');
        $("#f1-score-value").text('-');
        $("#last-trained").text('Belum pernah');
    }
    
    // ========== FUNGSI LOAD FEATURE STATISTICS ==========
    function loadFeatureStatistics() {
        const container = $("#feature-statistics-container");
        
        // Set loading state
        container.html(`
            <div class="text-center p-4">
                <i class="fas fa-spinner fa-spin fa-2x text-muted mb-3"></i>
                <p class="text-muted">Memuat statistik fitur...</p>
            </div>
        `);
        
        $.ajax({
            url: `${API_URL}/prediksi/feature-statistics`,
            method: "GET",
            beforeSend: function(xhr) {
                const token = getToken();
                if (token) {
                    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                }
            },
            success: function(data) {
                if (data.status === "success") {
                    displayFeatureStatistics(data.data);
                } else {
                    container.html(`
                        <div class="text-center p-4">
                            <i class="fas fa-exclamation-triangle fa-2x text-warning mb-3"></i>
                            <p class="text-muted">${data.message || 'Statistik fitur tidak tersedia'}</p>
                        </div>
                    `);
                }
            },
            error: function(xhr) {
                console.error("Error loading feature statistics:", xhr.responseText);
                const errorMsg = xhr.responseJSON ? xhr.responseJSON.detail : 'Gagal memuat statistik fitur';
                container.html(`
                    <div class="text-center p-4">
                        <i class="fas fa-times-circle fa-2x text-danger mb-3"></i>
                        <p class="text-muted">${errorMsg}</p>
                        <button class="btn btn-sm btn-outline-primary mt-2" onclick="loadFeatureStatistics()">
                            <i class="fas fa-retry mr-1"></i> Coba Lagi
                        </button>
                    </div>
                `);
            }
        });
    }
    
    // ========== FUNGSI DISPLAY FEATURE STATISTICS ==========
    function displayFeatureStatistics(data) {
        const container = $("#feature-statistics-container");
        const numericalStats = data.numerical_statistics;
        const categoricalStats = data.categorical_distributions;
        const summary = data.summary;
        
        let html = `
            <div class="statistics-summary mb-4">
                <div class="row">
                    <div class="col-md-3 col-sm-6 mb-2">
                        <div class="category-item">
                            <div class="category-label">Total Records</div>
                            <div class="category-value">${summary.total_records}</div>
                        </div>
                    </div>
                    <div class="col-md-3 col-sm-6 mb-2">
                        <div class="category-item">
                            <div class="category-label">Labeled Records</div>
                            <div class="category-value">${summary.labeled_records}</div>
                        </div>
                    </div>
                    <div class="col-md-3 col-sm-6 mb-2">
                        <div class="category-item">
                            <div class="category-label">Features Analyzed</div>
                            <div class="category-value">${summary.features_analyzed}</div>
                        </div>
                    </div>
                    <div class="col-md-3 col-sm-6 mb-2">
                        <div class="category-item">
                            <div class="category-label">Categories Analyzed</div>
                            <div class="category-value">${summary.categories_analyzed}</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="statistics-tabs">
                <button class="statistics-tab active" onclick="switchStatisticsTab('numerical')">
                    <i class="fas fa-chart-line mr-1"></i>
                    Statistik Numerik
                </button>
                <button class="statistics-tab" onclick="switchStatisticsTab('correlation')">
                    <i class="fas fa-project-diagram mr-1"></i>
                    Korelasi Fitur
                </button>
                <button class="statistics-tab" onclick="switchStatisticsTab('categorical')">
                    <i class="fas fa-chart-pie mr-1"></i>
                    Distribusi Kategori
                </button>
                <button class="statistics-tab" onclick="switchStatisticsTab('barchart')">
                    <i class="fas fa-chart-bar mr-1"></i>
                    Bar Chart Analisis
                </button>
            </div>
            
            <div id="numerical-stats" class="statistics-content active">
                ${generateNumericalStatsTable(numericalStats)}
            </div>
            
            <div id="correlation-stats" class="statistics-content">
                ${generateCorrelationMatrix(data.correlation_matrix)}
            </div>
            
            <div id="categorical-stats" class="statistics-content">
                ${generateCategoricalStatsDisplay(categoricalStats)}
            </div>
            
            <div id="barchart-stats" class="statistics-content">
                ${generateBarChartAnalysis(data)}
            </div>
        `;
        
        container.html(html);
        
        // Store correlation data for heatmap generation
        if (data.correlation_matrix) {
            currentCorrelationData = data.correlation_matrix;
        }
    }
    
    // ========== FUNGSI GENERATE NUMERICAL STATS TABLE ==========
    function generateNumericalStatsTable(stats) {
        if (!stats || Object.keys(stats).length === 0) {
            return `
                <div class="text-center p-4">
                    <i class="fas fa-info-circle fa-2x text-info mb-3"></i>
                    <p class="text-muted">Tidak ada data statistik numerik yang tersedia</p>
                </div>
            `;
        }
        
        let html = `
            <table class="feature-statistics-table">
                <thead>
                    <tr>
                        <th>Fitur</th>
                        <th>Count</th>
                        <th>Min</th>
                        <th>Max</th>
                        <th>Mean</th>
                        <th>Median</th>
                        <th>Std Dev</th>
                        <th>Q1</th>
                        <th>Q3</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        Object.keys(stats).forEach(key => {
            const stat = stats[key];
            const valueClass = getStatValueClass(key);
            
            html += `
                <tr>
                    <td class="feature-label">${stat.label}</td>
                    <td class="stat-value count">${stat.count}</td>
                    <td class="stat-value ${valueClass}">${formatStatValue(stat.min, key)}</td>
                    <td class="stat-value ${valueClass}">${formatStatValue(stat.max, key)}</td>
                    <td class="stat-value ${valueClass}">${formatStatValue(stat.mean, key)}</td>
                    <td class="stat-value ${valueClass}">${formatStatValue(stat.median, key)}</td>
                    <td class="stat-value ${valueClass}">${formatStatValue(stat.std_dev, key)}</td>
                    <td class="stat-value ${valueClass}">${formatStatValue(stat.q1, key)}</td>
                    <td class="stat-value ${valueClass}">${formatStatValue(stat.q3, key)}</td>
                </tr>
            `;
        });
        
        html += `
                </tbody>
            </table>
        `;
        
        return html;
    }
    
    // ========== FUNGSI GENERATE CORRELATION MATRIX ==========
    function generateCorrelationMatrix(correlationData) {
        if (!correlationData || !correlationData.matrix || Object.keys(correlationData.matrix).length === 0) {
            return `
                <div class="text-center p-4">
                    <i class="fas fa-info-circle fa-2x text-info mb-3"></i>
                    <p class="text-muted">Tidak ada data korelasi yang tersedia</p>
                    <small class="text-muted">Minimal 2 fitur numerik diperlukan untuk menghitung korelasi</small>
                </div>
            `;
        }
        
        if (correlationData.error) {
            return `
                <div class="text-center p-4">
                    <i class="fas fa-exclamation-triangle fa-2x text-warning mb-3"></i>
                    <p class="text-muted">${correlationData.error}</p>
                </div>
            `;
        }
        
        const matrix = correlationData.matrix;
        const features = correlationData.features || Object.keys(matrix);
        
        let html = `
            <div class="correlation-section">
                <div class="mb-3">
                    <h6 class="mb-2">
                        <i class="fas fa-project-diagram mr-2 text-primary"></i>
                        Matriks Korelasi Antar Fitur Numerik
                    </h6>
                    <p class="text-muted small">${correlationData.description}</p>
                </div>
                
                <!-- View Toggle Buttons -->
                <div class="correlation-view-toggle">
                    <button class="view-toggle-btn active" onclick="toggleCorrelationView('table')">
                        <i class="fas fa-table mr-1"></i> Tabel
                    </button>
                    <button class="view-toggle-btn" onclick="toggleCorrelationView('heatmap')">
                        <i class="fas fa-th mr-1"></i> Heatmap
                    </button>
                </div>
                
                <!-- Table View -->
                <div id="correlation-table-view" class="correlation-table-section active">
                    <div class="correlation-matrix-container">
                        <table class="correlation-matrix-table">
                            <thead>
                                <tr>
                                    <th class="feature-header">Fitur</th>
        `;
        
        // Header columns
        features.forEach(feature => {
            html += `<th class="feature-header" title="${feature}">${truncateText(feature, 12)}</th>`;
        });
        
        html += `
                                </tr>
                            </thead>
                            <tbody>
        `;
        
        // Matrix rows
        features.forEach(feature1 => {
            html += `
                <tr>
                    <td class="feature-label" title="${feature1}">${truncateText(feature1, 15)}</td>
            `;
            
            features.forEach(feature2 => {
                const correlation = matrix[feature1] && matrix[feature1][feature2] !== undefined 
                    ? matrix[feature1][feature2] 
                    : 0;
                
                const cellClass = getCorrelationCellClass(correlation);
                const cellTitle = getCorrelationInterpretation(correlation);
                
                html += `
                    <td class="correlation-cell ${cellClass}" 
                        title="${feature1} vs ${feature2}: ${correlation} (${cellTitle})">
                        ${correlation.toFixed(3)}
                    </td>
                `;
            });
            
            html += `</tr>`;
        });
        
        html += `
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <!-- Heatmap View -->
                <div id="correlation-heatmap-view" class="correlation-heatmap-section">
                    <div class="correlation-heatmap-container">
                        <div class="heatmap-controls">
                            <button class="heatmap-control-btn active" onclick="updateHeatmapDisplay('values')">
                                <i class="fas fa-eye mr-1"></i> Tampilkan Nilai
                            </button>
                            <button class="heatmap-control-btn" onclick="updateHeatmapDisplay('colors')">
                                <i class="fas fa-palette mr-1"></i> Hanya Warna
                            </button>
                        </div>
                        <div id="correlation-heatmap"></div>
                        <div class="heatmap-legend">
                            <div class="heatmap-legend-item">
                                <div class="heatmap-legend-color" style="background: #d73027;"></div>
                                <span>Negatif Kuat (-1.0)</span>
                            </div>
                            <div class="heatmap-legend-item">
                                <div class="heatmap-legend-color" style="background: #f46d43;"></div>
                                <span>Negatif Sedang (-0.5)</span>
                            </div>
                            <div class="heatmap-legend-item">
                                <div class="heatmap-legend-color" style="background: #fdae61;"></div>
                                <span>Negatif Lemah (-0.2)</span>
                            </div>
                            <div class="heatmap-legend-item">
                                <div class="heatmap-legend-color" style="background: #ffffbf;"></div>
                                <span>Netral (0.0)</span>
                            </div>
                            <div class="heatmap-legend-item">
                                <div class="heatmap-legend-color" style="background: #abd9e9;"></div>
                                <span>Positif Lemah (0.2)</span>
                            </div>
                            <div class="heatmap-legend-item">
                                <div class="heatmap-legend-color" style="background: #74add1;"></div>
                                <span>Positif Sedang (0.5)</span>
                            </div>
                            <div class="heatmap-legend-item">
                                <div class="heatmap-legend-color" style="background: #4575b4;"></div>
                                <span>Positif Kuat (1.0)</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="correlation-legend mt-4">
                    <h6 class="mb-2">
                        <i class="fas fa-info-circle mr-2 text-info"></i>
                        Interpretasi Korelasi
                    </h6>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="legend-item">
                                <span class="legend-color strong-positive"></span>
                                <span class="legend-text">Korelasi Positif Kuat (0.7 - 1.0)</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-color moderate-positive"></span>
                                <span class="legend-text">Korelasi Positif Sedang (0.3 - 0.7)</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-color weak-positive"></span>
                                <span class="legend-text">Korelasi Positif Lemah (0.1 - 0.3)</span>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="legend-item">
                                <span class="legend-color no-correlation"></span>
                                <span class="legend-text">Tidak Ada Korelasi (-0.1 - 0.1)</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-color weak-negative"></span>
                                <span class="legend-text">Korelasi Negatif Lemah (-0.3 - -0.1)</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-color strong-negative"></span>
                                <span class="legend-text">Korelasi Negatif Kuat (-1.0 - -0.3)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return html;
    }
    
    // ========== FUNGSI HELPER UNTUK KORELASI ==========
    function getCorrelationCellClass(correlation) {
        const abs = Math.abs(correlation);
        if (abs >= 0.7) {
            return correlation > 0 ? 'strong-positive' : 'strong-negative';
        } else if (abs >= 0.3) {
            return correlation > 0 ? 'moderate-positive' : 'moderate-negative';
        } else if (abs >= 0.1) {
            return correlation > 0 ? 'weak-positive' : 'weak-negative';
        } else {
            return 'no-correlation';
        }
    }
    
    function getCorrelationInterpretation(correlation) {
        const abs = Math.abs(correlation);
        if (abs >= 0.7) {
            return correlation > 0 ? 'Korelasi positif kuat' : 'Korelasi negatif kuat';
        } else if (abs >= 0.3) {
            return correlation > 0 ? 'Korelasi positif sedang' : 'Korelasi negatif sedang';
        } else if (abs >= 0.1) {
            return correlation > 0 ? 'Korelasi positif lemah' : 'Korelasi negatif lemah';
        } else {
            return 'Tidak ada korelasi';
        }
    }
    
    function truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
    }

    // ========== FUNGSI GENERATE CATEGORICAL STATS DISPLAY ==========
    function generateCategoricalStatsDisplay(stats) {
        if (!stats || Object.keys(stats).length === 0) {
            return `
                <div class="text-center p-4">
                    <i class="fas fa-info-circle fa-2x text-info mb-3"></i>
                    <p class="text-muted">Tidak ada data distribusi kategori yang tersedia</p>
                </div>
            `;
        }
        
        let html = '';
        
        Object.keys(stats).forEach(key => {
            const stat = stats[key];
            html += `
                <div class="mb-4">
                    <h6 class="mb-3">
                        <i class="fas fa-chart-pie mr-2 text-primary"></i>
                        ${stat.label}
                    </h6>
                    <div class="category-distribution">
            `;
            
            Object.keys(stat.data).forEach(category => {
                const count = stat.data[category];
                const percentage = ((count / stat.total) * 100).toFixed(1);
                
                html += `
                    <div class="category-item">
                        <div class="category-label">${category}</div>
                        <div class="category-value">${count}</div>
                        <div class="category-percentage">${percentage}%</div>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        });
        
        return html;
    }
    
    // ========== FUNGSI GENERATE BAR CHART ANALYSIS ==========
    function generateBarChartAnalysis(data) {
        if (!data || !data.summary) {
            return `
                <div class="text-center p-4">
                    <i class="fas fa-info-circle fa-2x text-info mb-3"></i>
                    <p class="text-muted">Tidak ada data untuk analisis bar chart</p>
                </div>
            `;
        }
        
        let html = `
            <div class="barchart-analysis-section">
                <div class="mb-4">
                    <h6 class="mb-3">
                        <i class="fas fa-chart-bar mr-2 text-primary"></i>
                        Analisis Bar Chart - Penghasilan Orang Tua, Presensi Kehadiran, dan Nilai Raport
                    </h6>
                    <p class="text-muted small">Visualisasi interaktif distribusi data menggunakan bar chart D3.js</p>
                </div>
                
                <!-- Chart Controls -->
                <div class="barchart-controls mb-4">
                    <div class="row">
                        <div class="col-md-4">
                            <label class="control-label">Pilih Analisis:</label>
                            <select id="chart-type-selector" class="form-control form-control-sm" onchange="updateBarChart()">
                                <option value="penghasilan">Penghasilan Orang Tua</option>
                                <option value="kehadiran">Presensi Kehadiran</option>
                                <option value="nilai-raport">Nilai Raport</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label class="control-label">Tampilan:</label>
                            <select id="chart-display-mode" class="form-control form-control-sm" onchange="updateBarChart()">
                                <option value="count">Jumlah (Count)</option>
                                <option value="percentage">Persentase (%)</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label class="control-label">Warna:</label>
                            <select id="chart-color-scheme" class="form-control form-control-sm" onchange="updateBarChart()">
                                <option value="blue">Biru</option>
                                <option value="green">Hijau</option>
                                <option value="orange">Orange</option>
                                <option value="purple">Ungu</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <!-- Chart Container -->
                <div class="barchart-container">
                    <div id="d3-barchart"></div>
                </div>
                
                <!-- Chart Legend -->
                <div class="barchart-legend mt-3">
                    <div class="row">
                        <div class="col-md-12">
                            <small class="text-muted">
                                <i class="fas fa-info-circle mr-1"></i>
                                Hover pada bar untuk melihat detail informasi. Klik untuk highlight.
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return html;
    }
    
    // ========== FUNGSI HELPER UNTUK STATISTIK ==========
    function getStatValueClass(key) {
        if (key.includes('penghasilan')) return 'currency';
        if (key.includes('persentase')) return 'percentage';
        if (key.includes('nilai') || key.includes('rata')) return 'score';
        return '';
    }
    
    function formatStatValue(value, key) {
        if (key.includes('penghasilan')) {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(value);
        }
        if (key.includes('persentase')) {
            return value + '%';
        }
        return value;
    }
    
    function switchStatisticsTab(tabName) {
        // Remove active class from all tabs and contents
        $('.statistics-tab').removeClass('active');
        $('.statistics-content').removeClass('active');
        
        // Add active class to clicked tab and corresponding content
        let tabText = '';
        let contentId = '';
        
        switch(tabName) {
            case 'numerical':
                tabText = 'Statistik Numerik';
                contentId = 'numerical-stats';
                break;
            case 'correlation':
                tabText = 'Korelasi Fitur';
                contentId = 'correlation-stats';
                break;
            case 'categorical':
                tabText = 'Distribusi Kategori';
                contentId = 'categorical-stats';
                break;
            case 'barchart':
                tabText = 'Bar Chart Analisis';
                contentId = 'barchart-stats';
                // Initialize bar chart when tab is activated
                setTimeout(() => {
                    initializeBarChart();
                }, 100);
                break;
        }
        
        $(`.statistics-tab:contains('${tabText}')`).addClass('active');
        $(`#${contentId}`).addClass('active');
    }
    
    function refreshFeatureStatistics() {
        loadFeatureStatistics();
    }
    
    // ========== FUNGSI HEATMAP KORELASI ==========
    let currentCorrelationData = null;
    let showHeatmapValues = true;
    
    function toggleCorrelationView(viewType) {
        // Update button states
        $('.view-toggle-btn').removeClass('active');
        $(`.view-toggle-btn:contains('${viewType === 'table' ? 'Tabel' : 'Heatmap'}')`).addClass('active');
        
        // Show/hide views
        if (viewType === 'table') {
            $('#correlation-table-view').addClass('active').show();
            $('#correlation-heatmap-view').removeClass('active').hide();
        } else {
            $('#correlation-table-view').removeClass('active').hide();
            $('#correlation-heatmap-view').addClass('active').show();
            
            // Generate heatmap if data is available
            if (currentCorrelationData) {
                generateCorrelationHeatmap(currentCorrelationData);
            }
        }
    }
    
    function updateHeatmapDisplay(displayType) {
        // Update button states
        $('.heatmap-control-btn').removeClass('active');
        $(`.heatmap-control-btn:contains('${displayType === 'values' ? 'Tampilkan Nilai' : 'Hanya Warna'}')`).addClass('active');
        
        showHeatmapValues = (displayType === 'values');
        
        // Regenerate heatmap with new display settings
        if (currentCorrelationData) {
            generateCorrelationHeatmap(currentCorrelationData);
        }
    }
    
    function generateCorrelationHeatmap(correlationData) {
        if (!correlationData || !correlationData.matrix) {
            return;
        }
        
        // Store data for later use
        currentCorrelationData = correlationData;
        
        const matrix = correlationData.matrix;
        const features = correlationData.features || Object.keys(matrix);
        
        // Clear previous heatmap
        d3.select("#correlation-heatmap").selectAll("*").remove();
        
        // Set dimensions and margins
        const margin = { top: 80, right: 50, bottom: 120, left: 120 };
        const cellSize = 60;
        const width = cellSize * features.length + margin.left + margin.right;
        const height = cellSize * features.length + margin.top + margin.bottom;
        
        // Create SVG
        const svg = d3.select("#correlation-heatmap")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("class", "heatmap-svg");
        
        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
        
        // Create color scale
        const colorScale = d3.scaleSequential()
            .interpolator(d3.interpolateRdYlBu)
            .domain([1, -1]); // Reverse domain for proper color mapping
        
        // Create tooltip
        const tooltip = d3.select("body").append("div")
            .attr("class", "heatmap-tooltip")
            .style("opacity", 0);
        
        // Prepare data for heatmap
        const heatmapData = [];
        features.forEach((feature1, i) => {
            features.forEach((feature2, j) => {
                const correlation = matrix[feature1] && matrix[feature1][feature2] !== undefined 
                    ? matrix[feature1][feature2] 
                    : 0;
                
                heatmapData.push({
                    x: j,
                    y: i,
                    feature1: feature1,
                    feature2: feature2,
                    correlation: correlation,
                    interpretation: getCorrelationInterpretation(correlation)
                });
            });
        });
        
        // Create cells
        const cells = g.selectAll(".heatmap-cell")
            .data(heatmapData)
            .enter()
            .append("rect")
            .attr("class", "heatmap-cell")
            .attr("x", d => d.x * cellSize)
            .attr("y", d => d.y * cellSize)
            .attr("width", cellSize)
            .attr("height", cellSize)
            .attr("fill", d => colorScale(d.correlation))
            .on("mouseover", function(event, d) {
                // Highlight cell
                d3.select(this)
                    .attr("stroke", "#333")
                    .attr("stroke-width", 3);
                
                // Show tooltip
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                
                tooltip.html(`
                    <strong>${truncateText(d.feature1, 20)}</strong><br/>
                    <strong>vs</strong><br/>
                    <strong>${truncateText(d.feature2, 20)}</strong><br/>
                    <hr style="margin: 5px 0; border-color: #666;">
                    <strong>Korelasi:</strong> ${d.correlation.toFixed(3)}<br/>
                    <strong>Interpretasi:</strong> ${d.interpretation}
                `)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 10) + "px");
            })
            .on("mouseout", function(d) {
                // Remove highlight
                d3.select(this)
                    .attr("stroke", "#fff")
                    .attr("stroke-width", 2);
                
                // Hide tooltip
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
        
        // Add correlation values as text (if enabled)
        if (showHeatmapValues) {
            g.selectAll(".heatmap-text")
                .data(heatmapData)
                .enter()
                .append("text")
                .attr("class", "heatmap-text")
                .attr("x", d => d.x * cellSize + cellSize / 2)
                .attr("y", d => d.y * cellSize + cellSize / 2)
                .text(d => d.correlation.toFixed(2))
                .attr("fill", d => {
                    // Use contrasting text color based on background
                    const brightness = d3.hsl(colorScale(d.correlation)).l;
                    return brightness > 0.6 ? "#333" : "#fff";
                });
        }
        
        // Add X-axis labels
        g.selectAll(".x-label")
            .data(features)
            .enter()
            .append("text")
            .attr("class", "heatmap-label x-axis")
            .attr("x", (d, i) => i * cellSize + cellSize / 2)
            .attr("y", -10)
            .text(d => truncateText(d, 15))
            .attr("transform", (d, i) => `rotate(-45, ${i * cellSize + cellSize / 2}, -10)`);
        
        // Add Y-axis labels
        g.selectAll(".y-label")
            .data(features)
            .enter()
            .append("text")
            .attr("class", "heatmap-label y-axis")
            .attr("x", -10)
            .attr("y", (d, i) => i * cellSize + cellSize / 2)
            .text(d => truncateText(d, 15));
        
        // Add title
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", 30)
            .attr("text-anchor", "middle")
            .attr("class", "heatmap-title")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .style("fill", "#333")
            .text("Heatmap Korelasi Antar Fitur Numerik");
        
        // Cleanup tooltip on window resize or navigation
        window.addEventListener('beforeunload', () => {
            tooltip.remove();
        });
    }
    
    // Make functions globally accessible
    window.switchStatisticsTab = switchStatisticsTab;
    window.refreshFeatureStatistics = refreshFeatureStatistics;
    window.toggleCorrelationView = toggleCorrelationView;
    window.updateHeatmapDisplay = updateHeatmapDisplay;
    
    function createPrestasiChart(tinggi, sedang, rendah) {
        $("#chart-prestasi").kendoChart({
            title: {
                text: "Distribusi Prestasi Siswa"
            },
            legend: {
                position: "bottom"
            },
            seriesDefaults: {
                type: "pie"
            },
            series: [{
                data: [
                    { category: "Tinggi", value: tinggi, color: "#28a745" },
                    { category: "Sedang", value: sedang, color: "#ffc107" },
                    { category: "Rendah", value: rendah, color: "#dc3545" }
                ]
            }],
            tooltip: {
                visible: true,
                template: "#= category #: #= value # siswa (#= kendo.format('{0:P}', percentage) #)"
            }
        });
    }
    
    // ========== FUNGSI DATA SISWA ==========
    function initSiswaGrid() {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: `${API_URL}/siswa`,
                    dataType: "json",
                    beforeSend: function(xhr) {
                        const token = getToken();
                        if (token) {
                            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                        }
                    },
                    error: function(xhr) {
                        const errorMsg = xhr.responseJSON ? xhr.responseJSON.detail : 'Terjadi kesalahan saat mengambil data';
                        $("#toast-container").kendoNotification({
                            position: {
                                pinned: false,
                                top: 30,
                                right: 30
                            },
                            autoHideAfter: 3000,
                            stacking: "up"
                        }).data("kendoNotification").error(errorMsg);
                    }
                },
                create: {
                    url: `${API_URL}/siswa`,
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json",
                    beforeSend: function(xhr) {
                        const token = getToken();
                        if (token) {
                            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                        }
                    },
                    complete: function(xhr, status) {
                        console.log("Complete:", xhr, status);
                        dataSource.read();
                    },
                    error: function(xhr) {
                        const errorMsg = xhr.responseJSON ? xhr.responseJSON.detail : 'Terjadi kesalahan saat menambah data';
                        $("#toast-container").kendoNotification({
                            position: {
                                pinned: false,
                                top: 30,
                                right: 30
                            },
                            autoHideAfter: 3000,
                            stacking: "up"
                        }).data("kendoNotification").error(errorMsg);
                    }
                },
                update: {
                    url: function(data) {
                        return `${API_URL}/siswa/${data.id}`;
                    },
                    dataType: "json",
                    type: "PUT",
                    contentType: "application/json",
                    beforeSend: function(xhr) {
                        const token = getToken();
                        if (token) {
                            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                        }
                    },
                    complete: function(e) {
                        dataSource.read();
                    },
                    error: function(xhr) {
                        const errorMsg = xhr.responseJSON ? xhr.responseJSON.detail : 'Terjadi kesalahan saat mengupdate data';
                        $("#toast-container").kendoNotification({
                            position: {
                                pinned: false,
                                top: 30,
                                right: 30
                            },
                            autoHideAfter: 3000,
                            stacking: "up"
                        }).data("kendoNotification").error(errorMsg);
                    }
                },
                destroy: {
                    url: function(data) {
                        return `${API_URL}/siswa/${data.id}`;
                    },
                    dataType: "json",
                    type: "DELETE",
                    beforeSend: function(xhr) {
                        const token = getToken();
                        if (token) {
                            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                        }
                    },
                    complete: function(e) {
                        dataSource.read();
                    },
                    error: function(xhr) {
                        const errorMsg = xhr.responseJSON ? xhr.responseJSON.detail : 'Terjadi kesalahan saat menghapus data';
                        $("#toast-container").kendoNotification({
                            position: {
                                pinned: false,
                                top: 30,
                                right: 30
                            },
                            autoHideAfter: 3000,
                            stacking: "up"
                        }).data("kendoNotification").error(errorMsg);
                    }
                },
                parameterMap: function(data, type) {
                    if (type === "create" || type === "update") {
                        return JSON.stringify(data);
                    }
                    return data;
                }
            },
            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: { editable: false, nullable: true },
                        nama: { validation: { required: true } },
                        nis: { validation: { required: true } },
                        jenis_kelamin: { validation: { required: true } },
                        kelas: { validation: { required: true } },
                        tanggal_lahir: { type: "date", validation: { required: true } },
                        alamat: { },
                        created_at: { editable: false },
                        updated_at: { editable: false }
                    }
                }
            },
            pageSize: 10
        });
        
        $("#siswa-grid").kendoGrid({
            dataSource: dataSource,
            height: 550,
            pageable: true,
            sortable: true,
            filterable: true,
            toolbar: ["create", {
                name: "export",
                text: "Export Excel",
                template: `<button class="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary" onclick="exportSiswaExcel()"><span class="k-icon k-i-excel"></span> Export Excel</button>`
            }, {
                name: "upload",
                text: "Upload Excel",
                template: `
                    <div style="display: inline-block; margin-left: 5px;">
                        <input type="file" id="fileUpload" style="display: none;" accept=".xlsx,.xls" />
                        <button class="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary" onclick="document.getElementById('fileUpload').click()">
                            <span class="k-icon k-i-upload"></span> Upload Excel
                        </button>
                    </div>
                `
            }],
            editable: {
                mode: "popup",
                template: function() {
                    const templateHtml = $("#siswa-template").html();
                    if (!templateHtml) {
                        console.error("Template #siswa-template tidak ditemukan");
                        return "<div>Error: Template tidak ditemukan</div>";
                    }
                    return kendo.template(templateHtml);
                }()
            },
            columns: [
                { field: "nama", title: "Nama", width: 180 },
                { field: "nis", title: "NIS", width: 120 },
                { field: "jenis_kelamin", title: "Jenis Kelamin", width: 130 },
                { field: "kelas", title: "Kelas", width: 100 },
                { field: "tanggal_lahir", title: "Tanggal Lahir", format: "{0:dd/MM/yyyy}", width: 130 },
                { field: "alamat", title: "Alamat", width: 200 },
                {
                    command: [
                        {
                            name: "edit",
                            text: { edit: "Edit", update: "Simpan", cancel: "Batal" }
                        },
                        // {
                        //     name: "destroy",
                        //     text: "Hapus",
                        //     iconClass: "k-icon k-i-delete",
                        //     click: function(e) {
                        //         e.preventDefault();
                        //         const dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                        //         showDeleteConfirmationSiswa(dataItem);
                        //         return false;
                        //     }
                        // }
                    ],
                    title: "Edit", 
                    width: 80
                },
                {
                    field: "id",
                    title: "Hapus",
                    width: 90,
                    template: function(dataItem) {
                        return `<button class="k-button k-button-solid k-button-solid-error k-button-sm btn-delete-siswa" 
                                       data-id="${dataItem.id}" 
                                       data-nama="${dataItem.nama}" 
                                       data-nis="${dataItem.nis}" 
                                       data-kelas="${dataItem.kelas}" 
                                       data-jenis_kelamin="${dataItem.jenis_kelamin}">
                                    <i class="k-icon k-i-delete"></i> Hapus
                                </button>`;
                    }
                }
            ],
            edit: function(e) {
                // Inisialisasi DatePicker untuk tanggal lahir
                e.container.find("[name='tanggal_lahir']").kendoDatePicker({
                    format: "dd/MM/yyyy"
                });
                
                // Inisialisasi DropDownList untuk jenis kelamin
                e.container.find("[name='jenis_kelamin']").kendoDropDownList({
                    dataSource: ["Laki-laki", "Perempuan"]
                });
            }
        });
    }
    
    $(document).on("click", ".btn-delete-siswa", function(e) {
        e.preventDefault();
        
        const button = $(this);
        const dataItem = {
            id: button.data("id"),
            nama: button.data("nama"),
            nis: button.data("nis"),
            kelas: button.data("kelas"),
            jenis_kelamin: button.data("jenis_kelamin")
        };
        
        console.log("Delete button clicked:", dataItem);
        showDeleteConfirmationSiswa(dataItem);
    });

    $(document).on("click", ".btn-delete-user", function(e) {
        e.preventDefault();
        
        const button = $(this);
        
        // Enhanced data extraction dengan null safety
        const dataItem = {
            id: button.data("id") || '',
            username: button.data("username") || '',
            email: button.data("email") || '',
            role: button.data("role") || '',
            nama_lengkap: button.data("nama_lengkap") || button.data("nama-lengkap") || button.attr("data-nama_lengkap") || '',
            nip: button.data("nip") || '',
            jabatan: button.data("jabatan") || '',
            is_active: button.data("is_active") !== undefined ? button.data("is_active") : true
        };
        
        console.log("Delete button clicked:", dataItem);
        console.log("Button data attributes:", {
            "data-nama_lengkap": button.data("nama_lengkap"),
            "data-nama-lengkap": button.data("nama-lengkap"),
            "attr data-nama_lengkap": button.attr("data-nama_lengkap"),
            "all data": button.data()
        });
        
        // Validasi data sebelum menampilkan modal
        if (!dataItem.id) {
            console.error("Missing user ID for delete operation");
            showErrorNotification("Data user tidak valid untuk dihapus", "Error");
            return;
        }
        
        showDeleteConfirmationUsers(dataItem);
    });
    
    // Fungsi untuk menangani upload file Excel
    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const token = getToken();
        if (!token) {
            $("#toast-container").kendoNotification({
                position: {
                    pinned: false,
                    top: 30,
                    right: 30
                },
                autoHideAfter: 3000,
                stacking: "up"
            }).data("kendoNotification").error("Anda harus login terlebih dahulu");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        $.ajax({
            url: `${API_URL}/siswa/upload/excel`,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            },
            success: function(response) {
                $("#toast-container").kendoNotification({
                    position: {
                        pinned: false,
                        top: 30,
                        right: 30
                    },
                    autoHideAfter: 3000,
                    stacking: "up"
                }).data("kendoNotification").success("Data berhasil diupload");
                
                // Refresh grid setelah upload berhasil
                $("#siswa-grid").data("kendoGrid").dataSource.read();
            },
            error: function(xhr) {
                const errorMsg = xhr.responseJSON ? xhr.responseJSON.detail : 'Terjadi kesalahan saat mengupload file';
                $("#toast-container").kendoNotification({
                    position: {
                        pinned: false,
                        top: 30,
                        right: 30
                    },
                    autoHideAfter: 3000,
                    stacking: "up"
                }).data("kendoNotification").error(errorMsg);
            }
        });

        // Reset input file
        event.target.value = '';
    }

    // Tambahkan event listener untuk file upload
    $(document).on('change', '#fileUpload', handleFileUpload);

    window.exportSiswaExcel = function() {
        const token = getToken();
        if (!token) {
            $("#toast-container").kendoNotification({
                position: {
                    pinned: false,
                    top: 30,
                    right: 30
                },
                autoHideAfter: 3000,
                stacking: "up"
            }).data("kendoNotification").error("Anda harus login terlebih dahulu");
            return;
        }

        // Buat link untuk download
        const link = document.createElement('a');
        link.href = `${API_URL}/siswa/export/excel`;
        link.download = 'Data_Siswa.xlsx';
        
        // Tambahkan header Authorization
        fetch(link.href, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('Error:', error);
            $("#toast-container").kendoNotification({
                position: {
                    pinned: false,
                    top: 30,
                    right: 30
                },
                autoHideAfter: 3000,
                stacking: "up"
            }).data("kendoNotification").error('Gagal mengunduh file Excel');
        });
    };

// ========== FUNGSI DATA NILAI RAPORT ==========
    function initNilaiGrid() {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: `${API_URL}/nilai`,
                    dataType: "json",
                    beforeSend: function(xhr) {
                        const token = getToken();
                        if (token) {
                            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                        }
                    }
                },
                create: {
                    url: `${API_URL}/nilai`,
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json",
                    beforeSend: function(xhr) {
                        const token = getToken();
                        if (token) {
                            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                        }
                    },
                    complete: function(e) {
                        dataSource.read();
                    }
                },
                update: {
                    url: function(data) {
                        return `${API_URL}/nilai/${data.id}`;
                    },
                    dataType: "json",
                    type: "PUT",
                    contentType: "application/json",
                    beforeSend: function(xhr) {
                        const token = getToken();
                        if (token) {
                            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                        }
                    },
                    complete: function(e) {
                        dataSource.read();
                    }
                },
                destroy: {
                    url: function(data) {
                        return `${API_URL}/nilai/${data.id}`;
                    },
                    dataType: "json",
                    type: "DELETE",
                    beforeSend: function(xhr) {
                        const token = getToken();
                        if (token) {
                            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                        }
                    },
                    complete: function(e) {
                        dataSource.read();
                    }
                },
                parameterMap: function(data, type) {
                    if (type === "create" || type === "update") {
                        return JSON.stringify(data);
                    }
                    return data;
                }
            },
            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: { editable: false, nullable: true },
                        siswa_id: { validation: { required: true } },
                        nama_siswa: { editable: false },
                        semester: { validation: { required: true } },
                        tahun_ajaran: { validation: { required: true } },
                        matematika: { type: "number", validation: { required: true, min: 0, max: 100 } },
                        bahasa_indonesia: { type: "number", validation: { required: true, min: 0, max: 100 } },
                        bahasa_inggris: { type: "number", validation: { required: true, min: 0, max: 100 } },
                        ipa: { type: "number", validation: { required: true, min: 0, max: 100 } },
                        bahasa_jawa: { type: "number", validation: { required: true, min: 0, max: 100 } },
                        pkn: { type: "number", validation: { required: true, min: 0, max: 100 } },
                        seni: { type: "number", validation: { required: true, min: 0, max: 100 } },
                        sejarah: { type: "number", validation: { required: true, min: 0, max: 100 } },
                        agama: { type: "number", validation: { required: true, min: 0, max: 100 } },
                        pjok: { type: "number", validation: { required: true, min: 0, max: 100 } },
                        dasar_kejuruan: { type: "number", validation: { required: true, min: 0, max: 100 } },
                        rata_rata: { type: "number", editable: false },
                        created_at: { editable: false },
                        updated_at: { editable: false }
                    }
                }
            },
            pageSize: 10
        });
        
        $("#nilai-grid").kendoGrid({
            dataSource: dataSource,
            height: 550,
            pageable: true,
            sortable: true,
            filterable: true,
            toolbar: ["create", {
                name: "export",
                text: "Export Excel",
                template: `<button class="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary" onclick="exportNilaiExcel()"><span class="k-icon k-i-excel"></span> Export Excel</button>`
            }],
            excel: {
                fileName: "Data Nilai Raport.xlsx",
                filterable: true,
                allPages: true
            },
            editable: {
                mode: "popup",
                template: function() {
                    const templateHtml = $("#nilai-template").html();
                    if (!templateHtml) {
                        console.error("Template #nilai-template tidak ditemukan");
                        return "<div>Error: Template tidak ditemukan</div>";
                    }
                    return kendo.template(templateHtml);
                }()
            },
            columns: [
                { 
                    field: "nama_siswa", 
                    title: "Nama Siswa", 
                    width: 180,
                    template: function(dataItem) {
                        return dataItem.nama_siswa || dataItem.siswa?.nama || "-";
                    }
                },
                { field: "siswa_id", title: "Siswa ID", hidden: true, editor: siswaDropDownEditor },
                { field: "semester", title: "Semester", width: 100 },
                { field: "tahun_ajaran", title: "Tahun Ajaran", width: 120 },
                { field: "matematika", title: "MTK", format: "{0:n1}", width: 85 },
                { field: "bahasa_indonesia", title: "B.IND", format: "{0:n1}", width: 85 },
                { field: "bahasa_inggris", title: "B.ING", format: "{0:n1}", width: 85 },
                { field: "ipa", title: "IPA", format: "{0:n1}", width: 85 },
                // { field: "bahasa_jawa", title: "B.JAW", format: "{0:n1}", width: 70 },
                // { field: "pkn", title: "PKN", format: "{0:n1}", width: 70 },
                // { field: "seni", title: "SENI", format: "{0:n1}", width: 70 },
                // { field: "pjok", title: "PJOK", format: "{0:n1}", width: 70 },
                // { field: "sejarah", title: "SEJ", format: "{0:n1}", width: 70 },
                // { field: "agama", title: "AGM", format: "{0:n1}", width: 70 },
                // { field: "dasar_kejuruan", title: "D.KEJ", format: "{0:n1}", width: 70 },
                { field: "rata_rata", title: "Rata²", format: "{0:n1}", width: 85 },
                { command: ["edit"], title: "Edit", width: 70 },
                {
                    title: "Hapus",
                    width: 70,
                    template: function(dataItem) {
                        console.log("Template dataItem Nilai:", dataItem);
                        
                        // Safe extraction dengan null checks
                        const safeData = {
                            id: dataItem.id || '',
                            nama_siswa: dataItem.nama_siswa || dataItem.siswa?.nama || '',
                            semester: dataItem.semester || '',
                            tahun_ajaran: dataItem.tahun_ajaran || '',
                            matematika: dataItem.matematika || 0,
                            bahasa_indonesia: dataItem.bahasa_indonesia || 0,
                            bahasa_inggris: dataItem.bahasa_inggris || 0,
                            ipa: dataItem.ipa || 0,
                            rata_rata: dataItem.rata_rata || 0
                        };
                        
                        console.log("Safe data for template Nilai:", safeData);
                        
                        return `<button class="k-button k-button-solid k-button-solid-error k-button-sm btn-delete-nilai" 
                                       data-id="${safeData.id}"
                                       data-nama_siswa="${safeData.nama_siswa}"
                                       data-semester="${safeData.semester}"
                                       data-tahun_ajaran="${safeData.tahun_ajaran}"
                                       data-matematika="${safeData.matematika}"
                                       data-bahasa_indonesia="${safeData.bahasa_indonesia}"
                                       data-bahasa_inggris="${safeData.bahasa_inggris}"
                                       data-ipa="${safeData.ipa}"
                                       data-rata_rata="${safeData.rata_rata}">
                                    <i class="k-icon k-i-delete"></i> Hapus
                                </button>`;
                    }
                }
            ],
            edit: function(e) {
                // Set default values for new records
                if (e.model.isNew()) {
                    e.model.set("semester", "Ganjil");
                    e.model.set("tahun_ajaran", new Date().getFullYear() + "/" + (new Date().getFullYear() + 1));
                }
                
                // Initialize form components
                setTimeout(function() {
                    // Initialize siswa dropdown
                    e.container.find("[name='siswa_id']").kendoDropDownList({
                        dataTextField: "nama",
                        dataValueField: "id",
                        dataSource: {
                            transport: {
                                read: {
                                    url: `${API_URL}/siswa`,
                                    dataType: "json",
                                    beforeSend: function(xhr) {
                                        const token = getToken();
                                        if (token) {
                                            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                                        }
                                    }
                                }
                            }
                        },
                        optionLabel: "-- Pilih Siswa --",
                        change: function() {
                            // Update nama_siswa field when siswa selection changes
                            const selectedSiswa = this.dataItem();
                            if (selectedSiswa) {
                                e.model.set("nama_siswa", selectedSiswa.nama);
                            }
                        }
                    });
                    
                    // Auto-calculate rata-rata when grade values change
                    const gradeFields = ['matematika', 'bahasa_indonesia', 'bahasa_inggris', 'ipa', 'bahasa_jawa', 'pkn', 'seni', 'sejarah', 'agama', 'pjok', 'dasar_kejuruan'];
                    
                    gradeFields.forEach(function(field) {
                        e.container.find(`[name='${field}']`).on("input change", function() {
                            calculateAverage();
                        });
                    });
                    
                    function calculateAverage() {
                        let total = 0;
                        let count = 0;
                        
                        gradeFields.forEach(function(field) {
                            const value = parseFloat(e.container.find(`[name='${field}']`).val());
                            if (!isNaN(value) && value >= 0) {
                                total += value;
                                count++;
                            }
                        });
                        
                        const average = count > 0 ? (total / count) : 0;
                        e.container.find("[name='rata_rata']").val(average.toFixed(2));
                        
                        // Update model value
                        e.model.set("rata_rata", average);
                    }
                    
                    // Calculate initial average if editing existing record
                    if (!e.model.isNew()) {
                        calculateAverage();
                    }
                    
                    // Add custom validation styling for number inputs
                    e.container.find("input[type='number']").on("blur", function() {
                        const $this = $(this);
                        const value = parseFloat($this.val());
                        
                        if ($this.prop("required") && ($this.val() === "" || isNaN(value))) {
                            $this.addClass("k-invalid");
                        } else if (!isNaN(value) && (value < 0 || value > 100)) {
                            $this.addClass("k-invalid");
                            // Show custom error for out of range
                            const fieldName = $this.attr("name");
                            const errorSpan = $this.siblings(".k-invalid-msg");
                            if (errorSpan.length) {
                                errorSpan.text("Nilai harus antara 0-100");
                            }
                        } else {
                            $this.removeClass("k-invalid");
                        }
                    });
                    
                }, 100);
            }
        });
    }
    
    // Export function for nilai raport
    window.exportNilaiExcel = function() {
        const token = getToken();
        if (!token) {
            showErrorNotification("Anda harus login terlebih dahulu");
            return;
        }

        // Buat link untuk download
        const link = document.createElement('a');
        link.href = `${API_URL}/nilai/export/excel`;
        link.download = 'Data_Nilai_Raport.xlsx';
        
        // Tambahkan header Authorization
        fetch(link.href, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            showSuccessNotification("File Excel berhasil diunduh");
        })
        .catch(error => {
            console.error('Error:', error);
            showErrorNotification('Gagal mengunduh file Excel');
        });
    };
    
    // Export function for presensi
    window.exportPresensiExcel = function() {
        const token = getToken();
        if (!token) {
            showErrorNotification("Anda harus login terlebih dahulu");
            return;
        }

        // Buat link untuk download
        const link = document.createElement('a');
        link.href = `${API_URL}/presensi/export/excel`;
        link.download = 'Data_Presensi.xlsx';
        
        // Tambahkan header Authorization
        fetch(link.href, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            showSuccessNotification("File Excel berhasil diunduh");
        })
        .catch(error => {
            console.error('Error:', error);
            showErrorNotification('Gagal mengunduh file Excel');
        });
    };
    
    // Export function for penghasilan orang tua
    window.exportPenghasilanExcel = function() {
        const token = getToken();
        if (!token) {
            showErrorNotification("Anda harus login terlebih dahulu");
            return;
        }

        // Buat link untuk download
        const link = document.createElement('a');
        link.href = `${API_URL}/penghasilan/export/excel`;
        link.download = 'Data_Penghasilan_Orang_Tua.xlsx';
        
        // Tambahkan header Authorization
        fetch(link.href, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            showSuccessNotification("File Excel berhasil diunduh");
        })
        .catch(error => {
            console.error('Error:', error);
            showErrorNotification('Gagal mengunduh file Excel');
        });
    };
    
    // Export function for riwayat prediksi prestasi
    window.exportRiwayatPrediksiExcel = function() {
        const token = getToken();
        if (!token) {
            showErrorNotification("Anda harus login terlebih dahulu");
            return;
        }

        // Buat link untuk download
        const link = document.createElement('a');
        link.href = `${API_URL}/prediksi/history/export/excel`;
        link.download = 'Riwayat_Prediksi_Prestasi.xlsx';
        
        // Tambahkan header Authorization
        fetch(link.href, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            showSuccessNotification("File Excel riwayat prediksi berhasil diunduh");
        })
        .catch(error => {
            console.error('Error:', error);
            showErrorNotification('Gagal mengunduh file Excel riwayat prediksi');
        });
    };
    
    // ========== FUNGSI DATA PRESENSI ==========
    function initPresensiGrid() {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: `${API_URL}/presensi`,
                    dataType: "json",
                    beforeSend: function(xhr) {
                        const token = getToken();
                        if (token) {
                            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                        }
                    }
                },
                create: {
                    url: `${API_URL}/presensi`,
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json",
                    beforeSend: function(xhr) {
                        const token = getToken();
                        if (token) {
                            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                        }
                    },
                    complete: function(e) {
                        dataSource.read();
                    }
                },
                update: {
                    url: function(data) {
                        return `${API_URL}/presensi/${data.id}`;
                    },
                    dataType: "json",
                    type: "PUT",
                    contentType: "application/json",
                    beforeSend: function(xhr) {
                        const token = getToken();
                        if (token) {
                            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                        }
                    },
                    complete: function(e) {
                        dataSource.read();
                    }
                },
                parameterMap: function(data, type) {
                    if (type === "create" || type === "update") {
                        return JSON.stringify(data);
                    }
                    return data;
                }
            },
            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: { editable: false, nullable: true },
                        siswa_id: { validation: { required: true } },
                        nama_siswa: { editable: false },
                        semester: { validation: { required: true } },
                        tahun_ajaran: { validation: { required: true } },
                        jumlah_hadir: { type: "number", validation: { required: true, min: 0 } },
                        jumlah_sakit: { type: "number", validation: { required: true, min: 0 } },
                        jumlah_izin: { type: "number", validation: { required: true, min: 0 } },
                        jumlah_alpa: { type: "number", validation: { required: true, min: 0 } },
                        persentase_kehadiran: { type: "number", editable: false },
                        kategori_kehadiran: { editable: false },
                        created_at: { editable: false },
                        updated_at: { editable: false }
                    }
                }
            },
            pageSize: 10
        });
        
        $("#presensi-grid").kendoGrid({
            dataSource: dataSource,
            height: 550,
            pageable: true,
            sortable: true,
            filterable: true,
            toolbar: ["create", { template: '<button class="k-button k-button-icontext" onclick="exportPresensiExcel()"><span class="k-icon k-i-excel"></span>Export Excel</button>' }],
            editable: {
                mode: "popup",
                template: function() {
                    const templateHtml = $("#presensi-template").html();
                    if (!templateHtml) {
                        console.error("Template #presensi-template tidak ditemukan");
                        return "<div>Error: Template tidak ditemukan</div>";
                    }
                    return kendo.template(templateHtml);
                }()
            },
            columns: [
                { 
                    field: "nama_siswa", 
                    title: "Nama Siswa", 
                    width: 180,
                    template: function(dataItem) {
                        return dataItem.nama_siswa || dataItem.siswa?.nama || "-";
                    }
                },
                { field: "siswa_id", title: "Siswa ID", hidden: true, editor: siswaDropDownEditor },
                { field: "semester", title: "Semester", width: 100 },
                { field: "tahun_ajaran", title: "Tahun Ajaran", width: 120 },
                { field: "jumlah_hadir", title: "Hadir", width: 100 },
                { field: "jumlah_sakit", title: "Sakit", width: 75 },
                { field: "jumlah_izin", title: "Izin", width: 75 },
                { field: "jumlah_alpa", title: "Alpa", width: 75 },
                { field: "persentase_kehadiran", title: "%", format: "{0:n1}%", width: 75 },
                { field: "kategori_kehadiran", title: "Kategori", width: 100 },
                { command: ["edit"], title: "Edit", width: 85 },
                {
                    title: "Hapus",
                    width: 70,
                    template: function(dataItem) {
                        return `<button class="k-button k-button-solid k-button-solid-error k-button-sm btn-delete-presensi" 
                                       data-id="${dataItem.id}" 
                                       data-nama="${dataItem.nama_siswa || dataItem.siswa?.nama || '-'}" 
                                       data-semester="${dataItem.semester}" 
                                       data-tahun_ajaran="${dataItem.tahun_ajaran}" 
                                       data-jumlah_hadir="${dataItem.jumlah_hadir}" 
                                       data-jumlah_sakit="${dataItem.jumlah_sakit}" 
                                       data-jumlah_izin="${dataItem.jumlah_izin}" 
                                       data-jumlah_alpa="${dataItem.jumlah_alpa}" 
                                       data-persentase_kehadiran="${dataItem.persentase_kehadiran}" 
                                       data-kategori_kehadiran="${dataItem.kategori_kehadiran}">
                                    <i class="k-icon k-i-delete"></i> Hapus
                                </button>`;
                    }
                }
            ],
            edit: function(e) {
                // Set default values for new records
                if (e.model.isNew()) {
                    e.model.set("semester", "Ganjil");
                    e.model.set("tahun_ajaran", new Date().getFullYear() + "/" + (new Date().getFullYear() + 1));
                }
                
                // Initialize form components
                setTimeout(function() {
                    // Initialize siswa dropdown
                    e.container.find("[name='siswa_id']").kendoDropDownList({
                        dataTextField: "nama",
                        dataValueField: "id",
                        dataSource: {
                            transport: {
                                read: {
                                    url: `${API_URL}/siswa`,
                                    dataType: "json",
                                    beforeSend: function(xhr) {
                                        const token = getToken();
                                        if (token) {
                                            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                                        }
                                    }
                                }
                            }
                        },
                        optionLabel: "-- Pilih Siswa --",
                        change: function() {
                            // Update nama_siswa field when siswa selection changes
                            const selectedSiswa = this.dataItem();
                            if (selectedSiswa) {
                                e.model.set("nama_siswa", selectedSiswa.nama);
                            }
                        }
                    });
                    
                    // Auto-calculate persentase and kategori when attendance values change
                    const attendanceFields = ['jumlah_hadir', 'jumlah_sakit', 'jumlah_izin', 'jumlah_alpa'];
                    
                    attendanceFields.forEach(function(field) {
                        e.container.find(`[name='${field}']`).on("input change", function() {
                            calculateAttendancePercentage();
                        });
                    });
                    
                    function calculateAttendancePercentage() {
                        const jumlahHadir = parseInt(e.container.find("[name='jumlah_hadir']").val()) || 0;
                        const jumlahSakit = parseInt(e.container.find("[name='jumlah_sakit']").val()) || 0;
                        const jumlahIzin = parseInt(e.container.find("[name='jumlah_izin']").val()) || 0;
                        const jumlahAlpa = parseInt(e.container.find("[name='jumlah_alpa']").val()) || 0;
                        
                        const totalHari = jumlahHadir + jumlahSakit + jumlahIzin + jumlahAlpa;
                        
                        let persentase = 0;
                        let kategori = "Rendah";
                        
                        if (totalHari > 0) {
                            persentase = (jumlahHadir / totalHari) * 100;
                            
                            if (persentase >= 80) {
                                kategori = "Tinggi";
                            } else if (persentase >= 75) {
                                kategori = "Sedang";
                            } else {
                                kategori = "Rendah";
                            }
                        }
                        
                        e.container.find("[name='persentase_kehadiran']").val(persentase.toFixed(2));
                        e.container.find("[name='kategori_kehadiran']").val(kategori);
                        
                        // Update model values
                        e.model.set("persentase_kehadiran", persentase);
                        e.model.set("kategori_kehadiran", kategori);
                    }
                    
                    // Calculate initial percentage if editing existing record
                    if (!e.model.isNew()) {
                        calculateAttendancePercentage();
                    }
                    
                    // Add custom validation styling for number inputs
                    e.container.find("input[type='number']").on("blur", function() {
                        const $this = $(this);
                        const value = parseInt($this.val());
                        
                        if ($this.prop("required") && ($this.val() === "" || isNaN(value))) {
                            $this.addClass("k-invalid");
                        } else if (!isNaN(value) && value < 0) {
                            $this.addClass("k-invalid");
                            // Show custom error for negative values
                            const fieldName = $this.attr("name");
                            const errorSpan = $this.siblings(".k-invalid-msg");
                            if (errorSpan.length) {
                                errorSpan.text("Nilai tidak boleh negatif");
                            }
                        } else {
                            $this.removeClass("k-invalid");
                        }
                    });
                    
                }, 100);
            }
        });
    }
    
    // Event handler untuk button delete presensi
    $(document).on("click", ".btn-delete-presensi", function(e) {
        e.preventDefault();
        
        const button = $(this);
        const dataItem = {
            id: button.data("id"),
            nama_siswa: button.data("nama"),
            semester: button.data("semester"),
            tahun_ajaran: button.data("tahun_ajaran"),
            jumlah_hadir: button.data("jumlah_hadir"),
            jumlah_sakit: button.data("jumlah_sakit"),
            jumlah_izin: button.data("jumlah_izin"),
            jumlah_alpa: button.data("jumlah_alpa"),
            persentase_kehadiran: button.data("persentase_kehadiran"),
            kategori_kehadiran: button.data("kategori_kehadiran")
        };
        
        console.log("Delete presensi button clicked:", dataItem);
        showDeleteConfirmationPresensi(dataItem);
    });
    
    // ========== FUNGSI DATA PENGHASILAN ORTU ==========
    function initPenghasilanGrid() {
        dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: `${API_URL}/penghasilan`,
                    dataType: "json",
                    beforeSend: function(xhr) {
                        const token = getToken();
                        if (token) {
                            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                        }
                    }
                },
                create: {
                    url: `${API_URL}/penghasilan`,
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json",
                    beforeSend: function(xhr) {
                        const token = getToken();
                        if (token) {
                            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                        }
                    }
                },
                update: {
                    url: function(data) {
                        return `${API_URL}/penghasilan/${data.id}`;
                    },
                    dataType: "json",
                    type: "PUT",
                    contentType: "application/json",
                    beforeSend: function(xhr) {
                        const token = getToken();
                        if (token) {
                            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                        }
                    },
                    complete:function(e){
                        dataSource.read();
                    }
                },
                destroy: {
                    url: function(data) {
                        return `${API_URL}/penghasilan/${data.id}`;
                    },
                    dataType: "json",
                    type: "DELETE",
                    beforeSend: function(xhr) {
                        const token = getToken();
                        if (token) {
                            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                        }
                    }
                },
                parameterMap: function(data, type) {
                    if (type === "create" || type === "update") {
                        return JSON.stringify(data);
                    }
                    return data;
                }
            },
            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: { editable: false, nullable: true },
                        siswa_id: { validation: { required: true } },
                        nama_siswa: { editable: false },
                        penghasilan_ayah: { type: "number", validation: { required: true, min: 0 } },
                        penghasilan_ibu: { type: "number", validation: { required: true, min: 0 } },
                        pekerjaan_ayah: { validation: { required: true } },
                        pekerjaan_ibu: { validation: { required: true } },
                        pendidikan_ayah: { validation: { required: true } },
                        pendidikan_ibu: { validation: { required: true } },
                        total_penghasilan: { type: "number", editable: false },
                        kategori_penghasilan: { editable: false },
                        created_at: { editable: false },
                        updated_at: { editable: false }
                    }
                }
            },
            pageSize: 10
        });
        $("#penghasilan-grid").kendoGrid({
            dataSource: dataSource,
            height: 550,
            pageable: true,
            sortable: true,
            filterable: true,
            toolbar: ["create", { template: '<button class="k-button k-button-icontext" onclick="exportPenghasilanExcel()"><span class="k-icon k-i-excel"></span>Export Excel</button>' }],
            editable: {
                mode: "popup",
                template: function() {
                    const templateHtml = $("#penghasilan-template").html();
                    if (!templateHtml) {
                        console.error("Template #penghasilan-template tidak ditemukan");
                        return "<div>Error: Template tidak ditemukan</div>";
                    }
                    return kendo.template(templateHtml);
                }()
            },
            columns: [
                { 
                    field: "nama_siswa", 
                    title: "Nama Siswa", 
                    width: 180,
                    template: function(dataItem) {
                        return dataItem.nama_siswa || dataItem.siswa?.nama || "-";
                    }
                },
                { field: "siswa_id", title: "Siswa ID", hidden: true, editor: siswaDropDownEditor },
                { field: "penghasilan_ayah", title: "Penghasilan Ayah", format: "{0:n0}", width: 125 },
                { field: "penghasilan_ibu", title: "Penghasilan Ibu", format: "{0:n0}", width: 100 },
                // { field: "pekerjaan_ayah", title: "Pekerjaan Ayah", width: 120 },
                // { field: "pekerjaan_ibu", title: "Pekerjaan Ibu", width: 120 },
                // { field: "pendidikan_ayah", title: "Pendidikan Ayah", width: 120 },
                // { field: "pendidikan_ibu", title: "Pendidikan Ibu", width: 120 },
                { field: "total_penghasilan", title: "Total", format: "{0:n0}", width: 100 },
                { field: "kategori_penghasilan", title: "Kategori", width: 85 },
                { command: ["edit"], title: "Edit", width: 85 },
                {
                    title: "Hapus",
                    width: 85,
                    template: function(dataItem) {
                        return `<button class="k-button k-button-solid k-button-solid-error k-button-sm btn-delete-penghasilan" 
                                       data-id="${dataItem.id}" 
                                       data-nama="${dataItem.nama_siswa || dataItem.siswa?.nama || '-'}" 
                                       data-penghasilan_ayah="${dataItem.penghasilan_ayah}" 
                                       data-penghasilan_ibu="${dataItem.penghasilan_ibu}" 
                                       data-total_penghasilan="${dataItem.total_penghasilan}" 
                                       data-kategori_penghasilan="${dataItem.kategori_penghasilan}">
                                    <i class="k-icon k-i-delete"></i> Hapus
                                </button>`;
                    }
                }
            ],
            edit: function(e) {
                // Initialize form components
                setTimeout(function() {
                    // Initialize siswa dropdown
                    e.container.find("[name='siswa_id']").kendoDropDownList({
                        dataTextField: "nama",
                        dataValueField: "id",
                        dataSource: {
                            transport: {
                                read: {
                                    url: `${API_URL}/siswa`,
                                    dataType: "json",
                                    beforeSend: function(xhr) {
                                        const token = getToken();
                                        if (token) {
                                            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                                        }
                                    }
                                }
                            }
                        },
                        optionLabel: "-- Pilih Siswa --",
                        change: function() {
                            // Update nama_siswa field when siswa selection changes
                            const selectedSiswa = this.dataItem();
                            if (selectedSiswa) {
                                e.model.set("nama_siswa", selectedSiswa.nama);
                            }
                        }
                    });
                    
                    // Auto-calculate total and kategori when income values change
                    const incomeFields = ['penghasilan_ayah', 'penghasilan_ibu'];
                    
                    incomeFields.forEach(function(field) {
                        e.container.find(`[name='${field}']`).on("input change", function() {
                            calculateIncomeTotal();
                        });
                    });
                    
                    function calculateIncomeTotal() {
                        const penghasilanAyah = parseInt(e.container.find("[name='penghasilan_ayah']").val()) || 0;
                        const penghasilanIbu = parseInt(e.container.find("[name='penghasilan_ibu']").val()) || 0;
                        
                        const totalPenghasilan = penghasilanAyah + penghasilanIbu;
                        
                        let kategori = "Rendah";
                        
                        if (totalPenghasilan > 5000000) {
                            kategori = "Tinggi";
                        } else if (totalPenghasilan >= 2000000) {
                            kategori = "Sedang";
                        } else {
                            kategori = "Rendah";
                        }
                        
                        e.container.find("[name='total_penghasilan']").val(totalPenghasilan);
                        e.container.find("[name='kategori_penghasilan']").val(kategori);
                        
                        // Update model values
                        e.model.set("total_penghasilan", totalPenghasilan);
                        e.model.set("kategori_penghasilan", kategori);
                    }
                    
                    // Calculate initial total if editing existing record
                    if (!e.model.isNew()) {
                        calculateIncomeTotal();
                    }
                    
                    // Add custom validation styling for number inputs
                    e.container.find("input[type='number']").on("blur", function() {
                        const $this = $(this);
                        const value = parseInt($this.val());
                        
                        if ($this.prop("required") && ($this.val() === "" || isNaN(value))) {
                            $this.addClass("k-invalid");
                        } else if (!isNaN(value) && value < 0) {
                            $this.addClass("k-invalid");
                            // Show custom error for negative values
                            const fieldName = $this.attr("name");
                            const errorSpan = $this.siblings(".k-invalid-msg");
                            if (errorSpan.length) {
                                errorSpan.text("Nilai tidak boleh negatif");
                            }
                        } else {
                            $this.removeClass("k-invalid");
                        }
                    });
                    
                }, 100);
            }
        });
    }
    
    // Event handler untuk button delete penghasilan
    $(document).on("click", ".btn-delete-penghasilan", function(e) {
        e.preventDefault();
        
        const button = $(this);
        const dataItem = {
            id: button.data("id"),
            nama_siswa: button.data("nama"),
            penghasilan_ayah: button.data("penghasilan_ayah"),
            penghasilan_ibu: button.data("penghasilan_ibu"),
            total_penghasilan: button.data("total_penghasilan"),
            kategori_penghasilan: button.data("kategori_penghasilan")
        };
        
        console.log("Delete penghasilan button clicked:", dataItem);
        showDeleteConfirmationPenghasilan(dataItem);
    });
    
    // ========== FUNGSI PREDIKSI PRESTASI ==========
    function initGenerateDummyForm() {
        $("#generate-dummy-form").kendoForm({
            formData: {
                jumlah_data: 10
            },
            items: [
                {
                    field: "jumlah_data",
                    label: "Jumlah Data",
                    validation: { required: true, min: 1 }
                }
            ],
            submit: function(e) {
                e.preventDefault();
                
                const jumlahData = parseInt(e.model.jumlah_data);
                
                if (isNaN(jumlahData) || jumlahData < 1) {
                    alert("Mohon masukkan jumlah data yang valid!");
                    return;
                }
                
                $.ajax({
                    url: `${API_URL}/prediksi/generate-dummy`,
                    method: "POST",
                    contentType: "application/json",
                    beforeSend: function(xhr) {
                        const token = getToken();
                        if (token) {
                            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                        }
                    },
                    data: JSON.stringify({
                        jumlah_data: jumlahData
                    }),
                    success: function(data) {
                        alert(`Berhasil membuat ${data.jumlah_data} data dummy.`);
                        
                        // Refresh grid yang relevan
                        if ($("#siswa-grid").data("kendoGrid")) {
                            $("#siswa-grid").data("kendoGrid").dataSource.read();
                        }
                        if ($("#nilai-grid").data("kendoGrid")) {
                            $("#nilai-grid").data("kendoGrid").dataSource.read();
                        }
                        if ($("#presensi-grid").data("kendoGrid")) {
                            $("#presensi-grid").data("kendoGrid").dataSource.read();
                        }
                        if ($("#penghasilan-grid").data("kendoGrid")) {
                            $("#penghasilan-grid").data("kendoGrid").dataSource.read();
                        }
                    },
                    error: function(xhr) {
                        let errorMsg = "Terjadi kesalahan saat membuat data dummy.";
                        
                        try {
                            const response = JSON.parse(xhr.responseText);
                            errorMsg = response.detail || errorMsg;
                        } catch (e) {}
                        
                        alert(errorMsg);
                    }
                });
            }
        });
    }
    
    function initPrediksiPage() {
        // Inisialisasi dropdown siswa
        $("#siswa-dropdown").kendoDropDownList({
            dataTextField: "nama",
            dataValueField: "id",
            dataSource: {
                transport: {
                    read: {
                        url: `${API_URL}/siswa`,
                        dataType: "json",
                        beforeSend: function(xhr) {
                            const token = getToken();
                            if (token) {
                                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                            }
                        }
                    }
                }
            },
            optionLabel: "Pilih Siswa..."
        });
        
        // Inisialisasi grid riwayat prediksi
        $("#riwayat-grid").kendoGrid({
            dataSource: {
                transport: {
                    read: {
                        url: `${API_URL}/prediksi/history`,
                        type: "POST",
                        dataType: "json",
                        contentType: "application/json",
                        beforeSend: function(xhr) {
                            const token = getToken();
                            if (token) {
                                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                            }
                        }
                    },
                    parameterMap: function(data, operation) {
                        if (operation === "read") {
                            return JSON.stringify({
                                skip: data.skip || 0,
                                limit: data.take || 10
                            });
                        }
                        return data;
                    }
                },
                schema: {
                    data: "data",
                    total: "total",
                    model: {
                        id: "id"
                    }
                },
                pageSize: 10,
                serverPaging: true
            },
            height: 400,
            toolbar: [{ template: '<button class="k-button k-button-icontext" onclick="exportRiwayatPrediksiExcel()"><span class="k-icon k-i-excel"></span>Export Excel</button>' }],
            pageable: {
                refresh: true,
                pageSizes: [5, 10, 20, 50],
                buttonCount: 5,
                info: true,
                input: true,
                numeric: true,
                previousNext: true
            },
            columns: [
                { field: "nama_siswa", title: "Nama Siswa", width: 150 },
                { field: "semester", title: "Semester", width: 100 },
                { field: "tahun_ajaran", title: "Tahun Ajaran", width: 120 },
                { 
                    field: "prediksi_prestasi", 
                    title: "Prediksi", 
                    width: 100,
                    template: function(dataItem) {
                        const badgeClass = dataItem.prediksi_prestasi === "Tinggi" ? "success" : 
                                         dataItem.prediksi_prestasi === "Sedang" ? "warning" : "danger";
                        return `<span class="badge badge-${badgeClass}">${dataItem.prediksi_prestasi}</span>`;
                    }
                },
                { field: "confidence", title: "Confidence", format: "{0:p2}", width: 100 },
                { field: "created_at", title: "Tanggal", format: "{0:dd/MM/yyyy HH:mm}", width: 150 },
                {
                    field: "id",
                    title: "Aksi",
                    width: 100,
                    template: function(dataItem) {
                        return `<button class="k-button k-button-solid k-button-solid-error k-button-sm btn-delete-riwayat" 
                                       data-id="${dataItem.id}" 
                                       data-nama="${dataItem.nama_siswa}" 
                                       data-semester="${dataItem.semester}" 
                                       data-tahun="${dataItem.tahun_ajaran}" 
                                       data-prediksi="${dataItem.prediksi_prestasi}">
                                    <i class="k-icon k-i-delete"></i> Hapus
                                </button>`;
                    }
                }
            ]
        });
        
        // Event handler untuk tombol hapus riwayat prediksi
        $(document).on("click", ".btn-delete-riwayat", function(e) {
            e.preventDefault();
            
            const button = $(this);
            const dataItem = {
                id: button.data("id"),
                nama_siswa: button.data("nama"),
                semester: button.data("semester"),
                tahun_ajaran: button.data("tahun"),
                prediksi_prestasi: button.data("prediksi")
            };
            
            console.log("Delete button clicked:", dataItem);
            showDeleteConfirmationRiwayat(dataItem);
        });
        
        // Handler untuk tombol prediksi
        $("#btn-prediksi").on("click", function() {
            const siswaId = $("#siswa-dropdown").data("kendoDropDownList").value();
            const semester = $("#semester-input").val();
            const tahunAjaran = $("#tahun-ajaran-input").val();
            
            if (!siswaId || !semester || !tahunAjaran) {
                alert("Mohon lengkapi semua field!");
                return;
            }
            
            // Kirim request prediksi
            $.ajax({
                url: `${API_URL}/prediksi`,
                method: "POST",
                contentType: "application/json",
                beforeSend: function(xhr) {
                    const token = getToken();
                    if (token) {
                        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                    }
                },
                data: JSON.stringify({
                    siswa_id: parseInt(siswaId),
                    semester: semester,
                    tahun_ajaran: tahunAjaran
                }),
                success: function(data) {
                    // Tampilkan hasil prediksi
                    const hasilHTML = `
                        <div class="alert ${getAlertClass(data.prediksi_prestasi)}">
                            <h4 class="alert-heading">Hasil Prediksi untuk ${data.nama_siswa}</h4>
                            <p><strong>Prediksi Prestasi:</strong> ${data.prediksi_prestasi}</p>
                            <p><strong>Confidence:</strong> ${(data.confidence * 100).toFixed(2)}%</p>
                            <hr>
                            <p class="mb-0"><strong>Detail Faktor:</strong></p>
                            <ul>
                                <li>Nilai Rata-rata: ${data.detail_faktor.nilai_rata_rata.toFixed(2)}</li>
                                <li>Kategori Penghasilan: ${data.detail_faktor.kategori_penghasilan}</li>
                                <li>Kategori Kehadiran: ${data.detail_faktor.kategori_kehadiran}</li>
                            </ul>
                        </div>
                    `;
                    
                    $("#hasil-prediksi").html(hasilHTML);
                    
                    // Refresh grid riwayat
                    $("#riwayat-grid").data("kendoGrid").dataSource.read();
                },
                error: function(xhr) {
                    let errorMsg = "Terjadi kesalahan saat melakukan prediksi.";
                    
                    try {
                        const response = JSON.parse(xhr.responseText);
                        errorMsg = response.detail || errorMsg;
                    } catch (e) {}
                    
                    alert(errorMsg);
                }
            });
        });
        
        // Handler untuk tombol latih model
        $("#btn-train").on("click", function() {
            $(this).prop("disabled", true).html('<i class="fas fa-spinner fa-spin mr-2"></i> Melatih...');
            
            $.ajax({
                url: `${API_URL}/prediksi/train`,
                method: "POST",
                beforeSend: function(xhr) {
                    const token = getToken();
                    if (token) {
                        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                    }
                },
                success: function(data) {
                    alert(`Model berhasil dilatih dengan akurasi ${(data.data.accuracy * 100).toFixed(2)}% menggunakan ${data.data.samples} sampel data.`);
                    
                    // Refresh visualisasi dual tree (static + D3.js)
                    loadDualTreeVisualization();
                    
                    // Refresh confusion matrix dan metrik evaluasi
                    loadModelEvaluation();
                },
                error: function(xhr) {
                    let errorMsg = "Terjadi kesalahan saat melatih model.";
                    
                    try {
                        const response = JSON.parse(xhr.responseText);
                        errorMsg = response.detail || errorMsg;
                    } catch (e) {}
                    
                    alert(errorMsg);
                },
                complete: function() {
                    $("#btn-train").prop("disabled", false).html('<i class="fas fa-cogs mr-2"></i> Latih Model');
                }
            });
        });
        
        // Inisialisasi dropdown siswa dengan Kendo UI
        $("#nama-siswa-dummy").kendoDropDownList({
            dataTextField: "nama",
            dataValueField: "id",
            dataSource: {
                transport: {
                    read: {
                        url: `${API_URL}/siswa`,
                        dataType: "json",
                        beforeSend: function(xhr) {
                            const token = getToken();
                            if (token) {
                                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                            }
                        }
                    }
                }
            },
            optionLabel: "Pilih Siswa..."
        });
        
        // Handler untuk tombol buat data dummy berdasarkan nama
        $("#btn-generate-dummy").on("click", function() {
            const siswaId = $("#nama-siswa-dummy").data("kendoDropDownList").value();
            const tahunAjaran = $("#tahun-ajaran-dummy").val();
            
            if (!siswaId || !tahunAjaran) {
                alert("Mohon pilih siswa dan lengkapi tahun ajaran!");
                return;
            }
            
            $(this).prop("disabled", true).html('<i class="fas fa-spinner fa-spin mr-2"></i> Membuat Data...');
            
            $.ajax({
                url: `${API_URL}/prediksi/generate-dummy-by-name`,
                method: "POST",
                contentType: "application/json",
                beforeSend: function(xhr) {
                    const token = getToken();
                    if (token) {
                        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                    }
                },
                data: JSON.stringify({
                    siswa_id: parseInt(siswaId),
                    tahun_ajaran: tahunAjaran
                }),
                success: function(data) {
                    alert(`Berhasil membuat data dummy untuk siswa ${data.data.siswa.nama}. Data yang dibuat: ${data.data.data_dibuat.join(", ")}`);
                    
                    // Refresh grid riwayat jika ada
                    if ($("#riwayat-grid").data("kendoGrid")) {
                        $("#riwayat-grid").data("kendoGrid").dataSource.read();
                    }
                },
                error: function(xhr) {
                    let errorMsg = "Terjadi kesalahan saat membuat data dummy.";
                    
                    try {
                        const response = JSON.parse(xhr.responseText);
                        errorMsg = response.detail || errorMsg;
                    } catch (e) {}
                    
                    alert(errorMsg);
                },
                complete: function() {
                    $("#btn-generate-dummy").prop("disabled", false).html('<i class="fas fa-database mr-2"></i> Buat Data Dummy');
                }
            });
        });
        
        // Handler untuk tombol prediksi batch
        $("#btn-prediksi-batch").on("click", function() {
            const semester = $("#batch-semester-input").val();
            const tahunAjaran = $("#batch-tahun-ajaran-input").val();
            
            if (!semester || !tahunAjaran) {
                showErrorNotification("Mohon lengkapi semester dan tahun ajaran!");
                return;
            }
            
            $(this).prop("disabled", true).html('<i class="fas fa-spinner fa-spin mr-2"></i> Memprediksi...');
            
            $.ajax({
                url: `${API_URL}/prediksi/batch`,
                method: "POST",
                contentType: "application/json",
                beforeSend: function(xhr) {
                    const token = getToken();
                    if (token) {
                        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                    }
                },
                data: JSON.stringify({
                    semester: semester,
                    tahun_ajaran: tahunAjaran
                }),
                success: function(data) {
                    // Tampilkan ringkasan
                    displayBatchSummary(data.summary, data.semester, data.tahun_ajaran);
                    
                    // Tampilkan grid hasil
                    displayBatchResults(data.results);
                    
                    // Tampilkan notifikasi sukses
                    showSuccessNotification(data.message);
                    
                    // Refresh grid riwayat
                    $("#riwayat-grid").data("kendoGrid").dataSource.read();
                },
                error: function(xhr) {
                    let errorMsg = "Terjadi kesalahan saat melakukan prediksi batch.";
                    
                    try {
                        const response = JSON.parse(xhr.responseText);
                        errorMsg = response.detail || errorMsg;
                    } catch (e) {}
                    
                    showErrorNotification(errorMsg);
                },
                complete: function() {
                    $("#btn-prediksi-batch").prop("disabled", false).html('<i class="fas fa-users mr-2"></i> Prediksi Semua Siswa');
                }
            });
        });
    }
    
    // Function to display batch prediction summary
    function displayBatchSummary(summary, semester, tahunAjaran) {
        const summaryHTML = `
            <div class="alert alert-info">
                <h6><i class="fas fa-info-circle mr-2"></i>Semester ${semester} - ${tahunAjaran}</h6>
                <div class="row">
                    <div class="col-md-6">
                        <p class="mb-1"><strong>Total Siswa:</strong> ${summary.total_siswa}</p>
                        <p class="mb-1"><strong>Berhasil:</strong> ${summary.success_count}</p>
                    </div>
                    <div class="col-md-6">
                        <p class="mb-1"><strong>Gagal:</strong> ${summary.error_count}</p>
                        <p class="mb-1"><strong>Success Rate:</strong> ${summary.success_rate.toFixed(1)}%</p>
                    </div>
                </div>
            </div>
        `;
        
        $("#batch-summary-content").html(summaryHTML);
        $("#batch-summary").removeClass("d-none");
    }
    
    // Function to display batch prediction results in grid
    function displayBatchResults(results) {
        // Destroy existing grid if exists
        if ($("#batch-results-grid").data("kendoGrid")) {
            $("#batch-results-grid").data("kendoGrid").destroy();
        }
        
        $("#batch-results-grid").kendoGrid({
            dataSource: {
                data: results,
                pageSize: 10
            },
            height: 400,
            toolbar: [{ template: '<button class="k-button k-button-icontext" onclick="exportBatchResultsExcel()"><span class="k-icon k-i-excel"></span>Export Excel</button>' }],
            pageable: {
                refresh: true,
                pageSizes: [5, 10, 20, 50],
                buttonCount: 5,
                info: true,
                input: true,
                numeric: true,
                previousNext: true
            },
            sortable: true,
            filterable: true,
            columns: [
                { field: "nama_siswa", title: "Nama Siswa", width: 180 },
                { field: "kelas", title: "Kelas", width: 100 },
                { 
                    field: "prediksi_prestasi", 
                    title: "Prediksi", 
                    width: 120,
                    template: function(dataItem) {
                        const badgeClass = dataItem.prediksi_prestasi === "Tinggi" ? "success" : 
                                         dataItem.prediksi_prestasi === "Sedang" ? "warning" : "danger";
                        return `<span class="badge badge-${badgeClass}">${dataItem.prediksi_prestasi}</span>`;
                    }
                },
                { 
                    field: "confidence", 
                    title: "Confidence", 
                    width: 100,
                    template: function(dataItem) {
                        return `${(dataItem.confidence * 100).toFixed(1)}%`;
                    }
                },
                { 
                    field: "detail_faktor.nilai_rata_rata", 
                    title: "Nilai Rata-rata", 
                    width: 120,
                    template: function(dataItem) {
                        return dataItem.detail_faktor.nilai_rata_rata.toFixed(2);
                    }
                },
                { field: "detail_faktor.kategori_penghasilan", title: "Kategori Penghasilan", width: 150 },
                { field: "detail_faktor.kategori_kehadiran", title: "Kategori Kehadiran", width: 150 }
            ]
        });
        
        $("#batch-results-grid").show();
    }
    
    // Function to export batch results to Excel  
    function exportBatchResultsExcel() {
        const grid = $("#batch-results-grid").data("kendoGrid");
        if (!grid) {
            showErrorNotification("Tidak ada data untuk diexport");
            return;
        }
        
        const semester = $("#batch-semester-input").val();
        const tahunAjaran = $("#batch-tahun-ajaran-input").val();
        
        // Get all data from grid
        const data = grid.dataSource.data();
        
        if (data.length === 0) {
            showErrorNotification("Tidak ada data untuk diexport");
            return;
        }
        
        // Create CSV content
        const headers = ['Nama Siswa', 'Kelas', 'Prediksi Prestasi', 'Confidence (%)', 'Nilai Rata-rata', 'Kategori Penghasilan', 'Kategori Kehadiran'];
        let csvContent = headers.join(',') + '\n';
        
        data.forEach(item => {
            const row = [
                `"${item.nama_siswa}"`,
                `"${item.kelas}"`,
                `"${item.prediksi_prestasi}"`,
                `"${(item.confidence * 100).toFixed(1)}"`,
                `"${item.detail_faktor.nilai_rata_rata.toFixed(2)}"`,
                `"${item.detail_faktor.kategori_penghasilan}"`,
                `"${item.detail_faktor.kategori_kehadiran}"`
            ];
            csvContent += row.join(',') + '\n';
        });
        
        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `Prediksi_Batch_${semester}_${tahunAjaran.replace('/', '-')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showSuccessNotification("File CSV berhasil didownload");
    }
    
    // ========== FUNGSI HELPER ==========
    function siswaDropDownEditor(container, options) {
        $('<input required name="' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                dataTextField: "nama",
                dataValueField: "id",
                dataSource: {
                    transport: {
                        read: {
                            url: `${API_URL}/siswa`,
                            dataType: "json",
                            beforeSend: function(xhr) {
                                const token = getToken();
                                if (token) {
                                    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                                }
                            }
                        }
                    }
                }
            });
    }
    
    function getAlertClass(prestasi) {
        switch(prestasi) {
            case "Tinggi": return "alert-success";
            case "Sedang": return "alert-warning";
            case "Rendah": return "alert-danger";
            default: return "alert-info";
        }
    }

    function initProfilePage() {
        console.log("initProfilePage");
        
        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
        
        // Initialize form with user data
        const profileForm = $("#profile-form").kendoForm({
            formData: {
                username: userData.username || "",
                email: userData.email || "",
                role: userData.role || "",
                profile: {
                    nip: userData.profile?.nip || "",
                    nama_lengkap: userData.profile?.nama_lengkap || "",
                    jabatan: userData.profile?.jabatan || "",
                    no_hp: userData.profile?.no_hp || "",
                    alamat: userData.profile?.alamat || ""
                }
            },
            items: [
                {
                    field: "username",
                    label: "Username",
                    editor: "TextBox",
                    editorOptions: {
                        readonly: true
                    }
                },
                {
                    field: "email",
                    label: "Email",
                    validation: { required: true, email: true }
                },
                {
                    field: "role",
                    label: "Role",
                    editor: "TextBox",
                    editorOptions: {
                        readonly: true
                    }
                },
                {
                    field: "profile.nip",
                    label: "NIP"
                },
                {
                    field: "profile.nama_lengkap",
                    label: "Nama Lengkap",
                    validation: { required: true }
                },
                {
                    field: "profile.jabatan",
                    label: "Jabatan",
                    validation: { required: true }
                },
                {
                    field: "profile.no_hp",
                    label: "No HP"
                },
                {
                    field: "profile.alamat",
                    label: "Alamat",
                    editor: "TextArea"
                }
            ],
            buttonsTemplate: `
                <button type="submit" class="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary">
                    <i class="fas fa-save"></i> Update Profile
                </button>
                <button type="button" class="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base" onclick="loadCurrentUserProfile()">
                    <i class="fas fa-refresh"></i> Refresh
                </button>
            `,
            submit: function(e) {
                e.preventDefault();
                updateUserProfile(e.model);
            }
        }).data("kendoForm");
        
        // Load current user profile from server
        loadCurrentUserProfile();
    }
    
    // Function to load current user profile from server
    function loadCurrentUserProfile() {
        $.ajax({
            url: `${API_URL}/auth/me`,
            method: "GET",
            beforeSend: function(xhr) {
                const token = getToken();
                if (token) {
                    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                }
            },
            success: function(data) {
                // Update localStorage with fresh data
                localStorage.setItem('user_data', JSON.stringify(data));
                
                // Update menu visibility based on updated user data
                setupMenuVisibility();
                
                // Update header user info
                updateHeaderUserInfo();
                
                // Update form with fresh data
                const form = $("#profile-form").data("kendoForm");
                if (form) {
                    form.setOptions({
                        formData: {
                            username: data.username || "",
                            email: data.email || "",
                            role: data.role || "",
                            profile: {
                                nip: data.profile?.nip || "",
                                nama_lengkap: data.profile?.nama_lengkap || "",
                                jabatan: data.profile?.jabatan || "",
                                no_hp: data.profile?.no_hp || "",
                                alamat: data.profile?.alamat || ""
                            }
                        }
                    });
                }
                
                showSuccessNotification("Profile berhasil dimuat", "Sukses");
            },
            error: function(xhr) {
                const errorMsg = xhr.responseJSON?.detail || "Gagal memuat profile";
                showErrorNotification(errorMsg);
                
                if (xhr.status === 401) {
                    setTimeout(() => {
                        window.location.href = "login.html";
                    }, 2000);
                }
            }
        });
    }
    
    // Function to update user profile
    function updateUserProfile(formData) {
        const updateData = {
            email: formData.email,
            profile: formData.profile
        };
        
        $.ajax({
            url: `${API_URL}/auth/me/profile`,
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify(updateData),
            beforeSend: function(xhr) {
                const token = getToken();
                if (token) {
                    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                }
            },
            success: function(data) {
                // Update localStorage with updated data
                localStorage.setItem('user_data', JSON.stringify(data));
                
                // Update menu visibility based on updated user data
                setupMenuVisibility();
                
                // Update header user info
                updateHeaderUserInfo();
                
                showSuccessNotification("Profile berhasil diupdate", "Sukses");
            },
            error: function(xhr) {
                const errorMsg = xhr.responseJSON?.detail || "Gagal mengupdate profile";
                showErrorNotification(errorMsg);
            }
        });
    }
    
    // Make functions globally accessible
    window.loadCurrentUserProfile = loadCurrentUserProfile;


// Update header dengan gaya AdminLTE termasuk logo dan tombol toggle
// $("body").prepend('<header class="main-header">\n    <nav class="navbar navbar-static-top">\n        <div class="navbar-header">\n            <a href="#" class="navbar-brand">\n                <img src="logo.png" alt="Logo" class="brand-image">\n                <span class="brand-text">Prestasi Siswa</span>\n            </a>\n            <button id="sidebar-toggle" class="btn btn-link btn-sm pull-left">\n                <i class="k-icon k-i-menu"></i>\n            </button>\n        </div>\n    </nav>\n</header>');

// Update CSS untuk header AdminLTE
// $("<style>").appendTo("head").text(`
    
// `);

    // Fungsi untuk menampilkan konfirmasi penghapusan
    function showDeleteConfirmation(data) {
        // Hapus window yang mungkin masih ada
        $(".k-window").remove();
        
        // Buat window baru
        const windowElement = $("<div></div>").appendTo("body");
        const window = windowElement.kendoWindow({
            title: "Konfirmasi Hapus",
            width: "400px",
            modal: true,
            visible: false,
            actions: ["close"],
            content: {
                template: `
                    <div class="delete-confirmation">
                        <div class="icon-container">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <div class="message">
                            <h4>Konfirmasi Hapus</h4>
                            <p>Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.</p>
                        </div>
                        <div class="button-container">
                            <button class="k-button k-button-solid-base" id="cancelDelete">
                                <i class="fas fa-times"></i> Batal
                            </button>
                            <button class="k-button k-button-solid-error" id="confirmDelete">
                                <i class="fas fa-trash"></i> Hapus
                            </button>
                        </div>
                    </div>
                `
            }
        }).data("kendoWindow");

        // Event handlers
        windowElement.on("click", "#cancelDelete", function() {
            window.close();
        });

        windowElement.on("click", "#confirmDelete", function() {
            window.close();
            // Proceed with delete
            const grid = $("#users-grid").data("kendoGrid");
            grid.dataSource.remove(data);
            grid.dataSource.sync();
        });

        window.center().open();
    }

    // Fungsi untuk menampilkan konfirmasi penghapusan riwayat prediksi
    function showDeleteConfirmationRiwayat(data) {
        // Hapus window yang mungkin masih ada
        $(".k-window").remove();
        
        // Buat window baru
        const windowElement = $("<div></div>").appendTo("body");
        const window = windowElement.kendoWindow({
            title: "Konfirmasi Hapus Riwayat",
            width: "450px",
            modal: true,
            visible: false,
            actions: ["close"],
            content: {
                template: `
                    <div class="delete-confirmation">
                        <div class="icon-container">
                            <i class="fas fa-exclamation-triangle text-warning"></i>
                        </div>
                        <div class="message">
                            <h4>Konfirmasi Hapus Riwayat Prediksi</h4>
                            <p><strong>Siswa:</strong> ${data.nama_siswa}</p>
                            <p><strong>Semester:</strong> ${data.semester} - ${data.tahun_ajaran}</p>
                            <p><strong>Prediksi:</strong> <span class="badge badge-${data.prediksi_prestasi === "Tinggi" ? "success" : data.prediksi_prestasi === "Sedang" ? "warning" : "danger"}">${data.prediksi_prestasi}</span></p>
                            <hr>
                            <p class="text-danger">Apakah Anda yakin ingin menghapus riwayat prediksi ini? Tindakan ini tidak dapat dibatalkan.</p>
                        </div>
                        <div class="button-container">
                            <button class="k-button k-button-solid-base" id="cancelDeleteRiwayat">
                                <i class="fas fa-times"></i> Batal
                            </button>
                            <button class="k-button k-button-solid-error" id="confirmDeleteRiwayat">
                                <i class="fas fa-trash"></i> Hapus Riwayat
                            </button>
                        </div>
                    </div>
                `
            }
        }).data("kendoWindow");

        // Event handlers
        windowElement.on("click", "#cancelDeleteRiwayat", function() {
            window.close();
        });

        windowElement.on("click", "#confirmDeleteRiwayat", function() {
            window.close();
            
            // Lakukan AJAX call langsung ke backend untuk menghapus
            $.ajax({
                url: `${API_URL}/prediksi/history/${data.id}`,
                type: "DELETE",
                beforeSend: function(xhr) {
                    const token = getToken();
                    if (token) {
                        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                    }
                },
                success: function() {
                    showSuccessNotification("Riwayat prediksi berhasil dihapus", "Sukses");
                    // Refresh grid setelah berhasil menghapus
                    const grid = $("#riwayat-grid").data("kendoGrid");
                    if (grid) {
                        grid.dataSource.read();
                    }
                },
                error: function(xhr) {
                    const errorMsg = xhr.responseJSON?.detail || "Gagal menghapus riwayat prediksi";
                    showErrorNotification(errorMsg, "Error");
                }
            });
        });

        window.center().open();
    }

    // Fungsi untuk menampilkan konfirmasi penghapusan data siswa
    function showDeleteConfirmationSiswa(data) {
        // Hapus window yang mungkin masih ada
        $(".k-window").remove();
        
        // Buat window baru
        const windowElement = $("<div></div>").appendTo("body");
        const window = windowElement.kendoWindow({
            title: "Konfirmasi Hapus Data Siswa",
            width: "450px",
            modal: true,
            visible: false,
            actions: ["close"],
            content: {
                template: `
                    <div class="delete-confirmation">
                        <div class="icon-container">
                            <i class="fas fa-exclamation-triangle text-warning"></i>
                        </div>
                        <div class="message">
                            <h4>Konfirmasi Hapus Data Siswa</h4>
                            <p><strong>Nama:</strong> ${data.nama}</p>
                            <p><strong>NIS:</strong> ${data.nis}</p>
                            <p><strong>Kelas:</strong> ${data.kelas}</p>
                            <p><strong>Jenis Kelamin:</strong> ${data.jenis_kelamin}</p>
                            <hr>
                            <p class="text-danger">Apakah Anda yakin ingin menghapus data siswa ini? Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data terkait (nilai, presensi, penghasilan).</p>
                        </div>
                        <div class="button-container">
                            <button class="k-button k-button-solid-base" id="cancelDeleteSiswa">
                                <i class="fas fa-times"></i> Batal
                            </button>
                            <button class="k-button k-button-solid-error" id="confirmDeleteSiswa">
                                <i class="fas fa-trash"></i> Hapus Data Siswa
                            </button>
                        </div>
                    </div>
                `
            }
        }).data("kendoWindow");

        // Event handlers
        windowElement.on("click", "#cancelDeleteSiswa", function() {
            window.close();
        });

        windowElement.on("click", "#confirmDeleteSiswa", function() {
            window.close();
            
            // Lakukan AJAX call langsung ke backend untuk menghapus
            $.ajax({
                url: `${API_URL}/siswa/${data.id}`,
                type: "DELETE",
                beforeSend: function(xhr) {
                    const token = getToken();
                    if (token) {
                        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                    }
                },
                success: function() {
                    showSuccessNotification("Data siswa berhasil dihapus", "Sukses");
                    // Refresh grid setelah berhasil menghapus
                    const grid = $("#siswa-grid").data("kendoGrid");
                    if (grid) {
                        grid.dataSource.read();
                    }
                },
                error: function(xhr) {
                    const errorMsg = xhr.responseJSON?.detail || "Gagal menghapus data siswa";
                    showErrorNotification(errorMsg, "Error");
                }
            });
        });

        window.center().open();
    }

    function initUsersGrid() {
        console.log("initUsersGrid");
        
        // Double check user access before initializing grid
        const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
        if (userData.role !== 'admin') {
            showErrorNotification("Akses ditolak. Hanya admin yang dapat mengakses manajemen user.", "Akses Ditolak");
            return;
        }

        dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: `${API_URL}/auth/users`,
                    type: "GET",
                    beforeSend: function(xhr) {
                        const token = getToken();
                        if (token) {
                            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                        }
                    },
                    complete: function(e) {
                        try {
                            const response = JSON.parse(e.xhr.responseText);
                            if (response.detail) {
                                showErrorNotification(response.detail);
                            }
                        } catch (error) {
                            if (e.status === 401) {
                                showErrorNotification("Terjadi kesalahan saat menampilkan data user. token expired");  
                                setTimeout(() => {
                                    window.location.href = "/login.html";
                                }, 3000);
                            }
                        }
                    },
                    error: function(xhr) {
                        const errorMsg = xhr.responseJSON?.detail || "Gagal mengambil data user";
                        showErrorNotification(errorMsg);
                    }
                },
                create: {
                    url: `${API_URL}/auth/register`,
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json",
                    beforeSend: function(xhr) {
                        const token = getToken();
                        if (token) {
                            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                        }
                    },
                    complete: function(e) {
                        try {
                            const response = JSON.parse(e.responseText);
                            if (response.message) {
                                showSuccessNotification(response.message, "Sukses");
                            }
                        } catch (error) {
                            if (e.status === 422) {
                                let errorTitle = "Error Validasi";
                                let errorContent = "Gagal membuat user baru";
                                
                                if (Array.isArray(e.responseJSON?.detail)) {
                                    const errors = e.responseJSON.detail.map(err => {
                                        const field = err.loc[err.loc.length - 1];
                                        const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
                                        return `<li><strong>${fieldName}:</strong> ${err.msg}</li>`;
                                    });
                                    errorContent = `<div class="validation-error-container">
                                        <p>Mohon perbaiki kesalahan berikut:</p>
                                        <ul class="validation-errors">${errors.join('')}</ul>
                                    </div>`;
                                } else if (typeof e.responseJSON?.detail === 'string') {
                                    errorContent = e.responseJSON.detail;
                                } else if (e.responseJSON?.detail?.msg) {
                                    errorContent = e.responseJSON.detail.msg;
                                }
                            } else if (e.status === 409) {
                                errorTitle = "Username Sudah Ada";
                                errorContent = "Username yang Anda masukkan sudah digunakan. Silakan gunakan username lain.";
                            }

                            showErrorNotification(errorContent, errorTitle);
                        }
                    }
                },
                update: {
                    url: function(data) {
                        return `${API_URL}/auth/users/${data.id}`;
                    },
                    type: "PUT",
                    dataType: "json",
                    contentType: "application/json",
                    beforeSend: function(xhr) {
                        const token = getToken();
                        if (token) {
                            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                        }
                    },
                    complete: function(e) {
                        try {
                            const response = JSON.parse(e.responseText);
                            if (response.message) {
                                showSuccessNotification(response.message, "Sukses");
                            }
                        } catch (error) {
                            let errorMsg = "Gagal mengupdate user";
                            if (e.status === 422) {
                                if (Array.isArray(e.responseJSON?.detail)) {
                                    const errors = e.responseJSON.detail.map(err => {
                                        const field = err.loc[err.loc.length - 1];
                                        const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
                                        return `${fieldName}: ${err.msg}`;
                                    });
                                    errorMsg = errors.join('\n');
                                } else if (typeof e.responseJSON?.detail === 'string') {
                                    errorMsg = e.responseJSON.detail;
                                }
                            }
                            showErrorNotification(errorMsg);
                        }
                    }
                },
                destroy: {
                    url: function(data) {
                        return `${API_URL}/auth/users/${data.id}`;
                    },
                    type: "DELETE",
                    beforeSend: function(xhr) {
                        const token = getToken();
                        if (token) {
                            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                        }
                    },
                    complete: function(e) {
                        try {
                            const response = JSON.parse(e.responseText);
                            if (response.message) {
                                showSuccessNotification(response.message, "Sukses");
                            }
                        } catch (error) {
                            const errorMsg = e.responseJSON?.detail || "Gagal menghapus user";
                            showErrorNotification(errorMsg);
                        }
                    }
                },
                parameterMap: function(data, type) {
                    if (type === "create" || type === "update") {
                        return JSON.stringify(data);
                    }
                    return data;
                }
            },
            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: { type: "number", editable: false },
                        username: { 
                            type: "string", 
                            validation: { 
                                required: true,
                                minLength: 3,
                                maxLength: 20,
                                pattern: "^[a-zA-Z0-9]+$",
                                patternMessage: "Username harus berupa huruf dan angka",
                                minLengthMessage: "Username minimal 3 karakter",
                                maxLengthMessage: "Username maksimal 20 karakter"
                            } 
                        },
                        password: { 
                            type: "string", 
                            validation: { 
                                required: true,
                                minLength: 6,
                                maxLength: 50,
                                minLengthMessage: "Password minimal 6 karakter",
                                maxLengthMessage: "Password maksimal 50 karakter"
                            } 
                        },
                        email: { type: "string", validation: { required: true, email: true } },
                        role: { type: "string", validation: { required: true } },
                        profile: { 
                            type: "object",
                            defaultValue: {
                                nip: "",
                                nama_lengkap: "",
                                jabatan: "",
                                no_hp: "",
                                alamat: ""
                            }
                        },
                        is_active: { type: "boolean", defaultValue: true }
                    }
                }
            },
            pageSize: 10
        });
        
        $("#users-grid").kendoGrid({
            dataSource: dataSource,
            toolbar: ["create"],
            pageable: true,
            sortable: true,
            filterable: true,
            editable: {
                mode: "popup",
                template: function() {
                    const templateHtml = $("#users-template").html();
                    if (!templateHtml) {
                        console.error("Template #users-template tidak ditemukan");
                        return "<div>Error: Template tidak ditemukan</div>";
                    }
                    return kendo.template(templateHtml);
                }()
            },
            columns: [
                { field: "username", title: "Username", width: 130 },
                { field: "email", title: "Email", width: 200 },
                { 
                    field: "role", 
                    title: "Role", 
                    width: 100,
                    template: function(dataItem) {
                        const roles = {
                            'admin': '<span class="badge badge-primary">Admin</span>',
                            'guru': '<span class="badge badge-success">Guru</span>',
                            'staf': '<span class="badge badge-info">Staf</span>'
                        };
                        return roles[dataItem.role] || dataItem.role;
                    }
                },
                { 
                    field: "profile.nama_lengkap", 
                    title: "Nama Lengkap", 
                    width: 180 
                },
                { 
                    field: "profile.jabatan", 
                    title: "Jabatan", 
                    width: 130 
                },
                { field: "is_active", title: "Status", width: 100, template: "#= is_active ? 'Aktif' : 'Nonaktif' #" },
                {
                    command: [
                        {
                            name: "edit",
                            text: { edit: "Edit", update: "Simpan", cancel: "Batal" }
                        },
                    ],
                    title: "Aksi",
                    width: 140
                },
                {
                    field: "id",
                    title: "Hapus",
                    width: 90,
                    template: function(dataItem) {
                        console.log("Template dataItem:", dataItem);
                        
                        // Safe extraction dengan null checks
                        const profile = dataItem.profile || {};
                        const safeData = {
                            id: dataItem.id || '',
                            username: dataItem.username || '',
                            email: dataItem.email || '',
                            role: dataItem.role || '',
                            nama_lengkap: profile.nama_lengkap || '',
                            nip: profile.nip || '',
                            jabatan: profile.jabatan || '',
                            is_active: dataItem.is_active !== undefined ? dataItem.is_active : true
                        };
                        
                        console.log("Safe data for template:", safeData);
                        
                        return `<button class="k-button k-button-solid k-button-solid-error k-button-sm btn-delete-user" 
                                       data-id="${safeData.id}"
                                       data-username="${safeData.username}"
                                       data-email="${safeData.email}"
                                       data-role="${safeData.role}"
                                       data-nama_lengkap="${safeData.nama_lengkap}"
                                       data-nip="${safeData.nip}"
                                       data-jabatan="${safeData.jabatan}"
                                       data-is_active="${safeData.is_active}">
                                    <i class="k-icon k-i-delete"></i> Hapus
                                </button>`;
                    }
                }
            ],
            error: function(e) {
                console.log(e);
                showErrorNotification(e.errors);
            },
            edit: function(e) {
                // Set default values for new records
                if (e.model.isNew()) {
                    e.model.set("role", "guru");
                    e.model.set("is_active", true);
                    e.model.set("profile", {
                        nip: "",
                        nama_lengkap: "",
                        jabatan: "",
                        no_hp: "",
                        alamat: ""
                    });
                }
                
                // Initialize form components
                setTimeout(function() {
                    // Initialize role dropdown
                    e.container.find("[name='role']").kendoDropDownList({
                        dataSource: [
                            { text: "Admin", value: "admin" },
                            { text: "Guru", value: "guru" },
                            { text: "Staf", value: "staf" }
                        ],
                        dataTextField: "text",
                        dataValueField: "value",
                        optionLabel: "-- Pilih Role --"
                    });
                    
                    // Handle password field for edit mode
                    if (!e.model.isNew()) {
                        const passwordField = e.container.find("[name='password']");
                        passwordField.attr("placeholder", "Kosongkan jika tidak ingin mengubah password");
                        passwordField.removeAttr("required");
                        
                        // Add info text for edit mode
                        passwordField.after('<small class="form-text text-muted">Kosongkan jika tidak ingin mengubah password</small>');
                    }
                    
                    // Set checkbox state
                    const isActiveCheckbox = e.container.find("[name='is_active']");
                    if (e.model.is_active) {
                        isActiveCheckbox.prop("checked", true);
                    }
                    
                    // Add custom validation styling
                    e.container.find("input[required], select[required]").on("blur", function() {
                        const $this = $(this);
                        if (!$this.val()) {
                            $this.addClass("k-invalid");
                        } else {
                            $this.removeClass("k-invalid");
                        }
                    });
                    
                }, 100);
            }
        });
    }
    
    // Helper function untuk menampilkan notifikasi error
    function showErrorNotification(message, title = "Error") {
        $("#toast-container").kendoNotification({
            position: {
                pinned: false,
                top: 30,
                right: 30
            },
            autoHideAfter: 5000,
            stacking: "up",
            templates: [{
                type: "error",
                template: `<div class='error-notification'>
                    <h4>${title}</h4>
                    <div class='error-content'>${message}</div>
                </div>`
            }]
        }).data("kendoNotification").error({message: ""});
    }

    // Helper function untuk menampilkan notifikasi sukses
    function showSuccessNotification(message, title = "Sukses") {
        $("#toast-container").kendoNotification({
            position: {
                pinned: false,
                top: 30,
                right: 30
            },
            autoHideAfter: 3000,
            stacking: "up",
            templates: [{
                type: "success",
                template: `<div class='success-notification'>
                    <h4>${title}</h4>
                    <div class='success-content'>${message}</div>
                </div>`
            }]
        }).data("kendoNotification").success({message: ""});
    }

    // Helper function untuk menampilkan notifikasi info
    function showInfoNotification(message, title = "Informasi") {
        $("#toast-container").kendoNotification({
            position: {
                pinned: false,
                top: 30,
                right: 30
            },
            autoHideAfter: 4000,
            stacking: "up",
            templates: [{
                type: "info",
                template: `<div class='info-notification'>
                    <h4>${title}</h4>
                    <div class='info-content'>${message}</div>
                </div>`
            }]
        }).data("kendoNotification").info({message: ""});
    }

    // Fungsi untuk menampilkan user profile
    function showUserProfile() {
        const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
        
        if (!userData.username) {
            logout();
            return;
        }
        
        const profileWindow = $("<div></div>").kendoWindow({
            title: "Profile User",
            width: "400px",
            modal: true,
            visible: false,
            actions: ["close"],
            content: `
                <div class="user-profile-popup">
                    <div class="profile-header text-center mb-3">
                        <i class="fas fa-user-circle fa-3x text-primary"></i>
                        <h5 class="mt-2">${userData.username}</h5>
                        <span class="badge badge-${getRoleBadgeClass(userData.role)}">${userData.role}</span>
                    </div>
                    <div class="profile-details">
                        <p><strong>Email:</strong> ${userData.email || '-'}</p>
                        <p><strong>Nama Lengkap:</strong> ${userData.profile?.nama_lengkap || '-'}</p>
                        <p><strong>NIP:</strong> ${userData.profile?.nip || '-'}</p>
                        <p><strong>Jabatan:</strong> ${userData.profile?.jabatan || '-'}</p>
                        <p><strong>No HP:</strong> ${userData.profile?.no_hp || '-'}</p>
                    </div>
                    <div class="profile-actions text-center mt-3">
                        <button class="btn btn-primary btn-sm" onclick="showProfilePage()">
                            <i class="fas fa-edit"></i> Edit Profile
                        </button>
                        <button class="btn btn-danger btn-sm ml-2" onclick="logout()">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                </div>
            `
        }).data("kendoWindow");
        
        profileWindow.center().open();
    }
    
    function getRoleBadgeClass(role) {
        switch(role) {
            case 'admin': return 'primary';
            case 'guru': return 'success';
            case 'staf': return 'info';
            default: return 'secondary';
        }
    }
    
    function showProfilePage() {
        // Check if user has permission to access profile page
        if (!hasPageAccess('profile')) {
            showErrorNotification("Anda tidak memiliki akses ke halaman ini", "Akses Ditolak");
            return;
        }
        
        // Close any open windows
        $(".k-window").each(function() {
            const window = $(this).data("kendoWindow");
            if (window) {
                window.close();
            }
        });
        
        // Navigate to profile page
        $(".sidebar-link").removeClass("active");
        $("[data-page='profile']").addClass("active");
        $(".page").hide();
        $("#profile-page").show();
        
        // Initialize profile page if not already done
        if (!$("#profile-form").data("kendoForm")) {
            initProfilePage();
        }
    }
    
    // Global logout function
    window.logout = function() {
        // Stop token countdown
        stopTokenCountdown();
        
        // Clear all localStorage data
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_data');
        
        // Show logout message
        showInfoNotification("Anda telah berhasil logout", "Logout");
        
        // Redirect to login page after short delay
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    };
    
        // Make functions globally accessible
    window.showUserProfile = showUserProfile;
    window.showProfilePage = showProfilePage;

    // ========== FUNGSI BAR CHART D3.JS ==========
    let currentBarChartData = null;
    let barChartInstance = null;
    
    function initializeBarChart() {
        // Load data untuk bar chart
        if (currentBarChartData) {
            generateBarChart();
        } else {
            // Load data from existing feature statistics
            loadBarChartData();
        }
    }
    
    function loadBarChartData() {
        // Gunakan data yang sudah ada dari feature statistics
        $.ajax({
            url: `${API_URL}/prediksi/feature-statistics`,
            method: "GET",
            beforeSend: function(xhr) {
                const token = getToken();
                if (token) {
                    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                }
            },
            success: function(data) {
                if (data.status === "success") {
                    currentBarChartData = data.data;
                    generateBarChart();
                } else {
                    showBarChartError("Data tidak tersedia untuk analisis bar chart");
                }
            },
            error: function(xhr) {
                console.error("Error loading bar chart data:", xhr.responseText);
                showBarChartError("Gagal memuat data untuk bar chart");
            }
        });
    }
    
    function generateBarChart() {
        if (!currentBarChartData) {
            showBarChartError("Data tidak tersedia");
            return;
        }
        
        const chartType = document.getElementById('chart-type-selector')?.value || 'penghasilan';
        const displayMode = document.getElementById('chart-display-mode')?.value || 'count';
        const colorScheme = document.getElementById('chart-color-scheme')?.value || 'blue';
        
        // Clear previous chart
        d3.select("#d3-barchart").selectAll("*").remove();
        
        // Get data based on chart type
        const chartData = getChartData(chartType);
        
        if (!chartData || chartData.length === 0) {
            showBarChartError("Data tidak tersedia untuk jenis chart yang dipilih");
            return;
        }
        
        // Set dimensions and margins
        const margin = { top: 40, right: 30, bottom: 80, left: 60 };
        const width = 600 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;
        
        // Create SVG
        const svg = d3.select("#d3-barchart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("class", "barchart-svg");
        
        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
        
        // Create scales
        const xScale = d3.scaleBand()
            .domain(chartData.map(d => d.label))
            .range([0, width])
            .padding(0.1);
        
        const maxValue = d3.max(chartData, d => displayMode === 'percentage' ? d.percentage : d.value);
        const yScale = d3.scaleLinear()
            .domain([0, maxValue * 1.1]) // Add 10% padding
            .range([height, 0]);
        
        // Create color scale
        const colorScale = getColorScale(colorScheme, chartData.length);
        
        // Create tooltip
        const tooltip = d3.select("body").append("div")
            .attr("class", "barchart-tooltip")
            .style("opacity", 0);
        
        // Create bars
        const bars = g.selectAll(".bar")
            .data(chartData)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.label))
            .attr("width", xScale.bandwidth())
            .attr("y", height) // Start from bottom for animation
            .attr("height", 0) // Start with height 0 for animation
            .attr("fill", (d, i) => colorScale(i))
            .on("mouseover", function(event, d) {
                // Highlight bar
                d3.select(this)
                    .attr("stroke", "#333")
                    .attr("stroke-width", 2)
                    .style("filter", "brightness(1.1)");
                
                // Show tooltip
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                
                const value = displayMode === 'percentage' ? d.percentage : d.value;
                const unit = displayMode === 'percentage' ? '%' : '';
                
                tooltip.html(`
                    <strong>${d.label}</strong><br/>
                    <strong>Jumlah:</strong> ${d.value}<br/>
                    <strong>Persentase:</strong> ${d.percentage.toFixed(1)}%<br/>
                    <strong>Total:</strong> ${d.total}
                `)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 10) + "px");
            })
            .on("mouseout", function(d) {
                // Remove highlight
                d3.select(this)
                    .attr("stroke", "none")
                    .style("filter", "brightness(1)");
                
                // Hide tooltip
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            .on("click", function(event, d) {
                // Toggle selection
                const isSelected = d3.select(this).classed("selected");
                
                // Remove selection from all bars
                g.selectAll(".bar").classed("selected", false);
                
                // Add selection to clicked bar if not already selected
                if (!isSelected) {
                    d3.select(this).classed("selected", true);
                }
            });
        
        // Animate bars
        bars.transition()
            .duration(800)
            .ease(d3.easeBackOut)
            .attr("y", d => yScale(displayMode === 'percentage' ? d.percentage : d.value))
            .attr("height", d => height - yScale(displayMode === 'percentage' ? d.percentage : d.value));
        
        // Add value labels on bars
        g.selectAll(".bar-label")
            .data(chartData)
            .enter()
            .append("text")
            .attr("class", "bar-label")
            .attr("x", d => xScale(d.label) + xScale.bandwidth() / 2)
            .attr("y", d => yScale(displayMode === 'percentage' ? d.percentage : d.value) - 5)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .style("font-weight", "bold")
            .style("fill", "#333")
            .text(d => {
                const value = displayMode === 'percentage' ? d.percentage : d.value;
                return displayMode === 'percentage' ? `${value.toFixed(1)}%` : value;
            })
            .style("opacity", 0)
            .transition()
            .delay(800)
            .duration(400)
            .style("opacity", 1);
        
        // Add X axis
        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-45)");
        
        // Add Y axis
        g.append("g")
            .call(d3.axisLeft(yScale));
        
        // Add Y axis label
        g.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .text(displayMode === 'percentage' ? 'Persentase (%)' : 'Jumlah');
        
        // Add chart title
        svg.append("text")
            .attr("x", (width + margin.left + margin.right) / 2)
            .attr("y", 25)
            .attr("text-anchor", "middle")
            .attr("class", "heatmap-title")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .style("fill", "#333")
            .text("Heatmap Korelasi Antar Fitur Numerik");
        
        // Store instance for updates
        barChartInstance = { svg, g, tooltip, chartData, xScale, yScale };
        
        // Cleanup tooltip on window resize or navigation
        window.addEventListener('beforeunload', () => {
            tooltip.remove();
        });
    }
    
    function getChartData(chartType) {
        if (!currentBarChartData || !currentBarChartData.categorical_distributions) {
            return [];
        }
        
        const categorical = currentBarChartData.categorical_distributions;
        let data = [];
        
        switch(chartType) {
            case 'penghasilan':
                if (categorical.kategori_penghasilan) {
                    const penghasilan = categorical.kategori_penghasilan;
                    Object.keys(penghasilan.data).forEach(key => {
                        data.push({
                            label: key,
                            value: penghasilan.data[key],
                            total: penghasilan.total,
                            percentage: (penghasilan.data[key] / penghasilan.total) * 100
                        });
                    });
                }
                break;
                
            case 'kehadiran':
                if (categorical.kategori_kehadiran) {
                    const kehadiran = categorical.kategori_kehadiran;
                    Object.keys(kehadiran.data).forEach(key => {
                        data.push({
                            label: key,
                            value: kehadiran.data[key],
                            total: kehadiran.total,
                            percentage: (kehadiran.data[key] / kehadiran.total) * 100
                        });
                    });
                }
                break;
                
            case 'nilai-raport':
                // Create ranges based on numerical statistics
                if (currentBarChartData.numerical_statistics && currentBarChartData.numerical_statistics.nilai_raport) {
                    const nilaiStats = currentBarChartData.numerical_statistics.nilai_raport;
                    
                    // Create value ranges
                    data = [
                        { label: 'Rendah (<70)', value: 0, total: 0, percentage: 0 },
                        { label: 'Sedang (70-80)', value: 0, total: 0, percentage: 0 },
                        { label: 'Tinggi (80-90)', value: 0, total: 0, percentage: 0 },
                        { label: 'S.Tinggi (>90)', value: 0, total: 0, percentage: 0 }
                    ];
                    
                    // Simulate distribution based on mean and std
                    const mean = nilaiStats.mean;
                    const count = nilaiStats.count;
                    
                    if (mean < 70) {
                        data[0].value = Math.round(count * 0.6);
                        data[1].value = Math.round(count * 0.3);
                        data[2].value = Math.round(count * 0.1);
                        data[3].value = count - data[0].value - data[1].value - data[2].value;
                    } else if (mean < 80) {
                        data[0].value = Math.round(count * 0.2);
                        data[1].value = Math.round(count * 0.5);
                        data[2].value = Math.round(count * 0.25);
                        data[3].value = count - data[0].value - data[1].value - data[2].value;
                    } else if (mean < 90) {
                        data[0].value = Math.round(count * 0.1);
                        data[1].value = Math.round(count * 0.2);
                        data[2].value = Math.round(count * 0.5);
                        data[3].value = count - data[0].value - data[1].value - data[2].value;
                    } else {
                        data[0].value = Math.round(count * 0.05);
                        data[1].value = Math.round(count * 0.15);
                        data[2].value = Math.round(count * 0.3);
                        data[3].value = count - data[0].value - data[1].value - data[2].value;
                    }
                    
                    data.forEach(item => {
                        item.total = count;
                        item.percentage = (item.value / count) * 100;
                    });
                }
                break;
        }
        
        return data;
    }
    
    function updateDashboardBarChart() {
        if (dashboardBarChartData) {
            generateDashboardBarChart();
        }
    }
    
    // Fungsi error handler untuk bar chart analisis
    function showBarChartError(message) {
        d3.select("#d3-barchart").html(`
            <div class="text-center p-3">
                <i class="fas fa-exclamation-triangle fa-lg text-warning mb-2"></i>
                <p class="text-muted small">${message}</p>
            </div>
        `);
    }
    
    // Fungsi untuk mendapatkan color scale berdasarkan scheme
    function getColorScale(colorScheme, dataLength) {
        const colorSchemes = {
            'blue': ['#1f77b4', '#aec7e8', '#3182bd', '#6baed6', '#9ecae1', '#c6dbef'],
            'green': ['#2ca02c', '#98df8a', '#31a354', '#74c476', '#a1d99b', '#c7e9c0'],
            'orange': ['#ff7f0e', '#ffbb78', '#fd8d3c', '#fdae6b', '#fdd0a2', '#fee6ce'],
            'purple': ['#9467bd', '#c5b0d5', '#8c6bb1', '#9ebcda', '#bfd3e6', '#e0ecf4']
        };
        
        const colors = colorSchemes[colorScheme] || colorSchemes.blue;
        return d3.scaleOrdinal().range(colors);
    }
    
    // Fungsi untuk mendapatkan judul chart berdasarkan tipe
    function getChartTitle(chartType) {
        const titles = {
            'penghasilan': 'Distribusi Penghasilan Orang Tua',
            'kehadiran': 'Distribusi Kehadiran Siswa', 
            'nilai-raport': 'Distribusi Nilai Raport'
        };
        
        return titles[chartType] || 'Analisis Bar Chart';
    }
    
    function showDashboardBarChartError(message) {
        d3.select("#dashboard-barchart").html(`
            <div class="text-center p-3">
                <i class="fas fa-exclamation-triangle fa-lg text-warning mb-2"></i>
                <p class="text-muted small">${message}</p>
            </div>
        `);
    }
    
    // ========== DASHBOARD BAR CHART FUNCTIONS ==========
    
    function initializeDashboardBarChart() {
        // Load data untuk dashboard bar chart
        if (dashboardBarChartData) {
            generateDashboardBarChart();
        } else {
            // Load data from existing feature statistics dengan delay
            setTimeout(() => {
                loadDashboardBarChartData();
            }, 2000); // Delay 2 detik setelah feature statistics dimuat
        }
    }
    
    function loadDashboardBarChartData() {
        // Gunakan data yang sudah ada dari feature statistics
        $.ajax({
            url: `${API_URL}/prediksi/feature-statistics`,
            method: "GET",
            beforeSend: function(xhr) {
                const token = getToken();
                if (token) {
                    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                }
            },
            success: function(data) {
                if (data.status === "success") {
                    dashboardBarChartData = data.data;
                    generateDashboardBarChart();
                } else {
                    showDashboardBarChartError("Data tidak tersedia untuk dashboard bar chart");
                }
            },
            error: function(xhr) {
                console.error("Error loading dashboard bar chart data:", xhr.responseText);
                showDashboardBarChartError("Gagal memuat data untuk dashboard bar chart");
            }
        });
    }
    
    function generateDashboardBarChart() {
        if (!dashboardBarChartData) {
            showDashboardBarChartError("Data tidak tersedia");
            return;
        }
        
        const chartType = document.getElementById('dashboard-chart-type')?.value || 'penghasilan';
        const displayMode = document.getElementById('dashboard-chart-mode')?.value || 'count';
        
        // Clear previous chart
        d3.select("#dashboard-barchart").selectAll("*").remove();
        
        // Get data based on chart type
        const chartData = getDashboardChartData(chartType);
        
        if (!chartData || chartData.length === 0) {
            showDashboardBarChartError("Data tidak tersedia untuk jenis chart yang dipilih");
            return;
        }
        
        // Set dimensions and margins for dashboard (smaller than full chart)
        const margin = { top: 30, right: 20, bottom: 60, left: 50 };
        const width = 400 - margin.left - margin.right;
        const height = 220 - margin.top - margin.bottom;
        
        // Create SVG
        const svg = d3.select("#dashboard-barchart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("class", "dashboard-barchart-svg");
        
        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
        
        // Create scales
        const xScale = d3.scaleBand()
            .domain(chartData.map(d => d.label))
            .range([0, width])
            .padding(0.1);
        
        const maxValue = d3.max(chartData, d => displayMode === 'percentage' ? d.percentage : d.value);
        const yScale = d3.scaleLinear()
            .domain([0, maxValue * 1.1]) // Add 10% padding
            .range([height, 0]);
        
        // Create color scale (green theme for dashboard)
        const colorScale = d3.scaleOrdinal()
            .range(['#28a745', '#20c997', '#17a2b8', '#6f42c1', '#e83e8c', '#fd7e14']);
        
        // Create tooltip
        const tooltip = d3.select("body").append("div")
            .attr("class", "dashboard-barchart-tooltip")
            .style("opacity", 0);
        
        // Create bars
        const bars = g.selectAll(".dashboard-bar")
            .data(chartData)
            .enter()
            .append("rect")
            .attr("class", "dashboard-bar")
            .attr("x", d => xScale(d.label))
            .attr("width", xScale.bandwidth())
            .attr("y", height) // Start from bottom for animation
            .attr("height", 0) // Start with height 0 for animation
            .attr("fill", (d, i) => colorScale(i))
            .on("mouseover", function(event, d) {
                // Highlight bar
                d3.select(this)
                    .attr("stroke", "#333")
                    .attr("stroke-width", 2)
                    .style("filter", "brightness(1.1)");
                
                // Show tooltip
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                
                const value = displayMode === 'percentage' ? d.percentage : d.value;
                
                tooltip.html(`
                    <strong>${d.label}</strong><br/>
                    <strong>Jumlah:</strong> ${d.value}<br/>
                    <strong>Persentase:</strong> ${d.percentage.toFixed(1)}%
                `)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 10) + "px");
            })
            .on("mouseout", function(event, d) {
                // Remove highlight
                d3.select(this)
                    .attr("stroke", "none")
                    .style("filter", "brightness(1)");
                
                // Hide tooltip
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
        
        // Animate bars
        bars.transition()
            .duration(800)
            .ease(d3.easeBackOut)
            .attr("y", d => yScale(displayMode === 'percentage' ? d.percentage : d.value))
            .attr("height", d => height - yScale(displayMode === 'percentage' ? d.percentage : d.value));
        
        // Add value labels on bars (smaller font for dashboard)
        g.selectAll(".dashboard-bar-label")
            .data(chartData)
            .enter()
            .append("text")
            .attr("class", "dashboard-bar-label")
            .attr("x", d => xScale(d.label) + xScale.bandwidth() / 2)
            .attr("y", d => yScale(displayMode === 'percentage' ? d.percentage : d.value) - 3)
            .attr("text-anchor", "middle")
            .style("font-size", "10px")
            .style("font-weight", "bold")
            .style("fill", "#333")
            .text(d => {
                const value = displayMode === 'percentage' ? d.percentage : d.value;
                return displayMode === 'percentage' ? `${value.toFixed(1)}%` : value;
            })
            .style("opacity", 0)
            .transition()
            .delay(800)
            .duration(400)
            .style("opacity", 1);
        
        // Add X axis
        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .style("text-anchor", "end")
            .style("font-size", "10px")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-45)");
        
        // Add Y axis
        g.append("g")
            .call(d3.axisLeft(yScale).ticks(5))
            .selectAll("text")
            .style("font-size", "10px");
        
        // Store instance for updates
        dashboardBarChartInstance = { svg, g, tooltip, chartData, xScale, yScale };
        
        // Cleanup tooltip on window resize or navigation
        window.addEventListener('beforeunload', () => {
            if (tooltip) tooltip.remove();
        });
    }
    
    function getDashboardChartData(chartType) {
        if (!dashboardBarChartData || !dashboardBarChartData.categorical_distributions) {
            return [];
        }
        
        const categorical = dashboardBarChartData.categorical_distributions;
        let data = [];
        
        switch(chartType) {
            case 'penghasilan':
                if (categorical.kategori_penghasilan) {
                    const penghasilan = categorical.kategori_penghasilan;
                    Object.keys(penghasilan.data).forEach(key => {
                        data.push({
                            label: key,
                            value: penghasilan.data[key],
                            total: penghasilan.total,
                            percentage: (penghasilan.data[key] / penghasilan.total) * 100
                        });
                    });
                }
                break;
                
            case 'kehadiran':
                if (categorical.kategori_kehadiran) {
                    const kehadiran = categorical.kategori_kehadiran;
                    Object.keys(kehadiran.data).forEach(key => {
                        data.push({
                            label: key,
                            value: kehadiran.data[key],
                            total: kehadiran.total,
                            percentage: (kehadiran.data[key] / kehadiran.total) * 100
                        });
                    });
                }
                break;
                
            case 'nilai-raport':
                // Create ranges based on numerical statistics
                if (dashboardBarChartData.numerical_statistics && dashboardBarChartData.numerical_statistics.nilai_raport) {
                    const nilaiStats = dashboardBarChartData.numerical_statistics.nilai_raport;
                    
                    // Create value ranges
                    data = [
                        { label: '<70', value: 0, total: 0, percentage: 0 },
                        { label: '70-80', value: 0, total: 0, percentage: 0 },
                        { label: '80-90', value: 0, total: 0, percentage: 0 },
                        { label: '>90', value: 0, total: 0, percentage: 0 }
                    ];
                    
                    // Simulate distribution based on mean and std
                    const mean = nilaiStats.mean;
                    const count = nilaiStats.count;
                    
                    if (mean < 70) {
                        data[0].value = Math.round(count * 0.6);
                        data[1].value = Math.round(count * 0.3);
                        data[2].value = Math.round(count * 0.1);
                        data[3].value = count - data[0].value - data[1].value - data[2].value;
                    } else if (mean < 80) {
                        data[0].value = Math.round(count * 0.2);
                        data[1].value = Math.round(count * 0.5);
                        data[2].value = Math.round(count * 0.25);
                        data[3].value = count - data[0].value - data[1].value - data[2].value;
                    } else if (mean < 90) {
                        data[0].value = Math.round(count * 0.1);
                        data[1].value = Math.round(count * 0.2);
                        data[2].value = Math.round(count * 0.5);
                        data[3].value = count - data[0].value - data[1].value - data[2].value;
                    } else {
                        data[0].value = Math.round(count * 0.05);
                        data[1].value = Math.round(count * 0.15);
                        data[2].value = Math.round(count * 0.3);
                        data[3].value = count - data[0].value - data[1].value - data[2].value;
                    }
                    
                    data.forEach(item => {
                        item.total = count;
                        item.percentage = (item.value / count) * 100;
                    });
                }
                break;
        }
        
        return data;
    }

    // Make dashboard bar chart functions globally accessible
    window.initializeDashboardBarChart = initializeDashboardBarChart;
    window.updateDashboardBarChart = updateDashboardBarChart;

    // ========== TOKEN EXPIRY CHECKER SYSTEM ==========
    
    // Fungsi untuk mengecek status token expiry
    function checkTokenExpiry() {
        const token = getToken();
        if (!token) {
            return {
                isValid: false,
                timeLeft: 0,
                status: 'no_token',
                message: 'Token tidak ditemukan'
            };
        }
        
        const expiryTime = getTokenExpiryTime();
        if (!expiryTime) {
            return {
                isValid: false,
                timeLeft: 0,
                status: 'invalid_token',
                message: 'Token tidak valid'
            };
        }
        
        const now = Date.now();
        const timeLeft = expiryTime - now;
        
        if (timeLeft <= 0) {
            return {
                isValid: false,
                timeLeft: 0,
                status: 'expired',
                message: 'Token telah expired'
            };
        }
        
        // Determine status based on time left
        let status = 'valid';
        let urgency = 'low';
        
        if (timeLeft <= 1 * 60 * 1000) { // 1 minute
            status = 'critical';
            urgency = 'critical';
        } else if (timeLeft <= 2 * 60 * 1000) { // 2 minutes
            status = 'very_urgent';
            urgency = 'high';
        } else if (timeLeft <= 5 * 60 * 1000) { // 5 minutes
            status = 'urgent';
            urgency = 'high';
        } else if (timeLeft <= 10 * 60 * 1000) { // 10 minutes
            status = 'warning';
            urgency = 'medium';
        } else if (timeLeft <= 15 * 60 * 1000) { // 15 minutes
            status = 'notice';
            urgency = 'low';
        }
        
        return {
            isValid: true,
            timeLeft: timeLeft,
            timeLeftFormatted: formatCountdownTime(timeLeft),
            status: status,
            urgency: urgency,
            minutesLeft: Math.floor(timeLeft / (60 * 1000)),
            secondsLeft: Math.floor((timeLeft % (60 * 1000)) / 1000),
            message: getExpiryMessage(status, Math.floor(timeLeft / (60 * 1000)))
        };
    }
    
    // Fungsi untuk mendapatkan pesan expiry berdasarkan status
    function getExpiryMessage(status, minutesLeft) {
        const messages = {
            'valid': 'Token masih valid',
            'notice': `Token akan expired dalam ${minutesLeft} menit`,
            'warning': `⚠️ Token akan expired dalam ${minutesLeft} menit`,
            'urgent': `🚨 Token akan expired dalam ${minutesLeft} menit!`,
            'very_urgent': `🔥 Token akan expired dalam ${minutesLeft} menit! Segera simpan pekerjaan Anda!`,
            'critical': `❌ Token akan expired dalam kurang dari 1 menit! Sistem akan logout otomatis!`,
            'expired': '❌ Token telah expired'
        };
        
        return messages[status] || 'Status token tidak diketahui';
    }
    
    // Fungsi untuk menampilkan notifikasi berdasarkan status token
    function showTokenExpiryNotification(tokenStatus) {
        const now = Date.now();
        const minutesLeft = tokenStatus.minutesLeft;
        
        // Prevent spam notifications (minimum 30 seconds between notifications)
        if (now - lastNotificationTime < 30000) {
            return;
        }
        
        let shouldShow = false;
        let notificationType = 'info';
        let title = 'Peringatan Token';
        
        // Check if we should show notification based on time thresholds
        if (minutesLeft <= 1 && !notificationShown['1min']) {
            shouldShow = true;
            notificationType = 'error';
            title = 'Token Akan Expired!';
            notificationShown['1min'] = true;
        } else if (minutesLeft <= 2 && !notificationShown['2min']) {
            shouldShow = true;
            notificationType = 'error';
            title = 'Token Akan Expired!';
            notificationShown['2min'] = true;
        } else if (minutesLeft <= 5 && !notificationShown['5min']) {
            shouldShow = true;
            notificationType = 'error';
            title = 'Peringatan Token';
            notificationShown['5min'] = true;
        } else if (minutesLeft <= 10 && !notificationShown['10min']) {
            shouldShow = true;
            notificationType = 'info';
            title = 'Pemberitahuan Token';
            notificationShown['10min'] = true;
        } else if (minutesLeft <= 15 && !notificationShown['15min']) {
            shouldShow = true;
            notificationType = 'info';
            title = 'Pemberitahuan Token';
            notificationShown['15min'] = true;
        }
        
        if (shouldShow) {
            const message = `${tokenStatus.message}<br/><small>Waktu tersisa: ${tokenStatus.timeLeftFormatted}</small>`;
            
            if (notificationType === 'error') {
                showErrorNotification(message, title);
            } else {
                showInfoNotification(message, title);
            }
            
            lastNotificationTime = now;
            
            // Log untuk debugging
            console.log(`Token Expiry Notification: ${title} - ${tokenStatus.message}`);
        }
    }
    
    // Fungsi untuk memulai token expiry checker
    function startTokenExpiryChecker() {
        // Clear existing checker
        if (tokenExpiryChecker) {
            clearInterval(tokenExpiryChecker);
        }
        
        // Reset notification flags
        notificationShown = {
            '15min': false,
            '10min': false,
            '5min': false,
            '2min': false,
            '1min': false
        };
        
        tokenExpiryChecker = setInterval(function() {
            const tokenStatus = checkTokenExpiry();
            
            if (!tokenStatus.isValid) {
                // Token is invalid or expired
                clearInterval(tokenExpiryChecker);
                
                if (tokenStatus.status === 'expired') {
                    showErrorNotification("Token telah expired. Anda akan dialihkan ke halaman login.", "Session Expired");
                    setTimeout(() => {
                        logout();
                    }, 3000);
                }
                return;
            }
            
            // Auto refresh token when it's about to expire (5 minutes left)
            if (tokenStatus.minutesLeft <= 5 && tokenStatus.minutesLeft > 2) {
                autoRefreshToken();
            }
            
            // Show notifications based on token status
            showTokenExpiryNotification(tokenStatus);
            
            // Update token status indicator if exists
            updateTokenStatusIndicator(tokenStatus);
            
        }, 5000); // Check every 5 seconds
    }
    
    // Fungsi untuk stop token expiry checker
    function stopTokenExpiryChecker() {
        if (tokenExpiryChecker) {
            clearInterval(tokenExpiryChecker);
            tokenExpiryChecker = null;
        }
    }
    
    // Fungsi untuk update token status indicator
    function updateTokenStatusIndicator(tokenStatus) {
        const $indicator = $("#token-status-indicator");
        if ($indicator.length === 0) return;
        
        // Remove all status classes
        $indicator.removeClass("token-valid token-notice token-warning token-urgent token-critical");
        
        // Add appropriate class based on status
        $indicator.addClass(`token-${tokenStatus.status}`);
        
        // Update tooltip or title
        $indicator.attr("title", tokenStatus.message);
    }
    
    // Fungsi untuk mendapatkan informasi lengkap token
    function getTokenInfo() {
        const tokenStatus = checkTokenExpiry();
        const token = getToken();
        
        let tokenInfo = {
            ...tokenStatus,
            hasToken: !!token
        };
        
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                tokenInfo.issuedAt = new Date(payload.iat * 1000);
                tokenInfo.expiresAt = new Date(payload.exp * 1000);
                tokenInfo.username = payload.sub || payload.username;
                tokenInfo.role = payload.role;
                
                // Ambil data profile dari localStorage
                const userData = localStorage.getItem('user_data');
                if (userData) {
                    try {
                        const userProfile = JSON.parse(userData);
                        tokenInfo.email = userProfile.email;
                        tokenInfo.profile = {
                            nama_lengkap: userProfile.profile?.nama_lengkap || '',
                            nip: userProfile.profile?.nip || '',
                            jabatan: userProfile.profile?.jabatan || '',
                            no_hp: userProfile.profile?.no_hp || '',
                            alamat: userProfile.profile?.alamat || ''
                        };
                    } catch (e) {
                        console.error('Error parsing user profile data:', e);
                    }
                }
            } catch (e) {
                console.error('Error parsing token:', e);
            }
        }
        
        return tokenInfo;
    }
    
    // Fungsi untuk menampilkan dialog informasi token
    function showTokenInfoDialog() {
        const tokenInfo = getTokenInfo();
        
        // Debug: Log token info untuk troubleshooting
        console.log('Token Info:', tokenInfo);
        
        let content = '';
        if (!tokenInfo.hasToken) {
            content = `
                <div class="token-info-dialog">
                    <div class="alert alert-danger">
                        <i class="fas fa-exclamation-triangle"></i>
                        <strong>Tidak ada token</strong><br/>
                        Anda belum login atau session telah berakhir.
                    </div>
                </div>
            `;
        } else {
            const statusClass = tokenInfo.urgency === 'critical' ? 'danger' : 
                              tokenInfo.urgency === 'high' ? 'warning' : 
                              tokenInfo.urgency === 'medium' ? 'info' : 'success';
            
            // Format role dengan badge styling
            const roleBadgeClass = tokenInfo.role === 'Admin' ? 'primary' : 
                                 tokenInfo.role === 'Guru' ? 'success' : 'info';
            
            content = `
                <div class="token-info-dialog">
                    <div class="alert alert-${statusClass}">
                        <h6><i class="fas fa-info-circle"></i> Status Token Session</h6>
                        <p><strong>Status:</strong> ${tokenInfo.message || 'N/A'}</p>
                        <p><strong>Waktu Tersisa:</strong> ${tokenInfo.timeLeftFormatted || 'N/A'}</p>
                    </div>
                    
                    <!-- Informasi Pengguna -->
                    <div class="user-profile-info mt-3">
                        <h6><i class="fas fa-user"></i> Informasi Pengguna</h6>
                        <div class="row">
                            <div class="col-md-12">
                                <table class="table table-sm table-borderless">
                                    <tr>
                                        <td width="35%"><strong>Username:</strong></td>
                                        <td>${tokenInfo.username || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Email:</strong></td>
                                        <td>${tokenInfo.email || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Role:</strong></td>
                                        <td><span class="badge badge-${roleBadgeClass}">${tokenInfo.role || '-'}</span></td>
                                    </tr>
                                    ${tokenInfo.profile?.nama_lengkap ? `
                                    <tr>
                                        <td><strong>Nama Lengkap:</strong></td>
                                        <td>${tokenInfo.profile.nama_lengkap}</td>
                                    </tr>
                                    ` : ''}
                                    ${tokenInfo.profile?.nip ? `
                                    <tr>
                                        <td><strong>NIP:</strong></td>
                                        <td>${tokenInfo.profile.nip}</td>
                                    </tr>
                                    ` : ''}
                                    ${tokenInfo.profile?.jabatan ? `
                                    <tr>
                                        <td><strong>Jabatan:</strong></td>
                                        <td>${tokenInfo.profile.jabatan}</td>
                                    </tr>
                                    ` : ''}
                                    ${tokenInfo.profile?.no_hp ? `
                                    <tr>
                                        <td><strong>No. HP:</strong></td>
                                        <td>${tokenInfo.profile.no_hp}</td>
                                    </tr>
                                    ` : ''}
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Detail Token -->
                    <div class="token-details mt-3">
                        <h6><i class="fas fa-key"></i> Detail Token</h6>
                        <table class="table table-sm table-borderless">
                            <tr>
                                <td width="35%"><strong>Dibuat:</strong></td>
                                <td>${tokenInfo.issuedAt ? tokenInfo.issuedAt.toLocaleString('id-ID') : '-'}</td>
                            </tr>
                            <tr>
                                <td><strong>Expired:</strong></td>
                                <td>${tokenInfo.expiresAt ? tokenInfo.expiresAt.toLocaleString('id-ID') : '-'}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <!-- Tombol Aksi -->
                    <div class="token-actions mt-3">
                        <button class="btn btn-primary btn-sm" onclick="refreshTokenCountdown(); closeTokenInfoDialog();">
                            <i class="fas fa-sync"></i> Refresh Display
                        </button>
                        <button class="btn btn-success btn-sm ml-2" onclick="manualRefreshToken().then(() => closeTokenInfoDialog());">
                            <i class="fas fa-sync-alt"></i> Refresh Token
                        </button>
                        <button class="btn btn-danger btn-sm ml-2" onclick="logout();">
                            <i class="fas fa-sign-out-alt"></i> Logout Sekarang
                        </button>
                    </div>
                </div>
            `;
        }
        
        // Debug: Log generated content
        console.log('Generated content:', content);
        
        // Remove existing dialog
        $(".token-info-window").remove();
        
        // Create new dialog with content
        const windowElement = $("<div></div>").appendTo("body");
        
        // Set content before creating the window
        windowElement.html(content);
        
        // Create Kendo Window
        const kendoWindow = windowElement.kendoWindow({
            title: "Informasi Token Session & Profile",
            width: "550px",
            height: "auto",
            modal: true,
            visible: false,
            actions: ["close"],
            resizable: false
        }).data("kendoWindow");
        
        // Add class for styling
        windowElement.addClass("token-info-window");
        
        // Center and open the window
        kendoWindow.center().open();
        
        // Debug: Log that window is opened
        console.log('Token info window opened');
    }
    
    // Fungsi untuk menutup dialog token info
    function closeTokenInfoDialog() {
        $(".token-info-window").each(function() {
            const window = $(this).data("kendoWindow");
            if (window) {
                window.close();
            }
        });
    }
    
    // Make token functions globally accessible
    window.checkTokenExpiry = checkTokenExpiry;
    window.getTokenInfo = getTokenInfo;
    window.showTokenInfoDialog = showTokenInfoDialog;
    window.closeTokenInfoDialog = closeTokenInfoDialog;
    window.startTokenExpiryChecker = startTokenExpiryChecker;
    window.stopTokenExpiryChecker = stopTokenExpiryChecker;
    window.refreshToken = refreshToken;
    window.manualRefreshToken = manualRefreshToken;

    // Fungsi untuk menampilkan konfirmasi penghapusan data penghasilan
    function showDeleteConfirmationPenghasilan(data) {
        // Hapus window yang mungkin masih ada
        $(".k-window").remove();
        
        // Buat window baru
        const windowElement = $("<div></div>").appendTo("body");
        const window = windowElement.kendoWindow({
            title: "Konfirmasi Hapus Data Penghasilan",
            width: "500px",
            modal: true,
            visible: false,
            actions: ["close"],
            content: {
                template: `
                    <div class="delete-confirmation">
                        <div class="icon-container">
                            <i class="fas fa-exclamation-triangle text-warning"></i>
                        </div>
                        <div class="message">
                            <h4>Konfirmasi Hapus Data Penghasilan</h4>
                            <p><strong>Nama Siswa:</strong> ${data.nama_siswa || '-'}</p>
                            <p><strong>Penghasilan Ayah:</strong> Rp ${(data.penghasilan_ayah || 0).toLocaleString('id-ID')}</p>
                            <p><strong>Penghasilan Ibu:</strong> Rp ${(data.penghasilan_ibu || 0).toLocaleString('id-ID')}</p>
                            <p><strong>Total Penghasilan:</strong> Rp ${(data.total_penghasilan || 0).toLocaleString('id-ID')}</p>
                            <p><strong>Kategori:</strong> ${data.kategori_penghasilan || '-'}</p>
                            <hr>
                            <p class="text-danger">Apakah Anda yakin ingin menghapus data penghasilan ini? Tindakan ini tidak dapat dibatalkan.</p>
                        </div>
                        <div class="button-container">
                            <button class="k-button k-button-solid-base" id="cancelDeletePenghasilan">
                                <i class="fas fa-times"></i> Batal
                            </button>
                            <button class="k-button k-button-solid-error" id="confirmDeletePenghasilan">
                                <i class="fas fa-trash"></i> Hapus Data Penghasilan
                            </button>
                        </div>
                    </div>
                `
            }
        }).data("kendoWindow");

        // Event handlers
        windowElement.on("click", "#cancelDeletePenghasilan", function() {
            window.close();
        });

        windowElement.on("click", "#confirmDeletePenghasilan", function() {
            window.close();
            
            // Lakukan AJAX call langsung ke backend untuk menghapus
            $.ajax({
                url: `${API_URL}/penghasilan/${data.id}`,
                type: "DELETE",
                beforeSend: function(xhr) {
                    const token = getToken();
                    if (token) {
                        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                    }
                },
                success: function() {
                    showSuccessNotification("Data penghasilan berhasil dihapus", "Sukses");
                    // Refresh grid setelah berhasil menghapus
                    const grid = $("#penghasilan-grid").data("kendoGrid");
                    if (grid) {
                        grid.dataSource.read();
                    }
                },
                error: function(xhr) {
                    const errorMsg = xhr.responseJSON?.detail || "Gagal menghapus data penghasilan";
                    showErrorNotification(errorMsg, "Error");
                }
            });
        });

        window.center().open();
    }

    // Fungsi untuk menampilkan konfirmasi penghapusan data presensi
    function showDeleteConfirmationPresensi(data) {
        // Hapus window yang mungkin masih ada
        $(".k-window").remove();
        
        // Buat window baru
        const windowElement = $("<div></div>").appendTo("body");
        const window = windowElement.kendoWindow({
            title: "Konfirmasi Hapus Data Presensi",
            width: "500px",
            modal: true,
            visible: false,
            actions: ["close"],
            content: {
                template: `
                    <div class="delete-confirmation">
                        <div class="icon-container">
                            <i class="fas fa-exclamation-triangle text-warning"></i>
                        </div>
                        <div class="message">
                            <h4>Konfirmasi Hapus Data Presensi</h4>
                            <p><strong>Nama Siswa:</strong> ${data.nama_siswa || '-'}</p>
                            <p><strong>Semester:</strong> ${data.semester || '-'}</p>
                            <p><strong>Tahun Ajaran:</strong> ${data.tahun_ajaran || '-'}</p>
                            <p><strong>Jumlah Hadir:</strong> ${data.jumlah_hadir || 0} hari</p>
                            <p><strong>Jumlah Sakit:</strong> ${data.jumlah_sakit || 0} hari</p>
                            <p><strong>Jumlah Izin:</strong> ${data.jumlah_izin || 0} hari</p>
                            <p><strong>Jumlah Alpa:</strong> ${data.jumlah_alpa || 0} hari</p>
                            <p><strong>Persentase Kehadiran:</strong> ${data.persentase_kehadiran || 0}%</p>
                            <p><strong>Kategori:</strong> ${data.kategori_kehadiran || '-'}</p>
                            <hr>
                            <p class="text-danger">Apakah Anda yakin ingin menghapus data presensi ini? Tindakan ini tidak dapat dibatalkan.</p>
                        </div>
                        <div class="button-container">
                            <button class="k-button k-button-solid-base" id="cancelDeletePresensi">
                                <i class="fas fa-times"></i> Batal
                            </button>
                            <button class="k-button k-button-solid-error" id="confirmDeletePresensi">
                                <i class="fas fa-trash"></i> Hapus Data Presensi
                            </button>
                        </div>
                    </div>
                `
            }
        }).data("kendoWindow");

        // Event handlers
        windowElement.on("click", "#cancelDeletePresensi", function() {
            window.close();
        });

        windowElement.on("click", "#confirmDeletePresensi", function() {
            window.close();
            
            // Lakukan AJAX call langsung ke backend untuk menghapus
            $.ajax({
                url: `${API_URL}/presensi/${data.id}`,
                type: "DELETE",
                beforeSend: function(xhr) {
                    const token = getToken();
                    if (token) {
                        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                    }
                },
                success: function() {
                    showSuccessNotification("Data presensi berhasil dihapus", "Sukses");
                    // Refresh grid setelah berhasil menghapus
                    const grid = $("#presensi-grid").data("kendoGrid");
                    if (grid) {
                        grid.dataSource.read();
                    }
                },
                error: function(xhr) {
                    const errorMsg = xhr.responseJSON?.detail || "Gagal menghapus data presensi";
                    showErrorNotification(errorMsg, "Error");
                }
            });
        });

        window.center().open();
    }

    // Fungsi untuk menampilkan konfirmasi penghapusan data users
    function showDeleteConfirmationUsers(data) {
        // Hapus window yang mungkin masih ada
        $(".k-window").remove();
        
        // Debug: Log data yang diterima
        console.log("showDeleteConfirmationUsers data:", data);
        
        // Safe data extraction dengan fallback values
        const safeData = {
            id: data.id || '',
            username: data.username || 'N/A',
            email: data.email || 'N/A',
            role: data.role || 'N/A',
            nama_lengkap: data.nama_lengkap || 'N/A',
            nip: data.nip || 'N/A',
            jabatan: data.jabatan || 'N/A',
            is_active: data.is_active !== undefined ? data.is_active : true
        };
        
        console.log("Safe data for modal:", safeData);
        
        // Buat window baru
        const windowElement = $("<div></div>").appendTo("body");
        const window = windowElement.kendoWindow({
            title: "Konfirmasi Hapus Data User",
            width: "500px",
            modal: true,
            visible: false,
            actions: ["close"],
            content: {
                template: `
                    <div class="delete-confirmation">
                        <div class="icon-container">
                            <i class="fas fa-exclamation-triangle text-warning"></i>
                        </div>
                        <div class="message">
                            <h4>Konfirmasi Hapus Data User</h4>
                            <p><strong>Username:</strong> ${safeData.username}</p>
                            <p><strong>Email:</strong> ${safeData.email}</p>
                            <p><strong>Role:</strong> ${safeData.role}</p>
                            <p><strong>Nama Lengkap:</strong> ${safeData.nama_lengkap}</p>
                            <p><strong>NIP:</strong> ${safeData.nip}</p>
                            <p><strong>Jabatan:</strong> ${safeData.jabatan}</p>
                            <p><strong>Status:</strong> ${safeData.is_active ? 'Aktif' : 'Nonaktif'}</p>
                            <hr>
                            <p class="text-danger">Apakah Anda yakin ingin menghapus data user ini? Tindakan ini tidak dapat dibatalkan.</p>
                        </div>
                        <div class="button-container">
                            <button class="k-button k-button-solid-base" id="cancelDeleteUsers">
                                <i class="fas fa-times"></i> Batal
                            </button>
                            <button class="k-button k-button-solid-error" id="confirmDeleteUsers">
                                <i class="fas fa-trash"></i> Hapus Data User
                            </button>
                        </div>
                    </div>
                `
            }
        }).data("kendoWindow");

        // Event handlers
        windowElement.on("click", "#cancelDeleteUsers", function() {
            window.close();
        });

        windowElement.on("click", "#confirmDeleteUsers", function() {
            window.close();
            
            // Validasi ID sebelum melakukan delete
            if (!safeData.id) {
                showErrorNotification("ID user tidak valid untuk dihapus", "Error");
                return;
            }
            
            // Lakukan AJAX call langsung ke backend untuk menghapus
            $.ajax({
                url: `${API_URL}/auth/users/${safeData.id}`,
                type: "DELETE",
                beforeSend: function(xhr) {
                    const token = getToken();
                    if (token) {
                        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                    }
                },
                success: function() {
                    showSuccessNotification("Data user berhasil dihapus", "Sukses");
                    // Refresh grid setelah berhasil menghapus
                    const grid = $("#users-grid").data("kendoGrid");
                    if (grid) {
                        grid.dataSource.read();
                    }
                },
                error: function(xhr) {
                    const errorMsg = xhr.responseJSON?.detail || "Gagal menghapus data user";
                    showErrorNotification(errorMsg, "Error");
                }
            });
        });

        window.center().open();
    }

    function showDeleteConfirmationNilai(data) {
        // Hapus window yang mungkin masih ada
        $(".k-window").remove();
        
        // Debug: Log data yang diterima
        console.log("showDeleteConfirmationNilai data:", data);
        
        // Safe data extraction dengan fallback values
        const safeData = {
            id: data.id || '',
            nama_siswa: data.nama_siswa || 'N/A',
            semester: data.semester || 'N/A',
            tahun_ajaran: data.tahun_ajaran || 'N/A',
            matematika: data.matematika !== undefined ? data.matematika : 'N/A',
            bahasa_indonesia: data.bahasa_indonesia !== undefined ? data.bahasa_indonesia : 'N/A',
            bahasa_inggris: data.bahasa_inggris !== undefined ? data.bahasa_inggris : 'N/A',
            ipa: data.ipa !== undefined ? data.ipa : 'N/A',
            rata_rata: data.rata_rata !== undefined ? data.rata_rata : 'N/A'
        };
        
        console.log("Safe data for modal Nilai:", safeData);
        
        // Buat window baru
        const windowElement = $("<div></div>").appendTo("body");
        const window = windowElement.kendoWindow({
            title: "Konfirmasi Hapus Data Nilai Raport",
            width: "500px",
            modal: true,
            visible: false,
            actions: ["close"],
            content: {
                template: `
                    <div class="delete-confirmation">
                        <div class="icon-container">
                            <i class="fas fa-exclamation-triangle text-warning"></i>
                        </div>
                        <div class="message">
                            <h4>Konfirmasi Hapus Data Nilai Raport</h4>
                            <p><strong>Nama Siswa:</strong> ${safeData.nama_siswa}</p>
                            <p><strong>Semester:</strong> ${safeData.semester}</p>
                            <p><strong>Tahun Ajaran:</strong> ${safeData.tahun_ajaran}</p>
                            <p><strong>Matematika:</strong> ${safeData.matematika}</p>
                            <p><strong>Bahasa Indonesia:</strong> ${safeData.bahasa_indonesia}</p>
                            <p><strong>Bahasa Inggris:</strong> ${safeData.bahasa_inggris}</p>
                            <p><strong>IPA:</strong> ${safeData.ipa}</p>
                            <p><strong>Rata-rata:</strong> ${safeData.rata_rata}</p>
                            <hr>
                            <p class="text-danger">Apakah Anda yakin ingin menghapus data nilai raport ini? Tindakan ini tidak dapat dibatalkan.</p>
                        </div>
                        <div class="button-container">
                            <button class="k-button k-button-solid-base" id="cancelDeleteNilai">
                                <i class="fas fa-times"></i> Batal
                            </button>
                            <button class="k-button k-button-solid-error" id="confirmDeleteNilai">
                                <i class="fas fa-trash"></i> Hapus Data Nilai
                            </button>
                        </div>
                    </div>
                `
            }
        }).data("kendoWindow");

        // Event handlers
        windowElement.on("click", "#cancelDeleteNilai", function() {
            window.close();
        });

        windowElement.on("click", "#confirmDeleteNilai", function() {
            window.close();
            
            // Validasi ID sebelum melakukan delete
            if (!safeData.id) {
                showErrorNotification("ID nilai tidak valid untuk dihapus", "Error");
                return;
            }
            
            // Lakukan AJAX call langsung ke backend untuk menghapus
            $.ajax({
                url: `${API_URL}/nilai/${safeData.id}`,
                type: "DELETE",
                beforeSend: function(xhr) {
                    const token = getToken();
                    if (token) {
                        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                    }
                },
                success: function() {
                    showSuccessNotification("Data nilai raport berhasil dihapus", "Sukses");
                    // Refresh grid setelah berhasil menghapus
                    const grid = $("#nilai-grid").data("kendoGrid");
                    if (grid) {
                        grid.dataSource.read();
                    }
                },
                error: function(xhr) {
                    const errorMsg = xhr.responseJSON?.detail || "Gagal menghapus data nilai raport";
                    showErrorNotification(errorMsg, "Error");
                }
            });
        });

        window.center().open();
    }

    // Fungsi untuk refresh token
    function refreshToken() {
        return new Promise((resolve, reject) => {
            const currentToken = getToken();
            if (!currentToken) {
                reject(new Error('No token available to refresh'));
                return;
            }
            
            $.ajax({
                url: `${API_URL}/auth/refresh`,
                method: "POST",
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('Authorization', `Bearer ${currentToken}`);
                },
                success: function(data) {
                    // Update token in localStorage
                    localStorage.setItem('access_token', data.access_token);
                    
                    // Reset notification flags untuk token baru
                    notificationShown = {
                        '15min': false,
                        '10min': false,
                        '5min': false,
                        '2min': false,
                        '1min': false
                    };
                    
                    // Reset last auto refresh time
                    lastAutoRefreshTime = Date.now();
                    
                    // Refresh countdown timer dengan token baru
                    refreshTokenCountdown();
                    
                    console.log('Token berhasil di-refresh');
                    showSuccessNotification('Token berhasil diperbaharui', 'Token Refresh');
                    
                    resolve(data);
                },
                error: function(xhr) {
                    console.error('Error refreshing token:', xhr);
                    
                    let errorMsg = "Gagal refresh token";
                    try {
                        const response = JSON.parse(xhr.responseText);
                        errorMsg = response.detail || errorMsg;
                    } catch (e) {}
                    
                    if (xhr.status === 401) {
                        // Token sudah tidak valid, logout
                        showErrorNotification("Session telah berakhir. Anda akan dialihkan ke halaman login.", "Session Expired");
                        setTimeout(() => {
                            logout();
                        }, 3000);
                    } else {
                        showErrorNotification(errorMsg, "Error Refresh Token");
                    }
                    
                    reject(new Error(errorMsg));
                }
            });
        });
    }
    
    // Fungsi untuk auto refresh token (dipanggil otomatis saat token mendekati expired)
    function autoRefreshToken() {
        const now = Date.now();
        
        // Prevent multiple auto-refresh in short time (minimum 60 seconds between auto-refresh)
        if (now - lastAutoRefreshTime < 60000) {
            return Promise.resolve();
        }
        
        console.log('Auto-refreshing token...');
        return refreshToken().catch(error => {
            console.error('Auto-refresh failed:', error);
            // Don't show error notification for auto-refresh failures
            // User will be notified through normal expiry notifications
        });
    }
    
    // Fungsi untuk manual refresh token (dipanggil dari UI)
    function manualRefreshToken() {
        const tokenStatus = checkTokenExpiry();
        
        if (!tokenStatus.isValid) {
            showErrorNotification("Token tidak valid atau sudah expired", "Error Refresh Token");
            return Promise.reject(new Error('Invalid token'));
        }
        
        // Show loading state
        const $refreshBtn = $("#btn-refresh-token");
        if ($refreshBtn.length > 0) {
            $refreshBtn.prop("disabled", true).html('<i class="fas fa-spinner fa-spin mr-2"></i> Refreshing...');
        }
        
        return refreshToken().finally(() => {
            // Reset button state
            if ($refreshBtn.length > 0) {
                $refreshBtn.prop("disabled", false).html('<i class="fas fa-sync-alt mr-2"></i> Refresh Token');
            }
        });
    }

    // Make functions globally accessible
    window.openImageModal = openImageModal;
    window.closeImageModal = closeImageModal;

    // Global function for updating bar chart when dropdown changes
    function updateBarChart() {
        if (typeof currentBarChartData !== 'undefined' && currentBarChartData) {
            generateBarChart();
        }
    }

    // Make bar chart function globally accessible
    window.updateBarChart = updateBarChart;

    // Global function for opening image modal
    function openImageModal(imageSrc) {
        // Remove any existing modal
        $(".image-modal").remove();
        
        // Create modal HTML
        const modalHtml = `
            <div class="image-modal" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.8);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
            ">
                <div style="
                    position: relative;
                    max-width: 90%;
                    max-height: 90%;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                    padding: 10px;
                ">
                    <button onclick="closeImageModal()" style="
                        position: absolute;
                        top: -10px;
                        right: -10px;
                        background: #dc3545;
                        color: white;
                        border: none;
                        border-radius: 50%;
                        width: 30px;
                        height: 30px;
                        cursor: pointer;
                        font-size: 16px;
                        z-index: 10000;
                    ">×</button>
                    <img src="${imageSrc}" alt="Pohon Keputusan C4.5" style="
                        max-width: 100%;
                        max-height: 100%;
                        display: block;
                        border-radius: 4px;
                    " />
                    <div style="
                        text-align: center;
                        margin-top: 10px;
                        font-size: 14px;
                        color: #666;
                    ">
                        <i class="fas fa-info-circle mr-1"></i>
                        Klik di luar gambar atau tombol × untuk menutup
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to body
        $("body").append(modalHtml);
        
        // Close modal when clicking outside the image
        $(".image-modal").on("click", function(e) {
            if (e.target === this) {
                closeImageModal();
            }
        });
        
        // Close modal on ESC key
        $(document).on("keydown.imageModal", function(e) {
            if (e.keyCode === 27) { // ESC key
                closeImageModal();
            }
        });
    }

    // Global function for closing image modal
    function closeImageModal() {
        $(".image-modal").remove();
        $(document).off("keydown.imageModal");
    }

    $(document).on("click", ".btn-delete-nilai", function(e) {
        e.preventDefault();
        
        const button = $(this);
        
        // Enhanced data extraction dengan null safety
        const dataItem = {
            id: button.data("id") || '',
            nama_siswa: button.data("nama_siswa") || '',
            semester: button.data("semester") || '',
            tahun_ajaran: button.data("tahun_ajaran") || '',
            matematika: button.data("matematika") || 0,
            bahasa_indonesia: button.data("bahasa_indonesia") || 0,
            bahasa_inggris: button.data("bahasa_inggris") || 0,
            ipa: button.data("ipa") || 0,
            rata_rata: button.data("rata_rata") || 0
        };
        
        console.log("Delete button clicked Nilai:", dataItem);
        console.log("Button data attributes Nilai:", {
            "all data": button.data()
        });
        
        // Validasi data sebelum menampilkan modal
        if (!dataItem.id) {
            console.error("Missing nilai ID for delete operation");
            showErrorNotification("Data nilai tidak valid untuk dihapus", "Error");
            return;
        }
        
        showDeleteConfirmationNilai(dataItem);
    });

    // User Guide Navigation Functions
    let userGuideInitialized = false; // Prevent multiple initialization
    
    function initUserGuide() {
        console.log("=== INITIALIZING USER GUIDE - ROBUST VERSION ===");
        
        // REMOVED: Don't prevent multiple initialization in normal flow
        // The flag will be managed by forceReinitUserGuide() only
        console.log("Current initialization status:", userGuideInitialized);
        
        // Check if User Guide page exists and is accessible
        if ($('#user-guide-page').length === 0) {
            console.error("User Guide page not found in DOM");
            return;
        }
        
        // Check if buttons exist
        if ($('.guide-nav-btn').length === 0) {
            console.error("No guide navigation buttons found");
            return;
        }
        
        console.log("Starting User Guide initialization...");
        
        // COMPLETE cleanup of all existing event handlers
        $(document).off('click', '.guide-nav-btn');
        $(document).off('click.userguide-global', '.guide-nav-btn');
        $('#user-guide-page').off();
        $('.guide-nav-btn').off();
        
        console.log("All existing event handlers cleaned up");
        
        // DIRECT BUTTON EVENT HANDLERS - More reliable approach
        $('.guide-nav-btn').each(function(index) {
            const $btn = $(this);
            const target = $btn.data('target');
            const buttonText = $btn.text().trim();
            
            console.log(`Setting up direct handler ${index + 1}: "${buttonText}" -> "${target}"`);
            
            // Remove any existing handlers
            $btn.off('click.userguide');
            
            // Add direct click handler
            $btn.on('click.userguide', function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                
                console.log("=== DIRECT BUTTON CLICK ===");
                console.log(`Button: "${buttonText}" -> Target: "${target}"`);
                
                // Validate target
                if (!target) {
                    console.error("No target specified");
                    showErrorNotification("Target section tidak ditemukan", "Error");
                    return false;
                }
                
                // Check if target section exists
                const $targetSection = $('#' + target);
                if ($targetSection.length === 0) {
                    console.error(`Target section not found: ${target}`);
                    showErrorNotification(`Section "${target}" tidak ditemukan`, "Error");
                    return false;
                }
                
                // Immediate visual feedback
                $btn.addClass('btn-loading');
                
                try {
                    console.log(`Navigating to: ${target}`);
                    
                    // Execute navigation immediately
                    const success = showGuideSection(target);
                    
                    if (success) {
                        updateButtonStates(target);
                        console.log(`✅ Navigation successful: ${target}`);
                        
                        // Success feedback
                        $btn.removeClass('btn-loading').addClass('btn-success-flash');
                        setTimeout(() => {
                            $btn.removeClass('btn-success-flash');
                        }, 300);
                        
                        showSuccessNotification(`Menampilkan: ${buttonText}`, "Navigation");
                    } else {
                        console.error(`❌ Navigation failed: ${target}`);
                        $btn.removeClass('btn-loading');
                        showErrorNotification(`Gagal menampilkan: ${buttonText}`, "Error");
                    }
                    
                } catch (error) {
                    console.error("Navigation error:", error);
                    $btn.removeClass('btn-loading');
                    showErrorNotification("Terjadi kesalahan navigasi", "Error");
                }
                
                return false;
            });
        });
        
        // BACKUP: Container-level handler
        $('#user-guide-page').off('click.userguide-backup').on('click.userguide-backup', '.guide-nav-btn', function(e) {
            console.log("=== BACKUP CONTAINER HANDLER TRIGGERED ===");
            
            // Only trigger if direct handler somehow failed
            if (!e.isDefaultPrevented()) {
                console.log("Direct handler failed, executing backup...");
                
                const $btn = $(this);
                const target = $btn.data('target');
                const buttonText = $btn.text().trim();
                
                e.preventDefault();
                e.stopPropagation();
                
                if (target) {
                    console.log(`Backup navigation: ${buttonText} -> ${target}`);
                    const success = showGuideSection(target);
                    if (success) {
                        updateButtonStates(target);
                        showSuccessNotification(`Menampilkan: ${buttonText}`, "Navigation");
                    }
                }
            }
        });
        
        // Validate buttons and sections
        console.log("=== BUTTON & SECTION VALIDATION ===");
        const availableSections = $('.guide-section').map(function() { return this.id; }).get();
        const availableButtons = $('.guide-nav-btn').length;
        
        console.log(`Found ${availableButtons} buttons and ${availableSections.length} sections`);
        console.log("Available sections:", availableSections);
        
        // Validate each button
        let validButtons = 0;
        $('.guide-nav-btn').each(function(index) {
            const $btn = $(this);
            const target = $btn.data('target');
            const buttonText = $btn.text().trim();
            const targetExists = target && $('#' + target).length > 0;
            
            console.log(`Button ${index + 1}: "${buttonText}" -> "${target}" (exists: ${targetExists})`);
            
            if (target && targetExists) {
                validButtons++;
                $btn.addClass('nav-btn-valid');
            } else {
                $btn.addClass('nav-btn-invalid');
                console.warn(`Invalid button: ${buttonText}`);
            }
        });
        
        console.log(`Valid buttons: ${validButtons}/${availableButtons}`);
        
        // Initialize default section immediately
        console.log("=== INITIALIZING DEFAULT SECTION ===");
        try {
            const defaultSuccess = showGuideSection('getting-started');
            if (defaultSuccess) {
                updateButtonStates('getting-started');
                console.log("✅ Default section initialized");
            } else {
                console.error("❌ Failed to initialize default section");
                // Try first available section
                if (availableSections.length > 0) {
                    const firstSection = availableSections[0];
                    showGuideSection(firstSection);
                    updateButtonStates(firstSection);
                    console.log(`Fallback: Showing ${firstSection}`);
                }
            }
        } catch (error) {
            console.error("Default section initialization error:", error);
        }
        
        // Mark as initialized
        userGuideInitialized = true;
        console.log("=== USER GUIDE INITIALIZATION COMPLETED ===");
        
        // Auto-test after initialization
        setTimeout(() => {
            if (typeof window.testUserGuideButtons === 'function') {
                window.testUserGuideButtons();
            }
        }, 100);
    }
    
    // Force reinitialize User Guide (untuk debugging)
    window.forceReinitUserGuide = function() {
        console.log("=== FORCE REINITIALIZING USER GUIDE ===");
        
        // Reset initialization flag
        userGuideInitialized = false;
        
        // Complete cleanup
        $('.guide-nav-btn').off('click.userguide');
        $('#user-guide-page').off('click.userguide-backup');
        $(document).off('click', '.guide-nav-btn');
        
        // Reset all sections and buttons
        $('.guide-section').removeAttr('style').removeClass('active');
        $('.guide-nav-btn').removeClass('nav-btn-valid nav-btn-invalid btn-loading btn-success-flash');
        
        // Wait for page to be visible before reinitializing
        function waitAndInit() {
            if ($("#user-guide-page").is(':visible') && $('.guide-nav-btn').length > 0) {
                console.log("Page ready, initializing...");
                initUserGuide();
                console.log("Force reinitialization completed");
            } else {
                console.log("Page not ready, waiting...");
                setTimeout(waitAndInit, 50);
            }
        }
        
        setTimeout(waitAndInit, 100);
    };
    
    // Manual navigation function (untuk debugging)
    window.manualNavigateGuide = function(target) {
        console.log(`=== MANUAL NAVIGATION TO: ${target} ===`);
        
        const success = showGuideSection(target);
        if (success) {
            updateButtonStates(target);
            console.log(`Manual navigation successful: ${target}`);
        } else {
            console.error(`Manual navigation failed: ${target}`);
        }
        
        return success;
    };
    
    // Simple test function to verify buttons work
    window.testUserGuideButtons = function() {
        console.log("=== TESTING USER GUIDE BUTTONS ===");
        
        $('.guide-nav-btn').each(function(index) {
            const $btn = $(this);
            const target = $btn.data('target');
            const text = $btn.text().trim();
            const hasHandler = $._data(this, 'events') && $._data(this, 'events').click;
            
            console.log(`Button ${index + 1}: "${text}"`);
            console.log(`  - Target: ${target}`);
            console.log(`  - Has click handler: ${!!hasHandler}`);
            console.log(`  - Element classes: ${$btn.attr('class')}`);
            
            // Test if section exists
            const $section = $('#' + target);
            console.log(`  - Section exists: ${$section.length > 0}`);
            console.log(`  - Section visible: ${$section.is(':visible')}`);
        });
        
        console.log("=== TESTING COMPLETE ===");
    };
    
    // Quick button click test
    window.clickButton = function(target) {
        console.log(`=== CLICKING BUTTON: ${target} ===`);
        const $btn = $(`.guide-nav-btn[data-target="${target}"]`);
        
        if ($btn.length === 0) {
            console.error(`Button not found for target: ${target}`);
            return;
        }
        
        console.log("Button found, triggering click...");
        $btn.trigger('click');
        
        setTimeout(() => {
            const $section = $('#' + target);
            console.log(`Section visible after click: ${$section.is(':visible')}`);
        }, 200);
    };
    
    function updateButtonStates(activeTarget) {
        console.log("Updating button states for target:", activeTarget);
        
        $('.guide-nav-btn').each(function() {
            const $btn = $(this);
            const btnTarget = $btn.data('target');
            
            // Remove all button classes first
            $btn.removeClass('btn-primary btn-outline-primary btn-outline-success btn-outline-info btn-outline-warning');
            
            if (btnTarget === activeTarget) {
                // Make clicked button primary
                $btn.addClass('btn-primary');
                console.log("Set button primary for target:", btnTarget);
            } else {
                // Restore original outline style based on target
                switch(btnTarget) {
                    case 'getting-started':
                        $btn.addClass('btn-outline-primary');
                        break;
                    case 'data-management':
                        $btn.addClass('btn-outline-success');
                        break;
                    case 'prediction':
                        $btn.addClass('btn-outline-info');
                        break;
                    case 'troubleshooting':
                        $btn.addClass('btn-outline-warning');
                        break;
                    default:
                        $btn.addClass('btn-outline-primary');
                }
                console.log("Reset button outline for target:", btnTarget);
            }
        });
    }

    function showGuideSection(sectionId) {
        console.log("=== FIXED SECTION DISPLAY ===");
        console.log(`Target section ID: "${sectionId}"`);
        
        try {
            // 1. Validate section ID
            if (!sectionId || typeof sectionId !== 'string') {
                console.error("Invalid section ID:", sectionId);
                return false;
            }
            
            // 2. Find target section
            const $targetSection = $('#' + sectionId);
            if ($targetSection.length === 0) {
                console.error(`Target section not found: "${sectionId}"`);
                console.log("Available sections:", $('.guide-section').map(function() { return this.id; }).get());
                return false;
            }
            
            console.log(`✓ Target section found: "${sectionId}"`);
            
            // 3. FIXED: Hide all sections with immediate CSS override
            $('.guide-section').each(function() {
                const $section = $(this);
                const currentId = $section.attr('id');
                
                // Remove active class
                $section.removeClass('active');
                
                // IMMEDIATE hide with direct style attribute
                $section.attr('style', 'display: none !important; visibility: hidden !important; opacity: 0 !important;');
                
                console.log(`Hidden section: "${currentId}"`);
            });
            
            // 4. FIXED: Show target section with immediate CSS override
            console.log(`Showing target section: "${sectionId}"`);
            
            // Apply active class
            $targetSection.addClass('active');
            
            // IMMEDIATE show with direct style attribute
            $targetSection.attr('style', 
                'display: block !important; ' +
                'visibility: visible !important; ' +
                'opacity: 1 !important; ' +
                'position: relative !important; ' +
                'z-index: 1 !important;'
            );
            
            // 5. ENHANCED verification with multiple checks
            let isVisible = $targetSection.is(':visible');
            const hasActive = $targetSection.hasClass('active');
            const computedDisplay = $targetSection.css('display');
            const computedVisibility = $targetSection.css('visibility');
            const computedOpacity = $targetSection.css('opacity');
            
            console.log("=== ENHANCED VISIBILITY CHECK ===");
            console.log("Is visible (jQuery):", isVisible);
            console.log("Has active class:", hasActive);
            console.log("Computed display:", computedDisplay);
            console.log("Computed visibility:", computedVisibility);
            console.log("Computed opacity:", computedOpacity);
            console.log("Style attribute:", $targetSection.attr('style'));
            
            // Force visibility check after CSS processing
            setTimeout(() => {
                isVisible = $targetSection.is(':visible');
                console.log("=== POST-CSS VISIBILITY CHECK ===");
                console.log("Is visible after CSS:", isVisible);
                
                if (!isVisible) {
                    console.error("CRITICAL: Section still not visible after CSS processing");
                    
                    // ULTIMATE FIX: Force visibility with maximum specificity
                    $targetSection.removeClass('active').addClass('active');
                    $targetSection.css({
                        'display': 'block',
                        'visibility': 'visible',
                        'opacity': '1',
                        'position': 'relative',
                        'z-index': '999'
                    });
                    
                    // Force DOM reflow
                    $targetSection[0].offsetHeight;
                    
                    // Final check
                    const finalVisible = $targetSection.is(':visible');
                    console.log("Final visibility after ultimate fix:", finalVisible);
                    
                    if (finalVisible) {
                        console.log("✅ SUCCESS: Ultimate fix worked");
                    } else {
                        console.error("❌ FAILED: Even ultimate fix didn't work");
                        // Show error to user
                        showErrorNotification(`Gagal menampilkan section: ${sectionId}`, "Display Error");
                    }
                } else {
                    console.log("✅ SUCCESS: Section visible after CSS processing");
                }
            }, 50); // Small delay for CSS processing
            
            // 6. Scroll to section (reduced delay)
            if (sectionId !== 'getting-started') {
                setTimeout(() => {
                    if ($targetSection[0] && $targetSection[0].scrollIntoView) {
                        $targetSection[0].scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'start' 
                        });
                        console.log("Scrolled to section:", sectionId);
                    }
                }, 200);
            }
            
            console.log("=== FIXED SECTION DISPLAY COMPLETED ===");
            return isVisible;
            
        } catch (error) {
            console.error("Error in showGuideSection:", error);
            showErrorNotification(`Gagal menampilkan section: ${sectionId}`, "Display Error");
            return false;
        }
    }

    // Make User Guide functions globally accessible
    window.initUserGuide = initUserGuide;
    window.showGuideSection = showGuideSection;
    
    // Enhanced debug function for testing guide navigation
    window.testGuideNavigation = function() {
        console.log("=== COMPREHENSIVE GUIDE NAVIGATION TEST ===");
        console.log("User Guide page visible:", $('#user-guide-page').is(':visible'));
        console.log("Guide nav buttons found:", $('.guide-nav-btn').length);
        console.log("Guide sections found:", $('.guide-section').length);
        
        // Test button data attributes and click handlers
        $('.guide-nav-btn').each(function(index) {
            const $btn = $(this);
            const target = $btn.data('target');
            const section = $('#' + target);
            const hasClickHandler = $._data(this, 'events') && $._data(this, 'events').click;
            
            console.log(`Button ${index + 1}:`);
            console.log(`  - Target: "${target}"`);
            console.log(`  - Section exists: ${section.length > 0}`);
            console.log(`  - Section visible: ${section.is(':visible')}`);
            console.log(`  - Section active: ${section.hasClass('active')}`);
            console.log(`  - Button classes: ${$btn.attr('class')}`);
            console.log(`  - Has click handler: ${!!hasClickHandler}`);
            console.log(`  - Button text: "${$btn.text().trim()}"`);
        });
        
        // Test section states with enhanced CSS debugging
        console.log("\n--- ENHANCED SECTION STATES ---");
        $('.guide-section').each(function(index) {
            const $section = $(this);
            const id = $section.attr('id');
            const isVisible = $section.is(':visible');
            const hasActive = $section.hasClass('active');
            const display = $section.css('display');
            const visibility = $section.css('visibility');
            const opacity = $section.css('opacity');
            const position = $section.css('position');
            const zIndex = $section.css('z-index');
            const styleAttr = $section.attr('style');
            
            console.log(`Section ${index + 1} (${id}):`);
            console.log(`  - Visible (jQuery): ${isVisible}`);
            console.log(`  - Active class: ${hasActive}`);
            console.log(`  - CSS Display: ${display}`);
            console.log(`  - CSS Visibility: ${visibility}`);
            console.log(`  - CSS Opacity: ${opacity}`);
            console.log(`  - CSS Position: ${position}`);
            console.log(`  - CSS Z-Index: ${zIndex}`);
            console.log(`  - Style attribute: ${styleAttr || 'none'}`);
            
            // Check computed styles
            const computedStyle = window.getComputedStyle($section[0]);
            console.log(`  - Computed Display: ${computedStyle.display}`);
            console.log(`  - Computed Visibility: ${computedStyle.visibility}`);
            console.log(`  - Computed Opacity: ${computedStyle.opacity}`);
        });
        
        // Test CSS conflicts
        console.log("\n--- CSS CONFLICT ANALYSIS ---");
        $('.guide-section').each(function(index) {
            const $section = $(this);
            const id = $section.attr('id');
            
            // Get all CSS rules that might affect this section
            const allRules = [];
            for (let sheet of document.styleSheets) {
                try {
                    for (let rule of sheet.cssRules || sheet.rules) {
                        if (rule.selectorText && rule.selectorText.includes('.guide-section')) {
                            allRules.push({
                                selector: rule.selectorText,
                                display: rule.style.display,
                                visibility: rule.style.visibility,
                                opacity: rule.style.opacity
                            });
                        }
                    }
                } catch (e) {
                    // Cross-origin stylesheet, skip
                }
            }
            
            console.log(`CSS Rules affecting ${id}:`, allRules);
        });
        
        // Test event delegation
        console.log("\n--- EVENT DELEGATION TEST ---");
        const userGuidePageEvents = $._data($('#user-guide-page')[0], 'events');
        const documentEvents = $._data(document, 'events');
        
        console.log("User Guide page events:", userGuidePageEvents ? Object.keys(userGuidePageEvents) : 'none');
        console.log("Document events (click):", documentEvents && documentEvents.click ? documentEvents.click.length : 'none');
        
        console.log("=== END COMPREHENSIVE TEST ===");
    };
    
    // Manual button test function
    window.testButtonClick = function(target) {
        console.log(`=== MANUAL BUTTON TEST: ${target} ===`);
        const $button = $(`.guide-nav-btn[data-target="${target}"]`);
        
        if ($button.length === 0) {
            console.error(`Button with target "${target}" not found`);
            return;
        }
        
        console.log("Button found:", $button[0]);
        console.log("Triggering click...");
        
        // Simulate click
        $button.trigger('click');
        
        setTimeout(() => {
            const $section = $('#' + target);
            console.log("After click - Section visible:", $section.is(':visible'));
            console.log("After click - Section active:", $section.hasClass('active'));
            console.log("After click - Section display:", $section.css('display'));
            console.log("=== END MANUAL TEST ===");
        }, 500);
    };
    
    // Test all navigation buttons sequentially
    window.testAllNavigation = function() {
        console.log("=== TESTING ALL NAVIGATION BUTTONS ===");
        const targets = ['getting-started', 'data-management', 'prediction', 'troubleshooting'];
        let currentIndex = 0;
        
        function testNext() {
            if (currentIndex >= targets.length) {
                console.log("=== ALL NAVIGATION TESTS COMPLETED ===");
                return;
            }
            
            const target = targets[currentIndex];
            console.log(`\n--- Testing button ${currentIndex + 1}: ${target} ---`);
            
            window.testButtonClick(target);
            currentIndex++;
            
            // Test next button after delay
            setTimeout(testNext, 1500);
        }
        
        testNext();
    };
    
    // CRITICAL: Force fix visibility issues
    window.forceFixVisibility = function(sectionId) {
        console.log(`=== FORCE FIX VISIBILITY: ${sectionId} ===`);
        
        const $section = $('#' + sectionId);
        if ($section.length === 0) {
            console.error(`Section ${sectionId} not found`);
            return false;
        }
        
        // Step 1: Remove all conflicting styles
        $('.guide-section').each(function() {
            $(this).removeAttr('style').removeClass('active');
        });
        
        // Step 2: Force show target section with maximum specificity
        $section.addClass('active');
        $section.css({
            'display': 'block !important',
            'visibility': 'visible !important', 
            'opacity': '1 !important',
            'position': 'relative !important',
            'z-index': '9999 !important',
            'width': '100% !important',
            'height': 'auto !important'
        });
        
        // Step 3: Force DOM reflow
        $section[0].offsetHeight;
        
        // Step 4: Verify fix
        const isVisible = $section.is(':visible');
        console.log(`Force fix result: ${isVisible}`);
        
        if (!isVisible) {
            // Last resort: Direct DOM manipulation
            $section[0].style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important; position: relative !important; z-index: 9999 !important;';
            $section[0].offsetHeight; // Force reflow
            
            const finalVisible = $section.is(':visible');
            console.log(`Last resort fix result: ${finalVisible}`);
            return finalVisible;
        }
        
        return true;
    };
    
    // Debug CSS conflicts specifically
    window.debugCSSConflicts = function() {
        console.log("=== CSS CONFLICTS DEBUG ===");
        
        $('.guide-section').each(function() {
            const $section = $(this);
            const id = $section.attr('id');
            const element = $section[0];
            
            console.log(`\n--- Section: ${id} ---`);
            
            // Get computed styles
            const computed = window.getComputedStyle(element);
            console.log("Computed styles:");
            console.log(`  display: ${computed.display}`);
            console.log(`  visibility: ${computed.visibility}`);
            console.log(`  opacity: ${computed.opacity}`);
            console.log(`  position: ${computed.position}`);
            console.log(`  z-index: ${computed.zIndex}`);
            
            // Get inline styles
            console.log("Inline styles:");
            console.log(`  style attribute: ${element.style.cssText || 'none'}`);
            
            // Check jQuery visibility
            console.log(`jQuery .is(':visible'): ${$section.is(':visible')}`);
            console.log(`jQuery .css('display'): ${$section.css('display')}`);
            
            // Check classes
            console.log(`Classes: ${element.className}`);
            
            // Check if hidden by parent
            let parent = element.parentElement;
            while (parent && parent !== document.body) {
                const parentComputed = window.getComputedStyle(parent);
                if (parentComputed.display === 'none' || parentComputed.visibility === 'hidden') {
                    console.log(`Hidden by parent: ${parent.tagName}.${parent.className}`);
                    break;
                }
                parent = parent.parentElement;
            }
        });
        
        console.log("=== END CSS CONFLICTS DEBUG ===");
    };
    
    // Check for event handler conflicts
    window.checkEventConflicts = function() {
        console.log("=== CHECKING EVENT HANDLER CONFLICTS ===");
        
        // Check sidebar links
        console.log("SIDEBAR LINKS:");
        $('.sidebar-link').each(function(index) {
            const $link = $(this);
            const page = $link.data('page');
            const events = $._data(this, 'events');
            
            console.log(`  Sidebar ${index + 1} (${page}):`);
            console.log("    - Classes:", this.className);
            console.log("    - Data-page:", $link.data('page'));
            console.log("    - Data-target:", $link.data('target'));
            console.log("    - Events:", events ? Object.keys(events) : 'none');
        });
        
        console.log("\nUSER GUIDE BUTTONS:");
        $('.guide-nav-btn').each(function(index) {
            const $btn = $(this);
            const target = $btn.data('target');
            const page = $btn.data('page');
            const events = $._data(this, 'events');
            
            console.log(`  Guide ${index + 1} (${target}):`);
            console.log("    - Classes:", this.className);
            console.log("    - Data-target:", target);
            console.log("    - Data-page:", page);
            console.log("    - Events:", events ? Object.keys(events) : 'none');
            
            if (events && events.click) {
                console.log(`    - Click handlers: ${events.click.length}`);
                events.click.forEach((handler, i) => {
                    console.log(`      ${i + 1}. Namespace: ${handler.namespace || 'none'}`);
                });
            }
        });
        
        // Check for potential conflicts
        console.log("\nCONFLICT ANALYSIS:");
        let conflicts = 0;
        $('.guide-nav-btn').each(function() {
            const $btn = $(this);
            if ($btn.hasClass('sidebar-link') || $btn.data('page')) {
                console.log("⚠️  POTENTIAL CONFLICT:", this.className);
                conflicts++;
            }
        });
        
        if (conflicts === 0) {
            console.log("✅ NO CONFLICTS DETECTED - All systems isolated");
        } else {
            console.log(`❌ ${conflicts} CONFLICTS DETECTED`);
        }
        
        console.log("=== END CONFLICT CHECK ===");
    };
    
    // Force show section function for debugging
    window.forceShowSection = function(sectionId) {
        console.log("Force showing section:", sectionId);
        const $section = $('#' + sectionId);
        if ($section.length > 0) {
            $('.guide-section').hide().removeClass('active');
            $section.addClass('active').show().css('display', 'block !important');
            console.log("Force show completed for:", sectionId);
        } else {
            console.error("Section not found:", sectionId);
        }
    };

    // ========== SYSTEM INFORMATION FUNCTIONS ==========
    
    // Initialize system information
    function initializeSystemInfo() {
        console.log("Initializing system information...");
        
        // Update system status
        updateSystemStatus();
        
        // Update concurrent users count
        updateConcurrentUsers();
        
        // Set up real-time updates
        setInterval(function() {
            updateSystemStatus();
            updateConcurrentUsers();
        }, 30000); // Update every 30 seconds
        
        console.log("System information initialized successfully");
    }
    
    // Update system status indicator
    function updateSystemStatus() {
        const statusElement = $("#system-status");
        const statusIntroElement = $("#system-status-intro");
        const now = new Date();
        
        // Simulate system health check
        const isOnline = navigator.onLine;
        const uptime = Math.floor((now.getTime() - new Date().setHours(0, 0, 0, 0)) / 1000 / 60); // Minutes since midnight
        
        if (isOnline) {
            statusElement.html('<i class="fas fa-circle text-success mr-1"></i>Online');
            statusElement.removeClass('badge-danger').addClass('badge-light');
            
            // Update intro status
            if (statusIntroElement.length > 0) {
                statusIntroElement.text('Online');
                statusIntroElement.removeClass('text-danger').addClass('text-success');
            }
        } else {
            statusElement.html('<i class="fas fa-circle text-danger mr-1"></i>Offline');
            statusElement.removeClass('badge-light').addClass('badge-danger');
            
            // Update intro status
            if (statusIntroElement.length > 0) {
                statusIntroElement.text('Offline');
                statusIntroElement.removeClass('text-success').addClass('text-danger');
            }
        }
        
        // Update tooltip with additional info
        statusElement.attr('title', `Uptime: ${Math.floor(uptime / 60)}h ${uptime % 60}m`);
        
        // Update intro status tooltip
        if (statusIntroElement.length > 0) {
            statusIntroElement.attr('title', `System uptime: ${Math.floor(uptime / 60)}h ${uptime % 60}m`);
        }
    }
    
    // Update concurrent users count
    function updateConcurrentUsers() {
        const token = getToken();
        if (!token) return;
        
        // Simulate concurrent users (in real implementation, this would be an API call)
        const baseUsers = Math.floor(Math.random() * 10) + 1;
        const peakHour = new Date().getHours();
        const peakMultiplier = (peakHour >= 8 && peakHour <= 16) ? 1.5 : 1; // Peak during work hours
        const concurrentUsers = Math.floor(baseUsers * peakMultiplier);
        
        $("#concurrent-users").text(concurrentUsers);
        
        // Update color based on load
        const userElement = $("#concurrent-users").parent().find('.metric-icon i');
        if (concurrentUsers > 30) {
            userElement.removeClass('text-info text-warning').addClass('text-danger');
        } else if (concurrentUsers > 15) {
            userElement.removeClass('text-info text-danger').addClass('text-warning');
        } else {
            userElement.removeClass('text-warning text-danger').addClass('text-info');
        }
    }
    
    // Get system information
    function getSystemInfo() {
        return {
            name: "SPPAS - Sistem Prediksi Prestasi Akademik Siswa",
            version: "v1.0",
            algorithm: "C4.5 Decision Tree",
            framework: "FastAPI + PostgreSQL",
            frontend: "HTML5 + Kendo UI + D3.js",
            database: "PostgreSQL 13+",
            backend: "Python 3.8+ FastAPI",
            ml: "Scikit-learn",
            containerization: "Docker Compose",
            features: [
                "Prediksi Individual & Batch",
                "Visualisasi Interaktif D3.js",
                "Export Excel & Reporting",
                "Real-time Dashboard",
                "User Management & Security"
            ],
            performance: {
                trainingTime: "< 15s",
                predictionTime: "< 2s",
                modelAccuracy: "> 85%",
                concurrentUsers: "1-50"
            }
        };
    }
    
    // Show system information modal
    function showSystemInfoModal() {
        const systemInfo = getSystemInfo();
        
        const content = `
            <div class="system-info-modal">
                <div class="row">
                    <div class="col-md-6">
                        <h6 class="text-primary mb-3">
                            <i class="fas fa-info-circle mr-2"></i>
                            Informasi Sistem
                        </h6>
                        <table class="table table-sm">
                            <tr>
                                <td><strong>Nama Sistem:</strong></td>
                                <td>${systemInfo.name}</td>
                            </tr>
                            <tr>
                                <td><strong>Versi:</strong></td>
                                <td>${systemInfo.version}</td>
                            </tr>
                            <tr>
                                <td><strong>Algoritma:</strong></td>
                                <td>${systemInfo.algorithm}</td>
                            </tr>
                            <tr>
                                <td><strong>Framework:</strong></td>
                                <td>${systemInfo.framework}</td>
                            </tr>
                        </table>
                    </div>
                    <div class="col-md-6">
                        <h6 class="text-success mb-3">
                            <i class="fas fa-cogs mr-2"></i>
                            Spesifikasi Teknis
                        </h6>
                        <table class="table table-sm">
                            <tr>
                                <td><strong>Database:</strong></td>
                                <td>${systemInfo.database}</td>
                            </tr>
                            <tr>
                                <td><strong>Backend:</strong></td>
                                <td>${systemInfo.backend}</td>
                            </tr>
                            <tr>
                                <td><strong>Machine Learning:</strong></td>
                                <td>${systemInfo.ml}</td>
                            </tr>
                            <tr>
                                <td><strong>Container:</strong></td>
                                <td>${systemInfo.containerization}</td>
                            </tr>
                        </table>
                    </div>
                </div>
                
                <div class="row mt-4">
                    <div class="col-md-12">
                        <h6 class="text-warning mb-3">
                            <i class="fas fa-star mr-2"></i>
                            Fitur Utama Sistem
                        </h6>
                        <div class="modal-feature-list">
                            <div class="modal-feature-category">
                                <div class="modal-feature-category-header">
                                    <i class="fas fa-brain text-primary mr-2"></i>
                                    <strong>Machine Learning</strong>
                                </div>
                                <div class="modal-feature-item">
                                    <i class="fas fa-check-circle text-success mr-2"></i>
                                    <span>Prediksi Individual & Batch</span>
                                </div>
                                <div class="modal-feature-item">
                                    <i class="fas fa-check-circle text-success mr-2"></i>
                                    <span>Algoritma C4.5 Decision Tree</span>
                                </div>
                                <div class="modal-feature-item">
                                    <i class="fas fa-check-circle text-success mr-2"></i>
                                    <span>Model Training & Evaluation</span>
                                </div>
                            </div>
                            
                            <div class="modal-feature-category">
                                <div class="modal-feature-category-header">
                                    <i class="fas fa-chart-line text-info mr-2"></i>
                                    <strong>Analytics & Visualization</strong>
                                </div>
                                <div class="modal-feature-item">
                                    <i class="fas fa-check-circle text-success mr-2"></i>
                                    <span>Visualisasi Interaktif D3.js</span>
                                </div>
                                <div class="modal-feature-item">
                                    <i class="fas fa-check-circle text-success mr-2"></i>
                                    <span>Real-time Dashboard</span>
                                </div>
                                <div class="modal-feature-item">
                                    <i class="fas fa-check-circle text-success mr-2"></i>
                                    <span>Statistical Analysis</span>
                                </div>
                            </div>
                            
                            <div class="modal-feature-category">
                                <div class="modal-feature-category-header">
                                    <i class="fas fa-database text-warning mr-2"></i>
                                    <strong>Data Management</strong>
                                </div>
                                <div class="modal-feature-item">
                                    <i class="fas fa-check-circle text-success mr-2"></i>
                                    <span>Data Import/Export Excel</span>
                                </div>
                                <div class="modal-feature-item">
                                    <i class="fas fa-check-circle text-success mr-2"></i>
                                    <span>CRUD Operations</span>
                                </div>
                                <div class="modal-feature-item">
                                    <i class="fas fa-check-circle text-success mr-2"></i>
                                    <span>Data Validation</span>
                                </div>
                            </div>
                            
                            <div class="modal-feature-category">
                                <div class="modal-feature-category-header">
                                    <i class="fas fa-shield-alt text-danger mr-2"></i>
                                    <strong>Security & User Management</strong>
                                </div>
                                <div class="modal-feature-item">
                                    <i class="fas fa-check-circle text-success mr-2"></i>
                                    <span>JWT Authentication</span>
                                </div>
                                <div class="modal-feature-item">
                                    <i class="fas fa-check-circle text-success mr-2"></i>
                                    <span>Role-based Access Control</span>
                                </div>
                                <div class="modal-feature-item">
                                    <i class="fas fa-check-circle text-success mr-2"></i>
                                    <span>Session Management</span>
                                </div>
                            </div>
                            
                            <div class="modal-feature-category">
                                <div class="modal-feature-category-header">
                                    <i class="fas fa-file-export text-success mr-2"></i>
                                    <strong>Reporting & Export</strong>
                                </div>
                                <div class="modal-feature-item">
                                    <i class="fas fa-check-circle text-success mr-2"></i>
                                    <span>PDF Report Generation</span>
                                </div>
                                <div class="modal-feature-item">
                                    <i class="fas fa-check-circle text-success mr-2"></i>
                                    <span>Excel Export/Import</span>
                                </div>
                                <div class="modal-feature-item">
                                    <i class="fas fa-check-circle text-success mr-2"></i>
                                    <span>Batch Processing Results</span>
                                </div>
                            </div>
                            
                            <div class="modal-feature-category">
                                <div class="modal-feature-category-header">
                                    <i class="fas fa-cogs text-secondary mr-2"></i>
                                    <strong>System Features</strong>
                                </div>
                                <div class="modal-feature-item">
                                    <i class="fas fa-check-circle text-success mr-2"></i>
                                    <span>Responsive Web Design</span>
                                </div>
                                <div class="modal-feature-item">
                                    <i class="fas fa-check-circle text-success mr-2"></i>
                                    <span>RESTful API Architecture</span>
                                </div>
                                <div class="modal-feature-item">
                                    <i class="fas fa-check-circle text-success mr-2"></i>
                                    <span>Docker Containerization</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="row mt-3">
                    <div class="col-md-12">
                        <h6 class="text-info mb-3">
                            <i class="fas fa-tachometer-alt mr-2"></i>
                            Performa Sistem
                        </h6>
                        <div class="row">
                            <div class="col-md-3 text-center">
                                <div class="performance-badge">
                                    <i class="fas fa-clock text-primary"></i>
                                    <div><strong>${systemInfo.performance.trainingTime}</strong></div>
                                    <small>Training Time</small>
                                </div>
                            </div>
                            <div class="col-md-3 text-center">
                                <div class="performance-badge">
                                    <i class="fas fa-bolt text-warning"></i>
                                    <div><strong>${systemInfo.performance.predictionTime}</strong></div>
                                    <small>Prediction Time</small>
                                </div>
                            </div>
                            <div class="col-md-3 text-center">
                                <div class="performance-badge">
                                    <i class="fas fa-bullseye text-success"></i>
                                    <div><strong>${systemInfo.performance.modelAccuracy}</strong></div>
                                    <small>Model Accuracy</small>
                                </div>
                            </div>
                            <div class="col-md-3 text-center">
                                <div class="performance-badge">
                                    <i class="fas fa-users text-info"></i>
                                    <div><strong>${systemInfo.performance.concurrentUsers}</strong></div>
                                    <small>Concurrent Users</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const dialog = $("<div></div>").html(content);
        
        dialog.kendoWindow({
            title: "Detail Informasi Sistem EduPro",
            width: "900px",
            height: "700px",
            modal: true,
            resizable: false,
            actions: ["Close"],
            close: function() {
                this.destroy();
            }
        });
        
        dialog.data("kendoWindow").center().open();
    }
    
    // Initialize system info when dashboard loads
    $(document).ready(function() {
        setTimeout(function() {
            if ($("#dashboard-page").is(':visible')) {
                initializeSystemInfo();
            }
        }, 1000);
        
        // Auto-initialize User Guide if page is already visible
        setTimeout(function() {
            if ($("#user-guide-page").is(':visible')) {
                console.log("User Guide page detected on load, auto-initializing...");
                window.forceReinitUserGuide();
            }
        }, 1500);
        
        // Add click handler for system info card
        $(document).on('click', '.system-info-card .card-header', function() {
            showSystemInfoModal();
        });
        
        // Add tooltip for system badges
        $(document).on('mouseenter', '.system-badge', function() {
            const badge = $(this);
            if (badge.attr('id') === 'system-status') {
                badge.attr('title', 'Klik header untuk detail sistem');
            } else if (badge.attr('id') === 'system-version') {
                badge.attr('title', 'Versi aplikasi SPPAS');
            }
        });
        
        // Add hover effect for system info card header
        $(document).on('mouseenter', '.system-info-card .card-header', function() {
            $(this).css('cursor', 'pointer');
            $(this).attr('title', 'Klik untuk melihat detail lengkap sistem');
        });
    });
    
    // Make system info functions globally accessible
    window.initializeSystemInfo = initializeSystemInfo;
    window.updateSystemStatus = updateSystemStatus;
    window.updateConcurrentUsers = updateConcurrentUsers;
    window.getSystemInfo = getSystemInfo;
    window.showSystemInfoModal = showSystemInfoModal;
});