package com.example.hospital.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/ml")
@CrossOrigin(origins = "*")
public class MLIntegrationController {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private org.springframework.core.env.Environment environment;
    
    private String getMLServiceUrl() {
        String mlUrl = environment.getProperty("ml.service.url");
        return mlUrl != null ? mlUrl : "http://localhost:5000";
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> checkMLServiceHealth() {
        try {
            String url = getMLServiceUrl() + "/health";
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "ML service not available: " + e.getMessage());
            return ResponseEntity.status(503).body(errorResponse);
        }
    }

    @PostMapping("/predict")
    public ResponseEntity<Map<String, Object>> predictDiseases(@RequestBody Map<String, Object> request) {
        try {
            String url = getMLServiceUrl() + "/predict";
            Map<String, Object> response = restTemplate.postForObject(url, request, Map.class);
            return ResponseEntity.ok(response);
        } catch (HttpClientErrorException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "ML service error: " + e.getResponseBodyAsString());
            return ResponseEntity.status(e.getStatusCode()).body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "Failed to connect to ML service: " + e.getMessage());
            return ResponseEntity.status(503).body(errorResponse);
        }
    }

    @GetMapping("/symptoms")
    public ResponseEntity<Map<String, Object>> getSymptoms() {
        try {
            String url = getMLServiceUrl() + "/symptoms";
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "Failed to fetch symptoms: " + e.getMessage());
            return ResponseEntity.status(503).body(errorResponse);
        }
    }
}
