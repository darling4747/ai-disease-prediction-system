package com.example.hospital.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class SystemAdminController {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private Environment environment;

    @PostMapping("/model/retrain")
    public ResponseEntity<Map<String, Object>> retrainModel() {
        try {
            Map<String, Object> response = restTemplate.postForObject(getMLServiceUrl() + "/retrain", Map.of(), Map.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Model retraining failed: " + e.getMessage());
            return ResponseEntity.status(503).body(response);
        }
    }

    @PostMapping("/dataset/update")
    public ResponseEntity<Map<String, Object>> updateDataset(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Dataset update accepted for admin review");
        response.put("receivedRecords", request.getOrDefault("records", request).toString().length() > 0 ? 1 : 0);
        response.put("timestamp", LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }

    private String getMLServiceUrl() {
        String mlUrl = environment.getProperty("ml.service.url");
        return mlUrl != null ? mlUrl : "http://localhost:5000";
    }
}
