import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { LocalPharmacy, Medication } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import diseaseMap, {
  getAllDiseases,
  getDiseaseInfo,
  getMedicinesForDisease,
  getPrecautionsForDisease,
} from '../../utils/diseaseMap';
import predictionService from '../../services/predictionService';
import authService from '../../services/authService';

const selectTopDisease = (predictions = []) => {
  const list = Array.isArray(predictions) ? predictions : [];
  if (!list.length) return '';
  const sorted = [...list].sort(
    (a, b) => Number(b.probability || 0) - Number(a.probability || 0)
  );
  return sorted[0]?.name || sorted[0]?.predictions?.[0]?.name || '';
};

const MedicineRecommendation = () => {
  const location = useLocation();
  const [selectedDisease, setSelectedDisease] = useState(
    location.state?.disease || ''
  );
  const [recentDisease, setRecentDisease] = useState('');

  useEffect(() => {
    const loadRecent = async () => {
      if (location.state?.disease) return;
      try {
        const user = authService.getCurrentUser();
        const history = await predictionService.getPredictionHistory(user?.userId);
        const latest = history?.[0];
        const disease = selectTopDisease(latest?.predictions);
        if (disease) {
          setRecentDisease(disease);
          setSelectedDisease((prev) => prev || disease);
        }
      } catch (error) {
        console.error('Failed to load recent prediction', error);
      }
    };
    loadRecent();
  }, [location.state?.disease]);

  const diseaseInfo = useMemo(
    () => getDiseaseInfo(selectedDisease),
    [selectedDisease]
  );

  const medicines = getMedicinesForDisease(selectedDisease);
  const precautions = getPrecautionsForDisease(selectedDisease);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
        <LocalPharmacy color="primary" sx={{ fontSize: 36 }} />
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Medicine Recommendation
          </Typography>
          <Typography color="text.secondary">
            Basic medicine suggestions and healthcare precautions by predicted disease
          </Typography>
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        For educational support only — not a prescription. Always consult a licensed healthcare provider before taking medication.
      </Alert>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <FormControl fullWidth>
            <InputLabel>Select disease</InputLabel>
            <Select
              value={selectedDisease}
              label="Select disease"
              onChange={(e) => setSelectedDisease(e.target.value)}
            >
              {getAllDiseases().map((disease) => (
                <MenuItem key={disease} value={disease}>
                  {disease}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {recentDisease && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Latest prediction: {recentDisease}
            </Typography>
          )}
        </CardContent>
      </Card>

      {selectedDisease && diseaseInfo ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Medication color="primary" />
                  <Typography variant="h6">Suggested Medicines</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {diseaseInfo.description}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {medicines.map((med) => (
                    <Chip key={med} label={med} color="primary" variant="outlined" />
                  ))}
                </Box>
                <Typography variant="subtitle2" sx={{ mt: 2 }}>
                  Recommended specialist: {diseaseInfo.specialization}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Precautions & Self-Care
                </Typography>
                {precautions.map((tip) => (
                  <Typography key={tip} variant="body2" sx={{ mb: 1 }}>
                    • {tip}
                  </Typography>
                ))}
                <Chip
                  label={`Risk: ${diseaseInfo.severity}`}
                  color={
                    diseaseInfo.severity === 'critical' || diseaseInfo.severity === 'high'
                      ? 'error'
                      : diseaseInfo.severity === 'medium'
                        ? 'warning'
                        : 'success'
                  }
                  size="small"
                  sx={{ mt: 2 }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Typography color="text.secondary">
          Select a disease to view medicine and precaution guidance.
        </Typography>
      )}

      <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block' }}>
        Covers {Object.keys(diseaseMap).length} conditions in the knowledge base.
      </Typography>
    </Container>
  );
};

export default MedicineRecommendation;
