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
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  LocalHospital,
  People,
  TrendingUp,
  AdminPanelSettings
} from '@mui/icons-material';
import adminService from '../../services/adminService';
import doctorService from '../../services/doctorService';
import hospitalService from '../../services/hospitalService';
import { useAuth } from '../../context/AuthContext';

const AdminPanel = () => {
  const { isAdmin, user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState({ doctors: 0, hospitals: 0, users: 0 });
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  // Form states
  const [doctorForm, setDoctorForm] = useState({
    name: '', specialization: '', department: '', hospitalId: '', hospital: '',
    phone: '', email: '', experience: '', rating: '', education: '',
    consultationFee: '', acceptingNewPatients: true
  });

  const [hospitalForm, setHospitalForm] = useState({
    name: '', location: '', address: '', phone: '', email: '',
    hours: '', rating: '', services: '', specialties: '', departments: '',
    emergencyServices: false, bedCapacity: ''
  });

  useEffect(() => {
    if (!isAdmin()) {
      setMessage({ type: 'error', text: 'Access Denied: Admin privileges required' });
      return;
    }
    loadData();
  }, [isAdmin]);

  if (!isAdmin()) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" variant="filled">
          <Typography variant="h6">Access Denied</Typography>
          <Typography>You do not have permission to access the Admin Panel.</Typography>
          <Typography sx={{ mt: 1 }}>Logged in as: <strong>{user?.role || 'Unknown'}</strong></Typography>
        </Alert>
      </Container>
    );
  }

  const loadData = async () => {
    try {
      const [statsData, doctorsData, hospitalsData] = await Promise.all([
        adminService.getStats(),
        doctorService.getDoctors(),
        hospitalService.getHospitals()
      ]);
      
      setStats(statsData);
      setDoctors(doctorsData);
      setHospitals(hospitalsData);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to load data' });
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setMessage({ type: '', text: '' });
  };

  const handleAddDoctor = async () => {
    try {
      const doctorData = {
        ...doctorForm,
        experience: parseInt(doctorForm.experience) || 0,
        rating: parseFloat(doctorForm.rating) || 0,
        qualifications: [],
        languages: ['English'],
        nextAvailable: 'Today'
      };
      
      const result = await adminService.addDoctor(doctorData);
      setMessage({ type: 'success', text: result.message });
      setOpenDialog(false);
      loadData();
      setDoctorForm({
        name: '', specialization: '', department: '', hospitalId: '', hospital: '',
        phone: '', email: '', experience: '', rating: '', education: '',
        consultationFee: '', acceptingNewPatients: true
      });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to add doctor' });
    }
  };

  const handleAddHospital = async () => {
    try {
      const hospitalData = {
        ...hospitalForm,
        rating: parseFloat(hospitalForm.rating) || 0,
        bedCapacity: parseInt(hospitalForm.bedCapacity) || 0,
        services: hospitalForm.services.split(',').map(s => s.trim()).filter(s => s),
        specialties: hospitalForm.specialties.split(',').map(s => s.trim()).filter(s => s),
        departments: hospitalForm.departments.split(',').map(s => s.trim()).filter(s => s),
        latitude: 0,
        longitude: 0
      };
      
      const result = await adminService.addHospital(hospitalData);
      setMessage({ type: 'success', text: result.message });
      setOpenDialog(false);
      loadData();
      setHospitalForm({
        name: '', location: '', address: '', phone: '', email: '',
        hours: '', rating: '', services: '', specialties: '', departments: '',
        emergencyServices: false, bedCapacity: ''
      });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to add hospital' });
    }
  };

  const handleEdit = (type, item) => {
    setSelectedItem(item);
    if (type === 'doctor') {
      setDoctorForm({
        name: item.name || '',
        specialization: item.specialization || '',
        department: item.department || '',
        hospitalId: item.hospitalId || '',
        hospital: item.hospital || '',
        phone: item.phone || '',
        email: item.email || '',
        experience: item.experience || '',
        rating: item.rating || '',
        education: item.education || '',
        consultationFee: item.consultationFee || '',
        acceptingNewPatients: item.acceptingNewPatients || true
      });
      setDialogType('editDoctor');
    } else if (type === 'hospital') {
      setHospitalForm({
        name: item.name || '',
        location: item.location || '',
        address: item.address || '',
        phone: item.phone || '',
        email: item.email || '',
        hours: item.hours || '',
        rating: item.rating || '',
        services: item.services || '',
        specialties: item.specialties || '',
        departments: item.departments || '',
        emergencyServices: item.emergencyServices || false,
        bedCapacity: item.bedCapacity || ''
      });
      setDialogType('editHospital');
    }
    setOpenDialog(true);
  };

  const handleUpdateDoctor = async () => {
    try {
      const doctorData = {
        ...doctorForm,
        experience: parseInt(doctorForm.experience) || 0,
        rating: parseFloat(doctorForm.rating) || 0,
        qualifications: [],
        languages: ['English'],
        nextAvailable: 'Today'
      };
      
      const result = await adminService.updateDoctor(selectedItem.id, doctorData);
      setMessage({ type: 'success', text: result.message });
      setOpenDialog(false);
      setSelectedItem(null);
      loadData();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update doctor' });
    }
  };

  const handleUpdateHospital = async () => {
    try {
      const hospitalData = {
        ...hospitalForm,
        rating: parseFloat(hospitalForm.rating) || 0,
        bedCapacity: parseInt(hospitalForm.bedCapacity) || 0,
        emergencyServices: hospitalForm.emergencyServices || false
      };
      
      const result = await adminService.updateHospital(selectedItem.id, hospitalData);
      setMessage({ type: 'success', text: result.message });
      setOpenDialog(false);
      setSelectedItem(null);
      loadData();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update hospital' });
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    
    try {
      const result = type === 'doctor' 
        ? await adminService.deleteDoctor(id)
        : await adminService.deleteHospital(id);
      
      setMessage({ type: 'success', text: result.message });
      loadData();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || `Failed to delete ${type}` });
    }
  };

  const openAddDialog = (type) => {
    setDialogType(type);
    setOpenDialog(true);
    setSelectedItem(null);
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card elevation={2}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color }}>
              {value}
            </Typography>
          </Box>
          <Box sx={{ color, p: 1, bgcolor: `${color}15`, borderRadius: 2 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100%', p: 3 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <AdminPanelSettings sx={{ fontSize: 40, color: '#1976d2' }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#1a237e' }}>
              Admin Panel
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage doctors, hospitals, and system settings
            </Typography>
          </Box>
        </Box>

        {message.text && (
          <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage({ type: '', text: '' })}>
            {message.text}
          </Alert>
        )}

        {/* Stats */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <StatCard 
              title="Total Doctors" 
              value={stats.doctors} 
              icon={<People sx={{ fontSize: 32 }} />}
              color="#1976d2"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard 
              title="Total Hospitals" 
              value={stats.hospitals} 
              icon={<LocalHospital sx={{ fontSize: 32 }} />}
              color="#388e3c"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard 
              title="Total Users" 
              value={stats.users} 
              icon={<TrendingUp sx={{ fontSize: 32 }} />}
              color="#f57c00"
            />
          </Grid>
        </Grid>

        {/* Tabs */}
        <Card elevation={2}>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab label="Doctors" />
            <Tab label="Hospitals" />
          </Tabs>

          {/* Doctors Tab */}
          {activeTab === 0 && (
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Manage Doctors</Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => openAddDialog('doctor')}
                >
                  Add Doctor
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <List>
                {doctors.map((doctor) => (
                  <ListItem key={doctor.id} sx={{ bgcolor: 'background.paper', mb: 1, borderRadius: 1 }}>
                    <ListItemText
                      primary={doctor.name}
                      secondary={`${doctor.specialization} | ${doctor.hospital || 'No Hospital'}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => handleEdit('doctor', doctor)} color="primary" sx={{ mr: 1 }}>
                        <Edit />
                      </IconButton>
                      <IconButton edge="end" onClick={() => handleDelete('doctor', doctor.id)} color="error">
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {/* Hospitals Tab */}
          {activeTab === 1 && (
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Manage Hospitals</Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => openAddDialog('hospital')}
                >
                  Add Hospital
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <List>
                {hospitals.map((hospital) => (
                  <ListItem key={hospital.id} sx={{ bgcolor: 'background.paper', mb: 1, borderRadius: 1 }}>
                    <ListItemText
                      primary={hospital.name}
                      secondary={`${hospital.location} | ${hospital.phone || 'No Phone'}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => handleEdit('hospital', hospital)} color="primary" sx={{ mr: 1 }}>
                        <Edit />
                      </IconButton>
                      <IconButton edge="end" onClick={() => handleDelete('hospital', hospital.id)} color="error">
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Card>
      </Container>

      {/* Add Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Add New {dialogType === 'doctor' ? 'Doctor' : 'Hospital'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'doctor' ? (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name"
                  value={doctorForm.name}
                  onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Specialization"
                  value={doctorForm.specialization}
                  onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Department"
                  value={doctorForm.department}
                  onChange={(e) => setDoctorForm({ ...doctorForm, department: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Hospital Name"
                  value={doctorForm.hospital}
                  onChange={(e) => setDoctorForm({ ...doctorForm, hospital: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={doctorForm.phone}
                  onChange={(e) => setDoctorForm({ ...doctorForm, phone: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={doctorForm.email}
                  onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Experience (years)"
                  type="number"
                  value={doctorForm.experience}
                  onChange={(e) => setDoctorForm({ ...doctorForm, experience: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Rating (0-5)"
                  type="number"
                  value={doctorForm.rating}
                  onChange={(e) => setDoctorForm({ ...doctorForm, rating: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Education"
                  value={doctorForm.education}
                  onChange={(e) => setDoctorForm({ ...doctorForm, education: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Consultation Fee"
                  value={doctorForm.consultationFee}
                  onChange={(e) => setDoctorForm({ ...doctorForm, consultationFee: e.target.value })}
                />
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Hospital Name"
                  value={hospitalForm.name}
                  onChange={(e) => setHospitalForm({ ...hospitalForm, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Location"
                  value={hospitalForm.location}
                  onChange={(e) => setHospitalForm({ ...hospitalForm, location: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={hospitalForm.phone}
                  onChange={(e) => setHospitalForm({ ...hospitalForm, phone: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={2}
                  value={hospitalForm.address}
                  onChange={(e) => setHospitalForm({ ...hospitalForm, address: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={hospitalForm.email}
                  onChange={(e) => setHospitalForm({ ...hospitalForm, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Hours"
                  value={hospitalForm.hours}
                  onChange={(e) => setHospitalForm({ ...hospitalForm, hours: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Rating (0-5)"
                  type="number"
                  value={hospitalForm.rating}
                  onChange={(e) => setHospitalForm({ ...hospitalForm, rating: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Bed Capacity"
                  type="number"
                  value={hospitalForm.bedCapacity}
                  onChange={(e) => setHospitalForm({ ...hospitalForm, bedCapacity: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Services (comma separated)"
                  placeholder="Emergency, Surgery, ICU, etc."
                  value={hospitalForm.services}
                  onChange={(e) => setHospitalForm({ ...hospitalForm, services: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Specialties (comma separated)"
                  placeholder="Cardiology, Neurology, etc."
                  value={hospitalForm.specialties}
                  onChange={(e) => setHospitalForm({ ...hospitalForm, specialties: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Departments (comma separated)"
                  placeholder="OPD, IPD, Emergency, etc."
                  value={hospitalForm.departments}
                  onChange={(e) => setHospitalForm({ ...hospitalForm, departments: e.target.value })}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (dialogType === 'doctor') handleAddDoctor();
              else if (dialogType === 'hospital') handleAddHospital();
              else if (dialogType === 'editDoctor') handleUpdateDoctor();
              else if (dialogType === 'editHospital') handleUpdateHospital();
            }}
          >
            {dialogType.startsWith('edit') ? 'Update' : 'Add'} {dialogType === 'doctor' || dialogType === 'editDoctor' ? 'Doctor' : 'Hospital'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPanel;
