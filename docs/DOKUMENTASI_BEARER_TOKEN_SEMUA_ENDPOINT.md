# Dokumentasi Bearer Token untuk Semua Endpoint API

## Ringkasan
Dokumen ini menjelaskan implementasi bearer token authentication untuk semua endpoint API dalam sistem prediksi prestasi siswa.

## Backend Implementation

### 1. Authentication Router (`backend/routes/auth_router.py`)
Semua endpoint sudah menggunakan authentication:
- `POST /api/auth/token` - Login (tidak perlu auth)
- `POST /api/auth/register` - Register user baru (perlu auth admin)
- `GET /api/auth/me` - Get current user profile (perlu auth)
- `PUT /api/auth/me/profile` - Update profile (perlu auth)
- `GET /api/auth/users` - Get all users (perlu auth admin)
- `PUT /api/auth/users/{user_id}` - Update user (perlu auth admin)
- `DELETE /api/auth/users/{user_id}` - Delete user (perlu auth admin)

### 2. Siswa Router (`backend/routes/siswa_router.py`)
Semua endpoint sudah menggunakan authentication:
- `GET /api/siswa` - Get all siswa (perlu auth)
- `POST /api/siswa` - Create siswa (perlu auth)
- `GET /api/siswa/{siswa_id}` - Get siswa by ID (perlu auth)
- `PUT /api/siswa/{siswa_id}` - Update siswa (perlu auth)
- `DELETE /api/siswa/{siswa_id}` - Delete siswa (perlu auth)
- `GET /api/siswa/export/excel` - Export Excel (perlu auth)
- `POST /api/siswa/upload/excel` - Upload Excel (perlu auth)

### 3. Nilai Router (`backend/routes/nilai_router.py`)
Semua endpoint sudah menggunakan authentication:
- `GET /api/nilai` - Get all nilai (perlu auth)
- `POST /api/nilai` - Create nilai (perlu auth)
- `GET /api/nilai/{nilai_id}` - Get nilai by ID (perlu auth)
- `PUT /api/nilai/{nilai_id}` - Update nilai (perlu auth)
- `DELETE /api/nilai/{nilai_id}` - Delete nilai (perlu auth)

### 4. Presensi Router (`backend/routes/presensi_router.py`)
Semua endpoint sudah menggunakan authentication:
- `GET /api/presensi` - Get all presensi (perlu auth)
- `POST /api/presensi` - Create presensi (perlu auth)
- `GET /api/presensi/{presensi_id}` - Get presensi by ID (perlu auth)
- `PUT /api/presensi/{presensi_id}` - Update presensi (perlu auth)
- `DELETE /api/presensi/{presensi_id}` - Delete presensi (perlu auth)

### 5. Penghasilan Router (`backend/routes/penghasilan_router.py`)
Semua endpoint sudah menggunakan authentication:
- `GET /api/penghasilan` - Get all penghasilan (perlu auth)
- `POST /api/penghasilan` - Create penghasilan (perlu auth)
- `GET /api/penghasilan/{penghasilan_id}` - Get penghasilan by ID (perlu auth)
- `PUT /api/penghasilan/{penghasilan_id}` - Update penghasilan (perlu auth)
- `DELETE /api/penghasilan/{penghasilan_id}` - Delete penghasilan (perlu auth)

### 6. Prediksi Router (`backend/routes/prediksi_router.py`)
Semua endpoint sudah menggunakan authentication:
- `POST /api/prediksi` - Create prediction (perlu auth)
- `POST /api/prediksi/train` - Train model (perlu auth)
- `GET /api/prediksi/history` - Get prediction history (perlu auth)
- `GET /api/prediksi/visualization` - Get model visualization (perlu auth)
- `GET /api/prediksi/confusion-matrix` - Get confusion matrix (perlu auth)
- `GET /api/prediksi/model-metrics` - Get model metrics (perlu auth)
- `POST /api/prediksi/generate-dummy` - Generate dummy data (perlu auth)
- `POST /api/prediksi/generate-dummy-by-name` - Generate dummy by name (perlu auth)

