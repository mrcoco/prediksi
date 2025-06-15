from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# Schema untuk Siswa
class SiswaBase(BaseModel):
    nama: str
    nis: str
    jenis_kelamin: str
    kelas: str
    tanggal_lahir: datetime
    alamat: Optional[str] = None

class SiswaCreate(SiswaBase):
    pass

class SiswaUpdate(BaseModel):
    nama: Optional[str] = None
    nis: Optional[str] = None
    jenis_kelamin: Optional[str] = None
    kelas: Optional[str] = None
    tanggal_lahir: Optional[datetime] = None
    alamat: Optional[str] = None

class SiswaResponse(SiswaBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

# Schema untuk NilaiRaport
class NilaiRaportBase(BaseModel):
    siswa_id: int
    semester: str
    tahun_ajaran: str
    matematika: float
    bahasa_indonesia: float
    bahasa_inggris: float
    ipa: float
    bahasa_jawa: float
    agama: float
    pjok: float
    pkn: float
    sejarah: float
    seni: float
    dasar_kejuruan: float
    rata_rata: float

class NilaiRaportCreate(NilaiRaportBase):
    pass

class NilaiRaportUpdate(BaseModel):
    semester: Optional[str] = None
    tahun_ajaran: Optional[str] = None
    matematika: Optional[float] = None
    bahasa_indonesia: Optional[float] = None
    bahasa_inggris: Optional[float] = None
    ipa: Optional[float] = None
    bahasa_jawa: Optional[float] = None
    agama: Optional[float] = None
    pjok: Optional[float] = None
    pkn: Optional[float] = None
    sejarah: Optional[float] = None
    seni: Optional[float] = None
    dasar_kejuruan: Optional[float] = None
    rata_rata: Optional[float] = None

class NilaiRaportResponse(NilaiRaportBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

# Schema untuk PenghasilanOrtu
class PenghasilanOrtuBase(BaseModel):
    siswa_id: int
    penghasilan_ayah: float
    penghasilan_ibu: float
    pekerjaan_ayah: str
    pekerjaan_ibu: str
    pendidikan_ayah: str
    pendidikan_ibu: str
    total_penghasilan: float
    kategori_penghasilan: str

class PenghasilanOrtuCreate(BaseModel):
    siswa_id: int
    penghasilan_ayah: float
    penghasilan_ibu: float
    pekerjaan_ayah: str
    pekerjaan_ibu: str
    pendidikan_ayah: str
    pendidikan_ibu: str

class PenghasilanOrtuUpdate(BaseModel):
    penghasilan_ayah: Optional[float] = None
    penghasilan_ibu: Optional[float] = None
    pekerjaan_ayah: Optional[str] = None
    pekerjaan_ibu: Optional[str] = None
    pendidikan_ayah: Optional[str] = None
    pendidikan_ibu: Optional[str] = None
    total_penghasilan: Optional[float] = None
    kategori_penghasilan: Optional[str] = None

class PenghasilanOrtuResponse(PenghasilanOrtuBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

# Schema untuk Presensi
class PresensiBase(BaseModel):
    siswa_id: int
    semester: str
    tahun_ajaran: str
    jumlah_hadir: int
    jumlah_sakit: int
    jumlah_izin: int
    jumlah_alpa: int
    persentase_kehadiran: float
    kategori_kehadiran: str

class PresensiCreate(BaseModel):
    siswa_id: int
    semester: str
    tahun_ajaran: str
    jumlah_hadir: int
    jumlah_sakit: int
    jumlah_izin: int
    jumlah_alpa: int

class PresensiUpdate(BaseModel):
    semester: Optional[str] = None
    tahun_ajaran: Optional[str] = None
    jumlah_hadir: Optional[int] = None
    jumlah_sakit: Optional[int] = None
    jumlah_izin: Optional[int] = None
    jumlah_alpa: Optional[int] = None
    persentase_kehadiran: Optional[float] = None
    kategori_kehadiran: Optional[str] = None

class PresensiResponse(PresensiBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

# Schema untuk Prestasi (Hasil Prediksi)
class PrestasiBase(BaseModel):
    siswa_id: int
    semester: str
    tahun_ajaran: str
    prediksi_prestasi: str
    confidence: float

class PrestasiCreate(PrestasiBase):
    pass

class PrestasiUpdate(BaseModel):
    semester: Optional[str] = None
    tahun_ajaran: Optional[str] = None
    prediksi_prestasi: Optional[str] = None
    confidence: Optional[float] = None

class PrestasiResponse(PrestasiBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

# Schema untuk request prediksi
class PrediksiRequest(BaseModel):
    siswa_id: int
    semester: str
    tahun_ajaran: str

# Schema untuk response prediksi
class PrediksiResponse(BaseModel):
    siswa_id: int
    nama_siswa: str
    prediksi_prestasi: str
    confidence: float
    detail_faktor: dict