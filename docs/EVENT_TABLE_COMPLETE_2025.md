# 📊 Event Table Complete Documentation - EduPro 2025

## 🎯 **OVERVIEW**

Event Table adalah komponen inti dari sistem logging dan monitoring aplikasi EduPro. Tabel ini mencatat semua aktivitas pengguna, sistem, dan security events untuk keperluan audit trail, analytics, monitoring, dan compliance.

---

## 🗄️ **DATABASE SCHEMA**

### **Main Events Table**

```sql
CREATE TABLE events (
    -- Primary Key
    id BIGSERIAL PRIMARY KEY,
    
    -- Event Identification
    event_type VARCHAR(100) NOT NULL,           -- LOGIN_SUCCESS, SISWA_CREATE, ML_PREDICTION, etc.
    event_category VARCHAR(50) NOT NULL,        -- AUTH, CRUD, ML, SYSTEM, FILE, SECURITY
    event_name VARCHAR(200) NOT NULL,           -- Human readable event name
    event_description TEXT,                     -- Detailed description
    
    -- Timestamp Information
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    event_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
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
    request_size_bytes INTEGER,                 -- Request size
    
    -- Response Information
    response_status INTEGER,                    -- HTTP status code
    response_time_ms INTEGER,                   -- Response time in milliseconds
    response_size_bytes INTEGER,                -- Response size
    response_headers JSONB,                     -- Response headers
    
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
    error_stack_trace TEXT,                     -- Stack trace (for debugging)
    
    -- Classification & Search
    tags TEXT[],                                -- Array of tags for categorization
    search_text TEXT,                           -- Full-text search content
    is_sensitive BOOLEAN DEFAULT FALSE,         -- Contains sensitive data
    
    -- System Information
    server_name VARCHAR(100),                   -- Server/instance name
    application_version VARCHAR(50),            -- App version
    cpu_usage_percent DECIMAL(5,2),             -- CPU usage at time of event
    memory_usage_mb INTEGER,                    -- Memory usage in MB
    
    -- Geolocation (optional)
    country_code VARCHAR(2),                    -- Country code
    city VARCHAR(100),                          -- City name
    latitude DECIMAL(10,8),                     -- Latitude
    longitude DECIMAL(11,8),                    -- Longitude
    
    -- Retention & Compliance
    retention_period INTEGER DEFAULT 365,       -- Days to retain
    is_archived BOOLEAN DEFAULT FALSE,          -- Archived status
    archived_at TIMESTAMP WITH TIME ZONE,      -- Archive timestamp
    
    -- Indexes and Constraints
    CONSTRAINT events_status_check CHECK (event_status IN ('SUCCESS', 'FAILED', 'ERROR', 'WARNING', 'INFO')),
    CONSTRAINT events_category_check CHECK (event_category IN ('AUTH', 'CRUD', 'ML', 'SYSTEM', 'FILE', 'SECURITY', 'ANALYTICS'))
);
```

### **Event Summary Tables**

```sql
-- Daily Event Summary
CREATE TABLE event_summary_daily (
    id SERIAL PRIMARY KEY,
    summary_date DATE NOT NULL,
    event_category VARCHAR(50) NOT NULL,
    event_type VARCHAR(100),
    total_events INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    failed_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    warning_count INTEGER DEFAULT 0,
    avg_response_time_ms DECIMAL(10,2),
    max_response_time_ms INTEGER,
    min_response_time_ms INTEGER,
    unique_users INTEGER DEFAULT 0,
    unique_ips INTEGER DEFAULT 0,
    total_data_size_bytes BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(summary_date, event_category, event_type)
);

-- Hourly Event Summary (for real-time monitoring)
CREATE TABLE event_summary_hourly (
    id SERIAL PRIMARY KEY,
    summary_hour TIMESTAMP WITH TIME ZONE NOT NULL,
    event_category VARCHAR(50) NOT NULL,
    total_events INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    failed_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    avg_response_time_ms DECIMAL(10,2),
    unique_users INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(summary_hour, event_category)
);

-- Security Events Summary
CREATE TABLE security_events_summary (
    id SERIAL PRIMARY KEY,
    summary_date DATE NOT NULL,
    threat_type VARCHAR(100) NOT NULL,           -- BRUTE_FORCE, SQL_INJECTION, XSS, etc.
    threat_count INTEGER DEFAULT 0,
    unique_ips INTEGER DEFAULT 0,
    blocked_requests INTEGER DEFAULT 0,
    severity_level VARCHAR(20),                  -- LOW, MEDIUM, HIGH, CRITICAL
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(summary_date, threat_type)
);
```

