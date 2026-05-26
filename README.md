# AI-Driven Disease Diagnosis and Smart Hospital Recommendation System

An advanced healthcare support platform that provides intelligent disease prediction and complete healthcare management using machine learning and AI-driven decision support. The system analyzes user symptoms with models such as **Logistic Regression**, **Naive Bayes**, **Support Vector Machine (SVM)**, and **Random Forest**. **Random Forest** is the primary production model because of its high accuracy and efficient handling of high-dimensional symptom data.

The platform integrates **frontend**, **backend**, **machine learning**, **MongoDB**, and a **goal-based AI healthcare assistant** into a scalable smart healthcare ecosystem suitable for real-world and enterprise-style deployment.

## Smart Modules

| Module | Description | In this project |
|--------|-------------|-----------------|
| **AI Agent** | Symptom intake, ML analysis, guided care chat | `/` — `DiseasePrediction.jsx` + `healthcareAgent.js` |
| **Appointment Booking** | Schedule doctor visits | `/appointments` (PATIENT) |
| **Emergency Alert** | Critical symptom detection and urgent banners | `emergencyDetection.js`, `EmergencyAlert.jsx`, `riskLevel.js` |
| **Doctor Dashboard** | Cases, medical advice, appointments | `/doctor-dashboard` (DOCTOR, ADMIN) |
| **Health Report** | Printable prediction summaries | `/health-report`, `/health-report/:id` |
| **Prediction History** | MongoDB-backed history | `/history` |
| **Medicine Recommendation** | Medicines and precautions by disease | `/medicines` + `diseaseMap.js` |
| **Analytics Dashboard** | Disease trends and model accuracy charts | `/dashboard` + `AnalyticsCharts.jsx` (Recharts) |

Together, these modules extend the project beyond a simple ML form into a full **AI-driven smart healthcare** application.

## Architecture

### Technology Stack

| Layer | Stack |
|-------|--------|
| **Frontend** | React 18, Material-UI, React Router, Axios, Recharts (CureAI UI) |
| **Backend** | Spring Boot 3.2, Java 17, Spring Security, JWT |
| **Database** | MongoDB |
| **ML Service** | Python, Flask, Scikit-learn (Random Forest) |
| **Deployment** | Docker Compose, Nginx (frontend container) |

### System Flow

1. **Authentication** — Users register/login; JWT secures API access by role (PATIENT, DOCTOR, ADMIN).
2. **Symptom input** — Patient or clinician selects symptoms on the AI Diagnosis page.
3. **ML prediction** — Backend proxies to the ML service; Random Forest returns ranked diseases with confidence.
4. **AI agent** — Assistant summarizes the top prediction, doctor specialization, and hospital department.
5. **Emergency guidance** — Critical or high-risk patterns trigger urgent-care messaging.
6. **Recommendations** — Doctors and hospitals filtered by specialization and department.
7. **Persistence** — Predictions, appointments, doctors, and hospitals stored in MongoDB.
8. **Analytics** — Dashboard aggregates predictions, appointments, and network stats.

### AI Agent

The **Goal-Based Healthcare Assistant Agent** aims to predict likely diseases from symptoms and recommend the next healthcare action. It:

- Collects and preprocesses symptom inputs
- Uses ML output (primary: **Random Forest**) ranked by confidence
- Produces **disease prediction**, **doctor specialization**, and **hospital/department** suggestions
- Supports conversational follow-up (appointments, emergencies, referrals)

## Project Structure

```
idp/
├── backend/                         # Spring Boot REST API
│   └── src/main/java/com/example/hospital/
│       ├── controller/              # Auth, predictions, doctors, appointments, ML, admin
│       ├── service/                 # Business logic + JWT
│       ├── config/                  # Security, JWT filter, data seeding
│       └── model/                   # Doctor, Hospital, Prediction, Appointment
├── frontend/hospital-management/    # React (CureAI)
│   └── src/
│       ├── pages/patients/          # AI Diagnosis, history, recommendations
│       ├── pages/dashboard/         # Analytics dashboard
│       ├── pages/appointments/      # Booking
│       ├── pages/admin/             # Admin panel
│       └── services/                # API clients (apiConfig.jsx)
├── ml-service/
│   ├── api/ml_api.py                # Flask prediction API (Docker default)
│   ├── predict_disease.py           # Random Forest training & inference
│   └── model_training.py            # GridSearchCV tuning
├── docker-compose.yml
├── LOCAL_SETUP.md                   # Run without Docker
├── PUBLIC_DEPLOYMENT.md             # LAN / public access
└── README.md
```

## Quick Start

### Prerequisites

