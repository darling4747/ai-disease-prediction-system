"""Train and compare Random Forest, Logistic Regression, Naive Bayes, and SVM."""
import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import GaussianNB
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split, cross_val_score
from predict_disease import DiseasePredictor

PRIMARY_MODEL = 'Random Forest'


def compare_all_models(csv_path='data/symptom_disease_dataset.csv'):
    predictor = DiseasePredictor()
    df = predictor.load_data(csv_path)
    X, y = predictor.preprocess_data(df)

    try:
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
    except ValueError:
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

    cv_folds = max(2, min(5, len(set(y)) - 1, len(X_train) // 2))

    candidates = [
        ('Random Forest', RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)),
        ('Logistic Regression', LogisticRegression(max_iter=1000, random_state=42)),
        ('Naive Bayes', GaussianNB()),
        ('SVM', SVC(kernel='rbf', probability=True, random_state=42)),
    ]

    results = []
    best_name = PRIMARY_MODEL
    best_accuracy = -1.0

    for name, estimator in candidates:
        try:
            scores = cross_val_score(estimator, X_train, y_train, cv=cv_folds, scoring='accuracy')
            cv_mean = float(scores.mean())
        except Exception:
            cv_mean = 0.0
        estimator.fit(X_train, y_train)
        test_accuracy = float(estimator.score(X_test, y_test))
        entry = {
            'name': name,
            'cv_accuracy': round(cv_mean, 4),
            'test_accuracy': round(test_accuracy, 4),
            'selected': name == PRIMARY_MODEL,
        }
        results.append(entry)
        if test_accuracy > best_accuracy:
            best_accuracy = test_accuracy
            best_name = name

    for entry in results:
        entry['selected'] = entry['name'] == PRIMARY_MODEL

    return {
        'primary_model': PRIMARY_MODEL,
        'best_test_model': best_name,
        'dataset_size': len(df),
        'feature_count': len(predictor.symptom_columns),
        'models': results,
    }
