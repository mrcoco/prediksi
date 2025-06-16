# 🎓 Implementasi Detail Algoritma C4.5 dalam EduPro

## 📋 **Overview**

Dokumentasi ini memberikan penjelasan rinci implementasi algoritma C4.5 dalam aplikasi EduPro untuk prediksi prestasi siswa, mencakup teori matematika, implementasi Python, dan integrasi sistem lengkap.

---

## 📊 **1. INPUT DATA DAN STRUKTUR DATABASE**

### **1.1 Struktur Database EduPro**

```sql
-- Tabel Siswa
CREATE TABLE siswa (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    nis VARCHAR(20) UNIQUE NOT NULL,
    jenis_kelamin VARCHAR(10),
    kelas VARCHAR(20),
    tanggal_lahir DATE,
    alamat TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Nilai Raport
CREATE TABLE nilai_raport (
    id SERIAL PRIMARY KEY,
    siswa_id INTEGER REFERENCES siswa(id) ON DELETE CASCADE,
    semester VARCHAR(20) NOT NULL,
    tahun_ajaran VARCHAR(20) NOT NULL,
    matematika DECIMAL(5,2) CHECK (matematika >= 0 AND matematika <= 100),
    bahasa_indonesia DECIMAL(5,2) CHECK (bahasa_indonesia >= 0 AND bahasa_indonesia <= 100),
    bahasa_inggris DECIMAL(5,2) CHECK (bahasa_inggris >= 0 AND bahasa_inggris <= 100),
    ipa DECIMAL(5,2) CHECK (ipa >= 0 AND ipa <= 100),
    bahasa_jawa DECIMAL(5,2) CHECK (bahasa_jawa >= 0 AND bahasa_jawa <= 100),
    pkn DECIMAL(5,2) CHECK (pkn >= 0 AND pkn <= 100),
    seni DECIMAL(5,2) CHECK (seni >= 0 AND seni <= 100),
    sejarah DECIMAL(5,2) CHECK (sejarah >= 0 AND sejarah <= 100),
    agama DECIMAL(5,2) CHECK (agama >= 0 AND agama <= 100),
    pjok DECIMAL(5,2) CHECK (pjok >= 0 AND pjok <= 100),
    dasar_kejuruan DECIMAL(5,2) CHECK (dasar_kejuruan >= 0 AND dasar_kejuruan <= 100),
    rata_rata DECIMAL(5,2) GENERATED ALWAYS AS (
        (matematika + bahasa_indonesia + bahasa_inggris + ipa + bahasa_jawa + 
         pkn + seni + sejarah + agama + pjok + dasar_kejuruan) / 11
    ) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Presensi
CREATE TABLE presensi (
    id SERIAL PRIMARY KEY,
    siswa_id INTEGER REFERENCES siswa(id) ON DELETE CASCADE,
    semester VARCHAR(20) NOT NULL,
    tahun_ajaran VARCHAR(20) NOT NULL,
    jumlah_hadir INTEGER CHECK (jumlah_hadir >= 0),
    jumlah_sakit INTEGER CHECK (jumlah_sakit >= 0),
    jumlah_izin INTEGER CHECK (jumlah_izin >= 0),
    jumlah_alpa INTEGER CHECK (jumlah_alpa >= 0),
    persentase_kehadiran DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE 
            WHEN (jumlah_hadir + jumlah_sakit + jumlah_izin + jumlah_alpa) > 0 
            THEN (jumlah_hadir::DECIMAL / (jumlah_hadir + jumlah_sakit + jumlah_izin + jumlah_alpa)) * 100
            ELSE 0
        END
    ) STORED,
    kategori_kehadiran VARCHAR(20) GENERATED ALWAYS AS (
        CASE 
            WHEN (jumlah_hadir::DECIMAL / NULLIF(jumlah_hadir + jumlah_sakit + jumlah_izin + jumlah_alpa, 0)) * 100 >= 80 THEN 'Tinggi'
            WHEN (jumlah_hadir::DECIMAL / NULLIF(jumlah_hadir + jumlah_sakit + jumlah_izin + jumlah_alpa, 0)) * 100 >= 75 THEN 'Sedang'
            ELSE 'Rendah'
        END
    ) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Penghasilan Orang Tua
CREATE TABLE penghasilan_ortu (
    id SERIAL PRIMARY KEY,
    siswa_id INTEGER REFERENCES siswa(id) ON DELETE CASCADE,
    penghasilan_ayah BIGINT CHECK (penghasilan_ayah >= 0),
    penghasilan_ibu BIGINT CHECK (penghasilan_ibu >= 0),
    pekerjaan_ayah VARCHAR(100),
    pekerjaan_ibu VARCHAR(100),
    pendidikan_ayah VARCHAR(50),
    pendidikan_ibu VARCHAR(50),
    total_penghasilan BIGINT GENERATED ALWAYS AS (penghasilan_ayah + penghasilan_ibu) STORED,
    kategori_penghasilan VARCHAR(20) GENERATED ALWAYS AS (
        CASE 
            WHEN (penghasilan_ayah + penghasilan_ibu) > 5000000 THEN 'Tinggi'
            WHEN (penghasilan_ayah + penghasilan_ibu) >= 2000000 THEN 'Sedang'
            ELSE 'Rendah'
        END
    ) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Riwayat Prediksi
CREATE TABLE riwayat_prediksi (
    id SERIAL PRIMARY KEY,
    siswa_id INTEGER REFERENCES siswa(id) ON DELETE CASCADE,
    semester VARCHAR(20) NOT NULL,
    tahun_ajaran VARCHAR(20) NOT NULL,
    prediksi_prestasi VARCHAR(20) NOT NULL,
    confidence DECIMAL(5,4) CHECK (confidence >= 0 AND confidence <= 1),
    detail_faktor JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk optimasi query
CREATE INDEX idx_siswa_nilai ON nilai_raport(siswa_id, semester, tahun_ajaran);
CREATE INDEX idx_siswa_presensi ON presensi(siswa_id, semester, tahun_ajaran);
CREATE INDEX idx_siswa_penghasilan ON penghasilan_ortu(siswa_id);
CREATE INDEX idx_riwayat_prediksi_siswa ON riwayat_prediksi(siswa_id, created_at);
```

