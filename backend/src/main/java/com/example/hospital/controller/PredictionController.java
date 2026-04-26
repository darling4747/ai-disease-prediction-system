package com.example.hospital.controller;

import com.example.hospital.model.Prediction;
import com.example.hospital.service.PredictionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/predictions")
@CrossOrigin(origins = "*")
public class PredictionController {

    @Autowired
    private PredictionService predictionService;

    @PostMapping
    public ResponseEntity<Prediction> savePrediction(@RequestBody Map<String, Object> predictionData) {
        try {
            Prediction prediction = predictionService.savePrediction(predictionData);
            return ResponseEntity.ok(prediction);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Prediction>> getAllPredictions() {
        List<Prediction> predictions = predictionService.getAllPredictions();
        return ResponseEntity.ok(predictions);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Prediction>> getPredictionsByUser(@PathVariable String userId) {
        List<Prediction> predictions = predictionService.getPredictionsByUser(userId);
        return ResponseEntity.ok(predictions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Prediction> getPredictionById(@PathVariable String id) {
        Prediction prediction = predictionService.getPredictionById(id);
        if (prediction != null) {
            return ResponseEntity.ok(prediction);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/disease/{diseaseName}")
    public ResponseEntity<List<Prediction>> getPredictionsByDisease(@PathVariable String diseaseName) {
        List<Prediction> predictions = predictionService.getPredictionsByDisease(diseaseName);
        return ResponseEntity.ok(predictions);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Prediction>> getPredictionsByStatus(@PathVariable String status) {
        List<Prediction> predictions = predictionService.getPredictionsByStatus(status);
        return ResponseEntity.ok(predictions);
    }

    @GetMapping("/user/{userId}/count")
    public ResponseEntity<Long> getPredictionCount(@PathVariable String userId) {
        long count = predictionService.getPredictionCount(userId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/user/{userId}/recent")
    public ResponseEntity<List<Prediction>> getRecentPredictions(
            @PathVariable String userId,
            @RequestParam(defaultValue = "5") int limit) {
        List<Prediction> predictions = predictionService.getRecentPredictions(userId, limit);
        return ResponseEntity.ok(predictions);
    }

    @GetMapping("/user/{userId}/analytics")
    public ResponseEntity<Map<String, Long>> getDiseaseFrequency(@PathVariable String userId) {
        Map<String, Long> frequency = predictionService.getDiseaseFrequency(userId);
        return ResponseEntity.ok(frequency);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<Prediction>> getPredictionsByDateRange(
            @RequestParam String start,
            @RequestParam String end) {
        try {
            java.time.LocalDateTime startTime = java.time.LocalDateTime.parse(start);
            java.time.LocalDateTime endTime = java.time.LocalDateTime.parse(end);
            List<Prediction> predictions = predictionService.getPredictionsByDateRange(startTime, endTime);
            return ResponseEntity.ok(predictions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
