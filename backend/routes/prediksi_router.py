from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db, Siswa, NilaiRaport, PenghasilanOrtu, Presensi, Prestasi
from schemas import PrestasiCreate, PrestasiResponse, PrediksiRequest, PrediksiResponse
from models.c45_model import c45_model
from datetime import datetime
import os
import random
import pandas as pd
from routes.auth_router import get_current_user
from models.user import User

router = APIRouter()

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
    current_user: User = Depends(get_current_user)
):
    """Memprediksi prestasi siswa berdasarkan data yang ada"""
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
        
        # Siapkan response
        response = {
            'siswa_id': request.siswa_id,
            'nama_siswa': siswa.nama,
            'prediksi_prestasi': result['prediksi'],
            'confidence': result['confidence'],
            'detail_faktor': {
                'nilai_rata_rata': nilai.rata_rata,
                'kategori_penghasilan': penghasilan.kategori_penghasilan,
                'kategori_kehadiran': presensi.kategori_kehadiran,
                'feature_importances': result['feature_importances']
            }
        }
        
        return response
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi kesalahan saat melakukan prediksi: {str(e)}"
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
def get_visualization(db: Session = Depends(get_db)):
    """Mendapatkan URL visualisasi pohon keputusan"""
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
            "image": base64_image
        }
    except Exception as e:
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
            return {
                "status": "error",
                "message": "Model belum dilatih. Silakan latih model terlebih dahulu."
            }
        
        # Ambil confusion matrix
        result = c45_model.get_confusion_matrix()
        
        return {
            "status": "success",
            "confusion_matrix": result['confusion_matrix'],
            "labels": result['labels']
        }
    
    except ValueError as e:
        return {
            "status": "error",
            "message": str(e)
        }
    except Exception as e:
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