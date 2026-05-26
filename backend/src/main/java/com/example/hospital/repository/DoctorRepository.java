package com.example.hospital.repository;

import com.example.hospital.model.Doctor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends MongoRepository<Doctor, String> {
    
    List<Doctor> findByNameContainingIgnoreCase(String name);

    Optional<Doctor> findByEmail(String email);
    
    List<Doctor> findBySpecialization(String specialization);
    
    List<Doctor> findByDepartment(String department);
    
    List<Doctor> findByHospitalId(String hospitalId);
    
    List<Doctor> findByHospitalContainingIgnoreCase(String hospital);
    
    List<Doctor> findByAcceptingNewPatients(boolean acceptingNewPatients);
    
    List<Doctor> findByRatingGreaterThanEqualOrderByRatingDesc(double rating);
    
    List<Doctor> findByExperienceGreaterThan(int experience);
    
    @Query("{ 'specialization': { $regex: ?0, $options: 'i' } }")
    List<Doctor> findBySpecializationRegex(String specialization);
    
    @Query("{ 'name': { $regex: ?0, $options: 'i' } }")
    List<Doctor> findByNameRegex(String pattern);
    
    List<Doctor> findByNameContainingIgnoreCaseAndSpecialization(String name, String specialization);
}
