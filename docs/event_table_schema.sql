-- ===================================================================
-- EVENT TABLE SCHEMA - SISTEM EDUPRO
-- Tanggal: 19 Juni 2025
-- Versi: 2.0.0
-- Deskripsi: Comprehensive event tracking untuk audit, monitoring, dan analytics
-- ===================================================================

-- Main Events Table
CREATE TABLE events (
    -- Primary Key
    id BIGSERIAL PRIMARY KEY,
    
    -- Event Identification
    event_type VARCHAR(100) NOT NULL,           -- Jenis event (USER_LOGIN, DATA_CREATE, etc.)
    event_category VARCHAR(50) NOT NULL,        -- Kategori (AUTH, CRUD, ML, SYSTEM)
    event_name VARCHAR(200) NOT NULL,           -- Nama event yang readable
    
    -- User & Session Information
    user_id INTEGER REFERENCES users(id),       -- FK ke user table
    username VARCHAR(100),                      -- Username untuk quick access
    user_role VARCHAR(50),                      -- Role saat event terjadi
    session_id VARCHAR(255),                    -- Session identifier
    
    -- Request Information
    ip_address INET,                            -- IP address pengguna
    user_agent TEXT,                            -- Browser/client information
    request_method VARCHAR(10),                 -- HTTP method (GET, POST, etc.)
    request_url TEXT,                           -- URL endpoint yang diakses
    request_headers JSONB,                      -- HTTP headers
    request_body JSONB,                         -- Request payload (filtered)
    
    -- Response Information
    response_status INTEGER,                    -- HTTP status code
    response_time_ms INTEGER,                   -- Response time dalam milliseconds
    response_size_bytes INTEGER,                -- Response size
    
    -- Event Details
    entity_type VARCHAR(100),                   -- Tipe entity (siswa, nilai, etc.)
    entity_id INTEGER,                          -- ID entity yang terkait
    entity_name VARCHAR(200),                   -- Nama entity untuk reference
    
    -- Event Data
    event_data JSONB,                           -- Data detail event
    previous_values JSONB,                      -- Nilai sebelum perubahan (untuk UPDATE)
    new_values JSONB,                           -- Nilai setelah perubahan
    
    -- System Information
    server_name VARCHAR(100),                   -- Server yang memproses
    application_version VARCHAR(50),            -- Versi aplikasi
    
    -- Status & Results
    event_status VARCHAR(50) DEFAULT 'SUCCESS', -- SUCCESS, FAILED, ERROR
    error_message TEXT,                         -- Pesan error jika ada
    error_code VARCHAR(50),                     -- Kode error
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    
    -- Indexing & Search
    tags VARCHAR(500)[],                        -- Tags untuk kategorisasi
    search_text TEXT,                           -- Text untuk full-text search
    
    -- Audit & Compliance
    retention_period INTEGER DEFAULT 365,       -- Periode retensi (hari)
    is_sensitive BOOLEAN DEFAULT FALSE,         -- Apakah data sensitif
    
    -- Performance
    cpu_usage_percent DECIMAL(5,2),            -- CPU usage saat event
    memory_usage_mb INTEGER,                    -- Memory usage
    
    -- Constraints
    CONSTRAINT valid_event_status CHECK (event_status IN ('SUCCESS', 'FAILED', 'ERROR', 'PENDING')),
    CONSTRAINT valid_event_category CHECK (event_category IN ('AUTH', 'CRUD', 'ML', 'SYSTEM', 'FILE', 'SECURITY')),
    CONSTRAINT valid_response_status CHECK (response_status >= 100 AND response_status <= 599),
    CONSTRAINT valid_response_time CHECK (response_time_ms >= 0),
    CONSTRAINT valid_retention_period CHECK (retention_period > 0)
);

-- ===================================================================
-- INDEXES UNTUK PERFORMANCE OPTIMIZATION
-- ===================================================================

-- Primary Indexes
CREATE INDEX idx_events_created_at ON events(created_at);
CREATE INDEX idx_events_created_at_desc ON events(created_at DESC);

-- User Activity Indexes
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_username ON events(username);
CREATE INDEX idx_events_user_created ON events(user_id, created_at);

-- Event Type Indexes
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_category ON events(event_category);
CREATE INDEX idx_events_type_category ON events(event_type, event_category);

-- Status Indexes
CREATE INDEX idx_events_status ON events(event_status);
CREATE INDEX idx_events_error_status ON events(event_status) WHERE event_status != 'SUCCESS';

-- Entity Indexes
CREATE INDEX idx_events_entity ON events(entity_type, entity_id);
CREATE INDEX idx_events_entity_type ON events(entity_type);

