import React from 'react';
import { Alert, AlertTitle, Box, Button, List, ListItem, ListItemText, Stack } from '@mui/material';
import { LocalHospital, Warning } from '@mui/icons-material';

const EmergencyAlert = ({ emergency, onBookUrgent, showBook = false }) => {
  if (!emergency) return null;

  const severity = emergency.level === 'critical' ? 'error' : 'warning';

  return (
    <Alert
      severity={severity}
      icon={emergency.level === 'critical' ? <Warning /> : <LocalHospital />}
      sx={{ mb: 2 }}
    >
      <AlertTitle sx={{ fontWeight: 800 }}>{emergency.title}</AlertTitle>
      {emergency.message}
      {emergency.actions?.length > 0 && (
        <List dense sx={{ mt: 1, py: 0 }}>
          {emergency.actions.map((action) => (
            <ListItem key={action} sx={{ py: 0.2, px: 0 }}>
              <ListItemText primary={`• ${action}`} primaryTypographyProps={{ fontSize: '0.85rem' }} />
            </ListItem>
          ))}
        </List>
      )}
      {showBook && (
        <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
          <Button size="small" variant="contained" color="error" href="tel:911">
            Call 911
          </Button>
          {onBookUrgent && (
            <Button size="small" variant="outlined" onClick={onBookUrgent}>
              Book Urgent Visit
            </Button>
          )}
        </Stack>
      )}
      <Box sx={{ mt: 1, fontSize: '0.75rem', opacity: 0.85 }}>
        This alert is automated decision support — not a substitute for emergency services.
      </Box>
    </Alert>
  );
};

export default EmergencyAlert;
