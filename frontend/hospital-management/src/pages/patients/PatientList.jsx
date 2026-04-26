import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Box,
  Chip,
  IconButton
} from '@mui/material';
import { Edit, Delete, Search, Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PatientList = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockPatients = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+1-555-0123',
        age: 35,
        gender: 'Male',
        lastVisit: '2024-01-15',
        status: 'active'
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@email.com',
        phone: '+1-555-0124',
        age: 28,
        gender: 'Female',
        lastVisit: '2024-01-10',
        status: 'active'
      },
      {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike.j@email.com',
        phone: '+1-555-0125',
        age: 42,
        gender: 'Male',
        lastVisit: '2023-12-20',
        status: 'inactive'
      }
    ];
    
    setPatients(mockPatients);
    setLoading(false);
  }, []);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id) => {
    navigate(`/patients/edit/${id}`);
  };

  const handleDelete = (id) => {
    setPatients(patients.filter(p => p.id !== id));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Patient List
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/patients/new')}
        >
          Add Patient
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            label="Search patients"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1 }} />
            }}
          />
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Last Visit</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>{patient.phone}</TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{patient.lastVisit}</TableCell>
                <TableCell>
                  <Chip
                    label={patient.status}
                    color={patient.status === 'active' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(patient.id)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(patient.id)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredPatients.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="textSecondary">
            No patients found
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default PatientList;
