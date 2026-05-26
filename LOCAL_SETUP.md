# Local Setup Guide (Without Docker)

Since Docker is not installed on your system, follow these steps to run all services locally.

## Prerequisites

1. **MongoDB** - Install MongoDB Community Server from https://www.mongodb.com/try/download/community
2. **Java 17** - Required for Spring Boot backend
3. **Node.js 18+** - Required for React frontend
4. **Python 3.9+** - Required for ML service

## Service Configuration Fixes Applied

The following fixes have been applied to connect all services:

### 1. Backend (Spring Boot)
- **Created**: `backend/Dockerfile` for containerized deployment
- **Configuration**: `backend/src/main/resources/application.properties`
  - MongoDB URI: `mongodb://localhost:27017/hospital_management`
  - ML Service URL: `http://localhost:5000`
  - CORS enabled for all origins

### 2. Frontend (React)
- **Fixed**: `docker-compose.yml` port mapping from `3000:3000` to `3000:80`
- **Fixed**: Environment variables to use Docker service names (backend, ml-service)
- **Configuration**: `frontend/hospital-management/src/services/apiConfig.jsx`
  - Uses `REACT_APP_API_URL` environment variable
  - Falls back to `http://localhost:8080`

### 3. ML Service (Python Flask + Scikit-learn)
- **Production API**: `api/ml_api.py` (Random Forest primary model)
- **Model comparison**: `GET /model/compare` (RF, Logistic Regression, Naive Bayes, SVM)
- **Dependencies**: Flask, scikit-learn, pandas, numpy in `requirements.txt`
- **Port**: Runs on port 5000

### 4. Docker Compose
- **Fixed**: Frontend port mapping and environment variables
- **Network**: All services on `hospital-network`

## Local Setup Instructions

### Step 1: Start MongoDB

```bash
# Start MongoDB service (Windows)
net start MongoDB

# Or run MongoDB manually
mongod --dbpath "C:\data\db"
```

MongoDB will run on `localhost:27017`

### Step 2: Start Backend (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
```

Backend will run on `http://localhost:8080`

**Verify**: Open http://localhost:8080/actuator/health in browser

### Step 3: Start ML Service

```bash
cd ml-service
pip install -r requirements.txt
python api/simple_ml_api.py
```

ML Service will run on `http://localhost:5000`

**Verify**: Open http://localhost:5000/health in browser

### Step 4: Start Frontend (React)

```bash
cd frontend/hospital-management
npm install
npm start
```

Frontend will run on `http://localhost:3000`

**Verify**: Open http://localhost:3000 in browser

## Testing Connections

### Test Backend to MongoDB
```bash
curl http://localhost:8080/actuator/health
```

### Test ML Service
```bash
curl http://localhost:5000/health
```

### Test ML Prediction
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"symptoms": ["fever", "cough", "headache"]}'
```

### Test Frontend to Backend
Open browser DevTools Console and check for API calls to `http://localhost:8080`

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB service is running: `net start MongoDB`
- Check MongoDB is listening on port 27017
- Verify connection string in `application.properties`

### Backend Port Already in Use
- Change port in `application.properties`: `server.port=8081`
- Or stop the process using port 8080

### ML Service Dependencies
```bash
cd ml-service
pip install flask flask-cors
```

### Frontend Build Issues
```bash
cd frontend/hospital-management
rm -rf node_modules package-lock.json
npm install
npm start
```

## Service Endpoints

### Backend (Spring Boot)
- Health: `GET http://localhost:8080/actuator/health`
- API Base: `http://localhost:8080/api`

### ML Service (Flask)
- Health: `GET http://localhost:5000/health`
- Predict: `POST http://localhost:5000/predict`
- Symptoms: `GET http://localhost:5000/symptoms`
- Diseases: `GET http://localhost:5000/diseases`

### Frontend (React)
- Application: `http://localhost:3000`

## Architecture Flow

```
Frontend (React:3000) 
    ↓ HTTP requests
Backend (Spring Boot:8080) 
    ↓ MongoDB connection
MongoDB (27017)
    ↓ HTTP requests
ML Service (Flask:5000)
```

## Next Steps

Once all services are running locally:

1. Test the disease prediction feature in the frontend
2. Verify MongoDB is storing data correctly
3. Check backend API endpoints are accessible
4. Test ML service predictions

## Docker Setup (When Available)

If you install Docker later, simply run:

```bash
docker-compose up --build
```

All services will start automatically with the fixed configurations.
