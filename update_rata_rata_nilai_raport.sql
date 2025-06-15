-- Update Rata-rata Nilai Raport
-- Script untuk mengupdate rata_rata pada tabel nilai_raport berdasarkan perhitungan 11 mata pelajaran
-- Menggunakan logika yang sama dengan function create_nilai di backend

-- ========================================
-- INFORMASI SCRIPT
-- ========================================
-- Tujuan: Update rata_rata yang NULL, kosong, atau tidak konsisten
-- Logika: rata_rata = (sum of 11 mata pelajaran) / 11
-- Mata Pelajaran:
--   1. matematika
--   2. bahasa_indonesia
--   3. bahasa_inggris
--   4. bahasa_jawa
--   5. ipa
--   6. agama
--   7. pjok
--   8. pkn
--   9. sejarah
--   10. seni
--   11. dasar_kejuruan

-- ========================================
-- CEK DATA SEBELUM UPDATE
-- ========================================

-- Cek jumlah record dengan rata_rata kosong
SELECT 
    COUNT(*) as total_kosong_rata_rata,
    'Record dengan rata_rata NULL atau 0' as keterangan
FROM nilai_raport 
WHERE rata_rata IS NULL OR rata_rata = 0;

-- Cek distribusi rata-rata yang akan diupdate
SELECT 
    CASE 
        WHEN (COALESCE(matematika,0) + COALESCE(bahasa_indonesia,0) + COALESCE(bahasa_inggris,0) + 
              COALESCE(bahasa_jawa,0) + COALESCE(ipa,0) + COALESCE(agama,0) + COALESCE(pjok,0) + 
              COALESCE(pkn,0) + COALESCE(sejarah,0) + COALESCE(seni,0) + COALESCE(dasar_kejuruan,0)) / 11 >= 85 THEN 'Akan menjadi Sangat Baik (>=85)'
        WHEN (COALESCE(matematika,0) + COALESCE(bahasa_indonesia,0) + COALESCE(bahasa_inggris,0) + 
              COALESCE(bahasa_jawa,0) + COALESCE(ipa,0) + COALESCE(agama,0) + COALESCE(pjok,0) + 
              COALESCE(pkn,0) + COALESCE(sejarah,0) + COALESCE(seni,0) + COALESCE(dasar_kejuruan,0)) / 11 >= 75 THEN 'Akan menjadi Baik (75-84)'
        WHEN (COALESCE(matematika,0) + COALESCE(bahasa_indonesia,0) + COALESCE(bahasa_inggris,0) + 
              COALESCE(bahasa_jawa,0) + COALESCE(ipa,0) + COALESCE(agama,0) + COALESCE(pjok,0) + 
              COALESCE(pkn,0) + COALESCE(sejarah,0) + COALESCE(seni,0) + COALESCE(dasar_kejuruan,0)) / 11 >= 65 THEN 'Akan menjadi Cukup (65-74)'
        ELSE 'Akan menjadi Kurang (<65)'
    END as kategori_rata_rata,
    COUNT(*) as jumlah,
    MIN(COALESCE(matematika,0) + COALESCE(bahasa_indonesia,0) + COALESCE(bahasa_inggris,0) + 
        COALESCE(bahasa_jawa,0) + COALESCE(ipa,0) + COALESCE(agama,0) + COALESCE(pjok,0) + 
        COALESCE(pkn,0) + COALESCE(sejarah,0) + COALESCE(seni,0) + COALESCE(dasar_kejuruan,0)) as min_total_nilai,
    MAX(COALESCE(matematika,0) + COALESCE(bahasa_indonesia,0) + COALESCE(bahasa_inggris,0) + 
        COALESCE(bahasa_jawa,0) + COALESCE(ipa,0) + COALESCE(agama,0) + COALESCE(pjok,0) + 
        COALESCE(pkn,0) + COALESCE(sejarah,0) + COALESCE(seni,0) + COALESCE(dasar_kejuruan,0)) as max_total_nilai
