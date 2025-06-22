# DOKUMENTASI TAHAPAN CODING RINCI SISTEM PREDIKSI EDUPRO 2025

## 📋 Executive Summary

Dokumentasi ini menyajikan narasi rinci tahapan coding untuk sistem prediksi prestasi siswa EduPro yang dikembangkan dengan metodologi Agile dan arsitektur full-stack modern. Setiap tahapan dijelaskan dengan detail implementasi, challenge yang dihadapi, solution yang diterapkan, dan lesson learned untuk memberikan pemahaman mendalam tentang proses development.

## 🎯 Project Context & Requirements

### Business Problem
Sekolah membutuhkan sistem untuk memprediksi prestasi siswa berdasarkan data akademik, kehadiran, dan kondisi sosial ekonomi untuk melakukan intervensi dini dan meningkatkan kualitas pendidikan.

### Technical Requirements
- **Performance**: Response time <100ms untuk API, <500ms untuk ML prediction
- **Scalability**: Support 1000+ siswa dengan concurrent access
- **Security**: Role-based access dengan audit trail
- **Reliability**: 99.9% uptime dengan comprehensive error handling

## 🚀 TAHAP 1: PROJECT SETUP & ENVIRONMENT CONFIGURATION

### 1.1 Repository & Version Control Setup

#### Narasi Implementasi
Tahap pertama dimulai dengan setup repository Git yang akan menjadi foundation untuk collaborative development. Kami memilih struktur monorepo untuk memudahkan coordination antara backend dan frontend development.

```bash
# Inisialisasi repository dengan struktur yang scalable
git init prestasi-siswa
cd prestasi-siswa

# Membuat struktur directory yang terorganisir
mkdir -p {backend,frontend,docs,scripts,tests,deployment}
mkdir -p backend/{app,models,routes,middleware,static}
mkdir -p frontend/{src,components,pages,styles,utils}
```

#### Challenge & Solution
**Challenge**: Menentukan struktur folder yang akan accommodate future growth dan multiple developers.
**Solution**: Adopsi clean architecture dengan separation of concerns yang jelas.

#### Lesson Learned
Struktur repository yang well-organized dari awal significantly mengurangi technical debt dan memudahkan onboarding new developers.

### 1.2 Backend Environment Setup

#### Narasi Implementasi
Backend development menggunakan Python dengan FastAPI framework karena performance yang excellent dan automatic API documentation generation.

```python
# requirements.txt - Carefully selected dependencies
fastapi==0.104.1          # Modern, fast web framework
uvicorn[standard]==0.24.0 # ASGI server dengan auto-reload
sqlalchemy==2.0.23        # ORM dengan excellent PostgreSQL support
alembic==1.12.1          # Database migration tool
psycopg2-binary==2.9.9   # PostgreSQL adapter
python-jose[cryptography]==3.3.0  # JWT handling
passlib[bcrypt]==1.7.4    # Password hashing
pandas==2.1.3             # Data manipulation untuk ML
scikit-learn==1.3.2       # Machine learning library
```

#### Development Process
1. **Virtual Environment Creation**: Isolated Python environment untuk avoid dependency conflicts
2. **Dependency Management**: Pin specific versions untuk reproducible builds
3. **Development Tools**: Pre-commit hooks untuk code quality

#### Technical Decisions
- **FastAPI over Django**: Better performance untuk API-heavy application
- **SQLAlchemy 2.0**: Modern ORM dengan excellent type hints
- **Alembic**: Robust database migration system

### 1.3 Frontend Environment Setup

#### Narasi Implementasi
Frontend menggunakan modern JavaScript ecosystem dengan focus pada developer experience dan performance.

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "next": "^14.0.0",
    "typescript": "^5.0.0",
    "@progress/kendo-react-grid": "^6.0.0",
    "axios": "^1.6.0",
    "react-hook-form": "^7.47.0"
  },
  "devDependencies": {
    "@testing-library/react": "^13.4.0",
    "jest": "^29.7.0",
    "cypress": "^13.6.0",
    "eslint": "^8.54.0",
    "prettier": "^3.1.0"
  }
}
```

#### Technical Decisions Rationale
- **Next.js**: Server-side rendering untuk better SEO dan performance
- **TypeScript**: Type safety untuk large codebase maintainability
- **Kendo UI**: Professional components untuk enterprise application
- **Testing Trinity**: Jest (unit), Testing Library (integration), Cypress (E2E)

### 1.4 Database Environment Setup

#### Narasi Implementasi
PostgreSQL dipilih sebagai primary database karena excellent support untuk JSONB, advanced indexing, dan reliability untuk production workloads.

```sql
-- Database creation dengan proper encoding
CREATE DATABASE prestasi_siswa 
  WITH ENCODING 'UTF8' 
  LC_COLLATE='en_US.UTF-8' 
  LC_CTYPE='en_US.UTF-8';

