import React from 'react';
import { Card as MuiCard, CardContent, Typography, Box } from '@mui/material';

const Card = ({
  title,
  subtitle,
  children,
  action,
  headerSx,
  ...props
}) => {
  return (
    <MuiCard {...props}>
      {(title || subtitle || action) && (
        <Box sx={{ p: 2, pb: 0, ...headerSx }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              {title && (
                <Typography variant="h6" component="div" gutterBottom={!!subtitle}>
                  {title}
                </Typography>
              )}
              {subtitle && (
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
            {action && <Box>{action}</Box>}
          </Box>
        </Box>
      )}
      <CardContent>
        {children}
      </CardContent>
    </MuiCard>
  );
};

export default Card;
