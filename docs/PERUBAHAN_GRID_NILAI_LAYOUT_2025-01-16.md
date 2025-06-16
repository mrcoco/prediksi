# Perubahan Layout Grid Nilai Raport - 16 Januari 2025

## Ringkasan Perubahan
Menyesuaikan layout dan tampilan grid nilai raport agar konsisten dengan grid siswa yang telah diperbaiki, dengan fokus pada optimasi ruang untuk banyak kolom mata pelajaran.

## Detail Perubahan

### 1. Penyesuaian Kolom Grid (`frontend/js/app.js`)

#### Sebelum:
```javascript
columns: [
    { field: "nama_siswa", title: "Nama Siswa", width: 150, ... },
    { field: "semester", title: "Semester" },
    { field: "tahun_ajaran", title: "Tahun Ajaran" },
    { field: "matematika", title: "Matematika", format: "{0:n1}" },
    { field: "bahasa_indonesia", title: "B. Indonesia", format: "{0:n1}" },
    // ... mata pelajaran lainnya
    { field: "rata_rata", title: "Rata-rata", format: "{0:n1}" },
    { command: ["edit", "destroy"], title: "Aksi", width: "200px" }
]
```

#### Sesudah:
```javascript
columns: [
    { field: "nama_siswa", title: "Nama Siswa", width: 150, ... },
    { field: "semester", title: "Semester", width: 80 },
    { field: "tahun_ajaran", title: "Tahun Ajaran", width: 100 },
    { field: "matematika", title: "MTK", format: "{0:n1}", width: 60, attributes: { style: "text-align: center;" }, headerAttributes: { style: "text-align: center;" } },
    { field: "bahasa_indonesia", title: "B.IND", format: "{0:n1}", width: 60, attributes: { style: "text-align: center;" }, headerAttributes: { style: "text-align: center;" } },
    // ... mata pelajaran lainnya dengan title singkat dan width 60px
    { field: "rata_rata", title: "Rata²", format: "{0:n1}", width: 70, attributes: { style: "text-align: center; font-weight: bold; color: #007bff;" }, headerAttributes: { style: "text-align: center;" } },
    {
        command: [{ name: "edit", text: { edit: "Edit", update: "Simpan", cancel: "Batal" }, iconClass: "k-icon k-i-edit" }],
        title: "Edit", width: 80, attributes: { style: "text-align: center;" }, headerAttributes: { style: "text-align: center;" }
    },
    {
        field: "id", title: "Hapus", width: 90,
        template: function(dataItem) {
            return `<div class="text-center">
                        <button class="k-button k-button-solid k-button-solid-error k-button-sm btn-delete-nilai" 
                               data-id="${dataItem.id}" 
                               data-nama="${dataItem.nama_siswa || dataItem.siswa?.nama || 'Siswa'}" 
                               data-semester="${dataItem.semester}" 
                               data-tahun="${dataItem.tahun_ajaran}"
                               title="Hapus nilai ${dataItem.nama_siswa || dataItem.siswa?.nama || 'siswa'}">
                            <i class="k-icon k-i-delete"></i>
                        </button>
                    </div>`;
        },
        attributes: { style: "text-align: center;" }, headerAttributes: { style: "text-align: center;" }
    }
]
```

### 2. Optimasi Title Mata Pelajaran
Untuk menghemat ruang horizontal dengan banyak kolom:

| Mata Pelajaran | Title Lama | Title Baru |
|----------------|------------|------------|
| Matematika | "Matematika" | "MTK" |
| Bahasa Indonesia | "B. Indonesia" | "B.IND" |
| Bahasa Inggris | "B. Inggris" | "B.ING" |
| Bahasa Jawa | "B. Jawa" | "B.JAW" |
| Dasar Kejuruan | "Dasar Kejuruan" | "D.KEJ" |
| Rata-rata | "Rata-rata" | "Rata²" |

### 3. Event Handler untuk Delete Button

```javascript
// Event handler untuk button delete nilai
$(document).on("click", ".btn-delete-nilai", function(e) {
    e.preventDefault();
    
    const button = $(this);
    const dataItem = {
        id: button.data("id"),
        nama_siswa: button.data("nama"),
        semester: button.data("semester"),
        tahun_ajaran: button.data("tahun")
    };
    
    showDeleteConfirmationNilai(dataItem);
});
```

### 4. Fungsi Konfirmasi Penghapusan

```javascript
function showDeleteConfirmationNilai(data) {
    const windowElement = $("<div></div>").appendTo("body");
    const window = windowElement.kendoWindow({
        title: "Konfirmasi Hapus Data Nilai",
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
                        <h4>Konfirmasi Hapus Data Nilai</h4>
                        <p><strong>Siswa:</strong> ${data.nama_siswa}</p>
                        <p><strong>Semester:</strong> ${data.semester}</p>
                        <p><strong>Tahun Ajaran:</strong> ${data.tahun_ajaran}</p>
                        <hr>
                        <p class="text-danger">Apakah Anda yakin ingin menghapus data nilai ini? Tindakan ini tidak dapat dibatalkan.</p>
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
    
    // Event handlers untuk konfirmasi
    windowElement.on("click", "#confirmDeleteNilai", function() {
        window.close();
        // AJAX call untuk menghapus data
        $.ajax({
            url: `${API_URL}/nilai/${data.id}`,
            type: "DELETE",
            // ... success dan error handlers
        });
    });
    
    window.center().open();
}
```

