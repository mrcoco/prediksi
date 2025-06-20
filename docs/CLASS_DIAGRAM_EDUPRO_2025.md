# 🎓 CLASS DIAGRAM SISTEM EDUPRO - DOKUMENTASI LENGKAP

**Tanggal**: 19 Juni 2025  
**Versi**: 2.0.0  
**Sistem**: EduPro - Sistem Prediksi Prestasi Akademik Siswa  
**Teknologi**: FastAPI + PostgreSQL + JavaScript + Machine Learning

---

## 📋 **OVERVIEW SISTEM**

Sistem EduPro adalah aplikasi web berbasis machine learning untuk prediksi prestasi akademik siswa menggunakan algoritma C4.5 Decision Tree. Sistem ini mengintegrasikan data siswa, nilai raport, presensi, dan penghasilan orang tua untuk menghasilkan prediksi prestasi yang akurat.

### **🏗️ Arsitektur Sistem**
- **Backend**: FastAPI (Python) dengan PostgreSQL
- **Frontend**: HTML5 + JavaScript + Kendo UI + D3.js
- **Machine Learning**: Scikit-learn dengan algoritma C4.5
- **Authentication**: JWT Bearer Token
- **Containerization**: Docker Compose

---

## 🗂️ **STRUKTUR CLASS DIAGRAM**

### **1. ENTITY LAYER (Database Models)**

#### **📚 Siswa (Main Entity)**
```python
class Siswa:
    # Primary Key
    +int id
    
    # Student Information
    +string nama                # Nama lengkap siswa
    +string nis                 # Nomor Induk Siswa (unique)
    +string jenis_kelamin       # L/P
    +string kelas              # Kelas siswa
    +datetime tanggal_lahir    # Tanggal lahir
    +text alamat               # Alamat lengkap
    
    # Audit Fields
    +datetime created_at       # Timestamp pembuatan
    +datetime updated_at       # Timestamp update terakhir
```

#### **📊 NilaiRaport (Academic Scores)**
```python
class NilaiRaport:
    # Primary Key & Foreign Key
    +int id
    +int siswa_id              # FK to Siswa
    
    # Academic Period
    +string semester           # 1/2
    +string tahun_ajaran       # Format: "2023/2024"
    
    # Subject Scores (0-100)
    +float matematika
    +float bahasa_indonesia
    +float bahasa_inggris
    +float bahasa_jawa
    +float ipa
    +float agama
    +float pjok
    +float pkn
    +float sejarah
    +float seni
    +float dasar_kejuruan
    
    # Calculated Field
    +float rata_rata           # Auto-calculated average
    
    # Audit Fields
    +datetime created_at
    +datetime updated_at
```

#### **💰 PenghasilanOrtu (Family Income)**
```python
class PenghasilanOrtu:
    # Primary Key & Foreign Key
    +int id
    +int siswa_id              # FK to Siswa
    
    # Income Information
    +float penghasilan_ayah    # Father's income
    +float penghasilan_ibu     # Mother's income
    +string pekerjaan_ayah     # Father's job
    +string pekerjaan_ibu      # Mother's job
    +string pendidikan_ayah    # Father's education
    +string pendidikan_ibu     # Mother's education
    
    # Calculated Fields
    +float total_penghasilan   # Sum of both incomes
    +string kategori_penghasilan # Rendah/Sedang/Tinggi
    
    # Audit Fields
    +datetime created_at
    +datetime updated_at
```

---

## 🔗 **RELATIONSHIP MATRIX**

### **Entity Relationships**
| Parent | Child | Relationship | Description |
|--------|-------|--------------|-------------|
| Siswa | NilaiRaport | 1:N | Satu siswa memiliki banyak nilai raport |
| Siswa | PenghasilanOrtu | 1:N | Satu siswa memiliki banyak data penghasilan |
| Siswa | Presensi | 1:N | Satu siswa memiliki banyak data presensi |
| Siswa | Prestasi | 1:N | Satu siswa memiliki banyak prediksi prestasi |

---

**© 2025 EduPro Development Team**  
**Dokumentasi Class Diagram v2.0.0**

### **2. MACHINE LEARNING LAYER**

#### **�� C45Model (Decision Tree Classifier)**
```python
class C45Model:
    # Private Attributes
    -DecisionTreeClassifier model    # Scikit-learn model
    -List<string> features          # Feature columns
    -string target                  # Target column
    -bool trained                   # Training status
    -string tree_visualization      # Tree image path
    -dict confusion_matrix          # Confusion matrix data
    -dict model_metrics            # Performance metrics
    -List<string> class_labels     # Class labels
    -datetime last_trained         # Last training timestamp
    
    # Public Methods
    +prepare_data(db: Session) DataFrame
    +train_model(db: Session) dict
    +predict_single(data: dict) dict
    +predict_batch(data: List) List
    +get_model_metrics() dict
    +visualize_tree() string
    +export_model() bytes
    +load_model(model_data: bytes) bool
    +get_feature_importance() dict
    +evaluate_model(X_test, y_test) dict
```

---

### **3. SERVICE LAYER (API Routes/Controllers)**

