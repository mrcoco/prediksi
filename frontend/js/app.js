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
    $("body").prepend('<header><div id="header-content"><h5 class="text-white">Prestasi Siswa</h5></div><button id="sidebar-toggle" class="btn btn-sm btn-secondary"><i class="k-icon k-i-menu"></i></button></header>');
    
    // CSS telah dipindahkan ke file custom.css
    
    // Update tombol toggle sidebar
    $("#sidebar-toggle").on("click", function() {
        $(".sidebar").toggleClass("collapsed");
        $(".main-content").toggleClass("expanded full-width");
        $(this).find("i").toggleClass("k-i-menu k-i-close");
        
        // Simpan state sidebar di localStorage
        localStorage.setItem('sidebarState', $(".sidebar").hasClass("collapsed") ? 'collapsed' : 'expanded');
    });
    
    // Load state sidebar saat halaman dimuat
    $(document).ready(function() {
        const sidebarState = localStorage.getItem('sidebarState');
        if (sidebarState === 'collapsed') {
            $(".sidebar").addClass("collapsed");
            $(".main-content").addClass("expanded full-width");
            $("#sidebar-toggle i").removeClass("k-i-menu").addClass("k-i-close");
        }
    });
    
    // Navigasi sidebar
    $(".sidebar-link").on("click", function(e) {
        console.log("Clicked sidebar link");
        e.preventDefault();
        const page = $(this).data("page");
        
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
        } else if (page === "generate-dummy" && !$("#generate-dummy-form").data("kendoForm")) {
            console.log("Initializing generate dummy form");
            initGenerateDummyForm();  }
    });
    
    // Inisialisasi dashboard saat halaman dimuat
    loadDashboardData();
    
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
            success: function(data) {
                if (data.status === "success") {
                    $("#visualization-container").html(`<img src="${data.image}" alt="Pohon Keputusan C4.5" />`);
                }
            },
            error: function(xhr) {
                console.error("Error loading visualization:", xhr.responseText);
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
                template: kendo.template($("#siswa-template").html())
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
                        dataType: "json"
                    },
                    create: {
                        url: `${API_URL}/nilai`,
                        dataType: "json",
                        type: "POST",
                        contentType: "application/json"
                    },
                    update: {
                        url: function(data) {
                            return `${API_URL}/nilai/${data.id}`;
                        },
                        dataType: "json",
                        type: "PUT",
                        contentType: "application/json"
                    },
                    destroy: {
                        url: function(data) {
                            return `${API_URL}/nilai/${data.id}`;
                        },
                        dataType: "json",
                        type: "DELETE"
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
                        dataType: "json"
                    },
                    create: {
                        url: `${API_URL}/presensi`,
                        dataType: "json",
                        type: "POST",
                        contentType: "application/json"
                    },
                    update: {
                        url: function(data) {
                            return `${API_URL}/presensi/${data.id}`;
                        },
                        dataType: "json",
                        type: "PUT",
                        contentType: "application/json"
                    },
                    destroy: {
                        url: function(data) {
                            return `${API_URL}/presensi/${data.id}`;
                        },
                        dataType: "json",
                        type: "DELETE"
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
                        dataType: "json"
                    },
                    create: {
                        url: `${API_URL}/penghasilan`,
                        dataType: "json",
                        type: "POST",
                        contentType: "application/json"
                    },
                    update: {
                        url: function(data) {
                            return `${API_URL}/penghasilan/${data.id}`;
                        },
                        dataType: "json",
                        type: "PUT",
                        contentType: "application/json"
                    },
                    destroy: {
                        url: function(data) {
                            return `${API_URL}/penghasilan/${data.id}`;
                        },
                        dataType: "json",
                        type: "DELETE"
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
                        dataType: "json"
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
                        dataType: "json"
                    }
                },
                schema: {
                    model: {
                        id: "id",
                        fields: {
                            id: { type: "number" },
                            siswa_id: { type: "number" },
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
                { field: "siswa_id", title: "ID Siswa" },
                { field: "semester", title: "Semester" },
                { field: "tahun_ajaran", title: "Tahun Ajaran" },
                { field: "prediksi_prestasi", title: "Prediksi" },
                { field: "confidence", title: "Confidence", format: "{0:p2}" },
                { field: "created_at", title: "Tanggal", format: "{0:dd/MM/yyyy HH:mm}" }
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
                success: function(data) {
                    alert(`Model berhasil dilatih dengan akurasi ${(data.data.accuracy * 100).toFixed(2)}% menggunakan ${data.data.samples} sampel data.`);
                    
                    // Refresh visualisasi
                    $.ajax({
                        url: `${API_URL}/prediksi/visualization`,
                        method: "GET",
                        success: function(data) {
                            if (data.status === "success") {
                                $("#visualization-container").html(`<img src="data:image/png;base64,${data.visualization_base64}" alt="Pohon Keputusan C4.5" />`);
                            }
                        }
                    });
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
                        dataType: "json"
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
                            dataType: "json"
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
});

// Update header dengan gaya AdminLTE termasuk logo dan tombol toggle
// $("body").prepend('<header class="main-header">\n    <nav class="navbar navbar-static-top">\n        <div class="navbar-header">\n            <a href="#" class="navbar-brand">\n                <img src="logo.png" alt="Logo" class="brand-image">\n                <span class="brand-text">Prestasi Siswa</span>\n            </a>\n            <button id="sidebar-toggle" class="btn btn-link btn-sm pull-left">\n                <i class="k-icon k-i-menu"></i>\n            </button>\n        </div>\n    </nav>\n</header>');

// Update CSS untuk header AdminLTE
// $("<style>").appendTo("head").text(`
    
// `);
