# DOKUMENTASI TAHAPAN CODING RINCI BAGIAN 2 - SISTEM PREDIKSI EDUPRO 2025

## 🎨 TAHAP 6: FRONTEND DEVELOPMENT

### 6.1 Modern React Architecture Implementation

#### Narasi Implementasi
Frontend development menggunakan React dengan TypeScript untuk type safety dan modern development experience. Arsitektur mengikuti component-based design dengan clear separation of concerns.

```typescript
// App.tsx - Main application component
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import SiswaManagement from './pages/Siswa/SiswaManagement';
import PrediksiPage from './pages/Prediksi/PrediksiPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/siswa" element={<SiswaManagement />} />
              <Route path="/prediksi" element={<PrediksiPage />} />
            </Routes>
          </Layout>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
```

#### Component Architecture Strategy
1. **Container Components**: Handle business logic dan state management
2. **Presentational Components**: Focus on UI rendering
3. **Custom Hooks**: Reusable logic extraction
4. **Context Providers**: Global state management

### 6.2 Kendo UI Grid Integration

#### Narasi Implementasi
Kendo UI Grid dipilih untuk enterprise-grade data management dengan advanced features seperti sorting, filtering, pagination, dan inline editing.

```typescript
// SiswaGrid.tsx - Advanced data grid implementation
import React, { useState, useEffect, useCallback } from 'react';
import { Grid, GridColumn, GridToolbar } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
import { process, State } from '@progress/kendo-data-query';
import { useSiswaAPI } from '../hooks/useSiswaAPI';
import { Siswa } from '../types/siswa.types';

interface SiswaGridProps {
  onEdit: (siswa: Siswa) => void;
  onDelete: (id: number) => void;
  refreshTrigger: number;
}

const SiswaGrid: React.FC<SiswaGridProps> = ({ onEdit, onDelete, refreshTrigger }) => {
  const [dataState, setDataState] = useState<State>({
    skip: 0,
    take: 20,
    sort: [{ field: 'nama', dir: 'asc' }]
  });
  
  const { data, loading, error, fetchSiswa } = useSiswaAPI();
  
  // Refresh data when trigger changes
  useEffect(() => {
    fetchSiswa(dataState);
  }, [refreshTrigger, dataState]);
  
  const handleDataStateChange = useCallback((event: GridDataStateChangeEvent) => {
    setDataState(event.dataState);
  }, []);
  
  const handleEdit = useCallback((dataItem: Siswa) => {
    onEdit(dataItem);
  }, [onEdit]);
  
  const handleDelete = useCallback((dataItem: Siswa) => {
    if (window.confirm(`Hapus siswa ${dataItem.nama}?`)) {
      onDelete(dataItem.id);
    }
  }, [onDelete]);
  
  const CommandCell = (props: GridCellProps) => (
    <td>
      <Button 
        size="small" 
        fillMode="outline" 
        themeColor="primary"
        onClick={() => handleEdit(props.dataItem)}
      >
        Edit
      </Button>
      <Button 
        size="small" 
        fillMode="outline" 
        themeColor="error"
        onClick={() => handleDelete(props.dataItem)}
        style={{ marginLeft: '8px' }}
      >
        Hapus
      </Button>
    </td>
  );
  
  if (error) {
    return <div className="error-message">Error loading data: {error}</div>;
  }
  
  return (
    <Grid
      data={process(data, dataState)}
      {...dataState}
      onDataStateChange={handleDataStateChange}
      sortable
      filterable
      pageable={{
        buttonCount: 5,
        info: true,
        type: 'numeric',
        pageSizes: [10, 20, 50],
        previousNext: true
      }}
      loading={loading}
      style={{ height: '500px' }}
    >
      <GridToolbar>
        <div className="grid-toolbar">
          <h3>Data Siswa</h3>
          <Button 
            themeColor="primary" 
            onClick={() => onEdit(null)}
          >
            Tambah Siswa
          </Button>
        </div>
      </GridToolbar>
      
      <GridColumn field="nama" title="Nama Lengkap" width="200px" />
      <GridColumn field="nis" title="NIS" width="120px" />
      <GridColumn field="jenis_kelamin" title="L/P" width="80px" />
      <GridColumn field="kelas" title="Kelas" width="100px" />
      <GridColumn 
        field="created_at" 
        title="Tanggal Dibuat" 
        width="150px"
        format="{0:dd/MM/yyyy}"
      />
      <GridColumn 
        title="Aksi" 
        width="180px" 
        cell={CommandCell}
        filterable={false}
        sortable={false}
      />
    </Grid>
  );
};

export default SiswaGrid;
```