FROM nilai_raport 
WHERE rata_rata IS NULL OR rata_rata = 0
GROUP BY 
    CASE 
        WHEN (COALESCE(matematika,0) + COALESCE(bahasa_indonesia,0) + COALESCE(bahasa_inggris,0) + 
              COALESCE(bahasa_jawa,0) + COALESCE(ipa,0) + COALESCE(agama,0) + COALESCE(pjok,0) + 
              COALESCE(pkn,0) + COALESCE(sejarah,0) + COALESCE(seni,0) + COALESCE(dasar_kejuruan,0)) / 11 >= 85 THEN 'Akan menjadi Sangat Baik (>=85)'
        WHEN (COALESCE(matematika,0) + COALESCE(bahasa_indonesia,0) + COALESCE(bahasa_inggris,0) + 
              COALESCE(bahasa_jawa,0) + COALESCE(ipa,0) + COALESCE(agama,0) + COALESCE(pjok,0) + 
              COALESCE(pkn,0) + COALESCE(sejarah,0) + COALESCE(seni,0) + COALESCE(dasar_kejuruan,0)) / 11 >= 75 THEN 'Akan menjadi Baik (75-84)'
        WHEN (COALESCE(matematika,0) + COALESCE(bahasa_indonesia,0) + COALESCE(bahasa_inggris,0) + 
              COALESCE(bahasa_jawa,0) + COALESCE(ipa,0) + COALESCE(agama,0) + COALESCE(pjok,0) + 
              COALESCE(pkn,0) + COALESCE(sejarah,0) + COALESCE(seni,0) + COALESCE(dasar_kejuruan,0)) / 11 >= 65 THEN 'Akan menjadi Cukup (65-74)'
        ELSE 'Akan menjadi Kurang (<65)'
    END
ORDER BY kategori_rata_rata;

-- Cek data yang tidak konsisten (rata-rata tidak sesuai dengan perhitungan)
SELECT 
    COUNT(*) as inkonsisten_count,
    'Record dengan rata-rata yang tidak konsisten' as keterangan
FROM nilai_raport 
WHERE rata_rata IS NOT NULL 
  AND rata_rata != 0
  AND ABS(rata_rata - (
      (COALESCE(matematika,0) + COALESCE(bahasa_indonesia,0) + COALESCE(bahasa_inggris,0) + 
       COALESCE(bahasa_jawa,0) + COALESCE(ipa,0) + COALESCE(agama,0) + COALESCE(pjok,0) + 
       COALESCE(pkn,0) + COALESCE(sejarah,0) + COALESCE(seni,0) + COALESCE(dasar_kejuruan,0)) / 11
  )) > 0.1; -- Toleransi 0.1 untuk pembulatan

-- Cek record dengan nilai mata pelajaran NULL
SELECT 
    COUNT(*) as nilai_null_count,
    'Record dengan ada nilai mata pelajaran yang NULL' as keterangan
FROM nilai_raport 
WHERE matematika IS NULL OR bahasa_indonesia IS NULL OR bahasa_inggris IS NULL OR 
      bahasa_jawa IS NULL OR ipa IS NULL OR agama IS NULL OR pjok IS NULL OR 
      pkn IS NULL OR sejarah IS NULL OR seni IS NULL OR dasar_kejuruan IS NULL;

-- ========================================
-- UPDATE RATA-RATA NILAI RAPORT
-- ========================================

-- Update untuk semua record (termasuk yang kosong dan tidak konsisten)
UPDATE nilai_raport 
SET 
    rata_rata = ROUND(CAST((
        COALESCE(matematika, 0) + 
        COALESCE(bahasa_indonesia, 0) + 
        COALESCE(bahasa_inggris, 0) + 
        COALESCE(bahasa_jawa, 0) + 
        COALESCE(ipa, 0) + 
        COALESCE(agama, 0) + 
        COALESCE(pjok, 0) + 
        COALESCE(pkn, 0) + 
        COALESCE(sejarah, 0) + 
        COALESCE(seni, 0) + 
        COALESCE(dasar_kejuruan, 0)
    ) / 11.0 AS numeric), 2),
    updated_at = CURRENT_TIMESTAMP
