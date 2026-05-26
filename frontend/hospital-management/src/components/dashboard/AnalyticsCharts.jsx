import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#8b5cf6'];

const toChartData = (frequency = {}) =>
  Object.entries(frequency)
    .map(([name, value]) => ({ name, count: Number(value) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

const AnalyticsCharts = ({ diseaseFrequency = {}, modelComparison = [] }) => {
  const diseaseData = toChartData(diseaseFrequency);
  const modelData = (modelComparison || []).map((model) => ({
    name: model.name?.replace(' ', '\n') || 'Model',
    accuracy: Math.round((model.test_accuracy || model.cv_accuracy || 0) * 100),
    selected: model.selected,
  }));

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={7}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Disease Prediction Trends
            </Typography>
            {diseaseData.length ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={diseaseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Typography color="text.secondary">No prediction data yet. Run AI Diagnosis to populate trends.</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={5}>
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Disease Distribution
            </Typography>
            {diseaseData.length ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={diseaseData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {diseaseData.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Typography color="text.secondary">Distribution chart will appear after predictions are saved.</Typography>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              ML Model Accuracy Comparison
            </Typography>
            {modelData.length ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={modelData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} unit="%" />
                  <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Test accuracy']} />
                  <Legend />
                  <Bar dataKey="accuracy" name="Accuracy %" fill="#10b981" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Typography color="text.secondary">Model metrics load from the ML service.</Typography>
            )}
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
              Primary production model: Random Forest
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default AnalyticsCharts;
