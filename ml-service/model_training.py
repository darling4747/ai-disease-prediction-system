import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from predict_disease import DiseasePredictor
import pandas as pd
from sklearn.model_selection import GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
import numpy as np

def train_and_evaluate():
    """Train and evaluate the disease prediction model"""
    print("Starting disease prediction model training...")
    
    # Initialize predictor
    predictor = DiseasePredictor()
    
    # Load data
    print("Loading training dataset...")
    df_train = predictor.load_data('Training.csv')
    print(f"Training dataset loaded with {len(df_train)} records and {len(df_train.columns)} columns")
    
    print("Loading testing dataset...")
    df_test = predictor.load_data('Testing.csv')
    print(f"Testing dataset loaded with {len(df_test)} records and {len(df_test.columns)} columns")
    
    # Display dataset info
    print("\nTraining Dataset Info:")
    print(df_train.head())
    print(f"\nTraining Disease distribution:")
    print(df_train['prognosis'].value_counts())
    
    print("\nTesting Dataset Info:")
    print(df_test.head())
    print(f"\nTesting Disease distribution:")
    print(df_test['prognosis'].value_counts())
    
    # Preprocess training data
    print("\nPreprocessing training data...")
    X_train, y_train = predictor.preprocess_data(df_train)
    
    # Preprocess testing data
    print("Preprocessing testing data...")
    X_test, y_test = predictor.preprocess_data(df_test)
    
    # Hyperparameter tuning
    print("\nPerforming hyperparameter tuning...")
    param_grid = {
        'n_estimators': [50, 100, 200],
        'max_depth': [5, 10, 15, None],
        'min_samples_split': [2, 5, 10],
        'min_samples_leaf': [1, 2, 4]
    }
    
    rf = RandomForestClassifier(random_state=42)
    grid_search = GridSearchCV(
        estimator=rf, 
        param_grid=param_grid, 
        cv=5, 
        n_jobs=-1, 
        verbose=1,
        scoring='accuracy'
    )
    
    grid_search.fit(X_train, y_train)
    
    print(f"\nBest parameters: {grid_search.best_params_}")
    print(f"Best cross-validation score: {grid_search.best_score_:.4f}")
    
    # Train final model with best parameters
    best_model = grid_search.best_estimator_
    
    # Evaluate on test set
    y_pred = best_model.predict(X_test)
    test_accuracy = best_model.score(X_test, y_test)
    
    print(f"\nTest Set Accuracy: {test_accuracy:.4f}")
    
    # Detailed classification report
    print("\nDetailed Classification Report:")
    print(classification_report(
        y_test, y_pred, 
        target_names=predictor.label_encoder_disease.classes_
    ))
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': predictor.symptom_columns,
        'importance': best_model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\nTop 10 Most Important Features:")
    print(feature_importance.head(10))
    
    # Save the best model
    predictor.model = best_model
    predictor.save_model('model/disease_predictor.pkl')
    
    print("\nModel training completed successfully!")
    print(f"Model saved to: model/disease_predictor.pkl")
    
    # Test with sample symptoms
    print("\nTesting model with sample symptoms...")
    test_cases = [
        ['fever', 'cough', 'headache'],
        ['nausea', 'diarrhea', 'abdominal pain'],
        ['chest pain', 'shortness of breath', 'dizziness'],
        ['headache', 'dizziness', 'skin rash']
    ]
    
    for i, symptoms in enumerate(test_cases):
        print(f"\nTest Case {i+1}: {symptoms}")
        predictions = predictor.predict_diseases(symptoms)
        for j, pred in enumerate(predictions[:3]):
            print(f"  {j+1}. {pred['name']} - {pred['probability']:.2f}")
    
    return predictor

if __name__ == "__main__":
    # Train and evaluate model
    predictor = train_and_evaluate()
    
    print("\nTraining completed successfully!")
    print("Files created:")
    print("  - model/disease_predictor.pkl (trained model)")
    print("  - Training on: Training.csv")
    print("  - Tested on: Testing.csv")
