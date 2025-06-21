# 📊 Event Table Visualisasi Sistem EduPro 2025

## 🎯 Overview

Event Table ini merupakan **dokumentasi komprehensif** untuk memvisualisasikan dan mendokumentasikan semua peristiwa yang terjadi dalam sistem EduPro. Dokumentasi ini membantu memahami **alur interaksi pengguna**, **proses sistem**, dan **business flow** aplikasi.

---

## 🔐 1. Authentication & Session Events

### 1.1 Login Process Flow

| No | Event | Pengguna | Sistem | Hasil | Visualisasi |
|----|-------|----------|--------|-------|-------------|
| 1 | **User Access System** | Membuka aplikasi EduPro | Tampilkan halaman login | Halaman login muncul | 👤 → 🖥️ |
| 2 | **Enter Credentials** | Input username & password | Validasi format input | Form tervalidasi | ✏️ → ✅ |
| 3 | **Submit Login** | Klik tombol Login | Proses autentikasi | Verifikasi kredensial | 🔐 → ⚡ |
| 4 | **Authentication Success** | Menunggu response | Generate JWT token | Token dibuat | ✅ → 🎫 |
| 5 | **Dashboard Access** | Redirect ke dashboard | Load user data & permissions | Dashboard tampil | 🏠 → 📊 |

**Flow Diagram:**
```
[User] → [Login Form] → [Validate] → [Generate Token] → [Dashboard]
   👤        📝           ✅            🎫             📊
```

### 1.2 Session Management Events

| Event Type | Trigger | User Experience | System Action | Status Indicator |
|------------|---------|-----------------|---------------|------------------|
| **Token Refresh** | Auto/Manual | Seamless continuation | Extend session | 🔄 Active |
| **Session Warning** | 5 min before expire | Warning notification | Display countdown | ⚠️ Warning |
| **Session Expired** | Token timeout | Redirect to login | Clear session data | ❌ Expired |
| **Logout** | User action | Confirm logout | Invalidate token | 🚪 Logged Out |

---

## 📚 2. Data Management Events

### 2.1 Student Data Management

| Aksi | User Journey | Sistem Process | Visual Feedback | Data Flow |
|------|--------------|----------------|-----------------|-----------|
| **View Students** | Navigate → Data Siswa | Load grid data | Loading spinner → Data grid | 📋 → 👥 |
| **Create Student** | Click Add → Fill form → Save | Validate → Insert DB | Success message | ➕ → 📝 → 💾 |
| **Edit Student** | Select row → Edit → Modify → Save | Load data → Update DB | Data refreshed | ✏️ → 🔄 → ✅ |
| **Delete Student** | Select → Delete → Confirm | Check dependencies → Remove | Confirmation dialog | 🗑️ → ❓ → ❌ |
| **Search Student** | Type in search box | Filter data real-time | Results update | 🔍 → 📊 |
| **Export Data** | Click Export → Select format | Generate file | Download starts | 📤 → 📄 |

**Student Management Flow:**
```
User Access Data Siswa → Grid Loaded → User Action
                                           ↓
                                    ┌─────────────┐
                                    │ Create Edit │
                                    │ Delete Search│
                                    └─────────────┘
                                           ↓
                                    Database Update
                                           ↓
                                    Refresh Grid
```

### 2.2 Academic Data Events

#### 2.2.1 Nilai Raport Management

| Step | User Action | System Response | Validation | Result |
|------|-------------|-----------------|------------|--------|
| 1 | Navigate to Nilai | Load nilai grid | Check permissions | Grid displayed |
| 2 | Add new grade | Show form dialog | Validate student exists | Form ready |
| 3 | Input subject scores | Real-time calculation | Check score range (0-100) | Average calculated |
| 4 | Save grades | Process data | Validate completeness | Data saved |
| 5 | View grade report | Generate summary | Calculate statistics | Report displayed |

#### 2.2.2 Presensi Management

| Event | User Interaction | System Logic | Business Rule | Output |
|-------|------------------|--------------|---------------|--------|
| **Record Attendance** | Select student → Mark present/absent | Count attendance days | Min 75% for good standing | Percentage calculated |
| **Monthly Summary** | View attendance report | Aggregate monthly data | Categorize: Baik/Cukup/Kurang | Category assigned |
| **Attendance Alert** | System notification | Check attendance threshold | Alert if <75% | Warning issued |

### 2.3 Economic Data Events

