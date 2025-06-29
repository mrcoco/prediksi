# DOKUMENTASI OPTIMASI DATABASE DENGAN SQLALCHEMY EDUPRO 2025

## 📋 RINGKASAN EKSEKUTIF

Dokumen ini menjelaskan implementasi optimasi database menggunakan SQLAlchemy ORM untuk sistem EduPro. Optimasi ini mencakup model definition, query optimization, session management, dan caching strategy.

## 🎯 MODEL DEFINITION & RELATIONSHIPS

### 1. Base Model Configuration
```python
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

Base = declarative_base()

class TimestampMixin:
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class NilaiRaport(Base, TimestampMixin):
    __tablename__ = 'nilai_raport'
    __table_args__ = (
        Index('idx_nilai_raport_semester_tahun', 'semester', 'tahun_ajaran'),
        Index('idx_nilai_raport_siswa_semester', 'siswa_id', 'semester', 'tahun_ajaran')
    )

    id = Column(Integer, primary_key=True)
    siswa_id = Column(Integer, ForeignKey('siswa.id'))
    semester = Column(String)
    tahun_ajaran = Column(String)
    matematika = Column(Float)
    bahasa_indonesia = Column(Float)
    bahasa_inggris = Column(Float)
    ipa = Column(Float)
    bahasa_jawa = Column(Float)
    rata_rata = Column(Float)
    
    # Relationships
    siswa = relationship("Siswa", back_populates="nilai_raport")
    
    @hybrid_property
    def calculate_rata_rata(self):
        nilai_list = [
            self.matematika or 0,
            self.bahasa_indonesia or 0,
            self.bahasa_inggris or 0,
            self.ipa or 0,
            self.bahasa_jawa or 0
        ]
        return sum(nilai_list) / len(nilai_list)
```

## 🚀 QUERY OPTIMIZATION

### 1. Eager Loading
```python
from sqlalchemy.orm import joinedload, selectinload

# Sebelum Optimasi
def get_siswa_nilai():
    return session.query(Siswa).all()
    # N+1 queries untuk setiap siswa.nilai_raport

# Setelah Optimasi
def get_siswa_nilai_optimized():
    return session.query(Siswa)\
        .options(selectinload(Siswa.nilai_raport))\
        .all()
    # Single query dengan JOIN
```

### 2. Bulk Operations
```python
# Sebelum Optimasi
for nilai in nilai_list:
    db.session.add(nilai)
    db.session.commit()

# Setelah Optimasi
def bulk_update_nilai(nilai_list):
    session.bulk_save_objects(nilai_list)
    session.commit()
```

### 3. Query Caching
```python
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.sql import select
from cachetools import TTLCache

cache = TTLCache(maxsize=100, ttl=3600)

class QueryCache:
    @staticmethod
    def get_or_compute(key, query_func):
        if key in cache:
            return cache[key]
        result = query_func()
        cache[key] = result
        return result

# Implementasi
def get_prestasi_summary(semester, tahun_ajaran):
    cache_key = f"prestasi_summary_{semester}_{tahun_ajaran}"
    
    def query_func():
        return session.query(
            NilaiRaport.semester,
            NilaiRaport.tahun_ajaran,
            func.count().label('total_siswa'),
            func.avg(NilaiRaport.rata_rata).label('rata_rata_nilai')
        ).filter(
            NilaiRaport.semester == semester,
            NilaiRaport.tahun_ajaran == tahun_ajaran
        ).group_by(
            NilaiRaport.semester,
            NilaiRaport.tahun_ajaran
        ).first()
    
    return QueryCache.get_or_compute(cache_key, query_func)
```

## 📊 SESSION MANAGEMENT

### 1. Session Factory
```python
from sqlalchemy.orm import sessionmaker, scoped_session
from contextlib import contextmanager

Session = scoped_session(sessionmaker(bind=engine))

@contextmanager
def session_scope():
    session = Session()
    try:
        yield session
        session.commit()
    except:
        session.rollback()
        raise
    finally:
        session.close()

# Usage
def update_nilai(siswa_id, nilai_data):
    with session_scope() as session:
        nilai = session.query(NilaiRaport).filter_by(siswa_id=siswa_id).first()
        for key, value in nilai_data.items():
            setattr(nilai, key, value)
        return nilai
```

### 2. Connection Pooling
```python
from sqlalchemy import create_engine

engine = create_engine(
    'postgresql://user:pass@localhost/dbname',
    pool_size=20,
    max_overflow=10,
    pool_timeout=30,
    pool_recycle=1800
)
```

## 🔄 BATCH PROCESSING

