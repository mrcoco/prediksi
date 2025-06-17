# Implementasi Tabel Korelasi Antar Fitur Numerik - EduPro

**Tanggal**: 17 Juni 2025  
**Versi**: 1.0  
**Author**: AI Assistant  

## 📋 Overview

Implementasi tabel korelasi antar fitur numerik dalam aplikasi EduPro untuk memberikan insight tentang hubungan antar variabel yang mempengaruhi prestasi siswa. Fitur ini menggunakan korelasi Pearson untuk menganalisis kekuatan dan arah hubungan antar fitur numerik.

## 🎯 Tujuan

1. **Analisis Hubungan**: Memahami korelasi antar faktor prestasi siswa
2. **Data-driven Insights**: Memberikan basis data untuk pengambilan keputusan
3. **Pattern Recognition**: Mengidentifikasi pola korelasi yang signifikan
4. **Predictive Enhancement**: Meningkatkan pemahaman untuk prediksi yang lebih akurat

## 🔧 Implementasi Backend

### Endpoint API

**URL**: `GET /api/prediksi/feature-statistics`  
**Authentication**: Bearer Token Required  
**Response**: JSON dengan data korelasi dalam field `correlation_matrix`

### Algoritma Perhitungan Korelasi

```python
# 1. Data Synchronization
numerical_features = {}

# Ambil data numerik dari berbagai sumber
if 'rata_rata' in df.columns:
    numerical_features['Nilai Rata-rata'] = df['rata_rata'].tolist()

# Sinkronisasi data penghasilan
if penghasilan_data:
    penghasilan_map = {p.siswa_id: p for p in penghasilan_data}
    siswa_ids = df['siswa_id'].tolist() if 'siswa_id' in df.columns else [s.id for s in db.query(Siswa).all()]
    
    for siswa_id in siswa_ids:
        if siswa_id in penghasilan_map:
            p = penghasilan_map[siswa_id]
            penghasilan_ayah_sync.append(p.penghasilan_ayah or 0)
            penghasilan_ibu_sync.append(p.penghasilan_ibu or 0)
            total_penghasilan_sync.append(p.total_penghasilan or 0)

# 2. Correlation Calculation
if len(numerical_features) >= 2:
    corr_df = pd.DataFrame(numerical_features)
    corr_matrix = corr_df.corr()
    
    # 3. JSON Conversion
    for i, feature1 in enumerate(feature_names):
        correlation_data[feature1] = {}
        for j, feature2 in enumerate(feature_names):
            correlation_value = corr_matrix.iloc[i, j]
            if pd.isna(correlation_value):
                correlation_value = 0.0
            correlation_data[feature1][feature2] = round(float(correlation_value), 3)
```

## 🎨 Implementasi Frontend

### Tab Interface

Menambahkan tab "Korelasi Fitur" dalam dashboard statistik dengan navigasi:
- Statistik Numerik
- **Korelasi Fitur** (Baru)
- Distribusi Kategori

### Tabel Korelasi

Tabel interaktif dengan fitur:
- **Sticky Headers**: Header baris dan kolom tetap terlihat saat scroll
- **Color Coding**: Warna berbeda untuk kekuatan korelasi
- **Hover Effects**: Tooltip dengan interpretasi saat hover
- **Responsive Design**: Adaptif untuk desktop dan mobile

## 📊 Interpretasi Korelasi

### Klasifikasi Kekuatan Korelasi

| Range | Klasifikasi | Warna | Interpretasi |
|-------|-------------|-------|--------------|
| 0.7 - 1.0 | Strong Positive | Hijau | Hubungan positif sangat kuat |
| 0.3 - 0.7 | Moderate Positive | Biru-Hijau | Hubungan positif sedang |
| 0.1 - 0.3 | Weak Positive | Ungu-Pink | Hubungan positif lemah |
| -0.1 - 0.1 | No Correlation | Abu-abu | Tidak ada hubungan linear |
| -0.3 - -0.1 | Weak Negative | Orange | Hubungan negatif lemah |
| -0.7 - -0.3 | Moderate Negative | Merah-Orange | Hubungan negatif sedang |
| -1.0 - -0.7 | Strong Negative | Ungu-Merah | Hubungan negatif sangat kuat |

