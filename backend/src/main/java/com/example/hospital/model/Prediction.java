package com.example.hospital.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Document(collection = "predictions")
public class Prediction {
    @Id
    private String id;
    private String userId;
    private List<String> symptoms;
    private List<Map<String, Object>> predictions;
    private LocalDateTime timestamp;
    private String status;
    private Map<String, Object> metadata;

    public Prediction() {}

    public Prediction(String userId, List<String> symptoms, List<Map<String, Object>> predictions, 
                   String status, Map<String, Object> metadata) {
        this.userId = userId;
        this.symptoms = symptoms;
        this.predictions = predictions;
        this.timestamp = LocalDateTime.now();
        this.status = status;
        this.metadata = metadata;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public List<String> getSymptoms() { return symptoms; }
    public void setSymptoms(List<String> symptoms) { this.symptoms = symptoms; }

    public List<Map<String, Object>> getPredictions() { return predictions; }
    public void setPredictions(List<Map<String, Object>> predictions) { this.predictions = predictions; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Map<String, Object> getMetadata() { return metadata; }
    public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }
}
