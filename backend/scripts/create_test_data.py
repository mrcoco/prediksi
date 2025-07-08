from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext
import sys
import os

# Tambahkan direktori backend ke PYTHONPATH
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.user import User, Base
from models.siswa import Siswa
from models.nilai_raport import NilaiRaport
from models.presensi import Presensi
from models.penghasilan_ortu import PenghasilanOrtu

# Konfigurasi database
DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/prestasi_siswa"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_test_data():
    db = SessionLocal()
    try:
        # Buat user test
        test_users = [
            {
                "username": "testuser",
                "email": "testuser@example.com",
                "password": "correctpassword",
                "role": "admin",
                "profile": {"full_name": "Test User"},
                "is_active": True
            },
            {
                "username": "teststaff",
                "email": "teststaff@example.com",
                "password": "staffpassword",
                "role": "staff",
                "profile": {"full_name": "Test Staff"},
                "is_active": True
            }
        ]

        for user_data in test_users:
            existing_user = db.query(User).filter(User.username == user_data["username"]).first()
            if not existing_user:
                user = User(
                    username=user_data["username"],
                    email=user_data["email"],
                    hashed_password=pwd_context.hash(user_data["password"]),
                    role=user_data["role"],
                    profile=user_data["profile"],
                    is_active=user_data["is_active"]
                )
                db.add(user)
                print(f"Created user: {user_data['username']}")
            else:
                print(f"User {user_data['username']} already exists")

        # Buat data siswa test
        test_siswa = [
            {
                "nis": "12345",
                "nama": "Siswa Test 1",
                "kelas": "XI IPA 1",
                "jenis_kelamin": "L",
                "alamat": "Jl. Test No. 1"
            },
            {
                "nis": "12346",
                "nama": "Siswa Test 2",
                "kelas": "XI IPA 1",
                "jenis_kelamin": "P",
                "alamat": "Jl. Test No. 2"
            }
        ]

        for siswa_data in test_siswa:
            existing_siswa = db.query(Siswa).filter(Siswa.nis == siswa_data["nis"]).first()
            if not existing_siswa:
                siswa = Siswa(**siswa_data)
                db.add(siswa)
                print(f"Created siswa: {siswa_data['nama']}")
            else:
                print(f"Siswa {siswa_data['nama']} already exists")

        # Buat data nilai raport
        test_nilai = [
            {
                "siswa_id": 1,
                "semester": "Ganjil",
                "tahun_ajaran": "2023/2024",
                "nilai_pengetahuan": 85.5,
                "nilai_keterampilan": 87.0,
                "nilai_sikap": "A"
            },
            {
                "siswa_id": 2,
                "semester": "Ganjil",
                "tahun_ajaran": "2023/2024",
                "nilai_pengetahuan": 82.5,
                "nilai_keterampilan": 84.0,
                "nilai_sikap": "B"
            }
        ]

        for nilai_data in test_nilai:
            existing_nilai = db.query(NilaiRaport).filter(
                NilaiRaport.siswa_id == nilai_data["siswa_id"],
                NilaiRaport.semester == nilai_data["semester"],
                NilaiRaport.tahun_ajaran == nilai_data["tahun_ajaran"]
            ).first()
            if not existing_nilai:
                nilai = NilaiRaport(**nilai_data)
                db.add(nilai)
                print(f"Created nilai for siswa_id: {nilai_data['siswa_id']}")
            else:
                print(f"Nilai for siswa_id {nilai_data['siswa_id']} already exists")

        # Buat data presensi
        test_presensi = [
            {
                "siswa_id": 1,
                "semester": "Ganjil",
                "tahun_ajaran": "2023/2024",
                "jumlah_hadir": 85,
                "jumlah_sakit": 2,
                "jumlah_izin": 1,
                "jumlah_alpa": 0
            },
            {
                "siswa_id": 2,
                "semester": "Ganjil",
                "tahun_ajaran": "2023/2024",
                "jumlah_hadir": 82,
                "jumlah_sakit": 3,
                "jumlah_izin": 2,
                "jumlah_alpa": 1
            }
        ]

        for presensi_data in test_presensi:
            existing_presensi = db.query(Presensi).filter(
                Presensi.siswa_id == presensi_data["siswa_id"],
                Presensi.semester == presensi_data["semester"],
                Presensi.tahun_ajaran == presensi_data["tahun_ajaran"]
            ).first()
            if not existing_presensi:
                presensi = Presensi(**presensi_data)
                db.add(presensi)
                print(f"Created presensi for siswa_id: {presensi_data['siswa_id']}")
            else:
                print(f"Presensi for siswa_id {presensi_data['siswa_id']} already exists")

        # Buat data penghasilan ortu
        test_penghasilan = [
            {
                "siswa_id": 1,
                "penghasilan_ayah": 5000000,
                "penghasilan_ibu": 3000000,
                "total_penghasilan": 8000000
            },
            {
                "siswa_id": 2,
                "penghasilan_ayah": 4000000,
                "penghasilan_ibu": 2500000,
                "total_penghasilan": 6500000
            }
        ]

        for penghasilan_data in test_penghasilan:
            existing_penghasilan = db.query(PenghasilanOrtu).filter(
                PenghasilanOrtu.siswa_id == penghasilan_data["siswa_id"]
            ).first()
            if not existing_penghasilan:
                penghasilan = PenghasilanOrtu(**penghasilan_data)
                db.add(penghasilan)
                print(f"Created penghasilan for siswa_id: {penghasilan_data['siswa_id']}")
            else:
                print(f"Penghasilan for siswa_id {penghasilan_data['siswa_id']} already exists")

        db.commit()
        print("All test data created successfully!")

    except Exception as e:
        print(f"Error creating test data: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_data() 