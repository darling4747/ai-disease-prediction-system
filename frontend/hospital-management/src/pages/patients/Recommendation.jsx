import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import doctorService from '../../services/doctorService';
import hospitalService from '../../services/hospitalService';
import authService, { normalizeRole } from '../../services/authService';

const COMMON_DOCTOR_TYPES = [
  'General Practitioner',
  'General Physician',
  'Cardiologist',
  'Neurologist',
  'Pediatrician',
  'Orthopedic Surgeon',
  'Dermatologist',
  'Psychiatrist',
  'Gynecologist',
  'Ophthalmologist',
  'ENT Specialist',
  'Pulmonologist',
  'Gastroenterologist'
];

const normalizeDoctor = (doctor, hospitalList) => {
  const doctorHospital = doctor.hospital;
  const doctorHospitalId = doctor.hospitalId || (typeof doctorHospital === 'object' ? doctorHospital?.id : '');
  const doctorHospitalName = typeof doctorHospital === 'object' ? doctorHospital?.name : doctorHospital;
  const hospital = hospitalList.find((item) => item.id === doctorHospitalId)
    || hospitalList.find((item) => item.name === doctorHospitalName)
    || {};

  return {
    ...doctor,
    available: doctor.acceptingNewPatients ?? doctor.available ?? true,
    consultationFee: doctor.consultationFee || '100',
    hospitalInfo: {
      id: doctorHospitalId || hospital.id || '',
      name: doctorHospitalName || hospital.name || 'Hospital not assigned',
      department: doctor.department || doctorHospital?.department || hospital.departments?.[0] || 'Outpatient',
      address: doctorHospital?.address || hospital.address || 'Address unavailable',
      phone: doctorHospital?.phone || hospital.phone || doctor.phone || 'Phone unavailable'
    }
  };
};

const DoctorRecommendations = () => {
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');
  const navigate = useNavigate();
  const isPatient = normalizeRole(authService.getCurrentUser()?.role) === 'PATIENT';

  const specializations = useMemo(() => {
    const doctorTypes = doctors
      .map((doctor) => doctor.specialization)
      .filter(Boolean);

    return Array.from(new Set([...COMMON_DOCTOR_TYPES, ...doctorTypes]))
      .sort((first, second) => first.localeCompare(second));
  }, [doctors]);

  const loadRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [doctorData, hospitalData] = await Promise.all([
        doctorService.getDoctors(),
        hospitalService.getHospitals()
      ]);
      setHospitals(hospitalData);
      setDoctors(
        doctorData
          .map((doctor) => normalizeDoctor(doctor, hospitalData))
          .sort((first, second) => (
            (first.specialization || '').localeCompare(second.specialization || '')
            || (first.name || '').localeCompare(second.name || '')
          ))
      );
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  const filteredDoctors = doctors.filter(doctor => {
    const doctorName = doctor.name || '';
    const specialization = doctor.specialization || '';
    const matchesSearch = doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = !selectedSpecialization || 
                                 specialization.toLowerCase().includes(selectedSpecialization.toLowerCase()) ||
                                 selectedSpecialization.toLowerCase().includes(specialization.toLowerCase());
    const matchesHospital = !selectedHospital ||
                           doctor.hospitalInfo.id === selectedHospital ||
                           doctor.hospitalInfo.name === selectedHospital;
    
    return matchesSearch && matchesSpecialization && matchesHospital;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSpecialization('');
    setSelectedHospital('');
  };

  const handleBookAppointment = () => {
    navigate('/appointments');
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
          All Doctor Recommendations
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Browse every available doctor type and filter by specialization, hospital, or name.
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
          >
            Back to Symptom Checker
          </Button>
          <Button
            variant="outlined"
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
        </Box>

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
                    <strong>{doctor.hospitalInfo.name}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Department: {doctor.hospitalInfo.department}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Address: {doctor.hospitalInfo.address}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Phone: {doctor.hospitalInfo.phone}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="primary">
                      {String(doctor.consultationFee).startsWith('$') ? doctor.consultationFee : `$${doctor.consultationFee}`}
                    </Typography>
                    {isPatient && (
                      <Button
                        variant="contained"
                        disabled={!doctor.available}
                        onClick={handleBookAppointment}
                      >
                        {doctor.available ? 'Book Appointment' : 'Not Available'}
                      </Button>
                    )}
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
