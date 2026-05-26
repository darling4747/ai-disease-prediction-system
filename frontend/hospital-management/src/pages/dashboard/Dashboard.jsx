import React, { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  Typography
} from '@mui/material';
import {
  ArrowDownward,
  ArrowForward,
  ArrowUpward,
  AutoAwesome,
  Bed,
  CalendarToday,
  Favorite,
  HealthAndSafety,
  Insights,
  LocalHospital,
  LocalPharmacy,
  MedicalServices,
  MonitorHeart,
  NorthEast,
  People,
  Psychology,
  Science,
  TrendingUp,
  TravelExplore
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import doctorService from '../../services/doctorService';
import hospitalService from '../../services/hospitalService';
import predictionService from '../../services/predictionService';
import appointmentService from '../../services/appointmentService';
import authService from '../../services/authService';
import mlService from '../../services/mlService';
import AnalyticsCharts from '../../components/dashboard/AnalyticsCharts';

const panelSx = {
  color: '#f5f3dd',
  border: '1px solid rgba(239, 241, 111, 0.14)',
  borderRadius: '8px',
  background:
    'linear-gradient(145deg, rgba(28, 28, 33, 0.98), rgba(13, 14, 18, 0.98))',
  boxShadow: '0 18px 42px rgba(0, 0, 0, 0.34)',
  overflow: 'hidden'
};

const mutedText = '#9da0ad';
const accent = '#eff16f';
const aqua = '#79d7be';
const coral = '#ff867e';
const green = '#83e07b';

const buildFrequencyFromPredictions = (predictions = []) => {
  const frequency = {};
  predictions.forEach((record) => {
    (record.predictions || []).forEach((pred) => {
      const name = pred?.name;
      if (name) frequency[name] = (frequency[name] || 0) + 1;
    });
  });
  return frequency;
};

const normalizeList = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.doctors)) return value.doctors;
  if (Array.isArray(value?.hospitals)) return value.hospitals;
  if (Array.isArray(value?.predictions)) return value.predictions;
  if (Array.isArray(value?.appointments)) return value.appointments;
  return [];
};

