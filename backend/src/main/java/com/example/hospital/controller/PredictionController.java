package com.example.hospital.controller;

import com.example.hospital.model.Prediction;
import com.example.hospital.model.User;
import com.example.hospital.repository.UserRepository;
import com.example.hospital.service.PredictionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/predictions")
@CrossOrigin(origins = "*")
public class PredictionController {

    @Autowired
    private PredictionService predictionService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Prediction> savePrediction(@RequestBody Map<String, Object> predictionData) {
        try {
            User currentUser = getCurrentUser();
            if (currentUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            if (!isAdmin(currentUser)) {
                predictionData.put("userId", currentUser.getId());
            }
            Prediction prediction = predictionService.savePrediction(predictionData);
            return ResponseEntity.ok(prediction);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Prediction>> getAllPredictions() {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (isPatient(currentUser)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<Prediction> predictions = isAdmin(currentUser)
                ? predictionService.getAllPredictions()
                : predictionService.getPredictionsVisibleToDoctor(currentUser);
        return ResponseEntity.ok(predictions);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Prediction>> getPredictionsByUser(@PathVariable String userId) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (isPatient(currentUser) && !currentUser.getId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<Prediction> predictions = isDoctor(currentUser)
                ? predictionService.getPredictionsByUserVisibleToDoctor(userId, currentUser)
                : predictionService.getPredictionsByUser(userId);
        return ResponseEntity.ok(predictions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Prediction> getPredictionById(@PathVariable String id) {
        Prediction prediction = predictionService.getPredictionById(id);
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (prediction != null && canReadPrediction(currentUser, prediction)) {
            return ResponseEntity.ok(prediction);
        } else if (prediction == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    @PutMapping("/{id}/advice")
    public ResponseEntity<Prediction> addMedicalAdvice(
            @PathVariable String id,
            @RequestBody Map<String, String> request) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (!isDoctor(currentUser) && !isAdmin(currentUser)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Prediction prediction = predictionService.getPredictionById(id);
        if (prediction == null) {
            return ResponseEntity.notFound().build();
        }
        if (isDoctor(currentUser) && predictionService.getPredictionsByUserVisibleToDoctor(
                prediction.getUserId(), currentUser).stream().noneMatch(item -> id.equals(item.getId()))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Prediction updated = predictionService.addMedicalAdvice(id, request.get("advice"), currentUser);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/disease/{diseaseName}")
    public ResponseEntity<List<Prediction>> getPredictionsByDisease(@PathVariable String diseaseName) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (isPatient(currentUser)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<Prediction> predictions = isAdmin(currentUser)
                ? predictionService.getPredictionsByDisease(diseaseName)
                : predictionService.getPredictionsVisibleToDoctor(currentUser).stream()
                    .filter(prediction -> prediction.getPredictions() != null)
                    .filter(prediction -> prediction.getPredictions().stream().anyMatch(item ->
                            String.valueOf(item.get("name")).toLowerCase().contains(diseaseName.toLowerCase())))
                    .toList();
        return ResponseEntity.ok(predictions);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Prediction>> getPredictionsByStatus(@PathVariable String status) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (isPatient(currentUser)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<Prediction> predictions = isAdmin(currentUser)
                ? predictionService.getPredictionsByStatus(status)
                : predictionService.getPredictionsVisibleToDoctor(currentUser).stream()
                    .filter(prediction -> status.equalsIgnoreCase(prediction.getStatus()))
                    .toList();
        return ResponseEntity.ok(predictions);
    }

    @GetMapping("/user/{userId}/count")
    public ResponseEntity<Long> getPredictionCount(@PathVariable String userId) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (isPatient(currentUser) && !currentUser.getId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        long count = isDoctor(currentUser)
                ? predictionService.getPredictionsByUserVisibleToDoctor(userId, currentUser).size()
                : predictionService.getPredictionCount(userId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/user/{userId}/recent")
    public ResponseEntity<List<Prediction>> getRecentPredictions(
            @PathVariable String userId,
            @RequestParam(defaultValue = "5") int limit) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (isPatient(currentUser) && !currentUser.getId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<Prediction> predictions = isDoctor(currentUser)
                ? predictionService.getPredictionsByUserVisibleToDoctor(userId, currentUser).stream().limit(limit).toList()
                : predictionService.getRecentPredictions(userId, limit);
        return ResponseEntity.ok(predictions);
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getSystemAnalytics() {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (isPatient(currentUser)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<Prediction> predictions = isAdmin(currentUser)
                ? predictionService.getAllPredictions()
                : predictionService.getPredictionsVisibleToDoctor(currentUser);
        return ResponseEntity.ok(predictionService.getSystemAnalytics(predictions));
    }

    @GetMapping("/user/{userId}/analytics")
    public ResponseEntity<Map<String, Long>> getDiseaseFrequency(@PathVariable String userId) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (!isAdmin(currentUser) && !currentUser.getId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Map<String, Long> frequency = predictionService.getDiseaseFrequency(userId);
        return ResponseEntity.ok(frequency);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<Prediction>> getPredictionsByDateRange(
            @RequestParam String start,
            @RequestParam String end) {
        try {
            User currentUser = getCurrentUser();
            if (currentUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            if (isPatient(currentUser)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            java.time.LocalDateTime startTime = java.time.LocalDateTime.parse(start);
            java.time.LocalDateTime endTime = java.time.LocalDateTime.parse(end);
            List<Prediction> predictions = (isAdmin(currentUser)
                    ? predictionService.getPredictionsByDateRange(startTime, endTime)
                    : predictionService.getPredictionsVisibleToDoctor(currentUser).stream()
                        .filter(prediction -> prediction.getTimestamp() != null)
                        .filter(prediction -> !prediction.getTimestamp().isBefore(startTime)
                                && !prediction.getTimestamp().isAfter(endTime))
                        .toList());
            return ResponseEntity.ok(predictions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication() == null
                ? null
                : SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal == null) {
            return null;
        }
        Optional<User> user = userRepository.findByEmail(principal.toString());
        return user.orElse(null);
    }

    private boolean canReadPrediction(User user, Prediction prediction) {
        if (isAdmin(user) || user.getId().equals(prediction.getUserId())) {
            return true;
        }
        return isDoctor(user) && predictionService.getPredictionsByUserVisibleToDoctor(
                prediction.getUserId(), user).stream().anyMatch(item -> prediction.getId().equals(item.getId()));
    }

    private boolean isAdmin(User user) {
        return "ADMIN".equalsIgnoreCase(user.getRole());
    }

    private boolean isDoctor(User user) {
        return "DOCTOR".equalsIgnoreCase(user.getRole());
    }

    private boolean isPatient(User user) {
        return "PATIENT".equalsIgnoreCase(user.getRole());
    }
}
