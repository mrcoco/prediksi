# Use Case Diagram Manajemen Siswa - Operasi CRUD

## Ringkasan
Use case diagram ini menggambarkan operasi CRUD (Create, Read, Update, Delete) untuk manajemen data siswa dalam sistem EduPro. Diagram ini fokus pada 5 operasi utama dengan dependensi authentication dan notification.

## Actors (Pelaku)
- **👤 User (Guru/Admin)**: Pengguna utama yang melakukan operasi CRUD
- **🔐 Authentication System**: Sistem yang menangani autentikasi dan otorisasi

## Use Cases

### 🔄 CRUD Operations (5 Use Cases)
1. **UC1: Tambah Data Siswa (Create)**
   - Deskripsi: Menambahkan data siswa baru ke sistem
   - Actor: User
   - Dependencies: Token Validation (UC8)
   - Extensions: Success/Error Notification (UC9/UC10)

2. **UC2: Lihat Daftar Siswa (Read All)**
   - Deskripsi: Menampilkan daftar semua siswa
   - Actor: User
   - Dependencies: Token Validation (UC8)
   - Extensions: Success/Error Notification (UC9/UC10)

3. **UC3: Lihat Detail Siswa (Read Single)**
   - Deskripsi: Menampilkan detail siswa tertentu
   - Actor: User
   - Dependencies: Token Validation (UC8)
   - Extensions: Error Notification (UC10)

4. **UC4: Edit Data Siswa (Update)**
   - Deskripsi: Mengubah data siswa yang sudah ada
   - Actor: User
   - Dependencies: Token Validation (UC8)
   - Extensions: Success/Error Notification (UC9/UC10)

5. **UC5: Hapus Data Siswa (Delete)**
   - Deskripsi: Menghapus data siswa dari sistem
   - Actor: User
   - Dependencies: Token Validation (UC8)
   - Extensions: Success/Error Notification (UC9/UC10)

### 🔐 Authentication (3 Use Cases)
6. **UC6: Login (Authentication)**
   - Deskripsi: Proses login user ke sistem
   - Actor: Authentication System

7. **UC7: Autorisasi (Authorization)**
   - Deskripsi: Pengecekan hak akses user
   - Actor: Authentication System

8. **UC8: Validasi Token (Token Validation)**
   - Deskripsi: Validasi token JWT untuk setiap operasi
   - Actor: Authentication System
   - Dependencies: Semua operasi CRUD

### 🔔 Notification (2 Use Cases)
9. **UC9: Notifikasi Sukses (Success Notification)**
   - Deskripsi: Menampilkan notifikasi sukses
   - Extensions: Create, Read All, Update, Delete

10. **UC10: Notifikasi Error (Error Notification)**
    - Deskripsi: Menampilkan notifikasi error
    - Extensions: Semua operasi CRUD

## Relasi Use Cases

### Include Relationships (Dependencies)
- Semua operasi CRUD (UC1-UC5) bergantung pada Token Validation (UC8)
- Ini memastikan keamanan sistem dengan validasi token untuk setiap operasi

### Extend Relationships (Optional)
- Operasi Create, Read All, Update, Delete dapat menampilkan notifikasi sukses
- Semua operasi CRUD dapat menampilkan notifikasi error jika terjadi masalah

## Keunggulan Diagram Ini

### ✅ Fokus CRUD
- Hanya menampilkan 5 operasi CRUD utama
- Menghilangkan kompleksitas yang tidak perlu
- Mudah dipahami untuk development team

### ✅ Keamanan Terintegrasi
- Authentication system terpisah dan jelas
- Token validation untuk setiap operasi
- Role-based access control

### ✅ User Experience
- Notifikasi system untuk feedback user
- Clear success/error handling
- Professional appearance dengan icons

### ✅ Scalability
- Mudah ditambahkan use case baru
- Modular design dengan packages
- Consistent styling

## Implementasi Teknis

### Backend API Endpoints
```python
POST   /api/siswa          # Create
GET    /api/siswa          # Read All
GET    /api/siswa/{id}     # Read Single
PUT    /api/siswa/{id}     # Update
DELETE /api/siswa/{id}     # Delete
```

### Frontend Integration
- Kendo UI Grid untuk CRUD operations
- JWT token authentication
- Toast notifications untuk feedback
- Modal confirmations untuk delete

### Database Operations
- PostgreSQL dengan SQLAlchemy ORM
- NIS uniqueness validation
- Foreign key constraints
- Audit trail logging

## Status
**Production Ready** - Use case diagram ringkas untuk operasi CRUD manajemen siswa yang siap untuk implementasi development.

## File Terkait
- `docs/use_case_diagram_manajemen_siswa_crud.mmd` - Diagram Mermaid
- `docs/use_case_diagram_manajemen_siswa.mmd` - Diagram lengkap (21 use cases)
- `docs/use_case_siswa.md` - Dokumentasi lengkap 