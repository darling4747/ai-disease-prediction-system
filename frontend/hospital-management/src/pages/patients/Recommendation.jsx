import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Rating,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DoctorRecommendations = () => {
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');
  const navigate = useNavigate();

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
    fetchHospitals();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/doctors');
      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }
      const data = await response.json();
      setDoctors(data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to load doctors');
      
      setDoctors([
        {
          id: '1',
          name: 'Dr. John Smith',
          specialization: 'General Practitioner',
          hospital: {
            id: '1',
            name: 'City General Hospital',
            department: 'Outpatient',
            address: '123 Main St, City',
            phone: '+1-555-0123'
          },
          experience: 15,
          rating: 4.5,
          available: true,
          consultationFee: 100
        },
        {
          id: '2',
          name: 'Dr. Sarah Johnson',
          specialization: 'Cardiologist',
          hospital: {
            id: '2',
            name: 'Heart Care Center',
            department: 'Cardiology',
            address: '456 Medical Ave, City',
            phone: '+1-555-0124'
          },
          experience: 12,
          rating: 4.8,
          available: true,
          consultationFee: 200
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchHospitals = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/hospitals');
      if (!response.ok) {
        throw new Error('Failed to fetch hospitals');
      }
      const data = await response.json();
      setHospitals(data);
    } catch (err) {
      console.error('Error fetching hospitals:', err);
      
      setHospitals([
        {
          id: '1',
          name: 'City General Hospital',
          address: '123 Main St, City',
          phone: '+1-555-0123',
          departments: ['General Medicine', 'Cardiology', 'Neurology', 'Pediatrics']
        },
        {
          id: '2',
          name: 'Heart Care Center',
          address: '456 Medical Ave, City',
          phone: '+1-555-0124',
          departments: ['Cardiology', 'Cardiac Surgery']
        }
      ]);
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = !selectedSpecialization || 
                                 doctor.specialization === selectedSpecialization;
    const matchesHospital = !selectedHospital || 
                           doctor.hospital.id === selectedHospital;
    
    return matchesSearch && matchesSpecialization && matchesHospital;
  });

  const handleBookAppointment = async (doctorId) => {
    try {
      const response = await fetch('http://localhost:8080/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctorId: doctorId,
          userId: 'user123',
          date: new Date().toISOString(),
          status: 'scheduled'
        }),
      });

      if (response.ok) {
        alert('Appointment booked successfully!');
      } else {
        throw new Error('Failed to book appointment');
      }
    } catch (err) {
      console.error('Error booking appointment:', err);
      alert('Failed to book appointment. Please try again.');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Doctor Recommendations
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Find the right doctor based on your symptoms and preferences.
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate('/')}
          sx={{ mb: 3 }}
        >
          Back to Symptom Checker
        </Button>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Filter Doctors
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Search by name or specialization"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
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
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Hospital</InputLabel>
                  <Select
                    value={selectedHospital}
                    onChange={(e) => setSelectedHospital(e.target.value)}
                  >
                    <MenuItem value="">All Hospitals</MenuItem>
                    {hospitals.map((hospital) => (
                      <MenuItem key={hospital.id} value={hospital.id}>
                        {hospital.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {filteredDoctors.map((doctor) => (
            <Grid item xs={12} md={6} key={doctor.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Typography variant="h6">
                      {doctor.name}
                    </Typography>
                    <Chip
                      label={doctor.available ? 'Available' : 'Unavailable'}
                      color={doctor.available ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" color="primary" gutterBottom>
                    {doctor.specialization}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating value={doctor.rating} precision={0.1} readOnly size="small" />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {doctor.rating} ({doctor.experience} years exp.)
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" gutterBottom>
                    Hospital Information
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>{doctor.hospital.name}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Department: {doctor.hospital.department}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Address: {doctor.hospital.address}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Phone: {doctor.hospital.phone}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="primary">
                      ${doctor.consultationFee}
                    </Typography>
                    <Button
                      variant="contained"
                      disabled={!doctor.available}
                      onClick={() => handleBookAppointment(doctor.id)}
                    >
                      {doctor.available ? 'Book Appointment' : 'Not Available'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredDoctors.length === 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6" align="center" color="text.secondary">
                No doctors found matching your criteria
              </Typography>
              <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 2 }}>
                Try adjusting your filters or search terms.
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
};

export default DoctorRecommendations;
