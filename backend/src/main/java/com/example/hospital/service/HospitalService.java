package com.example.hospital.service;

import com.example.hospital.model.Hospital;
import com.example.hospital.repository.HospitalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HospitalService {

    @Autowired
    private HospitalRepository hospitalRepository;

    public List<Hospital> getAllHospitals() {
        return hospitalRepository.findAll();
    }

    public Hospital getHospitalById(String id) {
        Optional<Hospital> hospital = hospitalRepository.findById(id);
        return hospital.orElse(null);
    }

    public List<Hospital> getHospitalsByLocation(String location) {
        return hospitalRepository.findByLocationContainingIgnoreCase(location);
    }

    public List<Hospital> searchHospitals(String query, String specialty) {
        if (query != null && !query.trim().isEmpty() && specialty != null && !specialty.trim().isEmpty()) {
            return hospitalRepository.findByNameContainingIgnoreCaseAndSpecialtiesContainingIgnoreCase(query, specialty);
        } else if (query != null && !query.trim().isEmpty()) {
            return hospitalRepository.findByNameContainingIgnoreCase(query);
        } else if (specialty != null && !specialty.trim().isEmpty()) {
            return hospitalRepository.findBySpecialtiesContainingIgnoreCase(specialty);
        } else {
            return hospitalRepository.findAll();
        }
    }

    public Hospital createHospital(Hospital hospital) {
        return hospitalRepository.save(hospital);
    }

    public Hospital updateHospital(String id, Hospital hospital) {
        Optional<Hospital> existingHospital = hospitalRepository.findById(id);
        if (existingHospital.isPresent()) {
            hospital.setId(id);
            return hospitalRepository.save(hospital);
        }
        return null;
    }

    public boolean deleteHospital(String id) {
        if (hospitalRepository.existsById(id)) {
            hospitalRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Hospital> getEmergencyHospitals() {
        return hospitalRepository.findByEmergencyServicesTrue();
    }

    public List<Hospital> getHospitalsByRating(double minRating) {
        return hospitalRepository.findByRatingGreaterThanEqual(minRating);
    }
}
