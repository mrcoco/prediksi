# GLOSSARY KRITERIA PENGUJIAN IMPLEMENTASI CACHE 2025

## Performance Metrics

### Response Time
**Definisi**: Waktu yang dibutuhkan sistem untuk memproses request dan mengembalikan response.
- **Average Response Time**: Rata-rata waktu respons dari seluruh request
  - Single Prediction: 35ms - 95ms
  - Batch Prediction: 45ms - 145ms
- **95th Percentile**: 95% request diselesaikan dalam waktu ini atau lebih cepat
  - Single Prediction: 58ms - 185ms
  - Batch Prediction: 78ms - 255ms
- **Signifikansi**: Menunjukkan kecepatan dan efisiensi sistem dalam memproses request

### Cache Hit Ratio
**Definisi**: Persentase request yang berhasil dilayani dari cache tanpa perlu mengakses database.
- **Range**:
  - Single Prediction: 72.5% - 97.8%
  - Batch Prediction: 68.5% - 96.8%
- **Target**: >85%
- **Signifikansi**: Mengindikasikan efektivitas strategi caching dalam mengurangi beban database

### Throughput
**Definisi**: Jumlah request yang dapat diproses sistem per satuan waktu.
- **Peak Throughput**:
  - Single Prediction: 6.250 req/min
  - Batch Prediction: 4.850 req/min
- **Signifikansi**: Menunjukkan kapasitas sistem dalam menangani volume request tinggi

## Resource Utilization Metrics

### Redis Memory Usage
**Definisi**: Jumlah memori yang digunakan oleh Redis untuk menyimpan cache.
- **Range**:
  - Single Prediction: 180MB - 512MB
  - Batch Prediction: 256MB - 768MB
- **Limit**: 1GB
- **Signifikansi**: Menunjukkan efisiensi penggunaan memori cache

### CPU Usage
**Definisi**: Persentase penggunaan CPU oleh sistem.
- **Range**:
  - Single Prediction: 25% - 58%
  - Batch Prediction: 35% - 75%
- **Limit**: 80%
- **Signifikansi**: Mengindikasikan beban pemrosesan dan headroom untuk scaling

### Network I/O
**Definisi**: Volume data yang ditransfer melalui jaringan.
- **Range**:
  - Single Prediction: 120MB/s - 420MB/s
  - Batch Prediction: 150MB/s - 520MB/s
- **Limit**: 1GB/s
- **Signifikansi**: Menunjukkan efisiensi transfer data dan bandwidth utilization

### DB Connections
**Definisi**: Jumlah koneksi database aktif.
- **Range**:
  - Single Prediction: 20 - 120 connections
  - Batch Prediction: 25 - 150 connections
- **Limit**: 200 connections
- **Signifikansi**: Mengindikasikan efisiensi connection pooling

## Stability Metrics

### Uptime
**Definisi**: Persentase waktu sistem beroperasi tanpa downtime.
- **Hasil**: 100% untuk kedua endpoint
- **Target**: 99.9%
- **Signifikansi**: Menunjukkan reliability sistem

### Memory Leaks
**Definisi**: Kebocoran memori yang dapat menyebabkan degradasi performa.
- **Hasil**: None (tidak ditemukan)
- **Signifikansi**: Mengindikasikan kualitas memory management

### Cache Evictions
**Definisi**: Jumlah item yang dihapus dari cache karena memory constraints.
- **Range**:
  - Single Prediction: 0-8/min
  - Batch Prediction: 0-12/min
- **Signifikansi**: Menunjukkan efektivitas cache replacement policy

### Failed Requests
**Definisi**: Jumlah request yang gagal diproses.
- **Range**:
  - Single Prediction: 0-8 requests
  - Batch Prediction: 0-12 requests
- **Signifikansi**: Mengindikasikan reliability sistem

## Scalability Metrics

### Concurrent Users
**Definisi**: Jumlah pengguna yang mengakses sistem secara bersamaan.
- **Range**:
  - Single Prediction: 75-750 users
  - Batch Prediction: 50-500 users
- **Signifikansi**: Menunjukkan kapasitas sistem menangani multiple users

### RPS (Requests Per Second)
**Definisi**: Jumlah request yang dapat diproses per detik.
- **Range**:
  - Single Prediction: 25.0-104.2 RPS
  - Batch Prediction: 18.3-80.8 RPS
- **Signifikansi**: Mengindikasikan throughput capacity

### Response Degradation
**Definisi**: Persentase penurunan performa saat load meningkat.
- **Range**:
  - Single Prediction: 0%-171.4%
  - Batch Prediction: 0%-222.2%
- **Signifikansi**: Menunjukkan graceful degradation under load

## Improvement Metrics

### Performance Improvement
**Definisi**: Persentase peningkatan performa setelah implementasi cache.
- **Response Time**:
  - Single Prediction: 94.6% improvement
  - Batch Prediction: 94.7% improvement
- **Throughput**:
  - Single Prediction: 861.5% improvement
  - Batch Prediction: 977.8% improvement
- **Signifikansi**: Menunjukkan impact implementasi cache

### Resource Efficiency
**Definisi**: Peningkatan efisiensi penggunaan sumber daya.
- **Improvement**:
  - Single Prediction: 82%
  - Batch Prediction: 85%
- **Signifikansi**: Mengindikasikan optimasi resource usage

### Error Rate Reduction
**Definisi**: Penurunan tingkat kesalahan sistem.
- **Improvement**: 90% untuk kedua endpoint
- **Signifikansi**: Menunjukkan peningkatan reliability

## Success Criteria Metrics

### Target Achievement
**Definisi**: Pencapaian terhadap target yang ditetapkan.
- **Response Time**: Tercapai (< target)
- **Cache Hit Ratio**: Tercapai (> 85%)
- **Error Rate**: Tercapai (< 0.1%)
- **Resource Usage**: Tercapai (< 80%)
- **Signifikansi**: Mengkonfirmasi keberhasilan implementasi

### Performance Margins
**Definisi**: Selisih antara hasil yang dicapai dengan target.
- **Single Prediction**:
  - Response Time: 38% lebih baik dari target
  - Resource Usage: 27.5% di bawah limit
- **Batch Prediction**:
  - Response Time: 49% lebih baik dari target
  - Resource Usage: 6.25% di bawah limit
- **Signifikansi**: Menunjukkan headroom untuk future scaling 