### 6.3 Form Management dengan React Hook Form

#### Narasi Implementasi
Form handling menggunakan React Hook Form untuk performance optimization dan comprehensive validation.

```typescript
// SiswaForm.tsx - Advanced form with validation
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Input, TextArea } from '@progress/kendo-react-inputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Button } from '@progress/kendo-react-buttons';
import { Siswa, SiswaFormData } from '../types/siswa.types';

// Validation schema
const siswaSchema = yup.object().shape({
  nama: yup
    .string()
    .required('Nama wajib diisi')
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama maksimal 100 karakter')
    .matches(/^[a-zA-Z\s]+$/, 'Nama hanya boleh huruf dan spasi'),
  
  nis: yup
    .string()
    .required('NIS wajib diisi')
    .matches(/^\d{5,10}$/, 'NIS harus 5-10 digit angka'),
  
  jenis_kelamin: yup
    .string()
    .required('Jenis kelamin wajib dipilih')
    .oneOf(['L', 'P'], 'Pilih L atau P'),
  
  kelas: yup
    .string()
    .required('Kelas wajib diisi')
    .matches(/^[1-3][0-9][A-Z]$/, 'Format kelas: 10A, 11B, 12C')
});

interface SiswaFormProps {
  siswa?: Siswa | null;
  onSubmit: (data: SiswaFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const SiswaForm: React.FC<SiswaFormProps> = ({ 
  siswa, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset
  } = useForm<SiswaFormData>({
    resolver: yupResolver(siswaSchema),
    defaultValues: {
      nama: siswa?.nama || '',
      nis: siswa?.nis || '',
      jenis_kelamin: siswa?.jenis_kelamin || '',
      kelas: siswa?.kelas || ''
    },
    mode: 'onChange'
  });
  
  const jenisKelaminOptions = [
    { text: 'Laki-laki', value: 'L' },
    { text: 'Perempuan', value: 'P' }
  ];
  
  const handleFormSubmit = async (data: SiswaFormData) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="siswa-form">
      <div className="form-group">
        <label htmlFor="nama">Nama Lengkap *</label>
        <Controller
          name="nama"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="nama"
              placeholder="Masukkan nama lengkap"
              valid={!errors.nama}
              className={errors.nama ? 'k-invalid' : ''}
            />
          )}
        />
        {errors.nama && (
          <div className="field-error">{errors.nama.message}</div>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor="nis">NIS *</label>
        <Controller
          name="nis"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="nis"
              placeholder="Nomor Induk Siswa"
              valid={!errors.nis}
              className={errors.nis ? 'k-invalid' : ''}
            />
          )}
        />
        {errors.nis && (
          <div className="field-error">{errors.nis.message}</div>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor="jenis_kelamin">Jenis Kelamin *</label>
        <Controller
          name="jenis_kelamin"
          control={control}
          render={({ field }) => (
            <DropDownList
              {...field}
              id="jenis_kelamin"
              data={jenisKelaminOptions}
              textField="text"
              dataItemKey="value"
              placeholder="Pilih jenis kelamin"
              valid={!errors.jenis_kelamin}
              className={errors.jenis_kelamin ? 'k-invalid' : ''}
            />
          )}
        />
        {errors.jenis_kelamin && (
          <div className="field-error">{errors.jenis_kelamin.message}</div>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor="kelas">Kelas *</label>
        <Controller
          name="kelas"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="kelas"
              placeholder="Contoh: 10A, 11B, 12C"
              valid={!errors.kelas}
              className={errors.kelas ? 'k-invalid' : ''}
            />
          )}
        />
        {errors.kelas && (
          <div className="field-error">{errors.kelas.message}</div>
        )}
      </div>
      
      <div className="form-actions">
        <Button
          type="submit"
          themeColor="primary"
          disabled={!isValid || loading}
          loading={loading}
        >
          {siswa ? 'Update' : 'Simpan'}
        </Button>
        <Button
          type="button"
          fillMode="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Batal
        </Button>
      </div>
    </form>
  );
};

export default SiswaForm;
```