| Data Type | Collection Process | Validation Rules | Categorization | Impact |
|-----------|-------------------|------------------|----------------|--------|
| **Penghasilan Ayah** | User input amount | Must be positive number | <2M=Rendah, 2-5M=Sedang, >5M=Tinggi | Economic status |
| **Penghasilan Ibu** | User input amount | Must be positive number | Combined with father's income | Total calculation |
| **Total Penghasilan** | Auto calculation | Sum of both incomes | Determine economic category | Prediction factor |

---

## 🤖 3. Machine Learning & Prediction Events

### 3.1 Model Training Process

| Phase | Process | User View | System Activity | Duration | Status |
|-------|---------|-----------|-----------------|----------|--------|
| **Data Preparation** | Click Train Model | "Preparing data..." | Load & clean data | 2-3 sec | 📊 Processing |
| **Feature Engineering** | Loading indicator | "Processing features..." | Calculate derived features | 3-5 sec | ⚙️ Engineering |
| **Model Training** | Progress bar | "Training C4.5 model..." | Build decision tree | 5-10 sec | 🧠 Learning |
| **Model Evaluation** | Validation metrics | "Evaluating model..." | Calculate accuracy | 2-3 sec | 📈 Evaluating |
| **Model Deployment** | Success message | "Model ready!" | Save model to disk | 1-2 sec | ✅ Ready |

**Training Visualization:**
```
Data → Features → Training → Evaluation → Deployment
 📊  →    ⚙️    →    🧠    →     📈     →     ✅
 
Timeline: [=====>              ] 35% Complete
```

### 3.2 Individual Prediction Flow

| Step | User Action | System Process | ML Operation | Result Display |
|------|-------------|----------------|--------------|----------------|
| 1 | Select student | Load student data | Extract features | Student profile shown |
| 2 | Click Predict | Validate data completeness | Check required fields | Validation status |
| 3 | Process prediction | Run C4.5 algorithm | Calculate probability | Confidence score |
| 4 | Display result | Show prediction | Format output | Badge with color coding |
| 5 | Save history | Store result | Log prediction event | History updated |

**Prediction Result Visualization:**
```
Student: Ahmad Rizki (10-A)
┌─────────────────────────────┐
│ 🎯 PREDIKSI: TINGGI        │
│ 📊 Confidence: 87.5%       │
│ ⭐ Kategori: Berprestasi    │
└─────────────────────────────┘

Faktor Pendukung:
✅ Nilai Rata-rata: 85.2
✅ Kehadiran: 95%
✅ Status Ekonomi: Sedang
```

### 3.3 Batch Prediction Process

| Phase | Description | User Experience | System Load | Progress Indicator |
|-------|-------------|-----------------|-------------|-------------------|
| **Selection** | Choose criteria | Select filters | Load student list | Student count |
| **Processing** | Bulk prediction | Progress bar | Process each student | Percentage complete |
| **Results** | View outcomes | Results grid | Display predictions | Color-coded results |
| **Export** | Download report | Excel file | Generate report | Download link |

---

## 📊 4. System Administration Events

### 4.1 User Management

| Admin Action | Process Flow | Security Check | System Response | Audit Trail |
|--------------|--------------|----------------|-----------------|-------------|
| **Create User** | Form → Validate → Save | Check permissions | User created | LOG: User created by Admin |
| **Modify Role** | Select → Change → Confirm | Verify admin rights | Role updated | LOG: Role changed |
| **Deactivate User** | Select → Disable → Confirm | Check dependencies | User disabled | LOG: User deactivated |
| **Reset Password** | Select → Generate → Notify | Admin verification | Password reset | LOG: Password reset |

### 4.2 System Monitoring

| Metric | Real-time Display | Threshold | Alert Condition | Action Required |
|--------|-------------------|-----------|-----------------|-----------------|
| **Active Users** | Live counter | >50 users | High load warning | Monitor performance |
| **Response Time** | Performance graph | >2 seconds | Slow response alert | Check server resources |
| **Error Rate** | Error percentage | >5% errors | System health warning | Investigate errors |
| **Database Load** | Connection count | >80% capacity | Database alert | Scale resources |

---

## 🔒 5. Security & Audit Events

### 5.1 Security Monitoring

