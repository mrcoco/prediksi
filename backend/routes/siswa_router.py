from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Optional, Dict
from database import get_db, Siswa
from schemas import SiswaCreate, SiswaUpdate, SiswaResponse
from datetime import datetime
from routes.auth_router import get_current_user
from models.user import User
import pandas as pd
from io import BytesIO
from sqlalchemy.exc import IntegrityError

router = APIRouter()

@router.post("/upload/excel")
async def upload_siswa_excel(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File harus berformat Excel (.xlsx atau .xls)"
        )
    
    try:
        # Baca file Excel
        contents = await file.read()
        df = pd.read_excel(BytesIO(contents))
        
        # Validasi kolom yang diperlukan
        required_columns = ['Nama', 'NIS', 'Jenis Kelamin', 'Kelas', 'Tanggal Lahir', 'Alamat']
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Kolom yang diperlukan tidak ditemukan: {', '.join(missing_columns)}"
            )
        
        # Proses setiap baris data
        success_count = 0
        error_count = 0
        for index, row in df.iterrows():
            try:
                # Cek apakah NIS sudah ada
                existing_siswa = db.query(Siswa).filter(Siswa.nis == str(row['NIS'])).first()
                if existing_siswa:
                    error_count += 1
                    continue
                
                # Buat objek siswa baru
                new_siswa = Siswa(
                    nama=row['Nama'],
                    nis=str(row['NIS']),
                    jenis_kelamin=row['Jenis Kelamin'],
                    kelas=str(row['Kelas']),
                    tanggal_lahir=pd.to_datetime(row['Tanggal Lahir']).date(),
                    alamat=row['Alamat'] if pd.notna(row['Alamat']) else None
                )
                
                db.add(new_siswa)
                success_count += 1
                
            except Exception as e:
                error_count += 1
                continue
        
        # Commit perubahan ke database
        db.commit()
        
        return {
            "status": "success",
            "message": f"Berhasil mengupload {success_count} data siswa. {error_count} data gagal diproses."
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/export/excel")
def export_siswa_excel(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Ambil semua data siswa
    siswa = db.query(Siswa).all()
    
    # Konversi data siswa ke DataFrame
    data = [{
        'ID': s.id,
        'Nama': s.nama,
        'NIS': s.nis,
        'Jenis Kelamin': s.jenis_kelamin,
        'Kelas': s.kelas,
        'Tanggal Lahir': s.tanggal_lahir.strftime('%Y-%m-%d'),
        'Alamat': s.alamat,
        'Dibuat': s.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        'Diperbarui': s.updated_at.strftime('%Y-%m-%d %H:%M:%S') if s.updated_at else ''
    } for s in siswa]
    
    df = pd.DataFrame(data)
    
    # Buat file Excel di memory
    output = BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name='Data Siswa')
    
    output.seek(0)
    
    # Return file Excel sebagai response
    headers = {
        'Content-Disposition': 'attachment; filename=Data_Siswa.xlsx'
    }
    return StreamingResponse(
        output,
        media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        headers=headers
    )

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