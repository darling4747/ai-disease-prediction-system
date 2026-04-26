import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Avatar,
  LinearProgress,
  Chip,
  IconButton,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  LocalHospital,
  People,
  CalendarToday,
  TrendingUp,
  Search,
  MoreVert,
  ArrowUpward,
  ArrowDownward,
  NotificationsNone,
  Favorite,
  HeartBroken,
  WaterDrop,
  Thermostat,
  Air
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import doctorService from '../../services/doctorService';
import hospitalService from '../../services/hospitalService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalHospitals: 0,
    totalPredictions: 1247,
    totalAppointments: 48,
    weeklyGrowth: 12
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [doctors, hospitals] = await Promise.all([
        doctorService.getDoctors(),
        hospitalService.getHospitals()
      ]);

      setStats({
        totalDoctors: doctors.length,
        totalHospitals: hospitals.length,
        totalPredictions: 1247,
        totalAppointments: 48,
        weeklyGrowth: 12
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      title: 'Total Patients', 
      value: stats.totalPredictions.toLocaleString(), 
      change: '+12%',
      changeType: 'positive',
      icon: <People sx={{ fontSize: 24 }} />, 
      color: '#6366f1',
      bgColor: '#eef2ff'
    },
    { 
      title: 'Appointments', 
      value: stats.totalAppointments, 
      change: '+8%',
      changeType: 'positive',
      icon: <CalendarToday sx={{ fontSize: 24 }} />, 
      color: '#10b981',
      bgColor: '#ecfdf5'
    },
    { 
      title: 'Total Doctors', 
      value: stats.totalDoctors, 
      change: '+3%',
      changeType: 'positive',
      icon: <LocalHospital sx={{ fontSize: 24 }} />, 
      color: '#f59e0b',
      bgColor: '#fffbeb'
    },
    { 
      title: 'Total Hospitals', 
      value: stats.totalHospitals, 
      change: '+5%',
      changeType: 'positive',
      icon: <TrendingUp sx={{ fontSize: 24 }} />, 
      color: '#ec4899',
      bgColor: '#fce7f3'
    }
  ];

  const recentPatients = [
    { name: 'Sarah Johnson', age: 34, condition: 'Common Cold', date: 'Today, 10:30 AM', status: 'Pending', avatar: 'SJ' },
    { name: 'Michael Chen', age: 45, condition: 'Hypertension', date: 'Today, 09:15 AM', status: 'Confirmed', avatar: 'MC' },
    { name: 'Emily Davis', age: 28, condition: 'Migraine', date: 'Yesterday, 2:30 PM', status: 'Completed', avatar: 'ED' },
    { name: 'James Wilson', age: 52, condition: 'Diabetes Check', date: 'Yesterday, 11:00 AM', status: 'Completed', avatar: 'JW' },
  ];

  const upcomingAppointments = [
    { doctor: 'Dr. Sarah Smith', time: '10:30 AM', type: 'General Checkup', color: '#6366f1' },
    { doctor: 'Dr. Michael Brown', time: '02:00 PM', type: 'Follow-up', color: '#10b981' },
    { doctor: 'Dr. Emily Johnson', time: '04:30 PM', type: 'Consultation', color: '#f59e0b' },
  ];

  const healthMetrics = [
    { label: 'Heart Rate', value: '72', unit: 'bpm', icon: <Favorite />, color: '#ef4444', progress: 75 },
    { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', icon: <HeartBroken />, color: '#6366f1', progress: 85 },
    { label: 'Oxygen Level', value: '98', unit: '%', icon: <Air />, color: '#10b981', progress: 98 },
    { label: 'Temperature', value: '98.6', unit: '°F', icon: <Thermostat />, color: '#f59e0b', progress: 60 },
  ];

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 0 }}>
      {/* Header with Search */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome back! Here's your healthcare overview.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search patients, doctors..."
            sx={{ width: 280, bgcolor: 'white' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#94a3b8' }} />
                </InputAdornment>
              ),
            }}
          />
          <IconButton sx={{ bgcolor: 'white', color: '#64748b' }}>
            <NotificationsNone />
          </IconButton>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ 
                    p: 1.5, 
                    borderRadius: 2, 
                    bgcolor: stat.bgColor,
                    color: stat.color
                  }}>
                    {stat.icon}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: stat.changeType === 'positive' ? '#10b981' : '#ef4444', fontSize: '0.875rem', fontWeight: 500 }}>
                    {stat.changeType === 'positive' ? <ArrowUpward sx={{ fontSize: 16 }} /> : <ArrowDownward sx={{ fontSize: 16 }} />}
                    {stat.change}
                  </Box>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Patient Health Overview */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  Patient Health Overview
                </Typography>
                <IconButton size="small">
                  <MoreVert />
                </IconButton>
              </Box>
              <Grid container spacing={3}>
                {healthMetrics.map((metric, index) => (
                  <Grid item xs={6} md={3} key={index}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                      <Box sx={{ 
                        color: metric.color, 
                        mb: 1,
                        display: 'flex',
                        justifyContent: 'center'
                      }}>
                        {metric.icon}
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        {metric.value}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                        {metric.unit}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={metric.progress} 
                        sx={{ 
                          height: 6, 
                          borderRadius: 3,
                          bgcolor: '#e2e8f0',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: metric.color,
                            borderRadius: 3
                          }
                        }} 
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        {metric.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Recent Patients */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  Recent Patients
                </Typography>
                <Button variant="text" size="small" onClick={() => navigate('/history')}>
                  View All
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {recentPatients.map((patient, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      p: 2,
                      bgcolor: '#f8fafc',
                      borderRadius: 2,
                      '&:hover': { bgcolor: '#f1f5f9' }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: '#6366f1', fontSize: '0.875rem' }}>
                        {patient.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                          {patient.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {patient.age} years • {patient.condition}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        {patient.date}
                      </Typography>
                      <Chip 
                        size="small" 
                        label={patient.status}
                        color={patient.status === 'Completed' ? 'success' : patient.status === 'Confirmed' ? 'primary' : 'warning'}
                        sx={{ height: 20, fontSize: '0.7rem', mt: 0.5 }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Upcoming Appointments */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  Today's Appointments
                </Typography>
                <Button variant="text" size="small" onClick={() => navigate('/appointments')}>
                  View All
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {upcomingAppointments.map((apt, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      p: 2,
                      borderLeft: `3px solid ${apt.color}`,
                      bgcolor: '#f8fafc',
                      borderRadius: '0 8px 8px 0'
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        {apt.doctor}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {apt.type}
                      </Typography>
                    </Box>
                    <Chip 
                      size="small" 
                      label={apt.time}
                      sx={{ 
                        bgcolor: apt.color + '20', 
                        color: apt.color,
                        fontWeight: 500,
                        fontSize: '0.75rem'
                      }} 
                    />
                  </Box>
                ))}
              </Box>
              <Button 
                variant="contained" 
                fullWidth 
                sx={{ mt: 3, py: 1.5 }}
                onClick={() => navigate('/appointments')}
              >
                Book New Appointment
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { label: 'New Disease Prediction', icon: <Favorite />, color: '#6366f1', path: '/' },
                  { label: 'Find Doctors', icon: <People />, color: '#10b981', path: '/doctors' },
                  { label: 'View Hospitals', icon: <LocalHospital />, color: '#f59e0b', path: '/hospitals' },
                  { label: 'Prediction History', icon: <TrendingUp />, color: '#ec4899', path: '/history' },
                ].map((action, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    fullWidth
                    startIcon={action.icon}
                    sx={{ 
                      justifyContent: 'flex-start',
                      py: 1.5,
                      borderColor: '#e2e8f0',
                      color: '#64748b',
                      '&:hover': {
                        borderColor: action.color,
                        color: action.color,
                        bgcolor: action.color + '10'
                      }
                    }}
                    onClick={() => navigate(action.path)}
                  >
                    {action.label}
                  </Button>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
