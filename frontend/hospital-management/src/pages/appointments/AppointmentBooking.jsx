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
  Tabs,
  Tab,
  Alert,
  Chip,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  CalendarToday,
  AccessTime,
  LocalHospital,
  Person,
  Cancel,
  CheckCircle,
  Pending,
  EventAvailable
} from '@mui/icons-material';
import appointmentService from '../../services/appointmentService';
import doctorService from '../../services/doctorService';
import hospitalService from '../../services/hospitalService';

const AppointmentBooking = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  // Data states
  const [doctors, setDoctors] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [hospitals, setHospitals] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  // Form states
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');

  // Dialog states
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const steps = ['Select Doctor', 'Choose Date & Time', 'Confirm Booking'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setDataLoading(true);
    try {
      const [doctorsData, hospitalsData, appointmentsData] = await Promise.all([
        doctorService.getDoctors(),
        hospitalService.getHospitals(),
        appointmentService.getMyAppointments()
      ]);
      setDoctors(doctorsData || []);
      setHospitals(hospitalsData || []);
      setMyAppointments(appointmentsData?.appointments || []);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to load data' });
    } finally {
      setDataLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setMessage({ type: '', text: '' });
  };

  const loadAvailableSlots = async () => {
    if (!selectedDoctor || !selectedDate) return;
    
    try {
      const result = await appointmentService.getAvailableSlots(selectedDoctor, selectedDate);
      setAvailableSlots(result.slots || []);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to load slots' });
    }
  };

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const handleNext = () => {
    if (activeStep === 0 && !selectedDoctor) {
      setMessage({ type: 'error', text: 'Please select a doctor' });
      return;
    }
    if (activeStep === 1 && (!selectedDate || !selectedTime)) {
      setMessage({ type: 'error', text: 'Please select date and time' });
      return;
    }
    setActiveStep((prevStep) => prevStep + 1);
    setMessage({ type: '', text: '' });
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleBookAppointment = async () => {
    setLoading(true);
    try {
      const appointmentData = {
        doctorId: selectedDoctor,
        appointmentDate: `${selectedDate}T${selectedTime}:00`,
        symptoms,
        notes
      };

      const result = await appointmentService.bookAppointment(appointmentData);
      setMessage({ type: 'success', text: result.message });
      setOpenConfirmDialog(false);
      
      // Reset form
      setActiveStep(0);
      setSelectedDoctor('');
      setSelectedDate('');
      setSelectedTime('');
      setSymptoms('');
      setNotes('');
      
      // Reload appointments
      loadData();
      setActiveTab(1); // Switch to my appointments tab
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to book appointment' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    
    try {
      const result = await appointmentService.cancelAppointment(id);
      setMessage({ type: 'success', text: result.message });
      loadData();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to cancel appointment' });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'success';
      case 'PENDING': return 'warning';
      case 'CANCELLED': return 'error';
      case 'COMPLETED': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CONFIRMED': return <CheckCircle color="success" />;
      case 'PENDING': return <Pending color="warning" />;
      case 'CANCELLED': return <Cancel color="error" />;
      case 'COMPLETED': return <CheckCircle color="info" />;
      default: return <Pending />;
    }
  };

  const selectedDoctorData = doctors.find(d => d.id === selectedDoctor);

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100%', p: 3 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#1a237e', mb: 1 }}>
            Appointment Booking
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Book appointments with doctors and manage your scheduled visits
          </Typography>
        </Box>

        {message.text && (
          <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage({ type: '', text: '' })}>
            {message.text}
          </Alert>
        )}

        {/* Tabs */}
        <Card elevation={2}>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab icon={<EventAvailable />} label="Book Appointment" />
            <Tab icon={<CalendarToday />} label="My Appointments" />
          </Tabs>

          {/* Book Appointment Tab */}
          {activeTab === 0 && (
            <Box sx={{ p: 3 }}>
              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {/* Step 1: Select Doctor */}
              {activeStep === 0 && (
                <Grid container spacing={3}>
                  {dataLoading ? (
                    <Grid item xs={12}>
                      <Alert severity="info">Loading doctors...</Alert>
                    </Grid>
                  ) : doctors.length === 0 ? (
                    <Grid item xs={12}>
                      <Alert severity="warning">
                        No doctors available. Please contact an admin to add doctors to the system.
                      </Alert>
                    </Grid>
                  ) : (
                    doctors.map((doctor) => (
                    <Grid item xs={12} md={6} key={doctor.id}>
                      <Card 
                        variant={selectedDoctor === doctor.id ? "elevation" : "outlined"}
                        elevation={selectedDoctor === doctor.id ? 4 : 0}
                        onClick={() => doctor.acceptingNewPatients && setSelectedDoctor(doctor.id)}
                        sx={{ 
                          cursor: doctor.acceptingNewPatients ? 'pointer' : 'not-allowed',
                          opacity: doctor.acceptingNewPatients ? 1 : 0.6,
                          border: selectedDoctor === doctor.id ? '2px solid #1976d2' : '1px solid #e0e0e0',
                          '&:hover': doctor.acceptingNewPatients ? { borderColor: '#1976d2' } : {}
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Person sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
                            <Box flex={1}>
                              <Typography variant="h6">{doctor.name}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {doctor.specialization}
                              </Typography>
                            </Box>
                            {doctor.acceptingNewPatients ? (
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  bgcolor: '#dcfce7', 
                                  color: '#166534', 
                                  px: 1, 
                                  py: 0.5, 
                                  borderRadius: 1,
                                  fontWeight: 500
                                }}
                              >
                                Available
                              </Typography>
                            ) : (
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  bgcolor: '#fee2e2', 
                                  color: '#991b1b', 
                                  px: 1, 
                                  py: 0.5, 
                                  borderRadius: 1,
                                  fontWeight: 500
                                }}
                              >
                                Unavailable
                              </Typography>
                            )}
                          </Box>
                          <Divider sx={{ my: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            <LocalHospital fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                            {doctor.hospital || 'No Hospital'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Experience: {doctor.experience} years | Rating: {doctor.rating}/5
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            Next Available: {doctor.nextAvailable || 'Not Available'}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                  )}
                </Grid>
              )}

              {/* Step 2: Select Date & Time */}
              {activeStep === 1 && selectedDoctorData && (
                <Box>
                  <Card sx={{ mb: 3, bgcolor: '#e3f2fd' }}>
                    <CardContent>
                      <Typography variant="h6">
                        Dr. {selectedDoctorData.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedDoctorData.specialization} | {selectedDoctorData.hospital}
                      </Typography>
                    </CardContent>
                  </Card>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Select Date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: new Date().toISOString().split('T')[0] }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom>
                        Available Time Slots
                      </Typography>
                      {availableSlots.length === 0 ? (
                        <Alert severity="info">Please select a date to see available slots</Alert>
                      ) : (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {availableSlots.map((slot) => (
                            <Button
                              key={slot}
                              variant={selectedTime === slot ? "contained" : "outlined"}
                              onClick={() => setSelectedTime(slot)}
                              startIcon={<AccessTime />}
                            >
                              {slot}
                            </Button>
                          ))}
                        </Box>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label="Symptoms (Optional)"
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label="Additional Notes (Optional)"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Step 3: Confirm */}
              {activeStep === 2 && selectedDoctorData && (
                <Box>
                  <Typography variant="h6" gutterBottom>Confirm Appointment Details</Typography>
                  <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" color="text.secondary">Doctor</Typography>
                          <Typography variant="body1">Dr. {selectedDoctorData.name}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" color="text.secondary">Specialization</Typography>
                          <Typography variant="body1">{selectedDoctorData.specialization}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" color="text.secondary">Hospital</Typography>
                          <Typography variant="body1">{selectedDoctorData.hospital}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" color="text.secondary">Date & Time</Typography>
                          <Typography variant="body1">{selectedDate} at {selectedTime}</Typography>
                        </Grid>
                        {symptoms && (
                          <Grid item xs={12}>
                            <Typography variant="subtitle2" color="text.secondary">Symptoms</Typography>
                            <Typography variant="body1">{symptoms}</Typography>
                          </Grid>
                        )}
                        {notes && (
                          <Grid item xs={12}>
                            <Typography variant="subtitle2" color="text.secondary">Notes</Typography>
                            <Typography variant="body1">{notes}</Typography>
                          </Grid>
                        )}
                      </Grid>
                    </CardContent>
                  </Card>
                </Box>
              )}

              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="outlined"
                >
                  Back
                </Button>
                <Box>
                  {activeStep === steps.length - 1 ? (
                    <Button
                      variant="contained"
                      onClick={() => setOpenConfirmDialog(true)}
                      disabled={loading}
                    >
                      Confirm Booking
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      disabled={doctors.length === 0 || activeStep === 0 && !selectedDoctor}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
          )}

          {/* My Appointments Tab */}
          {activeTab === 1 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>My Appointments</Typography>
              <Divider sx={{ mb: 2 }} />
              
              {myAppointments.length === 0 ? (
                <Alert severity="info">No appointments found. Book your first appointment!</Alert>
              ) : (
                <List>
                  {myAppointments.map((appointment) => (
                    <ListItem
                      key={appointment.id}
                      sx={{ 
                        bgcolor: 'background.paper', 
                        mb: 1, 
                        borderRadius: 1,
                        border: '1px solid #e0e0e0'
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1">
                              Dr. {appointment.doctorName}
                            </Typography>
                            <Chip 
                              size="small" 
                              color={getStatusColor(appointment.status)}
                              label={appointment.status}
                              icon={getStatusIcon(appointment.status)}
                            />
                          </Box>
                        }
                        secondary={
                          <Box component="span" sx={{ display: 'block' }}>
                            <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                              {appointment.doctorSpecialization} | {appointment.hospitalName}
                            </Typography>
                            <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                              <CalendarToday fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                              {new Date(appointment.appointmentDate).toLocaleString()}
                            </Typography>
                            {appointment.symptoms && (
                              <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                                Symptoms: {appointment.symptoms}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        {appointment.status !== 'CANCELLED' && appointment.status !== 'COMPLETED' && (
                          <Button
                            size="small"
                            color="error"
                            startIcon={<Cancel />}
                            onClick={() => handleCancelAppointment(appointment.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          )}
        </Card>
      </Container>

      {/* Confirmation Dialog */}
      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
        <DialogTitle>Confirm Appointment Booking</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to book this appointment?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Doctor: Dr. {selectedDoctorData?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Date: {selectedDate} at {selectedTime}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleBookAppointment}
            disabled={loading}
          >
            {loading ? 'Booking...' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppointmentBooking;
