from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db, NilaiRaport, Siswa
from schemas import NilaiRaportCreate, NilaiRaportUpdate, NilaiRaportResponse
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

@router.post("/", response_model=NilaiRaportResponse, status_code=status.HTTP_201_CREATED)
def create_nilai(
    nilai: NilaiRaportCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
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

@router.get("/")
def get_all_nilai(
    skip: int = 0, 
    limit: int = 100, 
    siswa_id: Optional[int] = None, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Join query untuk mengambil data nilai beserta nama siswa
    query = db.query(
        NilaiRaport.id,
        NilaiRaport.siswa_id,
        Siswa.nama.label('nama_siswa'),
        NilaiRaport.semester,
        NilaiRaport.tahun_ajaran,
        NilaiRaport.matematika,
        NilaiRaport.bahasa_indonesia,
        NilaiRaport.bahasa_inggris,
        NilaiRaport.ipa,
        NilaiRaport.bahasa_jawa,
        NilaiRaport.agama,
        NilaiRaport.pjok,
        NilaiRaport.pkn,
        NilaiRaport.sejarah,
        NilaiRaport.seni,
        NilaiRaport.dasar_kejuruan,
        NilaiRaport.rata_rata,
        NilaiRaport.created_at,
        NilaiRaport.updated_at
    ).join(Siswa, NilaiRaport.siswa_id == Siswa.id)
    
    # Filter berdasarkan siswa_id jika ada
    if siswa_id:
        query = query.filter(NilaiRaport.siswa_id == siswa_id)
    
    # Ambil data dengan pagination
    nilai_list = query.offset(skip).limit(limit).all()
    
    # Convert hasil query ke dictionary
    result = []
    for row in nilai_list:
        result.append({
            "id": row.id,
            "siswa_id": row.siswa_id,
            "nama_siswa": row.nama_siswa,
            "semester": row.semester,
            "tahun_ajaran": row.tahun_ajaran,
            "matematika": row.matematika,
            "bahasa_indonesia": row.bahasa_indonesia,
            "bahasa_inggris": row.bahasa_inggris,
            "ipa": row.ipa,
            "bahasa_jawa": row.bahasa_jawa,
            "agama": row.agama,
            "pjok": row.pjok,
            "pkn": row.pkn,
            "sejarah": row.sejarah,
            "seni": row.seni,
            "dasar_kejuruan": row.dasar_kejuruan,
            "rata_rata": row.rata_rata,
            "created_at": row.created_at,
            "updated_at": row.updated_at
        })
    
    return result

@router.get("/{nilai_id}", response_model=NilaiRaportResponse)
def get_nilai(
    nilai_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    nilai = db.query(NilaiRaport).filter(NilaiRaport.id == nilai_id).first()
    if not nilai:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Nilai dengan ID {nilai_id} tidak ditemukan"
        )
    return nilai

@router.put("/{nilai_id}", response_model=NilaiRaportResponse)
def update_nilai(
    nilai_id: int, 
    nilai_update: NilaiRaportUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
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
    
    # Store old rata_rata for model accuracy validation
    old_rata_rata = db_nilai.rata_rata
    
    # Update timestamp
    db_nilai.updated_at = datetime.now()
    
    # Simpan perubahan
    db.commit()
    db.refresh(db_nilai)
    
    # Model accuracy validation untuk perubahan nilai
    try:
        validation_result = model_accuracy_manager.validate_data_change(
            siswa_id=db_nilai.siswa_id,
            change_type="nilai",
            old_value=old_rata_rata,
            new_value=db_nilai.rata_rata
        )
        
        # Log validation result
        logging.info(f"📊 Nilai change validation - siswa_id={db_nilai.siswa_id}, significant={validation_result.get('is_significant')}, needs_retraining={validation_result.get('needs_retraining')}")
        
        # Trigger model retraining jika diperlukan
        if validation_result.get('needs_retraining'):
            logging.info(f"🔄 Triggering model retraining due to significant nilai changes")
            try:
                retraining_result = model_accuracy_manager.retrain_model_if_needed(db)
                logging.info(f"🎯 Model retraining result: {retraining_result.get('message')}")
            except Exception as e:
                logging.warning(f"⚠️ Model retraining failed: {str(e)}")
        
    except Exception as e:
        logging.warning(f"⚠️ Failed to validate data change for nilai: {str(e)}")
    
    # Invalidate cache for this student since nilai affects prediction
    if cache_health_check():
        try:
            invalidate_student_cache(
                db_nilai.siswa_id, 
                db_nilai.semester, 
                db_nilai.tahun_ajaran
            )
            logging.info(f"🔄 Cache invalidated for updated nilai siswa_id={db_nilai.siswa_id}")
        except Exception as e:
            logging.warning(f"⚠️ Failed to invalidate cache for nilai siswa_id={db_nilai.siswa_id}: {str(e)}")
    
    return db_nilai

@router.delete("/{nilai_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_nilai(
    nilai_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Cari nilai yang akan dihapus
    db_nilai = db.query(NilaiRaport).filter(NilaiRaport.id == nilai_id).first()
    if not db_nilai:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Nilai dengan ID {nilai_id} tidak ditemukan"
        )
    
    # Store data for cache invalidation before deletion
    siswa_id = db_nilai.siswa_id
    semester = db_nilai.semester
    tahun_ajaran = db_nilai.tahun_ajaran
    
    # Invalidate cache before deletion since nilai affects prediction
    if cache_health_check():
        try:
            invalidate_student_cache(siswa_id, semester, tahun_ajaran)
            logging.info(f"🔄 Cache invalidated for deleted nilai siswa_id={siswa_id}")
        except Exception as e:
            logging.warning(f"⚠️ Failed to invalidate cache for nilai siswa_id={siswa_id}: {str(e)}")
    
    # Hapus nilai
    db.delete(db_nilai)
    db.commit()
    
    return None

@router.get("/export/excel")
def export_nilai_excel(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Join query untuk mengambil data nilai beserta nama siswa
    query = db.query(
        NilaiRaport.id,
        NilaiRaport.siswa_id,
        Siswa.nama.label('nama_siswa'),
        NilaiRaport.semester,
        NilaiRaport.tahun_ajaran,
        NilaiRaport.matematika,
        NilaiRaport.bahasa_indonesia,
        NilaiRaport.bahasa_inggris,
        NilaiRaport.ipa,
        NilaiRaport.bahasa_jawa,
        NilaiRaport.agama,
        NilaiRaport.pjok,
        NilaiRaport.pkn,
        NilaiRaport.sejarah,
        NilaiRaport.seni,
        NilaiRaport.dasar_kejuruan,
        NilaiRaport.rata_rata,
        NilaiRaport.created_at,
        NilaiRaport.updated_at
    ).join(Siswa, NilaiRaport.siswa_id == Siswa.id)
    
    # Ambil semua data nilai
    nilai_list = query.all()
    
    # Konversi data nilai ke DataFrame
    data = [{
        'ID': row.id,
        'Siswa ID': row.siswa_id,
        'Nama Siswa': row.nama_siswa,
        'Semester': row.semester,
        'Tahun Ajaran': row.tahun_ajaran,
        'Matematika': row.matematika,
        'Bahasa Indonesia': row.bahasa_indonesia,
        'Bahasa Inggris': row.bahasa_inggris,
        'IPA': row.ipa,
        'Bahasa Jawa': row.bahasa_jawa,
        'Agama': row.agama,
        'PJOK': row.pjok,
        'PKN': row.pkn,
        'Sejarah': row.sejarah,
        'Seni': row.seni,
        'Dasar Kejuruan': row.dasar_kejuruan,
        'Rata-rata': row.rata_rata,
        'Dibuat': row.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        'Diperbarui': row.updated_at.strftime('%Y-%m-%d %H:%M:%S') if row.updated_at else ''
    } for row in nilai_list]
    
    df = pd.DataFrame(data)
    
    # Buat file Excel di memory
    output = BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name='Data Nilai Raport')
    
    output.seek(0)
    
    # Return file Excel sebagai response
    headers = {
        'Content-Disposition': 'attachment; filename=Data_Nilai_Raport.xlsx'
    }
    return StreamingResponse(
        output,
        media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        headers=headers
    )