### **1.2 Data Input untuk C4.5**

```python
# backend/ml/data_models.py
from pydantic import BaseModel, Field
from typing import Optional, List
from decimal import Decimal

class SiswaData(BaseModel):
    """Model data siswa untuk ML"""
    id: int
    nama: str
    nis: str
    jenis_kelamin: str
    kelas: str

class NilaiData(BaseModel):
    """Model data nilai untuk ML"""
    siswa_id: int
    semester: str
    tahun_ajaran: str
    matematika: Decimal = Field(ge=0, le=100)
    bahasa_indonesia: Decimal = Field(ge=0, le=100)
    bahasa_inggris: Decimal = Field(ge=0, le=100)
    ipa: Decimal = Field(ge=0, le=100)
    bahasa_jawa: Decimal = Field(ge=0, le=100)
    pkn: Decimal = Field(ge=0, le=100)
    seni: Decimal = Field(ge=0, le=100)
    sejarah: Decimal = Field(ge=0, le=100)
    agama: Decimal = Field(ge=0, le=100)
    pjok: Decimal = Field(ge=0, le=100)
    dasar_kejuruan: Decimal = Field(ge=0, le=100)
    rata_rata: Optional[Decimal] = None

class PresensiData(BaseModel):
    """Model data presensi untuk ML"""
    siswa_id: int
    semester: str
    tahun_ajaran: str
    jumlah_hadir: int = Field(ge=0)
    jumlah_sakit: int = Field(ge=0)
    jumlah_izin: int = Field(ge=0)
    jumlah_alpa: int = Field(ge=0)
    persentase_kehadiran: Optional[Decimal] = None
    kategori_kehadiran: Optional[str] = None

class PenghasilanData(BaseModel):
    """Model data penghasilan untuk ML"""
    siswa_id: int
    penghasilan_ayah: int = Field(ge=0)
    penghasilan_ibu: int = Field(ge=0)
    total_penghasilan: Optional[int] = None
    kategori_penghasilan: Optional[str] = None

class MLDataset(BaseModel):
    """Model dataset lengkap untuk ML"""
    siswa_id: int
    nama_siswa: str
    rata_rata_nilai: Decimal
    persentase_kehadiran: Decimal
    kategori_penghasilan: str
    kategori_nilai: Optional[str] = None
    kategori_kehadiran: Optional[str] = None
    prestasi_target: Optional[str] = None
```