- Docker and Docker Compose (recommended), or see [LOCAL_SETUP.md](LOCAL_SETUP.md)
- Node.js 18+, Java 17+, Python 3.9+ for local development

### Docker (recommended)

```bash
git clone <repository-url>
cd idp
docker-compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080 |
| ML Service | http://localhost:5000 |
| MongoDB | mongodb://localhost:27017 |

Windows: use `start-all.bat` for local services or `start-public.bat` for LAN access (see [PUBLIC_DEPLOYMENT.md](PUBLIC_DEPLOYMENT.md)).

### Local development

**Backend**

```bash
cd backend
./mvnw spring-boot:run
```

**Frontend**

```bash
cd frontend/hospital-management
npm install
npm start
```

Copy `.env.example` to `.env` and set `REACT_APP_API_URL` if needed.

**ML service**

```bash
cd ml-service
pip install -r requirements.txt
python api/ml_api.py
```

## User Roles

| Role | Capabilities |
|------|----------------|
| **PATIENT** | AI diagnosis, history, recommendations, appointment booking |
| **DOCTOR** | View all patient predictions/cases, dashboard, appointments |
| **ADMIN** | Full analytics, doctor/hospital CRUD, admin panel, ML admin endpoints |

Default seeded accounts are created by `DataSeeder.java` on first run (see LOCAL_SETUP.md).

## Machine Learning

- **Primary model**: Random Forest (`RandomForestClassifier`) with optional GridSearchCV in `model_training.py`
- **Supporting models** (design/evaluation): Logistic Regression, Naive Bayes, SVM — documented for comparative study; production inference uses the trained Random Forest artifact (`disease_predictor.pkl`)
- **Output**: Ranked diseases, confidence, severity, doctor specialization, hospital department, and care recommendations

## API Overview

### Backend (authenticated unless noted)

| Endpoint | Description |
|----------|-------------|
| `POST /api/auth/register`, `POST /api/auth/login` | Registration and JWT login |
| `POST /api/ml/predict` | Symptom-based prediction (via ML service) |
| `GET/POST /api/predictions/**` | History and save predictions |
| `GET /api/predictions/user/{userId}/analytics` | User analytics |
| `GET /api/doctors/**`, `GET /api/hospitals/**` | Provider directory |
| `POST /appointments/book` | Book appointment (PATIENT) |
| `GET /appointments/all` | All appointments (DOCTOR, ADMIN) |
| `GET /api/admin/**` | Admin operations |

### ML service

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Health check |
| `POST /predict` | Disease prediction from symptoms |
| `GET /symptoms`, `GET /diseases` | Supported inputs and labels |

## Disease → Care Mapping (examples)

| Disease | Doctor | Department |
|---------|--------|------------|
| Common Cold / Flu | General Practitioner | Outpatient |
| COVID-19 | Infectious Disease Specialist | Isolation Ward |
| Heart Attack | Cardiologist | Cardiology / Emergency |
| Migraine | Neurologist | Neurology |
| Pneumonia | Pulmonologist | Pulmonology |

Full mappings live in `ml-service/predict_disease.py` and `frontend/.../utils/diseaseMap.js`.

## Security

- **JWT authentication** with role-based access (`SecurityConfig`, `JwtAuthenticationFilter`)
- **BCrypt** password hashing
- **CORS** configured for frontend origins
- Input validation on prediction and appointment endpoints

> This system is for **decision support and education**, not a substitute for licensed medical diagnosis.

## Configuration

**Backend** (`application.properties`): `SPRING_DATA_MONGODB_URI`, `ML_SERVICE_URL`

**Frontend** (`.env`): `REACT_APP_API_URL`, optional `REACT_APP_ML_SERVICE_URL`

**ML service**: `FLASK_ENV`, model path under `ml-service/model/`

## Testing

```bash
# Backend
cd backend && ./mvnw test

# Frontend
cd frontend/hospital-management && npm test
```

## Deployment

- **Docker**: `docker-compose up --build -d`
- **Public/LAN**: [PUBLIC_DEPLOYMENT.md](PUBLIC_DEPLOYMENT.md)
- **No Docker**: [LOCAL_SETUP.md](LOCAL_SETUP.md)

Production checklist: HTTPS, secrets management, MongoDB backups, model retraining pipeline, monitoring.

## Troubleshooting

| Issue | Check |
|-------|--------|
| ML service down | Port 5000, `model/disease_predictor.pkl`, Python deps |
| DB connection | MongoDB on 27017, URI in `application.properties` |
| Frontend API errors | `REACT_APP_API_URL`, backend CORS, valid JWT |
| Docker rebuild | `docker-compose build --no-cache` |

## License

MIT License.

---

**CureAI** — improving healthcare accessibility through AI-driven diagnosis and smart hospital recommendations.