-- Security & Performance Indexes
CREATE INDEX idx_events_ip_address ON events(ip_address);
CREATE INDEX idx_events_response_time ON events(response_time_ms);
CREATE INDEX idx_events_slow_response ON events(response_time_ms) WHERE response_time_ms > 1000;

-- Composite Indexes untuk Complex Queries
CREATE INDEX idx_events_user_time_range ON events(user_id, created_at, event_type);
CREATE INDEX idx_events_security ON events(event_category, ip_address, created_at) 
    WHERE event_category = 'SECURITY';
CREATE INDEX idx_events_errors ON events(event_status, error_code, created_at) 
    WHERE event_status IN ('FAILED', 'ERROR');
CREATE INDEX idx_events_performance ON events(response_time_ms, created_at, request_url);

-- JSONB Indexes
CREATE INDEX idx_events_data_gin ON events USING gin(event_data);
CREATE INDEX idx_events_previous_values_gin ON events USING gin(previous_values);
CREATE INDEX idx_events_new_values_gin ON events USING gin(new_values);
CREATE INDEX idx_events_tags_gin ON events USING gin(tags);

-- Full Text Search Index
CREATE INDEX idx_events_search_text ON events USING gin(to_tsvector('english', search_text));

-- ===================================================================
-- EVENT ARCHIVE TABLE untuk Long-term Storage
-- ===================================================================

CREATE TABLE events_archive (
    LIKE events INCLUDING ALL
);

-- Partition by year untuk better performance
CREATE TABLE events_archive_2024 PARTITION OF events_archive
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE events_archive_2025 PARTITION OF events_archive
    FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

-- ===================================================================
-- EVENT SUMMARY TABLE untuk Quick Analytics
-- ===================================================================

CREATE TABLE event_summary_daily (
    id SERIAL PRIMARY KEY,
    summary_date DATE NOT NULL,
    event_category VARCHAR(50) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    total_events INTEGER DEFAULT 0,
    success_events INTEGER DEFAULT 0,
    failed_events INTEGER DEFAULT 0,
    error_events INTEGER DEFAULT 0,
    avg_response_time_ms DECIMAL(10,2),
    max_response_time_ms INTEGER,
    unique_users INTEGER DEFAULT 0,
    unique_ips INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(summary_date, event_category, event_type)
);

CREATE INDEX idx_event_summary_date ON event_summary_daily(summary_date);
CREATE INDEX idx_event_summary_category ON event_summary_daily(event_category);

-- ===================================================================
-- FUNCTIONS untuk Event Processing
-- ===================================================================

-- Function untuk Auto-cleanup Old Events
CREATE OR REPLACE FUNCTION cleanup_old_events()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Delete events older than their retention period
    DELETE FROM events 
    WHERE created_at < NOW() - INTERVAL '1 day' * retention_period;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Log cleanup activity
    INSERT INTO events (
        event_type, 
        event_category, 
        event_name, 
        event_data,
        event_status
    ) VALUES (
        'SYSTEM_CLEANUP',
        'SYSTEM',
        'Event Cleanup Completed',
        jsonb_build_object('deleted_count', deleted_count),
        'SUCCESS'
    );
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function untuk Archive Old Events
CREATE OR REPLACE FUNCTION archive_old_events()
RETURNS INTEGER AS $$
DECLARE
    archived_count INTEGER;
BEGIN
    -- Move events older than 6 months to archive
    WITH moved_events AS (
        DELETE FROM events 
        WHERE created_at < NOW() - INTERVAL '6 months'
            AND is_sensitive = FALSE
        RETURNING *
    )
    INSERT INTO events_archive SELECT * FROM moved_events;
    
    GET DIAGNOSTICS archived_count = ROW_COUNT;
    
    -- Log archive activity
    INSERT INTO events (
        event_type, 
        event_category, 
        event_name, 
        event_data,
        event_status
    ) VALUES (
        'SYSTEM_ARCHIVE',
        'SYSTEM',
        'Event Archive Completed',
        jsonb_build_object('archived_count', archived_count),
        'SUCCESS'
    );
    
    RETURN archived_count;
END;
$$ LANGUAGE plpgsql;

-- Function untuk Generate Daily Summary
CREATE OR REPLACE FUNCTION generate_daily_summary(target_date DATE)
RETURNS INTEGER AS $$
DECLARE
    summary_count INTEGER;