| Security Event | Detection Method | User Impact | System Response | Severity Level |
|----------------|------------------|-------------|-----------------|----------------|
| **Failed Login** | Login attempt tracking | Account warning | Rate limiting | ⚠️ Medium |
| **Brute Force** | Multiple failures | Account locked | IP blocking | 🚨 High |
| **Unauthorized Access** | Permission check | Access denied | Security log | 🚨 High |
| **Suspicious Activity** | Behavior analysis | User flagged | Admin notification | ⚠️ Medium |
| **Data Export** | File download | Audit logged | Track downloads | 📋 Low |

### 5.2 Audit Trail Visualization

```
📅 2025-06-19 14:30:25 | 👤 admin_user | 🔐 LOGIN_SUCCESS
📅 2025-06-19 14:31:12 | 👤 admin_user | 📊 VIEW_DASHBOARD  
📅 2025-06-19 14:32:45 | 👤 admin_user | ➕ CREATE_STUDENT | Student: Ahmad Rizki
📅 2025-06-19 14:35:20 | 👤 guru_math  | 🤖 RUN_PREDICTION | Student: Ahmad Rizki → TINGGI (87.5%)
📅 2025-06-19 14:38:15 | 👤 admin_user | 📤 EXPORT_DATA    | File: students_report.xlsx
```

---

## 📈 6. Analytics & Reporting Events

### 6.1 Usage Analytics

| Metric Category | Data Points | Visualization | Business Value | Update Frequency |
|-----------------|-------------|---------------|----------------|------------------|
| **User Activity** | Login frequency, Session duration | Activity heatmap | User engagement | Real-time |
| **Feature Usage** | Most used features, Click patterns | Usage charts | Feature optimization | Daily |
| **Performance** | Response times, Error rates | Performance dashboard | System health | Real-time |
| **Predictions** | Accuracy rates, Confidence levels | ML metrics | Model effectiveness | Per prediction |

### 6.2 Report Generation Flow

| Report Type | Trigger | Data Source | Processing Time | Output Format |
|-------------|---------|-------------|-----------------|---------------|
| **Student Report** | Manual/Scheduled | Student + Grades + Attendance | 5-10 seconds | PDF/Excel |
| **Performance Report** | Weekly auto | System metrics | 2-3 seconds | Dashboard |
| **Prediction Summary** | On-demand | ML results | 3-5 seconds | Excel/Chart |
| **Audit Report** | Monthly | Security logs | 10-15 seconds | PDF |

---

## 🔄 7. System Integration Events

### 7.1 Database Operations

| Operation Type | User Trigger | System Process | Performance Impact | Recovery Action |
|----------------|--------------|----------------|-------------------|-----------------|
| **Data Sync** | Auto/Manual | Synchronize tables | Low | None required |
| **Backup** | Scheduled | Create backup | Medium | Monitor progress |
| **Maintenance** | Scheduled | Optimize tables | High | Notify users |
| **Recovery** | Error condition | Restore data | High | Emergency protocol |

### 7.2 External System Integration

| Integration Point | Data Flow | Frequency | Error Handling | Monitoring |
|-------------------|-----------|-----------|----------------|------------|
| **Authentication Service** | User credentials | Per login | Fallback to local | Login success rate |
| **Notification Service** | Alert messages | Real-time | Queue retry | Delivery status |
| **File Storage** | Document uploads | On-demand | Local backup | Storage capacity |
| **Analytics Service** | Usage metrics | Batch hourly | Store locally | Sync status |

---

## 📱 8. User Experience Events

### 8.1 Frontend Interactions

| UI Component | User Action | Frontend Response | Backend Call | Visual Feedback |
|--------------|-------------|-------------------|--------------|-----------------|
| **Navigation Menu** | Click menu item | Page transition | Load page data | Loading spinner |
| **Data Grid** | Sort/Filter/Page | Update display | Fetch filtered data | Grid refresh |
| **Form Input** | Type/Select | Real-time validation | Validate on blur | Error messages |
| **Modal Dialog** | Open/Close | Show/Hide overlay | Load dialog data | Fade animation |
| **Charts** | Hover/Click | Interactive feedback | No backend call | Tooltip display |

### 8.2 Mobile Responsiveness

| Device Type | Screen Size | Layout Adaptation | Touch Interactions | Performance |
|-------------|-------------|-------------------|-------------------|-------------|
| **Desktop** | >1200px | Full layout | Mouse events | Optimal |
| **Tablet** | 768-1200px | Condensed layout | Touch + Mouse | Good |
| **Mobile** | <768px | Stacked layout | Touch optimized | Acceptable |

---

## 🎨 9. Visual Status Indicators

### 9.1 System Status Colors

