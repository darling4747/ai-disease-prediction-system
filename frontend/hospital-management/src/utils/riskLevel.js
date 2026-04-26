export const getRiskLevel = (disease) => {
  const highRiskDiseases = [
    'Heart Attack',
    'COVID-19',
    'Pneumonia',
    'Stroke',
    'Cancer',
    'Diabetes',
    'Hypertension'
  ];

  const mediumRiskDiseases = [
    'Flu',
    'Food Poisoning',
    'Gastroenteritis',
    'Bronchitis',
    'Migraine',
    'Asthma'
  ];

  const criticalRiskDiseases = [
    'Heart Attack',
    'Stroke',
    'Cancer'
  ];

  const normalizedDisease = disease.toLowerCase().trim();

  if (criticalRiskDiseases.some(d => d.toLowerCase() === normalizedDisease)) {
    return 'critical';
  }

  if (highRiskDiseases.some(d => d.toLowerCase() === normalizedDisease)) {
    return 'high';
  }

  if (mediumRiskDiseases.some(d => d.toLowerCase() === normalizedDisease)) {
    return 'medium';
  }

  return 'low';
};

export const getRiskColor = (riskLevel) => {
  switch (riskLevel) {
    case 'critical':
      return '#d32f2f';
    case 'high':
      return '#f57c00';
    case 'medium':
      return '#fbc02d';
    case 'low':
      return '#388e3c';
    default:
      return '#757575';
  }
};

export const getRiskLabel = (riskLevel) => {
  switch (riskLevel) {
    case 'critical':
      return 'Critical - Immediate Attention Required';
    case 'high':
      return 'High - Seek Medical Attention';
    case 'medium':
      return 'Medium - Monitor Closely';
    case 'low':
      return 'Low - Self Care Recommended';
    default:
      return 'Unknown Risk Level';
  }
};

export const getRiskSeverity = (probability) => {
  if (probability >= 0.9) {
    return 'critical';
  } else if (probability >= 0.7) {
    return 'high';
  } else if (probability >= 0.4) {
    return 'medium';
  } else {
    return 'low';
  }
};

export const getRecommendationByRisk = (riskLevel) => {
  switch (riskLevel) {
    case 'critical':
      return [
        'Seek immediate emergency care',
        'Call emergency services (911)',
        'Do not drive yourself',
        'Have someone stay with you'
      ];
    case 'high':
      return [
        'Schedule a doctor appointment within 24 hours',
        'Monitor symptoms closely',
        'Have a family member check on you',
        'Keep emergency contacts ready'
      ];
    case 'medium':
      return [
        'Schedule a doctor appointment within 3-5 days',
        'Rest and stay hydrated',
        'Monitor symptoms',
        'Consider over-the-counter medications'
      ];
    case 'low':
      return [
        'Rest and recover at home',
        'Stay hydrated',
        'Monitor symptoms for changes',
        'Consult doctor if symptoms persist'
      ];
    default:
      return ['Consult with a healthcare provider'];
  }
};

export default getRiskLevel;
