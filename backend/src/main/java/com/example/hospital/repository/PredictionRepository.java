package com.example.hospital.repository;

import com.example.hospital.model.Prediction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PredictionRepository extends MongoRepository<Prediction, String> {
    
    List<Prediction> findByUserId(String userId);
    
    List<Prediction> findByUserIdOrderByTimestampDesc(String userId);
    
    List<Prediction> findByTimestampBetween(LocalDateTime start, LocalDateTime end);
    
    @Query("{ 'predictions.name': { $regex: ?0, $options: 'i' } }")
    List<Prediction> findByDiseaseNameRegex(String diseaseName);
    
    @Query("{ 'status': ?0 }")
    List<Prediction> findByStatus(String status);
    
    @Query("{ 'symptoms': { $in: ?0 } }")
    List<Prediction> findBySymptomsIn(List<String> symptoms);
}
