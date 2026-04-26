package com.example.hospital.controller;

import com.example.hospital.model.Doctor;
import com.example.hospital.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "*")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @GetMapping
    public ResponseEntity<List<Doctor>> getAllDoctors(
            @RequestParam(required = false) String specialty,
            @RequestParam(required = false) String hospitalId) {
        List<Doctor> doctors;
        if (specialty != null && !specialty.trim().isEmpty()) {
            doctors = doctorService.getDoctorsBySpecialization(specialty);
        } else if (hospitalId != null && !hospitalId.trim().isEmpty()) {
            doctors = doctorService.getDoctorsByHospital(hospitalId);
        } else {
            doctors = doctorService.getAllDoctors();
        }
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable String id) {
        Doctor doctor = doctorService.getDoctorById(id);
        if (doctor != null) {
            return ResponseEntity.ok(doctor);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Doctor>> searchDoctors(
            @RequestParam String query,
            @RequestParam(required = false) String specialty) {
        List<Doctor> doctors = doctorService.searchDoctors(query, specialty);
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/accepting-new-patients")
    public ResponseEntity<List<Doctor>> getDoctorsAcceptingNewPatients() {
        List<Doctor> doctors = doctorService.getDoctorsAcceptingNewPatients();
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/top-rated")
    public ResponseEntity<List<Doctor>> getTopRatedDoctors(
            @RequestParam(defaultValue = "4.5") double minRating) {
        List<Doctor> doctors = doctorService.getTopRatedDoctors(minRating);
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/specialization/{specialization}")
    public ResponseEntity<List<Doctor>> getDoctorsBySpecialization(@PathVariable String specialization) {
        List<Doctor> doctors = doctorService.getDoctorsBySpecialization(specialization);
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/department/{department}")
    public ResponseEntity<List<Doctor>> getDoctorsByDepartment(@PathVariable String department) {
        List<Doctor> doctors = doctorService.getDoctorsByDepartment(department);
        return ResponseEntity.ok(doctors);
    }

    @PostMapping
    public ResponseEntity<Doctor> createDoctor(@RequestBody Doctor doctor) {
        Doctor createdDoctor = doctorService.createDoctor(doctor);
        return ResponseEntity.ok(createdDoctor);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Doctor> updateDoctor(
            @PathVariable String id, 
            @RequestBody Doctor doctor) {
        Doctor updatedDoctor = doctorService.updateDoctor(id, doctor);
        if (updatedDoctor != null) {
            return ResponseEntity.ok(updatedDoctor);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable String id) {
        boolean deleted = doctorService.deleteDoctor(id);
        if (deleted) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/recommendations")
    public ResponseEntity<List<Doctor>> getDoctorRecommendations(
            @RequestParam String disease,
            @RequestParam(required = false) String location) {
        List<Doctor> recommendations = doctorService.getDoctorRecommendations(disease, location);
        return ResponseEntity.ok(recommendations);
    }
}
