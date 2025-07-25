from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db, Siswa, NilaiRaport, PenghasilanOrtu, Presensi, Prestasi
from schemas import PrestasiCreate, PrestasiResponse, PrediksiRequest, PrediksiResponse
from models.c45_model import c45_model
from model_accuracy_manager import model_accuracy_manager, RetrainingTrigger
from datetime import datetime
import os
import random
import pandas as pd
from routes.auth_router import get_current_user
from models.user import User
import numpy as np
from io import BytesIO
import time
import logging

# Cache imports
from cache_config import (
    create_cache_key, set_cache, get_cache, 
    invalidate_student_cache, cache_health_check,
    CACHE_EXPIRE_PREDICTIONS, CACHE_EXPIRE_STUDENT_DATA
)

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/train", status_code=status.HTTP_200_OK)
def train_model(
    db: Session = Depends(get_db),
    force_train: bool = False,
    current_user: User = Depends(get_current_user)
):
    """Melatih model C4.5 dengan data yang ada di database"""
    try:
        result = c45_model.train(db)
        return {
            "status": "success",
            "message": "Model berhasil dilatih",
            "data": result
        }
    except ValueError as e:
        if "Data berlabel tidak cukup" in str(e) and not force_train:
            # Jika error karena data tidak cukup, berikan pesan yang lebih informatif
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"{str(e)}. Gunakan endpoint /prediksi/generate-dummy-data untuk membuat data dummy, atau gunakan parameter force_train=True untuk melatih dengan data yang ada."
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi kesalahan saat melatih model: {str(e)}"
        )

@router.post("/", response_model=PrediksiResponse)
def predict_prestasi(
    request: PrediksiRequest,
    db: Session = Depends(get_db),
    force_train: bool = False,
    current_user: User = Depends(get_current_user),
    use_cache: bool = True
):
    """Memprediksi prestasi siswa berdasarkan data yang ada dengan caching untuk performance optimization"""
    start_time = time.time()
    
    # Create cache key for this prediction
    cache_key = create_cache_key(
        "predict",
        siswa_id=request.siswa_id,
        semester=request.semester,
        tahun_ajaran=request.tahun_ajaran,
        model_version=getattr(c45_model, 'model_version', 'v1')
    )
    
    # Try to get from cache first if caching is enabled
    if use_cache and cache_health_check():
        cached_result = get_cache(cache_key)
        if cached_result:
            # Return cached result with same structure
            logging.info(f"🎯 Cache HIT for prediction siswa_id={request.siswa_id}, response_time={time.time() - start_time:.3f}s")
            return cached_result
    
    # Cache miss - proceed with normal prediction logic
    logging.info(f"🔍 Cache MISS for prediction siswa_id={request.siswa_id}")
    
    # Cek apakah siswa ada
    siswa = db.query(Siswa).filter(Siswa.id == request.siswa_id).first()
    if not siswa:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Siswa dengan ID {request.siswa_id} tidak ditemukan"
        )
    
    # Ambil data nilai raport terbaru
    nilai = db.query(NilaiRaport).filter(
        NilaiRaport.siswa_id == request.siswa_id,
        NilaiRaport.semester == request.semester,
        NilaiRaport.tahun_ajaran == request.tahun_ajaran
    ).first()
    
    if not nilai:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Data nilai untuk siswa ID {request.siswa_id} pada semester {request.semester} tahun ajaran {request.tahun_ajaran} tidak ditemukan"
        )
    
    # Ambil data presensi terbaru
    presensi = db.query(Presensi).filter(
        Presensi.siswa_id == request.siswa_id,
        Presensi.semester == request.semester,
        Presensi.tahun_ajaran == request.tahun_ajaran
    ).first()
    
    if not presensi:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Data presensi untuk siswa ID {request.siswa_id} pada semester {request.semester} tahun ajaran {request.tahun_ajaran} tidak ditemukan"
        )
    
    # Ambil data penghasilan ortu terbaru
    penghasilan = db.query(PenghasilanOrtu).filter(PenghasilanOrtu.siswa_id == request.siswa_id).first()
    
    if not penghasilan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Data penghasilan orang tua untuk siswa ID {request.siswa_id} tidak ditemukan"
        )
    
    # Cek apakah model sudah dilatih
    if not c45_model.trained:
        try:
            c45_model.train(db)
        except ValueError as e:
            if "Data berlabel tidak cukup" in str(e):
                # Jika error karena data tidak cukup, berikan pesan yang lebih informatif
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"{str(e)}. Gunakan endpoint /prediksi/generate-dummy-data untuk membuat data dummy untuk pengujian."
                )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
    
    # Siapkan data untuk prediksi
    prediction_data = {
        'rata_rata': nilai.rata_rata,
        'kategori_penghasilan': penghasilan.kategori_penghasilan,
        'kategori_kehadiran': presensi.kategori_kehadiran
    }
    
    # Lakukan prediksi
    try:
        result = c45_model.predict(prediction_data)
        
        # Simpan hasil prediksi ke database
        prestasi_data = {
            'siswa_id': request.siswa_id,
            'semester': request.semester,
            'tahun_ajaran': request.tahun_ajaran,
            'prediksi_prestasi': result['prediksi'],
            'confidence': result['confidence']
        }
        
        # Cek apakah sudah ada prediksi untuk siswa, semester, dan tahun ajaran ini
        existing_prestasi = db.query(Prestasi).filter(
            Prestasi.siswa_id == request.siswa_id,
            Prestasi.semester == request.semester,
            Prestasi.tahun_ajaran == request.tahun_ajaran
        ).first()
        
        if existing_prestasi:
            # Update prediksi yang sudah ada
            for key, value in prestasi_data.items():
                setattr(existing_prestasi, key, value)
            existing_prestasi.updated_at = datetime.now()
            db.commit()
            db.refresh(existing_prestasi)
        else:
            # Buat prediksi baru
            new_prestasi = Prestasi(**prestasi_data)
            db.add(new_prestasi)
            db.commit()
        
        # Tentukan semester depan untuk prediksi
        def get_next_semester(current_semester, current_tahun_ajaran):
            if current_semester.lower() == "ganjil":
                return "Genap", current_tahun_ajaran
            elif current_semester.lower() == "genap":
                # Jika semester genap, tahun ajaran berubah
                tahun_parts = current_tahun_ajaran.split('/')
                if len(tahun_parts) == 2:
                    next_tahun = f"{int(tahun_parts[1])}/{int(tahun_parts[1]) + 1}"
                    return "Ganjil", next_tahun
                else:
                    return "Ganjil", current_tahun_ajaran
            else:
                return "Ganjil", current_tahun_ajaran
        
        next_semester, next_tahun_ajaran = get_next_semester(request.semester, request.tahun_ajaran)
        
        # Siapkan response
        response = {
            'siswa_id': request.siswa_id,
            'nama_siswa': siswa.nama,
            'prediksi_prestasi': result['prediksi'],
            'confidence': result['confidence'],
            'semester_prediksi': {
                'data_dari_semester': request.semester,
                'data_dari_tahun_ajaran': request.tahun_ajaran,
                'prediksi_untuk_semester': next_semester,
                'prediksi_untuk_tahun_ajaran': next_tahun_ajaran,
                'keterangan': f"Prediksi untuk semester {next_semester} tahun ajaran {next_tahun_ajaran} berdasarkan data semester {request.semester} tahun ajaran {request.tahun_ajaran}"
            },
            'detail_faktor': {
                'nilai_rata_rata': nilai.rata_rata,
                'kategori_penghasilan': penghasilan.kategori_penghasilan,
                'kategori_kehadiran': presensi.kategori_kehadiran,
                'feature_importances': result['feature_importances']
            }
        }
        
        # Store result in cache for future requests
        if use_cache and cache_health_check():
            cache_success = set_cache(cache_key, response, CACHE_EXPIRE_PREDICTIONS)
            if cache_success:
                logging.info(f"📦 Cache SET for prediction siswa_id={request.siswa_id}, expires in {CACHE_EXPIRE_PREDICTIONS}s")
            else:
                logging.warning(f"⚠️ Failed to cache prediction for siswa_id={request.siswa_id}")
        
        # Log performance metrics
        total_time = time.time() - start_time
        logging.info(f"✅ Prediction completed for siswa_id={request.siswa_id}, total_time={total_time:.3f}s")
        
        return response
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi kesalahan saat melakukan prediksi: {str(e)}"
        )

