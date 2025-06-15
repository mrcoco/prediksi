from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import os
from datetime import datetime

# Mendapatkan URL database dari environment variable
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db:5432/prestasi_siswa")

# Membuat engine database
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Model untuk tabel Siswa
class Siswa(Base):
    __tablename__ = "siswa"
    
    id = Column(Integer, primary_key=True, index=True)
    nama = Column(String, index=True)
    nis = Column(String, unique=True, index=True)
    jenis_kelamin = Column(String)
    kelas = Column(String)
    tanggal_lahir = Column(DateTime)
    alamat = Column(Text)
    created_at = Column(DateTime, default=datetime.now, nullable=False)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now, nullable=False)
    
    # Relasi ke tabel lain
    nilai_raport = relationship("NilaiRaport", back_populates="siswa")
    penghasilan_ortu = relationship("PenghasilanOrtu", back_populates="siswa")
    presensi = relationship("Presensi", back_populates="siswa")
    prestasi = relationship("Prestasi", back_populates="siswa")

# Model untuk tabel NilaiRaport
class NilaiRaport(Base):
    __tablename__ = "nilai_raport"
    
    id = Column(Integer, primary_key=True, index=True)
    siswa_id = Column(Integer, ForeignKey("siswa.id"))
    semester = Column(String)
    tahun_ajaran = Column(String)
    matematika = Column(Float)
    bahasa_indonesia = Column(Float)
    bahasa_inggris = Column(Float)
    bahasa_jawa = Column(Float)
    ipa = Column(Float)
    agama = Column(Float)
    pjok = Column(Float)
    pkn = Column(Float)
    sejarah = Column(Float)
    seni = Column(Float)
    dasar_kejuruan = Column(Float)
    
    
    rata_rata = Column(Float)
    created_at = Column(DateTime, default=datetime.now, nullable=False)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now, nullable=False)
    
    # Relasi ke tabel Siswa
    siswa = relationship("Siswa", back_populates="nilai_raport")

# Model untuk tabel PenghasilanOrtu
class PenghasilanOrtu(Base):
    __tablename__ = "penghasilan_ortu"
    
    id = Column(Integer, primary_key=True, index=True)
    siswa_id = Column(Integer, ForeignKey("siswa.id"))
    penghasilan_ayah = Column(Float)
    penghasilan_ibu = Column(Float)
    pekerjaan_ayah = Column(String)
    pekerjaan_ibu = Column(String)
    pendidikan_ayah = Column(String)
    pendidikan_ibu = Column(String)
    total_penghasilan = Column(Float)
    kategori_penghasilan = Column(String)  # Rendah, Menengah, Tinggi
    created_at = Column(DateTime, default=datetime.now, nullable=False)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now, nullable=False)
    
    # Relasi ke tabel Siswa
    siswa = relationship("Siswa", back_populates="penghasilan_ortu")

# Model untuk tabel Presensi
class Presensi(Base):
    __tablename__ = "presensi"
    
    id = Column(Integer, primary_key=True, index=True)
    siswa_id = Column(Integer, ForeignKey("siswa.id"))
    semester = Column(String)
    tahun_ajaran = Column(String)
    jumlah_hadir = Column(Integer)
    jumlah_sakit = Column(Integer)
    jumlah_izin = Column(Integer)
    jumlah_alpa = Column(Integer)
    persentase_kehadiran = Column(Float)
    kategori_kehadiran = Column(String)  # Rendah, Sedang, Tinggi
    created_at = Column(DateTime, default=datetime.now, nullable=False)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now, nullable=False)
    
    # Relasi ke tabel Siswa
    siswa = relationship("Siswa", back_populates="presensi")

# Model untuk tabel Prestasi
class Prestasi(Base):
    __tablename__ = "prestasi"
    
    id = Column(Integer, primary_key=True, index=True)
    siswa_id = Column(Integer, ForeignKey("siswa.id"))
    semester = Column(String)
    tahun_ajaran = Column(String)
    prediksi_prestasi = Column(String)  # Rendah, Sedang, Tinggi
    confidence = Column(Float)
    created_at = Column(DateTime, default=datetime.now, nullable=False)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now, nullable=False)
    
    # Relasi ke tabel Siswa
    siswa = relationship("Siswa", back_populates="prestasi")

# Fungsi untuk mendapatkan koneksi database
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Fungsi untuk inisialisasi database
def init_db():
    Base.metadata.create_all(bind=engine)