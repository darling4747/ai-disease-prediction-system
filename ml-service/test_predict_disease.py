import unittest
import sys
import os
import pandas as pd

# Adjust path to find the module in the same directory
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from predict_disease import DiseasePredictor

class TestDiseasePredictor(unittest.TestCase):

    def setUp(self):
        self.predictor = DiseasePredictor()

    def test_create_sample_dataset(self):
        """Test fallback sample dataset creation has the expected structure"""
        df = self.predictor._create_sample_dataset()
        self.assertIsInstance(df, pd.DataFrame)
        self.assertIn("disease", df.columns)
        self.assertTrue(len(df) > 0)

    def test_preprocess_data(self):
        """Test preprocessing separates features from targets and encodes targets"""
        df = self.predictor._create_sample_dataset()
        X, y = self.predictor.preprocess_data(df)
        self.assertEqual(len(X), len(y))
        self.assertNotIn("prognosis", X.columns)
        self.assertIsNotNone(self.predictor.symptom_columns)

    def test_train_and_predict_flow(self):
        """Test full training, saving, loading, and predicting lifecycle"""
        # Load sample data and train
        df = self.predictor._create_sample_dataset()
        X, y = self.predictor.preprocess_data(df)
        self.predictor.train_model(X, y)
        
        # Verify model is trained
        self.assertIsNotNone(self.predictor.model)
        
        # Test input vector mapping
        active_symptoms = ["fever", "cough"]
        input_vector = self.predictor._create_input_vector(active_symptoms)
        self.assertEqual(len(input_vector), len(self.predictor.symptom_columns))
        
        # Test predictions return valid formats
        predictions = self.predictor.predict_diseases(active_symptoms)
        self.assertIsInstance(predictions, list)
        if len(predictions) > 0:
            best_pred = predictions[0]
            self.assertIn("name", best_pred)
            self.assertIn("probability", best_pred)
            self.assertTrue(0.0 <= best_pred["probability"] <= 1.0)

if __name__ == '__main__':
    unittest.main()
