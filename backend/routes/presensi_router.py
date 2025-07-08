from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db, Presensi, Siswa
from schemas import PresensiCreate, PresensiUpdate, PresensiResponse
from datetime import datetime
from routes.auth_router import get_current_user
from models.user import User
import pandas as pd
from io import BytesIO
import logging

# Cache imports
from cache_config import invalidate_student_cache, cache_health_check

# Model accuracy management
from model_accuracy_manager import model_accuracy_manager

router = APIRouter()

@router.post("/", response_model=PresensiResponse, status_code=status.HTTP_201_CREATED)
def create_presensi(
    presensi: PresensiCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
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
    
    # Hitung persentase kehadiran
    total_hari = presensi.jumlah_hadir + presensi.jumlah_sakit + presensi.jumlah_izin + presensi.jumlah_alpa
    
    if total_hari > 0:
        persentase_kehadiran = (presensi.jumlah_hadir / total_hari) * 100
    else:
        persentase_kehadiran = 0
    
    # Tentukan kategori kehadiran
    if persentase_kehadiran >= 80:
        kategori_kehadiran = "Tinggi"
    elif persentase_kehadiran >= 75:
        kategori_kehadiran = "Sedang"
    else:
        kategori_kehadiran = "Rendah"
    
    # Buat objek presensi baru dengan perhitungan persentase dan kategori
    presensi_data = presensi.dict()
    presensi_data['persentase_kehadiran'] = persentase_kehadiran
    presensi_data['kategori_kehadiran'] = kategori_kehadiran
    
    new_presensi = Presensi(**presensi_data)
    
    # Simpan ke database
    db.add(new_presensi)
    db.commit()
    db.refresh(new_presensi)
    
    return new_presensi

@router.get("/")
def get_all_presensi(
    skip: int = 0, 
    limit: int = 100, 
    siswa_id: Optional[int] = None, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Join query untuk mengambil data presensi beserta nama siswa
    query = db.query(
        Presensi.id,
        Presensi.siswa_id,
        Siswa.nama.label('nama_siswa'),
        Presensi.semester,
        Presensi.tahun_ajaran,
        Presensi.jumlah_hadir,
        Presensi.jumlah_sakit,
        Presensi.jumlah_izin,
        Presensi.jumlah_alpa,
        Presensi.persentase_kehadiran,
        Presensi.kategori_kehadiran,
        Presensi.created_at,
        Presensi.updated_at
    ).join(Siswa, Presensi.siswa_id == Siswa.id)
    
    # Filter berdasarkan siswa_id jika ada
    if siswa_id:
        query = query.filter(Presensi.siswa_id == siswa_id)
    
    # Ambil data dengan pagination
    presensi_list = query.offset(skip).limit(limit).all()
    
    # Convert hasil query ke dictionary
    result = []
    for row in presensi_list:
        result.append({
            "id": row.id,
            "siswa_id": row.siswa_id,
            "nama_siswa": row.nama_siswa,
            "semester": row.semester,
            "tahun_ajaran": row.tahun_ajaran,
            "jumlah_hadir": row.jumlah_hadir,
            "jumlah_sakit": row.jumlah_sakit,
            "jumlah_izin": row.jumlah_izin,
            "jumlah_alpa": row.jumlah_alpa,
            "persentase_kehadiran": row.persentase_kehadiran,
            "kategori_kehadiran": row.kategori_kehadiran,
            "created_at": row.created_at,
            "updated_at": row.updated_at
        })
    
    return result

@router.get("/{presensi_id}", response_model=PresensiResponse)
def get_presensi(
    presensi_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    presensi = db.query(Presensi).filter(Presensi.id == presensi_id).first()
    if not presensi:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Presensi dengan ID {presensi_id} tidak ditemukan"
        )
    return presensi

@router.put("/{presensi_id}", response_model=PresensiResponse)
def update_presensi(
    presensi_id: int, 
    presensi_update: PresensiUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
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
    
    # Store old kategori_kehadiran for model accuracy validation
    old_kategori = db_presensi.kategori_kehadiran
    
    # Update timestamp
    db_presensi.updated_at = datetime.now()
    
    # Simpan perubahan
    db.commit()
    db.refresh(db_presensi)
    
    # Model accuracy validation untuk perubahan presensi
    try:
        validation_result = model_accuracy_manager.validate_data_change(
            siswa_id=db_presensi.siswa_id,
            change_type="presensi",
            old_value=old_kategori,
            new_value=db_presensi.kategori_kehadiran
        )
        
        # Log validation result
        logging.info(f"📊 Presensi change validation - siswa_id={db_presensi.siswa_id}, significant={validation_result.get('is_significant')}, needs_retraining={validation_result.get('needs_retraining')}")
        
        # Trigger model retraining jika diperlukan
        if validation_result.get('needs_retraining'):
            logging.info(f"🔄 Triggering model retraining due to significant presensi changes")
            try:
                retraining_result = model_accuracy_manager.retrain_model_if_needed(db)
                logging.info(f"🎯 Model retraining result: {retraining_result.get('message')}")
            except Exception as e:
                logging.warning(f"⚠️ Model retraining failed: {str(e)}")
        
    except Exception as e:
        logging.warning(f"⚠️ Failed to validate data change for presensi: {str(e)}")
    
    # Invalidate cache for this student since presensi affects prediction
    if cache_health_check():
        try:
            invalidate_student_cache(
                db_presensi.siswa_id, 
                db_presensi.semester, 
                db_presensi.tahun_ajaran
            )
            logging.info(f"🔄 Cache invalidated for updated presensi siswa_id={db_presensi.siswa_id}")
        except Exception as e:
            logging.warning(f"⚠️ Failed to invalidate cache for presensi siswa_id={db_presensi.siswa_id}: {str(e)}")
    
    return db_presensi

@router.delete("/{presensi_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_presensi(
    presensi_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Cari presensi yang akan dihapus
    db_presensi = db.query(Presensi).filter(Presensi.id == presensi_id).first()
    if not db_presensi:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Presensi dengan ID {presensi_id} tidak ditemukan"
        )
    
    # Store data for cache invalidation before deletion
    siswa_id = db_presensi.siswa_id
    semester = db_presensi.semester
    tahun_ajaran = db_presensi.tahun_ajaran
    
    # Invalidate cache before deletion since presensi affects prediction
    if cache_health_check():
        try:
            invalidate_student_cache(siswa_id, semester, tahun_ajaran)
            logging.info(f"🔄 Cache invalidated for deleted presensi siswa_id={siswa_id}")
        except Exception as e:
            logging.warning(f"⚠️ Failed to invalidate cache for presensi siswa_id={siswa_id}: {str(e)}")
    
    # Hapus presensi
    db.delete(db_presensi)
    db.commit()
    
    return None

@router.get("/export/excel")
def export_presensi_excel(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Join query untuk mengambil data presensi beserta nama siswa
    query = db.query(
        Presensi.id,
        Presensi.siswa_id,
        Siswa.nama.label('nama_siswa'),
        Presensi.semester,
        Presensi.tahun_ajaran,
        Presensi.jumlah_hadir,
        Presensi.jumlah_sakit,
        Presensi.jumlah_izin,
        Presensi.jumlah_alpa,
        Presensi.persentase_kehadiran,
        Presensi.kategori_kehadiran,
        Presensi.created_at,
        Presensi.updated_at
    ).join(Siswa, Presensi.siswa_id == Siswa.id)
    
    # Ambil semua data presensi
    presensi_list = query.all()
    
    # Konversi data presensi ke DataFrame
    data = [{
        'ID': row.id,
        'Siswa ID': row.siswa_id,
        'Nama Siswa': row.nama_siswa,
        'Semester': row.semester,
        'Tahun Ajaran': row.tahun_ajaran,
        'Jumlah Hadir': row.jumlah_hadir,
        'Jumlah Sakit': row.jumlah_sakit,
        'Jumlah Izin': row.jumlah_izin,
        'Jumlah Alpa': row.jumlah_alpa,
        'Persentase Kehadiran': row.persentase_kehadiran,
        'Kategori Kehadiran': row.kategori_kehadiran,
        'Dibuat': row.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        'Diperbarui': row.updated_at.strftime('%Y-%m-%d %H:%M:%S') if row.updated_at else ''
    } for row in presensi_list]
    
    df = pd.DataFrame(data)
    
    # Buat file Excel di memory
    output = BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name='Data Presensi')
    
    output.seek(0)
    
    # Return file Excel sebagai response
    headers = {
        'Content-Disposition': 'attachment; filename=Data_Presensi.xlsx'
    }
    return StreamingResponse(
        output,
        media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        headers=headers
    )