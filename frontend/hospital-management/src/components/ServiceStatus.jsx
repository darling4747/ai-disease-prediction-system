import React, { useState, useEffect } from 'react';
import {
  Box,
  Chip,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Computer,
  Psychology,
  Storage
} from '@mui/icons-material';
import predictionService from '../services/predictionService';

const ServiceStatus = () => {
  const [backendStatus, setBackendStatus] = useState('checking');
  const [mlStatus, setMlStatus] = useState('checking');
  const [dbStatus, setDbStatus] = useState('checking');

  useEffect(() => {
    checkServices();
    const interval = setInterval(checkServices, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkServices = async () => {
    try {
      const backendHealth = await predictionService.getBackendHealth();
      setBackendStatus(backendHealth.status === 'UP' ? 'online' : 'offline');
    } catch (err) {
      setBackendStatus('offline');
    }

    try {
      const mlHealth = await predictionService.getMLHealth();
      setMlStatus(mlHealth.status === 'healthy' ? 'online' : 'offline');
      setDbStatus(mlHealth.status === 'healthy' ? 'online' : 'offline');
    } catch (err) {
      setMlStatus('offline');
      setDbStatus('offline');
    }
  };

  const getChipProps = (status) => {
    switch (status) {
      case 'online':
        return { color: 'success', icon: <CheckCircle fontSize="small" /> };
      case 'offline':
        return { color: 'error', icon: <Error fontSize="small" /> };
      default:
        return { color: 'default', icon: <CircularProgress size={14} /> };
    }
  };

  const backendProps = getChipProps(backendStatus);
  const mlProps = getChipProps(mlStatus);
  const dbProps = getChipProps(dbStatus);

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <Tooltip title="Backend API (Port 8080)">
        <Chip
          size="small"
          icon={<Computer fontSize="small" />}
          label="API"
          color={backendProps.color}
          sx={{ height: 24 }}
        />
      </Tooltip>
      
      <Tooltip title="ML Service (Port 5000)">
        <Chip
          size="small"
          icon={<Psychology fontSize="small" />}
          label="ML"
          color={mlProps.color}
          sx={{ height: 24 }}
        />
      </Tooltip>
      
      <Tooltip title="Database (MongoDB)">
        <Chip
          size="small"
          icon={<Storage fontSize="small" />}
          label="DB"
          color={dbProps.color}
          sx={{ height: 24 }}
        />
      </Tooltip>
    </Box>
  );
};

export default ServiceStatus;
