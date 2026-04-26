import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Chip,
  Rating,
  Box
} from '@mui/material';
import { Search, LocationOn, LocalHospital, Phone, AccessTime } from '@mui/icons-material';
import hospitalService from '../../services/hospitalService';

const HospitalList = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const data = await hospitalService.getHospitals();
      setHospitals(data);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      const data = await hospitalService.searchHospitals(searchTerm);
      setHospitals(data);
    } catch (error) {
      console.error('Error searching hospitals:', error);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
          Loading hospitals...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" sx={{ mt: 4, mb: 2 }}>
        Find Hospitals
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              fullWidth
              label="Search hospitals"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search />
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              sx={{ minWidth: 120 }}
            >
              Search
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {hospitals.map((hospital) => (
          <Grid item xs={12} md={6} key={hospital.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {hospital.name}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating value={hospital.rating} precision={0.1} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ({hospital.rating})
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Chip
                    icon={<LocationOn />}
                    label={hospital.location}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  {hospital.emergencyServices && (
                    <Chip
                      icon={<LocalHospital />}
                      label="Emergency Services"
                      color="error"
                      size="small"
                    />
                  )}
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {hospital.address}
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <Phone sx={{ fontSize: 16, mr: 1 }} />
                  {hospital.phone}
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <AccessTime sx={{ fontSize: 16, mr: 1 }} />
                  {hospital.hours}
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  Services:
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {hospital.services.slice(0, 3).map((service) => (
                    <Chip
                      key={service}
                      label={service}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                  {hospital.services.length > 3 && (
                    <Chip
                      label={`+${hospital.services.length - 3} more`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>

                <Typography variant="body2" color="text.secondary">
                  {hospital.bedCapacity} bed capacity
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HospitalList;
