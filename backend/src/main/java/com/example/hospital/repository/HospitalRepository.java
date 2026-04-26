package com.example.hospital.repository;

import com.example.hospital.model.Hospital;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HospitalRepository extends MongoRepository<Hospital, String> {
    
    List<Hospital> findByNameContainingIgnoreCase(String name);
    
    List<Hospital> findByLocationContainingIgnoreCase(String location);
    
    List<Hospital> findByEmergencyServicesTrue();
    
    List<Hospital> findByRatingGreaterThanEqual(double rating);
    
    @Query("{ 'services': { $in: ?0 } }")
    List<Hospital> findByServicesIn(List<String> services);
    
    @Query("{ 'specialties': { $in: ?0 } }")
    List<Hospital> findBySpecialtiesIn(List<String> specialties);
    
    @Query("{ 'name': { $regex: ?0, $options: 'i' } }")
    List<Hospital> findByNameRegex(String pattern);
    
    @Query("{ 'location': { $regex: ?0, $options: 'i' } }")
    List<Hospital> findByLocationRegex(String location);
    
    List<Hospital> findByNameContainingIgnoreCaseAndSpecialtiesContainingIgnoreCase(String name, String specialty);
    
    @Query("{ 'specialties': { $regex: ?0, $options: 'i' } }")
    List<Hospital> findBySpecialtiesContainingIgnoreCase(String specialty);
}