### **Event Archive Table**

```sql
-- Archive table for old events
CREATE TABLE events_archive (
    LIKE events INCLUDING ALL
);

-- Partition by month for better performance
CREATE TABLE events_archive_2025_01 PARTITION OF events_archive
FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
```

---

## 🔍 **INDEXING STRATEGY**

### **Performance Indexes**

```sql
-- Primary and timestamp indexes
CREATE INDEX idx_events_created_at ON events(created_at DESC);
CREATE INDEX idx_events_event_timestamp ON events(event_timestamp DESC);
CREATE INDEX idx_events_created_at_category ON events(created_at, event_category);

-- User activity indexes
CREATE INDEX idx_events_user_id ON events(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_events_username ON events(username) WHERE username IS NOT NULL;
CREATE INDEX idx_events_user_activity ON events(user_id, created_at DESC, event_type);

-- Event type and category indexes
CREATE INDEX idx_events_event_type ON events(event_type);
CREATE INDEX idx_events_event_category ON events(event_category);
CREATE INDEX idx_events_type_category ON events(event_type, event_category);
CREATE INDEX idx_events_category_status ON events(event_category, event_status);

-- Status and error indexes
CREATE INDEX idx_events_status ON events(event_status);
CREATE INDEX idx_events_failed_status ON events(event_status, created_at) 
    WHERE event_status IN ('FAILED', 'ERROR');
CREATE INDEX idx_events_error_code ON events(error_code) WHERE error_code IS NOT NULL;

-- Entity relationship indexes
CREATE INDEX idx_events_entity ON events(entity_type, entity_id) 
    WHERE entity_type IS NOT NULL AND entity_id IS NOT NULL;
CREATE INDEX idx_events_entity_type ON events(entity_type) WHERE entity_type IS NOT NULL;

-- Network and security indexes
CREATE INDEX idx_events_ip_address ON events(ip_address) WHERE ip_address IS NOT NULL;
CREATE INDEX idx_events_ip_category ON events(ip_address, event_category, created_at);

-- Performance monitoring indexes
CREATE INDEX idx_events_response_time ON events(response_time_ms) 
    WHERE response_time_ms IS NOT NULL;
CREATE INDEX idx_events_slow_responses ON events(response_time_ms, created_at) 
    WHERE response_time_ms > 1000;

-- Request method and URL indexes
CREATE INDEX idx_events_request_method ON events(request_method) 
    WHERE request_method IS NOT NULL;
CREATE INDEX idx_events_request_url ON events(request_url) 
    WHERE request_url IS NOT NULL;
```

### **JSONB Indexes**

```sql
-- JSONB indexes for structured data
CREATE INDEX idx_events_event_data_gin ON events USING gin(event_data);
CREATE INDEX idx_events_previous_values_gin ON events USING gin(previous_values);
CREATE INDEX idx_events_new_values_gin ON events USING gin(new_values);
CREATE INDEX idx_events_request_headers_gin ON events USING gin(request_headers);

-- Array indexes
CREATE INDEX idx_events_tags_gin ON events USING gin(tags);

-- Full-text search index
CREATE INDEX idx_events_search_text_gin ON events USING gin(to_tsvector('english', search_text));
```

### **Composite Indexes**

