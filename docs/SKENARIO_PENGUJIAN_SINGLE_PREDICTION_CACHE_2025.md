# SKENARIO PENGUJIAN SINGLE PREDICTION DENGAN CACHE - JUNI 2025

## 📋 OVERVIEW
Dokumen ini menjelaskan skenario pengujian performa sistem EduPro untuk fitur single prediction setelah implementasi caching menggunakan data real dari database. Pengujian akan dilakukan dalam 5 fase dengan tingkat concurrent users yang berbeda.

## 🎯 TUJUAN PENGUJIAN
1. Mengukur performa single prediction dengan cache menggunakan data real
2. Memvalidasi efektivitas caching untuk single request
3. Membandingkan performa dengan batch prediction
4. Memastikan konsistensi response time dengan data variatif
5. Mengukur cache hit ratio untuk single prediction

## 🔧 ENVIRONMENT PENGUJIAN
- **Hardware**: AWS EC2 t3.large (2 vCPU, 8GB RAM)
- **Database**: PostgreSQL 13
- **Cache**: Redis 7.2.3-alpine dengan 1GB memory limit
- **Network**: AWS VPC dengan bandwidth 1Gbps
- **JMeter Version**: Apache JMeter 5.6.3
- **Endpoint**: http://localhost/api/prediksi/ (single prediction)

## 📊 DATASET PENGUJIAN
- **Source**: Database Production EduPro
- **Total Records**: 1000+ siswa aktif
- **Distribusi Data**:
  ```sql
  SELECT 
    prestasi_kategori,
    COUNT(*) as jumlah,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as persentase
  FROM siswa 
  GROUP BY prestasi_kategori;
  ```
  - Prestasi Tinggi: ~40%
  - Prestasi Sedang: ~35%
  - Prestasi Rendah: ~25%

## 🔄 SKENARIO PENGUJIAN

### Phase 1: Cache Warm-up
**File**: `single_phase1_warmup.jmx`
- **Users**: 100 concurrent users
- **Ramp-up**: 30 detik
- **Duration**: 5 menit
- **Data Selection**: 
  ```sql
  SELECT nis FROM siswa ORDER BY RANDOM() LIMIT 100;
  ```
- **Tujuan**: 
  - Mengisi cache dengan prediksi awal
  - Mengukur baseline performance
  - Menghitung initial cache hit ratio

### Phase 2: Moderate Load
**File**: `single_phase2_moderate.jmx`
- **Users**: 200 concurrent users
- **Ramp-up**: 60 detik
- **Duration**: 10 menit
- **Data Selection**:
  ```sql
  SELECT nis FROM siswa 
  WHERE last_update >= NOW() - INTERVAL '30 days'
  ORDER BY RANDOM() LIMIT 200;
  ```
- **Tujuan**:
  - Validasi cache effectiveness
  - Mengukur response time improvement
  - Monitoring cache hit ratio

### Phase 3: High Load
**File**: `single_phase3_high.jmx`
- **Users**: 400 concurrent users
- **Ramp-up**: 120 detik
- **Duration**: 15 menit
- **Data Selection**:
  ```sql
  SELECT nis FROM siswa 
  WHERE semester_aktif = 'Ganjil' 
  AND tahun_ajaran = '2024/2025'
  ORDER BY RANDOM() LIMIT 400;
  ```
- **Tujuan**:
  - Stress testing dengan cache
  - Mengukur cache performance under load
  - Monitoring memory usage

### Phase 4: Peak Load
**File**: `single_phase4_peak.jmx`
- **Users**: 1000 concurrent users
- **Ramp-up**: 300 detik
- **Duration**: 20 menit
- **Data Selection**:
  ```sql
  SELECT nis FROM siswa 
  WHERE status = 'AKTIF'
  ORDER BY RANDOM() LIMIT 1000;
  ```
- **Tujuan**:
  - Maximum load testing
  - Cache eviction monitoring
  - System stability validation