WHERE 
    -- Update record yang kosong atau tidak konsisten
    rata_rata IS NULL OR rata_rata = 0 
    OR ABS(rata_rata - (
        (COALESCE(matematika,0) + COALESCE(bahasa_indonesia,0) + COALESCE(bahasa_inggris,0) + 
         COALESCE(bahasa_jawa,0) + COALESCE(ipa,0) + COALESCE(agama,0) + COALESCE(pjok,0) + 
         COALESCE(pkn,0) + COALESCE(sejarah,0) + COALESCE(seni,0) + COALESCE(dasar_kejuruan,0)) / 11
    )) > 0.1;

-- ========================================
-- VERIFIKASI HASIL UPDATE
-- ========================================

-- Cek apakah masih ada rata_rata yang kosong
SELECT 
    COUNT(*) as sisa_kosong_rata_rata,
    'Record dengan rata_rata masih NULL atau 0 setelah update' as keterangan
FROM nilai_raport 
WHERE rata_rata IS NULL OR rata_rata = 0;

-- Cek distribusi rata-rata setelah update
SELECT 
    CASE 
        WHEN rata_rata >= 85 THEN 'Sangat Baik (>=85)'
        WHEN rata_rata >= 75 THEN 'Baik (75-84)'
        WHEN rata_rata >= 65 THEN 'Cukup (65-74)'
        ELSE 'Kurang (<65)'
    END as kategori_rata_rata,
    COUNT(*) as jumlah,
    MIN(rata_rata) as min_rata_rata,
    MAX(rata_rata) as max_rata_rata,
    AVG(rata_rata) as avg_rata_rata,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM nilai_raport), 2) as persentase_distribusi
FROM nilai_raport 
GROUP BY 
    CASE 
        WHEN rata_rata >= 85 THEN 'Sangat Baik (>=85)'
        WHEN rata_rata >= 75 THEN 'Baik (75-84)'
        WHEN rata_rata >= 65 THEN 'Cukup (65-74)'
        ELSE 'Kurang (<65)'
    END
ORDER BY 
    CASE 
        WHEN rata_rata >= 85 THEN 1
        WHEN rata_rata >= 75 THEN 2
        WHEN rata_rata >= 65 THEN 3
        ELSE 4
    END;

-- Cek konsistensi data setelah update
SELECT 
    'Consistency Check After Update' as check_type,
    COUNT(*) as jumlah_inkonsisten
FROM nilai_raport 
WHERE rata_rata IS NOT NULL 
  AND rata_rata != 0
  AND ABS(rata_rata - (
      (COALESCE(matematika,0) + COALESCE(bahasa_indonesia,0) + COALESCE(bahasa_inggris,0) + 
       COALESCE(bahasa_jawa,0) + COALESCE(ipa,0) + COALESCE(agama,0) + COALESCE(pjok,0) + 
       COALESCE(pkn,0) + COALESCE(sejarah,0) + COALESCE(seni,0) + COALESCE(dasar_kejuruan,0)) / 11
  )) > 0.1;

-- Detail record yang masih inkonsisten (jika ada)
SELECT 
    id,
    siswa_id,
    semester,
    tahun_ajaran,
    matematika,
    bahasa_indonesia,
    bahasa_inggris,
    bahasa_jawa,
    ipa,
    agama,
    pjok,
    pkn,
    sejarah,
    seni,
    dasar_kejuruan,
    rata_rata as rata_rata_lama,
    ROUND(CAST((
        COALESCE(matematika, 0) + 
        COALESCE(bahasa_indonesia, 0) + 
        COALESCE(bahasa_inggris, 0) + 
        COALESCE(bahasa_jawa, 0) + 
        COALESCE(ipa, 0) + 
        COALESCE(agama, 0) + 
        COALESCE(pjok, 0) + 
        COALESCE(pkn, 0) + 
        COALESCE(sejarah, 0) + 
        COALESCE(seni, 0) + 
        COALESCE(dasar_kejuruan, 0)
    ) / 11.0 AS numeric), 2) as rata_rata_seharusnya,
    'Inkonsisten' as status
