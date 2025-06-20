# 📊 Dokumentasi Sistem Informasi EduPro 2025

## 🎯 **OVERVIEW SISTEM**

EduPro adalah sistem prediksi prestasi siswa berbasis machine learning dengan algoritma C4.5 Decision Tree. Sistem ini dilengkapi dengan event logging yang komprehensif untuk monitoring, analytics, security, dan audit trail.

---

## 📋 **EVENT TABLE SPECIFICATION**

### **Main Events Table Structure**

```sql
CREATE TABLE events (
    -- Primary Key
    id BIGSERIAL PRIMARY KEY,
    
    -- Event Identification
    event_type VARCHAR(100) NOT NULL,           -- LOGIN_SUCCESS, SISWA_CREATE, ML_PREDICTION
    event_category VARCHAR(50) NOT NULL,        -- AUTH, CRUD, ML, SYSTEM, FILE, SECURITY
    event_name VARCHAR(200) NOT NULL,           -- Human readable event name
    
    -- Timestamp Information
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- User & Session Information
    user_id INTEGER,                            -- FK to users table
    username VARCHAR(100),                      -- Username for quick lookup
    user_role VARCHAR(50),                      -- admin, teacher, student
    session_id VARCHAR(100),                    -- Session identifier
    
    -- Request Information
    ip_address INET,                            -- Client IP address
    user_agent TEXT,                            -- Browser/client info
    request_method VARCHAR(10),                 -- GET, POST, PUT, DELETE
    request_url TEXT,                           -- Full request URL
    request_headers JSONB,                      -- HTTP headers
    request_body JSONB,                         -- Request payload (filtered)
    
    -- Response Information
    response_status INTEGER,                    -- HTTP status code
    response_time_ms INTEGER,                   -- Response time in milliseconds
    response_size_bytes INTEGER,                -- Response size
    
    -- Entity Information (for CRUD operations)
    entity_type VARCHAR(50),                    -- siswa, nilai, presensi, etc.
    entity_id INTEGER,                          -- ID of affected entity
    entity_name VARCHAR(200),                   -- Name/title of entity
    
    -- Event Data
    event_data JSONB,                           -- Structured event data
    previous_values JSONB,                      -- Old values (for updates)
    new_values JSONB,                           -- New values (for creates/updates)
    
    -- Status & Error Information
    event_status VARCHAR(20) DEFAULT 'SUCCESS', -- SUCCESS, FAILED, ERROR, WARNING
    error_message TEXT,                         -- Error description
    error_code VARCHAR(50),                     -- Error code
    
    -- Classification & Search
    tags TEXT[],                                -- Array of tags for categorization
    search_text TEXT,                           -- Full-text search content
    is_sensitive BOOLEAN DEFAULT FALSE,         -- Contains sensitive data
    
    -- System Information
    cpu_usage_percent DECIMAL(5,2),             -- CPU usage at time of event
    memory_usage_mb INTEGER,                    -- Memory usage in MB
    
    -- Retention & Compliance
    retention_period INTEGER DEFAULT 365,       -- Days to retain
    is_archived BOOLEAN DEFAULT FALSE,          -- Archived status
    
    -- Constraints
    CONSTRAINT events_status_check CHECK (event_status IN ('SUCCESS', 'FAILED', 'ERROR', 'WARNING', 'INFO')),
    CONSTRAINT events_category_check CHECK (event_category IN ('AUTH', 'CRUD', 'ML', 'SYSTEM', 'FILE', 'SECURITY'))
);
```

### **Event Categories & Types**

#### **Authentication Events (AUTH)**
- `LOGIN_SUCCESS` - Successful login
- `LOGIN_FAILED` - Failed login attempt
- `LOGOUT_SUCCESS` - Successful logout
- `TOKEN_REFRESH` - JWT token refreshed
- `PASSWORD_CHANGE` - Password changed

#### **CRUD Operations (CRUD)**
- `SISWA_CREATE` - New student created
- `SISWA_READ` - Student data viewed
- `SISWA_UPDATE` - Student data updated
- `SISWA_DELETE` - Student data deleted
- `NILAI_CREATE/UPDATE/DELETE` - Grade operations
- `PRESENSI_CREATE/UPDATE` - Attendance operations
- `PENGHASILAN_CREATE/UPDATE` - Parent income operations

