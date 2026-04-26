# AI-Driven Hospital Management System

An intelligent healthcare management system that integrates machine learning with a full-stack web application to improve clinical decision-making. Instead of a traditional CRUD system, it allows users to input patient symptoms, uses a trained ML model to predict the most likely disease, and then recommends the appropriate doctor specialization and hospital/department.

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React 18 + TypeScript + Material-UI
- **Backend**: Spring Boot 3.2.0 + Java 17
- **Database**: MongoDB
- **ML Service**: Python Flask + Scikit-learn
- **Containerization**: Docker + Docker Compose

### System Flow
1. **User Input**: Patients enter symptoms through React frontend
2. **ML Prediction**: Python ML service analyzes symptoms and predicts diseases
3. **Recommendations**: System suggests doctor specializations and hospital departments
4. **Storage**: All predictions are stored in MongoDB for history tracking
5. **Doctor/Hospital Search**: Users can find appropriate healthcare providers

## 📁 Project Structure

```
idp/
├── backend/                    # Spring Boot API
│   ├── src/main/java/com/example/hospital/
│   │   ├── controller/         # REST API endpoints
│   │   ├── service/           # Business logic
│   │   ├── model/             # Data models (Doctor, Hospital, Prediction)
│   │   └── repository/        # Data access layer
│   └── src/main/resources/
│       └── application.properties # Configuration
├── frontend/hospital-management/ # React TypeScript App
│   ├── src/
│   │   ├── assets/           # Static files
│   │   ├── components/       # Reusable UI components
│   │   │   ├── layout/     # Navigation and layout
│   │   │   ├── ui/         # Basic UI components
│   │   │   └── dashboard/  # Dashboard widgets
│   │   ├── pages/           # Screen components
│   │   │   ├── auth/       # Login/Register
│   │   │   ├── dashboard/  # Main dashboard
│   │   │   ├── patients/   # Disease prediction, history, recommendations
│   │   │   ├── doctors/    # Doctor listings
│   │   │   └── hospitals/ # Hospital listings
│   │   ├── services/         # API service layer
│   │   ├── context/          # Global state management
│   │   ├── hooks/            # Custom React hooks
│   │   ├── utils/            # Helper functions
│   │   └── routes/           # App routing
│   └── package.json
├── ml-service/                 # Python ML API
│   ├── api/                   # Flask API endpoints
│   ├── model/                  # Trained ML models
│   ├── data/                   # Training datasets
│   ├── predict_disease.py      # ML prediction logic
│   ├── model_training.py       # Model training script
│   └── requirements.txt        # Python dependencies
├── docker-compose.yml           # Container orchestration
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local frontend development)
- Java 17+ (for local backend development)
- Python 3.8+ (for local ML service development)

### Using Docker (Recommended)

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd idp
   ```

2. **Start all services**:
   ```bash
   docker-compose up --build
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - ML Service: http://localhost:5000
   - MongoDB: mongodb://localhost:27017

### Local Development

#### Backend (Spring Boot)
```bash
cd backend
./mvnw spring-boot:run
```

#### Frontend (React)
```bash
cd frontend/hospital-management
npm install
npm start
```

#### ML Service (Python)
```bash
cd ml-service
pip install -r requirements.txt
python api/ml_api.py
```

## 🔧 Configuration

### Environment Variables

#### Backend (application.properties)
- `SPRING_DATA_MONGODB_URI`: MongoDB connection string
- `ML_SERVICE_URL`: ML service endpoint

#### Frontend (.env)
- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_ML_SERVICE_URL`: ML service URL

#### ML Service
- `FLASK_ENV`: Environment (development/production)
- `PYTHONPATH`: Python path

## 📊 Features