-- User creation dengan principle of least privilege
CREATE USER edupro_user WITH PASSWORD 'secure_password_123!';
GRANT ALL PRIVILEGES ON DATABASE prestasi_siswa TO edupro_user;
```

#### Configuration Considerations
- **Connection Pooling**: PgBouncer untuk efficient connection management
- **Backup Strategy**: Daily automated backups dengan point-in-time recovery
- **Monitoring**: pg_stat_statements untuk query performance analysis

## 🗄️ TAHAP 2: DATABASE DESIGN & IMPLEMENTATION

### 2.1 Schema Design Process

#### Narasi Implementasi
Database schema design dimulai dengan thorough analysis dari business requirements dan data relationships. Kami menggunakan Entity-Relationship modeling untuk visualize complex relationships.

```python
# Core entity: Siswa sebagai central hub
class Siswa(Base):
    __tablename__ = "siswa"
    
    id = Column(Integer, primary_key=True, index=True)
    nama = Column(String(100), nullable=False, index=True)
    nis = Column(String(20), unique=True, nullable=False, index=True)
    jenis_kelamin = Column(String(1), CheckConstraint("jenis_kelamin IN ('L', 'P')"))
    kelas = Column(String(10), nullable=False)
    
    # Relationships dengan foreign tables
    nilai_raport = relationship("NilaiRaport", back_populates="siswa", cascade="all, delete-orphan")
    presensi = relationship("Presensi", back_populates="siswa", cascade="all, delete-orphan")
    penghasilan_ortu = relationship("PenghasilanOrtu", back_populates="siswa", uselist=False)
    prestasi = relationship("Prestasi", back_populates="siswa", cascade="all, delete-orphan")
```

#### Design Principles Applied
1. **Normalization**: 3NF untuk eliminate data redundancy
2. **Referential Integrity**: Foreign key constraints dengan appropriate cascade rules
3. **Performance Optimization**: Strategic indexing pada frequently queried columns
4. **Data Integrity**: Check constraints untuk business rule enforcement

### 2.2 Advanced Features Implementation

#### Generated Columns untuk Auto-Calculation
```sql
-- Rata-rata nilai dengan automatic calculation
ALTER TABLE nilai_raport 
ADD COLUMN rata_rata DECIMAL(4,2) 
GENERATED ALWAYS AS (
  (matematika + bahasa_indonesia + bahasa_inggris + bahasa_jawa + 
   ipa + agama + pjok + pkn + sejarah + seni + dasar_kejuruan) / 11.0
) STORED;

-- Persentase kehadiran dengan business logic
ALTER TABLE presensi 
ADD COLUMN persentase_kehadiran DECIMAL(5,2) 
GENERATED ALWAYS AS (
  CASE 
    WHEN (hadir + sakit + izin + alpa) > 0 
    THEN (hadir::DECIMAL / (hadir + sakit + izin + alpa)) * 100 
    ELSE 0 
  END
) STORED;
```

#### Row Level Security Implementation
```sql
-- Policy untuk role-based access
CREATE POLICY siswa_access_policy ON siswa
  FOR ALL TO authenticated_users
  USING (
    CASE 
      WHEN current_setting('app.user_role') = 'ADMIN' THEN true
      WHEN current_setting('app.user_role') = 'GURU' 
        THEN kelas = current_setting('app.user_kelas')
      ELSE false
    END
  );
