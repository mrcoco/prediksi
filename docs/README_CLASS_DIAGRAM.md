# 📖 README - Class Diagram EduPro

## 📁 **File yang Tersedia**

### **1. Dokumentasi Lengkap**
- **File**: `CLASS_DIAGRAM_EDUPRO_2025.md`
- **Deskripsi**: Dokumentasi lengkap class diagram sistem EduPro
- **Format**: Markdown dengan detail teknis dan penjelasan arsitektur

### **2. Diagram Mermaid**
- **File**: `class_diagram_edupro.mmd`
- **Deskripsi**: Class diagram dalam format Mermaid untuk visualisasi
- **Format**: Mermaid syntax yang dapat di-render di GitHub atau tools lain

---

## 🎯 **Cara Menggunakan**

### **1. Membaca Dokumentasi**
```bash
# Buka dokumentasi lengkap
cat docs/CLASS_DIAGRAM_EDUPRO_2025.md

# Atau buka dengan editor
code docs/CLASS_DIAGRAM_EDUPRO_2025.md
```

### **2. Visualisasi Diagram**
```bash
# Lihat file Mermaid
cat docs/class_diagram_edupro.mmd

# Render diagram online di:
# - https://mermaid.live/
# - https://mermaid-js.github.io/mermaid-live-editor/
```

### **3. Integrasi dengan GitHub**
File `.mmd` akan otomatis di-render oleh GitHub saat dilihat di repository.

---

## 🏗️ **Struktur Arsitektur**

### **Layer Architecture**
1. **Entity Layer** - Database models (6 classes)
2. **ML Layer** - Machine learning components (1 class)
3. **Service Layer** - API routers/controllers (6 classes)
4. **Application Layer** - FastAPI app (1 class)
5. **Frontend Layer** - UI components dan services (4 classes)
6. **Database Layer** - Session management (1 class)

### **Total: 17 Classes**

---

## 📊 **Key Components**

### **Core Entities**
- `Siswa` - Main student entity
- `NilaiRaport` - Academic scores
- `PenghasilanOrtu` - Family income
- `Presensi` - Attendance records
- `Prestasi` - Achievement predictions
- `User` - Authentication

### **Machine Learning**
- `C45Model` - Decision tree classifier

### **API Services**
- `SiswaRouter` - Student management
- `NilaiRouter` - Academic scores
- `PresensiRouter` - Attendance
- `PenghasilanRouter` - Family income
- `PrediksiRouter` - ML operations
- `AuthRouter` - Authentication

### **Frontend Services**
- `FrontendApp` - Main application
- `UIComponents` - User interface
- `AuthenticationService` - Auth management
- `DataServices` - Data operations
- `VisualizationServices` - Charts & graphs

---

## 🔗 **Relationships**

### **Entity Relationships**
- Siswa 1:N NilaiRaport
- Siswa 1:N PenghasilanOrtu
- Siswa 1:N Presensi
- Siswa 1:N Prestasi

### **Service Dependencies**
- All routers depend on DatabaseSession
- All routers require AuthRouter
- PrediksiRouter uses C45Model
- Frontend services call FastAPI

---

## 🛠️ **Tools untuk Visualisasi**

### **Online Tools**
1. **Mermaid Live Editor**: https://mermaid.live/
2. **Mermaid Chart**: https://www.mermaidchart.com/
3. **GitHub**: Otomatis render file .mmd

### **Local Tools**
1. **VS Code**: Extension "Mermaid Preview"
2. **IntelliJ**: Plugin "Mermaid"
3. **CLI**: `mermaid-cli` untuk export ke PNG/SVG

### **Installation Mermaid CLI**
```bash
npm install -g @mermaid-js/mermaid-cli

# Generate PNG
mmdc -i docs/class_diagram_edupro.mmd -o docs/class_diagram_edupro.png

# Generate SVG
mmdc -i docs/class_diagram_edupro.mmd -o docs/class_diagram_edupro.svg
```

---

## 📋 **Checklist Penggunaan**

### **Untuk Developer**
- [ ] Baca dokumentasi lengkap
- [ ] Pahami structure layer architecture
- [ ] Review entity relationships
- [ ] Understand service dependencies
- [ ] Check design patterns implementation

### **Untuk Architect**
- [ ] Validate architectural decisions
- [ ] Review scalability aspects
- [ ] Check security implementation
- [ ] Assess maintainability
- [ ] Plan future enhancements

### **Untuk Project Manager**
- [ ] Understand system complexity
- [ ] Review feature coverage
- [ ] Check implementation guidelines
- [ ] Assess development timeline
- [ ] Plan resource allocation

---

## 🔄 **Update Diagram**

### **Saat Menambah Fitur Baru**
1. Update file `.mmd` dengan class/relationship baru
2. Update dokumentasi `.md` dengan penjelasan
3. Re-generate visualization jika diperlukan
4. Update README ini jika ada perubahan struktur

### **Version Control**
- Gunakan semantic versioning untuk dokumentasi
- Tag major changes dengan release notes
- Maintain backward compatibility notes

---

## 📞 **Support**

Untuk pertanyaan atau update diagram:
- **Email**: spydersonics@gmail.com
- **GitHub Issues**: Create issue di repository
- **Documentation**: Lihat folder `docs/` untuk detail lainnya

---

**© 2025 EduPro Development Team**