---

## 🔄 **2. PREPROCESSING DATA**

### **2.1 Data Extraction dari Database**

```python
# backend/ml/data_extraction.py
import pandas as pd
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

class DataExtractor:
    """Class untuk ekstraksi data dari database EduPro"""
    
    def __init__(self, db_session: Session):
        self.db = db_session
    
    def extract_complete_dataset(self) -> pd.DataFrame:
        """
        Ekstraksi dataset lengkap untuk training model C4.5
        
        Returns:
            pd.DataFrame: Dataset lengkap dengan semua fitur
        """
        query = text("""
            SELECT 
                s.id as siswa_id,
                s.nama as nama_siswa,
                s.jenis_kelamin,
                s.kelas,
                nr.semester,
                nr.tahun_ajaran,
                nr.rata_rata as rata_rata_nilai,
                p.persentase_kehadiran,
                p.kategori_kehadiran,
                po.kategori_penghasilan,
                po.total_penghasilan,
                -- Rule-based target labeling untuk supervised learning
                CASE 
                    WHEN nr.rata_rata >= 80 AND p.persentase_kehadiran >= 80 THEN 'Tinggi'
                    WHEN nr.rata_rata >= 70 AND p.persentase_kehadiran >= 75 THEN 'Sedang'
                    WHEN nr.rata_rata >= 60 AND p.persentase_kehadiran >= 70 THEN 'Sedang'
                    ELSE 'Rendah'
                END as prestasi_target
            FROM siswa s
            INNER JOIN nilai_raport nr ON s.id = nr.siswa_id
            INNER JOIN presensi p ON s.id = p.siswa_id 
                AND p.semester = nr.semester 
                AND p.tahun_ajaran = nr.tahun_ajaran
            INNER JOIN penghasilan_ortu po ON s.id = po.siswa_id
            WHERE 
                nr.rata_rata IS NOT NULL 
                AND nr.rata_rata > 0
                AND p.persentase_kehadiran IS NOT NULL
                AND po.kategori_penghasilan IS NOT NULL
            ORDER BY s.id, nr.tahun_ajaran, nr.semester
        """)
        
        try:
            df = pd.read_sql(query, self.db.bind)
            logger.info(f"Extracted {len(df)} records from database")
            return df
        except Exception as e:
            logger.error(f"Error extracting data: {str(e)}")
            raise
    
    def extract_siswa_data(self, siswa_id: int, semester: str, tahun_ajaran: str) -> Dict[str, Any]:
        """
        Ekstraksi data siswa spesifik untuk prediksi
        
        Args:
            siswa_id: ID siswa
            semester: Semester (Ganjil/Genap)
            tahun_ajaran: Tahun ajaran (format: 2023/2024)
            
        Returns:
            Dict: Data siswa lengkap
        """
        query = text("""
            SELECT 
                s.id as siswa_id,
                s.nama as nama_siswa,
                nr.rata_rata as rata_rata_nilai,
                p.persentase_kehadiran,
                p.kategori_kehadiran,
                po.kategori_penghasilan,
                po.total_penghasilan
            FROM siswa s
            LEFT JOIN nilai_raport nr ON s.id = nr.siswa_id 
                AND nr.semester = :semester 
                AND nr.tahun_ajaran = :tahun_ajaran
            LEFT JOIN presensi p ON s.id = p.siswa_id 
                AND p.semester = :semester 
                AND p.tahun_ajaran = :tahun_ajaran
            LEFT JOIN penghasilan_ortu po ON s.id = po.siswa_id
            WHERE s.id = :siswa_id
        """)
        
        try:
            result = self.db.execute(query, {
                'siswa_id': siswa_id,
                'semester': semester,
                'tahun_ajaran': tahun_ajaran
            }).fetchone()
            
            if not result:
                raise ValueError(f"Siswa dengan ID {siswa_id} tidak ditemukan")
            
            return dict(result._mapping)
        except Exception as e:
            logger.error(f"Error extracting siswa data: {str(e)}")
            raise

    def get_training_statistics(self) -> Dict[str, Any]:
        """
        Mendapatkan statistik dataset untuk training
        
        Returns:
            Dict: Statistik dataset
        """
        query = text("""
            SELECT 
                COUNT(*) as total_records,
                COUNT(DISTINCT s.id) as unique_students,
                AVG(nr.rata_rata) as avg_nilai,
                AVG(p.persentase_kehadiran) as avg_kehadiran,
                COUNT(CASE WHEN po.kategori_penghasilan = 'Tinggi' THEN 1 END) as penghasilan_tinggi,
                COUNT(CASE WHEN po.kategori_penghasilan = 'Sedang' THEN 1 END) as penghasilan_sedang,
                COUNT(CASE WHEN po.kategori_penghasilan = 'Rendah' THEN 1 END) as penghasilan_rendah
            FROM siswa s
            INNER JOIN nilai_raport nr ON s.id = nr.siswa_id
            INNER JOIN presensi p ON s.id = p.siswa_id
            INNER JOIN penghasilan_ortu po ON s.id = po.siswa_id
            WHERE nr.rata_rata IS NOT NULL AND p.persentase_kehadiran IS NOT NULL
        """)
        
        result = self.db.execute(query).fetchone()
        return dict(result._mapping) if result else {}
```