@router.post("/batch", status_code=status.HTTP_200_OK)
def predict_all_students(
    request: dict = Body(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    use_cache: bool = True
):
    """Memprediksi prestasi untuk semua siswa berdasarkan semester dan tahun ajaran dengan caching optimization"""
    start_time = time.time()
    semester = request.get('semester')
    tahun_ajaran = request.get('tahun_ajaran')
    
    logging.info(f"Starting batch prediction for semester={semester}, tahun_ajaran={tahun_ajaran}")
    
    if not semester or not tahun_ajaran:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Semester dan tahun ajaran harus diisi"
        )
    
    # Create cache key for batch prediction
    batch_cache_key = create_cache_key(
        "batch_predict",
        semester=semester,
        tahun_ajaran=tahun_ajaran,
        model_version=getattr(c45_model, 'model_version', 'v1')
    )
    
    # Try to get from cache first if caching is enabled
    if use_cache and cache_health_check():
        cached_result = get_cache(batch_cache_key)
        if cached_result:
            logging.info(f"🎯 Cache HIT for batch prediction {semester}-{tahun_ajaran}, response_time={time.time() - start_time:.3f}s")
            return cached_result
    
    logging.info(f"🔍 Cache MISS for batch prediction {semester}-{tahun_ajaran}")
    
    # Cek apakah model sudah dilatih
    if not c45_model.trained:
        try:
            logging.info("Model not trained, training now...")
            c45_model.train(db)
            logging.info("Model training completed")
        except ValueError as e:
            logging.error(f"Error training model: {str(e)}")
            if "Data berlabel tidak cukup" in str(e):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"{str(e)}. Gunakan endpoint /prediksi/generate-dummy-data untuk membuat data dummy untuk pengujian."
                )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
    
    try:
        # Ambil semua siswa yang memiliki data lengkap untuk semester dan tahun ajaran tersebut
        logging.info("Querying students with complete data...")
        siswa_query = db.query(Siswa).join(
            NilaiRaport,
            (NilaiRaport.siswa_id == Siswa.id) &
            (NilaiRaport.semester == semester) &
            (NilaiRaport.tahun_ajaran == tahun_ajaran)
        ).join(
            Presensi,
            (Presensi.siswa_id == Siswa.id) &
            (Presensi.semester == semester) &
            (Presensi.tahun_ajaran == tahun_ajaran)
        ).join(
            PenghasilanOrtu,
            PenghasilanOrtu.siswa_id == Siswa.id
        ).all()
        
        logging.info(f"Found {len(siswa_query)} students with complete data")
        
        if not siswa_query:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Tidak ada siswa dengan data lengkap untuk semester {semester} tahun ajaran {tahun_ajaran}"
            )
        
        results = []
        success_count = 0
        error_count = 0
        errors = []
        prestasi_updates = []
        
        for siswa in siswa_query:
            try:
                logging.info(f"Processing student {siswa.id} - {siswa.nama}")
                
                # Ambil data nilai raport
                nilai_raport = db.query(NilaiRaport).filter(
                    NilaiRaport.siswa_id == siswa.id,
                    NilaiRaport.semester == semester,
                    NilaiRaport.tahun_ajaran == tahun_ajaran
                ).first()
                
                # Ambil data presensi
                presensi = db.query(Presensi).filter(
                    Presensi.siswa_id == siswa.id,
                    Presensi.semester == semester,
                    Presensi.tahun_ajaran == tahun_ajaran
                ).first()
                
                # Ambil data penghasilan ortu
                penghasilan = db.query(PenghasilanOrtu).filter(
                    PenghasilanOrtu.siswa_id == siswa.id
                ).first()
                
                if not nilai_raport or not presensi or not penghasilan:
                    error_count += 1
                    error_msg = f"Data tidak lengkap untuk siswa {siswa.nama}"
                    logging.warning(error_msg)
                    errors.append(error_msg)
                    continue
                
                # Siapkan data untuk prediksi
                prediction_data = {
                    'rata_rata': nilai_raport.rata_rata,
                    'kategori_penghasilan': penghasilan.kategori_penghasilan,
                    'kategori_kehadiran': presensi.kategori_kehadiran
                }
                
                logging.info(f"Prediction data for student {siswa.id}: {prediction_data}")
                
                # Lakukan prediksi
                result = c45_model.predict(prediction_data)
                logging.info(f"Prediction result for student {siswa.id}: {result}")
                
                # Simpan hasil prediksi ke database
                prestasi_data = {
                    'siswa_id': siswa.id,
                    'semester': semester,
                    'tahun_ajaran': tahun_ajaran,
                    'prediksi_prestasi': result['prediksi'],
                    'confidence': result['confidence']
                }
                
                # Cek apakah sudah ada prediksi untuk siswa, semester, dan tahun ajaran ini
                existing_prestasi = db.query(Prestasi).filter(
                    Prestasi.siswa_id == siswa.id,
                    Prestasi.semester == semester,
                    Prestasi.tahun_ajaran == tahun_ajaran
                ).first()
                
                if existing_prestasi:
                    # Update prediksi yang sudah ada
                    for key, value in prestasi_data.items():
                        setattr(existing_prestasi, key, value)
                    existing_prestasi.updated_at = datetime.now()
                    prestasi_updates.append(existing_prestasi)
                else:
                    # Buat prediksi baru
                    new_prestasi = Prestasi(**prestasi_data)
                    prestasi_updates.append(new_prestasi)
                
                # Tentukan semester depan untuk prediksi
                def get_next_semester_batch(current_semester, current_tahun_ajaran):
                    if current_semester.lower() == "ganjil":
                        return "Genap", current_tahun_ajaran
                    elif current_semester.lower() == "genap":
                        # Jika semester genap, tahun ajaran berubah
                        tahun_parts = current_tahun_ajaran.split('/')
                        if len(tahun_parts) == 2:
                            next_tahun = f"{int(tahun_parts[1])}/{int(tahun_parts[1]) + 1}"
                            return "Ganjil", next_tahun
                        else:
                            return "Ganjil", current_tahun_ajaran
                    else:
                        return "Ganjil", current_tahun_ajaran
                
                next_semester, next_tahun_ajaran = get_next_semester_batch(semester, tahun_ajaran)
                
                # Siapkan data untuk response
                result_data = {
                    'siswa_id': siswa.id,
                    'nama_siswa': siswa.nama,
                    'kelas': siswa.kelas,
                    'prediksi_prestasi': result['prediksi'],
                    'confidence': result['confidence'],
                    'semester_prediksi': {
                        'data_dari_semester': semester,
                        'data_dari_tahun_ajaran': tahun_ajaran,
                        'prediksi_untuk_semester': next_semester,
                        'prediksi_untuk_tahun_ajaran': next_tahun_ajaran,
                        'keterangan': f"Prediksi untuk semester {next_semester} tahun ajaran {next_tahun_ajaran} berdasarkan data semester {semester} tahun ajaran {tahun_ajaran}"
                    },
                    'detail_faktor': {
                        'nilai_rata_rata': nilai_raport.rata_rata,
                        'kategori_penghasilan': penghasilan.kategori_penghasilan,
                        'kategori_kehadiran': presensi.kategori_kehadiran
                    }
                }
                
                results.append(result_data)
                success_count += 1
                logging.info(f"Successfully processed student {siswa.id}")
                
            except Exception as e:
                error_count += 1
                error_msg = f"Error untuk siswa {siswa.nama}: {str(e)}"
                logging.error(error_msg)
                errors.append(error_msg)
                continue
        
        # Commit semua perubahan sekaligus
        try:
            logging.info("Committing changes to database...")
            for prestasi in prestasi_updates:
                if not prestasi.id:  # Jika prestasi baru
                    db.add(prestasi)
            db.commit()
            logging.info("Database commit successful")
        except Exception as e:
            logging.error(f"Error committing to database: {str(e)}")
            db.rollback()
            raise
        
        # Siapkan summary
        summary = {
            'total_siswa': len(siswa_query),
            'success_count': success_count,
            'error_count': error_count,
            'success_rate': (success_count / len(siswa_query)) * 100 if len(siswa_query) > 0 else 0
        }
        
        # Tentukan semester depan untuk prediksi batch
        def get_next_semester_summary(current_semester, current_tahun_ajaran):
            if current_semester.lower() == "ganjil":
                return "Genap", current_tahun_ajaran
            elif current_semester.lower() == "genap":
                # Jika semester genap, tahun ajaran berubah
                tahun_parts = current_tahun_ajaran.split('/')
                if len(tahun_parts) == 2:
                    next_tahun = f"{int(tahun_parts[1])}/{int(tahun_parts[1]) + 1}"
                    return "Ganjil", next_tahun
                else:
                    return "Ganjil", current_tahun_ajaran
            else:
                return "Ganjil", current_tahun_ajaran
        
        next_semester_summary, next_tahun_ajaran_summary = get_next_semester_summary(semester, tahun_ajaran)
        
        response = {
            'status': 'success',
            'message': f'Prediksi batch selesai. {success_count} siswa berhasil diprediksi, {error_count} siswa gagal.',
            'semester': semester,
            'tahun_ajaran': tahun_ajaran,
            'semester_prediksi': {
                'data_dari_semester': semester,
                'data_dari_tahun_ajaran': tahun_ajaran,
                'prediksi_untuk_semester': next_semester_summary,
                'prediksi_untuk_tahun_ajaran': next_tahun_ajaran_summary,
                'keterangan': f"Prediksi untuk semester {next_semester_summary} tahun ajaran {next_tahun_ajaran_summary} berdasarkan data semester {semester} tahun ajaran {tahun_ajaran}"
            },
            'summary': summary,
            'results': results,
            'errors': errors if error_count > 0 else None,
            'processing_time': time.time() - start_time
        }
        
        logging.info(f"Batch prediction completed: {summary}")
        
        # Cache the result if successful and caching is enabled
        if use_cache and cache_health_check() and success_count > 0:
            try:
                set_cache(batch_cache_key, response, CACHE_EXPIRE_PREDICTIONS)
                logging.info(f"📦 Batch prediction cached: {semester}-{tahun_ajaran}")
            except Exception as e:
                logging.warning(f"⚠️ Failed to cache batch prediction: {str(e)}")
        
        return response
        
    except Exception as e:
        error_msg = f"Terjadi kesalahan saat melakukan prediksi batch: {str(e)}"
        logging.error(error_msg)
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_msg
        )

