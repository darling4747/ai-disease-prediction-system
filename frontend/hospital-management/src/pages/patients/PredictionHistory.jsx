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
import authService from '../../services/authService';
import predictionService from '../../services/predictionService';

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
      const currentUser = authService.getCurrentUser();
      const data = currentUser?.role === 'DOCTOR'
        ? await predictionService.getAllPredictions()
        : await predictionService.getPredictionHistory(currentUser?.userId);
      setPredictions(data);
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Failed to load prediction history');
      setPredictions([]);
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
          MongoDB-backed prediction history with health reports and medicine guidance.
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
                      {(prediction.symptoms || []).map((symptom, index) => (
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
                      {(prediction.predictions || []).map((pred, index) => (
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

                    {prediction.metadata?.medicalAdvice && (
                      <Alert severity="info" sx={{ mt: 1, mb: 1 }}>
                        Doctor advice: {prediction.metadata.medicalAdvice}
                      </Alert>
                    )}

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate(`/health-report/${prediction.id}`)}
                      >
                        Health Report
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate('/medicines', {
                          state: { disease: prediction.predictions?.[0]?.name },
                        })}
                      >
                        Medicines
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate('/recommendations')}
                      >
                        Find Doctors
                      </Button>
                    </Box>
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
