from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
from typing import List
import re

app = FastAPI(title="Disease Prediction API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model
try:
    model = joblib.load('../model/disease_model.pkl')
    print("Model loaded successfully")
except FileNotFoundError:
    print("Model not found. Using fallback predictions")
    model = None

class PredictionRequest(BaseModel):
    symptoms: str

class PredictionResponse(BaseModel):
    disease: str
    confidence: float

# Disease mapping for common symptoms
disease_symptoms = {
    'Flu': ['fever', 'cough', 'fatigue', 'headache', 'body ache', 'sore throat'],
    'COVID-19': ['fever', 'cough', 'shortness of breath', 'fatigue', 'loss of taste', 'loss of smell'],
    'Cold': ['runny nose', 'sneezing', 'sore throat', 'cough', 'congestion'],
    'Allergy': ['sneezing', 'itchy eyes', 'runny nose', 'rash', 'hives'],
    'Migraine': ['headache', 'nausea', 'vomiting', 'sensitivity to light', 'sensitivity to sound'],
    'Food Poisoning': ['nausea', 'vomiting', 'diarrhea', 'stomach cramps', 'fever'],
    'Stomach Flu': ['nausea', 'vomiting', 'diarrhea', 'stomach cramps', 'fatigue'],
    'Bronchitis': ['cough', 'shortness of breath', 'chest discomfort', 'fatigue', 'mucus'],
    'Pneumonia': ['fever', 'cough', 'shortness of breath', 'chest pain', 'fatigue'],
    'Sinusitis': ['headache', 'facial pain', 'nasal congestion', 'thick nasal discharge'],
    'Ear Infection': ['ear pain', 'difficulty hearing', 'fever', 'ear drainage'],
    'Conjunctivitis': ['red eyes', 'eye discharge', 'itchy eyes', 'tearing'],
    'UTI': ['painful urination', 'frequent urination', 'back pain', 'fever'],
    'Kidney Stones': ['severe back pain', 'painful urination', 'blood in urine', 'nausea'],
    'Arthritis': ['joint pain', 'stiffness', 'swelling', 'reduced range of motion'],
    'Diabetes': ['increased thirst', 'frequent urination', 'extreme hunger', 'unexplained weight loss'],
    'Hypertension': ['headache', 'shortness of breath', 'nosebleeds', 'chest pain'],
    'Anemia': ['fatigue', 'weakness', 'pale skin', 'shortness of breath', 'dizziness'],
    'Depression': ['persistent sadness', 'loss of interest', 'sleep changes', 'appetite changes'],
    'Anxiety': ['excessive worry', 'restlessness', 'fatigue', 'difficulty concentrating'],
    'Insomnia': ['difficulty falling asleep', 'waking up frequently', 'daytime fatigue'],
    'Gastroenteritis': ['nausea', 'vomiting', 'diarrhea', 'stomach cramps', 'fever'],
    'Hepatitis': ['fatigue', 'nausea', 'abdominal pain', 'dark urine', 'yellow skin'],
    'Gallstones': ['abdominal pain', 'nausea', 'vomiting', 'fever', 'yellow skin'],
    'Appendicitis': ['abdominal pain', 'nausea', 'vomiting', 'fever', 'loss of appetite'],
    'Diverticulitis': ['abdominal pain', 'fever', 'nausea', 'change in bowel habits'],
    'Irritable Bowel Syndrome': ['abdominal pain', 'bloating', 'gas', 'diarrhea', 'constipation'],
    'Eczema': ['itchy skin', 'dry skin', 'red patches', 'thickened skin'],
    'Psoriasis': ['red patches', 'silvery scales', 'dry skin', 'itching', 'burning'],
    'Acne': ['pimples', 'blackheads', 'whiteheads', 'oily skin', 'red skin'],
    'Rosacea': ['facial redness', 'visible blood vessels', 'bumps', 'eye irritation'],
    'Shingles': ['painful rash', 'blisters', 'burning', 'numbness', 'itching'],
    'Chickenpox': ['itchy rash', 'blisters', 'fever', 'headache', 'fatigue'],
    'Measles': ['fever', 'cough', 'runny nose', 'rash', 'red eyes'],
    'Mumps': ['swollen salivary glands', 'fever', 'headache', 'muscle aches', 'fatigue'],
    'Rubella': ['rash', 'fever', 'headache', 'red eyes', 'joint pain'],
    'Whooping Cough': ['severe coughing', 'whooping sound', 'vomiting', 'exhaustion'],
    'Diphtheria': ['sore throat', 'fever', 'swollen glands', 'difficulty breathing'],
    'Tetanus': ['muscle stiffness', 'spasms', 'jaw cramping', 'difficulty swallowing'],
    'Polio': ['fever', 'headache', 'muscle weakness', 'paralysis'],
    'Rabies': ['fever', 'headache', 'excess salivation', 'muscle spasms', 'paralysis'],
    'Malaria': ['fever', 'chills', 'headache', 'nausea', 'vomiting', 'diarrhea'],
    'Dengue': ['high fever', 'severe headache', 'pain behind eyes', 'joint pain', 'rash'],
    'Zika': ['fever', 'rash', 'joint pain', 'red eyes', 'headache'],
    'Ebola': ['fever', 'headache', 'muscle pain', 'vomiting', 'diarrhea', 'bleeding'],
    'Tuberculosis': ['persistent cough', 'weight loss', 'fever', 'night sweats', 'fatigue'],
    'HIV/AIDS': ['fever', 'fatigue', 'swollen lymph nodes', 'weight loss', 'opportunistic infections'],
    'Hepatitis A': ['fatigue', 'nausea', 'abdominal pain', 'loss of appetite', 'yellow skin'],
    'Hepatitis B': ['fatigue', 'nausea', 'abdominal pain', 'dark urine', 'yellow skin'],
    'Hepatitis C': ['fatigue', 'nausea', 'abdominal pain', 'dark urine', 'yellow skin'],
    'Herpes': ['painful blisters', 'burning', 'itching', 'fever', 'body aches'],
    'HPV': ['genital warts', 'cervical cancer', 'other cancers'],
    'Syphilis': ['sores', 'rash', 'fever', 'swollen lymph nodes', 'organ damage'],
    'Gonorrhea': ['burning urination', 'discharge', 'painful intercourse', 'testicular pain'],
    'Chlamydia': ['burning urination', 'discharge', 'painful intercourse', 'testicular pain'],
    'Trichomoniasis': ['vaginal discharge', 'vaginal odor', 'vaginal itching', 'painful urination'],
    'Bacterial Vaginosis': ['vaginal discharge', 'vaginal odor', 'vaginal itching'],
    'Yeast Infection': ['vaginal itching', 'vaginal discharge', 'vaginal odor', 'painful urination'],
    'Endometriosis': ['pelvic pain', 'painful periods', 'painful intercourse', 'excessive bleeding'],
    'PCOS': ['irregular periods', 'excess hair growth', 'acne', 'obesity', 'infertility'],
    'Fibroids': ['heavy bleeding', 'pelvic pain', 'frequent urination', 'constipation'],
    'Ovarian Cysts': ['pelvic pain', 'bloating', 'painful intercourse', 'irregular periods'],
    'Ectopic Pregnancy': ['abdominal pain', 'vaginal bleeding', 'shoulder pain', 'dizziness'],
    'Miscarriage': ['vaginal bleeding', 'abdominal cramping', 'back pain', 'loss of pregnancy symptoms'],
    'Preterm Labor': ['contractions', 'back pain', 'pelvic pressure', 'vaginal discharge'],
    'Preeclampsia': ['high blood pressure', 'protein in urine', 'swelling', 'headache', 'vision changes'],
    'Gestational Diabetes': ['increased thirst', 'frequent urination', 'fatigue', 'blurred vision'],
    'Placenta Previa': ['painless vaginal bleeding', 'preterm labor', 'hemorrhage'],
    'Placental Abruption': ['vaginal bleeding', 'abdominal pain', 'back pain', 'uterine tenderness'],
    'Stillbirth': ['no fetal movement', 'no heartbeat', 'uterine size smaller than expected'],
    'Neonatal Sepsis': ['fever', 'lethargy', 'poor feeding', 'breathing difficulties', 'seizures'],
    'Neonatal Jaundice': ['yellow skin', 'yellow eyes', 'dark urine', 'pale stools'],
    'Neonatal Hypoglycemia': ['lethargy', 'poor feeding', 'seizures', 'coma'],
    'Neonatal Respiratory Distress': ['rapid breathing', 'grunting', 'nasal flaring', 'chest retractions'],
    'Neonatal Meningitis': ['fever', 'lethargy', 'poor feeding', 'seizures', 'bulging fontanelle'],
    'Neonatal Pneumonia': ['fever', 'cough', 'rapid breathing', 'grunting', 'chest retractions'],
    'Neonatal Sepsis': ['fever', 'lethargy', 'poor feeding', 'breathing difficulties', 'seizures'],
    'Neonatal Jaundice': ['yellow skin', 'yellow eyes', 'dark urine', 'pale stools'],
    'Neonatal Hypoglycemia': ['lethargy', 'poor feeding', 'seizures', 'coma'],
    'Neonatal Respiratory Distress': ['rapid breathing', 'grunting', 'nasal flaring', 'chest retractions'],
    'Neonatal Meningitis': ['fever', 'lethargy', 'poor feeding', 'seizures', 'bulging fontanelle'],
    'Neonatal Pneumonia': ['fever', 'cough', 'rapid breathing', 'grunting', 'chest retractions']
}

def preprocess_symptoms(symptoms: str) -> List[str]:
    """Clean and preprocess symptoms text"""
    # Convert to lowercase and remove special characters
    cleaned = re.sub(r'[^a-zA-Z\s]', '', symptoms.lower())
    # Split into individual symptoms
    symptom_list = [s.strip() for s in cleaned.split(',') if s.strip()]
    return symptom_list

def calculate_disease_probability(symptoms: List[str], disease_symptoms_list: List[str]) -> float:
    """Calculate probability of disease based on symptom matching"""
    if not symptoms:
        return 0.0
    
    matching_symptoms = 0
    total_disease_symptoms = len(disease_symptoms_list)
    
    for symptom in symptoms:
        for disease_symptom in disease_symptoms_list:
            if symptom in disease_symptom or disease_symptom in symptom:
                matching_symptoms += 1
                break
    
    # Calculate probability based on matching symptoms
    if total_disease_symptoms == 0:
        return 0.0
    
    probability = (matching_symptoms / total_disease_symptoms) * 100
    return min(probability, 95.0)  # Cap at 95% for safety

def predict_disease(symptoms: str) -> tuple:
    """Predict disease based on symptoms"""
    symptom_list = preprocess_symptoms(symptoms)
    
    if not symptom_list:
        return "Unknown", 0.0
    
    # Calculate probabilities for each disease
    disease_probabilities = {}
    for disease, disease_symptoms_list in disease_symptoms.items():
        probability = calculate_disease_probability(symptom_list, disease_symptoms_list)
        disease_probabilities[disease] = probability
    
    # Find the disease with highest probability
    if disease_probabilities:
        predicted_disease = max(disease_probabilities, key=disease_probabilities.get)
        confidence = disease_probabilities[predicted_disease]
        
        # If confidence is too low, return "Unknown"
        if confidence < 20.0:
            return "Unknown", confidence
        
        return predicted_disease, confidence
    else:
        return "Unknown", 0.0

@app.get("/")
async def root():
    return {"message": "Disease Prediction API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": model is not None}

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    try:
        # Use the trained model if available, otherwise use rule-based prediction
        if model is not None:
            # For now, we'll use the rule-based approach
            # In a real implementation, you would use the loaded model here
            disease, confidence = predict_disease(request.symptoms)
        else:
            disease, confidence = predict_disease(request.symptoms)
        
        return PredictionResponse(
            disease=disease,
            confidence=confidence
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/predict/symptoms")
async def predict_from_symptoms(symptoms: str):
    """Alternative endpoint for simple symptom string"""
    try:
        disease, confidence = predict_disease(symptoms)
        return {
            "disease": disease,
            "confidence": confidence
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
