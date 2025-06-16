# pgAdmin Setup - Database Management Interface

## 🐘 pgAdmin untuk Manajemen Database PostgreSQL

### 📋 Konfigurasi yang Ditambahkan

#### Docker Compose Service
```yaml
pgadmin:
  image: dpage/pgadmin4:latest
  container_name: prestasi-siswa-pgadmin
  environment:
    - PGADMIN_DEFAULT_EMAIL=admin@prestasi-siswa.com
    - PGADMIN_DEFAULT_PASSWORD=admin123
    - PGADMIN_CONFIG_SERVER_MODE=False
    - PGADMIN_CONFIG_MASTER_PASSWORD_REQUIRED=False
  ports:
    - "5050:80"
  volumes:
    - pgadmin_data:/var/lib/pgadmin
    - ./pgadmin/servers.json:/pgadmin4/servers.json:ro
  depends_on:
    - db
  networks:
    - prestasi-network
  restart: unless-stopped
```

### 🚀 Cara Menjalankan

#### 1. Start Docker Compose
```bash
# Start semua services termasuk pgAdmin
docker-compose up -d

# Atau start hanya pgAdmin jika database sudah running
docker-compose up -d pgadmin
```

#### 2. Akses pgAdmin
- **URL**: http://localhost:5050
- **Email**: admin@prestasi-siswa.com
- **Password**: admin123

### 🔧 Konfigurasi Database Connection

#### Automatic Connection
Database connection sudah dikonfigurasi otomatis melalui `servers.json`:
- **Server Name**: Prestasi Siswa Database
- **Host**: db (container name)
- **Port**: 5432
- **Database**: prestasi_siswa
- **Username**: postgres
- **Password**: postgres (akan diminta saat pertama kali connect)

#### Manual Connection (jika diperlukan)
Jika koneksi otomatis tidak bekerja, tambahkan server manual:
1. Klik kanan pada "Servers" → "Create" → "Server"
2. **General Tab**:
   - Name: Prestasi Siswa Database
3. **Connection Tab**:
   - Host name/address: `db`
   - Port: `5432`
   - Maintenance database: `prestasi_siswa`
   - Username: `postgres`
   - Password: `postgres`

### 📊 Fitur yang Tersedia

#### 1. **Database Management**
- ✅ View dan edit tables
- ✅ Execute SQL queries
- ✅ Database backup dan restore
- ✅ User dan permission management
- ✅ Performance monitoring

#### 2. **Query Tool**
- ✅ SQL editor dengan syntax highlighting
- ✅ Query execution dan result viewing
- ✅ Query history
- ✅ Export results (CSV, JSON, etc.)

#### 3. **Schema Browser**
- ✅ Browse tables, views, functions
- ✅ View table structure dan relationships
- ✅ Index management
- ✅ Constraint management

### 🔍 Useful Queries untuk Prestasi Siswa

#### Check Tables
```sql
-- List all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check table structure
\d users
\d siswa
\d nilai_raport
\d presensi
\d penghasilan_ortu
\d prediksi_prestasi
```

#### Data Exploration
```sql
-- Count records in each table
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'siswa', COUNT(*) FROM siswa
UNION ALL
SELECT 'nilai_raport', COUNT(*) FROM nilai_raport
UNION ALL
SELECT 'presensi', COUNT(*) FROM presensi
UNION ALL
SELECT 'penghasilan_ortu', COUNT(*) FROM penghasilan_ortu
UNION ALL
SELECT 'prediksi_prestasi', COUNT(*) FROM prediksi_prestasi;

-- Check user roles
SELECT role, COUNT(*) as count 
FROM users 
GROUP BY role;

-- Recent predictions
SELECT s.nama, pp.prediksi_prestasi, pp.confidence, pp.created_at
FROM prediksi_prestasi pp
JOIN siswa s ON pp.siswa_id = s.id
ORDER BY pp.created_at DESC
LIMIT 10;
```

### 🛠️ Troubleshooting

#### 1. **pgAdmin tidak bisa akses**
```bash
# Check container status
docker-compose ps

# Check pgAdmin logs
docker-compose logs pgadmin

# Restart pgAdmin
docker-compose restart pgadmin
```

#### 2. **Database connection failed**
```bash
# Check database status
docker-compose logs db

# Test database connection from backend
docker-compose exec backend python -c "
import psycopg2
try:
    conn = psycopg2.connect('postgresql://postgres:postgres@db:5432/prestasi_siswa')
    print('Database connection successful')
    conn.close()
except Exception as e:
    print(f'Database connection failed: {e}')
"
```

#### 3. **Reset pgAdmin configuration**
```bash
# Remove pgAdmin data volume
docker-compose down
docker volume rm prestasi-siswa_pgadmin_data
docker-compose up -d pgadmin
```

### 🔐 Security Considerations

#### Production Setup
Untuk production, ubah konfigurasi berikut:

```yaml
environment:
  - PGADMIN_DEFAULT_EMAIL=your-admin@company.com
  - PGADMIN_DEFAULT_PASSWORD=your-secure-password
  - PGADMIN_CONFIG_SERVER_MODE=True
  - PGADMIN_CONFIG_MASTER_PASSWORD_REQUIRED=True
```

#### Network Security
```yaml
# Hanya expose pgAdmin ke localhost
ports:
  - "127.0.0.1:5050:80"
```

### 📱 Mobile Access

pgAdmin web interface responsive dan dapat diakses melalui:
- **Desktop**: http://localhost:5050
- **Mobile**: http://your-server-ip:5050
- **Tablet**: Optimized untuk tablet viewing

### 🔄 Backup dan Restore

#### Backup Database
1. Klik kanan pada database "prestasi_siswa"
2. Pilih "Backup..."
3. Pilih format (Custom, Tar, Plain)
4. Klik "Backup"

#### Restore Database
1. Klik kanan pada "Databases"
2. Pilih "Restore..."
3. Upload backup file
4. Klik "Restore"

### 📈 Performance Monitoring

#### Query Performance
- **Explain**: Analyze query execution plans
- **Query History**: Review slow queries
- **Statistics**: Table dan index statistics

#### Database Health
```sql
-- Check database size
SELECT pg_size_pretty(pg_database_size('prestasi_siswa'));

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Active connections
SELECT count(*) as active_connections 
FROM pg_stat_activity 
WHERE state = 'active';
```

---

## 🎯 Quick Start Checklist

- [ ] Run `docker-compose up -d`
- [ ] Access http://localhost:5050
- [ ] Login dengan admin@prestasi-siswa.com / admin123
- [ ] Connect ke "Prestasi Siswa Database"
- [ ] Explore tables dan data
- [ ] Run test queries
- [ ] Setup backup schedule (optional)

**Happy Database Management! 🐘✨** 