### 6.4 State Management dengan Context API

#### Narasi Implementasi
Global state management menggunakan React Context API untuk authentication, notifications, dan application state.

```typescript
// AuthContext.tsx - Authentication state management
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, AuthState, AuthAction } from '../types/auth.types';
import { authAPI } from '../services/authAPI';

interface AuthContextType {
  state: AuthState;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  checkTokenExpiry: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null
      };
    
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload
      };
    
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null
      };
    
    case 'TOKEN_REFRESH':
      return {
        ...state,
        token: action.payload.token,
        tokenExpiry: action.payload.expiry
      };
    
    default:
      return state;
  }
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  tokenExpiry: null,
  loading: false,
  error: null
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: parsedUser, token }
        });
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);
  
  // Auto token refresh
  useEffect(() => {
    if (state.isAuthenticated && state.tokenExpiry) {
      const timeUntilExpiry = new Date(state.tokenExpiry).getTime() - Date.now();
      const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 0); // 5 minutes before expiry
      
      const timeout = setTimeout(() => {
        refreshToken();
      }, refreshTime);
      
      return () => clearTimeout(timeout);
    }
  }, [state.tokenExpiry]);
  
  const login = async (username: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await authAPI.login(username, password);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: response.user,
          token: response.token
        }
      });
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error.message || 'Login failed'
      });
      throw error;
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };
  
  const refreshToken = async () => {
    try {
      const response = await authAPI.refreshToken();
      
      localStorage.setItem('token', response.token);
      
      dispatch({
        type: 'TOKEN_REFRESH',
        payload: {
          token: response.token,
          expiry: response.expiry
        }
      });
    } catch (error) {
      logout();
    }
  };
  
  const checkTokenExpiry = (): boolean => {
    if (!state.tokenExpiry) return false;
    
    const timeUntilExpiry = new Date(state.tokenExpiry).getTime() - Date.now();
    return timeUntilExpiry < 5 * 60 * 1000; // Less than 5 minutes
  };
  
  const value: AuthContextType = {
    state,
    login,
    logout,
    refreshToken,
    checkTokenExpiry
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

## 🧪 TAHAP 7: TESTING IMPLEMENTATION

### 7.1 Unit Testing Strategy

#### Narasi Implementasi
Comprehensive unit testing menggunakan Jest dan React Testing Library untuk ensure code quality dan reliability.

```typescript
// SiswaForm.test.tsx - Component unit testing
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SiswaForm from '../SiswaForm';
import { Siswa } from '../../types/siswa.types';

const mockOnSubmit = jest.fn();
const mockOnCancel = jest.fn();

const mockSiswa: Siswa = {
  id: 1,
  nama: 'Ahmad Budi',
  nis: '12345',
  jenis_kelamin: 'L',
  kelas: '10A',
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z'
};

