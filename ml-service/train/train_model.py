import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib
import re
from typing import List, Dict
import json

class DiseasePredictor:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.disease_symptoms = {}
        
    def load_data(self, csv_path: str):
        """Load training data from CSV file"""
        try:
            df = pd.read_csv(csv_path)
            print(f"Loaded {len(df)} records from {csv_path}")
            return df
        except FileNotFoundError:
            print(f"CSV file not found: {csv_path}")
            return self.create_sample_data()
    
    def create_sample_data(self):
        """Create sample training data if CSV not available"""
        print("Creating sample training data...")
        
        # Sample disease-symptom data
        sample_data = [
            # Flu
            {"symptoms": "fever, cough, fatigue, headache, body ache, sore throat", "disease": "Flu"},
            {"symptoms": "fever, cough, body ache, fatigue, headache", "disease": "Flu"},
            {"symptoms": "cough, sore throat, fatigue, headache, fever", "disease": "Flu"},
            
            # COVID-19
            {"symptoms": "fever, cough, shortness of breath, fatigue, loss of taste", "disease": "COVID-19"},
            {"symptoms": "fever, cough, fatigue, loss of smell, shortness of breath", "disease": "COVID-19"},
            {"symptoms": "cough, fever, fatigue, loss of taste, loss of smell", "disease": "COVID-19"},
            
            # Cold
            {"symptoms": "runny nose, sneezing, sore throat, cough, congestion", "disease": "Cold"},
            {"symptoms": "sneezing, runny nose, sore throat, mild cough", "disease": "Cold"},
            {"symptoms": "congestion, runny nose, sneezing, sore throat", "disease": "Cold"},
            
            # Allergy
            {"symptoms": "sneezing, itchy eyes, runny nose, rash, hives", "disease": "Allergy"},
            {"symptoms": "itchy eyes, sneezing, runny nose, skin rash", "disease": "Allergy"},
            {"symptoms": "rash, hives, itchy eyes, sneezing", "disease": "Allergy"},
            
            # Migraine
            {"symptoms": "headache, nausea, vomiting, sensitivity to light, sensitivity to sound", "disease": "Migraine"},
            {"symptoms": "severe headache, nausea, sensitivity to light", "disease": "Migraine"},
            {"symptoms": "headache, vomiting, sensitivity to sound, nausea", "disease": "Migraine"},
            
            # Food Poisoning
            {"symptoms": "nausea, vomiting, diarrhea, stomach cramps, fever", "disease": "Food Poisoning"},
            {"symptoms": "vomiting, diarrhea, stomach pain, nausea", "disease": "Food Poisoning"},
            {"symptoms": "stomach cramps, nausea, vomiting, diarrhea", "disease": "Food Poisoning"},
            
            # Pneumonia
            {"symptoms": "fever, cough, shortness of breath, chest pain, fatigue", "disease": "Pneumonia"},
            {"symptoms": "cough, fever, chest pain, shortness of breath", "disease": "Pneumonia"},
            {"symptoms": "fever, fatigue, cough, chest discomfort", "disease": "Pneumonia"},
            
            # Bronchitis
            {"symptoms": "cough, shortness of breath, chest discomfort, fatigue, mucus", "disease": "Bronchitis"},
            {"symptoms": "persistent cough, chest discomfort, fatigue", "disease": "Bronchitis"},
            {"symptoms": "cough with mucus, shortness of breath, fatigue", "disease": "Bronchitis"},
            
            # Sinusitis
            {"symptoms": "headache, facial pain, nasal congestion, thick nasal discharge", "disease": "Sinusitis"},
            {"symptoms": "facial pressure, headache, nasal congestion", "disease": "Sinusitis"},
            {"symptoms": "headache, stuffy nose, facial pain", "disease": "Sinusitis"},
            
            # UTI
            {"symptoms": "painful urination, frequent urination, back pain, fever", "disease": "UTI"},
            {"symptoms": "burning urination, frequent urination, lower back pain", "disease": "UTI"},
            {"symptoms": "painful urination, urgency, fever", "disease": "UTI"},
            
            # Arthritis
            {"symptoms": "joint pain, stiffness, swelling, reduced range of motion", "disease": "Arthritis"},
            {"symptoms": "joint stiffness, pain, swelling in joints", "disease": "Arthritis"},
            {"symptoms": "joint pain, morning stiffness, swelling", "disease": "Arthritis"},
            
            # Diabetes
            {"symptoms": "increased thirst, frequent urination, extreme hunger, weight loss", "disease": "Diabetes"},
            {"symptoms": "thirst, frequent urination, unexplained weight loss", "disease": "Diabetes"},
            {"symptoms": "excessive hunger, fatigue, blurred vision, frequent urination", "disease": "Diabetes"},
            
            # Hypertension
            {"symptoms": "headache, shortness of breath, nosebleeds, chest pain", "disease": "Hypertension"},
            {"symptoms": "headache, dizziness, nosebleeds", "disease": "Hypertension"},
            {"symptoms": "chest pain, shortness of breath, headache", "disease": "Hypertension"},
            
            # Depression
            {"symptoms": "persistent sadness, loss of interest, sleep changes, appetite changes", "disease": "Depression"},
            {"symptoms": "sadness, fatigue, loss of interest, sleep problems", "disease": "Depression"},
            {"symptoms": "loss of appetite, sadness, sleep disturbances", "disease": "Depression"},
            
            # Anxiety
            {"symptoms": "excessive worry, restlessness, fatigue, difficulty concentrating", "disease": "Anxiety"},
            {"symptoms": "worry, restlessness, fatigue, concentration problems", "disease": "Anxiety"},
            {"symptoms": "nervousness, restlessness, excessive worry", "disease": "Anxiety"},
            
            # Gastroenteritis
            {"symptoms": "nausea, vomiting, diarrhea, stomach cramps, fever", "disease": "Gastroenteritis"},
            {"symptoms": "vomiting, diarrhea, abdominal pain, fever", "disease": "Gastroenteritis"},
            {"symptoms": "stomach cramps, nausea, vomiting, diarrhea", "disease": "Gastroenteritis"},
            
            # Eczema
            {"symptoms": "itchy skin, dry skin, red patches, thickened skin", "disease": "Eczema"},
            {"symptoms": "skin itching, dry patches, red skin", "disease": "Eczema"},
            {"symptoms": "itchy rash, dry skin, red patches", "disease": "Eczema"},
            
            # Acne
            {"symptoms": "pimples, blackheads, whiteheads, oily skin, red skin", "disease": "Acne"},
            {"symptoms": "pimples, oily skin, blackheads", "disease": "Acne"},
            {"symptoms": "whiteheads, pimples, red skin", "disease": "Acne"},
        ]
        
        # Create variations by adding more samples
        expanded_data = []
        for item in sample_data:
            expanded_data.append(item)
            # Add variations
            symptoms = item["symptoms"].split(", ")
            if len(symptoms) > 2:
                # Remove one symptom
                for i in range(len(symptoms)):
                    variant_symptoms = symptoms[:i] + symptoms[i+1:]
                    expanded_data.append({
                        "symptoms": ", ".join(variant_symptoms),
                        "disease": item["disease"]
                    })
        
        return pd.DataFrame(expanded_data)
    
    def preprocess_text(self, text: str) -> str:
        """Clean and preprocess symptom text"""
        # Convert to lowercase
        text = text.lower()
        # Remove special characters except commas
        text = re.sub(r'[^a-zA-Z,\s]', '', text)
        # Remove extra spaces
        text = re.sub(r'\s+', ' ', text).strip()
        return text
    
    def train(self, df):
        """Train the disease prediction model"""
        print("Preprocessing data...")
        
        # Preprocess symptoms
        df['processed_symptoms'] = df['symptoms'].apply(self.preprocess_text)
        
        # Prepare features and labels
        X = df['processed_symptoms']
        y = df['disease']
        
        # Split the data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        print("Vectorizing symptoms...")
        # Vectorize symptoms
        X_train_vec = self.vectorizer.fit_transform(X_train)
        X_test_vec = self.vectorizer.transform(X_test)
        
        print("Training model...")
        # Train the model
        self.model.fit(X_train_vec, y_train)
        
        # Make predictions
        y_pred = self.model.predict(X_test_vec)
        
        # Calculate accuracy
        accuracy = accuracy_score(y_test, y_pred)
        print(f"Model Accuracy: {accuracy:.4f}")
        
        # Print classification report
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred))
        
        return accuracy
    
    def save_model(self, model_path: str):
        """Save the trained model and vectorizer"""
        model_data = {
            'model': self.model,
            'vectorizer': self.vectorizer,
            'disease_symptoms': self.disease_symptoms
        }
        joblib.dump(model_data, model_path)
        print(f"Model saved to {model_path}")
    
    def load_model(self, model_path: str):
        """Load a trained model"""
        try:
            model_data = joblib.load(model_path)
            self.model = model_data['model']
            self.vectorizer = model_data['vectorizer']
            self.disease_symptoms = model_data.get('disease_symptoms', {})
            print(f"Model loaded from {model_path}")
            return True
        except FileNotFoundError:
            print(f"Model file not found: {model_path}")
            return False
    
    def predict(self, symptoms: str) -> tuple:
        """Predict disease from symptoms"""
        # Preprocess symptoms
        processed_symptoms = self.preprocess_text(symptoms)
        
        # Vectorize symptoms
        symptoms_vec = self.vectorizer.transform([processed_symptoms])
        
        # Make prediction
        prediction = self.model.predict(symptoms_vec)[0]
        probabilities = self.model.predict_proba(symptoms_vec)[0]
        
        # Get confidence score
        confidence = max(probabilities) * 100
        
        return prediction, confidence

def main():
    # Initialize predictor
    predictor = DiseasePredictor()
    
    # Load or create data
    data_path = '../data/dataset.csv'
    df = predictor.load_data(data_path)
    
    if df is None or df.empty:
        print("No data available for training")
        return
    
    print(f"Training with {len(df)} samples")
    print(f"Unique diseases: {df['disease'].nunique()}")
    print(f"Disease distribution:")
    print(df['disease'].value_counts())
    
    # Train the model
    accuracy = predictor.train(df)
    
    # Save the model
    model_path = '../model/disease_model.pkl'
    predictor.save_model(model_path)
    
    # Test the model
    print("\nTesting the model with sample predictions:")
    test_symptoms = [
        "fever, cough, fatigue, headache",
        "itchy eyes, sneezing, runny nose",
        "joint pain, stiffness, swelling",
        "nausea, vomiting, diarrhea"
    ]
    
    for symptoms in test_symptoms:
        disease, confidence = predictor.predict(symptoms)
        print(f"Symptoms: {symptoms}")
        print(f"Predicted Disease: {disease} (Confidence: {confidence:.2f}%)")
        print("-" * 50)

if __name__ == "__main__":
    main()