## Frontend Implementation

### 1. Global Configuration (`frontend/js/app.js`)

#### Token Management Functions:
```javascript
// Fungsi untuk mendapatkan token dari localStorage
function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

// Fungsi untuk menambahkan header Authorization ke AJAX requests
function addAuthHeader(xhr) {
    const token = getToken();
    if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }
}

// Applied to all AJAX requests
$.ajaxSetup({
    beforeSend: addAuthHeader
});
```

### 2. Kendo Grid DataSource Authentication

Semua Kendo Grid sudah menggunakan authentication header:

#### Siswa Grid:
```javascript
dataSource: {
    transport: {
        read: {
            url: `${API_URL}/siswa`,
            beforeSend: function(xhr) {
                const token = getToken();
                if (token) {
                    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                }
            }
        },
        create: {
            url: `${API_URL}/siswa`,
            beforeSend: function(xhr) {
                const token = getToken();
                if (token) {
                    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                }
            }
        },
        // ... update dan destroy juga sama
    }
}
```

#### Nilai Grid:
```javascript
dataSource: {
    transport: {
        read: {
            url: `${API_URL}/nilai`,
            beforeSend: function(xhr) {
                const token = getToken();
                if (token) {
                    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                }
            }
        },
        // ... create, update, destroy juga sama
    }
}
```

#### Presensi Grid:
```javascript
dataSource: {
    transport: {
        read: {
            url: `${API_URL}/presensi`,
            beforeSend: function(xhr) {
                const token = getToken();
                if (token) {
                    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                }
            }
        },
        // ... create, update, destroy juga sama
    }
}
```

#### Penghasilan Grid:
```javascript
dataSource: {
    transport: {
        read: {
            url: `${API_URL}/penghasilan`,
            beforeSend: function(xhr) {
                const token = getToken();
                if (token) {
                    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                }
            }
        },
        // ... create, update, destroy juga sama
    }
}
```

#### Users Grid:
```javascript
dataSource: {
    transport: {
        read: {
            url: `${API_URL}/auth/users`,
            beforeSend: function(xhr) {
                const token = getToken();
                if (token) {
                    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                }
            }
        },
        // ... create, update, destroy juga sama
    }
}
```

### 3. AJAX Calls Authentication

Semua AJAX calls sudah menggunakan authentication header:

#### Dashboard Data Loading:
```javascript
$.ajax({
    url: `${API_URL}/siswa`,
    method: "GET",
    beforeSend: function(xhr) {
        const token = getToken();
        if (token) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
    },
    // ... success dan error handlers
});
```

#### Prediction Operations:
```javascript
// Prediksi
$.ajax({
    url: `${API_URL}/prediksi`,
    method: "POST",
    contentType: "application/json",
    beforeSend: function(xhr) {
        const token = getToken();
        if (token) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
    },
    // ... data dan handlers
});

// Train Model
$.ajax({
    url: `${API_URL}/prediksi/train`,
    method: "POST",
    beforeSend: function(xhr) {
        const token = getToken();
        if (token) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
    },
    // ... handlers
});
```

#### Model Evaluation:
```javascript
// Confusion Matrix
$.ajax({
    url: `${API_URL}/prediksi/confusion-matrix`,
    method: "GET",
    beforeSend: function(xhr) {
        const token = getToken();
        if (token) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
    },
    // ... handlers
});

// Model Metrics
$.ajax({
    url: `${API_URL}/prediksi/model-metrics`,
    method: "GET",
    beforeSend: function(xhr) {
        const token = getToken();
        if (token) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
    },
    // ... handlers
});
```

#### Generate Dummy Data:
```javascript
// Generate Dummy
$.ajax({
    url: `${API_URL}/prediksi/generate-dummy`,
    method: "POST",
    contentType: "application/json",
    beforeSend: function(xhr) {
        const token = getToken();
        if (token) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
    },
    // ... data dan handlers
});

// Generate Dummy By Name
$.ajax({
    url: `${API_URL}/prediksi/generate-dummy-by-name`,
    method: "POST",
    contentType: "application/json",
    beforeSend: function(xhr) {
        const token = getToken();
        if (token) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
    },
    // ... data dan handlers
});
```

