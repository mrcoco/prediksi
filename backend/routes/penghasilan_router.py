from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db, PenghasilanOrtu, Siswa
from schemas import PenghasilanOrtuCreate, PenghasilanOrtuUpdate, PenghasilanOrtuResponse
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

@router.post("/", response_model=PenghasilanOrtuResponse, status_code=status.HTTP_201_CREATED)
def create_penghasilan(
    penghasilan: PenghasilanOrtuCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
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
    
    # Hitung total penghasilan
    total_penghasilan = penghasilan.penghasilan_ayah + penghasilan.penghasilan_ibu
    
    # Tentukan kategori penghasilan
    if total_penghasilan >= 5000000:  # 5 juta ke atas 2x UMK jogja
        kategori = "Tinggi"
    elif total_penghasilan >= 2300000:  # 2,3 juta - 5jt ke atas UMK jogja
        kategori = "Menengah"
    else:  # Di bawah 2,3 juta
        kategori = "Rendah"
    
    # Buat objek penghasilan baru dengan perhitungan total dan kategori
    penghasilan_data = penghasilan.dict()
    penghasilan_data['total_penghasilan'] = total_penghasilan
    penghasilan_data['kategori_penghasilan'] = kategori
    
    new_penghasilan = PenghasilanOrtu(**penghasilan_data)
    
    # Simpan ke database
    db.add(new_penghasilan)
    db.commit()
    db.refresh(new_penghasilan)
    
    return new_penghasilan

@router.get("/")
def get_all_penghasilan(
    skip: int = 0, 
    limit: int = 100, 
    siswa_id: Optional[int] = None, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Join query untuk mengambil data penghasilan beserta nama siswa
    query = db.query(
        PenghasilanOrtu.id,
        PenghasilanOrtu.siswa_id,
        Siswa.nama.label('nama_siswa'),
        PenghasilanOrtu.penghasilan_ayah,
        PenghasilanOrtu.penghasilan_ibu,
        PenghasilanOrtu.pekerjaan_ayah,
        PenghasilanOrtu.pekerjaan_ibu,
        PenghasilanOrtu.pendidikan_ayah,
        PenghasilanOrtu.pendidikan_ibu,
        PenghasilanOrtu.total_penghasilan,
        PenghasilanOrtu.kategori_penghasilan,
        PenghasilanOrtu.created_at,
        PenghasilanOrtu.updated_at
    ).join(Siswa, PenghasilanOrtu.siswa_id == Siswa.id)
    
    # Filter berdasarkan siswa_id jika ada
    if siswa_id:
        query = query.filter(PenghasilanOrtu.siswa_id == siswa_id)
    
    # Ambil data dengan pagination
    penghasilan_list = query.offset(skip).limit(limit).all()
    
    # Convert hasil query ke dictionary
    result = []
    for row in penghasilan_list:
        result.append({
            "id": row.id,
            "siswa_id": row.siswa_id,
            "nama_siswa": row.nama_siswa,
            "penghasilan_ayah": row.penghasilan_ayah,
            "penghasilan_ibu": row.penghasilan_ibu,
            "pekerjaan_ayah": row.pekerjaan_ayah,
            "pekerjaan_ibu": row.pekerjaan_ibu,
            "pendidikan_ayah": row.pendidikan_ayah,
            "pendidikan_ibu": row.pendidikan_ibu,
            "total_penghasilan": row.total_penghasilan,
            "kategori_penghasilan": row.kategori_penghasilan,
            "created_at": row.created_at,
            "updated_at": row.updated_at
        })
    
    return result

@router.get("/{penghasilan_id}", response_model=PenghasilanOrtuResponse)
def get_penghasilan(
    penghasilan_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    penghasilan = db.query(PenghasilanOrtu).filter(PenghasilanOrtu.id == penghasilan_id).first()
    if not penghasilan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Data penghasilan dengan ID {penghasilan_id} tidak ditemukan"
        )
    return penghasilan

@router.put("/{penghasilan_id}", response_model=PenghasilanOrtuResponse)
def update_penghasilan(
    penghasilan_id: int, 
    penghasilan_update: PenghasilanOrtuUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
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
    
    # Store old kategori_penghasilan for model accuracy validation
    old_kategori = db_penghasilan.kategori_penghasilan
    
    # Update timestamp
    db_penghasilan.updated_at = datetime.now()
    
    # Simpan perubahan
    db.commit()
    db.refresh(db_penghasilan)
    
    # Model accuracy validation untuk perubahan penghasilan
    try:
        validation_result = model_accuracy_manager.validate_data_change(
            siswa_id=db_penghasilan.siswa_id,
            change_type="penghasilan",
            old_value=old_kategori,
            new_value=db_penghasilan.kategori_penghasilan
        )
        
        # Log validation result
        logging.info(f"📊 Penghasilan change validation - siswa_id={db_penghasilan.siswa_id}, significant={validation_result.get('is_significant')}, needs_retraining={validation_result.get('needs_retraining')}")
        
        # Trigger model retraining jika diperlukan
        if validation_result.get('needs_retraining'):
            logging.info(f"🔄 Triggering model retraining due to significant penghasilan changes")
            try:
                retraining_result = model_accuracy_manager.retrain_model_if_needed(db)
                logging.info(f"🎯 Model retraining result: {retraining_result.get('message')}")
            except Exception as e:
                logging.warning(f"⚠️ Model retraining failed: {str(e)}")
        
    except Exception as e:
        logging.warning(f"⚠️ Failed to validate data change for penghasilan: {str(e)}")
    
    # Invalidate cache for this student since penghasilan affects prediction
    if cache_health_check():
        try:
            invalidate_student_cache(db_penghasilan.siswa_id)
            logging.info(f"🔄 Cache invalidated for updated penghasilan siswa_id={db_penghasilan.siswa_id}")
        except Exception as e:
            logging.warning(f"⚠️ Failed to invalidate cache for penghasilan siswa_id={db_penghasilan.siswa_id}: {str(e)}")
    
    return db_penghasilan

@router.delete("/{penghasilan_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_penghasilan(
    penghasilan_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Cari penghasilan yang akan dihapus
    db_penghasilan = db.query(PenghasilanOrtu).filter(PenghasilanOrtu.id == penghasilan_id).first()
    if not db_penghasilan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Data penghasilan dengan ID {penghasilan_id} tidak ditemukan"
        )
    
    # Store data for cache invalidation before deletion
    siswa_id = db_penghasilan.siswa_id
    
    # Invalidate cache before deletion since penghasilan affects prediction
    if cache_health_check():
        try:
            invalidate_student_cache(siswa_id)
            logging.info(f"🔄 Cache invalidated for deleted penghasilan siswa_id={siswa_id}")
        except Exception as e:
            logging.warning(f"⚠️ Failed to invalidate cache for penghasilan siswa_id={siswa_id}: {str(e)}")
    
    # Hapus penghasilan
    db.delete(db_penghasilan)
    db.commit()
    
    return None

@router.get("/export/excel")
def export_penghasilan_excel(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Join query untuk mengambil data penghasilan beserta nama siswa
    query = db.query(
        PenghasilanOrtu.id,
        PenghasilanOrtu.siswa_id,
        Siswa.nama.label('nama_siswa'),
        PenghasilanOrtu.penghasilan_ayah,
        PenghasilanOrtu.penghasilan_ibu,
        PenghasilanOrtu.pekerjaan_ayah,
        PenghasilanOrtu.pekerjaan_ibu,
        PenghasilanOrtu.pendidikan_ayah,
        PenghasilanOrtu.pendidikan_ibu,
        PenghasilanOrtu.total_penghasilan,
        PenghasilanOrtu.kategori_penghasilan,
        PenghasilanOrtu.created_at,
        PenghasilanOrtu.updated_at
    ).join(Siswa, PenghasilanOrtu.siswa_id == Siswa.id)
    
    # Ambil semua data penghasilan
    penghasilan_list = query.all()
    
    # Konversi data penghasilan ke DataFrame
    data = [{
        'ID': row.id,
        'Siswa ID': row.siswa_id,
        'Nama Siswa': row.nama_siswa,
        'Penghasilan Ayah': row.penghasilan_ayah,
        'Penghasilan Ibu': row.penghasilan_ibu,
        'Pekerjaan Ayah': row.pekerjaan_ayah,
        'Pekerjaan Ibu': row.pekerjaan_ibu,
        'Pendidikan Ayah': row.pendidikan_ayah,
        'Pendidikan Ibu': row.pendidikan_ibu,
        'Total Penghasilan': row.total_penghasilan,
        'Kategori Penghasilan': row.kategori_penghasilan,
        'Dibuat': row.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        'Diperbarui': row.updated_at.strftime('%Y-%m-%d %H:%M:%S') if row.updated_at else ''
    } for row in penghasilan_list]
    
    df = pd.DataFrame(data)
    
    # Buat file Excel di memory
    output = BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name='Data Penghasilan Orang Tua')
    
    output.seek(0)
    
    # Return file Excel sebagai response
    headers = {
        'Content-Disposition': 'attachment; filename=Data_Penghasilan_Orang_Tua.xlsx'
    }
    return StreamingResponse(
        output,
        media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        headers=headers
    )