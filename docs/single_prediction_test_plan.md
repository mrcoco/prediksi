# Rencana Pengujian Single Prediction Endpoint

## Ringkasan Eksekutif

Dokumen ini menjelaskan rencana pengujian untuk endpoint single prediction dengan pola yang sama seperti pengujian authentication. Pengujian akan dilakukan secara bertahap untuk mengukur performa dan ketahanan sistem dalam menangani prediksi individual.

## Visualisasi Rencana Pengujian

```mermaid
graph TD
    A[Single Prediction Testing Flow] --> B[Phase 1: Initial Test]
    A --> C[Phase 2: Increased Load]
    A --> D[Phase 3: Further Load]
    A --> E[Phase 4: Breaking Point]
    A --> F[Phase 5: Rate Limiting]
    
    B --> B1[5 Users x 10 Loops]
    B1 --> B2[Target Metrics:<br/>Min < 300ms<br/>Avg < 600ms<br/>Max < 1000ms]
    
    C --> C1[10 Users x 10 Loops]
    C1 --> C2[Expected Load<br/>100 Predictions]
    
    D --> D1[20 Users x 10 Loops]
    D1 --> D2[High Load Test<br/>200 Predictions]
    
    E --> E1[40 Users x 10 Loops]
    E1 --> E2[Stress Test<br/>400 Predictions]
    
    F --> F1[Optimized Config]
    F1 --> F2[Rate Limiting<br/>Caching<br/>Performance Tuning]
```

## Metodologi Pengujian

### Endpoint Target
```
POST /api/prediksi/
Content-Type: application/json
Authorization: Bearer {token}

{
    "siswa_id": integer,
    "semester": string,
    "tahun_ajaran": string
}
```

### Fase Pengujian

#### 1. Initial Testing (50 Requests)
- **Konfigurasi**
  - Concurrent Users: 5
  - Loops per User: 10
  - Total Requests: 50
- **Target Metrics**
  - Response Time: < 300ms
  - Error Rate: 0%
  - Throughput: > 5 req/s

#### 2. Increased Load (100 Requests)
- **Konfigurasi**
  - Concurrent Users: 10
  - Loops per User: 10
  - Total Requests: 100
- **Target Metrics**
  - Response Time: < 500ms
  - Error Rate: < 1%
  - Throughput: > 8 req/s

#### 3. Further Load (200 Requests)
- **Konfigurasi**
  - Concurrent Users: 20
  - Loops per User: 10
  - Total Requests: 200
- **Target Metrics**
  - Response Time: < 800ms
  - Error Rate: < 2%
  - Throughput: > 10 req/s

#### 4. Breaking Point (400 Requests)
- **Konfigurasi**
  - Concurrent Users: 40
  - Loops per User: 10
  - Total Requests: 400
- **Observasi**
  - Maximum Response Time
  - System Resource Usage
  - Error Patterns

#### 5. Optimized Testing
- **Implementasi**
  - Rate Limiting
  - Response Caching
  - Connection Pooling
- **Target Metrics**
  - Response Time: < 600ms
  - Error Rate: 0%
  - Throughput: Stable

### Test Data Preparation

```mermaid
graph LR
    A[Test Data] --> B[Valid Cases]
    A --> C[Invalid Cases]
    
    B --> B1[Existing siswa_id]
    B --> B2[Valid semester]
    B --> B3[Valid tahun_ajaran]
    
    C --> C1[Non-existent siswa_id]
    C --> C2[Invalid semester]
    C --> C3[Invalid tahun_ajaran]
```

### Test Scenarios

1. **Valid Prediction Requests**
   - Existing student data
   - Complete parameters
   - Valid token authentication

2. **Invalid Requests**
   - Non-existent student ID
   - Invalid semester format
   - Invalid academic year
   - Missing parameters

3. **Authentication Scenarios**
   - Valid token
   - Expired token
   - Invalid token
   - Missing token

4. **Concurrent Access Patterns**
   - Same student multiple requests
   - Different students parallel requests
   - Mixed valid/invalid requests

## Monitoring dan Metrics

### Key Performance Indicators (KPIs)
1. **Response Time**
   - Average response time
   - 95th percentile
   - Maximum response time

2. **Throughput**
   - Requests per second
   - Successful predictions
   - Failed predictions

3. **Resource Usage**
   - CPU utilization
   - Memory usage
   - Database connections

4. **Error Rates**
   - Authentication failures
   - Validation errors
   - System errors

## Expected Results

### Performance Targets
1. **Response Time**
   - Average: < 500ms
   - 95th percentile: < 800ms
   - Maximum: < 1500ms

2. **Throughput**
   - Sustained: > 10 req/s
   - Peak: > 15 req/s
   - Concurrent users: 25

3. **Resource Usage**
   - CPU: < 70%
   - Memory: < 80%
   - DB Connections: < 60%

### Error Handling
1. **Expected Error Responses**
   - 400: Invalid request
   - 401: Unauthorized
   - 404: Student not found
   - 429: Too many requests

2. **Error Rate Targets**
   - System errors: < 0.1%
   - Validation errors: < 1%
   - Authentication errors: < 0.5%

## Optimasi dan Tuning

### Caching Strategy
```mermaid
graph TD
    A[Prediction Request] --> B{Cache Check}
    B -->|Hit| C[Return Cached Result]
    B -->|Miss| D[Process Prediction]
    D --> E[Cache Result]
    E --> F[Return Result]
```

### Performance Optimization
1. **Database Optimization**
   - Index optimization
   - Query caching
   - Connection pooling

2. **Application Level**
   - Response caching
   - Batch processing
   - Async processing

3. **Infrastructure**
   - Load balancing
   - Resource scaling
   - Rate limiting

## Kesimpulan

Rencana pengujian ini dirancang untuk memastikan endpoint single prediction dapat menangani beban yang diharapkan dengan performa yang optimal. Pengujian bertahap akan membantu mengidentifikasi bottlenecks dan area optimasi.

## Appendix

### Test Data Templates
```json
{
    "valid_request": {
        "siswa_id": 12345,
        "semester": "Ganjil",
        "tahun_ajaran": "2023/2024"
    },
    "invalid_request": {
        "siswa_id": 99999,
        "semester": "Invalid",
        "tahun_ajaran": "2023"
    }
}
```

### JMeter Test Plan Structure
- Thread Groups
- HTTP Requests
- Assertions
- Listeners
- Timer Configuration 