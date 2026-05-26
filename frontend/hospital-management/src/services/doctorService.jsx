import { api } from './api';

export const doctorService = {
  // Get all doctors
  async getDoctors(params = {}) {
    try {
      const response = await api.get('/api/doctors', { params });
      // Return mock data if API returns empty or no data
      if (!response.data || response.data.length === 0) {
        console.log('No doctors in database, returning mock data');
        return this.getMockDoctors();
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      return this.getMockDoctors();
    }
  },

  // Get doctor by ID
  async getDoctorById(id) {
    try {
      const response = await api.get(`/api/doctors/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching doctor:', error);
      return null;
    }
  },

  // Search doctors
  async searchDoctors(query, specialty) {
    try {
      const response = await api.get('/api/doctors/search', {
        params: { query, specialty }
      });
      if (!response.data || response.data.length === 0) {
        return this.getMockDoctors();
      }
      return response.data;
    } catch (error) {
      console.error('Error searching doctors:', error);
      return this.getMockDoctors();
    }
  },

  // Get doctors accepting new patients
  async getDoctorsAcceptingNewPatients() {
    try {
      const response = await api.get('/api/doctors/accepting-new-patients');
      if (!response.data || response.data.length === 0) {
        return this.getMockDoctors().filter(doc => doc.acceptingNewPatients);
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching doctors accepting new patients:', error);
      return this.getMockDoctors().filter(doc => doc.acceptingNewPatients);
    }
  },

  // Get top rated doctors
  async getTopRatedDoctors(minRating = 4.5) {
    try {
      const response = await api.get('/api/doctors/top-rated', {
        params: { minRating }
      });
      if (!response.data || response.data.length === 0) {
        return this.getMockDoctors().filter(doc => doc.rating >= minRating);
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching top rated doctors:', error);
      return this.getMockDoctors().filter(doc => doc.rating >= minRating);
    }
  },

  // Get doctor recommendations
  async getDoctorRecommendations(disease, location) {
    try {
      const response = await api.get('/api/doctors/recommendations', {
        params: { disease, location }
      });
      if (!response.data || response.data.length === 0) {
        return this.getMockDoctors();
      }
      return response.data;
    } catch (error) {
      console.error('Error getting doctor recommendations:', error);
      return this.getMockDoctors();
    }
  },

  // Book appointment
  async bookAppointment(appointmentData) {
    try {
      const response = await api.post('/api/appointments', appointmentData);
      return response.data;
    } catch (error) {
      console.error('Error booking appointment:', error);
      throw error;
    }
  },

  // Mock doctors data for fallback
  getMockDoctors() {
    return [
      {
        id: '1',
        name: 'Dr. John Smith',
        specialization: 'General Practitioner',
        department: 'Outpatient',
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
        consultationFee: 100,
        phone: '+1-555-0123',
        email: 'john.smith@hospital.com',
        acceptingNewPatients: true
      },
      {
        id: '2',
        name: 'Dr. Sarah Johnson',
        specialization: 'Cardiologist',
        department: 'Cardiology',
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
        consultationFee: 200,
        phone: '+1-555-0124',
        email: 'sarah.johnson@heartcare.com',
        acceptingNewPatients: true
      },
      {
        id: '3',
        name: 'Dr. Michael Chen',
        specialization: 'Neurologist',
        department: 'Neurology',
        hospital: {
          id: '1',
          name: 'City General Hospital',
          department: 'Neurology',
          address: '123 Main St, City',
          phone: '+1-555-0123'
        },
        experience: 10,
        rating: 4.6,
        available: true,
        consultationFee: 250,
        phone: '+1-555-0125',
        email: 'michael.chen@hospital.com',
        acceptingNewPatients: false
      },
      {
        id: '4',
        name: 'Dr. Emily Davis',
        specialization: 'Pediatrician',
        department: 'Pediatrics',
        hospital: {
          id: '1',
          name: 'City General Hospital',
          department: 'Pediatrics',
          address: '123 Main St, City',
          phone: '+1-555-0123'
        },
        experience: 10,
        rating: 4.7,
        available: true,
        consultationFee: 120,
        phone: '+1-555-0126',
        email: 'emily.davis@hospital.com',
        acceptingNewPatients: true
      },
      {
        id: '5',
        name: 'Dr. Robert Wilson',
        specialization: 'Orthopedic Surgeon',
        department: 'Orthopedics',
        hospital: {
          id: '1',
          name: 'City General Hospital',
          department: 'Orthopedics',
          address: '123 Main St, City',
          phone: '+1-555-0123'
        },
        experience: 18,
        rating: 4.6,
        available: true,
        consultationFee: 250,
        phone: '+1-555-0127',
        email: 'robert.wilson@hospital.com',
        acceptingNewPatients: true
      },
      {
        id: '6',
        name: 'Dr. Jennifer Martinez',
        specialization: 'Dermatologist',
        department: 'Dermatology',
        hospital: {
          id: '1',
          name: 'City General Hospital',
          department: 'Dermatology',
          address: '123 Main St, City',
          phone: '+1-555-0123'
        },
        experience: 8,
        rating: 4.5,
        available: true,
        consultationFee: 140,
        phone: '+1-555-0128',
        email: 'jennifer.martinez@hospital.com',
        acceptingNewPatients: true
      },
      {
        id: '7',
        name: 'Dr. Amanda White',
        specialization: 'Gynecologist',
        department: 'Gynecology',
        hospital: {
          id: '1',
          name: 'City General Hospital',
          department: 'Gynecology',
          address: '123 Main St, City',
          phone: '+1-555-0123'
        },
        experience: 14,
        rating: 4.8,
        available: true,
        consultationFee: 180,
        phone: '+1-555-0129',
        email: 'amanda.white@hospital.com',
        acceptingNewPatients: true
      },
      {
        id: '8',
        name: 'Dr. James Brown',
        specialization: 'Psychiatrist',
        department: 'Psychiatry',
        hospital: {
          id: '3',
          name: 'Neurology Institute',
          department: 'Psychiatry',
          address: '789 Brain St, City',
          phone: '+1-555-0125'
        },
        experience: 16,
        rating: 4.6,
        available: false,
        consultationFee: 200,
        phone: '+1-555-0130',
        email: 'james.brown@neuroinstitute.com',
        acceptingNewPatients: false
      },
      {
        id: '9',
        name: 'Dr. Olivia Green',
        specialization: 'Pulmonologist',
        department: 'Pulmonology',
        hospital: {
          id: '1',
          name: 'City General Hospital',
          department: 'Pulmonology',
          address: '123 Main St, City',
          phone: '+1-555-0123'
        },
        experience: 11,
        rating: 4.6,
        available: true,
        consultationFee: 190,
        phone: '+1-555-0131',
        email: 'olivia.green@hospital.com',
        acceptingNewPatients: true
      },
      {
        id: '10',
        name: 'Dr. Daniel Lee',
        specialization: 'Gastroenterologist',
        department: 'Gastroenterology',
        hospital: {
          id: '1',
          name: 'City General Hospital',
          department: 'Gastroenterology',
          address: '123 Main St, City',
          phone: '+1-555-0123'
        },
        experience: 13,
        rating: 4.7,
        available: true,
        consultationFee: 210,
        phone: '+1-555-0132',
        email: 'daniel.lee@hospital.com',
        acceptingNewPatients: true
      },
      {
        id: '11',
        name: 'Dr. Priya Nair',
        specialization: 'Ophthalmologist',
        department: 'Ophthalmology',
        hospital: {
          id: '1',
          name: 'City General Hospital',
          department: 'Ophthalmology',
          address: '123 Main St, City',
          phone: '+1-555-0123'
        },
        experience: 9,
        rating: 4.5,
        available: true,
        consultationFee: 150,
        phone: '+1-555-0133',
        email: 'priya.nair@hospital.com',
        acceptingNewPatients: true
      },
      {
        id: '12',
        name: 'Dr. Ethan Clark',
        specialization: 'ENT Specialist',
        department: 'ENT',
        hospital: {
          id: '1',
          name: 'City General Hospital',
          department: 'ENT',
          address: '123 Main St, City',
          phone: '+1-555-0123'
        },
        experience: 12,
        rating: 4.4,
        available: true,
        consultationFee: 160,
        phone: '+1-555-0134',
        email: 'ethan.clark@hospital.com',
        acceptingNewPatients: true
      }
    ];
  }
};

export default doctorService;