#### Profile Management:
```javascript
// Load Current User Profile
$.ajax({
    url: `${API_URL}/auth/me`,
    method: "GET",
    beforeSend: function(xhr) {
        const token = getToken();
        if (token) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
    },
    // ... handlers
});

// Update User Profile
$.ajax({
    url: `${API_URL}/auth/me/profile`,
    method: "PUT",
    contentType: "application/json",
    beforeSend: function(xhr) {
        const token = getToken();
        if (token) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
    },
    // ... data dan handlers
});
```

#### File Operations:
```javascript
// Export Excel
fetch(`${API_URL}/siswa/export/excel`, {
    headers: {
        'Authorization': `Bearer ${token}`
    }
})

// Upload Excel
$.ajax({
    url: `${API_URL}/siswa/upload/excel`,
    type: 'POST',
    beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    },
    // ... data dan handlers
});
```

### 4. DropDown DataSource Authentication

Semua dropdown yang menggunakan API juga sudah menggunakan authentication:

```javascript
$("#siswa-dropdown").kendoDropDownList({
    dataTextField: "nama",
    dataValueField: "id",
    dataSource: {
        transport: {
            read: {
                url: `${API_URL}/siswa`,
                dataType: "json",
                beforeSend: function(xhr) {
                    const token = getToken();
                    if (token) {
                        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                    }
                }
            }
        }
    },
    optionLabel: "Pilih Siswa..."
});
```

## Error Handling

### 1. Unauthorized Access (401)
Ketika token tidak valid atau expired:
```javascript
error: function(xhr) {
    if (xhr.status === 401) {
        showErrorNotification("Token expired. Silakan login kembali.");
        setTimeout(() => {
            window.location.href = "login.html";
        }, 2000);
    }
}
```

### 2. Forbidden Access (403)
Ketika user tidak memiliki permission:
```javascript
error: function(xhr) {
    if (xhr.status === 403) {
        showErrorNotification("Anda tidak memiliki akses untuk operasi ini.");
    }
}
```

## Testing

### 1. Test Authentication
```bash
# Test tanpa token (harus return 401)
curl -X GET http://localhost:8000/api/siswa

# Test dengan token valid
curl -X GET http://localhost:8000/api/siswa \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 2. Test Role-based Access
```bash
# Test admin access (harus berhasil)
curl -X GET http://localhost:8000/api/auth/users \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Test non-admin access (harus return 403)
curl -X GET http://localhost:8000/api/auth/users \
  -H "Authorization: Bearer USER_TOKEN"
```

## Status Implementasi

✅ **Backend Authentication**: Semua endpoint sudah menggunakan authentication
✅ **Frontend Token Management**: Global token management sudah diimplementasi
✅ **Kendo Grid Authentication**: Semua grid sudah menggunakan bearer token
✅ **AJAX Calls Authentication**: Semua AJAX calls sudah menggunakan bearer token
✅ **DropDown Authentication**: Semua dropdown sudah menggunakan bearer token
✅ **Error Handling**: Proper error handling untuk 401 dan 403
✅ **File Operations**: Export dan upload sudah menggunakan bearer token
✅ **Model Operations**: Confusion matrix dan metrics sudah menggunakan bearer token

## Kesimpulan

Semua endpoint API dalam sistem prediksi prestasi siswa sudah menggunakan bearer token authentication. Implementasi mencakup:

1. **Backend**: Semua router menggunakan `get_current_user` dependency
2. **Frontend**: Global token management dan header authentication
3. **Security**: Proper error handling dan role-based access control
4. **User Experience**: Automatic redirect ke login page ketika token expired

Sistem sekarang sudah aman dan semua akses API memerlukan authentication yang valid. 