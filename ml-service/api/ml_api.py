from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from predict_disease import DiseasePredictor
import json

app = Flask(__name__)
CORS(app)

# Initialize the disease predictor
predictor = DiseasePredictor()

# Load the trained model
try:
    predictor.load_model('model/disease_predictor.pkl')
    print("Model loaded successfully")
except FileNotFoundError:
    print("Model not found. Training new model...")
    # Train model if not exists
    df = predictor.load_data('data/symptom_disease_dataset.csv')
    X, y = predictor.preprocess_data(df)
    predictor.train_model(X, y)
    predictor.save_model('model/disease_predictor.pkl')
    print("New model trained and saved")

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Disease Prediction ML Service',
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
        predictions = predictor.predict_diseases(symptoms)
        
        # Prepare response
        from datetime import datetime
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
    try:
        symptoms = predictor.symptom_columns
        formatted_symptoms = [symptom.replace('_', ' ').title() for symptom in symptoms]
        
        return jsonify({
            'symptoms': formatted_symptoms,
            'total_count': len(formatted_symptoms)
        })
        
    except Exception as e:
        return jsonify({
            'error': f'Failed to get symptoms: {str(e)}'
        }), 500

@app.route('/diseases', methods=['GET'])
def get_diseases():
    """Get list of all diseases in the model"""
    try:
        if hasattr(predictor, 'label_encoder_disease') and predictor.label_encoder_disease:
            diseases = predictor.label_encoder_disease.classes_.tolist()
            return jsonify({
                'diseases': diseases,
                'total_count': len(diseases)
            })
        else:
            return jsonify({
                'diseases': [],
                'total_count': 0
            })
        
    except Exception as e:
        return jsonify({
            'error': f'Failed to get diseases: {str(e)}'
        }), 500

@app.route('/model/info', methods=['GET'])
def model_info():
    """Get information about the trained model"""
    try:
        info = {
            'model_type': 'Random Forest Classifier',
            'features': len(predictor.symptom_columns) if predictor.symptom_columns else 0,
            'symptoms': predictor.symptom_columns if predictor.symptom_columns else [],
            'classes': predictor.label_encoder_disease.classes_.tolist() if predictor.label_encoder_disease else [],
            'status': 'trained' if predictor.model else 'not trained'
        }
        
        return jsonify(info)
        
    except Exception as e:
        return jsonify({
            'error': f'Failed to get model info: {str(e)}'
        }), 500

@app.route('/retrain', methods=['POST'])
def retrain_model():
    """Retrain the model with new data"""
    try:
        # Load and preprocess data
        df = predictor.load_data('data/symptom_disease_dataset.csv')
        X, y = predictor.preprocess_data(df)
        
        # Train new model
        predictor.train_model(X, y)
        
        # Save updated model
        predictor.save_model('model/disease_predictor.pkl')
        
        from datetime import datetime
        return jsonify({
            'message': 'Model retrained successfully',
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'error': f'Model retraining failed: {str(e)}'
        }), 500

if __name__ == '__main__':
    print("Starting Disease Prediction ML Service...")
    print("Available endpoints:")
    print("  GET  /health - Health check")
    print("  POST /predict - Predict diseases from symptoms")
    print("  GET  /symptoms - Get all available symptoms")
    print("  GET  /diseases - Get all diseases")
    print("  GET  /model/info - Get model information")
    print("  POST /retrain - Retrain the model")
    print("\nService running on http://localhost:5000")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