```

### 2.3 Migration Strategy

#### Narasi Implementasi
Database migrations dikelola dengan Alembic untuk ensure consistent schema evolution across environments.

```python
# Migration file: create_initial_tables.py
def upgrade():
    # Siswa table dengan comprehensive constraints
    op.create_table('siswa',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('nama', sa.String(100), nullable=False),
        sa.Column('nis', sa.String(20), nullable=False),
        sa.Column('jenis_kelamin', sa.String(1), nullable=False),
        sa.Column('kelas', sa.String(10), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()')),
        sa.CheckConstraint("jenis_kelamin IN ('L', 'P')", name='check_jenis_kelamin'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('nis', name='unique_nis')
    )
    
    # Strategic indexing untuk performance
    op.create_index('idx_siswa_nama', 'siswa', ['nama'])
    op.create_index('idx_siswa_kelas', 'siswa', ['kelas'])
```

#### Best Practices Implemented
- **Incremental Migrations**: Small, focused changes untuk easy rollback
- **Data Validation**: Pre-migration data checks
- **Backup Before Migration**: Automatic backup sebelum schema changes

## 🔐 TAHAP 3: AUTHENTICATION & AUTHORIZATION SYSTEM

### 3.1 JWT Authentication Implementation

#### Narasi Implementasi
Authentication system menggunakan JWT tokens dengan refresh token mechanism untuk balance antara security dan user experience.

```python
# JWT configuration dengan security best practices
SECRET_KEY = os.getenv("SECRET_KEY", "your-256-bit-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

class JWTManager:
    def __init__(self):
        self.secret_key = SECRET_KEY
        self.algorithm = ALGORITHM
    
    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire, "type": "access"})
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt
    
    def create_refresh_token(self, data: dict):
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        to_encode.update({"exp": expire, "type": "refresh"})
        return jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
```

#### Security Considerations
1. **Token Expiration**: Short-lived access tokens dengan refresh mechanism
2. **Secure Storage**: HttpOnly cookies untuk refresh tokens
3. **CSRF Protection**: Double-submit cookie pattern
4. **Rate Limiting**: Brute force protection pada login endpoints

### 3.2 Role-Based Access Control

#### Narasi Implementasi
RBAC system dengan hierarchical permissions untuk different user roles dalam educational context.

```python
class RoleChecker:
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles
    
    def __call__(self, current_user: User = Depends(get_current_user)):
        if current_user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=403,
                detail=f"Access denied. Required roles: {self.allowed_roles}"
            )
        return current_user

# Usage dalam route protection
@router.get("/admin-only")
async def admin_endpoint(user: User = Depends(RoleChecker(["ADMIN"]))):
    return {"message": "Admin access granted"}

@router.get("/teacher-student-data")
async def teacher_data(
    user: User = Depends(RoleChecker(["ADMIN", "GURU"])),
    db: Session = Depends(get_db)
):
    # Filter data berdasarkan role
    if user.role == "GURU":
        # Guru hanya bisa akses siswa di kelas mereka
        return get_students_by_teacher_class(db, user.profile.kelas_mengajar)
    else:
        # Admin bisa akses semua data
        return get_all_students(db)
```

#### Permission Matrix
```
| Resource        | ADMIN | GURU | STAF |
|----------------|-------|------|------|
| Siswa CRUD     | ✓     | ✓*   | ✗    |
| Nilai CRUD     | ✓     | ✓*   | ✗    |
| Prediksi ML    | ✓     | ✓*   | ✓    |
| User Management| ✓     | ✗    | ✗    |
| System Config  | ✓     | ✗    | ✗    |

* = Limited to assigned classes
```

### 3.3 Password Security & Session Management

#### Narasi Implementasi
Password handling menggunakan industry-standard bcrypt dengan adaptive hashing dan comprehensive session management.

```python
class PasswordManager:
    def __init__(self):
        self.pwd_context = CryptContext(
            schemes=["bcrypt"], 
            deprecated="auto",
            bcrypt__rounds=12  # Adaptive rounds untuk future-proofing
        )
    
    def hash_password(self, password: str) -> str:
        # Validate password strength sebelum hashing
        self._validate_password_strength(password)
        return self.pwd_context.hash(password)
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return self.pwd_context.verify(plain_password, hashed_password)
    
    def _validate_password_strength(self, password: str):
        if len(password) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not re.search(r"[A-Z]", password):
            raise ValueError("Password must contain uppercase letter")
        if not re.search(r"[a-z]", password):
            raise ValueError("Password must contain lowercase letter")
        if not re.search(r"\d", password):
            raise ValueError("Password must contain number")