### Phase 5: Endurance
**File**: `single_phase5_endurance.jmx`
- **Users**: 600 concurrent users
- **Ramp-up**: 180 detik
- **Duration**: 60 menit
- **Data Selection**:
  ```sql
  SELECT nis FROM siswa 
  WHERE status = 'AKTIF'
  AND nilai_rata_rata IS NOT NULL
  ORDER BY RANDOM() LIMIT 600;
  ```
- **Tujuan**:
  - Long-term cache effectiveness
  - Memory leak detection
  - System stability over time

## 📝 TEST CASE DETAILS

### Request Payload
```json
{
  "siswa_id": ${nis},
  "semester": "Ganjil",
  "tahun_ajaran": "2023/2024"
}
```

### Success Criteria
1. Response Time:
   - 95th percentile < 200ms (dengan cache)
   - Average < 100ms (dengan cache)
2. Cache Hit Ratio:
   - Warm-up phase: > 60%
   - Steady state: > 90%
3. Error Rate: < 0.1%
4. Throughput: > 2000 requests/minute
5. Memory Usage:
   - Redis: < 800MB
   - Backend: < 70% CPU

### Monitoring Metrics
1. Response Time:
   - Average
   - 90th percentile
   - 95th percentile
   - 99th percentile
2. Cache Performance:
   - Hit ratio
   - Miss ratio
   - Eviction rate
3. System Resources:
   - CPU usage
   - Memory usage
   - Network I/O
4. Error Metrics:
   - Error rate
   - Error distribution
   - Failed transactions

## 📊 EXPECTED RESULTS

### Phase 1 (Baseline)
- Response Time: < 50ms
- Cache Hit: > 60%
- Error Rate: 0%
- Memory Usage: < 300MB

### Phase 2 (Moderate)
- Response Time: < 75ms
- Cache Hit: > 80%
- Error Rate: < 0.05%
- Memory Usage: < 400MB

### Phase 3 (High Load)
- Response Time: < 100ms
- Cache Hit: > 85%
- Error Rate: < 0.08%
- Memory Usage: < 600MB

### Phase 4 (Peak)
- Response Time: < 150ms
- Cache Hit: > 90%
- Error Rate: < 0.1%
- Memory Usage: < 800MB

### Phase 5 (Endurance)
- Response Time: < 120ms
- Cache Hit: > 95%
- Error Rate: < 0.05%
- Memory Usage: Stable < 700MB

## 📈 COMPARISON WITH BATCH PREDICTION

Expected improvements compared to batch prediction:
1. Response Time: 40% faster
2. Resource Usage: 30% lower
3. Cache Hit Ratio: 5% higher
4. Max Concurrent Users: 2x higher

## 🔍 TEST EXECUTION STEPS

1. **Database Preparation**:
   ```sql
   -- Create test data view
   CREATE OR REPLACE VIEW v_test_data AS
   SELECT nis, nama, kelas, prestasi_kategori
   FROM siswa
   WHERE status = 'AKTIF'
   AND nilai_rata_rata IS NOT NULL;
   
   -- Create index for better performance
   CREATE INDEX idx_siswa_nis_status ON siswa(nis, status);
   ```

2. **Cache Preparation**:
   ```bash
   # Clear Redis cache
   redis-cli FLUSHALL
   
   # Set memory limit
   redis-cli CONFIG SET maxmemory 1GB
   
   # Set eviction policy
   redis-cli CONFIG SET maxmemory-policy allkeys-lru
   ```

3. **Execution Sequence**:
   - Run Phase 1 (Warm-up)
   - Analyze results
   - Proceed with Phase 2-5
   - Collect metrics after each phase

4. **Monitoring Setup**:
   ```sql
   -- Create monitoring table
   CREATE TABLE test_metrics (
       phase INT,
       timestamp TIMESTAMP,
       response_time FLOAT,
       cache_hit BOOLEAN,
       error_code VARCHAR(10)
   );
   ```

## 👥 TEAM & TIMELINE

### Team
- Performance Engineer: [Name]
- System Administrator: [Name]
- DevOps Engineer: [Name]
- QA Lead: [Name]

### Timeline
- Setup & Preparation: 23 Juni 2025
- Test Execution: 24-25 Juni 2025
- Analysis & Documentation: 25 Juni 2025
- Review & Sign-off: 26 Juni 2025 