FROM nilai_raport 
WHERE rata_rata IS NOT NULL 
  AND rata_rata != 0
  AND ABS(rata_rata - (
      (COALESCE(matematika,0) + COALESCE(bahasa_indonesia,0) + COALESCE(bahasa_inggris,0) + 
       COALESCE(bahasa_jawa,0) + COALESCE(ipa,0) + COALESCE(agama,0) + COALESCE(pjok,0) + 
       COALESCE(pkn,0) + COALESCE(sejarah,0) + COALESCE(seni,0) + COALESCE(dasar_kejuruan,0)) / 11
  )) > 0.1
LIMIT 10;

-- Cek record dengan nilai mata pelajaran NULL setelah update
SELECT 
    id,
    siswa_id,
    semester,
    tahun_ajaran,
    CASE WHEN matematika IS NULL THEN 'matematika' ELSE '' END ||
    CASE WHEN bahasa_indonesia IS NULL THEN ' bahasa_indonesia' ELSE '' END ||
    CASE WHEN bahasa_inggris IS NULL THEN ' bahasa_inggris' ELSE '' END ||
    CASE WHEN bahasa_jawa IS NULL THEN ' bahasa_jawa' ELSE '' END ||
    CASE WHEN ipa IS NULL THEN ' ipa' ELSE '' END ||
    CASE WHEN agama IS NULL THEN ' agama' ELSE '' END ||
    CASE WHEN pjok IS NULL THEN ' pjok' ELSE '' END ||
    CASE WHEN pkn IS NULL THEN ' pkn' ELSE '' END ||
    CASE WHEN sejarah IS NULL THEN ' sejarah' ELSE '' END ||
    CASE WHEN seni IS NULL THEN ' seni' ELSE '' END ||
    CASE WHEN dasar_kejuruan IS NULL THEN ' dasar_kejuruan' ELSE '' END as nilai_null,
    rata_rata,
    'Nilai NULL ditemukan' as status
FROM nilai_raport 
WHERE matematika IS NULL OR bahasa_indonesia IS NULL OR bahasa_inggris IS NULL OR 
      bahasa_jawa IS NULL OR ipa IS NULL OR agama IS NULL OR pjok IS NULL OR 
      pkn IS NULL OR sejarah IS NULL OR seni IS NULL OR dasar_kejuruan IS NULL
LIMIT 10;

-- ========================================
-- SUMMARY REPORT
-- ========================================
SELECT 
    'UPDATE RATA-RATA NILAI COMPLETED' as status,
    CURRENT_TIMESTAMP as waktu_selesai,
    (SELECT COUNT(*) FROM nilai_raport) as total_record,
    (SELECT COUNT(*) FROM nilai_raport WHERE rata_rata >= 85) as sangat_baik_count,
    (SELECT COUNT(*) FROM nilai_raport WHERE rata_rata >= 75 AND rata_rata < 85) as baik_count,
    (SELECT COUNT(*) FROM nilai_raport WHERE rata_rata >= 65 AND rata_rata < 75) as cukup_count,
    (SELECT COUNT(*) FROM nilai_raport WHERE rata_rata < 65) as kurang_count,
    (SELECT COUNT(*) FROM nilai_raport WHERE rata_rata IS NULL OR rata_rata = 0) as rata_rata_kosong,
    (SELECT COUNT(*) FROM nilai_raport WHERE matematika IS NULL OR bahasa_indonesia IS NULL OR bahasa_inggris IS NULL OR 
             bahasa_jawa IS NULL OR ipa IS NULL OR agama IS NULL OR pjok IS NULL OR 
             pkn IS NULL OR sejarah IS NULL OR seni IS NULL OR dasar_kejuruan IS NULL) as nilai_null_count;

-- ========================================
-- STATISTIK DETAIL
-- ========================================

-- Distribusi rata-rata per range
SELECT 
    CASE 
        WHEN rata_rata >= 95 THEN '95-100'
        WHEN rata_rata >= 90 THEN '90-94'
        WHEN rata_rata >= 85 THEN '85-89'
        WHEN rata_rata >= 80 THEN '80-84'
        WHEN rata_rata >= 75 THEN '75-79'
        WHEN rata_rata >= 70 THEN '70-74'
        WHEN rata_rata >= 65 THEN '65-69'
        WHEN rata_rata >= 60 THEN '60-64'
        ELSE '0-59'
    END as range_rata_rata,
    COUNT(*) as jumlah,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM nilai_raport), 2) as persentase_distribusi
