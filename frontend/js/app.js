$(document).ready(function() {
    // initGenerateDummyForm();
    // Konfigurasi global
    const API_URL = 'http://localhost:8000/api';
    const TOKEN_KEY = 'access_token';
    
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
        
        // Inisialisasi grid jika belum
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
        } else if (page === "profile" && !$("#profile-page").data("kendoForm")) {
            initProfilePage();
        } else if (page === "generate-dummy" && !$("#generate-dummy-form").data("kendoForm")) {
            console.log("Initializing generate dummy form");
            initGenerateDummyForm();  }
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
    
    // Event handler umum untuk semua link dengan data-page attribute
    $(document).on("click", "[data-page]", function(e) {
        // Skip jika sudah ditangani oleh event handler lain
        if ($(this).hasClass("sidebar-link")) {
            return; // Biarkan sidebar handler yang menangani
        }
        
        console.log("Clicked data-page link:", $(this).data("page"));
        e.preventDefault();
        const page = $(this).data("page");
        
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
        } else if (page === "generate-dummy" && !$("#generate-dummy-form").data("kendoForm")) {
            console.log("Initializing generate dummy form");
            initGenerateDummyForm();
        }
    });
    
    // Inisialisasi dashboard saat halaman dimuat
    loadDashboardData();
    
    // Setup menu visibility based on user role
    setupMenuVisibility();
    
    // Update header user info
    updateHeaderUserInfo();
    
    // Initialize tooltips
    $('[data-toggle="tooltip"]').tooltip();
    
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
            'profile': ['admin', 'guru', 'staf'] // All roles can access profile
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
        // Ambil data untuk dashboard
        $.ajax({
            url: `${API_URL}/siswa`,
            method: "GET",
            success: function(data) {
                $("#total-siswa").text(data.length);
            },
            error: function(xhr) {
                console.error("Error loading siswa data:", xhr.responseText);
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
            method: "GET",
            success: function(data) {
                let tinggi = 0, sedang = 0, rendah = 0;
                
                data.forEach(item => {
                    if (item.prediksi_prestasi === "Tinggi") tinggi++;
                    else if (item.prediksi_prestasi === "Sedang") sedang++;
                    else if (item.prediksi_prestasi === "Rendah") rendah++;
                });
                
                $("#prestasi-tinggi").text(tinggi);
                $("#prestasi-sedang").text(sedang);
                $("#prestasi-rendah").text(rendah);
                
                // Buat chart distribusi prestasi
                createPrestasiChart(tinggi, sedang, rendah);
            },
            error: function(xhr) {
                console.error("Error loading prediction data:", xhr.responseText);
            }
        });
        
        // Ambil visualisasi pohon keputusan
        $.ajax({
            url: `${API_URL}/prediksi/visualization`,
            method: "GET",
            beforeSend: function() {
                $("#visualization-container").addClass("loading").html("");
            },
            success: function(data) {
                $("#visualization-container").removeClass("loading");
                if (data.status === "success") {
                    const imgHtml = `<img src="${data.image}" alt="Pohon Keputusan C4.5" onclick="openImageModal(this.src)" title="Klik untuk memperbesar" />`;
                    $("#visualization-container").html(imgHtml);
                } else {
                    $("#visualization-container").html('<p>Visualisasi tidak tersedia. Silakan latih model terlebih dahulu.</p>');
                }
            },
            error: function(xhr) {
                $("#visualization-container").removeClass("loading");
                console.error("Error loading visualization:", xhr.responseText);
                const errorMsg = xhr.responseJSON ? xhr.responseJSON.detail : 'Terjadi kesalahan saat mengambil data';
                $("#visualization-container").html('<p>Gagal memuat visualisasi. Silakan coba lagi.</p>');
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
        
        // Ambil confusion matrix dan metrik evaluasi
        loadModelEvaluation();
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
        $("#siswa-grid").kendoGrid({
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
            },
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
                { field: "nama", title: "Nama" },
                { field: "nis", title: "NIS" },
                { field: "jenis_kelamin", title: "Jenis Kelamin" },
                { field: "kelas", title: "Kelas" },
                { field: "tanggal_lahir", title: "Tanggal Lahir", format: "{0:dd/MM/yyyy}" },
                { field: "alamat", title: "Alamat" },
                { command: ["edit", "destroy"], title: "Aksi", width: "200px" }
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
        $("#nilai-grid").kendoGrid({
            dataSource: {
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
            },
            height: 550,
            pageable: true,
            sortable: true,
            filterable: true,
            toolbar: ["create", "excel"],
            excel: {
                fileName: "Data Siswa.xlsx",
                filterable: true,
                allPages: true
            },
            editable: {
                mode: "popup",
                template: kendo.template($("#nilai-template").html())
            },
            columns: [
                { field: "siswa_id", title: "ID Siswa", editor: siswaDropDownEditor },
                { field: "semester", title: "Semester" },
                { field: "tahun_ajaran", title: "Tahun Ajaran" },
                { field: "matematika", title: "Matematika", format: "{0:n1}" },
                { field: "bahasa_indonesia", title: "B. Indonesia", format: "{0:n1}" },
                { field: "bahasa_inggris", title: "B. Inggris", format: "{0:n1}" },
                { field: "ipa", title: "IPA", format: "{0:n1}" },
                { field: "bahasa_jawa", title: "B. Jawa", format: "{0:n1}" },
                { field: "pkn", title: "PKN", format: "{0:n1}" },
                { field: "seni", title: "Seni", format: "{0:n1}" },
                { field: "pjok", title: "PJOK", format: "{0:n1}" },
                { field: "sejarah", title: "Sejarah", format: "{0:n1}" },
                { field: "agama", title: "Agama", format: "{0:n1}" },
                { field: "dasar_kejuruan", title: "Dasar Kejuruan", format: "{0:n1}" },
                { field: "rata_rata", title: "Rata-rata", format: "{0:n1}" },
                { command: ["edit", "destroy"], title: "Aksi", width: "200px" }
            ]
        });
    }
    
    // ========== FUNGSI DATA PRESENSI ==========
    function initPresensiGrid() {
        $("#presensi-grid").kendoGrid({
            dataSource: {
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
                        }
                    },
                    destroy: {
                        url: function(data) {
                            return `${API_URL}/presensi/${data.id}`;
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
            },
            height: 550,
            pageable: true,
            sortable: true,
            filterable: true,
            toolbar: ["create", "excel"],
            excel: {
                fileName: "Data Siswa.xlsx",
                filterable: true,
                allPages: true
            },
            editable: "popup",
            columns: [
                { field: "siswa_id", title: "ID Siswa", editor: siswaDropDownEditor },
                { field: "semester", title: "Semester" },
                { field: "tahun_ajaran", title: "Tahun Ajaran" },
                { field: "jumlah_hadir", title: "Hadir" },
                { field: "jumlah_sakit", title: "Sakit" },
                { field: "jumlah_izin", title: "Izin" },
                { field: "jumlah_alpa", title: "Alpa" },
                { field: "persentase_kehadiran", title: "Persentase", format: "{0:n1}%" },
                { field: "kategori_kehadiran", title: "Kategori" },
                { command: ["edit", "destroy"], title: "Aksi", width: "200px" }
            ]
        });
    }
    
    // ========== FUNGSI DATA PENGHASILAN ORTU ==========
    function initPenghasilanGrid() {
        $("#penghasilan-grid").kendoGrid({
            dataSource: {
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
            },
            height: 550,
            pageable: true,
            sortable: true,
            filterable: true,
            toolbar: ["create"],
            editable: "popup",
            columns: [
                { field: "siswa_id", title: "ID Siswa", editor: siswaDropDownEditor },
                { field: "penghasilan_ayah", title: "Penghasilan Ayah", format: "{0:n0}" },
                { field: "penghasilan_ibu", title: "Penghasilan Ibu", format: "{0:n0}" },
                { field: "pekerjaan_ayah", title: "Pekerjaan Ayah" },
                { field: "pekerjaan_ibu", title: "Pekerjaan Ibu" },
                { field: "pendidikan_ayah", title: "Pendidikan Ayah" },
                { field: "pendidikan_ibu", title: "Pendidikan Ibu" },
                { field: "total_penghasilan", title: "Total", format: "{0:n0}" },
                { field: "kategori_penghasilan", title: "Kategori" },
                { command: ["edit", "destroy"], title: "Aksi", width: "200px" }
            ]
        });
    }
    
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
                        dataType: "json",
                        beforeSend: function(xhr) {
                            const token = getToken();
                            if (token) {
                                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                            }
                        }
                    }
                },
                schema: {
                    model: {
                        id: "id",
                        fields: {
                            id: { type: "number" },
                            siswa_id: { type: "number" },
                            nama_siswa: { type: "string" },
                            semester: { type: "string" },
                            tahun_ajaran: { type: "string" },
                            prediksi_prestasi: { type: "string" },
                            confidence: { type: "number" },
                            created_at: { type: "date" }
                        }
                    }
                },
                pageSize: 5
            },
            height: 300,
            pageable: true,
            sortable: true,
            columns: [
                { field: "nama_siswa", title: "Nama Siswa", width: 150 },
                { field: "semester", title: "Semester", width: 100 },
                { field: "tahun_ajaran", title: "Tahun Ajaran", width: 120 },
                { field: "prediksi_prestasi", title: "Prediksi", width: 100 },
                { field: "confidence", title: "Confidence", format: "{0:p2}", width: 100 },
                { field: "created_at", title: "Tanggal", format: "{0:dd/MM/yyyy HH:mm}", width: 150 }
            ]
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
                    
                    // Refresh visualisasi
                    $.ajax({
                        url: `${API_URL}/prediksi/visualization`,
                        method: "GET",
                        beforeSend: function(xhr) {
                            $("#visualization-container").addClass("loading").html("");
                            const token = getToken();
                            if (token) {
                                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                            }
                        },
                        success: function(data) {
                            $("#visualization-container").removeClass("loading");
                            if (data.status === "success") {
                                const imgSrc = data.visualization_base64 ? 
                                    `data:image/png;base64,${data.visualization_base64}` : 
                                    data.image;
                                const imgHtml = `<img src="${imgSrc}" alt="Pohon Keputusan C4.5" onclick="openImageModal(this.src)" title="Klik untuk memperbesar" />`;
                                $("#visualization-container").html(imgHtml);
                            } else {
                                $("#visualization-container").html('<p>Visualisasi tidak tersedia.</p>');
                            }
                        },
                        error: function() {
                            $("#visualization-container").removeClass("loading");
                            $("#visualization-container").html('<p>Gagal memuat visualisasi.</p>');
                        }
                    });
                    
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

    function initUsersGrid() {
        console.log("initUsersGrid");
        
        // Double check user access before initializing grid
        const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
        if (userData.role !== 'admin') {
            showErrorNotification("Akses ditolak. Hanya admin yang dapat mengakses manajemen user.", "Akses Ditolak");
            return;
        }
        
        $("#users-grid").kendoGrid({
            dataSource: {
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
            },
            toolbar: ["create"],
            pageable: true,
            sortable: true,
            filterable: true,
            editable: {
                mode: "popup"
            },
            columns: [
                { field: "username", title: "Username", width: 120 },
                { field: "email", title: "Email", width: 180 },
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
                    width: 150 
                },
                { 
                    field: "profile.jabatan", 
                    title: "Jabatan", 
                    width: 120 
                },
                { field: "is_active", title: "Status", width: 100, template: "#= is_active ? 'Aktif' : 'Nonaktif' #" },
                {
                    command: [
                        {
                            name: "edit",
                            text: { edit: "Edit", update: "Simpan", cancel: "Batal" }
                        },
                        {
                            name: "destroy",
                            text: "Hapus",
                            iconClass: "k-icon k-i-delete",
                            click: function(e) {
                                e.preventDefault();
                                const dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                                showDeleteConfirmation(dataItem);
                                return false;
                            }
                        }
                    ],
                    width: 180
                }
            ],
            error: function(e) {
                console.log(e);
                showErrorNotification(e.errors);
            },
            edit: function(e) {
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

});

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
            background-color: rgba(0,0,0,0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        ">
            <div style="
                position: relative;
                max-width: 95%;
                max-height: 95%;
                background: white;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            ">
                <button onclick="closeImageModal()" style="
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: #dc3545;
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    cursor: pointer;
                    font-size: 16px;
                    line-height: 1;
                    z-index: 10001;
                ">&times;</button>
                <img src="${imageSrc}" alt="Pohon Keputusan C4.5" style="
                    max-width: 100%;
                    max-height: 100%;
                    height: auto;
                    display: block;
                    margin: 0 auto;
                ">
                <div style="
                    text-align: center;
                    margin-top: 15px;
                    color: #6c757d;
                    font-size: 14px;
                ">
                    <p>Pohon Keputusan C4.5 - Klik di luar gambar atau tombol X untuk menutup</p>
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
    
    // Close modal with Escape key
    $(document).on("keydown.imageModal", function(e) {
        if (e.key === "Escape") {
            closeImageModal();
        }
    });
}

// Global function for closing image modal
function closeImageModal() {
    $(".image-modal").remove();
    $(document).off("keydown.imageModal");
}

// Make functions globally accessible
window.openImageModal = openImageModal;
window.closeImageModal = closeImageModal;