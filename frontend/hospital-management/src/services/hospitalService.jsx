import { api } from './api';

export const hospitalService = {
  // Get all hospitals
  async getHospitals(location) {
    try {
      const response = await api.get('/api/hospitals', {
        params: { location }
      });
      // Return mock data if API returns empty or no data
      if (!response.data || response.data.length === 0) {
        console.log('No hospitals in database, returning mock data');
        return this.getMockHospitals();
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      return this.getMockHospitals();
    }
  },

  // Get hospital by ID
  async getHospitalById(id) {
    try {
      const response = await api.get(`/api/hospitals/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching hospital:', error);
      return null;
    }
  },

  // Search hospitals
  async searchHospitals(query, specialty) {
    try {
      const response = await api.get('/api/hospitals/search', {
        params: { query, specialty }
      });
      if (!response.data || response.data.length === 0) {
        return this.getMockHospitals();
      }
      return response.data;
    } catch (error) {
      console.error('Error searching hospitals:', error);
      return this.getMockHospitals();
    }
  },

  // Create hospital
  async createHospital(hospital) {
    try {
      const response = await api.post('/api/hospitals', hospital);
      return response.data;
    } catch (error) {
      console.error('Error creating hospital:', error);
      throw error;
    }
  },

  // Mock hospitals data for fallback
  getMockHospitals() {
    return [
      {
        id: '1',
        name: 'City General Hospital',
        location: 'Downtown',
        address: '123 Main St, City',
        phone: '+1-555-0123',
        email: 'info@cityhospital.com',
        hours: '24/7 Emergency, 8AM-8PM Outpatient',
        rating: 4.2,
        services: ['Emergency Care', 'Outpatient Services', 'Inpatient Care', 'Surgery'],
        specialties: ['General Medicine', 'Cardiology', 'Neurology', 'Pediatrics'],
        departments: ['Emergency', 'Outpatient', 'Cardiology', 'Neurology', 'Pediatrics'],
        latitude: 40.7128,
        longitude: -74.0060,
        emergencyServices: true,
        bedCapacity: 500
      },
      {
        id: '2',
        name: 'Heart Care Center',
        location: 'Medical District',
        address: '456 Medical Ave, City',
        phone: '+1-555-0124',
        email: 'info@heartcare.com',
        hours: '8AM-6PM Weekdays, 9AM-2PM Weekends',
        rating: 4.7,
        services: ['Cardiac Consultation', 'Heart Surgery', 'Cardiac Rehabilitation'],
        specialties: ['Cardiology', 'Cardiac Surgery'],
        departments: ['Cardiology', 'Cardiac Surgery', 'Emergency'],
        latitude: 40.7589,
        longitude: -73.9851,
        emergencyServices: true,
        bedCapacity: 200
      },
      {
        id: '3',
        name: 'Neurology Institute',
        location: 'University Area',
        address: '789 Brain St, City',
        phone: '+1-555-0125',
        email: 'info@neuroinstitute.com',
        hours: '8AM-5PM Weekdays',
        rating: 4.5,
        services: ['Neurological Consultation', 'Brain Imaging', 'Neurosurgery'],
        specialties: ['Neurology', 'Neurosurgery'],
        departments: ['Neurology', 'Neurosurgery', 'Radiology'],
        latitude: 40.8075,
        longitude: -73.9626,
        emergencyServices: false,
        bedCapacity: 150
      }
    ];
  }
};

export default hospitalService;
