package com.example.hospital.service;

import com.example.hospital.model.Prediction;
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
        Map<String, Long> diseaseFrequency = new java.util.HashMap<>();
        
        for (Prediction prediction : predictions) {
            if (prediction.getPredictions() != null) {
                for (Map<String, Object> pred : prediction.getPredictions()) {
                    String diseaseName = (String) pred.get("name");
                    diseaseFrequency.put(diseaseName, 
                        diseaseFrequency.getOrDefault(diseaseName, 0L) + 1);
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
}
