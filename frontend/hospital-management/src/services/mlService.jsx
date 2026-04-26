import { mlApi } from './api';

export const mlService = {
  // Get available symptoms
  async getSymptoms() {
    try {
      const response = await mlApi.get('/symptoms');
      return response.data.symptoms || [];
    } catch (error) {
      console.error('Error fetching symptoms:', error);
      return [
        'Fever', 'Cough', 'Headache', 'Fatigue', 'Nausea', 'Vomiting',
        'Diarrhea', 'Chest Pain', 'Shortness of Breath', 'Dizziness',
        'Body Aches', 'Sore Throat', 'Loss of Appetite', 'Weight Loss',
        'Abdominal Pain', 'Back Pain', 'Joint Pain', 'Skin Rash'
      ];
    }
  },

  // Get available diseases
  async getDiseases() {
    try {
      const response = await mlApi.get('/diseases');
      return response.data.diseases || [];
    } catch (error) {
      console.error('Error fetching diseases:', error);
      return [];
    }
  },

  // Predict diseases based on symptoms
  async predictDiseases(symptoms) {
    try {
      const response = await mlApi.post('/predict', { symptoms });
      return response.data;
    } catch (error) {
      console.error('Error predicting diseases:', error);
      return this.getMockPrediction(symptoms);
    }
  },

  // Get model information
  async getModelInfo() {
    try {
      const response = await mlApi.get('/model/info');
      return response.data;
    } catch (error) {
      console.error('Error fetching model info:', error);
      return null;
    }
  },

  // Health check
  async healthCheck() {
    try {
      const response = await mlApi.get('/health');
      return response.data;
    } catch (error) {
      console.error('ML service health check failed:', error);
      return { status: 'error', message: 'ML service not available' };
    }
  },

  // Mock prediction for fallback
  getMockPrediction(symptoms) {
    const mockDiseases = [
      {
        name: 'Common Cold',
        probability: 0.85,
        severity: 'low',
        description: 'A viral infection of nose and throat that usually resolves within 7-10 days.',
        commonSymptoms: ['Cough', 'Sore Throat', 'Runny Nose', 'Fatigue'],
        recommendations: ['Rest and stay hydrated', 'Use over-the-counter cold medications'],
        doctorSpecialization: 'General Practitioner',
        hospitalDepartment: 'Outpatient'
      },
      {
        name: 'Flu',
        probability: 0.72,
        severity: 'medium',
        description: 'A contagious respiratory illness caused by influenza viruses.',
        commonSymptoms: ['Fever', 'Body Aches', 'Fatigue', 'Cough', 'Headache'],
        recommendations: ['Seek medical attention for proper diagnosis', 'Consider antiviral medications'],
        doctorSpecialization: 'General Practitioner',
        hospitalDepartment: 'Outpatient'
      }
    ];
    
    return {
      symptoms: symptoms,
      predictions: mockDiseases,
      timestamp: new Date().toISOString(),
      total_predictions: mockDiseases.length
    };
  }
};

export default mlService;