FROM nilai_raport 
GROUP BY 
    CASE 
        WHEN rata_rata >= 95 THEN '95-100'
        WHEN rata_rata >= 90 THEN '90-94'
        WHEN rata_rata >= 85 THEN '85-89'
        WHEN rata_rata >= 80 THEN '80-84'
        WHEN rata_rata >= 75 THEN '75-79'
        WHEN rata_rata >= 70 THEN '70-74'
        WHEN rata_rata >= 65 THEN '65-69'
        WHEN rata_rata >= 60 THEN '60-64'
        ELSE '0-59'
    END
ORDER BY 
    CASE 
        WHEN rata_rata >= 95 THEN 1
        WHEN rata_rata >= 90 THEN 2
        WHEN rata_rata >= 85 THEN 3
        WHEN rata_rata >= 80 THEN 4
        WHEN rata_rata >= 75 THEN 5
        WHEN rata_rata >= 70 THEN 6
        WHEN rata_rata >= 65 THEN 7
        WHEN rata_rata >= 60 THEN 8
        ELSE 9
    END;

-- Top 10 siswa dengan rata-rata tertinggi
SELECT 
    nr.siswa_id,
    s.nama as nama_siswa,
    nr.semester,
    nr.tahun_ajaran,
    nr.rata_rata,
    nr.matematika,
    nr.bahasa_indonesia,
    nr.bahasa_inggris,
    nr.ipa,
    nr.bahasa_jawa,
    nr.agama,
    nr.pjok,
    nr.pkn,
    nr.sejarah,
    nr.seni,
    nr.dasar_kejuruan
FROM nilai_raport nr
LEFT JOIN siswa s ON nr.siswa_id = s.id
WHERE nr.rata_rata > 0
ORDER BY nr.rata_rata DESC, nr.siswa_id ASC
LIMIT 10;

-- Bottom 10 siswa dengan rata-rata terendah (tapi > 0)
SELECT 
    nr.siswa_id,
    s.nama as nama_siswa,
    nr.semester,
    nr.tahun_ajaran,
    nr.rata_rata,
    nr.matematika,
    nr.bahasa_indonesia,
    nr.bahasa_inggris,
    nr.ipa,
    nr.bahasa_jawa,
    nr.agama,
    nr.pjok,
    nr.pkn,
    nr.sejarah,
    nr.seni,
    nr.dasar_kejuruan
FROM nilai_raport nr
LEFT JOIN siswa s ON nr.siswa_id = s.id
WHERE nr.rata_rata > 0
ORDER BY nr.rata_rata ASC, nr.siswa_id ASC
LIMIT 10;

-- Statistik per mata pelajaran
SELECT 
    'Matematika' as mata_pelajaran,
    COUNT(*) as total_record,
    MIN(matematika) as nilai_min,
    MAX(matematika) as nilai_max,
    AVG(matematika) as nilai_avg,
    COUNT(CASE WHEN matematika IS NULL THEN 1 END) as nilai_null
FROM nilai_raport
UNION ALL
SELECT 
    'Bahasa Indonesia' as mata_pelajaran,
    COUNT(*) as total_record,
    MIN(bahasa_indonesia) as nilai_min,
    MAX(bahasa_indonesia) as nilai_max,
    AVG(bahasa_indonesia) as nilai_avg,
    COUNT(CASE WHEN bahasa_indonesia IS NULL THEN 1 END) as nilai_null
FROM nilai_raport
UNION ALL
SELECT 
    'Bahasa Inggris' as mata_pelajaran,
    COUNT(*) as total_record,
    MIN(bahasa_inggris) as nilai_min,
    MAX(bahasa_inggris) as nilai_max,
    AVG(bahasa_inggris) as nilai_avg,
    COUNT(CASE WHEN bahasa_inggris IS NULL THEN 1 END) as nilai_null
