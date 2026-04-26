import { api } from './api';

export const patientService = {
  // Get all patients
  async getPatients() {
    try {
      const response = await api.get('/api/patients');
      return response.data;
    } catch (error) {
      console.error('Error fetching patients:', error);
      return this.getMockPatients();
    }
  },

  // Get patient by ID
  async getPatientById(id) {
    try {
      const response = await api.get(`/api/patients/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching patient:', error);
      return null;
    }
  },

  // Create patient
  async createPatient(patient) {
    try {
      const response = await api.post('/api/patients', patient);
      return response.data;
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
  },

  // Update patient
  async updatePatient(id, patient) {
    try {
      const response = await api.put(`/api/patients/${id}`, patient);
      return response.data;
    } catch (error) {
      console.error('Error updating patient:', error);
      throw error;
    }
  },

  // Delete patient
  async deletePatient(id) {
    try {
      await api.delete(`/api/patients/${id}`);
    } catch (error) {
      console.error('Error deleting patient:', error);
      throw error;
    }
  },

  // Search patients
  async searchPatients(query) {
    try {
      const response = await api.get('/api/patients/search', {
        params: { query }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching patients:', error);
      return this.getMockPatients();
    }
  },

  // Mock patients data for fallback
  getMockPatients() {
    return [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+1-555-0123',
        age: 35,
        gender: 'Male',
        address: '123 Main St, City',
        bloodGroup: 'O+',
        allergies: 'None',
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
        address: '456 Oak Ave, City',
        bloodGroup: 'A+',
        allergies: 'Peanuts',
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
        address: '789 Pine Rd, City',
        bloodGroup: 'B+',
        allergies: 'Penicillin',
        lastVisit: '2023-12-20',
        status: 'inactive'
      }
    ];
  }
};

export default patientService;
