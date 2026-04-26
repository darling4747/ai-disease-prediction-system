import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  Avatar
} from '@mui/material';
import {
  LocalHospital,
  History,
  People,
  Business,
  Dashboard,
  AdminPanelSettings,
  CalendarToday,
  Favorite
} from '@mui/icons-material';
import authService from '../../services/authService';

const drawerWidth = 260;

const Sidebar = () => {
  const location = useLocation();
  const currentUser = authService.getCurrentUser();
  const isAdmin = currentUser?.role === 'ADMIN';

  const isActive = (path) => location.pathname === path;

  const mainMenuItems = [
    {
      text: 'Dashboard',
      icon: <Dashboard sx={{ fontSize: 20 }} />, 
      path: '/dashboard'
    },
    {
      text: 'Disease Prediction',
      icon: <Favorite sx={{ fontSize: 20 }} />,
      path: '/'
    },
    {
      text: 'Prediction History',
      icon: <History sx={{ fontSize: 20 }} />,
      path: '/history'
    },
    {
      text: 'Appointments',
      icon: <CalendarToday sx={{ fontSize: 20 }} />,
      path: '/appointments'
    }
  ];

  const otherMenuItems = [
    {
      text: 'Doctors',
      icon: <People sx={{ fontSize: 20 }} />,
      path: '/doctors'
    },
    {
      text: 'Hospitals',
      icon: <Business sx={{ fontSize: 20 }} />,
      path: '/hospitals'
    },
    {
      text: 'Recommendations',
      icon: <LocalHospital sx={{ fontSize: 20 }} />,
      path: '/recommendations'
    }
  ];

  if (isAdmin) {
    otherMenuItems.push({
      text: 'Admin Panel',
      icon: <AdminPanelSettings sx={{ fontSize: 20 }} />,
      path: '/admin'
    });
  }

  const MenuSection = ({ title, items }) => (
    <Box sx={{ mb: 3 }}>
      <Typography 
        variant="caption" 
        sx={{ 
          px: 3, 
          mb: 1, 
          display: 'block',
          color: '#94a3b8',
          fontWeight: 500,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}
      >
        {title}
      </Typography>
      <List sx={{ px: 2 }}>
        {items.map((item) => (
          <ListItem
            key={item.text}
            component={Link}
            to={item.path}
            selected={isActive(item.path)}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              py: 1,
              textDecoration: 'none',
              '&.Mui-selected': {
                backgroundColor: '#6366f1',
                color: 'white',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                '& .MuiListItemIcon-root': {
                  color: 'white'
                }
              },
              '&:hover': {
                backgroundColor: isActive(item.path) ? '#6366f1' : '#f1f5f9',
              },
              transition: 'all 0.2s ease'
            }}
          >
            <ListItemIcon sx={{ 
              color: isActive(item.path) ? 'white' : '#64748b',
              minWidth: 36,
              mr: 1
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{
                fontSize: '0.875rem',
                fontWeight: isActive(item.path) ? 600 : 500,
                color: isActive(item.path) ? 'white' : '#475569'
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.02)'
        },
      }}
    >
      {/* Logo Section */}
      <Toolbar sx={{ px: 3, py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box 
            sx={{ 
              p: 1, 
              borderRadius: 2, 
              bgcolor: '#6366f1',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Favorite sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                color: '#1e293b',
                fontSize: '1.125rem',
                letterSpacing: '-0.02em'
              }}
            >
              HavenMed
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#94a3b8',
                fontWeight: 500
              }}
            >
              Healthcare System
            </Typography>
          </Box>
        </Box>
      </Toolbar>

      {/* Menu Sections */}
      <Box sx={{ overflow: 'auto', mt: 2 }}>
        <MenuSection title="Main Menu" items={mainMenuItems} />
        <MenuSection title="Other" items={otherMenuItems} />
      </Box>

      {/* User Profile Section */}
      <Box sx={{ mt: 'auto', p: 2, borderTop: '1px solid #e2e8f0' }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            p: 2,
            borderRadius: 2,
            bgcolor: '#f8fafc',
            cursor: 'pointer',
            '&:hover': { bgcolor: '#f1f5f9' }
          }}
        >
          <Avatar 
            sx={{ 
              bgcolor: '#6366f1', 
              fontSize: '0.875rem',
              fontWeight: 600,
              width: 40,
              height: 40
            }}
          >
            {currentUser?.firstName?.[0] || 'U'}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 600, 
                color: '#1e293b',
                fontSize: '0.875rem'
              }}
            >
              {currentUser?.firstName || 'User'} {currentUser?.lastName || ''}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#94a3b8',
                fontWeight: 500,
                textTransform: 'capitalize'
              }}
            >
              {currentUser?.role?.toLowerCase() || 'Patient'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