@router.get("/rules")
def get_rules(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mendapatkan aturan-aturan dari model C4.5"""
    if not c45_model.trained:
        try:
            c45_model.train(db)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
    
    try:
        rules = c45_model.get_rules()
        return {
            "status": "success",
            "rules": rules
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi kesalahan saat mendapatkan aturan: {str(e)}"
        )

@router.post("/generate-labeled-data")
def generate_labeled_data(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Membuat data berlabel untuk melatih model C4.5"""
    try:
        # Siapkan data dari database
        df, df_labeled = c45_model.prepare_data(db)
        
        return {
            "status": "success",
            "message": "Data berlabel berhasil dibuat",
            "data": {
                "total_data": len(df_labeled),
                "label_distribution": df_labeled['prediksi_prestasi'].value_counts().to_dict()
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Gagal membuat data berlabel: {str(e)}"
        )

@router.post("/generate-dummy")
def generate_dummy_data(jumlah_data: int = Body(..., embed=True), db: Session = Depends(get_db)):
    """Generate dummy data untuk siswa, nilai, presensi, dan penghasilan orang tua"""
    if jumlah_data > 1000:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Jumlah data dummy maksimal 1000"
        )
    
    try:
        # Generate data siswa
        siswa_list = []
        for i in range(jumlah_data):
            siswa = Siswa(
                nama=f"Siswa Dummy {i+1}",
                nis=f"NIS{i+1}",
                jenis_kelamin=random.choice(["L", "P"]),
                kelas=random.choice(["10", "11", "12"]),
                tanggal_lahir="2000-01-01",
                alamat=f"Alamat Dummy {i+1}"
            )
            db.add(siswa)
            siswa_list.append(siswa)
        
        db.commit()
        
        # Generate data nilai
        for siswa in siswa_list:
            nilai = NilaiRaport(
                siswa_id=siswa.id,
                semester=1,
                tahun_ajaran="2023/2024",
                matematika=random.randint(60, 100),
                bahasa_indonesia=random.randint(60, 100),
                bahasa_inggris=random.randint(60, 100),
                ipa=random.randint(60, 100),
                ips=random.randint(60, 100),
                rata_rata=random.randint(60, 100)
            )
            db.add(nilai)
        
        # Generate data presensi
        for siswa in siswa_list:
            presensi = Presensi(
                siswa_id=siswa.id,
                semester=1,
                tahun_ajaran="2023/2024",
                jumlah_hadir=random.randint(80, 100),
                jumlah_sakit=random.randint(0, 5),
                jumlah_izin=random.randint(0, 5),
                jumlah_alpa=random.randint(0, 5),
                persentase_kehadiran=random.randint(80, 100),
                kategori_kehadiran=random.choice(["Tinggi", "Sedang", "Rendah"])
            )
            db.add(presensi)
        
        # Generate data penghasilan
        for siswa in siswa_list:
            penghasilan = PenghasilanOrtu(
                siswa_id=siswa.id,
                penghasilan_ayah=random.randint(1000000, 10000000),
                penghasilan_ibu=random.randint(1000000, 5000000),
                total_penghasilan=random.randint(2000000, 15000000),
                kategori_penghasilan=random.choice(["Tinggi", "Menengah", "Rendah"])
            )
            db.add(penghasilan)
        
        db.commit()
        
        return {"status": "success", "message": f"Berhasil generate {jumlah_data} data dummy"}
    
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Gagal generate dummy data: {str(e)}"
        )