describe('SiswaForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders form fields correctly', () => {
    render(
      <SiswaForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );
    
    expect(screen.getByLabelText(/nama lengkap/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nis/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/jenis kelamin/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/kelas/i)).toBeInTheDocument();
  });
  
  test('validates required fields', async () => {
    const user = userEvent.setup();
    
    render(
      <SiswaForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );
    
    const submitButton = screen.getByRole('button', { name: /simpan/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/nama wajib diisi/i)).toBeInTheDocument();
      expect(screen.getByText(/nis wajib diisi/i)).toBeInTheDocument();
    });
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
  
  test('validates NIS format', async () => {
    const user = userEvent.setup();
    
    render(
      <SiswaForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );
    
    const nisInput = screen.getByLabelText(/nis/i);
    await user.type(nisInput, '123'); // Invalid NIS (too short)
    
    const submitButton = screen.getByRole('button', { name: /simpan/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/nis harus 5-10 digit angka/i)).toBeInTheDocument();
    });
  });
  
  test('submits form with valid data', async () => {
    const user = userEvent.setup();
    
    render(
      <SiswaForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );
    
    // Fill form with valid data
    await user.type(screen.getByLabelText(/nama lengkap/i), 'Test Student');
    await user.type(screen.getByLabelText(/nis/i), '12345');
    await user.selectOptions(screen.getByLabelText(/jenis kelamin/i), 'L');
    await user.type(screen.getByLabelText(/kelas/i), '10A');
    
    const submitButton = screen.getByRole('button', { name: /simpan/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        nama: 'Test Student',
        nis: '12345',
        jenis_kelamin: 'L',
        kelas: '10A'
      });
    });
  });
  
  test('populates form when editing existing siswa', () => {
    render(
      <SiswaForm
        siswa={mockSiswa}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );
    
    expect(screen.getByDisplayValue('Ahmad Budi')).toBeInTheDocument();
    expect(screen.getByDisplayValue('12345')).toBeInTheDocument();
    expect(screen.getByDisplayValue('10A')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument();
  });
});
```

### 7.2 Integration Testing

#### Narasi Implementasi
Integration testing untuk ensure proper communication between components dan services.

```typescript
// siswaAPI.test.ts - API integration testing
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { siswaAPI } from '../siswaAPI';
import { Siswa } from '../../types/siswa.types';

const mockSiswa: Siswa[] = [
  {
    id: 1,
    nama: 'Ahmad Budi',
    nis: '12345',
    jenis_kelamin: 'L',
    kelas: '10A',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  }
];

