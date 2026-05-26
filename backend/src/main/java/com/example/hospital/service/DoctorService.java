package com.example.hospital.service;

import com.example.hospital.model.Doctor;
import com.example.hospital.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Doctor getDoctorById(String id) {
        return doctorRepository.findById(id).orElse(null);
    }

    public List<Doctor> getDoctorsBySpecialization(String specialization) {
        return doctorRepository.findBySpecializationRegex(specialization);
    }

    public List<Doctor> getDoctorsByDepartment(String department) {
        return doctorRepository.findByDepartment(department);
    }

    public List<Doctor> getDoctorsByHospital(String hospitalId) {
        return doctorRepository.findByHospitalId(hospitalId);
    }

    public List<Doctor> searchDoctors(String query, String specialty) {
        List<Doctor> doctors = doctorRepository.findAll();
        
        return doctors.stream()
                .filter(doctor -> {
                    boolean matchesQuery = doctor.getName().toLowerCase().contains(query.toLowerCase()) ||
                                      doctor.getSpecialization().toLowerCase().contains(query.toLowerCase());
                    boolean matchesSpecialty = specialty == null || specialty.isEmpty() ||
                                          doctor.getSpecialization().toLowerCase().contains(specialty.toLowerCase());
                    return matchesQuery && matchesSpecialty;
                })
                .collect(Collectors.toList());
    }

    public List<Doctor> getDoctorsAcceptingNewPatients() {
        return doctorRepository.findByAcceptingNewPatients(true);
    }

    public List<Doctor> getTopRatedDoctors(double minRating) {
        return doctorRepository.findByRatingGreaterThanEqualOrderByRatingDesc(minRating);
    }

    public Doctor createDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    public Doctor updateDoctor(String id, Doctor doctor) {
        if (doctorRepository.existsById(id)) {
            doctor.setId(id);
            return doctorRepository.save(doctor);
        }
        return null;
    }

    public boolean deleteDoctor(String id) {
        if (doctorRepository.existsById(id)) {
            doctorRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Doctor> getDoctorRecommendations(String disease, String location) {
        // Map diseases to specializations
        String recommendedSpecialization = getSpecializationForDisease(disease);
        
        List<Doctor> doctors;
        if (recommendedSpecialization != null) {
            doctors = getDoctorsBySpecialization(recommendedSpecialization);
        } else {
            doctors = getAllDoctors();
        }

        if (doctors.isEmpty() && recommendedSpecialization != null && recommendedSpecialization.contains("General")) {
            doctors = getDoctorsBySpecialization("General");
        }

        if (doctors.isEmpty()) {
            doctors = getAllDoctors();
        }

        // Filter by location if provided
        if (location != null && !location.trim().isEmpty()) {
            doctors = doctors.stream()
                    .filter(doctor -> doctor.getHospital() != null && 
                                      doctor.getHospital().toLowerCase().contains(location.toLowerCase()))
                    .collect(Collectors.toList());
        }

        // Prioritize accepting new patients and highly rated doctors
        return doctors.stream()
                .sorted((d1, d2) -> {
                    // First priority: accepting new patients
                    if (d1.isAcceptingNewPatients() && !d2.isAcceptingNewPatients()) {
                        return -1;
                    }
                    if (!d1.isAcceptingNewPatients() && d2.isAcceptingNewPatients()) {
                        return 1;
                    }
                    // Second priority: rating
                    return Double.compare(d2.getRating(), d1.getRating());
                })
                .limit(10) // Return top 10 recommendations
                .collect(Collectors.toList());
    }

    private String getSpecializationForDisease(String disease) {
        // Map common diseases to specializations
        switch (disease.toLowerCase()) {
            case "common cold":
            case "flu":
            case "influenza":
                return "General";
            case "heart attack":
                return "Cardiologist";
            case "migraine":
                return "Neurologist";
            case "pneumonia":
            case "bronchitis":
            case "covid-19":
                return "Pulmonologist";
            case "food poisoning":
            case "gastroenteritis":
                return "Gastroenterologist";
            default:
                return "General Practitioner";
        }
    }
}
