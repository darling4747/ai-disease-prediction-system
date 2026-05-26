import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Rating,
  Box
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import authService, { normalizeRole } from '../../services/authService';
import doctorService from '../../services/doctorService';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const navigate = useNavigate();
  const isPatient = normalizeRole(authService.getCurrentUser()?.role) === 'PATIENT';

  const specializations = [
    'General Practitioner',
    'Cardiologist',
    'Neurologist',
    'Pediatrician',
    'Orthopedic',
    'Dermatologist',
    'Psychiatrist',
    'Gynecologist',
    'Ophthalmologist',
    'ENT Specialist'
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const data = await doctorService.getDoctors();
      setDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      const data = await doctorService.searchDoctors(searchTerm, selectedSpecialization);
      setDoctors(data);
    } catch (error) {
      console.error('Error searching doctors:', error);
    }
  };

  const handleBookAppointment = () => {
    navigate('/appointments');
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
          Loading doctors...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" sx={{ mt: 4, mb: 2 }}>
        Find Doctors
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search doctors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search />
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Specialization</InputLabel>
                <Select
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                >
                  <MenuItem value="">All Specializations</MenuItem>
                  {specializations.map((spec) => (
                    <MenuItem key={spec} value={spec}>
                      {spec}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                onClick={handleSearch}
                fullWidth
                sx={{ mt: 1 }}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {doctors.map((doctor) => (
          <Grid item xs={12} md={6} key={doctor.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {doctor.name}
                </Typography>
                
                <Typography variant="body2" color="primary" gutterBottom>
                  {doctor.specialization}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {typeof doctor.hospital === 'object' ? doctor.hospital?.name : doctor.hospital || 'Hospital not assigned'}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating value={doctor.rating} precision={0.1} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ({doctor.rating}) • {doctor.experience} years exp.
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip
                    label={doctor.available ? 'Available' : 'Unavailable'}
                    color={doctor.available ? 'success' : 'default'}
                    size="small"
                  />
                  {isPatient && (
                    <Button
                      variant="outlined"
                      disabled={!doctor.available}
                      onClick={handleBookAppointment}
                    >
                      Book Appointment
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default DoctorList;
