import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';

const Chart = ({
  title,
  data,
  type = 'bar',
  height = 300
}) => {
  const theme = useTheme();
  const maxValue = Math.max(...data.values);
  const totalValue = data.values.reduce((a, b) => a + b, 0);

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        
        <Box sx={{ height, mt: 2 }}>
          {type === 'bar' && (
            <Box sx={{ display: 'flex', alignItems: 'flex-end', height: '100%', gap: 1 }}>
              {data.labels.map((label, index) => {
                const value = data.values[index];
                const heightPercent = maxValue > 0 ? (value / maxValue) * 100 : 0;
                
                return (
                  <Box key={label} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: '100%',
                        height: `${heightPercent}%`,
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: 1,
                        transition: 'height 0.3s ease',
                        minHeight: 20,
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        pb: 0.5
                      }}
                    >
                      <Typography variant="caption" color="white" fontWeight="bold">
                        {value}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ mt: 1, fontSize: '0.7rem' }}>
                      {label}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          )}
          
          {type === 'pie' && (
            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <Box sx={{ position: 'relative', width: 200, height: 200, mx: 'auto' }}>
                {data.values.map((value, index) => {
                  const percentage = totalValue > 0 ? (value / totalValue) * 360 : 0;
                  const colors = [theme.palette.primary.main, theme.palette.secondary.main, theme.palette.success.main, theme.palette.warning.main, theme.palette.error.main];
                  
                  return (
                    <Box
                      key={index}
                      sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        background: `conic-gradient(${colors[index % colors.length]} ${percentage}deg, transparent ${percentage}deg)`,
                        transform: `rotate(${data.values.slice(0, index).reduce((a, b) => a + (totalValue > 0 ? (b / totalValue) * 360 : 0), 0)}deg)`
                      }}
                    />
                  );
                })}
              </Box>
              <Box sx={{ ml: 2 }}>
                {data.labels.map((label, index) => {
                  const colors = [theme.palette.primary.main, theme.palette.secondary.main, theme.palette.success.main, theme.palette.warning.main, theme.palette.error.main];
                  return (
                    <Box key={label} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          backgroundColor: colors[index % colors.length],
                          borderRadius: '50%',
                          mr: 1
                        }}
                      />
                      <Typography variant="body2">
                        {label}: {data.values[index]}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default Chart;
