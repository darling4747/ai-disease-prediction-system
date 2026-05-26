import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { MedicalServices, People, Schedule } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import predictionService from '../../services/predictionService';
import appointmentService from '../../services/appointmentService';
import { getRiskLevel, getRiskLabel } from '../../utils/riskLevel';

const getTopDisease = (record) => {
  const preds = record?.predictions || [];
  if (!preds.length) return 'Unknown';
  const top = [...preds].sort((a, b) => Number(b.probability || 0) - Number(a.probability || 0))[0];
  return top?.name || 'Unknown';
};

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [cases, setCases] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [advice, setAdvice] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [caseData, apptData, stats] = await Promise.all([
        predictionService.getAllPredictions(),
        appointmentService.getAllAppointments().catch(() => ({ appointments: [] })),
        predictionService.getSystemAnalytics().catch(() => null),
      ]);
      setCases(Array.isArray(caseData) ? caseData : []);
      setAppointments(apptData?.appointments || apptData || []);
      setAnalytics(stats);
    } catch (error) {
      console.error('Doctor dashboard load failed', error);
    }
  };

  const handleSaveAdvice = async () => {
    if (!selectedCase?.id || !advice.trim()) return;
    setSaving(true);
    setMessage(null);
    try {
      await predictionService.addMedicalAdvice(selectedCase.id, advice.trim());
      setMessage('Medical advice saved to patient report.');
      setAdvice('');
      await loadData();
    } catch (error) {
      setMessage('Failed to save advice.');
    } finally {
      setSaving(false);
    }
  };

  const criticalCases = cases.filter((c) => {
    const disease = getTopDisease(c);
    const risk = getRiskLevel(disease);
    return risk === 'critical' || risk === 'high';
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <MedicalServices color="primary" sx={{ fontSize: 40 }} />
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Doctor Dashboard
          </Typography>
          <Typography color="text.secondary">
            Welcome, Dr. {user?.firstName} {user?.lastName} — patient predictions, reports, and appointments
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <People color="primary" />
              <Typography variant="h4">{cases.length}</Typography>
              <Typography color="text.secondary">Patient cases</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Schedule color="warning" />
              <Typography variant="h4">{appointments.length}</Typography>
              <Typography color="text.secondary">Appointments</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="error.main">
                {criticalCases.length}
              </Typography>
              <Typography color="text.secondary">High-risk cases</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {analytics && (
        <Alert severity="info" sx={{ mb: 2 }}>
          System analytics: {analytics.totalPredictions} predictions, {analytics.criticalCases} flagged critical/high.
        </Alert>
      )}

      {message && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setMessage(null)}>
          {message}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Patient predictions & reports
              </Typography>
              <Stack spacing={1.5}>
                {cases.length === 0 && (
                  <Typography color="text.secondary">No cases in your specialty scope yet.</Typography>
                )}
                {cases.slice(0, 12).map((item) => {
                  const disease = getTopDisease(item);
                  const risk = getRiskLevel(disease);
                  return (
                    <Box
                      key={item.id}
                      sx={{
                        p: 1.5,
                        border: '1px solid',
                        borderColor: selectedCase?.id === item.id ? 'primary.main' : 'divider',
                        borderRadius: 2,
                        cursor: 'pointer',
                      }}
                      onClick={() => setSelectedCase(item)}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                        <Typography fontWeight={700}>{disease}</Typography>
                        <Chip size="small" label={getRiskLabel(risk)} color={risk === 'critical' ? 'error' : 'default'} />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {(item.symptoms || []).join(', ')}
                      </Typography>
                      <Typography variant="caption">
                        {new Date(item.timestamp).toLocaleString()}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        <Button size="small" onClick={(e) => { e.stopPropagation(); navigate(`/health-report/${item.id}`); }}>
                          View report
                        </Button>
                        <Button size="small" onClick={(e) => { e.stopPropagation(); navigate('/medicines', { state: { disease } }); }}>
                          Medicines
                        </Button>
                      </Stack>
                    </Box>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Add medical advice
              </Typography>
              {selectedCase ? (
                <>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Case: {getTopDisease(selectedCase)} — {(selectedCase.symptoms || []).join(', ')}
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    minRows={4}
                    label="Doctor advice / report notes"
                    value={advice}
                    onChange={(e) => setAdvice(e.target.value)}
                  />
                  <Button
                    sx={{ mt: 2 }}
                    variant="contained"
                    disabled={saving || !advice.trim()}
                    onClick={handleSaveAdvice}
                  >
                    Save to health report
                  </Button>
                </>
              ) : (
                <Typography color="text.secondary">Select a case to add advice.</Typography>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming appointments
              </Typography>
              <Stack spacing={1}>
                {(appointments.slice(0, 6) || []).map((appt) => (
                  <Box key={appt.id || appt._id} sx={{ p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
                    <Typography fontWeight={600}>{appt.patientName || 'Patient'}</Typography>
                    <Typography variant="body2">{appt.doctorName || user?.firstName}</Typography>
                    <Typography variant="caption">
                      {appt.appointmentDate
                        ? new Date(appt.appointmentDate).toLocaleString()
                        : 'Scheduled'}
                    </Typography>
                  </Box>
                ))}
                {!appointments.length && (
                  <Typography color="text.secondary">No appointments scheduled.</Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DoctorDashboard;
