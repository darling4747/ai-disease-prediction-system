package com.example.hospital.service;

import com.example.hospital.model.Prediction;
import com.example.hospital.model.Doctor;
import com.example.hospital.model.User;
import com.example.hospital.repository.DoctorRepository;
import com.example.hospital.repository.PredictionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PredictionService {

    @Autowired
    private PredictionRepository predictionRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    public List<Prediction> getAllPredictions() {
        return predictionRepository.findAll();
    }

    public Prediction getPredictionById(String id) {
        Optional<Prediction> prediction = predictionRepository.findById(id);
        return prediction.orElse(null);
    }

    public List<Prediction> getPredictionsByUser(String userId) {
        return predictionRepository.findByUserIdOrderByTimestampDesc(userId);
    }

    public List<Prediction> getPredictionsVisibleToDoctor(User doctorUser) {
        return filterPredictionsForDoctor(predictionRepository.findAll(), doctorUser);
    }

    public List<Prediction> getPredictionsByUserVisibleToDoctor(String userId, User doctorUser) {
        return filterPredictionsForDoctor(getPredictionsByUser(userId), doctorUser);
    }

    public Prediction savePrediction(Map<String, Object> predictionData) {
        try {
            String userId = (String) predictionData.get("userId");
            @SuppressWarnings("unchecked")
            List<String> symptoms = (List<String>) predictionData.get("symptoms");
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> predictions = (List<Map<String, Object>>) predictionData.get("predictions");
            String status = (String) predictionData.getOrDefault("status", "completed");
            Map<String, Object> metadata = (Map<String, Object>) predictionData.getOrDefault("metadata", Map.of());

            Prediction prediction = new Prediction(userId, symptoms, predictions, status, metadata);
            return predictionRepository.save(prediction);
        } catch (Exception e) {
            throw new RuntimeException("Failed to save prediction: " + e.getMessage(), e);
        }
    }

    public Prediction updatePrediction(String id, Prediction prediction) {
        Optional<Prediction> existingPrediction = predictionRepository.findById(id);
        if (existingPrediction.isPresent()) {
            prediction.setId(id);
            return predictionRepository.save(prediction);
        }
        return null;
    }

    public Prediction addMedicalAdvice(String id, String advice, User doctorUser) {
        Optional<Prediction> existingPrediction = predictionRepository.findById(id);
        if (existingPrediction.isEmpty()) {
            return null;
        }

        Prediction prediction = existingPrediction.get();
        Map<String, Object> metadata = new java.util.HashMap<>(
                prediction.getMetadata() == null ? Map.of() : prediction.getMetadata()
        );
        metadata.put("medicalAdvice", advice);
        metadata.put("advisedBy", doctorUser.getEmail());
        metadata.put("advisedAt", LocalDateTime.now().toString());
        prediction.setMetadata(metadata);
        return predictionRepository.save(prediction);
    }

    public boolean deletePrediction(String id) {
        if (predictionRepository.existsById(id)) {
            predictionRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Prediction> getPredictionsByDateRange(LocalDateTime start, LocalDateTime end) {
        return predictionRepository.findByTimestampBetween(start, end);
    }

    public List<Prediction> getPredictionsByDisease(String diseaseName) {
        return predictionRepository.findByDiseaseNameRegex(diseaseName);
    }

    public List<Prediction> getPredictionsByStatus(String status) {
        return predictionRepository.findByStatus(status);
    }

    public List<Prediction> getPredictionsBySymptoms(List<String> symptoms) {
        return predictionRepository.findBySymptomsIn(symptoms);
    }

    public long getPredictionCount(String userId) {
        return predictionRepository.findByUserId(userId).size();
    }

    public Map<String, Long> getDiseaseFrequency(String userId) {
        List<Prediction> predictions = getPredictionsByUser(userId);
        return buildDiseaseFrequency(predictions);
    }

    public Map<String, Long> getSystemDiseaseFrequency(List<Prediction> predictions) {
        return buildDiseaseFrequency(predictions);
    }

    public Map<String, Object> getSystemAnalytics(List<Prediction> predictions) {
        Map<String, Long> diseaseFrequency = buildDiseaseFrequency(predictions);
        long criticalCount = predictions.stream()
                .filter(prediction -> prediction.getPredictions() != null)
                .filter(prediction -> prediction.getPredictions().stream().anyMatch(item -> {
                    String severity = String.valueOf(item.getOrDefault("severity", "")).toLowerCase();
                    String name = String.valueOf(item.getOrDefault("name", "")).toLowerCase();
                    return "high".equals(severity) || "critical".equals(severity)
                            || name.contains("heart attack") || name.contains("covid");
                }))
                .count();

        return Map.of(
                "totalPredictions", (long) predictions.size(),
                "diseaseFrequency", diseaseFrequency,
                "criticalCases", criticalCount,
                "completedCases", predictions.stream()
                        .filter(prediction -> "completed".equalsIgnoreCase(prediction.getStatus()))
                        .count()
        );
    }

    private Map<String, Long> buildDiseaseFrequency(List<Prediction> predictions) {
        Map<String, Long> diseaseFrequency = new java.util.HashMap<>();

        for (Prediction prediction : predictions) {
            if (prediction.getPredictions() != null) {
                for (Map<String, Object> pred : prediction.getPredictions()) {
                    String diseaseName = (String) pred.get("name");
                    if (diseaseName != null && !diseaseName.isBlank()) {
                        diseaseFrequency.put(diseaseName,
                                diseaseFrequency.getOrDefault(diseaseName, 0L) + 1);
                    }
                }
            }
        }

        return diseaseFrequency;
    }

    public List<Prediction> getRecentPredictions(String userId, int limit) {
        List<Prediction> predictions = getPredictionsByUser(userId);
        return predictions.stream()
                .limit(limit)
                .collect(java.util.stream.Collectors.toList());
    }

    private List<Prediction> filterPredictionsForDoctor(List<Prediction> predictions, User doctorUser) {
        if (doctorUser == null) {
            return List.of();
        }

        Optional<Doctor> doctor = doctorRepository.findByEmail(doctorUser.getEmail());
        if (doctor.isEmpty()) {
            return List.of();
        }

        String specialization = normalize(doctor.get().getSpecialization());
        String department = normalize(doctor.get().getDepartment());

        return predictions.stream()
                .filter(prediction -> prediction.getPredictions() != null)
                .filter(prediction -> prediction.getPredictions().stream().anyMatch(item ->
                        matchesDoctorScope(item, specialization, department)))
                .collect(java.util.stream.Collectors.toList());
    }

    private boolean matchesDoctorScope(Map<String, Object> prediction, String specialization, String department) {
        String recommendedDoctor = normalize((String) prediction.get("doctorSpecialization"));
        String hospitalDepartment = normalize((String) prediction.get("hospitalDepartment"));
        return containsEither(recommendedDoctor, specialization, department)
                || containsEither(hospitalDepartment, specialization, department);
    }

    private boolean containsEither(String value, String firstScope, String secondScope) {
        return !value.isBlank()
                && ((!firstScope.isBlank() && (value.contains(firstScope) || firstScope.contains(value)))
                || (!secondScope.isBlank() && (value.contains(secondScope) || secondScope.contains(value))));
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase();
    }
}
