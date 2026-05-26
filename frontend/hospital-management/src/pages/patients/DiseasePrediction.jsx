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
  ListItemText,
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import authService, { normalizeRole } from '../../services/authService';
import predictionService from '../../services/predictionService';
import EmergencyAlert from '../../components/EmergencyAlert';
import {
  buildHealthcareAgentResponse,
  buildInitialChatMessages,
  getAssistantReply,
} from '../../utils/healthcareAgent';
import { getRiskLabel, getRiskColor } from '../../utils/riskLevel';

const TranslationWidget = () => {
  useEffect(() => {
    if (window.google?.translate?.TranslateElement) return;

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return;
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
      }, 'google_translate_element');
    };

    if (!document.querySelector('script[data-google-translate="true"]')) {
      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.dataset.googleTranslate = 'true';
      document.body.appendChild(script);
    }
  }, []);

  return <Box id="google_translate_element" sx={{ minHeight: 38 }} />;
};

const SymptomChecker = () => {
  const [availableSymptoms, setAvailableSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [savedReportId, setSavedReportId] = useState(null);
  const [chatMessages, setChatMessages] = useState([{
    from: 'agent',
    text: 'Hello, I am your Goal-Based Healthcare Assistant. Select symptoms, then I will analyze results and guide your next care step.',
  }]);
  const [chatInput, setChatInput] = useState('');
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const userRole = normalizeRole(currentUser?.role);
  const isPatient = userRole === 'PATIENT';

  useEffect(() => {
    fetchSymptoms();
  }, []);

  const fetchSymptoms = async () => {
    try {
      const symptoms = await predictionService.getSymptoms();
      setAvailableSymptoms(symptoms.map((symptom) => ({ id: symptom, name: symptom })));
    } catch (err) {
      setAvailableSymptoms([
        { id: 'Fever', name: 'Fever' },
        { id: 'Cough', name: 'Cough' },
        { id: 'Headache', name: 'Headache' },
        { id: 'Fatigue', name: 'Fatigue' },
        { id: 'Nausea', name: 'Nausea' },
        { id: 'Chest Pain', name: 'Chest Pain' },
        { id: 'Shortness of Breath', name: 'Shortness of Breath' },
        { id: 'Dizziness', name: 'Dizziness' },
      ]);
    }
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
      const agentResponse = buildHealthcareAgentResponse(result, selectedSymptoms);
      const enrichedResult = { ...result, agentResponse };
      setPredictionResult(enrichedResult);
      setChatMessages(buildInitialChatMessages(agentResponse, isPatient));

      const saved = await savePredictionToHistory(enrichedResult);
      if (saved?.id) setSavedReportId(saved.id);
    } catch (err) {
      console.error('Error predicting:', err);
      setError('Failed to get prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const savePredictionToHistory = async (result) => {
    try {
      const user = authService.getCurrentUser();
      return await predictionService.savePrediction({
        userId: user?.userId,
        symptoms: result.symptoms || selectedSymptoms,
        predictions: result.predictions,
        status: 'completed',
        metadata: {
          timestamp: result.timestamp,
          totalPredictions: result.total_predictions,
          agentType: result.agentResponse?.name,
          riskLevel: result.agentResponse?.riskLevel,
          agentDecision: {
            selectedDisease: result.agentResponse?.selectedDisease,
            confidence: result.agentResponse?.confidence,
            doctorRecommendation: result.agentResponse?.doctorRecommendation,
            hospitalSuggestion: result.agentResponse?.hospitalSuggestion,
          },
          emergency: result.agentResponse?.emergency,
        },
      });
    } catch (err) {
      console.error('Error saving prediction:', err);
      return null;
    }
  };

  const getSeverityColor = (severity) => {
    switch ((severity || '').toLowerCase()) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const handleSendMessage = () => {
    const trimmedInput = chatInput.trim();
    if (!trimmedInput) return;

    const reply = getAssistantReply({
      message: trimmedInput,
      agentResponse: predictionResult?.agentResponse,
      isPatient,
    });

    setChatMessages((messages) => [
      ...messages,
      { from: 'user', text: trimmedInput },
      { from: 'agent', text: reply },
    ]);
    setChatInput('');
  };

  const agent = predictionResult?.agentResponse;

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          AI Agent — Disease Diagnosis
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Goal-Based Healthcare Assistant: symptom analysis, Random Forest prediction, and guided care actions.
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
                onChange={(e) => setSelectedSymptoms(e.target.value)}
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
              {loading ? <CircularProgress size={24} /> : 'Run AI Analysis'}
            </Button>

            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          </CardContent>
        </Card>

        {predictionResult && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <EmergencyAlert
                emergency={agent?.emergency}
                showBook={isPatient}
                onBookUrgent={() => navigate('/appointments')}
              />

              {agent?.riskLevel && (
                <Alert
                  severity={agent.riskLevel === 'critical' || agent.riskLevel === 'high' ? 'warning' : 'info'}
                  sx={{ mb: 2, borderLeft: `4px solid ${getRiskColor(agent.riskLevel)}` }}
                >
                  <Typography fontWeight={700}>{getRiskLabel(agent.riskLevel)}</Typography>
                  {(agent.riskGuidance || []).map((tip) => (
                    <Typography key={tip} variant="body2">• {tip}</Typography>
                  ))}
                </Alert>
              )}

              {agent && (
                <Card sx={{ mb: 3, border: '1px solid #bfdbfe', backgroundColor: '#eff6ff' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Healthcare Assistant Agent
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <TranslationWidget />
                    </Box>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">Selected Disease</Typography>
                        <Typography fontWeight={600}>{agent.selectedDisease}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">Confidence</Typography>
                        <Typography fontWeight={600}>{agent.confidence}</Typography>
                      </Grid>
                    </Grid>

                    <Box sx={{ display: 'grid', gap: 1.2, mb: 2 }}>
                      {chatMessages.map((message, idx) => (
                        <Box
                          key={`${message.from}-${idx}`}
                          sx={{
                            justifySelf: message.from === 'user' ? 'end' : 'start',
                            maxWidth: '85%',
                            p: 1.3,
                            borderRadius: 2,
                            bgcolor: message.from === 'user' ? '#dbeafe' : '#fff',
                            border: '1px solid #dbeafe',
                          }}
                        >
                          <Typography variant="body2">{message.text}</Typography>
                        </Box>
                      ))}
                    </Box>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      <Button size="small" variant="outlined" onClick={() => setChatInput('Which medicines are suggested?')}>
                        Medicines
                      </Button>
                      <Button size="small" variant="outlined" onClick={() => setChatInput('Is this an emergency?')}>
                        Emergency
                      </Button>
                      <Button size="small" variant="outlined" onClick={() => navigate('/medicines', { state: { disease: agent.selectedDisease } })}>
                        Medicine Module
                      </Button>
                      <Button size="small" variant="outlined" onClick={() => navigate(savedReportId ? `/health-report/${savedReportId}` : '/health-report')}>
                        Health Report
                      </Button>
                      {isPatient && (
                        <Button size="small" variant="contained" onClick={() => navigate('/appointments')}>
                          Book Appointment
                        </Button>
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Ask the assistant"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button variant="contained" onClick={handleSendMessage}>Send</Button>
                    </Box>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Prediction Results (Random Forest)</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Symptoms: {predictionResult.symptoms.join(', ')}
                  </Typography>

                  {predictionResult.predictions.map((prediction, index) => (
                    <Card key={index} sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
                      <CardContent>
                        <Typography variant="h6" color="primary">{prediction.name}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                          <Typography variant="body2">
                            Probability: {(prediction.probability * 100).toFixed(1)}%
                          </Typography>
                          <Chip label={prediction.severity} color={getSeverityColor(prediction.severity)} size="small" />
                        </Box>
                        <Typography variant="body2" paragraph>{prediction.description}</Typography>
                        <Typography variant="subtitle2">Doctor: {prediction.doctorSpecialization}</Typography>
                        <Typography variant="subtitle2">Department: {prediction.hospitalDepartment}</Typography>
                        <List dense>
                          {(prediction.recommendations || []).map((rec, idx) => (
                            <ListItem key={idx}><ListItemText primary={`• ${rec}`} /></ListItem>
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
                  <Typography variant="h6" gutterBottom>Quick Actions</Typography>
                  <Button variant="outlined" fullWidth sx={{ mb: 2 }} onClick={() => navigate('/medicines', { state: { disease: agent?.selectedDisease } })}>
                    Medicine Recommendations
                  </Button>
                  <Button variant="outlined" fullWidth sx={{ mb: 2 }} onClick={() => navigate('/health-report')}>
                    Health Report
                  </Button>
                  <Button variant="outlined" fullWidth sx={{ mb: 2 }} onClick={() => navigate('/recommendations')}>
                    Find Doctors
                  </Button>
                  <Button variant="outlined" fullWidth sx={{ mb: 2 }} onClick={() => navigate('/history')}>
                    Prediction History
                  </Button>
                  {isPatient && (
                    <Button variant="outlined" fullWidth sx={{ mb: 2 }} onClick={() => navigate('/appointments')}>
                      Book Appointment
                    </Button>
                  )}
                  <Button variant="outlined" fullWidth onClick={() => { setPredictionResult(null); setSavedReportId(null); }}>
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