```sql
-- User activity analysis
CREATE INDEX idx_events_user_time_range ON events(user_id, created_at DESC, event_category, event_status);

-- Security monitoring
CREATE INDEX idx_events_security_monitoring ON events(event_category, ip_address, created_at DESC) 
    WHERE event_category = 'SECURITY';

-- Error tracking and debugging
CREATE INDEX idx_events_error_tracking ON events(event_status, error_code, created_at DESC) 
    WHERE event_status IN ('FAILED', 'ERROR');

-- Performance analysis
CREATE INDEX idx_events_performance_analysis ON events(request_url, response_time_ms, created_at DESC);

-- ML operations tracking
CREATE INDEX idx_events_ml_operations ON events(event_category, event_type, created_at DESC) 
    WHERE event_category = 'ML';
```

---

## 📋 **EVENT TYPES & CATEGORIES**

### **Authentication Events (AUTH)**
```sql
-- Event types for authentication
'LOGIN_SUCCESS'           -- Successful login
'LOGIN_FAILED'            -- Failed login attempt
'LOGOUT_SUCCESS'          -- Successful logout
'TOKEN_REFRESH'           -- JWT token refreshed
'PASSWORD_CHANGE'         -- Password changed
'ACCOUNT_LOCKED'          -- Account locked due to failed attempts
'ACCOUNT_UNLOCKED'        -- Account unlocked
'TWO_FACTOR_AUTH'         -- 2FA authentication
```

### **CRUD Operations (CRUD)**
```sql
-- Student management
'SISWA_CREATE'            -- New student created
'SISWA_READ'              -- Student data viewed
'SISWA_UPDATE'            -- Student data updated
'SISWA_DELETE'            -- Student data deleted
'SISWA_IMPORT'            -- Bulk student import
'SISWA_EXPORT'            -- Student data export

-- Academic data management
'NILAI_CREATE'            -- New grade entry
'NILAI_UPDATE'            -- Grade updated
'NILAI_DELETE'            -- Grade deleted
'PRESENSI_CREATE'         -- Attendance recorded
'PRESENSI_UPDATE'         -- Attendance updated
'PENGHASILAN_CREATE'      -- Parent income data created
'PENGHASILAN_UPDATE'      -- Parent income data updated
```

### **Machine Learning Events (ML)**
```sql
'ML_TRAINING_START'       -- Model training started
'ML_TRAINING_SUCCESS'     -- Model training completed successfully
'ML_TRAINING_FAILED'      -- Model training failed
'ML_PREDICTION'           -- Single prediction made
'ML_BATCH_PREDICTION'     -- Batch prediction executed
'ML_MODEL_EVALUATION'     -- Model performance evaluation
'ML_FEATURE_EXTRACTION'   -- Feature extraction process
'ML_DATA_PREPROCESSING'   -- Data preprocessing
'ML_MODEL_DEPLOY'         -- Model deployed to production
'ML_MODEL_ROLLBACK'       -- Model rolled back
```

### **System Events (SYSTEM)**
```sql
'SYSTEM_STARTUP'          -- Application started
'SYSTEM_SHUTDOWN'         -- Application shutdown
'DATABASE_BACKUP'         -- Database backup created
'DATABASE_RESTORE'        -- Database restored
'HEALTH_CHECK'            -- System health check
'PERFORMANCE_MONITOR'     -- Performance monitoring
'CACHE_CLEAR'             -- Cache cleared
'CONFIG_UPDATE'           -- Configuration updated
'MAINTENANCE_START'       -- Maintenance mode started
'MAINTENANCE_END'         -- Maintenance mode ended
```

### **File Operations (FILE)**
```sql
'FILE_UPLOAD'             -- File uploaded
'FILE_DOWNLOAD'           -- File downloaded
'FILE_DELETE'             -- File deleted
'DATA_EXPORT'             -- Data exported to file
'DATA_IMPORT'             -- Data imported from file
'REPORT_GENERATE'         -- Report generated
'BACKUP_CREATE'           -- Backup file created
'BACKUP_RESTORE'          -- Backup file restored
```

