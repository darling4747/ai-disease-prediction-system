import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PredictionHistory = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPredictionHistory();
  }, []);

  const fetchPredictionHistory = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/predictions/user/user123');
      if (!response.ok) {
        throw new Error('Failed to fetch prediction history');
      }
      const data = await response.json();
      setPredictions(data);
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Failed to load prediction history');
      
      setPredictions([
        {
          id: '1',
          userId: 'user123',
          symptoms: ['Fever', 'Cough', 'Headache'],
          predictions: [
            {
              name: 'Common Cold',
              probability: 0.85,
              severity: 'low',
              doctorSpecialization: 'General Practitioner',
              hospitalDepartment: 'Outpatient'
            }
          ],
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          status: 'completed'
        }
      ]);
    } finally {
      setLoading(false);
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

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Prediction History
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          View your past disease predictions and track your health journey.
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate('/')}
          sx={{ mb: 3 }}
        >
          New Prediction
        </Button>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {predictions.length === 0 ? (
          <Card>
            <CardContent>
              <Typography variant="h6" align="center" color="text.secondary">
                No prediction history found
              </Typography>
              <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 2 }}>
                Start by making your first disease prediction.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {predictions.map((prediction) => (
              <Grid item xs={12} md={6} key={prediction.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {formatDate(prediction.timestamp)}
                    </Typography>
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Symptoms:
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      {prediction.symptoms.map((symptom, index) => (
                        <Chip
                          key={index}
                          label={symptom}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle2" gutterBottom>
                      Predictions:
                    </Typography>
                    <List dense>
                      {prediction.predictions.map((pred, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                          <ListItemText
                            primary={
                              <Box>
                                <Typography variant="body2" fontWeight="bold">
                                  {pred.name}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                  <Typography variant="caption" sx={{ mr: 1 }}>
                                    {(pred.probability * 100).toFixed(1)}%
                                  </Typography>
                                  <Chip
                                    label={pred.severity}
                                    color={getSeverityColor(pred.severity)}
                                    size="small"
                                  />
                                </Box>
                                <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                                  Doctor: {pred.doctorSpecialization}
                                </Typography>
                                <Typography variant="caption" display="block">
                                  Department: {pred.hospitalDepartment}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>

                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate('/recommendations')}
                      sx={{ mt: 2 }}
                    >
                      Find Doctors
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default PredictionHistory;