### **2.2 Feature Engineering dan Kategorisasi**

```python
# backend/ml/feature_engineering.py
import pandas as pd
import numpy as np
from typing import Tuple, List
import logging

logger = logging.getLogger(__name__)

class FeatureEngineer:
    """Class untuk feature engineering dataset EduPro"""
    
    @staticmethod
    def kategorisasi_nilai(nilai: float) -> str:
        """
        Kategorisasi nilai numerik menjadi kategori
        
        Args:
            nilai: Nilai rata-rata (0-100)
            
        Returns:
            str: Kategori nilai (Tinggi/Sedang/Rendah)
        """
        if pd.isna(nilai):
            return 'Rendah'
        
        if nilai >= 80:
            return 'Tinggi'
        elif nilai >= 70:
            return 'Sedang'
        else:
            return 'Rendah'
    
    @staticmethod
    def kategorisasi_kehadiran(kehadiran: float) -> str:
        """
        Kategorisasi persentase kehadiran
        
        Args:
            kehadiran: Persentase kehadiran (0-100)
            
        Returns:
            str: Kategori kehadiran (Tinggi/Sedang/Rendah)
        """
        if pd.isna(kehadiran):
            return 'Rendah'
        
        if kehadiran >= 80:
            return 'Tinggi'
        elif kehadiran >= 75:
            return 'Sedang'
        else:
            return 'Rendah'
    
    @staticmethod
    def validate_data(df: pd.DataFrame) -> pd.DataFrame:
        """
        Validasi dan cleaning data
        
        Args:
            df: DataFrame input
            
        Returns:
            pd.DataFrame: DataFrame yang sudah divalidasi
        """
        logger.info(f"Validating dataset with {len(df)} records")
        
        # Remove duplicates
        initial_count = len(df)
        df = df.drop_duplicates(subset=['siswa_id', 'semester', 'tahun_ajaran'])
        logger.info(f"Removed {initial_count - len(df)} duplicate records")
        
        # Validate nilai range
        df = df[
            (df['rata_rata_nilai'] >= 0) & 
            (df['rata_rata_nilai'] <= 100) &
            (df['persentase_kehadiran'] >= 0) & 
            (df['persentase_kehadiran'] <= 100)
        ]
        
        # Remove records with missing critical data
        df = df.dropna(subset=['rata_rata_nilai', 'persentase_kehadiran', 'kategori_penghasilan'])
        
        logger.info(f"Final dataset: {len(df)} valid records")
        return df
    
    def preprocess_features(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.Series]:
        """
        Preprocessing lengkap untuk dataset
        
        Args:
            df: DataFrame input
            
        Returns:
            Tuple[pd.DataFrame, pd.Series]: Features (X) dan target (y)
        """
        # Validasi data
        df = self.validate_data(df)
        
        if len(df) == 0:
            raise ValueError("No valid data available for training")
        
        # Feature engineering
        df['kategori_nilai'] = df['rata_rata_nilai'].apply(self.kategorisasi_nilai)
        df['kategori_kehadiran'] = df['persentase_kehadiran'].apply(self.kategorisasi_kehadiran)
        
        # Select features untuk C4.5 (categorical features)
        feature_columns = ['kategori_nilai', 'kategori_kehadiran', 'kategori_penghasilan']
        target_column = 'prestasi_target'
        
        # Validate required columns exist
        missing_cols = [col for col in feature_columns + [target_column] if col not in df.columns]
        if missing_cols:
            raise ValueError(f"Missing required columns: {missing_cols}")
        
        X = df[feature_columns].copy()
        y = df[target_column].copy()
        
        # Encode categorical features untuk scikit-learn
        X_encoded = pd.get_dummies(X, prefix=feature_columns)
        
        logger.info(f"Preprocessed features: {X_encoded.shape}")
        logger.info(f"Target distribution: {y.value_counts().to_dict()}")
        
        return X_encoded, y
    
    def prepare_prediction_input(self, siswa_data: Dict[str, Any]) -> pd.DataFrame:
        """
        Prepare input data untuk prediksi single record
        
        Args:
            siswa_data: Data siswa dari database
            
        Returns:
            pd.DataFrame: Features yang siap untuk prediksi
        """
        # Kategorisasi
        kategori_nilai = self.kategorisasi_nilai(float(siswa_data['rata_rata_nilai']))
        kategori_kehadiran = self.kategorisasi_kehadiran(float(siswa_data['persentase_kehadiran']))
        kategori_penghasilan = siswa_data['kategori_penghasilan']
        
        # Create DataFrame
        input_df = pd.DataFrame([{
            'kategori_nilai': kategori_nilai,
            'kategori_kehadiran': kategori_kehadiran,
            'kategori_penghasilan': kategori_penghasilan
        }])
        
        # Encode categorical features (harus konsisten dengan training)
        feature_columns = ['kategori_nilai', 'kategori_kehadiran', 'kategori_penghasilan']
        input_encoded = pd.get_dummies(input_df, prefix=feature_columns)
        
        return input_encoded
```