#### **Machine Learning Events (ML)**
- `ML_TRAINING_START/SUCCESS/FAILED` - Model training events
- `ML_PREDICTION` - Single prediction made
- `ML_BATCH_PREDICTION` - Batch prediction executed
- `ML_MODEL_EVALUATION` - Model performance evaluation

#### **Security Events (SECURITY)**
- `SECURITY_BRUTE_FORCE` - Brute force attack detected
- `SECURITY_SQL_INJECTION` - SQL injection attempt
- `SECURITY_XSS_ATTEMPT` - XSS attack attempt
- `SECURITY_UNAUTHORIZED` - Unauthorized access attempt

#### **System Events (SYSTEM)**
- `SYSTEM_STARTUP/SHUTDOWN` - Application lifecycle
- `DATABASE_BACKUP` - Database backup created
- `HEALTH_CHECK` - System health monitoring
- `PERFORMANCE_MONITOR` - Performance monitoring

---

## 👥 **USE CASE DESCRIPTIONS**

### **Primary Actors**
1. **Admin** - Administrator sistem dengan akses penuh
2. **Teacher** - Guru dengan akses terbatas untuk data siswa
3. **Student** - Siswa dengan akses view only
4. **System** - Sistem otomatis (scheduler, ML engine)

### **Key Use Cases**

#### **UC-AUTH-001: User Login**
- **Actor**: Admin, Teacher, Student
- **Description**: Pengguna melakukan login ke sistem
- **Main Flow**:
  1. Pengguna memasukkan username/password
  2. Sistem validasi kredensial
  3. Sistem generate JWT token
  4. **Event logged**: `LOGIN_SUCCESS` atau `LOGIN_FAILED`
  5. Sistem redirect ke dashboard
- **Event Data**: user_id, username, ip_address, user_agent, login_time

#### **UC-CRUD-001: Create Student Data**
- **Actor**: Admin, Teacher
- **Description**: Menambah data siswa baru
- **Main Flow**:
  1. User input data siswa
  2. Sistem validasi data
  3. Simpan ke database
  4. **Event logged**: `SISWA_CREATE`
- **Event Data**: entity_id, new_values, created_by

#### **UC-ML-001: Train ML Model**
- **Actor**: Admin, System
- **Description**: Training model C4.5 untuk prediksi prestasi
- **Main Flow**:
  1. User/System trigger training
  2. Sistem load training data
  3. Execute C4.5 algorithm
  4. Save trained model
  5. **Event logged**: `ML_TRAINING_SUCCESS` atau `ML_TRAINING_FAILED`
- **Event Data**: algorithm, training_samples, accuracy, precision, recall, f1_score

#### **UC-SEC-001: Detect Brute Force Attack**
- **Actor**: System
- **Description**: Deteksi serangan brute force login
- **Main Flow**:
  1. Sistem monitor failed login attempts
  2. Detect pattern (>5 attempts in 10 minutes)
  3. Block IP temporarily
  4. **Event logged**: `SECURITY_BRUTE_FORCE`
- **Event Data**: ip_address, failed_attempts, time_window, action_taken

---

## 🗄️ **DATABASE INDEXING STRATEGY**

### **Performance Indexes**
```sql
-- Primary and timestamp indexes
CREATE INDEX idx_events_created_at ON events(created_at DESC);
CREATE INDEX idx_events_user_activity ON events(user_id, created_at DESC, event_type);

-- Event type and category indexes
CREATE INDEX idx_events_event_type ON events(event_type);
CREATE INDEX idx_events_event_category ON events(event_category);
CREATE INDEX idx_events_category_status ON events(event_category, event_status);

-- Security monitoring indexes
CREATE INDEX idx_events_ip_address ON events(ip_address) WHERE ip_address IS NOT NULL;
CREATE INDEX idx_events_security_monitoring ON events(event_category, ip_address, created_at DESC) 
    WHERE event_category = 'SECURITY';

-- Performance monitoring indexes
CREATE INDEX idx_events_response_time ON events(response_time_ms) WHERE response_time_ms IS NOT NULL;
CREATE INDEX idx_events_slow_responses ON events(response_time_ms, created_at) WHERE response_time_ms > 1000;

-- JSONB indexes for structured data
CREATE INDEX idx_events_event_data_gin ON events USING gin(event_data);
CREATE INDEX idx_events_tags_gin ON events USING gin(tags);

-- Full-text search index
CREATE INDEX idx_events_search_text_gin ON events USING gin(to_tsvector('english', search_text));
```

