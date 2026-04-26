import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Dashboard
import Dashboard from '../pages/dashboard/Dashboard';

// Patient Pages
import PatientList from '../pages/patients/PatientList';
import PatientForm from '../pages/patients/PatientForm';
import DiseasePrediction from '../pages/patients/DiseasePrediction';
import Recommendation from '../pages/patients/Recommendation';
import PredictionHistory from '../pages/patients/PredictionHistory';

// Doctor Pages
import DoctorList from '../pages/doctors/DoctorList';

// Hospital Pages
import HospitalList from '../pages/hospitals/HospitalList';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Patient Routes */}
      <Route path="/patients" element={<PatientList />} />
      <Route path="/patients/new" element={<PatientForm />} />
      <Route path="/patients/edit/:id" element={<PatientForm />} />
      <Route path="/" element={<DiseasePrediction />} />
      <Route path="/history" element={<PredictionHistory />} />
      <Route path="/recommendations" element={<Recommendation />} />

      {/* Doctor Routes */}
      <Route path="/doctors" element={<DoctorList />} />

      {/* Hospital Routes */}
      <Route path="/hospitals" element={<HospitalList />} />

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
