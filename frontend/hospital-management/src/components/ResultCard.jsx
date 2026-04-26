import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button
} from '@mui/material';
import {
  LocalHospital,
  Person,
  Business,
  Warning,
  CheckCircle,
  Error,
  Info
} from '@mui/icons-material';

const ResultCard = ({ prediction, index }) => {
  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'low': return <CheckCircle color="success" />;
      case 'medium': return <Warning color="warning" />;
      case 'high': return <Error color="error" />;
      default: return <Info />;
    }
  };

  const probability = Math.round((prediction.probability || 0) * 100);

  return (
    <Card 
      elevation={4} 
      sx={{ 
        mb: 3,
        borderLeft: 4,
        borderColor: getSeverityColor(prediction.severity) + '.main',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            #{index + 1} {prediction.name}
            {getSeverityIcon(prediction.severity)}
          </Typography>
          <Chip 
            label={prediction.severity?.toUpperCase() || 'UNKNOWN'} 
            color={getSeverityColor(prediction.severity)}
            size="small"
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Probability: {probability}%
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={probability} 
            color={getSeverityColor(prediction.severity)}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        <Typography variant="body2" color="text.secondary" paragraph>
          {prediction.description}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Person color="primary" fontSize="small" />
            <Typography variant="body2">
              <strong>Doctor:</strong> {prediction.doctorSpecialization}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Business color="primary" fontSize="small" />
            <Typography variant="body2">
              <strong>Department:</strong> {prediction.hospitalDepartment}
            </Typography>
          </Box>
        </Box>

        {prediction.commonSymptoms && prediction.commonSymptoms.length > 0 && (
          <>
            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
              Common Symptoms:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              {prediction.commonSymptoms.map((symptom, idx) => (
                <Chip key={idx} label={symptom} size="small" variant="outlined" />
              ))}
            </Box>
          </>
        )}

        {prediction.recommendations && prediction.recommendations.length > 0 && (
          <>
            <Typography variant="subtitle2" gutterBottom>
              Recommendations:
            </Typography>
            <List dense>
              {prediction.recommendations.map((rec, idx) => (
                <ListItem key={idx} sx={{ py: 0 }}>
                  <ListItemText 
                    primary={`• ${rec}`}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultCard;