---

## 📊 **ANALYTICS & MONITORING QUERIES**

### **Real-time Dashboard**
```sql
-- Recent events (last 100)
SELECT id, event_name, username, entity_name, event_status, response_time_ms, created_at
FROM events 
ORDER BY created_at DESC 
LIMIT 100;

-- Event summary by category (last 24 hours)
SELECT 
    event_category,
    COUNT(*) as total_events,
    COUNT(*) FILTER (WHERE event_status = 'SUCCESS') as success_count,
    COUNT(*) FILTER (WHERE event_status IN ('FAILED', 'ERROR')) as error_count,
    ROUND(AVG(response_time_ms), 2) as avg_response_time,
    COUNT(DISTINCT user_id) as unique_users
FROM events 
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY event_category
ORDER BY total_events DESC;
```

### **Security Analysis**
```sql
-- Failed login attempts by IP
SELECT 
    ip_address,
    COUNT(*) as failed_attempts,
    COUNT(DISTINCT username) as unique_usernames_tried,
    MIN(created_at) as first_attempt,
    MAX(created_at) as last_attempt
FROM events 
WHERE event_type = 'LOGIN_FAILED'
    AND created_at >= NOW() - INTERVAL '24 hours'
GROUP BY ip_address
HAVING COUNT(*) >= 5
ORDER BY failed_attempts DESC;
```

### **Performance Analysis**
```sql
-- Slowest endpoints
SELECT 
    request_url,
    COUNT(*) as request_count,
    ROUND(AVG(response_time_ms), 2) as avg_response_time,
    MAX(response_time_ms) as max_response_time,
    COUNT(*) FILTER (WHERE response_time_ms > 1000) as slow_requests
FROM events 
WHERE created_at >= NOW() - INTERVAL '24 hours'
    AND request_url IS NOT NULL
    AND response_time_ms IS NOT NULL
GROUP BY request_url
ORDER BY avg_response_time DESC
LIMIT 20;
```

---

## 🔧 **BACKEND IMPLEMENTATION**

### **Event Logger Service**
```python
from datetime import datetime
from typing import Optional, Dict, Any, List
import json
from sqlalchemy.orm import Session
from models.event import Event

class EventLogger:
    def __init__(self, db: Session):
        self.db = db
    
    def log_event(
        self,
        event_type: str,
        event_category: str,
        event_name: str,
        user_id: Optional[int] = None,
        username: Optional[str] = None,
        user_role: Optional[str] = None,
        ip_address: Optional[str] = None,
        request_method: Optional[str] = None,
        request_url: Optional[str] = None,
        response_status: Optional[int] = None,
        response_time_ms: Optional[int] = None,
        entity_type: Optional[str] = None,
        entity_id: Optional[int] = None,
        event_data: Optional[Dict] = None,
        event_status: str = "SUCCESS",
        error_message: Optional[str] = None,
        tags: Optional[List[str]] = None
    ) -> Event:
        """Log event ke database"""
        
        # Generate search text
        search_text = self._generate_search_text(event_name, username, event_data)
        
        event = Event(
            event_type=event_type,
            event_category=event_category,
            event_name=event_name,
            user_id=user_id,
            username=username,
            user_role=user_role,
            ip_address=ip_address,
            request_method=request_method,
            request_url=request_url,
            response_status=response_status,
            response_time_ms=response_time_ms,
            entity_type=entity_type,
            entity_id=entity_id,
            event_data=event_data,
            event_status=event_status,
            error_message=error_message,
            tags=tags or [],
            search_text=search_text,
            created_at=datetime.utcnow()
        )
        
        self.db.add(event)
        self.db.commit()
        
        return event
    
    def _generate_search_text(self, event_name: str, username: Optional[str], event_data: Optional[Dict]) -> str:
        """Generate search text untuk full-text search"""
        parts = [event_name]
        
        if username:
            parts.append(username)
        if event_data:
            for key, value in event_data.items():
                if isinstance(value, (str, int, float)):
                    parts.append(str(value))
        
        return " ".join(parts).lower()
```

