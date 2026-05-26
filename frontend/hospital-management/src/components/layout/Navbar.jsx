import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Badge,
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Toolbar,
  Typography
} from '@mui/material';
import {
  AccountCircle,
  Business,
  CalendarToday,
  CreditCard,
  Dashboard,
  ExitToApp,
  Favorite,
  HealthAndSafety,
  History,
  LocalHospital,
  Menu as MenuIcon,
  NotificationsNone,
  People,
  PersonAdd,
  Search,
  Settings
} from '@mui/icons-material';
import ServiceStatus from '../ServiceStatus';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 260;
const accent = '#eff16f';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'ADMIN';
  const isPatient = user?.role === 'PATIENT';

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <Dashboard fontSize="small" /> },
    { label: 'AI Diagnosis', path: '/', icon: <Favorite fontSize="small" /> },
    { label: 'History', path: '/history', icon: <History fontSize="small" /> },
    { label: 'Doctors', path: '/doctors', icon: <People fontSize="small" /> },
    { label: 'Hospitals', path: '/hospitals', icon: <Business fontSize="small" /> },
    { label: 'Recommendations', path: '/recommendations', icon: <LocalHospital fontSize="small" /> }
  ];

  if (isPatient) {
    navItems.splice(3, 0, { label: 'Appointments', path: '/appointments', icon: <CalendarToday fontSize="small" /> });
  }

  if (isAdmin) {
    navItems.push({ label: 'Admin Panel', path: '/admin', icon: <Settings fontSize="small" /> });
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
        ml: { xs: 0, md: `${drawerWidth}px` },
        bgcolor: 'rgba(16, 17, 21, 0.96)',
        color: '#f7f3d0',
        borderBottom: '1px solid rgba(239,241,111,0.12)',
        backdropFilter: 'blur(14px)',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Toolbar sx={{ minHeight: '70px', gap: 1.5, px: { xs: 2, md: 3 } }}>
        <IconButton
          aria-label="Open navigation"
          onClick={handleMenu}
          sx={{ display: { xs: 'inline-flex', md: 'none' }, color: accent }}
        >
          <MenuIcon />
        </IconButton>

        <Box
          component={Link}
          to="/dashboard"
          sx={{
            display: { xs: 'flex', md: 'none' },
            alignItems: 'center',
            gap: 1,
            color: 'inherit',
            textDecoration: 'none'
          }}
        >
          <HealthAndSafety sx={{ color: accent }} />
          <Typography sx={{ fontWeight: 900 }}>CureAI</Typography>
        </Box>

        <TextField
          size="small"
          placeholder="Search symptoms, doctors, hospitals..."
          sx={{
            width: { xs: '100%', sm: 340, lg: 420 },
            maxWidth: { xs: '100%', md: 440 },
            ml: { xs: 0, md: 0.5 },
            display: { xs: 'none', sm: 'block' },
            '& .MuiOutlinedInput-root': {
              height: 44,
              color: '#f5f3dd',
              borderRadius: '8px',
              bgcolor: '#171820',
              '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
              '&:hover fieldset': { borderColor: 'rgba(239,241,111,0.32)' },
              '&.Mui-focused fieldset': { borderColor: accent }
            },
            '& input::placeholder': {
              color: '#8f919b',
              opacity: 1
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: '#8f919b' }} />
              </InputAdornment>
            )
          }}
        />

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: { xs: 'none', xl: 'flex' }, alignItems: 'center' }}>
          <ServiceStatus />
        </Box>

        <Button
          startIcon={<CreditCard />}
          onClick={() => navigate('/history')}
          sx={{
            display: { xs: 'none', lg: 'inline-flex' },
            minHeight: 40,
            borderRadius: '8px',
            px: 1.7,
            color: '#f7f3d0',
            bgcolor: 'rgba(255,255,255,0.055)',
            border: '1px solid rgba(255,255,255,0.08)',
            '&:hover': { bgcolor: 'rgba(239,241,111,0.1)' }
          }}
        >
          View Care ID
        </Button>

        <IconButton
          aria-label="Notifications"
          onClick={() => navigate(isPatient ? '/appointments' : '/history')}
          sx={{
            width: 40,
            height: 40,
            color: '#f7f3d0',
            bgcolor: 'rgba(255,255,255,0.055)',
            border: '1px solid rgba(255,255,255,0.08)',
            '&:hover': { bgcolor: 'rgba(239,241,111,0.1)' }
          }}
        >
          <Badge badgeContent={8} color="warning">
            <NotificationsNone />
          </Badge>
        </IconButton>

        <Button
          startIcon={<Settings />}
          onClick={() => navigate(isAdmin ? '/admin' : '/recommendations')}
          sx={{
            display: { xs: 'none', md: 'inline-flex' },
            minHeight: 40,
            borderRadius: '8px',
            px: 1.7,
            color: '#f7f3d0',
            bgcolor: 'rgba(255,255,255,0.055)',
            border: '1px solid rgba(255,255,255,0.08)',
            '&:hover': { bgcolor: 'rgba(239,241,111,0.1)' }
          }}
        >
          Settings
        </Button>

        {user ? (
          <Button
            onClick={handleLogout}
            startIcon={<ExitToApp />}
            sx={{
              display: { xs: 'none', md: 'inline-flex' },
              minHeight: 40,
              borderRadius: '8px',
              px: 1.7,
              color: accent,
              border: '1px solid rgba(239,241,111,0.28)',
              '&:hover': { bgcolor: 'rgba(239,241,111,0.08)' }
            }}
          >
            Logout
          </Button>
        ) : (
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            <Button
              component={Link}
              to="/login"
              startIcon={<AccountCircle />}
              sx={{ color: '#f7f3d0', borderRadius: '8px' }}
            >
              Login
            </Button>
            <Button
              component={Link}
              to="/register"
              startIcon={<PersonAdd />}
              sx={{
                color: '#111312',
                bgcolor: accent,
                borderRadius: '8px',
                '&:hover': { bgcolor: '#fafb91' }
              }}
            >
              Sign Up
            </Button>
          </Box>
        )}

        {user && (
          <Chip
            label={user.role || 'PATIENT'}
            size="small"
            sx={{
              display: { xs: 'none', lg: 'inline-flex' },
              color: '#111312',
              bgcolor: accent,
              fontWeight: 900
            }}
          />
        )}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 230,
              color: '#f7f3d0',
              bgcolor: '#15161b',
              border: '1px solid rgba(239,241,111,0.14)'
            }
          }}
        >
          {navItems.map((item) => (
            <MenuItem
              key={item.path}
              component={Link}
              to={item.path}
              onClick={handleClose}
              sx={{
                gap: 1,
                color: location.pathname === item.path ? accent : '#d8d7c6'
              }}
            >
              {item.icon}
              {item.label}
            </MenuItem>
          ))}
          {user ? (
            <MenuItem
              onClick={() => {
                handleClose();
                handleLogout();
              }}
              sx={{ gap: 1, color: accent }}
            >
              <ExitToApp fontSize="small" />
              Logout
            </MenuItem>
          ) : (
            [
              <MenuItem key="login" component={Link} to="/login" onClick={handleClose} sx={{ gap: 1 }}>
                <AccountCircle fontSize="small" />
                Login
              </MenuItem>,
              <MenuItem key="register" component={Link} to="/register" onClick={handleClose} sx={{ gap: 1 }}>
                <PersonAdd fontSize="small" />
                Sign Up
              </MenuItem>
            ]
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
