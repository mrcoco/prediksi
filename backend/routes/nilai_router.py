from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db, NilaiRaport, Siswa
from schemas import NilaiRaportCreate, NilaiRaportUpdate, NilaiRaportResponse
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=NilaiRaportResponse, status_code=status.HTTP_201_CREATED)
def create_nilai(nilai: NilaiRaportCreate, db: Session = Depends(get_db)):
    # Cek apakah siswa ada
    siswa = db.query(Siswa).filter(Siswa.id == nilai.siswa_id).first()
    if not siswa:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Siswa dengan ID {nilai.siswa_id} tidak ditemukan"
        )
    
    # Cek apakah nilai untuk semester dan tahun ajaran ini sudah ada
    existing_nilai = db.query(NilaiRaport).filter(
        NilaiRaport.siswa_id == nilai.siswa_id,
        NilaiRaport.semester == nilai.semester,
        NilaiRaport.tahun_ajaran == nilai.tahun_ajaran
    ).first()
    
    if existing_nilai:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Nilai untuk siswa ID {nilai.siswa_id} pada semester {nilai.semester} tahun ajaran {nilai.tahun_ajaran} sudah ada"
        )
    
    # Hitung nilai rata-rata
    nilai_dict = nilai.dict()
    matematika = nilai_dict.get('matematika', 0)
    bahasa_indonesia = nilai_dict.get('bahasa_indonesia', 0)
    bahasa_inggris = nilai_dict.get('bahasa_inggris', 0)
    bahasa_jawa = nilai_dict.get('bahasa_jawa', 0)
    ipa = nilai_dict.get('ipa', 0)
    agama = nilai_dict.get('agama', 0)
    pjok = nilai_dict.get('pjok', 0)
    pkn = nilai_dict.get('pkn', 0)
    sejarah = nilai_dict.get('sejarah', 0)
    seni = nilai_dict.get('seni', 0)
    dasar_kejuruan = nilai_dict.get('dasar_kejuruan', 0)
    
    # Hitung rata-rata
    rata_rata = (matematika + bahasa_indonesia + bahasa_inggris + bahasa_jawa + ipa + agama + pjok + pkn + sejarah + seni+ dasar_kejuruan) / 11
    nilai_dict['rata_rata'] = rata_rata
    
    # Buat objek nilai baru
    new_nilai = NilaiRaport(**nilai_dict)
    
    # Simpan ke database
    db.add(new_nilai)
    db.commit()
    db.refresh(new_nilai)
    
    return new_nilai

@router.get("/", response_model=List[NilaiRaportResponse])
def get_all_nilai(skip: int = 0, limit: int = 100, siswa_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(NilaiRaport)
    
    # Filter berdasarkan siswa_id jika ada
    if siswa_id:
        query = query.filter(NilaiRaport.siswa_id == siswa_id)
    
    # Ambil data dengan pagination
    nilai_list = query.offset(skip).limit(limit).all()
    return nilai_list

@router.get("/{nilai_id}", response_model=NilaiRaportResponse)
def get_nilai(nilai_id: int, db: Session = Depends(get_db)):
    nilai = db.query(NilaiRaport).filter(NilaiRaport.id == nilai_id).first()
    if not nilai:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Nilai dengan ID {nilai_id} tidak ditemukan"
        )
    return nilai

@router.put("/{nilai_id}", response_model=NilaiRaportResponse)
def update_nilai(nilai_id: int, nilai_update: NilaiRaportUpdate, db: Session = Depends(get_db)):
    # Cari nilai yang akan diupdate
    db_nilai = db.query(NilaiRaport).filter(NilaiRaport.id == nilai_id).first()
    if not db_nilai:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Nilai dengan ID {nilai_id} tidak ditemukan"
        )
    
    # Update data nilai
    update_data = nilai_update.dict(exclude_unset=True)
    
    # Hitung rata-rata jika ada perubahan nilai
    nilai_fields = ['matematika', 'bahasa_indonesia', 'bahasa_inggris', 'bahasa_jawa', 'ipa', 'agama', 'pjok', 'pkn', 'sejarah', 'seni', 'dasar_kejuruan']
    nilai_updated = False
    
    for field in nilai_fields:
        if field in update_data:
            nilai_updated = True
            break
    
    if nilai_updated:
        # Ambil nilai terbaru untuk perhitungan rata-rata (11 mata pelajaran)
        matematika = update_data.get('matematika', db_nilai.matematika or 0)
        bahasa_indonesia = update_data.get('bahasa_indonesia', db_nilai.bahasa_indonesia or 0)
        bahasa_inggris = update_data.get('bahasa_inggris', db_nilai.bahasa_inggris or 0)
        bahasa_jawa = update_data.get('bahasa_jawa', db_nilai.bahasa_jawa or 0)
        ipa = update_data.get('ipa', db_nilai.ipa or 0)
        agama = update_data.get('agama', db_nilai.agama or 0)
        pjok = update_data.get('pjok', db_nilai.pjok or 0)
        pkn = update_data.get('pkn', db_nilai.pkn or 0)
        sejarah = update_data.get('sejarah', db_nilai.sejarah or 0)
        seni = update_data.get('seni', db_nilai.seni or 0)
        dasar_kejuruan = update_data.get('dasar_kejuruan', db_nilai.dasar_kejuruan or 0)
        
        # Hitung rata-rata (11 mata pelajaran)
        rata_rata = (matematika + bahasa_indonesia + bahasa_inggris + bahasa_jawa + ipa + agama + pjok + pkn + sejarah + seni + dasar_kejuruan) / 11
        update_data['rata_rata'] = rata_rata
    
    # Update data
    for key, value in update_data.items():
        setattr(db_nilai, key, value)
    
    # Update timestamp
    db_nilai.updated_at = datetime.now()
    
    # Simpan perubahan
    db.commit()
    db.refresh(db_nilai)
    
    return db_nilai

@router.delete("/{nilai_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_nilai(nilai_id: int, db: Session = Depends(get_db)):
    # Cari nilai yang akan dihapus
    db_nilai = db.query(NilaiRaport).filter(NilaiRaport.id == nilai_id).first()
    if not db_nilai:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Nilai dengan ID {nilai_id} tidak ditemukan"
        )
    
    # Hapus nilai
    db.delete(db_nilai)
    db.commit()
    
    return None