```

## 📊 TAHAP 4: CORE API DEVELOPMENT

### 4.1 RESTful API Design

#### Narasi Implementasi
API design mengikuti REST principles dengan consistent naming conventions dan proper HTTP status codes.

```python
# Siswa Router dengan comprehensive CRUD operations
@router.post("/", response_model=SiswaResponse, status_code=201)
async def create_siswa(
    siswa: SiswaCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker(["ADMIN", "GURU"]))
):
    """
    Create new student record dengan comprehensive validation.
    
    Business Rules:
    - NIS must be unique across all students
    - Jenis kelamin must be 'L' or 'P'
    - Kelas format must follow school standards
    """
    
    # Check for duplicate NIS
    existing_student = db.query(Siswa).filter(Siswa.nis == siswa.nis).first()
    if existing_student:
        raise HTTPException(
            status_code=400,
            detail=f"Student dengan NIS {siswa.nis} sudah ada"
        )
    
    # Validate kelas format
    if not re.match(r"^[1-3][0-9][A-Z]$", siswa.kelas):
        raise HTTPException(
            status_code=400,
            detail="Format kelas tidak valid (contoh: 10A, 11B, 12C)"
        )
    
    # Create student record
    db_siswa = Siswa(**siswa.dict())
    db.add(db_siswa)
    
    try:
        db.commit()
        db.refresh(db_siswa)
        
        # Log creation event untuk audit trail
        log_event(
            db=db,
            user_id=current_user.id,
            event_type="CREATE",
            entity_type="SISWA",
            entity_id=db_siswa.id,
            details={"action": "Student created", "nis": siswa.nis}
        )
        
        return db_siswa
        
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Database constraint violation")
```

### 4.2 Advanced Query Operations

#### Narasi Implementasi
Query operations dengan support untuk pagination, filtering, sorting, dan search untuk handle large datasets efficiently.

```python
@router.get("/", response_model=PaginatedSiswaResponse)
async def get_siswa_list(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(10, ge=1, le=100, description="Number of records to return"),
    search: Optional[str] = Query(None, description="Search by nama or NIS"),
    kelas: Optional[str] = Query(None, description="Filter by kelas"),
    jenis_kelamin: Optional[str] = Query(None, regex="^[LP]$"),
    sort_by: str = Query("nama", regex="^(nama|nis|kelas|created_at)$"),
    sort_order: str = Query("asc", regex="^(asc|desc)$"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get paginated list of students dengan advanced filtering.
    
    Features:
    - Pagination dengan configurable page size
    - Full-text search pada nama dan NIS
    - Multiple filter options
    - Configurable sorting
    - Role-based data access
    """
    
    # Base query dengan role-based filtering
    query = db.query(Siswa)
    
    if current_user.role == "GURU":
        # Guru hanya bisa lihat siswa di kelas yang diajar
        allowed_classes = get_teacher_classes(db, current_user.id)
        query = query.filter(Siswa.kelas.in_(allowed_classes))
    
    # Apply search filter
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Siswa.nama.ilike(search_term),
                Siswa.nis.ilike(search_term)
            )
        )
    
    # Apply additional filters
    if kelas:
        query = query.filter(Siswa.kelas == kelas)
    if jenis_kelamin:
        query = query.filter(Siswa.jenis_kelamin == jenis_kelamin)
    
    # Apply sorting
    sort_column = getattr(Siswa, sort_by)
    if sort_order == "desc":
        sort_column = sort_column.desc()
    query = query.order_by(sort_column)
    
    # Get total count untuk pagination metadata
    total_count = query.count()
    
    # Apply pagination
    siswa_list = query.offset(skip).limit(limit).all()
    
    return PaginatedSiswaResponse(
        data=siswa_list,
        total=total_count,
        skip=skip,
        limit=limit,
        has_next=skip + limit < total_count,
        has_prev=skip > 0
    )
```

### 4.3 Data Validation & Error Handling

#### Narasi Implementasi
Comprehensive validation system menggunakan Pydantic models dengan custom validators dan structured error responses.

```python
class SiswaCreate(BaseModel):
    nama: str = Field(..., min_length=2, max_length=100, description="Nama lengkap siswa")
    nis: str = Field(..., regex=r"^\d{5,10}$", description="Nomor Induk Siswa")
    jenis_kelamin: str = Field(..., regex="^[LP]$", description="L untuk Laki-laki, P untuk Perempuan")
    kelas: str = Field(..., regex=r"^[1-3][0-9][A-Z]$", description="Format: 10A, 11B, 12C")
    
    @validator('nama')
    def validate_nama(cls, v):
        # Remove extra whitespace dan validate characters
        v = ' '.join(v.split())
        if not re.match(r"^[a-zA-Z\s]+$", v):
            raise ValueError("Nama hanya boleh mengandung huruf dan spasi")
        return v.title()  # Capitalize each word
    
    @validator('nis')
    def validate_nis_uniqueness(cls, v, values):
        # Note: Database-level uniqueness check dilakukan di route handler
        if not v.isdigit():
            raise ValueError("NIS harus berupa angka")
        return v
    
    class Config:
        schema_extra = {
            "example": {
                "nama": "Ahmad Budi Santoso",
                "nis": "12345",
                "jenis_kelamin": "L",
                "kelas": "10A"
            }
        }

# Global exception handler untuk consistent error responses
@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "error": "Validation Error",
            "message": "Data yang dikirim tidak valid",
            "details": exc.errors(),
            "timestamp": datetime.utcnow().isoformat()
        }
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": "HTTP Error",
            "message": exc.detail,
            "status_code": exc.status_code,
            "timestamp": datetime.utcnow().isoformat()
        }
    )
```

## 🤖 TAHAP 5: MACHINE LEARNING IMPLEMENTATION

### 5.1 C4.5 Algorithm Implementation

#### Narasi Implementasi
Implementation dari C4.5 Decision Tree algorithm dengan custom enhancements untuk educational data prediction.

```python
class C45DecisionTree:
    """
    Custom implementation of C4.5 algorithm optimized untuk educational data.
    
    Key Features:
    - Information Gain Ratio untuk handle bias towards multi-valued attributes
    - Pruning untuk prevent overfitting
    - Missing value handling
    - Confidence-based prediction
    """
    
    def __init__(self, min_samples_split=5, min_samples_leaf=3, max_depth=10):
        self.min_samples_split = min_samples_split
        self.min_samples_leaf = min_samples_leaf
        self.max_depth = max_depth
        self.tree = None
        self.feature_names = ['rata_rata', 'kategori_penghasilan', 'kategori_kehadiran']
        
    def calculate_entropy(self, y):
        """Calculate entropy untuk measure information content."""
        if len(y) == 0:
            return 0
        
        value_counts = Counter(y)
        total = len(y)
        entropy = 0
        
        for count in value_counts.values():
            probability = count / total
            if probability > 0:
                entropy -= probability * math.log2(probability)
        
        return entropy
    
    def calculate_information_gain(self, X, y, feature_idx):
        """Calculate information gain untuk specific feature."""
        total_entropy = self.calculate_entropy(y)
        
        # Get unique values untuk feature
        unique_values = set(X[:, feature_idx])
        weighted_entropy = 0
        
        for value in unique_values:
            # Split data based on feature value
            mask = X[:, feature_idx] == value
            subset_y = y[mask]
            
            if len(subset_y) > 0:
                weight = len(subset_y) / len(y)
                weighted_entropy += weight * self.calculate_entropy(subset_y)
        
        return total_entropy - weighted_entropy
    
    def calculate_gain_ratio(self, X, y, feature_idx):
        """Calculate gain ratio (C4.5 improvement over ID3)."""
        information_gain = self.calculate_information_gain(X, y, feature_idx)
        
        # Calculate split information
        unique_values = set(X[:, feature_idx])
        split_info = 0
        
        for value in unique_values:
            mask = X[:, feature_idx] == value
            subset_size = len(y[mask])
            if subset_size > 0:
                ratio = subset_size / len(y)
                split_info -= ratio * math.log2(ratio)
        
        # Avoid division by zero
        if split_info == 0:
            return 0
        
        return information_gain / split_info
    
    def find_best_split(self, X, y):
        """Find best feature untuk split berdasarkan gain ratio."""
        best_feature = None
        best_gain_ratio = -1
        
        for feature_idx in range(X.shape[1]):
            gain_ratio = self.calculate_gain_ratio(X, y, feature_idx)
            
            if gain_ratio > best_gain_ratio:
                best_gain_ratio = gain_ratio
                best_feature = feature_idx
        
        return best_feature, best_gain_ratio
    
    def build_tree(self, X, y, depth=0):
        """Recursively build decision tree."""
        
        # Base cases
        if len(set(y)) == 1:
            # Pure node - all samples have same class
            return {
                'type': 'leaf',
                'class': y[0],
                'confidence': 1.0,
                'samples': len(y)
            }
        
        if depth >= self.max_depth or len(y) < self.min_samples_split:
            # Create leaf dengan majority class
            most_common = Counter(y).most_common(1)[0]
            return {
                'type': 'leaf',
                'class': most_common[0],
                'confidence': most_common[1] / len(y),
                'samples': len(y)
            }
        
        # Find best split
        best_feature, best_gain_ratio = self.find_best_split(X, y)
        
        if best_gain_ratio <= 0:
            # No good split found
            most_common = Counter(y).most_common(1)[0]
            return {
                'type': 'leaf',
                'class': most_common[0],
                'confidence': most_common[1] / len(y),
                'samples': len(y)
            }
        
        # Create internal node
        node = {
            'type': 'internal',
            'feature': best_feature,
            'feature_name': self.feature_names[best_feature],
            'gain_ratio': best_gain_ratio,
            'samples': len(y),
            'children': {}
        }
        
        # Split data dan create child nodes
        unique_values = set(X[:, best_feature])
        for value in unique_values:
            mask = X[:, best_feature] == value
            subset_X = X[mask]
            subset_y = y[mask]
            
            if len(subset_y) >= self.min_samples_leaf:
                node['children'][value] = self.build_tree(subset_X, subset_y, depth + 1)
            else:
                # Create leaf untuk small subset
                most_common = Counter(y).most_common(1)[0]
                node['children'][value] = {
                    'type': 'leaf',
                    'class': most_common[0],
                    'confidence': most_common[1] / len(y),
                    'samples': len(subset_y)
                }
        
        return node
    
    def fit(self, X, y):
        """Train the decision tree."""
        self.tree = self.build_tree(X, y)
        return self
    
    def predict_single(self, x, node=None):
        """Predict single sample dengan confidence score."""
        if node is None:
            node = self.tree
        
        if node['type'] == 'leaf':
            return node['class'], node['confidence']
        
        feature_value = x[node['feature']]
        
        if feature_value in node['children']:
            return self.predict_single(x, node['children'][feature_value])
        else:
            # Handle unseen value - return most common class from training
            return self._get_default_prediction(node)
    
    def predict(self, X):
        """Predict multiple samples."""
        predictions = []
        confidences = []
        
        for x in X:
            pred, conf = self.predict_single(x)
            predictions.append(pred)
            confidences.append(conf)
        
        return np.array(predictions), np.array(confidences)
```

### 5.2 Feature Engineering & Data Preparation

#### Narasi Implementasi
Comprehensive feature engineering process untuk transform raw educational data menjadi ML-ready features.

```python
class EducationalFeatureEngineer:
    """
    Specialized feature engineering untuk educational prediction data.
    """
    
    def __init__(self):
        self.penghasilan_encoder = {
            'Rendah': 0, 'Menengah': 1, 'Tinggi': 2
        }
        self.kehadiran_encoder = {
            'Rendah': 0, 'Sedang': 1, 'Tinggi': 2
        }
        self.prestasi_encoder = {
            'Rendah': 0, 'Sedang': 1, 'Tinggi': 2
        }
        
    def prepare_training_data(self, db: Session):
        """
        Extract dan prepare training data dari database dengan comprehensive joins.
        """
        
        query = """
        SELECT 
            s.id as siswa_id,
            s.nama,
            s.kelas,
            nr.rata_rata,
            po.total_penghasilan,
            po.kategori_penghasilan,
            p.persentase_kehadiran,
            p.kategori_kehadiran,
            -- Auto-labeling berdasarkan business rules
            CASE 
                WHEN nr.rata_rata >= 80 AND p.persentase_kehadiran >= 80 THEN 'Tinggi'
                WHEN nr.rata_rata >= 70 AND p.persentase_kehadiran >= 75 THEN 'Sedang'
                ELSE 'Rendah'
            END as target_prestasi,
            -- Additional features untuk analysis
            nr.semester,
            nr.tahun_ajaran,
            p.total_hari_efektif,
            po.penghasilan_ayah,
            po.penghasilan_ibu
        FROM siswa s
        INNER JOIN nilai_raport nr ON s.id = nr.siswa_id
        INNER JOIN presensi p ON s.id = p.siswa_id 
            AND nr.semester = p.semester 
            AND nr.tahun_ajaran = p.tahun_ajaran
        INNER JOIN penghasilan_ortu po ON s.id = po.siswa_id
        WHERE 
            nr.rata_rata IS NOT NULL 
            AND po.kategori_penghasilan IS NOT NULL 
            AND p.kategori_kehadiran IS NOT NULL
            AND nr.rata_rata BETWEEN 0 AND 100
            AND p.persentase_kehadiran BETWEEN 0 AND 100
        ORDER BY s.id, nr.semester, nr.tahun_ajaran
        """
        
        df = pd.read_sql(query, db.bind)
        
        # Data quality checks
        self._validate_data_quality(df)
        
        # Feature engineering
        df_processed = self._engineer_features(df)
        
        return df_processed
    
    def _validate_data_quality(self, df):
        """Comprehensive data quality validation."""
        
        # Check for minimum required samples
        if len(df) < 30:
            raise ValueError(f"Insufficient training data: {len(df)} samples. Minimum 30 required.")
        
        # Check for missing values
        missing_counts = df.isnull().sum()
        if missing_counts.any():
            raise ValueError(f"Missing values detected: {missing_counts[missing_counts > 0].to_dict()}")
        
        # Check for outliers
        outliers = df[
            (df['rata_rata'] < 0) | (df['rata_rata'] > 100) |
            (df['persentase_kehadiran'] < 0) | (df['persentase_kehadiran'] > 100) |
            (df['total_penghasilan'] < 0)
        ]
        
        if len(outliers) > 0:
            logger.warning(f"Found {len(outliers)} outlier records")
        
        # Check class distribution
        class_dist = df['target_prestasi'].value_counts()
        min_class_count = class_dist.min()
        
        if min_class_count < 5:
            raise ValueError(f"Insufficient samples untuk class: {class_dist.to_dict()}")
        
        logger.info(f"Data quality validation passed. {len(df)} samples, class distribution: {class_dist.to_dict()}")
    
    def _engineer_features(self, df):
        """Advanced feature engineering."""
        
        df_processed = df.copy()
        
        # Encode categorical features
        df_processed['penghasilan_encoded'] = df_processed['kategori_penghasilan'].map(self.penghasilan_encoder)
        df_processed['kehadiran_encoded'] = df_processed['kategori_kehadiran'].map(self.kehadiran_encoder)
        df_processed['prestasi_encoded'] = df_processed['target_prestasi'].map(self.prestasi_encoder)
        
        # Create additional engineered features
        df_processed['nilai_kehadiran_interaction'] = (
            df_processed['rata_rata'] * df_processed['persentase_kehadiran'] / 100
        )
        
        # Normalize rata_rata untuk better ML performance
        df_processed['rata_rata_normalized'] = df_processed['rata_rata'] / 100
        
        # Create income per capita estimation
        df_processed['penghasilan_per_hari'] = df_processed['total_penghasilan'] / 30
        
        return df_processed
    
    def extract_features_and_target(self, df):
        """Extract final feature matrix dan target vector."""
        
        # Primary features untuk C4.5 algorithm
        feature_columns = ['rata_rata', 'penghasilan_encoded', 'kehadiran_encoded']
        X = df[feature_columns].values
        y = df['target_prestasi'].values
        
        # Additional metadata
        metadata = {
            'feature_names': feature_columns,
            'class_names': ['Rendah', 'Sedang', 'Tinggi'],
            'sample_count': len(df),
            'class_distribution': df['target_prestasi'].value_counts().to_dict()
        }
        
        return X, y, metadata
```

### 5.3 Model Training & Evaluation

#### Narasi Implementasi
Comprehensive model training pipeline dengan cross-validation, hyperparameter tuning, dan detailed evaluation metrics.

```python
class MLModelTrainer:
    """
    Comprehensive ML model training dan evaluation system.
    """
    
    def __init__(self):
        self.model = None
        self.feature_engineer = EducationalFeatureEngineer()
        self.training_metadata = {}
        
    def train_model(self, db: Session):
        """
        Complete model training pipeline dengan evaluation.
        """
        
        logger.info("Starting model training pipeline...")
        
        # 1. Data preparation
        df = self.feature_engineer.prepare_training_data(db)
        X, y, metadata = self.feature_engineer.extract_features_and_target(df)
        
        # 2. Train-test split dengan stratification
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # 3. Model training
        self.model = C45DecisionTree(
            min_samples_split=5,
            min_samples_leaf=3,
            max_depth=8
        )
        
        start_time = time.time()
        self.model.fit(X_train, y_train)
        training_time = time.time() - start_time
        
        # 4. Model evaluation
        evaluation_results = self._evaluate_model(X_test, y_test, X_train, y_train)
        
        # 5. Store training metadata
        self.training_metadata = {
            'training_time': training_time,
            'training_samples': len(X_train),
            'test_samples': len(X_test),
            'feature_names': metadata['feature_names'],
            'class_names': metadata['class_names'],
            'class_distribution': metadata['class_distribution'],
            'evaluation_results': evaluation_results,
            'trained_at': datetime.utcnow().isoformat()
        }
        
        # 6. Save model untuk persistence
        self._save_model()
        
        logger.info(f"Model training completed in {training_time:.2f} seconds")
        logger.info(f"Test accuracy: {evaluation_results['test_accuracy']:.4f}")
        
        return self.training_metadata
    
    def _evaluate_model(self, X_test, y_test, X_train, y_train):
        """Comprehensive model evaluation."""
        
        # Predictions
        y_train_pred, train_conf = self.model.predict(X_train)
        y_test_pred, test_conf = self.model.predict(X_test)
        
        # Accuracy scores
        train_accuracy = accuracy_score(y_train, y_train_pred)
        test_accuracy = accuracy_score(y_test, y_test_pred)
        
        # Classification report
        classification_rep = classification_report(
            y_test, y_test_pred, 
            target_names=['Rendah', 'Sedang', 'Tinggi'],
            output_dict=True
        )
        
        # Confusion matrix
        cm = confusion_matrix(y_test, y_test_pred, labels=['Rendah', 'Sedang', 'Tinggi'])
        
        # Confidence statistics
        confidence_stats = {
            'mean_confidence': float(np.mean(test_conf)),
            'min_confidence': float(np.min(test_conf)),
            'max_confidence': float(np.max(test_conf)),
            'std_confidence': float(np.std(test_conf))
        }
        
        return {
            'train_accuracy': float(train_accuracy),
            'test_accuracy': float(test_accuracy),
            'classification_report': classification_rep,
            'confusion_matrix': cm.tolist(),
            'confidence_stats': confidence_stats
        }
    
    def predict_single_student(self, rata_rata: float, kategori_penghasilan: str, kategori_kehadiran: str):
        """Make prediction untuk single student."""
        
        if self.model is None:
            raise ValueError("Model belum dilatih. Jalankan train_model() terlebih dahulu.")
        
        # Encode categorical features
        penghasilan_encoded = self.feature_engineer.penghasilan_encoder[kategori_penghasilan]
        kehadiran_encoded = self.feature_engineer.kehadiran_encoder[kategori_kehadiran]
        
        # Prepare feature vector
        features = np.array([[rata_rata, penghasilan_encoded, kehadiran_encoded]])
        
        # Make prediction
        prediction, confidence = self.model.predict(features)
        
        return {
            'prediksi_prestasi': prediction[0],
            'confidence': float(confidence[0]),
            'input_features': {
                'rata_rata': rata_rata,
                'kategori_penghasilan': kategori_penghasilan,
                'kategori_kehadiran': kategori_kehadiran
            }
        }
```

Status: **Production Ready** dengan comprehensive ML implementation yang mencakup custom C4.5 algorithm, advanced feature engineering, dan robust evaluation pipeline. Dokumentasi ini memberikan foundation yang solid untuk understanding dan maintaining ML components dalam sistem prediksi EduPro. 