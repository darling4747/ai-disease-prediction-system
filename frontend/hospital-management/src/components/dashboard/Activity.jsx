import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Box,
  Chip
} from '@mui/material';
import {
  LocalHospital,
  Person,
  Assignment,
  Schedule
} from '@mui/icons-material';

const Activity = ({
  title = 'Recent Activity',
  activities
}) => {
  const getIcon = (type) => {
    switch (type) {
      case 'prediction':
        return <LocalHospital />;
      case 'appointment':
        return <Schedule />;
      case 'patient':
        return <Person />;
      default:
        return <Assignment />;
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'prediction':
        return 'primary';
      case 'appointment':
        return 'secondary';
      case 'patient':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        
        <List sx={{ width: '100%' }}>
          {activities.map((activity) => (
            <ListItem
              key={activity.id}
              alignItems="flex-start"
              sx={{ px: 0 }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: `${getIconColor(activity.type)}.main` }}>
                  {getIcon(activity.type)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle2" component="span">
                      {activity.title}
                    </Typography>
                    {activity.status && (
                      <Chip
                        size="small"
                        color={getStatusColor(activity.status)}
                        label={activity.status}
                      />
                    )}
                  </Box>
                }
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {activity.description}
                    </Typography>
                    <br />
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                    >
                      {activity.timestamp}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
        
        {activities.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="textSecondary">
              No recent activity
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default Activity;