---

## 🧮 **3. KONSEP MATEMATIKA C4.5**

### **3.1 Entropy (Entropi)**

**Definisi Teoritis:**
Entropy mengukur tingkat ketidakpastian atau keacakan dalam dataset. Semakin tinggi entropy, semakin tidak teratur distribusi kelas dalam dataset.

**Formula Matematika:**
```
Entropy(S) = -Σ(i=1 to c) p_i * log₂(p_i)
```

Dimana:
- S = dataset
- c = jumlah kelas
- p_i = proporsi sampel yang termasuk kelas i
- log₂ = logaritma basis 2

**Implementasi Python:**

```python
# backend/ml/c45_math.py
import numpy as np
import pandas as pd
from typing import List, Dict, Any
import math

class C45Mathematics:
    """Class untuk implementasi konsep matematika C4.5"""
    
    @staticmethod
    def calculate_entropy(target_values: List[str]) -> float:
        """
        Menghitung entropy dari target values
        
        Args:
            target_values: List nilai target (prestasi_target)
            
        Returns:
            float: Nilai entropy
        """
        if not target_values:
            return 0.0
        
        # Hitung proporsi setiap kelas
        value_counts = pd.Series(target_values).value_counts()
        total_count = len(target_values)
        
        entropy = 0.0
        for count in value_counts:
            if count > 0:
                proportion = count / total_count
                entropy -= proportion * math.log2(proportion)
        
        return entropy
    
    @staticmethod
    def calculate_entropy_detailed(target_values: List[str]) -> Dict[str, Any]:
        """
        Menghitung entropy dengan detail perhitungan
        
        Args:
            target_values: List nilai target
            
        Returns:
            Dict: Detail perhitungan entropy
        """
        if not target_values:
            return {'entropy': 0.0, 'details': {}}
        
        value_counts = pd.Series(target_values).value_counts()
        total_count = len(target_values)
        
        details = {}
        entropy = 0.0
        
        for class_name, count in value_counts.items():
            proportion = count / total_count
            log_proportion = math.log2(proportion) if proportion > 0 else 0
            contribution = -proportion * log_proportion
            
            details[class_name] = {
                'count': count,
                'proportion': proportion,
                'log2_proportion': log_proportion,
                'contribution': contribution
            }
            
            entropy += contribution
        
        return {
            'entropy': entropy,
            'total_samples': total_count,
            'class_distribution': dict(value_counts),
            'details': details
        }

# Contoh perhitungan manual
def contoh_perhitungan_entropy():
    """
    Contoh perhitungan entropy untuk dataset EduPro
    """
    # Dataset contoh: 100 siswa
    target_values = (
        ['Tinggi'] * 40 +    # 40 siswa prestasi tinggi
        ['Sedang'] * 35 +    # 35 siswa prestasi sedang  
        ['Rendah'] * 25      # 25 siswa prestasi rendah
    )
    
    math_calc = C45Mathematics()
    result = math_calc.calculate_entropy_detailed(target_values)
    
    print("=== CONTOH PERHITUNGAN ENTROPY ===")
    print(f"Total sampel: {result['total_samples']}")
    print(f"Distribusi kelas: {result['class_distribution']}")
    print("\nDetail perhitungan:")
    
    for class_name, detail in result['details'].items():
        print(f"\nKelas {class_name}:")
        print(f"  Count: {detail['count']}")
        print(f"  Proporsi (p_i): {detail['proportion']:.3f}")
        print(f"  log₂(p_i): {detail['log2_proportion']:.3f}")
        print(f"  Kontribusi: -{detail['proportion']:.3f} × {detail['log2_proportion']:.3f} = {detail['contribution']:.3f}")
    
    print(f"\nEntropy total: {result['entropy']:.3f}")
    
    # Verifikasi manual
    p_tinggi = 40/100
    p_sedang = 35/100  
    p_rendah = 25/100
    
    manual_entropy = -(p_tinggi * math.log2(p_tinggi) + 
                      p_sedang * math.log2(p_sedang) + 
                      p_rendah * math.log2(p_rendah))
    
    print(f"Verifikasi manual: {manual_entropy:.3f}")
```

