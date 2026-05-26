import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Alert, Typography } from '@mui/material';
import { normalizeRole } from '../services/authService';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userRole = normalizeRole(user?.role);
  const normalizedAllowedRoles = allowedRoles.map(normalizeRole);
  const hasAccess = normalizedAllowedRoles.includes(userRole);

  if (!hasAccess) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" variant="filled">
          <Typography variant="h6">Access Denied</Typography>
          <Typography>You do not have permission to access this page.</Typography>
          <Typography sx={{ mt: 1 }}>
            Your role: <strong>{userRole || 'Unknown'}</strong>
          </Typography>
          <Typography sx={{ mt: 1 }}>
            Required roles: <strong>{normalizedAllowedRoles.join(', ')}</strong>
          </Typography>
        </Alert>
      </Container>
    );
  }

  return children;
};

export default RoleBasedRoute;
