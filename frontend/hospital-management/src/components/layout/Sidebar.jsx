import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Avatar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';
import {
  AdminPanelSettings,
  Business,
  CalendarToday,
  Dashboard,
  Description,
  Favorite,
  HealthAndSafety,
  History,
  LocalHospital,
  LocalPharmacy,
  MedicalServices,
  People
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 260;
const accent = '#eff16f';
const muted = '#a5a6b4';

const Sidebar = () => {
  const location = useLocation();
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'ADMIN';
  const isDoctor = currentUser?.role === 'DOCTOR';
  const isPatient = currentUser?.role === 'PATIENT';

  const isActive = (path) => location.pathname === path;

  const mainMenuItems = [
    {
      text: 'Dashboard',
      icon: <Dashboard sx={{ fontSize: 21 }} />,
      path: '/dashboard'
    },
    {
      text: 'AI Diagnosis',
      icon: <Favorite sx={{ fontSize: 21 }} />,
      path: '/'
    },
    {
      text: isDoctor ? 'Patient Cases' : 'Prediction History',
      icon: <History sx={{ fontSize: 21 }} />,
      path: '/history'
    }
  ];

  if (isPatient) {
    mainMenuItems.push({
      text: 'Appointments',
      icon: <CalendarToday sx={{ fontSize: 21 }} />,
      path: '/appointments'
    });
  }

  if (isDoctor || isAdmin) {
    mainMenuItems.push({
      text: 'Doctor Dashboard',
      icon: <MedicalServices sx={{ fontSize: 21 }} />,
      path: '/doctor-dashboard'
    });
  }

  mainMenuItems.push(
    {
      text: 'Health Report',
      icon: <Description sx={{ fontSize: 21 }} />,
      path: '/health-report'
    },
    {
      text: 'Medicines',
      icon: <LocalPharmacy sx={{ fontSize: 21 }} />,
      path: '/medicines'
    }
  );

  const otherMenuItems = [
    {
      text: 'Doctors',
      icon: <People sx={{ fontSize: 21 }} />,
      path: '/doctors'
    },
    {
      text: 'Hospitals',
      icon: <Business sx={{ fontSize: 21 }} />,
      path: '/hospitals'
    },
    {
      text: 'Recommendations',
      icon: <LocalHospital sx={{ fontSize: 21 }} />,
      path: '/recommendations'
    }
  ];

  if (isAdmin) {
    otherMenuItems.push({
      text: 'Admin Panel',
      icon: <AdminPanelSettings sx={{ fontSize: 21 }} />,
      path: '/admin'
    });
  }

  const MenuSection = ({ title, items }) => (
    <Box sx={{ mb: 3 }}>
      <Typography
        sx={{
          px: 3,
          mb: 1,
          display: 'block',
          color: '#777986',
          fontWeight: 800,
          fontSize: '0.72rem',
          textTransform: 'uppercase'
        }}
      >
        {title}
      </Typography>
      <List sx={{ px: 1.5 }}>
        {items.map((item) => {
          const active = isActive(item.path);

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.7 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={active}
                sx={{
                  minHeight: 48,
                  borderRadius: '8px',
                  color: active ? accent : muted,
                  border: active ? '1px solid rgba(239,241,111,0.25)' : '1px solid transparent',
                  bgcolor: active ? 'rgba(239,241,111,0.13)' : 'transparent',
                  '&.Mui-selected': {
                    bgcolor: 'rgba(239,241,111,0.13)'
                  },
                  '&.Mui-selected:hover, &:hover': {
                    bgcolor: active ? 'rgba(239,241,111,0.16)' : 'rgba(255,255,255,0.055)'
                  },
                  '&::before': active
                    ? {
                      content: '""',
                      position: 'absolute',
                      left: -2,
                      top: 8,
                      bottom: 8,
                      width: 4,
                      borderRadius: 999,
                      bgcolor: accent
                    }
                    : {}
                }}
              >
                <ListItemIcon sx={{ minWidth: 38, color: active ? accent : muted }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.92rem',
                    fontWeight: active ? 800 : 600
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(239,241,111,0.12)',
          bgcolor: '#101115',
          color: '#f7f3d0',
          backgroundImage:
            'linear-gradient(180deg, rgba(239,241,111,0.05), transparent 42%), linear-gradient(90deg, rgba(255,255,255,0.035), transparent)',
          boxShadow: '12px 0 40px rgba(0,0,0,0.35)'
        }
      }}
    >
      <Box sx={{ px: 2.5, pt: 3, pb: 2.5, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.4 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: '8px',
              display: 'grid',
              placeItems: 'center',
              color: '#121312',
              bgcolor: accent,
              boxShadow: '0 0 24px rgba(239,241,111,0.28)'
            }}
          >
            <HealthAndSafety sx={{ fontSize: 27 }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 900, fontSize: '1.35rem', lineHeight: 1 }}>
              CureAI
            </Typography>
            <Typography sx={{ color: muted, fontSize: '0.76rem', fontWeight: 700 }}>
              Diagnosis System
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ overflowY: 'auto', mt: 3 }}>
        <MenuSection title="Clinical" items={mainMenuItems} />
        <MenuSection title="Network" items={otherMenuItems} />
      </Box>

      <Box sx={{ mt: 'auto', p: 2.2, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.3,
            p: 1.4,
            borderRadius: '8px',
            bgcolor: 'rgba(255,255,255,0.045)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          <Avatar
            sx={{
              bgcolor: accent,
              color: '#141513',
              fontSize: '0.9rem',
              fontWeight: 900,
              width: 42,
              height: 42
            }}
          >
            {(currentUser?.firstName?.[0] || 'U').toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography noWrap sx={{ fontWeight: 800, fontSize: '0.9rem' }}>
              {currentUser?.firstName || 'User'} {currentUser?.lastName || ''}
            </Typography>
            <Typography
              noWrap
              sx={{
                color: muted,
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'capitalize'
              }}
            >
              {currentUser?.role?.toLowerCase() || 'patient'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