const server = setupServer(
  rest.get('/api/siswa', (req, res, ctx) => {
    return res(ctx.json(mockSiswa));
  }),
  
  rest.post('/api/siswa', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({ ...req.body, id: 2 })
    );
  }),
  
  rest.put('/api/siswa/:id', (req, res, ctx) => {
    return res(ctx.json({ ...req.body, id: parseInt(req.params.id) }));
  }),
  
  rest.delete('/api/siswa/:id', (req, res, ctx) => {
    return res(ctx.status(204));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('siswaAPI', () => {
  test('fetches siswa list', async () => {
    const result = await siswaAPI.getAll();
    expect(result).toEqual(mockSiswa);
  });
  
  test('creates new siswa', async () => {
    const newSiswa = {
      nama: 'Test Student',
      nis: '54321',
      jenis_kelamin: 'P' as const,
      kelas: '11B'
    };
    
    const result = await siswaAPI.create(newSiswa);
    expect(result).toEqual({ ...newSiswa, id: 2 });
  });
  
  test('handles API errors', async () => {
    server.use(
      rest.get('/api/siswa', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Server error' }));
      })
    );
    
    await expect(siswaAPI.getAll()).rejects.toThrow('Server error');
  });
});
```

### 7.3 End-to-End Testing dengan Cypress

#### Narasi Implementasi
E2E testing untuk validate complete user workflows dan system integration.

```typescript
// siswa-management.cy.ts - E2E testing
describe('Siswa Management', () => {
  beforeEach(() => {
    // Login before each test
    cy.login('admin', 'password123');
    cy.visit('/siswa');
  });
  
  it('should display siswa list', () => {
    cy.get('[data-testid="siswa-grid"]').should('be.visible');
    cy.get('.k-grid-content tbody tr').should('have.length.greaterThan', 0);
  });
  
  it('should create new siswa', () => {
    // Click add button
    cy.get('[data-testid="add-siswa-btn"]').click();
    
    // Fill form
    cy.get('[data-testid="nama-input"]').type('Test Student E2E');
    cy.get('[data-testid="nis-input"]').type('99999');
    cy.get('[data-testid="jenis-kelamin-dropdown"]').click();
    cy.get('[data-testid="jenis-kelamin-L"]').click();
    cy.get('[data-testid="kelas-input"]').type('12A');
    
    // Submit form
    cy.get('[data-testid="submit-btn"]').click();
    
    // Verify success
    cy.get('[data-testid="success-notification"]')
      .should('be.visible')
      .and('contain', 'Siswa berhasil ditambahkan');
    
    // Verify in grid
    cy.get('[data-testid="siswa-grid"]')
      .should('contain', 'Test Student E2E')
      .and('contain', '99999');
  });
  
  it('should edit existing siswa', () => {
    // Find and click edit button
    cy.get('[data-testid="siswa-grid"] tbody tr')
      .first()
      .find('[data-testid="edit-btn"]')
      .click();
    
    // Update nama
    cy.get('[data-testid="nama-input"]')
      .clear()
      .type('Updated Student Name');
    
    // Submit form
    cy.get('[data-testid="submit-btn"]').click();
    
    // Verify success
    cy.get('[data-testid="success-notification"]')
      .should('be.visible')
      .and('contain', 'Siswa berhasil diupdate');
  });
  
  it('should delete siswa with confirmation', () => {
    // Get initial row count
    cy.get('[data-testid="siswa-grid"] tbody tr').then(($rows) => {
      const initialCount = $rows.length;
      
      // Click delete button
      cy.get('[data-testid="siswa-grid"] tbody tr')
        .first()
        .find('[data-testid="delete-btn"]')
        .click();
      
      // Confirm deletion
      cy.get('[data-testid="confirm-delete-btn"]').click();
      
      // Verify success
      cy.get('[data-testid="success-notification"]')
        .should('be.visible')
        .and('contain', 'Siswa berhasil dihapus');
      
      // Verify row count decreased
      cy.get('[data-testid="siswa-grid"] tbody tr')
        .should('have.length', initialCount - 1);
    });
  });
  
  it('should validate form fields', () => {
    cy.get('[data-testid="add-siswa-btn"]').click();
    
    // Try to submit empty form
    cy.get('[data-testid="submit-btn"]').click();
    
    // Check validation errors
    cy.get('[data-testid="nama-error"]')
      .should('be.visible')
      .and('contain', 'Nama wajib diisi');
    
    cy.get('[data-testid="nis-error"]')
      .should('be.visible')
      .and('contain', 'NIS wajib diisi');
  });
  
  it('should search and filter siswa', () => {
    // Test search functionality
    cy.get('[data-testid="search-input"]').type('Ahmad');
    cy.get('[data-testid="siswa-grid"] tbody tr').should('contain', 'Ahmad');
    
    // Test kelas filter
    cy.get('[data-testid="kelas-filter"]').select('10A');
    cy.get('[data-testid="siswa-grid"] tbody tr').each(($row) => {
      cy.wrap($row).should('contain', '10A');
    });
  });
});
```

## 🚀 TAHAP 8: DEPLOYMENT & PRODUCTION

### 8.1 Docker Containerization

#### Narasi Implementasi
Complete containerization strategy dengan multi-stage builds untuk optimization dan security.

```dockerfile
# Backend Dockerfile - Multi-stage build
FROM python:3.11-slim as builder

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Production stage
FROM python:3.11-slim as production

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Copy Python packages from builder
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy application code
COPY . .

# Create non-root user
RUN useradd --create-home --shell /bin/bash app
USER app

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```dockerfile
# Frontend Dockerfile - Optimized React build
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage with nginx
FROM nginx:alpine as production

# Copy built assets
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:80/health || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 8.2 Docker Compose Orchestration

#### Narasi Implementasi
Complete service orchestration dengan proper networking, volumes, dan environment management.

```yaml
# docker-compose.yml - Production-ready orchestration
version: '3.8'

services:
  database:
    image: postgres:15-alpine
    container_name: edupro-database
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./db-init:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    networks:
      - edupro-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
      target: production
    container_name: edupro-backend
    environment:
      - DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@database:5432/${DB_NAME}
      - SECRET_KEY=${SECRET_KEY}
      - ENVIRONMENT=${ENVIRONMENT}
    volumes:
      - ./backend/static:/app/static
      - ./logs:/app/logs
    ports:
      - "8000:8000"
    networks:
      - edupro-network
    depends_on:
      database:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      target: production
    container_name: edupro-frontend
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/nginx/ssl:ro
      - ./logs/nginx:/var/log/nginx
    networks:
      - edupro-network
    depends_on:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80/health"]
      interval: 30s
      timeout: 5s
      retries: 3

  redis:
    image: redis:7-alpine
    container_name: edupro-redis
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    networks:
      - edupro-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local

networks:
  edupro-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

### 8.3 CI/CD Pipeline dengan GitHub Actions

#### Narasi Implementasi
Automated deployment pipeline dengan comprehensive testing dan security checks.

```yaml
# .github/workflows/deploy.yml - Complete CI/CD pipeline
name: EduPro CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test-backend:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test_password
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
    
    - name: Cache pip dependencies
      uses: actions/cache@v3
      with:
        path: ~/.cache/pip
        key: ${{ runner.os }}-pip-${{ hashFiles('**/requirements.txt') }}
    
    - name: Install dependencies
      run: |
        cd backend
        pip install -r requirements.txt
        pip install pytest pytest-cov
    
    - name: Run tests
      env:
        DATABASE_URL: postgresql://postgres:test_password@localhost:5432/test_db
      run: |
        cd backend
        pytest --cov=. --cov-report=xml --cov-report=html
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./backend/coverage.xml

  test-frontend:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: frontend/package-lock.json
    
    - name: Install dependencies
      run: |
        cd frontend
        npm ci
    
    - name: Run linting
      run: |
        cd frontend
        npm run lint
    
    - name: Run unit tests
      run: |
        cd frontend
        npm run test:coverage
    
    - name: Run E2E tests
      run: |
        cd frontend
        npm run test:e2e:headless

  security-scan:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Run Trivy vulnerability scanner
      uses: aquasecurity/trivy-action@master
      with:
        scan-type: 'fs'
        scan-ref: '.'
        format: 'sarif'
        output: 'trivy-results.sarif'
    
    - name: Upload Trivy scan results
      uses: github/codeql-action/upload-sarif@v2
      with:
        sarif_file: 'trivy-results.sarif'

  build-and-push:
    needs: [test-backend, test-frontend, security-scan]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Log in to Container Registry
      uses: docker/login-action@v3
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
    
    - name: Build and push backend image
      uses: docker/build-push-action@v5
      with:
        context: ./backend
        push: true
        tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-backend:latest
        cache-from: type=gha
        cache-to: type=gha,mode=max
    
    - name: Build and push frontend image
      uses: docker/build-push-action@v5
      with:
        context: ./frontend
        push: true
        tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-frontend:latest
        cache-from: type=gha
        cache-to: type=gha,mode=max

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
    - name: Deploy to production
      uses: appleboy/ssh-action@v1.0.0
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /opt/edupro
          docker-compose pull
          docker-compose up -d --remove-orphans
          docker system prune -f
          
          # Health check
          sleep 30
          curl -f http://localhost/health || exit 1
          
          echo "Deployment completed successfully"
```

Status: **Production Ready** dengan comprehensive implementation yang mencakup modern frontend architecture, extensive testing strategy, dan robust deployment pipeline. Dokumentasi ini memberikan foundation yang solid untuk development, testing, dan deployment sistem prediksi EduPro. 