BEGIN
    -- Generate daily summary
    INSERT INTO event_summary_daily (
        summary_date,
        event_category,
        event_type,
        total_events,
        success_events,
        failed_events,
        error_events,
        avg_response_time_ms,
        max_response_time_ms,
        unique_users,
        unique_ips
    )
    SELECT 
        target_date,
        event_category,
        event_type,
        COUNT(*) as total_events,
        COUNT(*) FILTER (WHERE event_status = 'SUCCESS') as success_events,
        COUNT(*) FILTER (WHERE event_status = 'FAILED') as failed_events,
        COUNT(*) FILTER (WHERE event_status = 'ERROR') as error_events,
        AVG(response_time_ms) as avg_response_time_ms,
        MAX(response_time_ms) as max_response_time_ms,
        COUNT(DISTINCT user_id) as unique_users,
        COUNT(DISTINCT ip_address) as unique_ips
    FROM events 
    WHERE DATE(created_at) = target_date
    GROUP BY event_category, event_type
    ON CONFLICT (summary_date, event_category, event_type) 
    DO UPDATE SET
        total_events = EXCLUDED.total_events,
        success_events = EXCLUDED.success_events,
        failed_events = EXCLUDED.failed_events,
        error_events = EXCLUDED.error_events,
        avg_response_time_ms = EXCLUDED.avg_response_time_ms,
        max_response_time_ms = EXCLUDED.max_response_time_ms,
        unique_users = EXCLUDED.unique_users,
        unique_ips = EXCLUDED.unique_ips;
    
    GET DIAGNOSTICS summary_count = ROW_COUNT;
    
    RETURN summary_count;
END;
$$ LANGUAGE plpgsql;

-- ===================================================================
-- TRIGGERS untuk Auto-processing
-- ===================================================================

-- Trigger untuk Auto-generate Search Text
CREATE OR REPLACE FUNCTION generate_search_text()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_text := LOWER(CONCAT_WS(' ', 
        NEW.event_name,
        NEW.username,
        NEW.entity_name,
        NEW.event_data::text
    ));
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_search_text
    BEFORE INSERT OR UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION generate_search_text();

-- ===================================================================
-- SCHEDULED JOBS (Cron Jobs)
-- ===================================================================

-- Daily cleanup job (run at 2 AM)
-- SELECT cron.schedule('event-cleanup', '0 2 * * *', 'SELECT cleanup_old_events();');

-- Daily archive job (run at 3 AM)
-- SELECT cron.schedule('event-archive', '0 3 * * *', 'SELECT archive_old_events();');

-- Daily summary job (run at 1 AM for previous day)
-- SELECT cron.schedule('daily-summary', '0 1 * * *', 
--     'SELECT generate_daily_summary(CURRENT_DATE - INTERVAL ''1 day'');');

-- ===================================================================
-- SAMPLE DATA untuk Testing
-- ===================================================================

-- Sample Authentication Events
INSERT INTO events (event_type, event_category, event_name, user_id, username, user_role, ip_address, request_method, request_url, response_status, response_time_ms, event_data, tags) VALUES
('USER_LOGIN_SUCCESS', 'AUTH', 'User Login Success', 1, 'admin001', 'admin', '192.168.1.100', 'POST', '/api/auth/login', 200, 150, '{"login_method": "username_password", "device_type": "desktop"}', ARRAY['authentication', 'login', 'success']),
('USER_LOGIN_FAILED', 'AUTH', 'User Login Failed', NULL, 'unknown_user', NULL, '203.0.113.1', 'POST', '/api/auth/login', 401, 50, '{"reason": "invalid_credentials", "attempts": 3}', ARRAY['authentication', 'login', 'failed']),
('TOKEN_REFRESH', 'AUTH', 'Token Refresh', 1, 'admin001', 'admin', '192.168.1.100', 'POST', '/api/auth/refresh', 200, 89, '{"old_expires_at": "2025-06-19T10:00:00Z", "new_expires_at": "2025-06-19T12:00:00Z"}', ARRAY['authentication', 'token', 'refresh']);

-- Sample CRUD Events
INSERT INTO events (event_type, event_category, event_name, user_id, username, user_role, entity_type, entity_id, entity_name, request_method, request_url, response_status, response_time_ms, new_values, event_data, tags) VALUES
('SISWA_CREATE', 'CRUD', 'Student Created', 1, 'admin001', 'admin', 'siswa', 123, 'Ahmad Fauzi', 'POST', '/api/siswa', 201, 89, '{"nama": "Ahmad Fauzi", "nis": "12345678", "kelas": "XII IPA 1"}', '{"validation_passed": true}', ARRAY['student', 'create', 'crud']),
('NILAI_UPDATE', 'CRUD', 'Grade Updated', 2, 'guru001', 'guru', 'nilai', 456, 'Nilai Matematika - Ahmad Fauzi', 'PUT', '/api/nilai/456', 200, 120, '{"matematika": 85, "rata_rata": 82.5}', '{"previous_matematika": 80, "grade_improvement": 5}', ARRAY['grade', 'update', 'crud']);

