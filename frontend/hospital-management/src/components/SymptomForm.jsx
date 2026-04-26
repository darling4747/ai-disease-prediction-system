import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Typography,
  Paper,
  Autocomplete,
  TextField
} from '@mui/material';
import { LocalHospital, Search } from '@mui/icons-material';
import predictionService from '../services/predictionService';

const SymptomForm = ({ onPredictionResult }) => {
  const [availableSymptoms, setAvailableSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchingSymptoms, setFetchingSymptoms] = useState(true);

  useEffect(() => {
    fetchSymptoms();
  }, []);

  const fetchSymptoms = async () => {
    try {
      setFetchingSymptoms(true);
      const symptoms = await predictionService.getSymptoms();
      setAvailableSymptoms(symptoms);
    } catch (err) {
      console.error('Error fetching symptoms:', err);
      setError('Failed to load symptoms. Using default list.');
    } finally {
      setFetchingSymptoms(false);
    }
  };

  const handleSymptomChange = (event, newValue) => {
    setSelectedSymptoms(newValue);
    setError(null);
  };

  const handlePredict = async () => {
    if (selectedSymptoms.length === 0) {
      setError('Please select at least one symptom');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await predictionService.predictDisease(selectedSymptoms);
      
      // Save to backend
      await predictionService.savePrediction({
        userId: 'user123',
        symptoms: result.symptoms,
        predictions: result.predictions,
        status: 'completed',
        timestamp: result.timestamp
      });

      onPredictionResult(result);
    } catch (err) {
      console.error('Prediction error:', err);
      setError('Failed to get prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LocalHospital color="primary" />
        Select Your Symptoms
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Choose all symptoms you're experiencing for accurate disease prediction
      </Typography>

      {fetchingSymptoms ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Autocomplete
            multiple
            options={availableSymptoms}
            value={selectedSymptoms}
            onChange={handleSymptomChange}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                  key={option}
                  color="primary"
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search and select symptoms"
                placeholder="Type to search symptoms..."
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <Search color="action" sx={{ mr: 1 }} />
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
              />
            )}
            sx={{ mb: 3 }}
          />

          <Button
            variant="contained"
            size="large"
            onClick={handlePredict}
            disabled={loading || selectedSymptoms.length === 0}
            fullWidth
            sx={{ 
              py: 1.5,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
              }
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              `Predict Disease (${selectedSymptoms.length} symptoms selected)`
            )}
          </Button>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </>
      )}
    </Paper>
  );
};

export default SymptomForm;
