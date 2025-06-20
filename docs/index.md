# 📚 EduPro System Documentation Index

## 🎯 **Class Diagram Documentation**

### **📖 Dokumentasi Utama**
- **[CLASS_DIAGRAM_EDUPRO_2025.md](CLASS_DIAGRAM_EDUPRO_2025.md)** - Dokumentasi lengkap class diagram sistem EduPro
- **[README_CLASS_DIAGRAM.md](README_CLASS_DIAGRAM.md)** - Panduan penggunaan dan tools untuk class diagram

### **🎨 File Diagram**
- **[class_diagram_edupro.mmd](class_diagram_edupro.mmd)** - Class diagram dalam format Mermaid
- **[class_diagram_edupro.puml](class_diagram_edupro.puml)** - Class diagram dalam format PlantUML

---

## 🏗️ **Arsitektur Sistem EduPro**

### **Layer Architecture (6 Layers)**
1. **Entity Layer** - Database models dan entities
2. **Machine Learning Layer** - C4.5 Decision Tree model
3. **Service Layer** - API routers dan business logic
4. **Application Layer** - FastAPI main application
5. **Frontend Layer** - UI components dan services
6. **Database Layer** - Session management

### **Total Classes: 17**
- **Entity Models**: 6 classes
- **ML Components**: 1 class
- **API Services**: 6 classes
- **Application**: 1 class
- **Frontend**: 4 classes
- **Database**: 1 class

---

## 🔗 **Quick Links**

### **Visualization Tools**
- **[Mermaid Live Editor](https://mermaid.live/)** - Render Mermaid diagrams online
- **[PlantUML Server](http://www.plantuml.com/plantuml/uml/)** - Render PlantUML diagrams online
- **GitHub** - Automatic rendering of .mmd files

### **Development Resources**
- **Backend**: FastAPI + PostgreSQL + SQLAlchemy
- **Frontend**: HTML5 + JavaScript + Kendo UI + D3.js
- **ML**: Scikit-learn + C4.5 Decision Tree
- **Auth**: JWT Bearer Token
- **Deploy**: Docker Compose

---

## 📊 **System Overview**

### **Core Features**
✅ **Student Management** - CRUD operations untuk data siswa  
✅ **Academic Tracking** - Nilai raport, presensi, penghasilan orang tua  
✅ **ML Predictions** - Prediksi prestasi menggunakan C4.5 algorithm  
✅ **Data Visualization** - Interactive charts dan decision tree  
✅ **Excel Integration** - Import/export data dalam format Excel  
✅ **Authentication** - JWT-based dengan role management  
✅ **Responsive UI** - Mobile-friendly interface  

### **Key Relationships**
- **Siswa** 1:N **NilaiRaport** (Satu siswa memiliki banyak nilai)
- **Siswa** 1:N **PenghasilanOrtu** (Satu siswa memiliki data penghasilan)
- **Siswa** 1:N **Presensi** (Satu siswa memiliki data kehadiran)
- **Siswa** 1:N **Prestasi** (Satu siswa memiliki prediksi prestasi)

---

## 🛠️ **How to Use**

### **1. View Documentation**
```bash
# Baca dokumentasi lengkap
cat docs/CLASS_DIAGRAM_EDUPRO_2025.md

# Buka dengan editor
code docs/CLASS_DIAGRAM_EDUPRO_2025.md
```

### **2. Render Diagrams**
```bash
# Mermaid diagram
cat docs/class_diagram_edupro.mmd

# PlantUML diagram  
cat docs/class_diagram_edupro.puml
```

### **3. Generate Images**
```bash
# Install Mermaid CLI
npm install -g @mermaid-js/mermaid-cli

# Generate PNG from Mermaid
mmdc -i docs/class_diagram_edupro.mmd -o docs/class_diagram_edupro.png

# Generate SVG from Mermaid
mmdc -i docs/class_diagram_edupro.mmd -o docs/class_diagram_edupro.svg
```

---

## 📅 **Version History**

- **v2.0.0** (2025-06-19) - Complete class diagram dengan 17 classes
- **v1.0.0** (2025-06-01) - Initial system architecture

---

## 📞 **Contact & Support**

**Developer**: EduPro Development Team  
**Email**: spydersonics@gmail.com  
**Repository**: GitHub - prestasi-siswa  
**Documentation**: docs/ folder  

---

**© 2025 EduPro System - Class Diagram Documentation**