### 1. Chunked Updates
```python
def process_in_chunks(items, chunk_size=1000):
    for i in range(0, len(items), chunk_size):
        chunk = items[i:i + chunk_size]
        with session_scope() as session:
            session.bulk_save_objects(chunk)

# Usage
nilai_list = [NilaiRaport(...) for _ in range(10000)]
process_in_chunks(nilai_list)
```

### 2. Async Processing
```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.asyncio import async_sessionmaker

async_engine = create_async_engine(
    'postgresql+asyncpg://user:pass@localhost/dbname',
    pool_size=20,
    max_overflow=10
)

async_session = async_sessionmaker(async_engine, expire_on_commit=False)

async def async_update_nilai(nilai_list):
    async with async_session() as session:
        async with session.begin():
            session.add_all(nilai_list)
```

## 📈 PERFORMANCE MONITORING

### 1. Query Statistics
```python
from sqlalchemy import event
from time import time

query_stats = {}

@event.listens_for(engine, "before_cursor_execute")
def before_cursor_execute(conn, cursor, statement, parameters, context, executemany):
    conn.info.setdefault('query_start_time', []).append(time())

@event.listens_for(engine, "after_cursor_execute")
def after_cursor_execute(conn, cursor, statement, parameters, context, executemany):
    total = time() - conn.info['query_start_time'].pop()
    query_stats.setdefault(statement, []).append(total)
```

### 2. Connection Monitoring
```python
from sqlalchemy.pool import _ConnectionRecord

def connection_record_checker(dbapi_connection, connection_record):
    print(f"Connection created: {connection_record}")
    
event.listen(engine, 'connect', connection_record_checker)
```

## ⚡ OPTIMIZATION TECHNIQUES

### 1. Hybrid Properties
```python
class NilaiRaport(Base):
    @hybrid_property
    def status_kelulusan(self):
        return "LULUS" if self.rata_rata >= 75 else "TIDAK LULUS"
    
    @status_kelulusan.expression
    def status_kelulusan(cls):
        return case(
            [(cls.rata_rata >= 75, "LULUS")],
            else_="TIDAK LULUS"
        )
```

### 2. Custom Query Classes
```python
from sqlalchemy.orm import Query

class OptimizedQuery(Query):
    def paginate(self, page=1, per_page=20):
        return self.limit(per_page).offset((page - 1) * per_page)

# Usage
session.query(NilaiRaport).with_session(session).\
    filter(NilaiRaport.semester == '1').\
    paginate(page=2)
```

## 🛠️ MAINTENANCE UTILITIES

### 1. Database Migration
```python
from alembic import op
import sqlalchemy as sa

def upgrade():
    op.create_index(
        'idx_nilai_raport_composite',
        'nilai_raport',
        ['siswa_id', 'semester', 'tahun_ajaran']
    )

def downgrade():
    op.drop_index('idx_nilai_raport_composite')
```

### 2. Data Validation
```python
from sqlalchemy.event import listens_for

@listens_for(NilaiRaport, 'before_insert')
def validate_nilai(mapper, connection, target):
    if not (0 <= target.rata_rata <= 100):
        raise ValueError("Nilai rata-rata harus antara 0 dan 100")
```

## 📋 BEST PRACTICES

1. **Session Management**:
   - Selalu gunakan context manager untuk session
   - Implement proper error handling
   - Close sessions explicitly

2. **Query Optimization**:
   - Use appropriate loading techniques (eager vs lazy)
   - Implement caching for frequent queries
   - Use bulk operations for batch processing

3. **Model Design**:
   - Implement proper relationships
   - Use hybrid properties for computed values
   - Define appropriate indexes

4. **Performance**:
   - Monitor query execution time
   - Implement connection pooling
   - Use async operations where appropriate

## ⚠️ COMMON PITFALLS

1. **N+1 Query Problem**:
   - Identifikasi query yang menghasilkan N+1 problem
   - Gunakan eager loading dengan joinedload/selectinload
   - Monitor query execution

2. **Memory Management**:
   - Hindari loading seluruh dataset ke memory
   - Implementasi pagination
   - Gunakan yield untuk large datasets

3. **Session Handling**:
   - Hindari session scoping yang terlalu luas
   - Pastikan proper cleanup
   - Handle concurrent access dengan benar

## 📈 MONITORING DAN LOGGING

```python
import logging
logging.basicConfig()
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

# Custom Query Logger
class QueryLogger:
    def __init__(self):
        self.queries = []
    
    def log_query(self, statement, parameters):
        self.queries.append({
            'statement': statement,
            'parameters': parameters,
            'timestamp': datetime.now()
        })

query_logger = QueryLogger()
``` 