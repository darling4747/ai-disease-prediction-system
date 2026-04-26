import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import pickle
import json
from typing import List, Dict, Tuple

class DiseasePredictor:
    def __init__(self):
        self.model = None
        self.label_encoder_disease = None
        self.label_encoder_symptom = None
        self.symptom_columns = []
        
    def load_data(self, csv_path: str) -> pd.DataFrame:
        """Load disease-symptom dataset from CSV"""
        try:
            df = pd.read_csv(csv_path)
            return df
        except FileNotFoundError:
            # Create sample data if file doesn't exist
            return self._create_sample_dataset()
    
    def _create_sample_dataset(self) -> pd.DataFrame:
        """Create a sample dataset for demonstration"""
        data = {
            'fever': [1, 1, 0, 1, 0, 1, 0, 0, 1, 1],
            'cough': [1, 1, 1, 0, 0, 1, 0, 1, 1, 1],
            'headache': [0, 1, 0, 1, 1, 0, 1, 0, 1, 0],
            'fatigue': [1, 0, 0, 1, 1, 1, 0, 1, 1, 1],
            'nausea': [0, 0, 1, 0, 1, 0, 1, 0, 0, 1],
            'chest_pain': [0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
            'shortness_of_breath': [0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
            'disease': [
                'Common Cold', 'Flu', 'Food Poisoning', 'COVID-19', 
                'Migraine', 'Pneumonia', 'Gastroenteritis', 'Bronchitis',
                'Heart Attack', 'Influenza'
            ]
        }
        return pd.DataFrame(data)
    
    def preprocess_data(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.Series]:
        """Preprocess the data for training"""
        # Separate features and target
        X = df.drop('disease', axis=1)
        y = df['disease']
        
        # Store symptom column names
        self.symptom_columns = X.columns.tolist()
        
        # Encode disease labels
        self.label_encoder_disease = LabelEncoder()
        y_encoded = self.label_encoder_disease.fit_transform(y)
        
        return X, y_encoded
    
    def train_model(self, X: pd.DataFrame, y: pd.Series) -> None:
        """Train the Random Forest model"""
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Train Random Forest
        self.model = RandomForestClassifier(
            n_estimators=100, 
            random_state=42,
            max_depth=10
        )
        self.model.fit(X_train, y_train)
        
        # Evaluate model
        y_pred = self.model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        print(f"Model Accuracy: {accuracy:.2f}")
        
        # Print classification report
        print("\nClassification Report:")
        print(classification_report(
            y_test, y_pred, 
            target_names=self.label_encoder_disease.classes_
        ))
    
    def predict_diseases(self, symptoms: List[str]) -> List[Dict]:
        """Predict diseases based on input symptoms"""
        if self.model is None:
            raise ValueError("Model not trained yet")
        
        # Create input vector
        input_vector = self._create_input_vector(symptoms)
        
        # Get predictions and probabilities
        predictions = self.model.predict_proba([input_vector])[0]
        predicted_indices = np.argsort(predictions)[::-1]  # Sort in descending order
        
        # Prepare results
        results = []
        for i, idx in enumerate(predicted_indices[:5]):  # Top 5 predictions
            if predictions[idx] > 0.1:  # Only include predictions with >10% probability
                disease_name = self.label_encoder_disease.inverse_transform([idx])[0]
                probability = float(predictions[idx])
                
                result = {
                    'name': disease_name,
                    'probability': probability,
                    'severity': self._get_disease_severity(disease_name),
                    'description': self._get_disease_description(disease_name),
                    'commonSymptoms': self._get_common_symptoms(disease_name),
                    'recommendations': self._get_recommendations(disease_name),
                    'doctorSpecialization': self._get_doctor_specialization(disease_name),
                    'hospitalDepartment': self._get_hospital_department(disease_name)
                }
                results.append(result)
        
        return results
    
    def _create_input_vector(self, symptoms: List[str]) -> List[int]:
        """Create input vector from symptoms list"""
        vector = []
        for symptom in self.symptom_columns:
            # Convert symptom name to match column format
            symptom_formatted = symptom.lower().replace(' ', '_')
            if any(symptom_formatted in s.lower().replace(' ', '_') for s in symptoms):
                vector.append(1)
            else:
                vector.append(0)
        return vector
    
    def _get_disease_severity(self, disease: str) -> str:
        """Get severity level for disease"""
        severity_map = {
            'Common Cold': 'low',
            'Flu': 'medium',
            'Food Poisoning': 'medium',
            'COVID-19': 'high',
            'Migraine': 'low',
            'Pneumonia': 'high',
            'Gastroenteritis': 'medium',
            'Bronchitis': 'medium',
            'Heart Attack': 'high',
            'Influenza': 'medium'
        }
        return severity_map.get(disease, 'medium')
    
    def _get_disease_description(self, disease: str) -> str:
        """Get description for disease"""
        descriptions = {
            'Common Cold': 'A viral infection of the nose and throat that usually resolves within 7-10 days.',
            'Flu': 'A contagious respiratory illness caused by influenza viruses.',
            'Food Poisoning': 'An illness caused by consuming contaminated food or water.',
            'COVID-19': 'A viral illness caused by SARS-CoV-2 that can affect respiratory system.',
            'Migraine': 'A neurological condition characterized by intense headaches.',
            'Pneumonia': 'An infection that inflames air sacs in one or both lungs.',
            'Gastroenteritis': 'Inflammation of the stomach and intestines causing vomiting and diarrhea.',
            'Bronchitis': 'Inflammation of the lining of bronchial tubes.',
            'Heart Attack': 'A medical emergency where blood flow to the heart is blocked.',
            'Influenza': 'A viral infection that attacks your respiratory system.'
        }
        return descriptions.get(disease, 'A medical condition requiring attention.')
    
    def _get_common_symptoms(self, disease: str) -> List[str]:
        """Get common symptoms for disease"""
        symptoms_map = {
            'Common Cold': ['Cough', 'Sore Throat', 'Runny Nose', 'Fatigue'],
            'Flu': ['Fever', 'Body Aches', 'Fatigue', 'Cough', 'Headache'],
            'Food Poisoning': ['Nausea', 'Vomiting', 'Diarrhea', 'Abdominal Pain'],
            'COVID-19': ['Fever', 'Cough', 'Shortness of Breath', 'Fatigue'],
            'Migraine': ['Headache', 'Nausea', 'Sensitivity to Light', 'Dizziness'],
            'Pneumonia': ['Cough', 'Fever', 'Shortness of Breath', 'Chest Pain'],
            'Gastroenteritis': ['Nausea', 'Vomiting', 'Diarrhea', 'Abdominal Pain'],
            'Bronchitis': ['Cough', 'Fatigue', 'Shortness of Breath', 'Chest Discomfort'],
            'Heart Attack': ['Chest Pain', 'Shortness of Breath', 'Nausea', 'Dizziness'],
            'Influenza': ['Fever', 'Body Aches', 'Fatigue', 'Cough', 'Headache']
        }
        return symptoms_map.get(disease, ['Fever', 'Fatigue'])
    
    def _get_recommendations(self, disease: str) -> List[str]:
        """Get recommendations for disease"""
        recommendations_map = {
            'Common Cold': ['Rest and stay hydrated', 'Use over-the-counter cold medications'],
            'Flu': ['Seek medical attention for proper diagnosis', 'Consider antiviral medications'],
            'Food Poisoning': ['Stay hydrated', 'Seek medical attention if severe'],
            'COVID-19': ['Get tested immediately', 'Isolate to prevent spread'],
            'Migraine': ['Rest in dark room', 'Take prescribed medications'],
            'Pneumonia': ['Seek immediate medical attention', 'Complete prescribed antibiotics'],
            'Gastroenteritis': ['Stay hydrated', 'Eat bland foods'],
            'Bronchitis': ['Rest and increase fluid intake', 'Avoid smoking'],
            'Heart Attack': ['Call emergency services immediately', 'Chew aspirin if available'],
            'Influenza': ['Rest and increase fluid intake', 'Consider antiviral medications']
        }
        return recommendations_map.get(disease, ['Consult a healthcare provider'])
    
    def _get_doctor_specialization(self, disease: str) -> str:
        """Get recommended doctor specialization for disease"""
        specialization_map = {
            'Common Cold': 'General Practitioner',
            'Flu': 'General Practitioner',
            'Food Poisoning': 'Gastroenterologist',
            'COVID-19': 'Infectious Disease Specialist',
            'Migraine': 'Neurologist',
            'Pneumonia': 'Pulmonologist',
            'Gastroenteritis': 'Gastroenterologist',
            'Bronchitis': 'Pulmonologist',
            'Heart Attack': 'Cardiologist',
            'Influenza': 'General Practitioner'
        }
        return specialization_map.get(disease, 'General Practitioner')
    
    def _get_hospital_department(self, disease: str) -> str:
        """Get recommended hospital department for disease"""
        department_map = {
            'Common Cold': 'Outpatient',
            'Flu': 'Outpatient',
            'Food Poisoning': 'Emergency',
            'COVID-19': 'Isolation Ward',
            'Migraine': 'Neurology',
            'Pneumonia': 'Pulmonology',
            'Gastroenteritis': 'Gastroenterology',
            'Bronchitis': 'Pulmonology',
            'Heart Attack': 'Cardiology/Emergency',
            'Influenza': 'Outpatient'
        }
        return department_map.get(disease, 'General Medicine')
    
    def save_model(self, model_path: str) -> None:
        """Save the trained model"""
        model_data = {
            'model': self.model,
            'label_encoder_disease': self.label_encoder_disease,
            'symptom_columns': self.symptom_columns
        }
        with open(model_path, 'wb') as f:
            pickle.dump(model_data, f)
    
    def load_model(self, model_path: str) -> None:
        """Load a trained model"""
        with open(model_path, 'rb') as f:
            model_data = pickle.load(f)
            self.model = model_data['model']
            self.label_encoder_disease = model_data['label_encoder_disease']
            self.symptom_columns = model_data['symptom_columns']

def main():
    # Initialize predictor
    predictor = DiseasePredictor()
    
    # Load and preprocess data
    df = predictor.load_data('data/symptom_disease_dataset.csv')
    X, y = predictor.preprocess_data(df)
    
    # Train model
    predictor.train_model(X, y)
    
    # Save model
    predictor.save_model('model/disease_predictor.pkl')
    
    # Test prediction
    test_symptoms = ['fever', 'cough', 'headache']
    predictions = predictor.predict_diseases(test_symptoms)
    
    print("\nTest Predictions:")
    for pred in predictions:
        print(f"{pred['name']}: {pred['probability']:.2f}")

if __name__ == "__main__":
    main()
