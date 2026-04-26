import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SymptomChecker = () => {
  const [availableSymptoms, setAvailableSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSymptoms();
  }, []);

  const fetchSymptoms = async () => {
    try {
      const response = await fetch('http://localhost:5000/symptoms');
      if (!response.ok) {
        throw new Error('Failed to fetch symptoms');
      }
      const data = await response.json();
      setAvailableSymptoms(data.symptoms.map((symptom) => ({
        id: symptom,
        name: symptom
      })));
    } catch (err) {
      console.error('Error fetching symptoms:', err);
      setAvailableSymptoms([
        { id: 'Fever', name: 'Fever' },
        { id: 'Cough', name: 'Cough' },
        { id: 'Headache', name: 'Headache' },
        { id: 'Fatigue', name: 'Fatigue' },
        { id: 'Nausea', name: 'Nausea' },
        { id: 'Chest Pain', name: 'Chest Pain' },
        { id: 'Shortness of Breath', name: 'Shortness of Breath' },
        { id: 'Dizziness', name: 'Dizziness' },
        { id: 'Body Aches', name: 'Body Aches' },
        { id: 'Sore Throat', name: 'Sore Throat' }
      ]);
    }
  };

  const handleSymptomChange = (event) => {
    setSelectedSymptoms(event.target.value);
  };

  const handlePredict = async () => {
    if (selectedSymptoms.length === 0) {
      setError('Please select at least one symptom');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptoms: selectedSymptoms }),
      });

      if (!response.ok) {
        throw new Error('Prediction failed');
      }

      const result = await response.json();
      setPredictionResult(result);

      await savePredictionToHistory(result);

    } catch (err) {
      console.error('Error predicting:', err);
      setError('Failed to get prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const savePredictionToHistory = async (result) => {
    try {
      await fetch('http://localhost:8080/api/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user123',
          symptoms: result.symptoms,
          predictions: result.predictions,
          status: 'completed',
          metadata: {
            timestamp: result.timestamp,
            totalPredictions: result.total_predictions
          }
        }),
      });
    } catch (err) {
      console.error('Error saving prediction:', err);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          AI Disease Prediction System
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Select your symptoms to get AI-powered disease predictions and doctor recommendations.
        </Typography>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Select Symptoms
            </Typography>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="symptoms-select-label">Choose Symptoms</InputLabel>
              <Select
                labelId="symptoms-select-label"
                multiple
                value={selectedSymptoms}
                onChange={handleSymptomChange}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {availableSymptoms.map((symptom) => (
                  <MenuItem key={symptom.id} value={symptom.name}>
                    {symptom.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              size="large"
              onClick={handlePredict}
              disabled={loading || selectedSymptoms.length === 0}
              fullWidth
            >
              {loading ? <CircularProgress size={24} /> : 'Predict Diseases'}
            </Button>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </CardContent>
        </Card>

        {predictionResult && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Prediction Results
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Based on symptoms: {predictionResult.symptoms.join(', ')}
                  </Typography>
                  
                  {predictionResult.predictions.map((prediction, index) => (
                    <Card key={index} sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
                      <CardContent>
                        <Typography variant="h6" color="primary">
                          {prediction.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" sx={{ mr: 2 }}>
                            Probability: {(prediction.probability * 100).toFixed(1)}%
                          </Typography>
                          <Chip 
                            label={prediction.severity} 
                            color={getSeverityColor(prediction.severity)}
                            size="small"
                          />
                        </Box>
                        <Typography variant="body2" paragraph>
                          {prediction.description}
                        </Typography>
                        
                        <Typography variant="subtitle2" gutterBottom>
                          Recommended Doctor: {prediction.doctorSpecialization}
                        </Typography>
                        <Typography variant="subtitle2" gutterBottom>
                          Hospital Department: {prediction.hospitalDepartment}
                        </Typography>
                        
                        <Typography variant="subtitle2" gutterBottom>
                          Common Symptoms:
                        </Typography>
                        <List dense>
                          {prediction.commonSymptoms.map((symptom, idx) => (
                            <ListItem key={idx}>
                              <ListItemText primary={`• ${symptom}`} />
                            </ListItem>
                          ))}
                        </List>
                        
                        <Typography variant="subtitle2" gutterBottom>
                          Recommendations:
                        </Typography>
                        <List dense>
                          {prediction.recommendations.map((rec, idx) => (
                            <ListItem key={idx}>
                              <ListItemText primary={`• ${rec}`} />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Quick Actions
                  </Typography>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                    onClick={() => navigate('/recommendations')}
                  >
                    Find Doctors
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                    onClick={() => navigate('/history')}
                  >
                    View History
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => setPredictionResult(null)}
                  >
                    New Prediction
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default SymptomChecker;
