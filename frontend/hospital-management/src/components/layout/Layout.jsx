import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const drawerWidth = 260;

const Layout = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Navbar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          mt: '64px',
          minHeight: 'calc(100vh - 64px)',
          bgcolor: '#f8fafc'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