| Status | Color | Icon | Meaning | Action Required |
|--------|-------|------|---------|-----------------|
| **Success** | 🟢 Green | ✅ | Operation completed | None |
| **Warning** | 🟡 Yellow | ⚠️ | Attention needed | Monitor |
| **Error** | 🔴 Red | ❌ | Problem occurred | Investigate |
| **Info** | 🔵 Blue | ℹ️ | Information | Acknowledge |
| **Processing** | 🟣 Purple | ⚡ | In progress | Wait |

### 9.2 Prediction Result Badges

| Prediction | Badge Color | Icon | Confidence Range | Recommendation |
|------------|-------------|------|------------------|----------------|
| **TINGGI** | 🟢 Green | 🏆 | 80-100% | Maintain excellence |
| **SEDANG** | 🟡 Yellow | 📈 | 60-79% | Improvement program |
| **RENDAH** | 🔴 Red | 📉 | 0-59% | Intensive support |

---

## 📊 10. Event Monitoring Dashboard

### 10.1 Real-time Metrics

```
┌─────────────────────────────────────────────────────────────┐
│                    EduPro System Monitor                    │
├─────────────────────────────────────────────────────────────┤
│ 👥 Active Users: 23        📊 API Requests: 1,247/hour    │
│ ⚡ Avg Response: 0.8s      ❌ Error Rate: 0.2%             │
│ 🔐 Login Success: 98.5%    🤖 Predictions: 45 today       │
│ 💾 DB Connections: 12/50   📈 Uptime: 99.9%               │
└─────────────────────────────────────────────────────────────┘
```

### 10.2 Event Timeline

```
15:30 | 👤 guru_math    | ➕ Created student: Siti Aminah
15:28 | 👤 admin_user   | 🤖 Trained ML model (Accuracy: 89.2%)
15:25 | 👤 staf_tu      | 📊 Generated attendance report
15:22 | 👤 guru_ipa     | 🔍 Searched student: "Ahmad"
15:20 | 👤 admin_user   | 📤 Exported student data (125 records)
15:18 | 🤖 SYSTEM       | 💾 Auto backup completed
15:15 | 👤 guru_math    | 🎯 Prediction: STD-045 → TINGGI (85.3%)
```

---

## 🎯 Key Benefits

### ✅ **Complete Visibility**
- Dokumentasi lengkap semua interaksi pengguna
- Visualisasi alur proses sistem
- Real-time monitoring capabilities

### ✅ **Enhanced User Experience**  
- Clear visual feedback untuk setiap aksi
- Intuitive status indicators
- Responsive design untuk semua device

### ✅ **Operational Excellence**
- Systematic event documentation
- Performance monitoring
- Proactive issue detection

### ✅ **Security & Compliance**
- Comprehensive audit trail
- Security event tracking
- Regulatory compliance support

### ✅ **Business Intelligence**
- Usage pattern analysis
- Performance metrics
- Data-driven decision support

---

## 🚀 Implementation Roadmap

### Phase 1: Core Events (Week 1-2)
- [ ] Authentication events
- [ ] Basic CRUD operations
- [ ] User navigation tracking

### Phase 2: Advanced Features (Week 3-4)
- [ ] ML prediction events
- [ ] Performance monitoring
- [ ] Security event detection

### Phase 3: Analytics & Reporting (Week 5-6)
- [ ] Usage analytics
- [ ] Custom dashboards
- [ ] Automated reporting

### Phase 4: Optimization (Week 7-8)
- [ ] Performance tuning
- [ ] Mobile optimization
- [ ] Advanced visualizations

---

## 📋 Conclusion

Event Table visualisasi sistem EduPro ini memberikan **comprehensive documentation** untuk:

🎯 **Memahami User Journey** - Dokumentasi lengkap alur pengguna  
📊 **Monitoring Sistem** - Real-time visibility semua proses  
🔒 **Security Tracking** - Monitoring keamanan dan audit trail  
📈 **Performance Analysis** - Analisis performa dan optimasi  
🎨 **Visual Feedback** - Indikator status yang jelas dan intuitif  

Dokumentasi ini akan menjadi **foundation** untuk memahami, monitoring, dan mengoptimalkan semua aspek sistem EduPro secara visual dan terstruktur.

---

**📅 Dibuat**: 19 Juni 2025  
**📝 Versi**: 1.0  
**✅ Status**: Production Ready  
**👥 Maintainer**: EduPro Development Team 