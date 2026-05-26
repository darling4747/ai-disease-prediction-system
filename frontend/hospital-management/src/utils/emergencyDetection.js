const CRITICAL_SYMPTOM_COMBOS = [
  ['chest pain', 'shortness of breath'],
  ['chest pain', 'dizziness'],
  ['severe headache', 'dizziness'],
  ['chest pain', 'nausea'],
];

const CRITICAL_SYMPTOMS = [
  'chest pain',
  'shortness of breath',
  'severe headache',
  'loss of consciousness',
  'difficulty breathing',
  'paralysis',
];

const normalize = (value) => String(value || '').toLowerCase().trim();

export const detectSymptomEmergency = (symptoms = []) => {
  const normalized = symptoms.map(normalize);

  const hasCriticalSymptom = normalized.some((symptom) =>
    CRITICAL_SYMPTOMS.some((critical) => symptom.includes(critical))
  );

  const hasCriticalCombo = CRITICAL_SYMPTOM_COMBOS.some((combo) =>
    combo.every((part) => normalized.some((symptom) => symptom.includes(part)))
  );

  if (hasCriticalCombo || (hasCriticalSymptom && normalized.length >= 2)) {
    return {
      level: 'critical',
      title: 'Emergency Alert — Critical Symptoms Detected',
      message:
        'Your symptom pattern may indicate a medical emergency. Call emergency services (911) or go to the nearest emergency department immediately.',
      actions: [
        'Call emergency services now',
        'Do not drive yourself',
        'Stay with someone if possible',
      ],
    };
  }

  if (hasCriticalSymptom) {
    return {
      level: 'high',
      title: 'Urgent Care Recommended',
      message:
        'One or more serious symptoms were detected. Seek urgent medical evaluation today.',
      actions: [
        'Visit emergency or urgent care',
        'Contact your doctor immediately',
        'Monitor symptoms closely',
      ],
    };
  }

  return null;
};

export default detectSymptomEmergency;
