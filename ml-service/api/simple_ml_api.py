"""
Minimal ML API - Works with just Flask (no pandas/numpy/scikit-learn needed)
This is a mock implementation for demonstration purposes
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import os
import random

app = Flask(__name__)
CORS(app)

# Mock symptom database
ALL_SYMPTOMS = [
    'Fever', 'Cough', 'Headache', 'Fatigue', 'Nausea', 'Chest Pain',
    'Shortness of Breath', 'Dizziness', 'Body Aches', 'Sore Throat',
    'Runny Nose', 'Sneezing', 'Chills', 'Loss of Taste', 'Loss of Smell',
    'Diarrhea', 'Vomiting', 'Rash', 'Joint Pain', 'Muscle Pain',
    'Abdominal Pain', 'Constipation', 'Blurred Vision', 'Ear Pain',
    'Heart Palpitations', 'Anxiety', 'Depression', 'Insomnia'
]

# Mock disease database with symptom mappings
DISEASE_DB = {
    'Common Cold': {
        'symptoms': ['Cough', 'Runny Nose', 'Sneezing', 'Sore Throat', 'Fatigue'],
        'severity': 'low',
        'description': 'A viral infection of the upper respiratory tract.',
        'doctorSpecialization': 'General Practitioner',
        'hospitalDepartment': 'Outpatient',
        'recommendations': ['Rest', 'Stay hydrated', 'Over-the-counter cold medicine', 'Salt water gargle']
    },
    'Influenza (Flu)': {
        'symptoms': ['Fever', 'Cough', 'Body Aches', 'Chills', 'Fatigue', 'Headache'],
        'severity': 'medium',
        'description': 'A contagious respiratory illness caused by influenza viruses.',
        'doctorSpecialization': 'General Practitioner',
        'hospitalDepartment': 'Outpatient',
        'recommendations': ['Rest', 'Stay hydrated', 'Antiviral medication if prescribed', 'Fever reducers']
    },
    'COVID-19': {
        'symptoms': ['Fever', 'Cough', 'Fatigue', 'Loss of Taste', 'Loss of Smell', 'Shortness of Breath'],
        'severity': 'high',
        'description': 'A respiratory illness caused by the SARS-CoV-2 virus.',
        'doctorSpecialization': 'Infectious Disease Specialist',
        'hospitalDepartment': 'Infectious Disease',
        'recommendations': ['Self-isolate', 'Monitor oxygen levels', 'Seek medical attention if breathing difficulty', 'Rest and hydration']
    },
    'Migraine': {
        'symptoms': ['Headache', 'Nausea', 'Blurred Vision', 'Dizziness'],
        'severity': 'medium',
        'description': 'A neurological condition causing severe headaches.',
        'doctorSpecialization': 'Neurologist',
        'hospitalDepartment': 'Neurology',
        'recommendations': ['Rest in dark room', 'Pain relievers', 'Avoid triggers', 'Stay hydrated']
    },
    'Gastroenteritis': {
        'symptoms': ['Nausea', 'Vomiting', 'Diarrhea', 'Abdominal Pain', 'Fever'],
        'severity': 'medium',
        'description': 'Inflammation of the stomach and intestines.',
        'doctorSpecialization': 'Gastroenterologist',
        'hospitalDepartment': 'Gastroenterology',
        'recommendations': ['Stay hydrated', 'BRAT diet', 'Rest', 'Electrolyte replacement']
    },
    'Hypertension': {
        'symptoms': ['Headache', 'Dizziness', 'Chest Pain', 'Heart Palpitations', 'Anxiety'],
        'severity': 'high',
        'description': 'High blood pressure condition.',
        'doctorSpecialization': 'Cardiologist',
        'hospitalDepartment': 'Cardiology',
        'recommendations': ['Regular blood pressure monitoring', 'Reduce salt intake', 'Exercise regularly', 'Take prescribed medications']
    },
    'Allergic Rhinitis': {
        'symptoms': ['Runny Nose', 'Sneezing', 'Sore Throat', 'Fatigue'],
        'severity': 'low',
        'description': 'An allergic response causing sneezing and runny nose.',
        'doctorSpecialization': 'ENT Specialist',
        'hospitalDepartment': 'ENT',
        'recommendations': ['Avoid allergens', 'Antihistamines', 'Nasal sprays', 'Air purifier']
    },
    'Pneumonia': {
        'symptoms': ['Fever', 'Cough', 'Chest Pain', 'Shortness of Breath', 'Fatigue', 'Chills'],
        'severity': 'high',
        'description': 'Infection that inflames air sacs in one or both lungs.',
        'doctorSpecialization': 'Pulmonologist',
        'hospitalDepartment': 'Pulmonology',
        'recommendations': ['Antibiotics if bacterial', 'Rest', 'Fever management', 'Seek immediate care if severe']
    },
    'Anxiety Disorder': {
        'symptoms': ['Anxiety', 'Insomnia', 'Heart Palpitations', 'Dizziness', 'Fatigue'],
        'severity': 'medium',
        'description': 'A mental health disorder causing excessive worry.',
        'doctorSpecialization': 'Psychiatrist',
        'hospitalDepartment': 'Psychiatry',
        'recommendations': ['Counseling', 'Stress management', 'Regular exercise', 'Mindfulness techniques']
    },
    'Dengue Fever': {
        'symptoms': ['Fever', 'Headache', 'Muscle Pain', 'Joint Pain', 'Rash', 'Fatigue'],
        'severity': 'high',
        'description': 'Mosquito-borne tropical disease.',
        'doctorSpecialization': 'Infectious Disease Specialist',
        'hospitalDepartment': 'Infectious Disease',
        'recommendations': ['Rest', 'Hydration', 'Pain relievers (avoid aspirin)', 'Monitor platelet count']
    }
}

def calculate_probability(user_symptoms, disease_symptoms):
    """Calculate match probability based on symptom overlap"""
    if not disease_symptoms:
        return 0.0
    
    matching = sum(1 for s in user_symptoms if s in disease_symptoms)
    total_unique = len(set(user_symptoms + disease_symptoms))
    
    if total_unique == 0:
        return 0.0
    
    base_prob = matching / len(disease_symptoms)
    # Add some randomness for realistic variation
    noise = random.uniform(-0.05, 0.05)
    return min(0.95, max(0.1, base_prob + noise))

def predict_diseases(symptoms):
    """Predict diseases based on symptoms"""
    predictions = []
    
    for disease_name, disease_info in DISEASE_DB.items():
        prob = calculate_probability(symptoms, disease_info['symptoms'])
        if prob > 0.2:  # Only include if probability > 20%
            predictions.append({
                'name': disease_name,
                'probability': round(prob, 3),
                'severity': disease_info['severity'],
                'description': disease_info['description'],
                'commonSymptoms': disease_info['symptoms'],
                'recommendations': disease_info['recommendations'],
                'doctorSpecialization': disease_info['doctorSpecialization'],
                'hospitalDepartment': disease_info['hospitalDepartment']
            })
    
    # Sort by probability descending
    predictions.sort(key=lambda x: x['probability'], reverse=True)
    
    # Return top 3 predictions (or all if less than 3)
    return predictions[:3]

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Disease Prediction ML Service (Simple)',
        'version': '1.0.0'
    })

@app.route('/predict', methods=['POST'])
def predict():
    """Predict diseases based on symptoms"""
    try:
        data = request.get_json()
        
        if not data or 'symptoms' not in data:
            return jsonify({
                'error': 'Missing symptoms in request'
            }), 400
        
        symptoms = data['symptoms']
        
        if not isinstance(symptoms, list):
            return jsonify({
                'error': 'Symptoms must be a list'
            }), 400
        
        # Get predictions
        predictions = predict_diseases(symptoms)
        
        # Prepare response
        response = {
            'symptoms': symptoms,
            'predictions': predictions,
            'timestamp': datetime.now().isoformat(),
            'total_predictions': len(predictions)
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({
            'error': f'Prediction failed: {str(e)}'
        }), 500

@app.route('/symptoms', methods=['GET'])
def get_symptoms():
    """Get list of all available symptoms"""
    return jsonify({
        'symptoms': ALL_SYMPTOMS,
        'total_count': len(ALL_SYMPTOMS)
    })

@app.route('/diseases', methods=['GET'])
def get_diseases():
    """Get list of all diseases"""
    return jsonify({
        'diseases': list(DISEASE_DB.keys()),
        'total_count': len(DISEASE_DB)
    })

@app.route('/model/info', methods=['GET'])
def model_info():
    """Get information about the prediction model"""
    return jsonify({
        'model_type': 'Rule-based Symptom Matching',
        'features': len(ALL_SYMPTOMS),
        'symptoms': ALL_SYMPTOMS,
        'classes': list(DISEASE_DB.keys()),
        'status': 'active'
    })

if __name__ == '__main__':
    print("="*60)
    print("Starting Disease Prediction ML Service (Simple)")
    print("="*60)
    print("No heavy dependencies needed (pandas/numpy/sklearn)")
    print("Running with pure Python + Flask")
    print("="*60)
    print("\nAvailable endpoints:")
    print("  GET  /health - Health check")
    print("  POST /predict - Predict diseases from symptoms")
    print("  GET  /symptoms - Get all available symptoms")
    print("  GET  /diseases - Get all diseases")
    print("  GET  /model/info - Get model information")
    print("\nService running on http://localhost:5000")
    print("="*60)
    
    debug_mode = os.getenv('ML_SERVICE_DEBUG', 'false').lower() == 'true'
    app.run(host='0.0.0.0', port=5000, debug=debug_mode, use_reloader=debug_mode)