### **FastAPI Middleware Integration**
```python
from fastapi import FastAPI, Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
import time

class EventLoggingMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: FastAPI, db_session_factory):
        super().__init__(app)
        self.db_session_factory = db_session_factory
    
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # Extract request information
        ip_address = request.client.host
        user_agent = request.headers.get("user-agent")
        request_method = request.method
        request_url = str(request.url)
        
        response = await call_next(request)
        
        # Calculate response time
        response_time_ms = int((time.time() - start_time) * 1000)
        
        # Log the event
        with self.db_session_factory() as db:
            event_logger = EventLogger(db)
            
            # Determine event type based on endpoint
            event_type, event_category, event_name = self._determine_event_type(
                request_method, request_url, response.status_code
            )
            
            event_logger.log_event(
                event_type=event_type,
                event_category=event_category,
                event_name=event_name,
                ip_address=ip_address,
                request_method=request_method,
                request_url=request_url,
                response_status=response.status_code,
                response_time_ms=response_time_ms,
                event_status="SUCCESS" if response.status_code < 400 else "FAILED"
            )
        
        return response
    
    def _determine_event_type(self, method: str, url: str, status_code: int):
        """Determine event type berdasarkan endpoint"""
        if "/auth/login" in url:
            if status_code == 200:
                return "LOGIN_SUCCESS", "AUTH", "User Login Success"
            else:
                return "LOGIN_FAILED", "AUTH", "User Login Failed"
        elif "/siswa" in url:
            if method == "POST":
                return "SISWA_CREATE", "CRUD", "Student Created"
            elif method == "GET":
                return "SISWA_READ", "CRUD", "Student Viewed"
        # Add more endpoint mappings...
        
        return "GENERAL_REQUEST", "SYSTEM", "General Request"
```

---

## 🔒 **SECURITY & COMPLIANCE**

### **Data Privacy (GDPR Compliance)**
```sql
-- Anonymize user data
UPDATE events 
SET 
    username = 'anonymized_user',
    ip_address = NULL,
    user_agent = NULL,
    request_headers = NULL,
    request_body = NULL
WHERE user_id = ? 
    AND is_sensitive = TRUE;
```

### **Data Retention Policy**
```sql
-- Auto-cleanup old events (older than retention period)
DELETE FROM events 
WHERE created_at < NOW() - INTERVAL '1 year'
    AND retention_period <= EXTRACT(DAYS FROM NOW() - created_at);
```

---

## 📈 **KEY PERFORMANCE INDICATORS (KPIs)**

### **Functional Metrics**
- **Event Coverage**: 100% user actions logged
- **Data Accuracy**: 99.9% accurate event data
- **Real-time Processing**: <5 second latency
- **Search Performance**: <1 second query response

### **Security Metrics**
- **Threat Detection**: 95% accuracy
- **False Positives**: <5%
- **Response Time**: <30 seconds for alerts
- **Compliance**: 100% audit trail coverage

### **Performance Metrics**
- **System Impact**: <5% overhead
- **Storage Efficiency**: 80% compression ratio
- **Query Performance**: <100ms average
- **Availability**: 99.9% uptime

---

## 🎯 **BUSINESS RULES**

### **Access Control**
1. Admin dapat melihat semua events
2. Teacher dapat melihat events terkait siswa mereka
3. Student hanya dapat melihat events mereka sendiri
4. System events hanya visible untuk Admin

### **Security Rules**
1. Failed login attempts > 5 dalam 10 menit = block IP
2. SQL injection patterns = immediate block
3. Unauthorized access attempts = security alert
4. Sensitive data selalu di-filter dari logs

### **Performance Rules**
1. Event logging overhead < 100ms
2. Real-time dashboard update setiap 30 detik
3. Analytics queries optimized dengan indexes
4. Batch operations untuk high-volume events

---

## 🔄 **EVENT LIFECYCLE**

### **Event Creation Flow**
1. **Trigger** - User action atau system event
2. **Capture** - Middleware capture request/response
3. **Process** - Extract relevant data
4. **Filter** - Remove sensitive information
5. **Store** - Save to events table
6. **Index** - Update search indexes
7. **Alert** - Trigger alerts if needed

### **Event Status**
- **SUCCESS** - Operation completed successfully
- **FAILED** - Operation failed
- **ERROR** - System error occurred
- **WARNING** - Warning condition
- **INFO** - Informational event

---

**Document Version**: 1.0  
**Last Updated**: 20 Januari 2025  
**Author**: AI Assistant  
**Project**: EduPro - Sistem Prediksi Prestasi Siswa 