### Core Functionality
- ✅ **Symptom-based Disease Prediction**: AI-powered disease prediction
- ✅ **Doctor Specialization Mapping**: Automatic doctor type recommendations
- ✅ **Hospital Department Recommendations**: Department suggestions based on disease
- ✅ **Prediction History**: Complete tracking of all predictions
- ✅ **Doctor Search**: Find doctors by specialization, location, rating
- ✅ **Hospital Search**: Find hospitals with services and departments
- ✅ **Appointment Booking**: Schedule appointments with doctors
- ✅ **Analytics Dashboard**: System overview and statistics

### ML Model Features
- **Diseases Supported**: Common Cold, Flu, COVID-19, Migraine, Pneumonia, etc.
- **Symptoms**: Fever, Cough, Headache, Fatigue, Nausea, Chest Pain, etc.
- **Accuracy**: Trained on healthcare dataset with 85%+ accuracy
- **Recommendations**: Maps diseases to appropriate specializations

### API Endpoints

#### Backend (Spring Boot)
- `GET /api/doctors` - Get all doctors
- `GET /api/hospitals` - Get all hospitals
- `GET /api/predictions` - Get prediction history
- `POST /api/predictions` - Save prediction
- `GET /api/predictions/user/{userId}` - User predictions
- `GET /api/doctors/recommendations` - Get doctor recommendations

#### ML Service (Python Flask)
- `GET /health` - Health check
- `POST /predict` - Disease prediction
- `GET /symptoms` - Get available symptoms
- `GET /diseases` - Get supported diseases
- `GET /model/info` - Model information

## 🏥 Disease to Specialization Mapping

| Disease | Recommended Doctor | Hospital Department |
|----------|-------------------|-------------------|
| Common Cold | General Practitioner | Outpatient |
| Flu | General Practitioner | Outpatient |
| COVID-19 | Infectious Disease Specialist | Isolation Ward |
| Heart Attack | Cardiologist | Cardiology/Emergency |
| Migraine | Neurologist | Neurology |
| Pneumonia | Pulmonologist | Pulmonology |
| Food Poisoning | Gastroenterologist | Gastroenterology |

## 🔒 Security Considerations

- **CORS**: Configured for cross-origin requests
- **Input Validation**: Symptom input validation
- **Data Sanitization**: Clean input data before processing
- **Rate Limiting**: API rate limiting (to be implemented)
- **Authentication**: JWT-based authentication (to be implemented)

## 📈 Monitoring & Logging

### Backend
- Spring Boot Actuator endpoints: `/actuator/health`, `/actuator/info`
- Structured logging with log levels
- MongoDB query logging

### Frontend
- React error boundaries
- API request/response logging
- Performance monitoring

### ML Service
- Flask health checks
- Model performance metrics
- Prediction logging

## 🧪 Testing

### Backend Tests
```bash
cd backend
./mvnw test
```

### Frontend Tests
```bash
cd frontend/hospital-management
npm test
```

### ML Service Tests
```bash
cd ml-service
python -m pytest tests/
```

## 📦 Deployment

### Docker Deployment
```bash
# Build and deploy
docker-compose -f docker-compose.prod.yml up --build -d
```

### Production Considerations
- Use environment-specific configurations
- Enable HTTPS/SSL certificates
- Configure reverse proxy (nginx)
- Set up monitoring and alerting
- Regular database backups
- Model retraining pipeline

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

**ML Service Not Responding**
- Check if Flask app is running on port 5000
- Verify Python dependencies are installed
- Check ML model files exist in `/model` directory

**Database Connection Issues**
- Verify MongoDB is running on port 27017
- Check connection string in application.properties
- Ensure database user has proper permissions

**Frontend Build Errors**
- Run `npm install` to update dependencies
- Check TypeScript configuration
- Verify Material-UI installation

**Docker Issues**
- Clear Docker cache: `docker system prune -f`
- Rebuild images: `docker-compose build --no-cache`
- Check port conflicts

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check existing documentation and FAQs
- Review system logs for error details

---

**Built with ❤️ for improving healthcare accessibility through AI**
