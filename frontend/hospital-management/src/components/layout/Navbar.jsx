import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Menu as MenuIcon,
  LocalHospital,
  History,
  People,
  Business,
  AccountCircle,
  ExitToApp,
  PersonAdd
} from '@mui/icons-material';
import ServiceStatus from '../ServiceStatus';
import authService from '../../services/authService';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, [location]);

  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate('/login');
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{ 
        bgcolor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Toolbar sx={{ minHeight: '64px' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#1e293b', fontWeight: 700 }}>
          <Link to="/" style={{ color: '#1e293b', textDecoration: 'none' }}>
            HavenMed
          </Link>
        </Typography>

        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{ 
              color: isActive('/') ? '#6366f1' : '#64748b',
              backgroundColor: isActive('/') ? '#eef2ff' : 'transparent',
              mr: 1,
              fontWeight: 500
            }}
          >
            <LocalHospital sx={{ mr: 1 }} />
            Disease Prediction
          </Button>
          
          <Button
            color="inherit"
            component={Link}
            to="/history"
            sx={{ 
              color: isActive('/history') ? '#6366f1' : '#64748b',
              backgroundColor: isActive('/history') ? '#eef2ff' : 'transparent',
              mr: 1,
              fontWeight: 500
            }}
          >
            <History sx={{ mr: 1 }} />
            History
          </Button>
          
          <Button
            color="inherit"
            component={Link}
            to="/recommendations"
            sx={{ 
              color: isActive('/recommendations') ? '#6366f1' : '#64748b',
              backgroundColor: isActive('/recommendations') ? '#eef2ff' : 'transparent',
              mr: 1,
              fontWeight: 500
            }}
          >
            <People sx={{ mr: 1 }} />
            Find Doctors
          </Button>
          {isAdmin && (
            <Button
              color="inherit"
              component={Link}
              to="/doctors"
              sx={{ 
                backgroundColor: isActive('/doctors') ? 'rgba(255,255,255,0.1)' : 'transparent',
                mr: 1 
              }}
            >
              <People sx={{ mr: 1 }} />
              Doctors
            </Button>
          )}
          <Button
            color="inherit"
            component={Link}
            to="/hospitals"
            sx={{ 
              color: isActive('/hospitals') ? '#6366f1' : '#64748b',
              backgroundColor: isActive('/hospitals') ? '#eef2ff' : 'transparent',
              fontWeight: 500
            }}
          >
            <Business sx={{ mr: 1 }} />
            Hospitals
          </Button>
          
          <Box sx={{ ml: 2, display: { xs: 'none', lg: 'flex' } }}>
            <ServiceStatus />
          </Box>

          {/* Auth Buttons */}
          {user ? (
            <>
              <Typography variant="body2" sx={{ ml: 2, mr: 1, color: '#64748b' }}>
                {user.email}
              </Typography>
              <Button
                color="inherit"
                onClick={handleLogout}
                startIcon={<ExitToApp />}
                sx={{ ml: 1, color: '#64748b', fontWeight: 500 }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/login"
                startIcon={<AccountCircle />}
                sx={{ ml: 1, color: '#64748b', fontWeight: 500 }}
              >
                Login
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/register"
                startIcon={<PersonAdd />}
                sx={{ ml: 1, color: '#64748b', fontWeight: 500 }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>

        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenu}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem component={Link} to="/" onClick={handleClose}>
              <LocalHospital sx={{ mr: 1 }} /> Disease Prediction
            </MenuItem>
            <MenuItem component={Link} to="/history" onClick={handleClose}>
              <History sx={{ mr: 1 }} /> History
            </MenuItem>
            <MenuItem component={Link} to="/recommendations" onClick={handleClose}>
              <People sx={{ mr: 1 }} /> Find Doctors
            </MenuItem>
            {isAdmin && (
              <MenuItem component={Link} to="/doctors" onClick={handleClose}>
                <People sx={{ mr: 1 }} /> Doctors
              </MenuItem>
            )}
            <MenuItem component={Link} to="/hospitals" onClick={handleClose}>
              <Business sx={{ mr: 1 }} /> Hospitals
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