### **3.2 Information Gain**

**Definisi Teoritis:**
Information Gain mengukur seberapa baik suatu atribut memisahkan data berdasarkan kelas target. Atribut dengan Information Gain tertinggi dipilih sebagai node split.

**Formula Matematika:**
```
Gain(S, A) = Entropy(S) - Σ(v ∈ Values(A)) (|S_v|/|S|) × Entropy(S_v)
```

Dimana:
- S = dataset
- A = atribut yang diuji
- Values(A) = semua nilai yang mungkin dari atribut A
- S_v = subset dari S dimana atribut A memiliki nilai v
- |S_v| = jumlah sampel dalam S_v
- |S| = jumlah total sampel

**Implementasi Python:**

```python
class C45Mathematics:
    # ... kode sebelumnya ...
    
    @staticmethod
    def calculate_information_gain(df: pd.DataFrame, attribute: str, target: str) -> Dict[str, Any]:
        """
        Menghitung Information Gain untuk suatu atribut
        
        Args:
            df: DataFrame dengan data
            attribute: Nama kolom atribut
            target: Nama kolom target
            
        Returns:
            Dict: Detail perhitungan Information Gain
        """
        # Entropy dataset keseluruhan
        total_entropy = C45Mathematics.calculate_entropy(df[target].tolist())
        
        # Hitung weighted entropy untuk setiap nilai atribut
        total_samples = len(df)
        weighted_entropy = 0.0
        attribute_details = {}
        
        for value in df[attribute].unique():
            subset = df[df[attribute] == value]
            subset_size = len(subset)
            subset_entropy = C45Mathematics.calculate_entropy(subset[target].tolist())
            weight = subset_size / total_samples
            weighted_contribution = weight * subset_entropy
            
            attribute_details[value] = {
                'subset_size': subset_size,
                'weight': weight,
                'entropy': subset_entropy,
                'weighted_contribution': weighted_contribution,
                'class_distribution': subset[target].value_counts().to_dict()
            }
            
            weighted_entropy += weighted_contribution
        
        information_gain = total_entropy - weighted_entropy
        
        return {
            'attribute': attribute,
            'total_entropy': total_entropy,
            'weighted_entropy': weighted_entropy,
            'information_gain': information_gain,
            'total_samples': total_samples,
            'attribute_details': attribute_details
        }

# Contoh perhitungan Information Gain
def contoh_perhitungan_information_gain():
    """
    Contoh perhitungan Information Gain untuk atribut 'kategori_nilai'
    """
    # Dataset contoh
    data = {
        'kategori_nilai': ['Tinggi']*30 + ['Sedang']*40 + ['Rendah']*30,
        'prestasi_target': (
            ['Tinggi']*25 + ['Sedang']*4 + ['Rendah']*1 +      # kategori_nilai = Tinggi
            ['Tinggi']*12 + ['Sedang']*20 + ['Rendah']*8 +     # kategori_nilai = Sedang
            ['Tinggi']*3 + ['Sedang']*11 + ['Rendah']*16       # kategori_nilai = Rendah
        )
    }
    
    df = pd.DataFrame(data)
    
    math_calc = C45Mathematics()
    result = math_calc.calculate_information_gain(df, 'kategori_nilai', 'prestasi_target')
    
    print("=== CONTOH PERHITUNGAN INFORMATION GAIN ===")
    print(f"Atribut: {result['attribute']}")
    print(f"Total entropy: {result['total_entropy']:.3f}")
    print(f"Total sampel: {result['total_samples']}")
    
    print("\nDetail per nilai atribut:")
    for value, detail in result['attribute_details'].items():
        print(f"\nKategori Nilai = {value}:")
        print(f"  Jumlah sampel: {detail['subset_size']}")
        print(f"  Weight: {detail['weight']:.3f}")
        print(f"  Entropy: {detail['entropy']:.3f}")
        print(f"  Weighted contribution: {detail['weighted_contribution']:.3f}")
        print(f"  Distribusi kelas: {detail['class_distribution']}")
    
    print(f"\nWeighted entropy: {result['weighted_entropy']:.3f}")
    print(f"Information Gain: {result['information_gain']:.3f}")
```

Dokumentasi ini akan dilanjutkan dengan bagian-bagian berikutnya. Apakah Anda ingin saya melanjutkan dengan bagian selanjutnya? 