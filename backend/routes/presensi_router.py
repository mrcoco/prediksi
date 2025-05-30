from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db, Presensi, Siswa
from schemas import PresensiCreate, PresensiUpdate, PresensiResponse
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=PresensiResponse, status_code=status.HTTP_201_CREATED)
def create_presensi(presensi: PresensiCreate, db: Session = Depends(get_db)):
    # Cek apakah siswa ada
    siswa = db.query(Siswa).filter(Siswa.id == presensi.siswa_id).first()
    if not siswa:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Siswa dengan ID {presensi.siswa_id} tidak ditemukan"
        )
    
    # Cek apakah presensi untuk semester dan tahun ajaran ini sudah ada
    existing_presensi = db.query(Presensi).filter(
        Presensi.siswa_id == presensi.siswa_id,
        Presensi.semester == presensi.semester,
        Presensi.tahun_ajaran == presensi.tahun_ajaran
    ).first()
    
    if existing_presensi:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Presensi untuk siswa ID {presensi.siswa_id} pada semester {presensi.semester} tahun ajaran {presensi.tahun_ajaran} sudah ada"
        )
    
    # Buat objek presensi baru
    new_presensi = Presensi(**presensi.dict())
    
    # Simpan ke database
    db.add(new_presensi)
    db.commit()
    db.refresh(new_presensi)
    
    return new_presensi

@router.get("/", response_model=List[PresensiResponse])
def get_all_presensi(skip: int = 0, limit: int = 100, siswa_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(Presensi)
    
    # Filter berdasarkan siswa_id jika ada
    if siswa_id:
        query = query.filter(Presensi.siswa_id == siswa_id)
    
    # Ambil data dengan pagination
    presensi_list = query.offset(skip).limit(limit).all()
    return presensi_list

@router.get("/{presensi_id}", response_model=PresensiResponse)
def get_presensi(presensi_id: int, db: Session = Depends(get_db)):
    presensi = db.query(Presensi).filter(Presensi.id == presensi_id).first()
    if not presensi:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Presensi dengan ID {presensi_id} tidak ditemukan"
        )
    return presensi

@router.put("/{presensi_id}", response_model=PresensiResponse)
def update_presensi(presensi_id: int, presensi_update: PresensiUpdate, db: Session = Depends(get_db)):
    # Cari presensi yang akan diupdate
    db_presensi = db.query(Presensi).filter(Presensi.id == presensi_id).first()
    if not db_presensi:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Presensi dengan ID {presensi_id} tidak ditemukan"
        )
    
    # Update data presensi
    update_data = presensi_update.dict(exclude_unset=True)
    
    # Hitung persentase kehadiran jika ada perubahan jumlah kehadiran
    kehadiran_fields = ['jumlah_hadir', 'jumlah_sakit', 'jumlah_izin', 'jumlah_alpa']
    kehadiran_updated = False
    
    for field in kehadiran_fields:
        if field in update_data:
            kehadiran_updated = True
            break
    
    if kehadiran_updated:
        # Ambil nilai terbaru untuk perhitungan persentase
        jumlah_hadir = update_data.get('jumlah_hadir', db_presensi.jumlah_hadir)
        jumlah_sakit = update_data.get('jumlah_sakit', db_presensi.jumlah_sakit)
        jumlah_izin = update_data.get('jumlah_izin', db_presensi.jumlah_izin)
        jumlah_alpa = update_data.get('jumlah_alpa', db_presensi.jumlah_alpa)
        
        # Hitung total hari
        total_hari = jumlah_hadir + jumlah_sakit + jumlah_izin + jumlah_alpa
        
        # Hitung persentase kehadiran
        if total_hari > 0:
            persentase_kehadiran = (jumlah_hadir / total_hari) * 100
        else:
            persentase_kehadiran = 0
        
        update_data['persentase_kehadiran'] = persentase_kehadiran
        
        # Tentukan kategori kehadiran
        if persentase_kehadiran >= 80:
            kategori = "Tinggi"
        elif persentase_kehadiran >= 75:
            kategori = "Sedang"
        else:
            kategori = "Rendah"
        
        update_data['kategori_kehadiran'] = kategori
    
    # Update data
    for key, value in update_data.items():
        setattr(db_presensi, key, value)
    
    # Update timestamp
    db_presensi.updated_at = datetime.now()
    
    # Simpan perubahan
    db.commit()
    db.refresh(db_presensi)
    
    return db_presensi

@router.delete("/{presensi_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_presensi(presensi_id: int, db: Session = Depends(get_db)):
    # Cari presensi yang akan dihapus
    db_presensi = db.query(Presensi).filter(Presensi.id == presensi_id).first()
    if not db_presensi:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Presensi dengan ID {presensi_id} tidak ditemukan"
        )
    
    # Hapus presensi
    db.delete(db_presensi)
    db.commit()
    
    return None