FROM nilai_raport
UNION ALL
SELECT 
    'Bahasa Jawa' as mata_pelajaran,
    COUNT(*) as total_record,
    MIN(bahasa_jawa) as nilai_min,
    MAX(bahasa_jawa) as nilai_max,
    AVG(bahasa_jawa) as nilai_avg,
    COUNT(CASE WHEN bahasa_jawa IS NULL THEN 1 END) as nilai_null
FROM nilai_raport
UNION ALL
SELECT 
    'IPA' as mata_pelajaran,
    COUNT(*) as total_record,
    MIN(ipa) as nilai_min,
    MAX(ipa) as nilai_max,
    AVG(ipa) as nilai_avg,
    COUNT(CASE WHEN ipa IS NULL THEN 1 END) as nilai_null
FROM nilai_raport
UNION ALL
SELECT 
    'Agama' as mata_pelajaran,
    COUNT(*) as total_record,
    MIN(agama) as nilai_min,
    MAX(agama) as nilai_max,
    AVG(agama) as nilai_avg,
    COUNT(CASE WHEN agama IS NULL THEN 1 END) as nilai_null
FROM nilai_raport
UNION ALL
SELECT 
    'PJOK' as mata_pelajaran,
    COUNT(*) as total_record,
    MIN(pjok) as nilai_min,
    MAX(pjok) as nilai_max,
    AVG(pjok) as nilai_avg,
    COUNT(CASE WHEN pjok IS NULL THEN 1 END) as nilai_null
FROM nilai_raport
UNION ALL
SELECT 
    'PKN' as mata_pelajaran,
    COUNT(*) as total_record,
    MIN(pkn) as nilai_min,
    MAX(pkn) as nilai_max,
    AVG(pkn) as nilai_avg,
    COUNT(CASE WHEN pkn IS NULL THEN 1 END) as nilai_null
FROM nilai_raport
UNION ALL
SELECT 
    'Sejarah' as mata_pelajaran,
    COUNT(*) as total_record,
    MIN(sejarah) as nilai_min,
    MAX(sejarah) as nilai_max,
    AVG(sejarah) as nilai_avg,
    COUNT(CASE WHEN sejarah IS NULL THEN 1 END) as nilai_null
FROM nilai_raport
UNION ALL
SELECT 
    'Seni' as mata_pelajaran,
    COUNT(*) as total_record,
    MIN(seni) as nilai_min,
    MAX(seni) as nilai_max,
    AVG(seni) as nilai_avg,
    COUNT(CASE WHEN seni IS NULL THEN 1 END) as nilai_null
FROM nilai_raport
UNION ALL
SELECT 
    'Dasar Kejuruan' as mata_pelajaran,
    COUNT(*) as total_record,
    MIN(dasar_kejuruan) as nilai_min,
    MAX(dasar_kejuruan) as nilai_max,
    AVG(dasar_kejuruan) as nilai_avg,
    COUNT(CASE WHEN dasar_kejuruan IS NULL THEN 1 END) as nilai_null
FROM nilai_raport
ORDER BY mata_pelajaran;

-- ========================================
-- OPTIONAL: BACKUP QUERY
-- ========================================
-- Jika ingin membuat backup sebelum update, uncomment query berikut:

/*
-- Buat tabel backup
CREATE TABLE nilai_raport_backup AS 
SELECT * FROM nilai_raport 
WHERE rata_rata IS NULL OR rata_rata = 0 
   OR ABS(rata_rata - (
       (COALESCE(matematika,0) + COALESCE(bahasa_indonesia,0) + COALESCE(bahasa_inggris,0) + 
        COALESCE(bahasa_jawa,0) + COALESCE(ipa,0) + COALESCE(agama,0) + COALESCE(pjok,0) + 
        COALESCE(pkn,0) + COALESCE(sejarah,0) + COALESCE(seni,0) + COALESCE(dasar_kejuruan,0)) / 11
   )) > 0.1;

-- Untuk restore jika diperlukan:
-- UPDATE nilai_raport 
-- SET rata_rata = backup.rata_rata
-- FROM nilai_raport_backup backup
-- WHERE nilai_raport.id = backup.id;
*/ 