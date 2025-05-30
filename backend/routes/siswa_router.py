from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional, Dict
from database import get_db, Siswa
from schemas import SiswaCreate, SiswaUpdate, SiswaResponse
from datetime import datetime
from routes.auth_router import get_current_user
from models.user import User

router = APIRouter()

@router.post("/", response_model=SiswaResponse, status_code=status.HTTP_201_CREATED)
def create_siswa(
    siswa: SiswaCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Cek apakah NIS sudah ada
    db_siswa = db.query(Siswa).filter(Siswa.nis == siswa.nis).first()
    if db_siswa:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Siswa dengan NIS {siswa.nis} sudah terdaftar"
        )
    
    # Buat objek siswa baru
    new_siswa = Siswa(
        nama=siswa.nama,
        nis=siswa.nis,
        jenis_kelamin=siswa.jenis_kelamin,
        kelas=siswa.kelas,
        tanggal_lahir=siswa.tanggal_lahir,
        alamat=siswa.alamat
    )
    
    # Simpan ke database
    db.add(new_siswa)
    db.commit()
    db.refresh(new_siswa)
    
    return new_siswa

@router.get("/", response_model=List[SiswaResponse])
def get_all_siswa(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Siswa)
    
    # Filter berdasarkan pencarian
    if search:
        query = query.filter(
            Siswa.nama.ilike(f"%{search}%") | 
            Siswa.nis.ilike(f"%{search}%") |
            Siswa.kelas.ilike(f"%{search}%")
        )
    
    # Ambil data dengan pagination
    siswa = query.offset(skip).limit(limit).all()
    return siswa

@router.get("/{siswa_id}", response_model=SiswaResponse)
def get_siswa(
    siswa_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    siswa = db.query(Siswa).filter(Siswa.id == siswa_id).first()
    if not siswa:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Siswa dengan ID {siswa_id} tidak ditemukan"
        )
    return siswa

@router.put("/{siswa_id}", response_model=SiswaResponse)
def update_siswa(
    siswa_id: int,
    siswa_update: SiswaUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Cari siswa yang akan diupdate
    db_siswa = db.query(Siswa).filter(Siswa.id == siswa_id).first()
    if not db_siswa:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Siswa dengan ID {siswa_id} tidak ditemukan"
        )
    
    # Cek apakah NIS sudah digunakan oleh siswa lain
    if siswa_update.nis and siswa_update.nis != db_siswa.nis:
        existing_siswa = db.query(Siswa).filter(Siswa.nis == siswa_update.nis).first()
        if existing_siswa:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"NIS {siswa_update.nis} sudah digunakan oleh siswa lain"
            )
    
    # Update data siswa
    update_data = siswa_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_siswa, key, value)
    
    # Update timestamp
    db_siswa.updated_at = datetime.now()
    
    # Simpan perubahan
    db.commit()
    db.refresh(db_siswa)
    
    return db_siswa

@router.delete("/{siswa_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_siswa(
    siswa_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Cari siswa yang akan dihapus
    db_siswa = db.query(Siswa).filter(Siswa.id == siswa_id).first()
    if not db_siswa:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Siswa dengan ID {siswa_id} tidak ditemukan"
        )
    
    # Hapus siswa
    db.delete(db_siswa)
    db.commit()
    
    return None

@router.get("/dropdown", response_model=List[Dict])
def get_siswa_dropdown(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mendapatkan daftar siswa untuk dropdown"""
    siswa_list = db.query(Siswa.id, Siswa.nama, Siswa.kelas).order_by(Siswa.nama).all()
    
    # Format data untuk dropdown
    result = []
    for siswa in siswa_list:
        result.append({
            "id": siswa.id,
            "text": f"{siswa.nama} ({siswa.kelas})"
        })
    
    return result