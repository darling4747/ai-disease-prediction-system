import { api } from './api';

const predictionService = {
  getSymptoms: async () => {
    try {
      const response = await api.get('/api/ml/symptoms');
      return response.data.symptoms || [];
    } catch (error) {
      console.error('Error fetching symptoms:', error);
      return [
        'Fever', 'Cough', 'Headache', 'Fatigue', 'Nausea',
        'Chest Pain', 'Shortness of Breath', 'Dizziness',
        'Body Aches', 'Sore Throat', 'Runny Nose', 'Chills',
      ];
    }
  },

  predictDisease: async (symptoms) => {
    const response = await api.post('/api/ml/predict', { symptoms });
    return response.data;
  },

  getDiseases: async () => {
    try {
      const response = await api.get('/api/ml/diseases');
      return response.data.diseases || [];
    } catch (error) {
      return [];
    }
  },

  getMLHealth: async () => {
    try {
      const response = await api.get('/api/ml/health');
      return response.data;
    } catch (error) {
      return { status: 'unavailable' };
    }
  },

  getBackendHealth: async () => {
    try {
      const response = await api.get('/actuator/health');
      return response.data;
    } catch (error) {
      return { status: 'DOWN' };
    }
  },

  savePrediction: async (predictionData) => {
    const response = await api.post('/api/predictions', predictionData);
    return response.data;
  },

  getPredictionHistory: async (userId) => {
    try {
      const response = await api.get(`/api/predictions/user/${userId}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching prediction history:', error);
      return [];
    }
  },

  getAllPredictions: async () => {
    try {
      const response = await api.get('/api/predictions');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching prediction cases:', error);
      return [];
    }
  },

  getPredictionById: async (id) => {
    const response = await api.get(`/api/predictions/${id}`);
    return response.data;
  },

  addMedicalAdvice: async (id, advice) => {
    const response = await api.put(`/api/predictions/${id}/advice`, { advice });
    return response.data;
  },

  getUserAnalytics: async (userId) => {
    try {
      const response = await api.get(`/api/predictions/user/${userId}/analytics`);
      return response.data || {};
    } catch (error) {
      return {};
    }
  },

  getSystemAnalytics: async () => {
    try {
      const response = await api.get('/api/predictions/analytics');
      return response.data || {};
    } catch (error) {
      return null;
    }
  },
};

export default predictionService;