### Contoh Interpretasi

1. **Nilai Rata-rata vs Persentase Kehadiran**: Korelasi positif sedang menunjukkan siswa dengan kehadiran tinggi cenderung memiliki nilai yang lebih baik

2. **Penghasilan Ayah vs Total Penghasilan**: Korelasi positif kuat menunjukkan penghasilan ayah berkontribusi besar terhadap total penghasilan keluarga

## 🔧 Fitur Teknis

### Data Synchronization
- Mapping berdasarkan siswa_id, semester, dan tahun_ajaran
- Handling missing data dengan default value 0
- Efficient JOIN queries untuk mengurangi database calls

### Performance Optimization
- Data caching untuk reuse data yang sudah dimuat
- Lazy loading perhitungan korelasi
- Responsive design untuk berbagai ukuran layar

### Error Handling
```python
try:
    corr_df = pd.DataFrame(numerical_features)
    corr_matrix = corr_df.corr()
except Exception as e:
    correlation_matrix = {
        "error": f"Gagal menghitung korelasi: {str(e)}",
        "matrix": {},
        "features": []
    }
```

## 🎯 Business Value

### Educational Insights
1. **Faktor Dominan**: Identifikasi faktor yang paling berkorelasi dengan prestasi
2. **Intervention Points**: Menentukan area yang perlu diperbaiki
3. **Resource Allocation**: Alokasi sumber daya berdasarkan korelasi

### Data-driven Decisions
1. **Policy Making**: Basis data untuk kebijakan sekolah
2. **Parent Engagement**: Insight untuk keterlibatan orang tua
3. **Student Support**: Program dukungan berdasarkan pola korelasi

## 🔄 Integration Workflow

### Dashboard Integration
1. User membuka dashboard
2. Klik tab "Korelasi Fitur"
3. Frontend memanggil `/prediksi/feature-statistics`
4. Backend menghitung korelasi real-time
5. Frontend menampilkan tabel dengan color coding
6. User dapat hover untuk detail interpretasi

## 🚀 Future Enhancements

### Advanced Analytics
1. **Partial Correlation**: Korelasi dengan kontrol variabel lain
2. **Time Series Correlation**: Korelasi berdasarkan periode waktu
3. **Categorical Correlation**: Korelasi untuk variabel kategorikal

### Visualization Enhancements
1. **Heatmap Visualization**: Visualisasi heatmap dengan D3.js
2. **Network Graph**: Graph network untuk hubungan antar fitur
3. **Interactive Filtering**: Filter berdasarkan kelas, semester, tahun

## 📚 Dependencies

### Backend Dependencies
```
pandas==2.0.1          # Untuk perhitungan korelasi
numpy==1.24.3           # Untuk operasi numerik
sqlalchemy==2.0.12      # Untuk database queries
fastapi==0.68.1         # Untuk API endpoints
```

### Frontend Dependencies
```
Kendo UI               # Untuk komponen UI
Bootstrap 4            # Untuk responsive design
Font Awesome           # Untuk icons
```

## 🔐 Security Considerations

### Authentication
- Endpoint memerlukan Bearer token authentication
- Validasi user permissions sebelum akses data

### Data Privacy
- Tidak menampilkan data individual siswa
- Hanya menampilkan agregat dan korelasi
- Compliance dengan regulasi privasi data

---

**Files Modified**:
- `backend/routes/prediksi_router.py` - Implementasi perhitungan korelasi
- `frontend/js/app.js` - Frontend rendering dan interaksi
- `frontend/styles/custom.css` - Styling tabel korelasi
- `CHANGELOG.md` - Dokumentasi perubahan

**Catatan**: Dokumentasi ini akan diupdate seiring dengan pengembangan fitur dan feedback dari pengguna. 