#### **👥 SiswaRouter (Student Management)**
```python
class SiswaRouter:
    +APIRouter router
    
    # File Operations
    +upload_siswa_excel(file, db, user) dict
    +export_siswa_excel(db, user) StreamingResponse
    
    # CRUD Operations
    +create_siswa(siswa, db, user) SiswaResponse
    +get_siswa(siswa_id, db, user) SiswaResponse
    +get_all_siswa(db, user) List<SiswaResponse>
    +update_siswa(siswa_id, siswa, db, user) SiswaResponse
    +delete_siswa(siswa_id, db, user) dict
```

#### **🔮 PrediksiRouter (Machine Learning Operations)**
```python
class PrediksiRouter:
    +APIRouter router
    
    # ML Operations
    +train_model(db, user) dict
    +predict_single(request, db, user) PrediksiResponse
    +predict_batch(requests, db, user) List<PrediksiResponse>
    
    # Analytics & Visualization
    +get_model_evaluation(db, user) dict
    +get_feature_statistics(db, user) dict
    +get_decision_tree_visualization(db, user) FileResponse
    +export_batch_results_excel(db, user) StreamingResponse
```

#### **🔐 AuthRouter (Authentication & Authorization)**
```python
class AuthRouter:
    +APIRouter router
    +OAuth2PasswordBearer oauth2_scheme
    +CryptContext pwd_context
    
    # Authentication
    +login(form_data, db) LoginResponse
    +refresh_token(current_user) Token
    +register(user, db) UserResponse
    
    # User Management
    +get_current_user_profile(current_user) UserResponse
    +update_profile(profile_update, current_user, db) UserResponse
    +get_all_users(current_user, db) List<UserResponse>
    +update_user(user_id, user_update, current_user, db) UserResponse
    +delete_user(user_id, current_user, db) dict
    
    # Utility Methods
    +verify_password(plain_password, hashed_password) bool
    +get_password_hash(password) string
    +create_access_token(data, expires_delta) string
    +get_current_user(token, db) User
```

---

### **4. FRONTEND LAYER**

#### **💻 FrontendApp (Main Frontend Application)**
```javascript
class FrontendApp {
    +string API_URL            // Backend API URL
    +string TOKEN_KEY          // JWT token storage key
    
    +initializeApp()
    +loadDashboardData()
    +setupMenuVisibility()
    +updateHeaderUserInfo()
    +startTokenCountdown()
    +startTokenExpiryChecker()
}
```

#### **🎨 UIComponents (User Interface Components)**
```javascript
class UIComponents {
    // Kendo UI Grids
    +SiswaGrid kendoGrid
    +NilaiGrid kendoGrid
    +PresensiGrid kendoGrid
    +PenghasilanGrid kendoGrid
    
    // Forms & Navigation
    +PrediksiForm kendoForm
    +UserGuide navigation
    
    // Visualizations
    +Dashboard charts
    +DecisionTree visualization
    +ConfusionMatrix display
    +FeatureStatistics charts
    
    // System Components
    +TokenExpiryChecker timer
    +NotificationSystem kendoNotification
}
```

---

## 🚀 **DESIGN PATTERNS IMPLEMENTED**

### **1. Repository Pattern**
- **DatabaseSession** acts as repository for all entities
- Clean separation between data access and business logic

### **2. Service Layer Pattern**
- **Routers** act as service layer between API and data layer
- Business logic encapsulated in service methods

### **3. Dependency Injection**
- **FastAPI** dependency injection for database sessions
- **Authentication** dependency for protected endpoints

### **4. MVC Pattern (Frontend)**
- **UIComponents** = View layer
- **DataServices** = Controller layer  
- **API responses** = Model layer

### **5. Observer Pattern**
- **Token expiry checker** observes token status
- **Notification system** observes application events

### **6. Factory Pattern**
- **SessionLocal** factory for database sessions
- **Router** factory for API endpoints

---

## 📊 **METRICS & STATISTICS**

### **Code Statistics**
- **Total Classes**: 17 classes
- **Entity Models**: 6 classes
- **Service Routers**: 6 classes
- **Frontend Services**: 4 classes
- **Support Classes**: 1 class

### **Relationship Statistics**
- **Entity Relationships**: 4 one-to-many relationships
- **Service Dependencies**: 25+ dependency relationships
- **Frontend Integrations**: 12+ integration points

### **Feature Coverage**
- **CRUD Operations**: 100% coverage for all entities
- **Authentication**: JWT-based with role management
- **File Operations**: Excel import/export for all entities
- **Machine Learning**: Complete C4.5 implementation
- **Visualization**: D3.js charts and decision tree
- **Responsive Design**: Mobile-friendly UI

---

## 📝 **CONCLUSION**

Class diagram sistem EduPro menunjukkan arsitektur yang **well-structured** dan **scalable** dengan:

✅ **Clear Separation of Concerns** - Setiap layer memiliki tanggung jawab yang jelas  
✅ **Proper Relationships** - Entity relationships yang normalized dan efficient  
✅ **Service-Oriented Architecture** - Modular services dengan clear interfaces  
✅ **Security Implementation** - JWT authentication dengan role-based access  
✅ **Machine Learning Integration** - Complete ML pipeline dengan C4.5 algorithm  
✅ **Modern Frontend** - Responsive UI dengan interactive visualizations  
✅ **Comprehensive Features** - CRUD, import/export, analytics, dan predictions  

Sistem ini siap untuk **production deployment** dengan arsitektur yang **maintainable** dan **extensible** untuk pengembangan fitur masa depan.

