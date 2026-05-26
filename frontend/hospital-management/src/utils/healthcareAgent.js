import { getDiseaseInfo } from './diseaseMap';
import { getRiskLevel, getRecommendationByRisk } from './riskLevel';
import { detectSymptomEmergency } from './emergencyDetection';

export const selectMostLikelyPrediction = (predictions = []) => (
  [...predictions].sort((first, second) => (
    Number(second.probability || 0) - Number(first.probability || 0)
  ))[0] || {}
);

export const formatConfidence = (probability) => {
  const score = Number(probability);
  return Number.isFinite(score) ? `${(score * 100).toFixed(1)}%` : 'Not available';
};

export const buildHealthcareAgentResponse = (result, symptoms = []) => {
  const predictions = Array.isArray(result?.predictions) ? result.predictions : [];
  const bestPrediction = selectMostLikelyPrediction(predictions);
  const diseaseName = bestPrediction.name || 'Clinical review required';
  const diseaseInfo = getDiseaseInfo(diseaseName);
  const riskLevel = getRiskLevel(diseaseName);
  const symptomEmergency = detectSymptomEmergency(symptoms);

  return {
    name: 'Goal-Based Healthcare Assistant Agent',
    selectedDisease: diseaseName,
    confidence: formatConfidence(bestPrediction.probability),
    doctorRecommendation:
      bestPrediction.doctorSpecialization
      || diseaseInfo?.specialization
      || 'General Practitioner',
    hospitalSuggestion:
      bestPrediction.hospitalDepartment
      || diseaseInfo?.department
      || 'Outpatient Department',
    riskLevel: symptomEmergency?.level === 'critical' ? 'critical' : riskLevel,
    riskGuidance: getRecommendationByRisk(
      symptomEmergency?.level === 'critical' ? 'critical' : riskLevel
    ),
    emergency: symptomEmergency,
    medicines: diseaseInfo?.medicines || [],
    precautions: diseaseInfo?.precautions || diseaseInfo?.recommendations || [],
    actions: [
      `Disease prediction: ${diseaseName}`,
      `Doctor recommendation: ${bestPrediction.doctorSpecialization || diseaseInfo?.specialization || 'General Practitioner'}`,
      `Hospital suggestion: ${bestPrediction.hospitalDepartment || diseaseInfo?.department || 'Outpatient Department'}`,
    ],
  };
};

export const getAssistantReply = ({
  message,
  agentResponse,
  isPatient,
}) => {
  const lowerMessage = message.toLowerCase();

  if (!agentResponse) {
    return 'Please select symptoms and run prediction first. Then I can guide you through the next step.';
  }

  if (lowerMessage.includes('medicine') || lowerMessage.includes('medication')) {
    const meds = agentResponse.medicines?.length
      ? agentResponse.medicines.join(', ')
      : 'No specific over-the-counter medicines listed. Consult a pharmacist or doctor.';
    return `Suggested supportive medicines (not a prescription): ${meds}`;
  }

  if (lowerMessage.includes('precaution') || lowerMessage.includes('care')) {
    const tips = agentResponse.precautions?.join(' • ') || 'Rest, hydrate, and monitor symptoms.';
    return `Precautions: ${tips}`;
  }

  if (lowerMessage.includes('book') || lowerMessage.includes('appointment')) {
    return isPatient
      ? 'You can book an appointment now. Open Appointments and choose a doctor, date, and time.'
      : 'Appointment booking is restricted to patient accounts.';
  }

  if (lowerMessage.includes('doctor')) {
    return `A ${agentResponse.doctorRecommendation} is the best match for this result.`;
  }

  if (lowerMessage.includes('hospital')) {
    return `Look for the ${agentResponse.hospitalSuggestion}. Open Recommendations to compare facilities.`;
  }

  if (lowerMessage.includes('danger') || lowerMessage.includes('emergency') || lowerMessage.includes('severe')) {
    if (agentResponse.emergency) {
      return `${agentResponse.emergency.message} ${agentResponse.emergency.actions?.[0] || ''}`;
    }
    return 'If symptoms feel severe or life-threatening, seek emergency care immediately.';
  }

  if (lowerMessage.includes('report')) {
    return 'Open Health Reports to view or print your prediction summary.';
  }

  return `Your likely result is ${agentResponse.selectedDisease} (${agentResponse.confidence} confidence). Next: review medicine guidance and book care if needed.`;
};

export const buildInitialChatMessages = (agentResponse, isPatient) => {
  const messages = [
    {
      from: 'agent',
      text: `I found ${agentResponse.selectedDisease} with ${agentResponse.confidence} confidence. This is decision support only, not a final diagnosis.`,
    },
    {
      from: 'agent',
      text: `Recommended next step: consult a ${agentResponse.doctorRecommendation} in the ${agentResponse.hospitalSuggestion}.`,
    },
  ];

  if (agentResponse.emergency) {
    messages.push({
      from: 'agent',
      text: `${agentResponse.emergency.title}: ${agentResponse.emergency.message}`,
    });
  }

  if (agentResponse.medicines?.length) {
    messages.push({
      from: 'agent',
      text: `Medicine guidance: ${agentResponse.medicines.slice(0, 3).join(', ')}. See the Medicine module for full details.`,
    });
  }

  messages.push({
    from: 'agent',
    text: isPatient
      ? 'I can guide you to appointments, health reports, and medicine precautions when you are ready.'
      : 'Doctors can review cases and add medical advice from the Doctor Dashboard.',
  });

  return messages;
};