-- Sample ML Events
INSERT INTO events (event_type, event_category, event_name, user_id, username, user_role, request_method, request_url, response_status, response_time_ms, event_data, tags) VALUES
('ML_MODEL_TRAIN_SUCCESS', 'ML', 'Model Training Success', 1, 'admin001', 'admin', 'POST', '/api/prediksi/train', 200, 15420, '{"algorithm": "C4.5", "training_samples": 150, "accuracy": 0.85, "precision": 0.83, "recall": 0.87, "f1_score": 0.85}', ARRAY['machine_learning', 'training', 'c45', 'success']),
('PREDICTION_SINGLE', 'ML', 'Single Prediction', 2, 'guru001', 'guru', 'POST', '/api/prediksi/single', 200, 234, '{"student_id": 123, "prediction": "TINGGI", "confidence": 0.89, "features_used": ["rata_rata", "penghasilan_total", "persentase_kehadiran"]}', ARRAY['prediction', 'single', 'ml']);

-- Sample System Events
INSERT INTO events (event_type, event_category, event_name, request_method, request_url, response_status, response_time_ms, event_data, tags) VALUES
('HEALTH_CHECK', 'SYSTEM', 'Health Check', 'GET', '/health', 200, 15, '{"status": "healthy", "database": "connected", "memory_usage": "45%", "cpu_usage": "12%"}', ARRAY['system', 'health', 'monitoring']),
('ERROR_500', 'SYSTEM', 'Internal Server Error', 'POST', '/api/siswa', 500, 2340, '{"error_type": "database_connection", "query": "INSERT INTO siswa..."}', ARRAY['error', 'database', 'system']);

-- ===================================================================
-- VIEWS untuk Quick Access
-- ===================================================================

-- View untuk Recent Events
CREATE VIEW recent_events AS
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

-- View untuk Error Events
CREATE VIEW error_events AS
SELECT 
    id,
    event_type,
    event_name,
    username,
    error_code,
    error_message,
    created_at
FROM events 
WHERE event_status IN ('FAILED', 'ERROR')
ORDER BY created_at DESC;

-- View untuk Performance Metrics
CREATE VIEW performance_metrics AS
SELECT 
    request_url,
    COUNT(*) as request_count,
    AVG(response_time_ms) as avg_response_time,
    PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY response_time_ms) as p95_response_time,
    MAX(response_time_ms) as max_response_time
FROM events 
WHERE created_at >= NOW() - INTERVAL '24 hours'
    AND request_url IS NOT NULL
GROUP BY request_url
ORDER BY avg_response_time DESC;

-- View untuk User Activity Summary
CREATE VIEW user_activity_summary AS
SELECT 
    username,
    user_role,
    COUNT(*) as total_events,
    COUNT(DISTINCT DATE(created_at)) as active_days,
    MAX(created_at) as last_activity,
    AVG(response_time_ms) as avg_response_time
FROM events 
WHERE created_at >= NOW() - INTERVAL '30 days'
    AND user_id IS NOT NULL
GROUP BY username, user_role
ORDER BY total_events DESC;

-- ===================================================================
-- COMMENTS untuk Documentation
-- ===================================================================

COMMENT ON TABLE events IS 'Comprehensive event tracking table untuk audit, monitoring, dan analytics sistem EduPro';
COMMENT ON COLUMN events.event_type IS 'Jenis event spesifik (USER_LOGIN_SUCCESS, SISWA_CREATE, etc.)';
COMMENT ON COLUMN events.event_category IS 'Kategori event (AUTH, CRUD, ML, SYSTEM, FILE, SECURITY)';
COMMENT ON COLUMN events.event_data IS 'JSON data berisi detail event yang spesifik';
COMMENT ON COLUMN events.previous_values IS 'Nilai sebelum perubahan untuk operasi UPDATE';
COMMENT ON COLUMN events.new_values IS 'Nilai setelah perubahan untuk operasi CREATE/UPDATE';
COMMENT ON COLUMN events.search_text IS 'Text yang di-generate otomatis untuk full-text search';
COMMENT ON COLUMN events.tags IS 'Array tags untuk kategorisasi dan filtering';
COMMENT ON COLUMN events.is_sensitive IS 'Flag untuk menandai data sensitif yang perlu special handling';

-- ===================================================================
-- GRANTS untuk User Access
-- ===================================================================

-- Grant permissions untuk application user
-- GRANT SELECT, INSERT ON events TO edupro_app_user;
-- GRANT SELECT ON recent_events, error_events, performance_metrics, user_activity_summary TO edupro_app_user;

-- Grant read-only access untuk reporting user
-- GRANT SELECT ON events, events_archive, event_summary_daily TO edupro_reporting_user;
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO edupro_reporting_user;

-- ===================================================================
-- END OF EVENT TABLE SCHEMA
-- ===================================================================
