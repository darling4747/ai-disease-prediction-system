import api from './api';
import authService from './authService';

const adminService = {
  // Doctor Management
  addDoctor: async (doctorData) => {
    try {
      const token = authService.getToken();
      const response = await api.post('/api/admin/doctors', doctorData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add doctor' };
    }
  },

  updateDoctor: async (id, doctorData) => {
    try {
      const token = authService.getToken();
      const response = await api.put(`/api/admin/doctors/${id}`, doctorData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update doctor' };
    }
  },

  deleteDoctor: async (id) => {
    try {
      const token = authService.getToken();
      const response = await api.delete(`/api/admin/doctors/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete doctor' };
    }
  },

  // Hospital Management
  addHospital: async (hospitalData) => {
    try {
      const token = authService.getToken();
      const response = await api.post('/api/admin/hospitals', hospitalData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add hospital' };
    }
  },

  updateHospital: async (id, hospitalData) => {
    try {
      const token = authService.getToken();
      const response = await api.put(`/api/admin/hospitals/${id}`, hospitalData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update hospital' };
    }
  },

  deleteHospital: async (id) => {
    try {
      const token = authService.getToken();
      const response = await api.delete(`/api/admin/hospitals/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete hospital' };
    }
  },

  // Stats
  getStats: async () => {
    try {
      const token = authService.getToken();
      const response = await api.get('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch stats' };
    }
  },

  // Check if current user is admin
  isAdmin: () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role === 'ADMIN';
  }
};

export default adminService;
