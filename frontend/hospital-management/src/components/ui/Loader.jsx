import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const Loader = ({
  size = 40,
  text,
  fullScreen = false,
  overlay = false
}) => {
  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        ...(fullScreen && {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999
        }),
        ...(overlay && {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 1000
        })
      }}
    >
      <CircularProgress size={size} />
      {text && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          {text}
        </Typography>
      )}
    </Box>
  );

  return content;
};

export default Loader;
