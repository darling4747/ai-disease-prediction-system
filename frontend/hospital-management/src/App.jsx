import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Layout Components
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';

// Page Components
import DiseasePrediction from './pages/patients/DiseasePrediction';
import PredictionHistory from './pages/patients/PredictionHistory';
import Recommendation from './pages/patients/Recommendation';
import MedicineRecommendation from './pages/patients/MedicineRecommendation';
import HealthReport from './pages/patients/HealthReport';
import DoctorList from './pages/doctors/DoctorList';
import DoctorDashboard from './pages/doctors/DoctorDashboard';
import HospitalList from './pages/hospitals/HospitalList';
import Dashboard from './pages/dashboard/Dashboard';
import AdminPanel from './pages/admin/AdminPanel';
import AppointmentBooking from './pages/appointments/AppointmentBooking';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
    },
    secondary: {
      main: '#ec4899',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
    },
    warning: {
      main: '#f59e0b',
    },
    error: {
      main: '#ef4444',
    },
    info: {
      main: '#3b82f6',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          border: '1px solid #e2e8f0',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<Layout />}>
        <Route path="/" element={<ProtectedRoute><DiseasePrediction /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><PredictionHistory /></ProtectedRoute>} />
        <Route path="/health-report" element={<ProtectedRoute><HealthReport /></ProtectedRoute>} />
        <Route path="/health-report/:id" element={<ProtectedRoute><HealthReport /></ProtectedRoute>} />
        <Route path="/medicines" element={<ProtectedRoute><MedicineRecommendation /></ProtectedRoute>} />
        <Route path="/recommendations" element={<ProtectedRoute><Recommendation /></ProtectedRoute>} />
        <Route path="/doctors" element={<ProtectedRoute><DoctorList /></ProtectedRoute>} />
        <Route path="/doctor-dashboard" element={<RoleBasedRoute allowedRoles={['DOCTOR', 'ADMIN']}><DoctorDashboard /></RoleBasedRoute>} />
        <Route path="/hospitals" element={<ProtectedRoute><HospitalList /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<RoleBasedRoute allowedRoles={['ADMIN']}><AdminPanel /></RoleBasedRoute>} />
        <Route path="/appointments" element={<RoleBasedRoute allowedRoles={['PATIENT']}><AppointmentBooking /></RoleBasedRoute>} />
      </Route>
      <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
