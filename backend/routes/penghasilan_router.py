from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db, PenghasilanOrtu, Siswa
from schemas import PenghasilanOrtuCreate, PenghasilanOrtuUpdate, PenghasilanOrtuResponse
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=PenghasilanOrtuResponse, status_code=status.HTTP_201_CREATED)
def create_penghasilan(penghasilan: PenghasilanOrtuCreate, db: Session = Depends(get_db)):
    # Cek apakah siswa ada
    siswa = db.query(Siswa).filter(Siswa.id == penghasilan.siswa_id).first()
    if not siswa:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Siswa dengan ID {penghasilan.siswa_id} tidak ditemukan"
        )
    
    # Cek apakah data penghasilan untuk siswa ini sudah ada
    existing_penghasilan = db.query(PenghasilanOrtu).filter(
        PenghasilanOrtu.siswa_id == penghasilan.siswa_id
    ).first()
    
    if existing_penghasilan:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Data penghasilan untuk siswa ID {penghasilan.siswa_id} sudah ada"
        )
    
    # Buat objek penghasilan baru
    new_penghasilan = PenghasilanOrtu(**penghasilan.dict())
    
    # Simpan ke database
    db.add(new_penghasilan)
    db.commit()
    db.refresh(new_penghasilan)
    
    return new_penghasilan

@router.get("/", response_model=List[PenghasilanOrtuResponse])
def get_all_penghasilan(skip: int = 0, limit: int = 100, siswa_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(PenghasilanOrtu)
    
    # Filter berdasarkan siswa_id jika ada
    if siswa_id:
        query = query.filter(PenghasilanOrtu.siswa_id == siswa_id)
    
    # Ambil data dengan pagination
    penghasilan_list = query.offset(skip).limit(limit).all()
    return penghasilan_list

@router.get("/{penghasilan_id}", response_model=PenghasilanOrtuResponse)
def get_penghasilan(penghasilan_id: int, db: Session = Depends(get_db)):
    penghasilan = db.query(PenghasilanOrtu).filter(PenghasilanOrtu.id == penghasilan_id).first()
    if not penghasilan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Data penghasilan dengan ID {penghasilan_id} tidak ditemukan"
        )
    return penghasilan

@router.put("/{penghasilan_id}", response_model=PenghasilanOrtuResponse)
def update_penghasilan(penghasilan_id: int, penghasilan_update: PenghasilanOrtuUpdate, db: Session = Depends(get_db)):
    # Cari penghasilan yang akan diupdate
    db_penghasilan = db.query(PenghasilanOrtu).filter(PenghasilanOrtu.id == penghasilan_id).first()
    if not db_penghasilan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Data penghasilan dengan ID {penghasilan_id} tidak ditemukan"
        )
    
    # Update data penghasilan
    update_data = penghasilan_update.dict(exclude_unset=True)
    
    # Hitung total penghasilan jika ada perubahan penghasilan
    if 'penghasilan_ayah' in update_data or 'penghasilan_ibu' in update_data:
        # Ambil nilai terbaru untuk perhitungan total
        penghasilan_ayah = update_data.get('penghasilan_ayah', db_penghasilan.penghasilan_ayah)
        penghasilan_ibu = update_data.get('penghasilan_ibu', db_penghasilan.penghasilan_ibu)
        
        # Hitung total penghasilan
        total_penghasilan = penghasilan_ayah + penghasilan_ibu
        update_data['total_penghasilan'] = total_penghasilan
        
        # Tentukan kategori penghasilan
        if total_penghasilan >= 5000000:  # 5 juta ke atas 2x UMK jogja
            kategori = "Tinggi"
        elif total_penghasilan >= 2300000:  # 2,3 juta - 5jt ke atas UMK jogja
            kategori = "Menengah"
        else:  # Di bawah 2,3 juta
            kategori = "Rendah"
        
        update_data['kategori_penghasilan'] = kategori
    
    # Update data
    for key, value in update_data.items():
        setattr(db_penghasilan, key, value)
    
    # Update timestamp
    db_penghasilan.updated_at = datetime.now()
    
    # Simpan perubahan
    db.commit()
    db.refresh(db_penghasilan)
    
    return db_penghasilan

@router.delete("/{penghasilan_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_penghasilan(penghasilan_id: int, db: Session = Depends(get_db)):
    # Cari penghasilan yang akan dihapus
    db_penghasilan = db.query(PenghasilanOrtu).filter(PenghasilanOrtu.id == penghasilan_id).first()
    if not db_penghasilan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Data penghasilan dengan ID {penghasilan_id} tidak ditemukan"
        )
    
    # Hapus penghasilan
    db.delete(db_penghasilan)
    db.commit()
    
    return None