### 5. CSS Khusus untuk Grid Nilai (`frontend/styles/custom.css`)

#### Grid Header dan Content:
```css
#nilai-grid .k-grid-header th {
    text-align: center;
    vertical-align: middle;
    font-weight: 600;
    background-color: #f8f9fa;
    border-bottom: 2px solid #dee2e6;
    padding: 10px 6px;
    font-size: 0.875rem;
}

#nilai-grid .k-grid-content td {
    vertical-align: middle;
    padding: 8px 6px;
    border-bottom: 1px solid #dee2e6;
    font-size: 0.875rem;
}
```

#### Kolom-Specific Styling:
```css
/* Nama Siswa */
#nilai-grid .k-grid-content td:nth-child(1) {
    font-weight: 500;
    color: #495057;
}

/* Semester dan Tahun Ajaran */
#nilai-grid .k-grid-content td:nth-child(3),
#nilai-grid .k-grid-content td:nth-child(4) {
    text-align: center;
    font-family: 'Courier New', monospace;
    font-weight: 500;
    color: #6c757d;
}

/* Kolom nilai mata pelajaran */
#nilai-grid .k-grid-content td:nth-child(5),
#nilai-grid .k-grid-content td:nth-child(6),
/* ... sampai nth-child(15) */ {
    text-align: center;
    font-family: 'Courier New', monospace;
    font-weight: 500;
    color: #495057;
}

/* Kolom rata-rata */
#nilai-grid .k-grid-content td:nth-child(16) {
    text-align: center;
    font-family: 'Courier New', monospace;
    font-weight: bold;
    color: #007bff;
    background-color: #f8f9fa;
}
```

#### Button Styling:
```css
#nilai-grid .k-button {
    border-radius: 4px;
    font-size: 0.8rem;
    padding: 4px 8px;
    transition: all 0.2s ease;
    border: none;
    font-weight: 500;
}

#nilai-grid .k-button-solid-primary:hover {
    background-color: #0056b3;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0,123,255,0.3);
}

#nilai-grid .btn-delete-nilai:hover {
    background-color: #c82333;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(220,53,69,0.3);
}
```

## Fitur Baru

### 1. Space Optimization
- Title mata pelajaran disingkat untuk menghemat ruang horizontal
- Width kolom nilai dioptimalkan (60px per mata pelajaran)
- Compact button design untuk aksi

### 2. Visual Hierarchy
- Kolom rata-rata diberi highlight dengan background dan warna biru
- Font monospace untuk nilai numerik
- Consistent alignment untuk semua kolom nilai

### 3. Responsive Design
```css
@media (max-width: 1400px) {
    #nilai-grid .k-grid-header th,
    #nilai-grid .k-grid-content td {
        padding: 6px 4px;
        font-size: 0.8rem;
    }
}

@media (max-width: 1200px) {
    #nilai-grid .k-grid-header th,
    #nilai-grid .k-grid-content td {
        padding: 5px 3px;
        font-size: 0.75rem;
    }
}

@media (max-width: 992px) {
    #nilai-grid .k-grid-header th,
    #nilai-grid .k-grid-content td {
        padding: 4px 2px;
        font-size: 0.7rem;
    }
}
```

### 4. Delete Confirmation
- Modal dialog yang konsisten dengan grid siswa
- Informasi detail siswa, semester, dan tahun ajaran
- AJAX integration untuk penghapusan data
- Success/error notifications

## Manfaat Perubahan

### 1. Space Efficiency
- Mengakomodasi 11 mata pelajaran + rata-rata dalam satu view
- Horizontal scrolling minimal
- Optimal use of screen real estate

### 2. Consistency
- Styling yang konsisten dengan grid siswa
- Button behavior yang seragam
- Delete confirmation pattern yang sama

### 3. Readability
- Nilai numerik mudah dibaca dengan font monospace
- Rata-rata highlighted untuk emphasis
- Clear visual separation antar kolom

### 4. User Experience
- Hover effects yang smooth
- Tooltip informatif
- Responsive design untuk berbagai ukuran layar

## Testing

### Desktop (1920x1080)
- ✅ Semua 18 kolom terlihat tanpa horizontal scroll
- ✅ Button aksi mudah diklik
- ✅ Nilai numerik terbaca dengan jelas

### Laptop (1366x768)
- ✅ Layout menyesuaikan dengan font size lebih kecil
- ✅ Semua kolom masih accessible
- ✅ Button tetap functional

### Tablet (768x1024)
- ✅ Responsive design aktif
- ✅ Font size dan padding menyesuaikan
- ✅ Touch-friendly buttons

## Kompatibilitas
- ✅ Kendo UI Grid
- ✅ Bootstrap 4
- ✅ Font Awesome Icons
- ✅ Modern Browsers (Chrome, Firefox, Safari, Edge)

## File yang Dimodifikasi
1. `frontend/js/app.js` - Grid column configuration dan event handlers
2. `frontend/styles/custom.css` - Grid-specific styling

## Dampak
- Tidak ada breaking changes
- Backward compatible
- Performance impact minimal
- Improved space utilization
- Better user experience

---
**Dibuat pada:** 16 Januari 2025  
**Status:** ✅ Completed  
**Testing:** ✅ Passed 