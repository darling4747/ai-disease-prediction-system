const baseDiseases = {
  'Common Cold': {
    specialization: 'General Practitioner',
    department: 'Outpatient',
    description: 'A viral infection of the nose and throat that usually resolves within 7-10 days.',
    commonSymptoms: ['Cough', 'Sore Throat', 'Runny Nose', 'Fatigue'],
    recommendations: ['Rest and stay hydrated', 'Use over-the-counter cold medications'],
    medicines: ['Acetaminophen', 'Ibuprofen', 'Saline nasal spray', 'Throat lozenges'],
    precautions: ['Avoid close contact', 'Wash hands frequently', 'Get adequate rest'],
    severity: 'low',
  },
  Flu: {
    specialization: 'General Practitioner',
    department: 'Outpatient',
    description: 'A contagious respiratory illness caused by influenza viruses.',
    commonSymptoms: ['Fever', 'Body Aches', 'Fatigue', 'Cough', 'Headache'],
    recommendations: ['Seek medical attention for proper diagnosis', 'Consider antiviral medications'],
    medicines: ['Oseltamivir (if prescribed)', 'Acetaminophen', 'Ibuprofen', 'Oral rehydration'],
    precautions: ['Stay home until fever-free', 'Cover coughs', 'Monitor breathing'],
    severity: 'medium',
  },
  'COVID-19': {
    specialization: 'Infectious Disease Specialist',
    department: 'Isolation Ward',
    description: 'A viral illness caused by SARS-CoV-2 that can affect the respiratory system.',
    commonSymptoms: ['Fever', 'Cough', 'Shortness of Breath', 'Fatigue'],
    recommendations: ['Get tested immediately', 'Isolate to prevent spread', 'Monitor oxygen levels'],
    medicines: ['Acetaminophen', 'Prescribed antivirals if eligible', 'Pulse oximeter monitoring'],
    precautions: ['Isolate immediately', 'Wear mask around others', 'Seek care if breathing worsens'],
    severity: 'high',
  },
  Migraine: {
    specialization: 'Neurologist',
    department: 'Neurology',
    description: 'A neurological condition characterized by intense headaches.',
    commonSymptoms: ['Headache', 'Nausea', 'Sensitivity to Light', 'Dizziness'],
    recommendations: ['Rest in a dark room', 'Take prescribed medications', 'Avoid triggers'],
    medicines: ['Sumatriptan (if prescribed)', 'Ibuprofen', 'Anti-nausea medication'],
    precautions: ['Avoid bright light', 'Limit screen time', 'Track triggers'],
    severity: 'medium',
  },
  Pneumonia: {
    specialization: 'Pulmonologist',
    department: 'Pulmonology',
    description: 'An infection that inflames air sacs in one or both lungs.',
    commonSymptoms: ['Cough', 'Fever', 'Shortness of Breath', 'Chest Pain'],
    recommendations: ['Seek immediate medical attention', 'Complete prescribed antibiotics'],
    medicines: ['Prescribed antibiotics', 'Acetaminophen', 'Bronchodilator if prescribed'],
    precautions: ['Complete full antibiotic course', 'Rest', 'Monitor oxygen saturation'],
    severity: 'high',
  },
  Bronchitis: {
    specialization: 'Pulmonologist',
    department: 'Pulmonology',
    description: 'Inflammation of the lining of bronchial tubes.',
    commonSymptoms: ['Cough', 'Fatigue', 'Shortness of Breath', 'Chest Discomfort'],
    recommendations: ['Rest and increase fluid intake', 'Avoid smoking', 'Use bronchodilators'],
    medicines: ['Cough suppressant (if advised)', 'Ibuprofen', 'Inhaled bronchodilator if prescribed'],
    precautions: ['Avoid smoke exposure', 'Use humidifier', 'Hydrate well'],
    severity: 'medium',
  },
  'Heart Attack': {
    specialization: 'Cardiologist',
    department: 'Cardiology/Emergency',
    description: 'A medical emergency where blood flow to the heart is blocked.',
    commonSymptoms: ['Chest Pain', 'Shortness of Breath', 'Nausea', 'Dizziness', 'Cold Sweat'],
    recommendations: ['Call emergency services immediately', 'Chew aspirin if available', 'Stay calm'],
    medicines: ['Aspirin (911 guidance only)', 'Emergency department medications'],
    precautions: ['Call 911 immediately', 'Do not drive yourself', 'Stay calm and seated'],
    severity: 'critical',
  },
  Gastroenteritis: {
    specialization: 'Gastroenterologist',
    department: 'Gastroenterology',
    description: 'Inflammation of the stomach and intestines causing vomiting and diarrhea.',
    commonSymptoms: ['Nausea', 'Vomiting', 'Diarrhea', 'Abdominal Pain'],
    recommendations: ['Stay hydrated', 'Eat bland foods', 'Rest'],
    medicines: ['Oral rehydration solution', 'Anti-nausea medication if prescribed'],
    precautions: ['Avoid dairy and fatty foods initially', 'Wash hands', 'Prevent dehydration'],
    severity: 'medium',
  },
  'Food Poisoning': {
    specialization: 'Gastroenterologist',
    department: 'Emergency',
    description: 'An illness caused by consuming contaminated food or water.',
    commonSymptoms: ['Nausea', 'Vomiting', 'Diarrhea', 'Abdominal Pain', 'Fever'],
    recommendations: ['Stay hydrated', 'Seek medical attention if severe', 'Rest'],
    medicines: ['Oral rehydration salts', 'Acetaminophen for fever'],
    precautions: ['Avoid solid food until vomiting stops', 'Seek care if blood in stool'],
    severity: 'medium',
  },
  Diabetes: {
    specialization: 'Endocrinologist',
    department: 'Endocrinology',
    description: 'A chronic condition affecting how the body processes blood sugar.',
    commonSymptoms: ['Frequent Urination', 'Increased Thirst', 'Fatigue', 'Blurred Vision'],
    recommendations: ['Monitor blood sugar', 'Follow diet plan', 'Take medications'],
    medicines: ['Metformin (if prescribed)', 'Insulin (if prescribed)', 'Glucose monitoring supplies'],
    precautions: ['Monitor glucose regularly', 'Follow meal plan', 'Foot care daily'],
    severity: 'high',
  },
  Hypertension: {
    specialization: 'Cardiologist',
    department: 'Cardiology',
    description: 'High blood pressure that can lead to severe health complications.',
    commonSymptoms: ['Headache', 'Shortness of Breath', 'Chest Pain', 'Dizziness'],
    recommendations: ['Monitor blood pressure', 'Reduce salt intake', 'Exercise regularly'],
    medicines: ['Prescribed antihypertensives', 'Low-dose aspirin if advised by doctor'],
    precautions: ['Reduce sodium', 'Regular BP checks', 'Limit alcohol'],
    severity: 'high',
  },
  Influenza: {
    specialization: 'General Practitioner',
    department: 'Outpatient',
    description: 'A viral infection that attacks your respiratory system.',
    commonSymptoms: ['Fever', 'Body Aches', 'Fatigue', 'Cough', 'Headache'],
    recommendations: ['Rest and increase fluid intake', 'Consider antiviral medications'],
    medicines: ['Acetaminophen', 'Ibuprofen', 'Antiviral if prescribed early'],
    precautions: ['Stay home', 'Hydrate', 'Avoid spreading to others'],
    severity: 'medium',
  },
};

export const diseaseMap = baseDiseases;

export const getDiseaseInfo = (disease) => diseaseMap[disease] || null;

export const getAllDiseases = () => Object.keys(diseaseMap);

export const getSpecialization = (disease) =>
  diseaseMap[disease]?.specialization || 'General Practitioner';

export const getDepartment = (disease) =>
  diseaseMap[disease]?.department || 'General Medicine';

export const getMedicinesForDisease = (disease) =>
  diseaseMap[disease]?.medicines || [];

export const getPrecautionsForDisease = (disease) =>
  diseaseMap[disease]?.precautions || diseaseMap[disease]?.recommendations || [];

export default diseaseMap;
