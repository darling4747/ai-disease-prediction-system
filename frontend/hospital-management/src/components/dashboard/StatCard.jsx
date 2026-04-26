import React from 'react';
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  color = 'primary'
}) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
            {subtitle && (
              <Typography color="textSecondary" variant="caption">
                {subtitle}
              </Typography>
            )}
            {trend && trendValue && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {trend === 'up' ? (
                  <TrendingUp fontSize="small" color="success" />
                ) : (
                  <TrendingDown fontSize="small" color="error" />
                )}
                <Typography
                  variant="body2"
                  sx={{ ml: 0.5 }}
                  color={trend === 'up' ? 'success.main' : 'error.main'}
                >
                  {trendValue}
                </Typography>
              </Box>
            )}
          </Box>
          <IconButton
            sx={{
              backgroundColor: `${color}.main`,
              color: 'white',
              '&:hover': {
                backgroundColor: `${color}.dark`,
              }
            }}
          >
            {icon}
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