const buildSparkPath = (points) => {
  const values = points.length ? points : [20, 36, 28, 48, 42, 66, 58, 74];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  return values
    .map((point, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * 100;
      const y = 82 - ((point - min) / range) * 58;
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
};

const formatDateTime = (value) => {
  if (!value) return 'Not scheduled';
  return new Date(value).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getPredictionName = (prediction) => (
  prediction?.predictions?.[0]?.name
  || prediction?.disease
  || prediction?.predictedDisease
  || 'Pending diagnosis'
);

const getSymptoms = (prediction) => {
  const symptoms = prediction?.symptoms;
  if (Array.isArray(symptoms) && symptoms.length) return symptoms.join(', ');
  if (typeof symptoms === 'string' && symptoms.trim()) return symptoms;
  return 'Symptoms awaiting review';
};

const SparklineCard = ({
  color,
  icon,
  label,
  note,
  onOpen,
  series,
  title,
  trend,
  trendType = 'up',
  value
}) => {
  const path = buildSparkPath(series);
  const TrendIcon = trendType === 'down' ? ArrowDownward : ArrowUpward;

  return (
    <Card sx={{ ...panelSx, minHeight: 214 }}>
      <CardContent sx={{ p: 2.5, height: '100%', position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: 0.32,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '10px 10px'
          }}
        />
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.3 }}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '8px',
                  bgcolor: 'rgba(255,255,255,0.08)',
                  color,
                  display: 'grid',
                  placeItems: 'center'
                }}
              >
                {icon}
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
                  {title}
                </Typography>
                <Typography sx={{ color: mutedText, fontSize: '0.78rem' }}>
                  {label}
                </Typography>
              </Box>
            </Box>
            <IconButton
              aria-label={`Open ${title}`}
              onClick={onOpen}
              sx={{
                width: 36,
                height: 36,
                color,
                border: `1px solid ${color}55`,
                bgcolor: `${color}12`
              }}
            >
              <NorthEast sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          <Typography sx={{ fontSize: '2.2rem', lineHeight: 1, fontWeight: 500, mb: 1 }}>
            {value}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, color: trendType === 'down' ? coral : green }}>
            <TrendIcon sx={{ fontSize: 16 }} />
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 700 }}>{trend}</Typography>
            <Typography sx={{ color: mutedText, fontSize: '0.75rem' }}>{note}</Typography>
          </Box>

          <Box sx={{ mt: 1.5, height: 72 }}>
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d={`${path} L 100 100 L 0 100 Z`}
                fill={color}
                opacity="0.08"
              />
              <path
                d={path}
                fill="none"
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
              />
            </svg>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const CoverageMap = ({ stats, onViewDetails }) => {
  const coverageDots = [
    ['11%', '38%', true], ['14%', '34%', true], ['16%', '42%', true],
    ['19%', '31%', false], ['23%', '48%', false], ['28%', '41%', true],
    ['32%', '55%', true], ['34%', '62%', true], ['38%', '66%', true],
    ['45%', '35%', false], ['49%', '30%', false], ['52%', '38%', false],
    ['55%', '45%', false], ['58%', '32%', false], ['61%', '39%', false],
    ['65%', '47%', false], ['68%', '55%', false], ['71%', '42%', false],
    ['74%', '49%', false], ['78%', '36%', false], ['82%', '44%', false],
    ['86%', '57%', false], ['76%', '66%', false], ['69%', '70%', false]
  ];

  const rows = [
    { label: 'AI diagnosis requests', value: stats.totalPredictions.toLocaleString(), color: accent },
    { label: 'Verified doctors', value: stats.totalDoctors.toLocaleString(), color: aqua },
    { label: 'Smart hospitals', value: stats.totalHospitals.toLocaleString(), color: green },
    { label: 'Care bookings', value: stats.totalAppointments.toLocaleString(), color: coral }
  ];

  return (
    <Card sx={{ ...panelSx, minHeight: 394 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography sx={{ fontSize: '1.05rem', fontWeight: 800 }}>
              Smart Hospital Recommendation Coverage
            </Typography>
            <Typography sx={{ color: mutedText, fontSize: '0.82rem' }}>
              Symptom outcomes mapped to doctors, hospitals, and appointment capacity.
            </Typography>
          </Box>
          <Button
            size="small"
            endIcon={<ArrowForward />}
            onClick={onViewDetails}
            sx={{ color: accent, display: { xs: 'none', sm: 'inline-flex' } }}
          >
            View details
          </Button>
        </Box>

        <Grid container spacing={2.5} alignItems="stretch">
          <Grid item xs={12} md={7}>
            <Box
              sx={{
                position: 'relative',
                minHeight: 270,
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.08)',
                background:
                  'radial-gradient(circle at 25% 40%, rgba(239,241,111,0.12), transparent 24%), linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: '12%',
                  opacity: 0.34,
                  backgroundImage:
                    'radial-gradient(circle, rgba(255,255,255,0.62) 1px, transparent 1.8px)',
                  backgroundSize: '10px 10px',
                  maskImage:
                    'linear-gradient(90deg, transparent 0%, #000 14%, #000 88%, transparent 100%)'
                }}
              />
              {coverageDots.map(([left, top, active], index) => (
                <Box
                  key={`${left}-${top}-${index}`}
                  sx={{
                    position: 'absolute',
                    left,
                    top,
                    width: active ? 8 : 5,
                    height: active ? 8 : 5,
                    borderRadius: '50%',
                    bgcolor: active ? accent : 'rgba(255,255,255,0.18)',
                    boxShadow: active ? `0 0 16px ${accent}` : 'none'
                  }}
                />
              ))}
              <Box
                sx={{
                  position: 'absolute',
                  left: '10%',
                  right: '13%',
                  top: '50%',
                  height: 1,
                  bgcolor: 'rgba(239,241,111,0.24)',
                  transform: 'rotate(-7deg)'
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  left: 20,
                  bottom: 18,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: accent
                }}
              >
                <TravelExplore sx={{ fontSize: 18 }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 700 }}>
                  Recommendation network active
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={5}>
            <Stack spacing={1.4}>
              {rows.map((row) => (
                <Box
                  key={row.label}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    p: 1.5,
                    minHeight: 52,
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    bgcolor: 'rgba(255,255,255,0.035)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: row.color }} />
                    <Typography sx={{ color: '#e7e5d6', fontSize: '0.88rem' }}>{row.label}</Typography>
                  </Box>
                  <Typography sx={{ color: '#fffde8', fontWeight: 800 }}>{row.value}</Typography>
                </Box>
              ))}
            </Stack>

            <Box sx={{ mt: 2, p: 1.5, borderRadius: '8px', bgcolor: 'rgba(239,241,111,0.08)' }}>
              <Typography sx={{ color: accent, fontWeight: 800, fontSize: '0.88rem', mb: 0.6 }}>
                Recommendation logic
              </Typography>
              <Typography sx={{ color: '#d0cfbd', fontSize: '0.82rem', lineHeight: 1.6 }}>
                Doctor specialty, hospital availability, disease category, and appointment readiness
                are prioritized after prediction.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const RiskPanel = ({ score, onDetails }) => {
  const factors = [
    { label: 'Severe symptom cluster', range: '> 90%', color: coral, width: '88%' },
    { label: 'Specialist urgency', range: '60% - 90%', color: '#ffc46b', width: '72%' },
    { label: 'Hospital match confidence', range: '40% - 60%', color: accent, width: '54%' },
    { label: 'Low-risk self care cues', range: '< 40%', color: green, width: '33%' }
  ];

  return (
    <Card sx={{ ...panelSx, minHeight: 394 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography sx={{ fontSize: '1.05rem', fontWeight: 800 }}>
              Care Priority Index
            </Typography>
            <Typography sx={{ color: mutedText, fontSize: '0.82rem' }}>
              Triage signal for recommendation routing.
            </Typography>
          </Box>
          <Button size="small" onClick={onDetails} sx={{ color: accent, minWidth: 0 }}>
            Details
          </Button>
        </Box>

        <Box sx={{ height: 158, position: 'relative', overflow: 'hidden', mb: 2 }}>
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              bottom: -114,
              width: 300,
              height: 300,
              transform: 'translateX(-50%)',
              borderRadius: '50%',
              background:
                'conic-gradient(from 220deg, #7de381 0deg 52deg, #eff16f 52deg 112deg, #ffc46b 112deg 154deg, #ff867e 154deg 205deg, rgba(255,255,255,0.08) 205deg 360deg)'
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              bottom: -84,
              width: 236,
              height: 236,
              transform: 'translateX(-50%)',
              borderRadius: '50%',
              bgcolor: '#15161b',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          />
          <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 8, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '2.4rem', lineHeight: 1, fontWeight: 500 }}>
              {score}%
            </Typography>
            <Typography sx={{ color: mutedText, fontSize: '0.88rem', mt: 0.7 }}>
              referral intensity
            </Typography>
          </Box>
        </Box>

        <Stack spacing={1.4}>
          {factors.map((factor) => (
            <Box key={factor.label}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.7 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: factor.color }} />
                  <Typography sx={{ fontSize: '0.86rem' }}>{factor.label}</Typography>
                </Box>
                <Typography sx={{ color: '#dedcc5', fontSize: '0.82rem' }}>{factor.range}</Typography>
              </Box>
              <Box sx={{ height: 5, borderRadius: 999, bgcolor: 'rgba(255,255,255,0.08)' }}>
                <Box sx={{ height: '100%', width: factor.width, borderRadius: 999, bgcolor: factor.color }} />
              </Box>
            </Box>
          ))}
        </Stack>

        <Box
          sx={{
            mt: 2,
            p: 1.5,
            borderRadius: '8px',
            bgcolor: 'rgba(239, 241, 111, 0.08)',
            borderTop: '1px solid rgba(239, 241, 111, 0.18)'
          }}
        >
          <Typography sx={{ color: accent, fontWeight: 800, fontSize: '0.9rem', mb: 0.5 }}>
            Smart insights
          </Typography>
          <Typography sx={{ color: '#d8d5a5', fontSize: '0.82rem', lineHeight: 1.55 }}>
            Your symptom result is routed to a suitable specialist and hospital option
            for faster follow-up.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const AdminGrowthPanel = ({ metrics }) => (
  <Card sx={{ ...panelSx, minHeight: 314 }}>
    <CardContent sx={{ p: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 2.2 }}>
        <Box>
          <Typography sx={{ fontSize: '1.05rem', fontWeight: 800 }}>
            Admin Growth Control
          </Typography>
          <Typography sx={{ color: mutedText, fontSize: '0.82rem' }}>
            Live patient, hospital stock, patient group, and income growth.
          </Typography>
        </Box>
        <Chip
          label="ADMIN"
          size="small"
          sx={{ bgcolor: accent, color: '#151515', fontWeight: 900 }}
        />
      </Box>

      <Grid container spacing={1.5}>
        {metrics.map((metric) => (
          <Grid item xs={12} sm={6} key={metric.title}>
          <Box
            onClick={metric.onOpen}
            sx={{
              height: '100%',
              minHeight: 132,
              p: 1.7,
              borderRadius: '8px',
              border: `1px solid ${metric.color}30`,
              bgcolor: `${metric.color}0d`,
              cursor: 'pointer',
              transition: 'transform 160ms ease, border-color 160ms ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                borderColor: `${metric.color}88`
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.4 }}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '8px',
                  display: 'grid',
                  placeItems: 'center',
                  color: metric.color,
                  bgcolor: `${metric.color}18`
                }}
              >
                {metric.icon}
              </Box>
              <Chip
                label={metric.change}
                size="small"
                sx={{ color: metric.color, bgcolor: `${metric.color}16`, fontWeight: 900 }}
              />
            </Box>
            <Typography sx={{ color: '#fffde8', fontSize: '1.55rem', lineHeight: 1, fontWeight: 800, mb: 0.7 }}>
              {metric.value}
            </Typography>
            <Typography sx={{ fontWeight: 800, fontSize: '0.88rem', mb: 0.5 }}>
              {metric.title}
            </Typography>
            <Typography sx={{ color: mutedText, fontSize: '0.76rem', mb: 1.2 }}>
              {metric.caption}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={metric.progress}
              sx={{
                height: 6,
                borderRadius: 999,
                bgcolor: 'rgba(255,255,255,0.08)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 999,
                  bgcolor: metric.color
                }
              }}
            />
          </Box>
          </Grid>
        ))}
      </Grid>
    </CardContent>
  </Card>
);

