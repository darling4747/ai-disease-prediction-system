import { api, mlApi } from './api';

const predictionService = {
  // Get all available symptoms from ML service
  getSymptoms: async () => {
    try {
      const response = await mlApi.get('/symptoms');
      return response.data.symptoms || [];
    } catch (error) {
      console.error('Error fetching symptoms:', error);
      // Return default symptoms as fallback
      return [
        'Fever', 'Cough', 'Headache', 'Fatigue', 'Nausea', 
        'Chest Pain', 'Shortness of Breath', 'Dizziness', 
        'Body Aches', 'Sore Throat', 'Runny Nose', 'Chills'
      ];
    }
  },

  // Predict disease based on symptoms
  predictDisease: async (symptoms) => {
    try {
      const response = await mlApi.post('/predict', { symptoms });
      return response.data;
    } catch (error) {
      console.error('Prediction error:', error);
      throw error;
    }
  },

  // Get all diseases
  getDiseases: async () => {
    try {
      const response = await mlApi.get('/diseases');
      return response.data.diseases || [];
    } catch (error) {
      console.error('Error fetching diseases:', error);
      return [];
    }
  },

  // Get ML service health
  getMLHealth: async () => {
    try {
      const response = await mlApi.get('/health');
      return response.data;
    } catch (error) {
      console.error('ML service health check failed:', error);
      return { status: 'unavailable' };
    }
  },

  // Get backend health
  getBackendHealth: async () => {
    try {
      const response = await api.get('/actuator/health');
      return response.data;
    } catch (error) {
      console.error('Backend health check failed:', error);
      return { status: 'DOWN' };
    }
  },

  // Save prediction to backend
  savePrediction: async (predictionData) => {
    try {
      const response = await api.post('/api/predictions', predictionData);
      return response.data;
    } catch (error) {
      console.error('Error saving prediction:', error);
      throw error;
    }
  },

  // Get prediction history from backend
  getPredictionHistory: async (userId = 'user123') => {
    try {
      const response = await api.get(`/api/predictions/user/${userId}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching prediction history:', error);
      return [];
    }
  }
};

export default predictionService;
