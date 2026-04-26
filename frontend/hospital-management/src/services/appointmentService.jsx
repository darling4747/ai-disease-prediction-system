import api from './api';
import authService from './authService';

const appointmentService = {
  // Book an appointment
  bookAppointment: async (appointmentData) => {
    try {
      const token = authService.getToken();
      const response = await api.post('/appointments/book', appointmentData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to book appointment' };
    }
  },

  // Get patient's appointments
  getMyAppointments: async () => {
    try {
      const token = authService.getToken();
      const response = await api.get('/appointments/my-appointments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch appointments' };
    }
  },

  // Cancel appointment
  cancelAppointment: async (id) => {
    try {
      const token = authService.getToken();
      const response = await api.put(`/appointments/cancel/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to cancel appointment' };
    }
  },

  // Get available time slots
  getAvailableSlots: async (doctorId, date) => {
    try {
      const response = await api.get('/appointments/available-slots', {
        params: { doctorId, date }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch available slots' };
    }
  },

  // Get all appointments (admin only)
  getAllAppointments: async () => {
    try {
      const token = authService.getToken();
      const response = await api.get('/appointments/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch all appointments' };
    }
  },

  // Update appointment status (admin only)
  updateAppointmentStatus: async (id, status) => {
    try {
      const token = authService.getToken();
      const response = await api.put(`/appointments/status/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update status' };
    }
  }
};

export default appointmentService;
