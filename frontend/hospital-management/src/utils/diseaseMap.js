export const diseaseMap = {
  "Common Cold": {
    specialization: "General Practitioner",
    department: "Outpatient",
    description: "A viral infection of the nose and throat that usually resolves within 7-10 days.",
    commonSymptoms: ["Cough", "Sore Throat", "Runny Nose", "Fatigue"],
    recommendations: ["Rest and stay hydrated", "Use over-the-counter cold medications"],
    severity: "low"
  },
  "Flu": {
    specialization: "General Practitioner",
    department: "Outpatient",
    description: "A contagious respiratory illness caused by influenza viruses.",
    commonSymptoms: ["Fever", "Body Aches", "Fatigue", "Cough", "Headache"],
    recommendations: ["Seek medical attention for proper diagnosis", "Consider antiviral medications"],
    severity: "medium"
  },
  "COVID-19": {
    specialization: "Infectious Disease Specialist",
    department: "Isolation Ward",
    description: "A viral illness caused by SARS-CoV-2 that can affect the respiratory system.",
    commonSymptoms: ["Fever", "Cough", "Shortness of Breath", "Fatigue"],
    recommendations: ["Get tested immediately", "Isolate to prevent spread", "Monitor oxygen levels"],
    severity: "high"
  },
  "Migraine": {
    specialization: "Neurologist",
    department: "Neurology",
    description: "A neurological condition characterized by intense headaches.",
    commonSymptoms: ["Headache", "Nausea", "Sensitivity to Light", "Dizziness"],
    recommendations: ["Rest in a dark room", "Take prescribed medications", "Avoid triggers"],
    severity: "medium"
  },
  "Pneumonia": {
    specialization: "Pulmonologist",
    department: "Pulmonology",
    description: "An infection that inflames air sacs in one or both lungs.",
    commonSymptoms: ["Cough", "Fever", "Shortness of Breath", "Chest Pain"],
    recommendations: ["Seek immediate medical attention", "Complete prescribed antibiotics"],
    severity: "high"
  },
  "Bronchitis": {
    specialization: "Pulmonologist",
    department: "Pulmonology",
    description: "Inflammation of the lining of bronchial tubes.",
    commonSymptoms: ["Cough", "Fatigue", "Shortness of Breath", "Chest Discomfort"],
    recommendations: ["Rest and increase fluid intake", "Avoid smoking", "Use bronchodilators"],
    severity: "medium"
  },
  "Heart Attack": {
    specialization: "Cardiologist",
    department: "Cardiology",
    description: "A medical emergency where blood flow to the heart is blocked.",
    commonSymptoms: ["Chest Pain", "Shortness of Breath", "Nausea", "Dizziness", "Cold Sweat"],
    recommendations: ["Call emergency services immediately", "Chew aspirin if available", "Stay calm"],
    severity: "high"
  },
  "Gastroenteritis": {
    specialization: "Gastroenterologist",
    department: "Gastroenterology",
    description: "Inflammation of the stomach and intestines causing vomiting and diarrhea.",
    commonSymptoms: ["Nausea", "Vomiting", "Diarrhea", "Abdominal Pain"],
    recommendations: ["Stay hydrated", "Eat bland foods", "Rest"],
    severity: "medium"
  },
  "Food Poisoning": {
    specialization: "Gastroenterologist",
    department: "Emergency",
    description: "An illness caused by consuming contaminated food or water.",
    commonSymptoms: ["Nausea", "Vomiting", "Diarrhea", "Abdominal Pain", "Fever"],
    recommendations: ["Stay hydrated", "Seek medical attention if severe", "Rest"],
    severity: "medium"
  },
  "Diabetes": {
    specialization: "Endocrinologist",
    department: "Endocrinology",
    description: "A chronic condition affecting how the body processes blood sugar.",
    commonSymptoms: ["Frequent Urination", "Increased Thirst", "Fatigue", "Blurred Vision"],
    recommendations: ["Monitor blood sugar", "Follow diet plan", "Take medications"],
    severity: "high"
  },
  "Hypertension": {
    specialization: "Cardiologist",
    department: "Cardiology",
    description: "High blood pressure that can lead to severe health complications.",
    commonSymptoms: ["Headache", "Shortness of Breath", "Chest Pain", "Dizziness"],
    recommendations: ["Monitor blood pressure", "Reduce salt intake", "Exercise regularly"],
    severity: "high"
  }
};

export const getDiseaseInfo = (disease) => {
  return diseaseMap[disease] || null;
};

export const getAllDiseases = () => {
  return Object.keys(diseaseMap);
};

export const getSpecialization = (disease) => {
  return diseaseMap[disease]?.specialization || "General Practitioner";
};

export const getDepartment = (disease) => {
  return diseaseMap[disease]?.department || "General Medicine";
};

export default diseaseMap;
