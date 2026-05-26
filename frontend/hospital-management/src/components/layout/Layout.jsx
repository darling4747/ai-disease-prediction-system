import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const drawerWidth = 260;

const Layout = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: '#090a0d',
        color: '#f5f3dd'
      }}
    >
      <Navbar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          ml: { xs: 0, md: `${drawerWidth}px` },
          mt: '70px',
          minHeight: 'calc(100vh - 70px)',
          bgcolor: '#090a0d',
          backgroundImage:
            'linear-gradient(135deg, rgba(239,241,111,0.06) 0%, transparent 26%), repeating-linear-gradient(90deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 88px)',
          overflowX: 'hidden'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
