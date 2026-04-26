import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  TextField,
  InputAdornment,
  Avatar,
  Chip,
  LinearProgress,
  IconButton
} from '@mui/material';
import {
  LocalHospital,
  TrendingUp,
  People,
  Business,
  ArrowForward,
  Search,
  NotificationsNone,
  CalendarToday,
  Favorite,
  Speed,
  HealthAndSafety,
  Assignment,
  LocalPhone,
  AccessTime
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import SymptomForm from '../components/SymptomForm';
import ResultCard from '../components/ResultCard';
import authService from '../services/authService';

const Home = () => {
  const [predictionResult, setPredictionResult] = useState(null);
  const currentUser = authService.getCurrentUser();
  const navigate = useNavigate();

  const quickStats = [
    { 
      title: 'Total Predictions', 
      value: '1,247', 
      change: '+12%',
      icon: <TrendingUp sx={{ fontSize: 20 }} />, 
      color: '#6366f1',
      bgColor: '#eef2ff'
    },
    { 
      title: 'Active Users', 
      value: '856', 
      change: '+8%',
      icon: <People sx={{ fontSize: 20 }} />, 
      color: '#10b981',
      bgColor: '#ecfdf5'
    },
    { 
      title: 'Hospitals', 
      value: '42', 
      change: '+3%',
      icon: <Business sx={{ fontSize: 20 }} />, 
      color: '#f59e0b',
      bgColor: '#fffbeb'
    },
    { 
      title: 'Expert Doctors', 
      value: '128', 
      change: '+5%',
      icon: <LocalHospital sx={{ fontSize: 20 }} />, 
      color: '#ec4899',
      bgColor: '#fce7f3'
    }
  ];

  const recentTests = [
    { name: 'Sarah Johnson', test: 'Diabetes Screening', date: 'Today, 10:30 AM', status: 'Pending', result: 'Normal', avatar: 'SJ' },
    { name: 'Michael Chen', test: 'Blood Pressure', date: 'Today, 09:15 AM', status: 'Completed', result: 'High', avatar: 'MC' },
    { name: 'Emily Davis', test: 'Cholesterol Check', date: 'Yesterday, 2:30 PM', status: 'Completed', result: 'Normal', avatar: 'ED' },
    { name: 'James Wilson', test: 'Heart Rate Monitor', date: 'Yesterday, 11:00 AM', status: 'Completed', result: 'Normal', avatar: 'JW' },
  ];

  const healthServices = [
    {
      icon: <Favorite sx={{ fontSize: 24 }} />,
      title: 'AI Disease Prediction',
      description: 'Get accurate disease predictions based on your symptoms',
      color: '#6366f1',
      action: () => document.getElementById('prediction-section').scrollIntoView({ behavior: 'smooth' })
    },
    {
      icon: <People sx={{ fontSize: 24 }} />,
      title: 'Find Doctors',
      description: 'Connect with specialized doctors near you',
      color: '#10b981',
      action: () => navigate('/doctors')
    },
    {
      icon: <Business sx={{ fontSize: 24 }} />,
      title: 'Locate Hospitals',
      description: 'Find the best hospitals with emergency services',
      color: '#f59e0b',
      action: () => navigate('/hospitals')
    },
    {
      icon: <CalendarToday sx={{ fontSize: 24 }} />,
      title: 'Book Appointments',
      description: 'Schedule appointments with healthcare providers',
      color: '#ec4899',
      action: () => navigate('/appointments')
    }
  ];

  const upcomingConsultations = [
    { doctor: 'Dr. Sarah Smith', specialty: 'Cardiologist', time: '10:30 AM', type: 'Follow-up' },
    { doctor: 'Dr. Michael Brown', specialty: 'General Physician', time: '02:00 PM', type: 'Checkup' },
  ];

  return (
    <Box sx={{ p: 0 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
            Welcome back, {currentUser?.firstName || 'User'}! 👋
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Here's your health overview for today
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search symptoms, doctors..."
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

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickStats.map((stat, index) => (
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
                  <Chip 
                    size="small" 
                    label={stat.change}
                    sx={{ 
                      bgcolor: stat.bgColor, 
                      color: stat.color,
                      fontWeight: 600,
                      fontSize: '0.75rem'
                    }} 
                  />
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
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          {/* Health Services */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
                Health Services
              </Typography>
              <Grid container spacing={2}>
                {healthServices.map((service, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box
                      onClick={service.action}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        bgcolor: '#f8fafc',
                        cursor: 'pointer',
                        border: '1px solid #e2e8f0',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: service.color,
                          boxShadow: `0 4px 12px ${service.color}20`,
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      <Box sx={{ 
                        color: service.color, 
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        {service.icon}
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                          {service.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {service.description}
                      </Typography>
                      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', color: service.color }}>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          Get Started
                        </Typography>
                        <ArrowForward sx={{ fontSize: 16, ml: 0.5 }} />
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Disease Prediction Section */}
          <Card id="prediction-section" sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ 
                  p: 1, 
                  borderRadius: 2, 
                  bgcolor: '#6366f120',
                  color: '#6366f1',
                  mr: 2
                }}>
                  <HealthAndSafety />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    AI Disease Prediction
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Enter your symptoms and get instant predictions
                  </Typography>
                </Box>
              </Box>
              
              <SymptomForm onPredictionResult={setPredictionResult} />

              {predictionResult && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b', mb: 2 }}>
                    Prediction Results
                  </Typography>
                  <Grid container spacing={2}>
                    {predictionResult.predictions.map((prediction, index) => (
                      <Grid item xs={12} key={index}>
                        <ResultCard prediction={prediction} index={index} />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Recent Test Results */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  Recent Test Results
                </Typography>
                <Button variant="text" size="small" onClick={() => navigate('/history')}>
                  View All
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {recentTests.map((test, index) => (
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
                        {test.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                          {test.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {test.test}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        {test.date}
                      </Typography>
                      <Chip 
                        size="small" 
                        label={test.result}
                        color={test.result === 'Normal' ? 'success' : 'warning'}
                        sx={{ height: 20, fontSize: '0.7rem', mt: 0.5 }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          {/* Upcoming Consultations */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
                Upcoming Consultations
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {upcomingConsultations.map((consult, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      p: 2,
                      borderLeft: '3px solid #6366f1',
                      bgcolor: '#f8fafc',
                      borderRadius: '0 8px 8px 0'
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        {consult.doctor}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {consult.specialty} • {consult.type}
                      </Typography>
                    </Box>
                    <Chip 
                      size="small" 
                      label={consult.time}
                      sx={{ 
                        bgcolor: '#6366f120', 
                        color: '#6366f1',
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
                Book New Consultation
              </Button>
            </CardContent>
          </Card>

          {/* Health Tips */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
                Daily Health Tips
              </Typography>
              <Box sx={{ 
                p: 3, 
                borderRadius: 2, 
                bgcolor: '#ecfdf5',
                border: '1px solid #10b98130'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: '#10b981' }}>
                  <Speed sx={{ mr: 1 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Stay Hydrated
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Drink at least 8 glasses of water daily to maintain optimal body function.
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={65} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: '#10b98130',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#10b981',
                      borderRadius: 4
                    }
                  }} 
                />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  65% of daily goal completed
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
                Emergency Contact
              </Typography>
              <Box sx={{ 
                p: 3, 
                borderRadius: 2, 
                bgcolor: '#fef2f2',
                border: '1px solid #ef444430',
                textAlign: 'center'
              }}>
                <LocalPhone sx={{ fontSize: 40, color: '#ef4444', mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#ef4444', mb: 1 }}>
                  911
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Emergency services available 24/7
                </Typography>
                <Button 
                  variant="contained" 
                  fullWidth
                  color="error"
                  sx={{ py: 1.5 }}
                >
                  Call Now
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