@router.get("/visualization")
def get_visualization(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mendapatkan visualisasi pohon keputusan dalam format base64"""
    if not c45_model.trained:
        try:
            c45_model.train(db)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
    
    try:
        base64_image = c45_model.visualize()
        return {
            "status": "success",
            "data": {
                "image": base64_image,
                "format": "base64",
                "type": "png"
            },
            "message": "Berhasil mendapatkan visualisasi pohon keputusan"
        }
    except Exception as e:
        logger.error(f"Error saat membuat visualisasi: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi kesalahan saat membuat visualisasi: {str(e)}"
        )

@router.get("/history")
def get_prediction_history(
    skip: int = 0,
    limit: int = 10,
    siswa_id: Optional[int] = None, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mendapatkan riwayat prediksi prestasi dengan nama siswa dan pagination"""
    # Query dengan JOIN ke tabel siswa
    query = db.query(
        Prestasi.id,
        Prestasi.siswa_id,
        Siswa.nama.label('nama_siswa'),
        Prestasi.semester,
        Prestasi.tahun_ajaran,
        Prestasi.prediksi_prestasi,
        Prestasi.confidence,
        Prestasi.created_at,
        Prestasi.updated_at
    ).join(Siswa, Prestasi.siswa_id == Siswa.id)
    
    if siswa_id:
        query = query.filter(Prestasi.siswa_id == siswa_id)
    
    # Hitung total records untuk pagination
    total_count = query.count()
    
    # Apply pagination
    prestasi_list = query.order_by(Prestasi.updated_at.desc()).offset(skip).limit(limit).all()
    
    # Convert ke format yang diinginkan
    result = []
    for prestasi in prestasi_list:
        result.append({
            "id": prestasi.id,
            "siswa_id": prestasi.siswa_id,
            "nama_siswa": prestasi.nama_siswa,
            "semester": prestasi.semester,
            "tahun_ajaran": prestasi.tahun_ajaran,
            "prediksi_prestasi": prestasi.prediksi_prestasi,
            "confidence": prestasi.confidence,
            "created_at": prestasi.created_at,
            "updated_at": prestasi.updated_at
        })
    
    return {
        "data": result,
        "total": total_count,
        "skip": skip,
        "limit": limit
    }

@router.post("/history")
def get_prediction_history_post(
    request: dict = Body(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mendapatkan riwayat prediksi prestasi dengan nama siswa dan pagination menggunakan POST"""
    # Extract parameters from request body
    skip = request.get("skip", 0)
    limit = request.get("limit", 10)
    siswa_id = request.get("siswa_id", None)
    
    # Query dengan JOIN ke tabel siswa
    query = db.query(
        Prestasi.id,
        Prestasi.siswa_id,
        Siswa.nama.label('nama_siswa'),
        Prestasi.semester,
        Prestasi.tahun_ajaran,
        Prestasi.prediksi_prestasi,
        Prestasi.confidence,
        Prestasi.created_at,
        Prestasi.updated_at
    ).join(Siswa, Prestasi.siswa_id == Siswa.id)
    
    if siswa_id:
        query = query.filter(Prestasi.siswa_id == siswa_id)
    
    # Hitung total records untuk pagination
    total_count = query.count()
    
    # Apply pagination
    prestasi_list = query.order_by(Prestasi.updated_at.desc()).offset(skip).limit(limit).all()
    
    # Convert ke format yang diinginkan
    result = []
    for prestasi in prestasi_list:
        result.append({
            "id": prestasi.id,
            "siswa_id": prestasi.siswa_id,
            "nama_siswa": prestasi.nama_siswa,
            "semester": prestasi.semester,
            "tahun_ajaran": prestasi.tahun_ajaran,
            "prediksi_prestasi": prestasi.prediksi_prestasi,
            "confidence": prestasi.confidence,
            "created_at": prestasi.created_at,
            "updated_at": prestasi.updated_at
        })
    
    return {
        "data": result,
        "total": total_count,
        "skip": skip,
        "limit": limit
    }

@router.delete("/history/{prestasi_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_prediction_history(
    prestasi_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Menghapus riwayat prediksi berdasarkan ID"""
    # Cari data prestasi yang akan dihapus
    prestasi = db.query(Prestasi).filter(Prestasi.id == prestasi_id).first()
    if not prestasi:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Riwayat prediksi dengan ID {prestasi_id} tidak ditemukan"
        )
    
    # Hapus data prestasi
    db.delete(prestasi)
    db.commit()
    
    return None

@router.get("/history/export/excel")
def export_riwayat_prediksi_excel(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Export riwayat prediksi ke file Excel"""
    # Query dengan JOIN ke tabel siswa untuk mendapatkan semua riwayat prediksi
    query = db.query(
        Prestasi.id,
        Prestasi.siswa_id,
        Siswa.nama.label('nama_siswa'),
        Prestasi.semester,
        Prestasi.tahun_ajaran,
        Prestasi.prediksi_prestasi,
        Prestasi.confidence,
        Prestasi.created_at,
        Prestasi.updated_at
    ).join(Siswa, Prestasi.siswa_id == Siswa.id)
    
    # Ambil semua data riwayat prediksi
    prestasi_list = query.order_by(Prestasi.updated_at.desc()).all()
    
    # Konversi data riwayat prediksi ke DataFrame
    data = [{
        'ID': row.id,
        'Siswa ID': row.siswa_id,
        'Nama Siswa': row.nama_siswa,
        'Semester': row.semester,
        'Tahun Ajaran': row.tahun_ajaran,
        'Prediksi Prestasi': row.prediksi_prestasi,
        'Confidence': f"{row.confidence:.2%}",  # Format percentage
        'Tanggal Dibuat': row.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        'Tanggal Diperbarui': row.updated_at.strftime('%Y-%m-%d %H:%M:%S') if row.updated_at else ''
    } for row in prestasi_list]
    
    df = pd.DataFrame(data)
    
    # Buat file Excel di memory
    output = BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name='Riwayat Prediksi Prestasi')
    
    output.seek(0)
    
    # Return file Excel sebagai response
    headers = {
        'Content-Disposition': 'attachment; filename=Riwayat_Prediksi_Prestasi.xlsx'
    }
    return StreamingResponse(
        output,
        media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        headers=headers
    )

@router.post("/generate-dummy-data", status_code=status.HTTP_201_CREATED)
def generate_dummy_data(count: int = 10, db: Session = Depends(get_db)):
    """Menghasilkan data dummy untuk pengujian model"""
    if count < 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Minimal 10 data dummy harus dibuat untuk melatih model"
        )
    if count > 1000:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maksimal 1000 data dummy dapat dibuat dalam satu permintaan"
        )
    
    # Ambil semua siswa yang ada
    siswa_list = db.query(Siswa).all()
    if not siswa_list:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tidak ada data siswa. Tambahkan data siswa terlebih dahulu."
        )
    
    # Kategori yang mungkin
    kategori_penghasilan = ["Rendah", "Menengah", "Tinggi"]
    kategori_kehadiran = ["Rendah", "Sedang", "Tinggi"]
    kategori_prestasi = ["Rendah", "Sedang", "Tinggi"]
    semester_list = ["Ganjil", "Genap"]
    tahun_ajaran_list = ["2022/2023", "2023/2024"]
    
    # Buat data dummy
    created_count = 0
    for _ in range(count):
        # Pilih siswa secara acak
        siswa = random.choice(siswa_list)
        semester = random.choice(semester_list)
        tahun_ajaran = random.choice(tahun_ajaran_list)
        
        # Cek apakah sudah ada data untuk siswa, semester, dan tahun ajaran ini
        existing_nilai = db.query(NilaiRaport).filter(
                    NilaiRaport.siswa_id == siswa.id,
                    NilaiRaport.semester == semester,
                    NilaiRaport.tahun_ajaran == tahun_ajaran
                ).first()
                
        existing_presensi = db.query(Presensi).filter(
                    Presensi.siswa_id == siswa.id,
                    Presensi.semester == semester,
                    Presensi.tahun_ajaran == tahun_ajaran
                ).first()
                
        existing_penghasilan = db.query(PenghasilanOrtu).filter(
                    PenghasilanOrtu.siswa_id == siswa.id
                ).first()
                
        # Buat data nilai jika belum ada
        if not existing_nilai:
            # Generate nilai acak
            matematika = round(random.uniform(60, 100), 2)
            bahasa_indonesia = round(random.uniform(60, 100), 2)
            bahasa_inggris = round(random.uniform(60, 100), 2)
            bahasa_jawa = round(random.uniform(60, 100), 2)
            ipa = round(random.uniform(60, 100), 2)
            pjok = round(random.uniform(60, 100), 2)
            pkn = round(random.uniform(60, 100), 2)
            sejarah = round(random.uniform(60, 100), 2)
            seni = round(random.uniform(60, 100), 2)
            dasar_kejuruan = round(random.uniform(60, 100), 2)
            agama = round(random.uniform(60, 100), 2)
            rata_rata = round((matematika + bahasa_indonesia + bahasa_inggris + bahasa_jawa + ipa + pjok  + pkn + sejarah +seni +dasar_kejuruan) / 11, 2)
            
            new_nilai = NilaiRaport(
                siswa_id=siswa.id,
                semester=semester,
                tahun_ajaran=tahun_ajaran,
                matematika=matematika,
                bahasa_indonesia=bahasa_indonesia,
                bahasa_inggris=bahasa_inggris,
                ipa=ipa,
                bahasa_jawa=bahasa_jawa,
                agama=agama,
                pjok=pjok,
                pkn=pkn,
                sejarah=sejarah,
                seni=seni,
                dasar_kejuruan=dasar_kejuruan,
                rata_rata=rata_rata
            )
            db.add(new_nilai)
        else:
            rata_rata = existing_nilai.rata_rata
        
        # Buat data presensi jika belum ada
        if not existing_presensi:
            # Generate data presensi acak
            jumlah_hadir = random.randint(70, 100)
            jumlah_sakit = random.randint(0, 10)
            jumlah_izin = random.randint(0, 10)
            jumlah_alpa = random.randint(0, 10)
            total_hari = jumlah_hadir + jumlah_sakit + jumlah_izin + jumlah_alpa
            persentase_kehadiran = (jumlah_hadir / total_hari) * 100 if total_hari > 0 else 0
            
            # Tentukan kategori kehadiran
            if persentase_kehadiran >= 90:
                kategori_kehadiran_value = "Tinggi"
            elif persentase_kehadiran >= 75:
                kategori_kehadiran_value = "Sedang"
            else:
                kategori_kehadiran_value = "Rendah"
            
            new_presensi = Presensi(
                siswa_id=siswa.id,
                semester=semester,
                tahun_ajaran=tahun_ajaran,
                jumlah_hadir=jumlah_hadir,
                jumlah_sakit=jumlah_sakit,
                jumlah_izin=jumlah_izin,
                jumlah_alpa=jumlah_alpa,
                persentase_kehadiran=persentase_kehadiran,
                kategori_kehadiran=kategori_kehadiran_value
            )
            db.add(new_presensi)
        else:
            kategori_kehadiran_value = existing_presensi.kategori_kehadiran
        
        # Buat data penghasilan jika belum ada
        if not existing_penghasilan:
            # Generate data penghasilan acak
            penghasilan_ayah = round(random.uniform(2000000, 15000000), 2)
            penghasilan_ibu = round(random.uniform(1000000, 10000000), 2)
            total_penghasilan = penghasilan_ayah + penghasilan_ibu
            
            # Tentukan kategori penghasilan
            if total_penghasilan >= 10000000:  # 10 juta ke atas
                kategori_penghasilan_value = "Tinggi"
            elif total_penghasilan >= 5000000:  # 5-10 juta
                kategori_penghasilan_value = "Menengah"
            else:  # Di bawah 5 juta
                kategori_penghasilan_value = "Rendah"
            
            new_penghasilan = PenghasilanOrtu(
                siswa_id=siswa.id,
                penghasilan_ayah=penghasilan_ayah,
                penghasilan_ibu=penghasilan_ibu,
                pekerjaan_ayah="Dummy",
                pekerjaan_ibu="Dummy",
                pendidikan_ayah="Dummy",
                pendidikan_ibu="Dummy",
                total_penghasilan=total_penghasilan,
                kategori_penghasilan=kategori_penghasilan_value
            )
            db.add(new_penghasilan)
        else:
            kategori_penghasilan_value = existing_penghasilan.kategori_penghasilan
        
        # Buat prediksi prestasi berdasarkan aturan sederhana
        # Ini hanya untuk data dummy, model yang sebenarnya akan menggunakan algoritma C4.5
        nilai_factor = 0
        if rata_rata >= 85:
            nilai_factor = 2
        elif rata_rata >= 75:
            nilai_factor = 1
        
        penghasilan_factor = 0
        if kategori_penghasilan_value == "Tinggi":
            penghasilan_factor = 2
        elif kategori_penghasilan_value == "Menengah":
            penghasilan_factor = 1
        
        kehadiran_factor = 0
        if kategori_kehadiran_value == "Tinggi":
            kehadiran_factor = 2
        elif kategori_kehadiran_value == "Sedang":
            kehadiran_factor = 1
        
        total_factor = nilai_factor + penghasilan_factor + kehadiran_factor
        
        if total_factor >= 5:
            prediksi_prestasi = "Tinggi"
        elif total_factor >= 3:
            prediksi_prestasi = "Sedang"
        else:
            prediksi_prestasi = "Rendah"
        
        # Cek apakah sudah ada prediksi untuk siswa, semester, dan tahun ajaran ini
        existing_prestasi = db.query(Prestasi).filter(
            Prestasi.siswa_id == siswa.id,
            Prestasi.semester == semester,
            Prestasi.tahun_ajaran == tahun_ajaran
        ).first()
        
        if existing_prestasi:
            # Update prediksi yang sudah ada
            existing_prestasi.prediksi_prestasi = prediksi_prestasi
            existing_prestasi.confidence = round(random.uniform(0.7, 0.95), 2)
            existing_prestasi.updated_at = datetime.now()
        else:
            # Buat prediksi baru
            new_prestasi = Prestasi(
                siswa_id=siswa.id,
                semester=semester,
                tahun_ajaran=tahun_ajaran,
                prediksi_prestasi=prediksi_prestasi,
                confidence=round(random.uniform(0.7, 0.95), 2)
            )
            db.add(new_prestasi)
        
        created_count += 1
    
    # Commit semua perubahan ke database
    db.commit()
    
    return {
        "status": "success",
        "message": f"Berhasil membuat {created_count} data dummy untuk pengujian",
        "data": {
            "count": created_count
        }
    }

@router.post("/generate-dummy-by-name", status_code=status.HTTP_201_CREATED)
def generate_dummy_by_name(request: dict = Body(...), db: Session = Depends(get_db)):
    siswa_id = request.get('siswa_id')
    tahun_ajaran = request.get('tahun_ajaran')
    nama_siswa = request.get('nama_siswa')
    """Menghasilkan data dummy untuk siswa tertentu berdasarkan nama/id dan tahun ajaran"""
    print(f"Payload diterima: nama_siswa={nama_siswa}, siswa_id={siswa_id}, tahun_ajaran={tahun_ajaran}")
    # Cari siswa berdasarkan ID atau nama
    siswa = None
    if siswa_id:
        siswa = db.query(Siswa).filter(Siswa.id == siswa_id).first()
        if not siswa:
            error_msg = f"Siswa dengan ID {siswa_id} tidak ditemukan"
            print(f"Error: {error_msg}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=error_msg
            )
    elif nama_siswa:
        siswa = db.query(Siswa).filter(Siswa.nama.ilike(f"%{nama_siswa}%")).first()
        if not siswa:
            error_msg = f"Siswa dengan nama '{nama_siswa}' tidak ditemukan"
            print(f"Error: {error_msg}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=error_msg
            )
    
    # Validasi tahun ajaran
    if not tahun_ajaran or not ("/" in tahun_ajaran):
        error_msg = "Format tahun ajaran tidak valid. Gunakan format 'YYYY/YYYY', contoh: '2023/2024'"
        print(f"Error: {error_msg}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_msg
        )
    
    # Semester yang mungkin
    semester_list = ["Ganjil", "Genap"]
    created_data = []
    
    for semester in semester_list:
        # Cek apakah sudah ada data untuk siswa, semester, dan tahun ajaran ini
        existing_nilai = db.query(NilaiRaport).filter(
            NilaiRaport.siswa_id == siswa.id,
            NilaiRaport.semester == semester,
            NilaiRaport.tahun_ajaran == tahun_ajaran
        ).first()
        
        existing_presensi = db.query(Presensi).filter(
            Presensi.siswa_id == siswa.id,
            Presensi.semester == semester,
            Presensi.tahun_ajaran == tahun_ajaran
        ).first()
        
        existing_penghasilan = db.query(PenghasilanOrtu).filter(
            PenghasilanOrtu.siswa_id == siswa.id
        ).first()
        
        # Buat data nilai jika belum ada
        if not existing_nilai:
            # Generate nilai acak
            matematika = round(random.uniform(70, 95), 2)
            bahasa_indonesia = round(random.uniform(70, 95), 2)
            bahasa_inggris = round(random.uniform(70, 95), 2)
            ipa = round(random.uniform(70, 95), 2)
            ips = round(random.uniform(70, 95), 2)
            rata_rata = round((matematika + bahasa_indonesia + bahasa_inggris + ipa + ips) / 5, 2)
            
            new_nilai = NilaiRaport(
                siswa_id=siswa.id,
                semester=semester,
                tahun_ajaran=tahun_ajaran,
                matematika=matematika,
                bahasa_indonesia=bahasa_indonesia,
                bahasa_inggris=bahasa_inggris,
                ipa=ipa,
                ips=ips,
                rata_rata=rata_rata
            )
            db.add(new_nilai)
            created_data.append(f"Nilai {semester} {tahun_ajaran}")
        else:
            rata_rata = existing_nilai.rata_rata
        
        # Buat data presensi jika belum ada
        if not existing_presensi:
            # Generate data presensi acak
            jumlah_hadir = random.randint(80, 100)
            jumlah_sakit = random.randint(0, 8)
            jumlah_izin = random.randint(0, 8)
            jumlah_alpa = random.randint(0, 5)
            total_hari = jumlah_hadir + jumlah_sakit + jumlah_izin + jumlah_alpa
            persentase_kehadiran = (jumlah_hadir / total_hari) * 100 if total_hari > 0 else 0
            
            # Tentukan kategori kehadiran
            if persentase_kehadiran >= 90:
                kategori_kehadiran_value = "Tinggi"
            elif persentase_kehadiran >= 75:
                kategori_kehadiran_value = "Sedang"
            else:
                kategori_kehadiran_value = "Rendah"
            
            new_presensi = Presensi(
                siswa_id=siswa.id,
                semester=semester,
                tahun_ajaran=tahun_ajaran,
                jumlah_hadir=jumlah_hadir,
                jumlah_sakit=jumlah_sakit,
                jumlah_izin=jumlah_izin,
                jumlah_alpa=jumlah_alpa,
                persentase_kehadiran=persentase_kehadiran,
                kategori_kehadiran=kategori_kehadiran_value
            )
            db.add(new_presensi)
            created_data.append(f"Presensi {semester} {tahun_ajaran}")
        else:
            kategori_kehadiran_value = existing_presensi.kategori_kehadiran
        
        # Buat data penghasilan jika belum ada
        if not existing_penghasilan:
            # Generate data penghasilan acak
            penghasilan_ayah = round(random.uniform(3000000, 12000000), 2)
            penghasilan_ibu = round(random.uniform(2000000, 8000000), 2)
            total_penghasilan = penghasilan_ayah + penghasilan_ibu
            
            # Tentukan kategori penghasilan
            if total_penghasilan >= 10000000:  # 10 juta ke atas
                kategori_penghasilan_value = "Tinggi"
            elif total_penghasilan >= 5000000:  # 5-10 juta
                kategori_penghasilan_value = "Menengah"
            else:  # Di bawah 5 juta
                kategori_penghasilan_value = "Rendah"
            
            new_penghasilan = PenghasilanOrtu(
                siswa_id=siswa.id,
                penghasilan_ayah=penghasilan_ayah,
                penghasilan_ibu=penghasilan_ibu,
                pekerjaan_ayah="Karyawan",
                pekerjaan_ibu="Karyawan",
                pendidikan_ayah="S1",
                pendidikan_ibu="S1",
                total_penghasilan=total_penghasilan,
                kategori_penghasilan=kategori_penghasilan_value
            )
            db.add(new_penghasilan)
            created_data.append("Data Penghasilan Orang Tua")
        else:
            kategori_penghasilan_value = existing_penghasilan.kategori_penghasilan
    
    # Commit semua perubahan ke database
    db.commit()
    
    return {
        "status": "success",
        "message": f"Berhasil membuat data dummy untuk siswa {siswa.nama}",
        "data": {
            "siswa": {
                "id": siswa.id,
                "nama": siswa.nama,
                "kelas": siswa.kelas
            },
            "tahun_ajaran": tahun_ajaran,
            "data_dibuat": created_data
        }
    }

@router.get("/data-count")
def get_data_count(db: Session = Depends(get_db)):
    """Mendapatkan jumlah data yang tersedia untuk pelatihan model"""
    # Ambil data dari database
    df, df_labeled = c45_model.prepare_data(db)
    
    return {
        "status": "success",
        "data": {
            "total_data": len(df),
            "labeled_data": len(df_labeled),
            "unlabeled_data": len(df) - len(df_labeled),
            "min_required": 10,
            "is_sufficient": len(df_labeled) >= 10
        }
    }

@router.get("/confusion-matrix")
def get_confusion_matrix(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mendapatkan confusion matrix dari model C4.5 yang sudah dilatih"""
    try:
        # Cek apakah model sudah dilatih
        if not c45_model.trained:
            try:
                c45_model.train(db)
            except ValueError as e:
                return {
                    "status": "error",
                    "message": str(e)
                }
        
        # Ambil confusion matrix
        result = c45_model.get_confusion_matrix()
        
        return {
            "status": "success",
            "confusion_matrix": result['matrix'],
            "labels": result['labels']
        }
    
    except ValueError as e:
        return {
            "status": "error",
            "message": str(e)
        }
    except Exception as e:
        logger.error(f"Error getting confusion matrix: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi kesalahan saat mengambil confusion matrix: {str(e)}"
        )

@router.get("/model-metrics")
def get_model_metrics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mendapatkan metrik evaluasi model C4.5"""
    try:
        # Cek apakah model sudah dilatih
        if not c45_model.trained:
            return {
                "status": "error",
                "message": "Model belum dilatih. Silakan latih model terlebih dahulu."
            }
        
        # Ambil model metrics
        result = c45_model.get_model_metrics()
        
        return {
            "status": "success",
            "metrics": result['metrics'],
            "last_trained": result['last_trained']
        }
    
    except ValueError as e:
        return {
            "status": "error",
            "message": str(e)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi kesalahan saat mengambil model metrics: {str(e)}"
        )

@router.get("/tree-data")
def get_tree_data(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mendapatkan data pohon keputusan dalam format JSON untuk D3.js"""
    try:
        # Cek apakah model sudah dilatih
        if not c45_model.trained:
            try:
                c45_model.train(db)
            except ValueError as e:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=str(e)
                )
        
        # Validasi model dan data yang diperlukan
        if not hasattr(c45_model, 'model') or not c45_model.model:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Model belum diinisialisasi dengan benar"
            )
        
        if not c45_model.features or len(c45_model.features) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Feature names tidak tersedia"
            )
            
        # Cek apakah tree sudah dibuat
        if not hasattr(c45_model.model, 'tree_'):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tree belum dibuat, model mungkin belum dilatih dengan benar"
            )
            
        # Ekstrak struktur tree dari model sklearn
        tree = c45_model.model.tree_
        feature_names = c45_model.features
        class_names = ['Rendah', 'Sedang', 'Tinggi']
        
        def build_tree_dict(node_id):
            """Recursively build tree dictionary"""
            if tree.feature[node_id] != -2:  # Not a leaf node
                feature_idx = int(tree.feature[node_id])
                # Validasi indeks feature sebelum mengakses
                if feature_idx < 0 or feature_idx >= len(feature_names):
                    raise ValueError(f"Invalid feature index {feature_idx} for feature_names with length {len(feature_names)}")
                feature_name = feature_names[feature_idx]
                threshold = float(tree.threshold[node_id])
                
                # Get children
                left_child = build_tree_dict(int(tree.children_left[node_id]))
                right_child = build_tree_dict(int(tree.children_right[node_id]))
                
                return {
                    "name": f"{feature_name}",
                    "attribute": feature_name,
                    "threshold": round(threshold, 2),
                    "condition": f"{feature_name} <= {threshold:.2f}",
                    "samples": int(tree.n_node_samples[node_id]),
                    "type": "internal",
                    "children": [
                        {
                            **left_child,
                            "edge_label": f"<= {threshold:.2f}"
                        },
                        {
                            **right_child,
                            "edge_label": f"> {threshold:.2f}"
                        }
                    ]
                }
            else:  # Leaf node
                # Get class prediction
                class_counts = tree.value[node_id][0]
                predicted_class_idx = int(np.argmax(class_counts))
                predicted_class = class_names[predicted_class_idx]
                confidence = float(class_counts[predicted_class_idx] / np.sum(class_counts))
                
                return {
                    "name": predicted_class,
                    "prediction": predicted_class,
                    "confidence": round(confidence, 3),
                    "samples": int(tree.n_node_samples[node_id]),
                    "class_distribution": {
                        class_names[i]: int(count) for i, count in enumerate(class_counts)
                    },
                    "type": "leaf"
                }
        
        tree_data = build_tree_dict(0)
        
        return {
            "status": "success",
            "tree_data": tree_data,
            "feature_names": feature_names,
            "class_names": class_names,
            "model_info": {
                "accuracy": getattr(c45_model, 'accuracy', None),
                "samples": int(tree.n_node_samples[0])
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi kesalahan saat mengambil data tree: {str(e)}"
        )

@router.post("/cache/invalidate", status_code=status.HTTP_200_OK)
def invalidate_prediction_cache(
    request: dict = Body(...),
    current_user: User = Depends(get_current_user)
):
    """Invalidate cache untuk siswa atau semua prediksi"""
    siswa_id = request.get('siswa_id')
    semester = request.get('semester')
    tahun_ajaran = request.get('tahun_ajaran')
    
    if not cache_health_check():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Cache service tidak tersedia"
        )
    
    try:
        deleted_count = invalidate_student_cache(siswa_id, semester, tahun_ajaran)
        
        return {
            "status": "success",
            "message": f"Cache invalidated successfully. {deleted_count} entries deleted.",
            "data": {
                "siswa_id": siswa_id,
                "semester": semester,
                "tahun_ajaran": tahun_ajaran,
                "deleted_count": deleted_count
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Gagal invalidate cache: {str(e)}"
        )

@router.post("/cache/clear", status_code=status.HTTP_200_OK)
def clear_all_prediction_cache(
    current_user: User = Depends(get_current_user)
):
    """Clear semua cache prediksi"""
    if not cache_health_check():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Cache service tidak tersedia"
        )
    
    try:
        from cache_config import delete_cache_pattern
        
        patterns = [
            "predict:*",
            "student_data:*",
            "model_data:*"
        ]
        
        total_deleted = 0
        for pattern in patterns:
            deleted = delete_cache_pattern(pattern)
            total_deleted += deleted
        
        return {
            "status": "success",
            "message": f"All prediction cache cleared successfully. {total_deleted} entries deleted.",
            "data": {
                "total_deleted": total_deleted,
                "patterns_cleared": patterns
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Gagal clear cache: {str(e)}"
        )

@router.get("/feature-statistics")
def get_feature_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mendapatkan statistik distribusi fitur numerik (min, max, mean, median, std dev)"""
    try:
        # Ambil data dari database menggunakan fungsi prepare_data
        df, df_labeled = c45_model.prepare_data(db)
        
        if len(df) == 0:
            return {
                "status": "error",
                "message": "Tidak ada data yang tersedia untuk analisis statistik"
            }
        
        # Hitung statistik untuk fitur numerik
        statistics = {}
        
        # 1. Statistik Nilai Raport (rata_rata)
        if 'rata_rata' in df.columns:
            nilai_stats = df['rata_rata'].describe()
            statistics['nilai_raport'] = {
                "label": "Nilai Raport (Rata-rata)",
                "count": int(nilai_stats['count']),
                "min": round(float(nilai_stats['min']), 2),
                "max": round(float(nilai_stats['max']), 2),
                "mean": round(float(nilai_stats['mean']), 2),
                "median": round(float(df['rata_rata'].median()), 2),
                "std_dev": round(float(nilai_stats['std']), 2),
                "q1": round(float(nilai_stats['25%']), 2),
                "q3": round(float(nilai_stats['75%']), 2)
            }
        
        # 2. Statistik Penghasilan (ambil dari database langsung)
        penghasilan_data = db.query(PenghasilanOrtu).all()
        if penghasilan_data:
            penghasilan_ayah = [p.penghasilan_ayah for p in penghasilan_data if p.penghasilan_ayah is not None]
            penghasilan_ibu = [p.penghasilan_ibu for p in penghasilan_data if p.penghasilan_ibu is not None]
            total_penghasilan = [p.total_penghasilan for p in penghasilan_data if p.total_penghasilan is not None]
            
            if penghasilan_ayah:
                ayah_df = pd.Series(penghasilan_ayah)
                ayah_stats = ayah_df.describe()
                statistics['penghasilan_ayah'] = {
                    "label": "Penghasilan Ayah",
                    "count": int(ayah_stats['count']),
                    "min": int(ayah_stats['min']),
                    "max": int(ayah_stats['max']),
                    "mean": int(ayah_stats['mean']),
                    "median": int(ayah_df.median()),
                    "std_dev": int(ayah_stats['std']),
                    "q1": int(ayah_stats['25%']),
                    "q3": int(ayah_stats['75%'])
                }
            
            if penghasilan_ibu:
                ibu_df = pd.Series(penghasilan_ibu)
                ibu_stats = ibu_df.describe()
                statistics['penghasilan_ibu'] = {
                    "label": "Penghasilan Ibu",
                    "count": int(ibu_stats['count']),
                    "min": int(ibu_stats['min']),
                    "max": int(ibu_stats['max']),
                    "mean": int(ibu_stats['mean']),
                    "median": int(ibu_df.median()),
                    "std_dev": int(ibu_stats['std']),
                    "q1": int(ibu_stats['25%']),
                    "q3": int(ibu_stats['75%'])
                }
            
            if total_penghasilan:
                total_df = pd.Series(total_penghasilan)
                total_stats = total_df.describe()
                statistics['total_penghasilan'] = {
                    "label": "Total Penghasilan Orang Tua",
                    "count": int(total_stats['count']),
                    "min": int(total_stats['min']),
                    "max": int(total_stats['max']),
                    "mean": int(total_stats['mean']),
                    "median": int(total_df.median()),
                    "std_dev": int(total_stats['std']),
                    "q1": int(total_stats['25%']),
                    "q3": int(total_stats['75%'])
                }
        
        # 3. Statistik Presensi (ambil dari database langsung)
        presensi_data = db.query(Presensi).all()
        if presensi_data:
            persentase_kehadiran = [p.persentase_kehadiran for p in presensi_data if p.persentase_kehadiran is not None]
            jumlah_hadir = [p.jumlah_hadir for p in presensi_data if p.jumlah_hadir is not None]
            
            if persentase_kehadiran:
                kehadiran_df = pd.Series(persentase_kehadiran)
                kehadiran_stats = kehadiran_df.describe()
                statistics['persentase_kehadiran'] = {
                    "label": "Persentase Kehadiran (%)",
                    "count": int(kehadiran_stats['count']),
                    "min": round(float(kehadiran_stats['min']), 2),
                    "max": round(float(kehadiran_stats['max']), 2),
                    "mean": round(float(kehadiran_stats['mean']), 2),
                    "median": round(float(kehadiran_df.median()), 2),
                    "std_dev": round(float(kehadiran_stats['std']), 2),
                    "q1": round(float(kehadiran_stats['25%']), 2),
                    "q3": round(float(kehadiran_stats['75%']), 2)
                }
            
            if jumlah_hadir:
                hadir_df = pd.Series(jumlah_hadir)
                hadir_stats = hadir_df.describe()
                statistics['jumlah_hadir'] = {
                    "label": "Jumlah Hari Hadir",
                    "count": int(hadir_stats['count']),
                    "min": int(hadir_stats['min']),
                    "max": int(hadir_stats['max']),
                    "mean": round(float(hadir_stats['mean']), 1),
                    "median": int(hadir_df.median()),
                    "std_dev": round(float(hadir_stats['std']), 1),
                    "q1": int(hadir_stats['25%']),
                    "q3": int(hadir_stats['75%'])
                }
        
        # 4. Korelasi antar Fitur Numerik
        correlation_matrix = {}
        
        # Buat DataFrame untuk fitur numerik
        numerical_features = {}
        
        # Ambil data numerik dari berbagai sumber
        if 'rata_rata' in df.columns:
            numerical_features['Nilai Rata-rata'] = df['rata_rata'].tolist()
        
        if penghasilan_data:
            # Buat mapping siswa_id ke penghasilan untuk sinkronisasi data
            penghasilan_map = {p.siswa_id: p for p in penghasilan_data}
            
            # Ambil siswa_id dari df untuk sinkronisasi
            siswa_ids = []
            if 'siswa_id' in df.columns:
                siswa_ids = df['siswa_id'].tolist()
            else:
                # Jika tidak ada siswa_id di df, ambil dari database
                siswa_ids = [s.id for s in db.query(Siswa).all()]
            
            penghasilan_ayah_sync = []
            penghasilan_ibu_sync = []
            total_penghasilan_sync = []
            
            for siswa_id in siswa_ids:
                if siswa_id in penghasilan_map:
                    p = penghasilan_map[siswa_id]
                    penghasilan_ayah_sync.append(p.penghasilan_ayah or 0)
                    penghasilan_ibu_sync.append(p.penghasilan_ibu or 0)
                    total_penghasilan_sync.append(p.total_penghasilan or 0)
                else:
                    penghasilan_ayah_sync.append(0)
                    penghasilan_ibu_sync.append(0)
                    total_penghasilan_sync.append(0)
            
            if len(penghasilan_ayah_sync) == len(numerical_features.get('Nilai Rata-rata', [])):
                numerical_features['Penghasilan Ayah'] = penghasilan_ayah_sync
                numerical_features['Penghasilan Ibu'] = penghasilan_ibu_sync
                numerical_features['Total Penghasilan'] = total_penghasilan_sync
        
        if presensi_data:
            # Buat mapping siswa_id ke presensi untuk sinkronisasi data
            presensi_map = {}
            for p in presensi_data:
                key = f"{p.siswa_id}_{p.semester}_{p.tahun_ajaran}"
                presensi_map[key] = p
            
            persentase_kehadiran_sync = []
            jumlah_hadir_sync = []
            
            # Sinkronisasi dengan data yang ada di df
            for idx, row in df.iterrows():
                siswa_id = row.get('siswa_id', 0)
                semester = row.get('semester', 'Ganjil')
                tahun_ajaran = row.get('tahun_ajaran', '2024/2025')
                key = f"{siswa_id}_{semester}_{tahun_ajaran}"
                
                if key in presensi_map:
                    p = presensi_map[key]
                    persentase_kehadiran_sync.append(p.persentase_kehadiran or 0)
                    jumlah_hadir_sync.append(p.jumlah_hadir or 0)
                else:
                    persentase_kehadiran_sync.append(0)
                    jumlah_hadir_sync.append(0)
            
            if len(persentase_kehadiran_sync) == len(numerical_features.get('Nilai Rata-rata', [])):
                numerical_features['Persentase Kehadiran'] = persentase_kehadiran_sync
                numerical_features['Jumlah Hari Hadir'] = jumlah_hadir_sync
        
        # Hitung korelasi jika ada minimal 2 fitur numerik
        if len(numerical_features) >= 2:
            try:
                # Buat DataFrame dari fitur numerik
                corr_df = pd.DataFrame(numerical_features)
                
                # Hitung matriks korelasi
                corr_matrix = corr_df.corr()
                
                # Konversi ke format yang mudah dibaca frontend
                correlation_data = {}
                feature_names = list(corr_matrix.columns)
                
                for i, feature1 in enumerate(feature_names):
                    correlation_data[feature1] = {}
                    for j, feature2 in enumerate(feature_names):
                        correlation_value = corr_matrix.iloc[i, j]
                        # Handle NaN values
                        if pd.isna(correlation_value):
                            correlation_value = 0.0
                        correlation_data[feature1][feature2] = round(float(correlation_value), 3)
                
                correlation_matrix = {
                    "matrix": correlation_data,
                    "features": feature_names,
                    "description": "Korelasi Pearson antar fitur numerik (-1 hingga 1)",
                    "interpretation": {
                        "strong_positive": "0.7 hingga 1.0 (korelasi positif kuat)",
                        "moderate_positive": "0.3 hingga 0.7 (korelasi positif sedang)",
                        "weak_positive": "0.1 hingga 0.3 (korelasi positif lemah)",
                        "no_correlation": "-0.1 hingga 0.1 (tidak ada korelasi)",
                        "weak_negative": "-0.3 hingga -0.1 (korelasi negatif lemah)",
                        "moderate_negative": "-0.7 hingga -0.3 (korelasi negatif sedang)",
                        "strong_negative": "-1.0 hingga -0.7 (korelasi negatif kuat)"
                    }
                }
                
            except Exception as e:
                correlation_matrix = {
                    "error": f"Gagal menghitung korelasi: {str(e)}",
                    "matrix": {},
                    "features": []
                }
        
        # 5. Distribusi Kategori
        kategori_stats = {}
        
        # Distribusi kategori penghasilan
        if penghasilan_data:
            kategori_penghasilan = [p.kategori_penghasilan for p in penghasilan_data if p.kategori_penghasilan]
            if kategori_penghasilan:
                kategori_penghasilan_count = pd.Series(kategori_penghasilan).value_counts().to_dict()
                kategori_stats['kategori_penghasilan'] = {
                    "label": "Distribusi Kategori Penghasilan",
                    "data": kategori_penghasilan_count,
                    "total": len(kategori_penghasilan)
                }
        
        # Distribusi kategori kehadiran
        if presensi_data:
            kategori_kehadiran = [p.kategori_kehadiran for p in presensi_data if p.kategori_kehadiran]
            if kategori_kehadiran:
                kategori_kehadiran_count = pd.Series(kategori_kehadiran).value_counts().to_dict()
                kategori_stats['kategori_kehadiran'] = {
                    "label": "Distribusi Kategori Kehadiran",
                    "data": kategori_kehadiran_count,
                    "total": len(kategori_kehadiran)
                }
        
        # Distribusi prediksi prestasi (jika ada)
        if len(df_labeled) > 0:
            prediksi_prestasi = df_labeled['prediksi_prestasi'].value_counts().to_dict()
            kategori_stats['prediksi_prestasi'] = {
                "label": "Distribusi Prediksi Prestasi",
                "data": prediksi_prestasi,
                "total": len(df_labeled)
            }
        
        return {
            "status": "success",
            "data": {
                "numerical_statistics": statistics,
                "correlation_matrix": correlation_matrix,
                "categorical_distributions": kategori_stats,
                "summary": {
                    "total_records": len(df),
                    "labeled_records": len(df_labeled),
                    "features_analyzed": len(statistics),
                    "categories_analyzed": len(kategori_stats),
                    "correlation_features": len(correlation_matrix.get("features", []))
                }
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi kesalahan saat mengambil statistik fitur: {str(e)}"
        )


# =============================================
# MODEL ACCURACY MANAGEMENT ENDPOINTS
# =============================================

@router.post("/model/retrain", status_code=status.HTTP_200_OK)
def manual_model_retrain(
    trigger: str = "manual",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Manual model retraining dengan validation dan backup"""
    try:
        # Parse trigger
        retraining_trigger = RetrainingTrigger.MANUAL
        if trigger == "data_change":
            retraining_trigger = RetrainingTrigger.DATA_CHANGE
        elif trigger == "accuracy_degradation":
            retraining_trigger = RetrainingTrigger.ACCURACY_DEGRADATION
        elif trigger == "scheduled":
            retraining_trigger = RetrainingTrigger.SCHEDULED
        
        result = model_accuracy_manager.retrain_model_if_needed(db, retraining_trigger)
        
        return {
            "status": "success" if result["success"] else "failed",
            "message": result["message"],
            "data": result
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error during manual retraining: {str(e)}"
        )


@router.get("/model/performance", status_code=status.HTTP_200_OK)
def get_model_performance_monitoring(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get model performance monitoring dan accuracy degradation detection"""
    try:
        monitoring_result = model_accuracy_manager.monitor_model_performance(db)
        
        return {
            "status": "success",
            "message": "Model performance monitoring completed",
            "data": monitoring_result
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error monitoring model performance: {str(e)}"
        )


@router.post("/model/validate-change", status_code=status.HTTP_200_OK)
def validate_data_change_impact(
    request: dict = Body(...),
    current_user: User = Depends(get_current_user)
):
    """Validate impact of data changes pada model accuracy"""
    try:
        siswa_id = request.get("siswa_id")
        change_type = request.get("change_type")  # 'nilai', 'presensi', 'penghasilan'
        old_value = request.get("old_value")
        new_value = request.get("new_value")
        
        if not all([siswa_id, change_type, old_value is not None, new_value is not None]):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing required fields: siswa_id, change_type, old_value, new_value"
            )
        
        validation_result = model_accuracy_manager.validate_data_change(
            siswa_id=siswa_id,
            change_type=change_type,
            old_value=old_value,
            new_value=new_value
        )
        
        return {
            "status": "success",
            "message": "Data change validation completed",
            "data": validation_result
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error validating data change: {str(e)}"
        )


@router.get("/model/data-changes", status_code=status.HTTP_200_OK)
def get_recent_data_changes(
    days: int = 7,
    current_user: User = Depends(get_current_user)
):
    """Get recent data changes yang mempengaruhi model accuracy"""
    try:
        recent_changes = model_accuracy_manager._get_recent_data_changes(days)
        
        return {
            "status": "success",
            "message": f"Retrieved data changes for last {days} days",
            "data": {
                "changes": recent_changes,
                "total_changes": len(recent_changes),
                "days_analyzed": days,
                "timestamp": datetime.now().isoformat()
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting recent data changes: {str(e)}"
        )


@router.get("/model/health", status_code=status.HTTP_200_OK)
def get_model_health_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get comprehensive model health status dan recommendations"""
    try:
        # Get current model metrics
        current_metrics = model_accuracy_manager._get_current_model_metrics()
        
        # Get training requirements
        training_req = model_accuracy_manager._validate_training_requirements(db)
        
        # Get data quality check
        data_quality = model_accuracy_manager._check_data_quality(db)
        
        # Get recent changes
        recent_changes = model_accuracy_manager._get_recent_data_changes(days=7)
        
        # Determine overall health status
        health_status = "healthy"
        warnings = []
        recommendations = []
        
        if not current_metrics:
            health_status = "no_model"
            warnings.append("No model metrics available")
            recommendations.append("Train initial model")
        
        if not training_req["can_train"]:
            health_status = "insufficient_data"
            warnings.append(training_req["message"])
            recommendations.append("Add more labeled training data")
        
        if not data_quality["is_good"]:
            health_status = "data_quality_issues"
            warnings.extend(data_quality["issues"])
            recommendations.append("Improve data quality")
        
        # Check model age
        if current_metrics:
            days_since_training = (datetime.now() - current_metrics.timestamp).days
            if days_since_training > model_accuracy_manager.max_days_without_training:
                health_status = "stale_model"
                warnings.append(f"Model is {days_since_training} days old")
                recommendations.append("Consider model retraining")
        
        health_data = {
            "overall_status": health_status,
            "current_metrics": {
                "accuracy": current_metrics.accuracy if current_metrics else None,
                "model_version": current_metrics.model_version if current_metrics else None,
                "training_samples": current_metrics.training_samples if current_metrics else None,
                "days_since_training": (datetime.now() - current_metrics.timestamp).days if current_metrics else None
            } if current_metrics else None,
            "training_requirements": training_req,
            "data_quality": data_quality,
            "recent_activity": {
                "changes_last_7_days": len(recent_changes),
                "significant_changes": len([c for c in recent_changes if c.get("is_significant", False)])
            },
            "warnings": warnings,
            "recommendations": recommendations,
            "timestamp": datetime.now().isoformat()
        }
        
        return {
            "status": "success",
            "message": "Model health status retrieved",
            "data": health_data
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting model health status: {str(e)}"
        )