### **Security Events (SECURITY)**
```sql
'SECURITY_BRUTE_FORCE'    -- Brute force attack detected
'SECURITY_SQL_INJECTION'  -- SQL injection attempt
'SECURITY_XSS_ATTEMPT'    -- XSS attack attempt
'SECURITY_CSRF_ATTEMPT'   -- CSRF attack attempt
'SECURITY_UNAUTHORIZED'   -- Unauthorized access attempt
'SECURITY_RATE_LIMIT'     -- Rate limit exceeded
'SECURITY_IP_BLOCKED'     -- IP address blocked
'SECURITY_SUSPICIOUS'     -- Suspicious activity detected
'SECURITY_MALWARE'        -- Malware detected
'SECURITY_DATA_BREACH'    -- Data breach detected
```

---

## 🔧 **DATABASE FUNCTIONS & TRIGGERS**

### **Event Logging Function**

```sql
CREATE OR REPLACE FUNCTION log_event(
    p_event_type VARCHAR(100),
    p_event_category VARCHAR(50),
    p_event_name VARCHAR(200),
    p_user_id INTEGER DEFAULT NULL,
    p_username VARCHAR(100) DEFAULT NULL,
    p_user_role VARCHAR(50) DEFAULT NULL,
    p_session_id VARCHAR(100) DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_request_method VARCHAR(10) DEFAULT NULL,
    p_request_url TEXT DEFAULT NULL,
    p_request_headers JSONB DEFAULT NULL,
    p_request_body JSONB DEFAULT NULL,
    p_response_status INTEGER DEFAULT NULL,
    p_response_time_ms INTEGER DEFAULT NULL,
    p_entity_type VARCHAR(50) DEFAULT NULL,
    p_entity_id INTEGER DEFAULT NULL,
    p_entity_name VARCHAR(200) DEFAULT NULL,
    p_event_data JSONB DEFAULT NULL,
    p_previous_values JSONB DEFAULT NULL,
    p_new_values JSONB DEFAULT NULL,
    p_event_status VARCHAR(20) DEFAULT 'SUCCESS',
    p_error_message TEXT DEFAULT NULL,
    p_error_code VARCHAR(50) DEFAULT NULL,
    p_tags TEXT[] DEFAULT NULL,
    p_is_sensitive BOOLEAN DEFAULT FALSE
) RETURNS BIGINT AS $$
DECLARE
    event_id BIGINT;
    search_text TEXT;
BEGIN
    -- Generate search text
    search_text := COALESCE(p_event_name, '') || ' ' || 
                   COALESCE(p_username, '') || ' ' ||
                   COALESCE(p_entity_name, '') || ' ' ||
                   COALESCE(p_event_data::TEXT, '');
    
    -- Insert event
    INSERT INTO events (
        event_type, event_category, event_name,
        user_id, username, user_role, session_id,
        ip_address, user_agent, request_method, request_url,
        request_headers, request_body, response_status, response_time_ms,
        entity_type, entity_id, entity_name,
        event_data, previous_values, new_values,
        event_status, error_message, error_code,
        tags, search_text, is_sensitive,
        cpu_usage_percent, memory_usage_mb
    ) VALUES (
        p_event_type, p_event_category, p_event_name,
        p_user_id, p_username, p_user_role, p_session_id,
        p_ip_address, p_user_agent, p_request_method, p_request_url,
        p_request_headers, p_request_body, p_response_status, p_response_time_ms,
        p_entity_type, p_entity_id, p_entity_name,
        p_event_data, p_previous_values, p_new_values,
        p_event_status, p_error_message, p_error_code,
        p_tags, search_text, p_is_sensitive,
        -- Get current system metrics
        (SELECT ROUND(RANDOM() * 100, 2)), -- Simulate CPU usage
        (SELECT FLOOR(RANDOM() * 1000 + 500)::INTEGER) -- Simulate memory usage
    ) RETURNING id INTO event_id;
    
    RETURN event_id;
END;
$$ LANGUAGE plpgsql;
```

