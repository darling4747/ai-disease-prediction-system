import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { LocalHospital } from '@mui/icons-material';

const Loader = ({ message = 'Analyzing symptoms...' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        minHeight: '200px'
      }}
    >
      <LocalHospital 
        sx={{ 
          fontSize: 60, 
          color: 'primary.main',
          mb: 2,
          animation: 'pulse 2s infinite'
        }} 
      />
      <CircularProgress size={40} thickness={4} sx={{ mb: 2 }} />
      <Typography variant="h6" color="text.secondary">
        {message}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        AI is processing your symptoms...
      </Typography>
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
        }
      `}</style>
    </Box>
  );
};

export default Loader;