const GoalAgentPanel = () => {
  const stages = [
    {
      title: 'Listen',
      label: 'Symptom intake',
      description: 'Collects symptoms in a patient-friendly way.',
      icon: <Favorite />,
      color: accent
    },
    {
      title: 'Guide',
      label: 'Care matching',
      description: 'Matches the result to a suitable doctor type and hospital department.',
      icon: <Psychology />,
      color: aqua
    },
    {
      title: 'Support',
      label: 'Care recommendation',
      description: 'Helps the patient move toward the next care step.',
      icon: <TravelExplore />,
      color: green
    }
  ];

  const actions = ['Disease prediction', 'Doctor recommendation', 'Hospital suggestion'];
  const activeModules = [
    'Emergency alerts',
    'Medicine recommendations',
    'Health reports',
    'Model accuracy analytics',
  ];

  return (
    <Card sx={{ ...panelSx }}>
      <CardContent sx={{ p: 2.5 }}>
        <Grid container spacing={2.5} alignItems="stretch">
          <Grid item xs={12} lg={4}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.4 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '8px',
                      display: 'grid',
                      placeItems: 'center',
                      color: '#111312',
                      bgcolor: accent
                    }}
                  >
                    <AutoAwesome />
                  </Box>
                  <Box>
                    <Typography sx={{ color: accent, fontWeight: 900, fontSize: '0.82rem' }}>
                      Goal-Based AI Agent
                    </Typography>
                    <Typography sx={{ color: mutedText, fontSize: '0.78rem' }}>
                      Intelligent healthcare assistant
                    </Typography>
                  </Box>
                </Box>
                <Typography sx={{ fontSize: { xs: '1.45rem', md: '1.75rem' }, lineHeight: 1.15, fontWeight: 600, mb: 1.2 }}>
                  From symptom signals to guided healthcare decisions.
                </Typography>
                <Typography sx={{ color: '#c8c6b5', fontSize: '0.9rem', lineHeight: 1.65 }}>
                  The assistant explains symptom results in simple language and helps
                  patients choose the next healthcare step.
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2.4 }}>
                {actions.map((action) => (
                  <Chip
                    key={action}
                    label={action}
                    size="small"
                    sx={{
                      color: '#f6f3d1',
                      bgcolor: 'rgba(255,255,255,0.055)',
                      border: '1px solid rgba(255,255,255,0.08)'
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} lg={5}>
            <Grid container spacing={1.5}>
              {stages.map((stage, index) => (
                <Grid item xs={12} sm={4} lg={12} key={stage.title}>
                  <Box
                    sx={{
                      position: 'relative',
                      minHeight: { xs: 152, lg: 116 },
                      p: 1.6,
                      borderRadius: '8px',
                      border: `1px solid ${stage.color}33`,
                      bgcolor: `${stage.color}0f`
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1 }}>
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '8px',
                          display: 'grid',
                          placeItems: 'center',
                          color: stage.color,
                          bgcolor: `${stage.color}17`
                        }}
                      >
                        {stage.icon}
                      </Box>
                      <Box>
                        <Typography sx={{ color: stage.color, fontWeight: 900, fontSize: '0.78rem' }}>
                          Guide {index + 1}
                        </Typography>
                        <Typography sx={{ fontWeight: 900 }}>{stage.title}</Typography>
                      </Box>
                    </Box>
                    <Typography sx={{ color: '#f4f1cf', fontSize: '0.82rem', fontWeight: 800, mb: 0.4 }}>
                      {stage.label}
                    </Typography>
                    <Typography sx={{ color: mutedText, fontSize: '0.78rem', lineHeight: 1.5 }}>
                      {stage.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12} lg={3}>
            <Box
              sx={{
                height: '100%',
                minHeight: 268,
                p: 2,
                borderRadius: '8px',
                bgcolor: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              <Typography sx={{ color: accent, fontWeight: 900, fontSize: '0.9rem', mb: 1 }}>
                Patient support
              </Typography>
              <Typography sx={{ color: '#cbc9b8', fontSize: '0.82rem', lineHeight: 1.6, mb: 2 }}>
                The assistant keeps the explanation simple: result, confidence, doctor type,
                hospital department, and safe next action.
              </Typography>

              <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.08)' }} />

              <Typography sx={{ color: aqua, fontWeight: 900, fontSize: '0.9rem', mb: 1 }}>
                Smart modules
              </Typography>
              <Stack spacing={0.9}>
                {activeModules.map((item) => (
                  <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: aqua }} />
                    <Typography sx={{ color: '#ece9cf', fontSize: '0.8rem' }}>{item}</Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const ActivityPanel = ({ appointments, predictions }) => {
  const recentCases = predictions.length
    ? predictions.slice(0, 4).map((prediction) => ({
      title: getPredictionName(prediction),
      subtitle: getSymptoms(prediction),
      date: formatDateTime(prediction.timestamp),
      status: prediction.status || 'completed'
    }))
    : [{
      title: 'No prediction records yet',
      subtitle: 'Start a symptom check to populate diagnosis history.',
      date: 'Ready now',
      status: 'waiting'
    }];

  const appointmentRows = appointments.length
    ? appointments.slice(0, 3).map((appointment) => ({
      title: appointment.doctorName || 'Doctor consultation',
      subtitle: appointment.doctorSpecialization || appointment.symptoms || 'Consultation',
      date: formatDateTime(appointment.appointmentDate)
    }))
    : [{
      title: 'No appointments booked',
      subtitle: 'Hospital and doctor recommendations can be booked here.',
      date: 'Open'
    }];

  return (
    <Card sx={{ ...panelSx, minHeight: 314 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography sx={{ fontSize: '1.05rem', fontWeight: 800 }}>Live Care Activity</Typography>
            <Typography sx={{ color: mutedText, fontSize: '0.82rem' }}>Predictions and bookings</Typography>
          </Box>
          <Insights sx={{ color: accent }} />
        </Box>

        <Typography sx={{ color: accent, fontWeight: 800, fontSize: '0.82rem', mb: 1 }}>
          Recent diagnoses
        </Typography>
        <Stack spacing={1.2} sx={{ mb: 2 }}>
          {recentCases.map((item, index) => (
            <Box
              key={`${item.title}-${index}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1.5,
                p: 1.2,
                borderRadius: '8px',
                bgcolor: 'rgba(255,255,255,0.04)'
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography noWrap sx={{ fontWeight: 800, fontSize: '0.84rem' }}>{item.title}</Typography>
                <Typography noWrap sx={{ color: mutedText, fontSize: '0.75rem' }}>{item.subtitle}</Typography>
              </Box>
              <Chip
                label={item.status}
                size="small"
                sx={{ bgcolor: 'rgba(239,241,111,0.12)', color: accent, maxWidth: 110 }}
              />
            </Box>
          ))}
        </Stack>

        <Typography sx={{ color: accent, fontWeight: 800, fontSize: '0.82rem', mb: 1 }}>
          Appointment queue
        </Typography>
        <Stack spacing={1}>
          {appointmentRows.map((item, index) => (
            <Box key={`${item.title}-${index}`} sx={{ display: 'flex', gap: 1.2, alignItems: 'flex-start' }}>
              <CalendarToday sx={{ color: aqua, fontSize: 18, mt: 0.2 }} />
              <Box sx={{ minWidth: 0 }}>
                <Typography noWrap sx={{ fontSize: '0.83rem', fontWeight: 800 }}>{item.title}</Typography>
                <Typography noWrap sx={{ color: mutedText, fontSize: '0.75rem' }}>
                  {item.subtitle} - {item.date}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalHospitals: 0,
    totalPredictions: 0,
    totalAppointments: 0
  });
  const [recentPredictions, setRecentPredictions] = useState([]);
  const [liveAppointments, setLiveAppointments] = useState([]);
  const [diseaseFrequency, setDiseaseFrequency] = useState({});
  const [modelComparison, setModelComparison] = useState([]);
  const [modelInfo, setModelInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const user = authService.getCurrentUser();
      const canViewCases = user?.role === 'ADMIN' || user?.role === 'DOCTOR';
      const [doctorData, hospitalData, predictionData, appointmentData, analyticsData, mlInfo, mlCompare] = await Promise.all([
        doctorService.getDoctors(),
        hospitalService.getHospitals(),
        canViewCases
          ? predictionService.getAllPredictions()
          : predictionService.getPredictionHistory(user?.userId),
        canViewCases
          ? appointmentService.getAllAppointments().catch(() => ({ appointments: [] }))
          : appointmentService.getMyAppointments().catch(() => ({ appointments: [] })),
        canViewCases
          ? predictionService.getSystemAnalytics().catch(() => null)
          : predictionService.getUserAnalytics(user?.userId).catch(() => ({})),
        mlService.getModelInfo().catch(() => null),
        mlService.compareModels().catch(() => ({ models: [] })),
      ]);

      const doctors = normalizeList(doctorData);
      const hospitals = normalizeList(hospitalData);
      const predictions = normalizeList(predictionData);
      const appointments = normalizeList(appointmentData);

      setStats({
        totalDoctors: doctors.length,
        totalHospitals: hospitals.length,
        totalPredictions: predictions.length,
        totalAppointments: appointments.length
      });
      setRecentPredictions(predictions.slice(0, 6));
      setLiveAppointments(appointments.slice(0, 5));
      setModelInfo(mlInfo);
      setModelComparison(mlCompare?.models || mlInfo?.model_comparison || []);

      if (canViewCases && analyticsData?.diseaseFrequency) {
        setDiseaseFrequency(analyticsData.diseaseFrequency);
      } else {
        setDiseaseFrequency(analyticsData || buildFrequencyFromPredictions(predictions));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const sparkCards = useMemo(() => ([
    {
      title: 'Diagnosis Engine',
      label: 'Symptom predictions',
      value: stats.totalPredictions.toLocaleString(),
      trend: '+6.9%',
      note: 'case intake',
      color: accent,
      icon: <MonitorHeart sx={{ fontSize: 22 }} />,
      path: '/history',
      series: [18, 22, 24, 40, 44, 38, 57, 63, 58, 74, 70, 86]
    },
    {
      title: 'Doctor Network',
      label: 'Available specialists',
      value: stats.totalDoctors.toLocaleString(),
      trend: '+4.3%',
      note: 'coverage',
      color: aqua,
      icon: <MedicalServices sx={{ fontSize: 22 }} />,
      path: '/doctors',
      series: [34, 38, 42, 40, 55, 58, 65, 61, 70, 73, 80, 84]
    },
    {
      title: 'Hospital Matching',
      label: 'Smart facilities',
      value: stats.totalHospitals.toLocaleString(),
      trend: '-2.8%',
      trendType: 'down',
      note: 'capacity load',
      color: coral,
      icon: <Bed sx={{ fontSize: 22 }} />,
      path: '/hospitals',
      series: [80, 65, 62, 70, 59, 64, 52, 47, 55, 44, 36, 31]
    }
  ]), [stats]);

  const quickActions = [
    {
      label: 'AI Diagnosis',
      helper: 'Analyze symptoms',
      icon: <Favorite />,
      path: '/',
      color: accent
    },
    {
      label: 'Recommendations',
      helper: 'Match doctors',
      icon: <LocalPharmacy />,
      path: '/recommendations',
      color: aqua
    },
    {
      label: 'Doctors',
      helper: 'Specialist list',
      icon: <People />,
      path: '/doctors',
      color: green
    },
    {
      label: 'Hospitals',
      helper: 'Care centers',
      icon: <LocalHospital />,
      path: '/hospitals',
      color: coral
    },
    {
      label: 'History',
      helper: 'Past reports',
      icon: <TrendingUp />,
      path: '/history',
      color: '#ffc46b'
    },
    {
      label: 'Medicines',
      helper: 'Drug guidance',
      icon: <LocalPharmacy />,
      path: '/medicines',
      color: '#a78bfa'
    },
    {
      label: 'Health Report',
      helper: 'Print summary',
      icon: <Science />,
      path: '/health-report',
      color: '#60a5fa'
    }
  ];

  const riskScore = Math.min(
    82,
    Math.max(12, 12 + (stats.totalPredictions * 2) + stats.totalAppointments)
  );
  const userName = [currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(' ') || 'Care Dashboard';
  const profileName = currentUser?.role === 'DOCTOR' ? `Dr. ${userName}` : userName;
  const isAdmin = currentUser?.role === 'ADMIN';
  const estimatedIncome = (stats.totalAppointments * 1200) + (stats.totalPredictions * 350);
  const adminMetrics = [
    {
      title: 'Live Patients',
      value: stats.totalPredictions.toLocaleString(),
      change: '+12.4%',
      caption: 'Active prediction and case flow',
      progress: Math.min(96, 45 + stats.totalPredictions * 4),
      color: accent,
      icon: <MonitorHeart />,
      onOpen: () => navigate('/history')
    },
    {
      title: 'Hospital Stock Growth',
      value: `+${Math.max(8, stats.totalHospitals * 6)}%`,
      change: '+6.8%',
      caption: 'Hospital inventory and capacity trend',
      progress: Math.min(94, 38 + stats.totalHospitals * 8),
      color: aqua,
      icon: <LocalHospital />,
      onOpen: () => navigate('/hospitals')
    },
    {
      title: 'Patient Group Growth',
      value: `+${Math.max(10, stats.totalPredictions * 3)}%`,
      change: '+9.1%',
      caption: 'Grouped patient intake movement',
      progress: Math.min(92, 40 + stats.totalPredictions * 5),
      color: green,
      icon: <People />,
      onOpen: () => navigate('/history')
    },
    {
      title: 'Income Growth',
      value: `₹${estimatedIncome.toLocaleString('en-IN')}`,
      change: '+14.7%',
      caption: 'Estimated consultation revenue',
      progress: Math.min(90, 35 + stats.totalAppointments * 7),
      color: coral,
      icon: <TrendingUp />,
      onOpen: () => navigate('/admin')
    }
  ];

  if (loading) {
    return (
      <Box sx={{ minHeight: 'calc(100vh - 112px)', display: 'grid', placeItems: 'center' }}>
        <Card sx={{ ...panelSx, width: 'min(460px, 100%)' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ color: accent, fontWeight: 800, mb: 1 }}>
              Loading intelligence center
            </Typography>
            <LinearProgress
              sx={{
                height: 8,
                borderRadius: 999,
                bgcolor: 'rgba(255,255,255,0.08)',
                '& .MuiLinearProgress-bar': { bgcolor: accent }
              }}
            />
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ color: '#f5f3dd' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', lg: 'center' },
          flexDirection: { xs: 'column', lg: 'row' },
          gap: 2,
          mb: 3
        }}
      >
        <Box sx={{ maxWidth: 850 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1.2 }}>
            <Chip
              icon={<AutoAwesome sx={{ color: `${accent} !important` }} />}
              label="AI-driven disease diagnosis"
              sx={{ color: accent, bgcolor: 'rgba(239,241,111,0.08)' }}
            />
            <Chip
              icon={<HealthAndSafety sx={{ color: `${aqua} !important` }} />}
              label="Smart hospital recommendation"
              sx={{ color: aqua, bgcolor: 'rgba(121,215,190,0.08)' }}
            />
          </Stack>
          <Typography
            variant="h4"
            sx={{
              color: '#fffde8',
              fontWeight: 800,
              fontSize: { xs: '2rem', md: '2.55rem' },
              lineHeight: 1.05,
              mb: 1
            }}
          >
            Predictive Health Intelligence Center
          </Typography>
          <Typography sx={{ color: '#b9b8aa', lineHeight: 1.7, maxWidth: 780 }}>
            Symptom inputs become simple healthcare guidance with doctor and hospital
            recommendations for timely care.
          </Typography>
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Button
            variant="contained"
            startIcon={<Science />}
            onClick={() => navigate('/')}
            sx={{
              minHeight: 44,
              borderRadius: '8px',
              px: 2.4,
              color: '#111312',
              fontWeight: 900,
              bgcolor: accent,
              '&:hover': { bgcolor: '#fafb91' }
            }}
          >
            Start Diagnosis
          </Button>
          <Button
            variant="outlined"
            startIcon={<TravelExplore />}
            onClick={() => navigate('/recommendations')}
            sx={{
              minHeight: 44,
              borderRadius: '8px',
              px: 2.4,
              color: '#f2efc7',
              borderColor: 'rgba(239,241,111,0.45)',
              '&:hover': {
                borderColor: accent,
                bgcolor: 'rgba(239,241,111,0.08)'
              }
            }}
          >
            Hospital Match
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={2.5}>
        <Grid item xs={12} xl={9}>
          <Grid container spacing={2.5}>
            {sparkCards.map((card) => (
              <Grid item xs={12} md={4} key={card.title}>
                <SparklineCard {...card} onOpen={() => navigate(card.path)} />
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} xl={3}>
          <Card sx={{ ...panelSx, minHeight: 214 }}>
            <CardContent sx={{ p: 2.5, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Psychology sx={{ color: accent }} />
                  <Typography sx={{ color: accent, fontWeight: 900 }}>CureAI</Typography>
                </Box>
                <Chip
                  label={currentUser?.role || 'PATIENT'}
                  size="small"
                  sx={{ bgcolor: accent, color: '#151515', fontWeight: 900 }}
                />
              </Box>
              <Typography sx={{ fontSize: '1.55rem', lineHeight: 1.12, fontWeight: 500, mb: 1.2 }}>
                Predictive Intelligence Center
              </Typography>
              <Typography sx={{ color: mutedText, fontSize: '0.86rem', lineHeight: 1.6, mb: 2 }}>
                The assistant explains health predictions in patient-friendly language
                and helps users move to the next care step.
              </Typography>
              <Button
                fullWidth
                endIcon={<ArrowForward />}
                onClick={() => navigate('/history')}
                sx={{
                  minHeight: 44,
                  borderRadius: '8px',
                  color: '#111312',
                  fontWeight: 900,
                  bgcolor: aqua,
                  '&:hover': { bgcolor: '#93ead4' }
                }}
              >
                Launch Insights
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={8}>
          <CoverageMap stats={stats} onViewDetails={() => navigate('/recommendations')} />
        </Grid>
        <Grid item xs={12} lg={4}>
          <RiskPanel score={riskScore} onDetails={() => navigate('/history')} />
        </Grid>

        <Grid item xs={12}>
          <GoalAgentPanel />
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ ...panelSx, bgcolor: '#fff', color: '#1e293b' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 800, mb: 0.5 }}>
                Analytics Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Disease trends and ML model accuracy
                {modelInfo?.primary_model ? ` — primary model: ${modelInfo.primary_model}` : ''}
                {modelInfo?.accuracy ? ` (${(modelInfo.accuracy * 100).toFixed(1)}% test accuracy)` : ''}
              </Typography>
              <AnalyticsCharts
                diseaseFrequency={diseaseFrequency}
                modelComparison={modelComparison}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={8}>
          <Box sx={{ mb: 1.6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: '1.05rem', fontWeight: 800 }}>
              Quick Access
            </Typography>
            <Button size="small" sx={{ color: accent }} onClick={() => navigate('/')}>
              View all
            </Button>
          </Box>
          <Grid container spacing={1.6}>
            {quickActions.map((action) => (
              <Grid item xs={12} sm={6} md key={action.label}>
                <Card
                  onClick={() => navigate(action.path)}
                  sx={{
                    ...panelSx,
                    minHeight: 146,
                    cursor: 'pointer',
                    transition: 'transform 160ms ease, border-color 160ms ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      borderColor: `${action.color}88`
                    }
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: '8px',
                        display: 'grid',
                        placeItems: 'center',
                        color: action.color,
                        bgcolor: `${action.color}14`,
                        mb: 2
                      }}
                    >
                      {action.icon}
                    </Box>
                    <Typography sx={{ fontWeight: 800, mb: 0.5 }}>{action.label}</Typography>
                    <Typography sx={{ color: mutedText, fontSize: '0.78rem' }}>{action.helper}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ ...panelSx, minHeight: 146 }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', gap: 1.2, alignItems: 'center', mb: 1.4 }}>
                <Avatar sx={{ bgcolor: 'rgba(239,241,111,0.16)', color: accent }}>
                  {(currentUser?.firstName?.[0] || 'U').toUpperCase()}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography noWrap sx={{ fontWeight: 900 }}>
                    {profileName}
                  </Typography>
                  <Typography noWrap sx={{ color: mutedText, fontSize: '0.8rem' }}>
                    @{currentUser?.email || 'clinical.operator'}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label="Secure API" size="small" sx={{ color: aqua, bgcolor: 'rgba(121,215,190,0.08)' }} />
                <Chip label="ML ready" size="small" sx={{ color: accent, bgcolor: 'rgba(239,241,111,0.08)' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {isAdmin && (
          <Grid item xs={12} lg={5}>
            <AdminGrowthPanel metrics={adminMetrics} />
          </Grid>
        )}
        <Grid item xs={12} lg={isAdmin ? 7 : 12}>
          <ActivityPanel appointments={liveAppointments} predictions={recentPredictions} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