### **Automatic Summary Generation**

```sql
-- Function to generate daily summaries
CREATE OR REPLACE FUNCTION generate_daily_summary(summary_date DATE DEFAULT CURRENT_DATE - INTERVAL '1 day')
RETURNS VOID AS $$
BEGIN
    -- Generate daily summary
    INSERT INTO event_summary_daily (
        summary_date, event_category, event_type,
        total_events, success_count, failed_count, error_count, warning_count,
        avg_response_time_ms, max_response_time_ms, min_response_time_ms,
        unique_users, unique_ips
    )
    SELECT 
        summary_date,
        event_category,
        event_type,
        COUNT(*) as total_events,
        COUNT(*) FILTER (WHERE event_status = 'SUCCESS') as success_count,
        COUNT(*) FILTER (WHERE event_status = 'FAILED') as failed_count,
        COUNT(*) FILTER (WHERE event_status = 'ERROR') as error_count,
        COUNT(*) FILTER (WHERE event_status = 'WARNING') as warning_count,
        ROUND(AVG(response_time_ms), 2) as avg_response_time_ms,
        MAX(response_time_ms) as max_response_time_ms,
        MIN(response_time_ms) as min_response_time_ms,
        COUNT(DISTINCT user_id) as unique_users,
        COUNT(DISTINCT ip_address) as unique_ips
    FROM events 
    WHERE DATE(created_at) = summary_date
    GROUP BY event_category, event_type
    ON CONFLICT (summary_date, event_category, event_type) 
    DO UPDATE SET
        total_events = EXCLUDED.total_events,
        success_count = EXCLUDED.success_count,
        failed_count = EXCLUDED.failed_count,
        error_count = EXCLUDED.error_count,
        warning_count = EXCLUDED.warning_count,
        avg_response_time_ms = EXCLUDED.avg_response_time_ms,
        max_response_time_ms = EXCLUDED.max_response_time_ms,
        min_response_time_ms = EXCLUDED.min_response_time_ms,
        unique_users = EXCLUDED.unique_users,
        unique_ips = EXCLUDED.unique_ips;
END;
$$ LANGUAGE plpgsql;
```

### **Event Cleanup Function**

```sql
-- Function to cleanup old events
CREATE OR REPLACE FUNCTION cleanup_old_events(days_to_keep INTEGER DEFAULT 365)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Archive events older than retention period
    INSERT INTO events_archive 
    SELECT * FROM events 
    WHERE created_at < NOW() - INTERVAL '1 day' * days_to_keep
    AND NOT is_archived;
    
    -- Delete archived events from main table
    DELETE FROM events 
    WHERE created_at < NOW() - INTERVAL '1 day' * days_to_keep
    AND NOT is_sensitive;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;
```

---

## 📊 **ANALYTICS QUERIES**

### **Real-time Dashboard Queries**

```sql
-- Recent events (last 100)
SELECT 
    id,
    event_name,
    username,
    entity_name,
    event_status,
    response_time_ms,
    created_at
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

-- Top active users (last 7 days)
SELECT 
    username,
    user_role,
    COUNT(*) as total_events,
    COUNT(DISTINCT DATE(created_at)) as active_days,
    ROUND(AVG(response_time_ms), 2) as avg_response_time
FROM events 
WHERE created_at >= NOW() - INTERVAL '7 days'
    AND user_id IS NOT NULL
GROUP BY username, user_role
ORDER BY total_events DESC
LIMIT 20;
```

### **Security Analysis Queries**

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

-- Security threats summary
SELECT 
    event_type,
    COUNT(*) as threat_count,
    COUNT(DISTINCT ip_address) as unique_ips,
    MAX(created_at) as last_occurrence
FROM events 
WHERE event_category = 'SECURITY'
    AND created_at >= NOW() - INTERVAL '24 hours'
GROUP BY event_type
ORDER BY threat_count DESC;
```

### **Performance Analysis Queries**

```sql
-- Slowest endpoints
SELECT 
    request_url,
    COUNT(*) as request_count,
    ROUND(AVG(response_time_ms), 2) as avg_response_time,
    PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY response_time_ms) as p95_response_time,
    MAX(response_time_ms) as max_response_time,
    COUNT(*) FILTER (WHERE response_time_ms > 1000) as slow_requests
FROM events 
WHERE created_at >= NOW() - INTERVAL '24 hours'
    AND request_url IS NOT NULL
    AND response_time_ms IS NOT NULL
GROUP BY request_url
ORDER BY avg_response_time DESC
LIMIT 20;

-- Error rate by endpoint
SELECT 
    request_url,
    COUNT(*) as total_requests,
    COUNT(*) FILTER (WHERE event_status = 'SUCCESS') as success_count,
    COUNT(*) FILTER (WHERE event_status IN ('FAILED', 'ERROR')) as error_count,
    ROUND(
        COUNT(*) FILTER (WHERE event_status IN ('FAILED', 'ERROR')) * 100.0 / COUNT(*), 
        2
    ) as error_rate_percent
FROM events 
WHERE created_at >= NOW() - INTERVAL '24 hours'
    AND request_url IS NOT NULL
GROUP BY request_url
HAVING COUNT(*) >= 10
ORDER BY error_rate_percent DESC;
```

---

## 🔒 **SECURITY & COMPLIANCE**

### **Data Privacy**

```sql
-- Anonymize user data for GDPR compliance
UPDATE events 
SET 
    username = 'anonymized_user_' || user_id,
    ip_address = NULL,
    user_agent = NULL,
    request_headers = '{}',
    request_body = '{}',
    event_data = jsonb_set(
        COALESCE(event_data, '{}'), 
        '{user_info}', 
        '"[ANONYMIZED]"'
    )
WHERE user_id = $1 
    AND is_sensitive = TRUE;
```

### **Data Retention Policy**

```sql
-- Automated cleanup job (run daily)
SELECT cron.schedule('cleanup-events', '0 2 * * *', $$
    SELECT cleanup_old_events(365);
    SELECT generate_daily_summary();
$$);
```

---

## 📈 **MONITORING & ALERTING**

### **Key Metrics to Monitor**

1. **Event Volume**: Events per minute/hour
2. **Error Rate**: Percentage of failed events
3. **Response Time**: Average and P95 response times
4. **Security Threats**: Failed logins, injection attempts
5. **User Activity**: Active users, session duration
6. **System Health**: CPU/Memory usage, database performance

### **Alert Conditions**

```sql
-- High error rate alert
SELECT 'HIGH_ERROR_RATE' as alert_type,
       COUNT(*) as error_count,
       ROUND(COUNT(*) * 100.0 / (
           SELECT COUNT(*) FROM events 
           WHERE created_at >= NOW() - INTERVAL '1 hour'
       ), 2) as error_rate_percent
FROM events 
WHERE event_status IN ('FAILED', 'ERROR')
    AND created_at >= NOW() - INTERVAL '1 hour'
HAVING COUNT(*) * 100.0 / (
    SELECT COUNT(*) FROM events 
    WHERE created_at >= NOW() - INTERVAL '1 hour'
) > 5.0;

-- Brute force attack alert
SELECT 'BRUTE_FORCE_ATTACK' as alert_type,
       ip_address,
       COUNT(*) as failed_attempts
FROM events 
WHERE event_type = 'LOGIN_FAILED'
    AND created_at >= NOW() - INTERVAL '10 minutes'
GROUP BY ip_address
HAVING COUNT(*) >= 5;
```

---

**Document Version**: 1.0  
**Last Updated**: 20 Januari 2025  
**Author**: AI Assistant  
**Project**: EduPro - Sistem Prediksi Prestasi Siswa 