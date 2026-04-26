package com.example.hospital.controller;

import com.example.hospital.model.Doctor;
import com.example.hospital.model.Hospital;
import com.example.hospital.model.User;
import com.example.hospital.repository.DoctorRepository;
import com.example.hospital.repository.HospitalRepository;
import com.example.hospital.repository.UserRepository;
import com.example.hospital.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private HospitalRepository hospitalRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    // Check if user is admin
    private boolean isAdmin(String token) {
        try {
            String email = jwtService.extractEmail(token.replace("Bearer ", ""));
            Optional<User> user = userRepository.findByEmail(email);
            return user.isPresent() && "ADMIN".equals(user.get().getRole());
        } catch (Exception e) {
            return false;
        }
    }

    // ==================== DOCTOR ENDPOINTS ====================

    @PostMapping("/doctors")
    public ResponseEntity<Map<String, Object>> addDoctor(
            @RequestBody Doctor doctor,
            @RequestHeader("Authorization") String token) {
        
        Map<String, Object> response = new HashMap<>();
        
        if (!isAdmin(token)) {
            response.put("success", false);
            response.put("message", "Unauthorized: Admin access required");
            return ResponseEntity.status(403).body(response);
        }

        try {
            Doctor savedDoctor = doctorRepository.save(doctor);
            response.put("success", true);
            response.put("message", "Doctor added successfully");
            response.put("doctor", savedDoctor);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error adding doctor: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/doctors/{id}")
    public ResponseEntity<Map<String, Object>> updateDoctor(
            @PathVariable String id,
            @RequestBody Doctor doctor,
            @RequestHeader("Authorization") String token) {
        
        Map<String, Object> response = new HashMap<>();
        
        if (!isAdmin(token)) {
            response.put("success", false);
            response.put("message", "Unauthorized: Admin access required");
            return ResponseEntity.status(403).body(response);
        }

        try {
            Optional<Doctor> existingDoctor = doctorRepository.findById(id);
            if (!existingDoctor.isPresent()) {
                response.put("success", false);
                response.put("message", "Doctor not found");
                return ResponseEntity.badRequest().body(response);
            }
            
            doctor.setId(id);
            Doctor updatedDoctor = doctorRepository.save(doctor);
            response.put("success", true);
            response.put("message", "Doctor updated successfully");
            response.put("doctor", updatedDoctor);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error updating doctor: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/doctors/{id}")
    public ResponseEntity<Map<String, Object>> deleteDoctor(
            @PathVariable String id,
            @RequestHeader("Authorization") String token) {
        
        Map<String, Object> response = new HashMap<>();
        
        if (!isAdmin(token)) {
            response.put("success", false);
            response.put("message", "Unauthorized: Admin access required");
            return ResponseEntity.status(403).body(response);
        }

        try {
            doctorRepository.deleteById(id);
            response.put("success", true);
            response.put("message", "Doctor deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error deleting doctor: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // ==================== HOSPITAL ENDPOINTS ====================

    @PostMapping("/hospitals")
    public ResponseEntity<Map<String, Object>> addHospital(
            @RequestBody Hospital hospital,
            @RequestHeader("Authorization") String token) {
        
        Map<String, Object> response = new HashMap<>();
        
        if (!isAdmin(token)) {
            response.put("success", false);
            response.put("message", "Unauthorized: Admin access required");
            return ResponseEntity.status(403).body(response);
        }

        try {
            Hospital savedHospital = hospitalRepository.save(hospital);
            response.put("success", true);
            response.put("message", "Hospital added successfully");
            response.put("hospital", savedHospital);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error adding hospital: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/hospitals/{id}")
    public ResponseEntity<Map<String, Object>> updateHospital(
            @PathVariable String id,
            @RequestBody Hospital hospital,
            @RequestHeader("Authorization") String token) {
        
        Map<String, Object> response = new HashMap<>();
        
        if (!isAdmin(token)) {
            response.put("success", false);
            response.put("message", "Unauthorized: Admin access required");
            return ResponseEntity.status(403).body(response);
        }

        try {
            Optional<Hospital> existingHospital = hospitalRepository.findById(id);
            if (!existingHospital.isPresent()) {
                response.put("success", false);
                response.put("message", "Hospital not found");
                return ResponseEntity.badRequest().body(response);
            }
            
            hospital.setId(id);
            Hospital updatedHospital = hospitalRepository.save(hospital);
            response.put("success", true);
            response.put("message", "Hospital updated successfully");
            response.put("hospital", updatedHospital);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error updating hospital: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/hospitals/{id}")
    public ResponseEntity<Map<String, Object>> deleteHospital(
            @PathVariable String id,
            @RequestHeader("Authorization") String token) {
        
        Map<String, Object> response = new HashMap<>();
        
        if (!isAdmin(token)) {
            response.put("success", false);
            response.put("message", "Unauthorized: Admin access required");
            return ResponseEntity.status(403).body(response);
        }

        try {
            hospitalRepository.deleteById(id);
            response.put("success", true);
            response.put("message", "Hospital deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error deleting hospital: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // ==================== STATS ENDPOINT ====================

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats(
            @RequestHeader("Authorization") String token) {
        
        Map<String, Object> response = new HashMap<>();
        
        if (!isAdmin(token)) {
            response.put("success", false);
            response.put("message", "Unauthorized: Admin access required");
            return ResponseEntity.status(403).body(response);
        }

        try {
            long doctorCount = doctorRepository.count();
            long hospitalCount = hospitalRepository.count();
            long userCount = userRepository.count();

            response.put("success", true);
            response.put("doctors", doctorCount);
            response.put("hospitals", hospitalCount);
            response.put("users", userCount);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error fetching stats: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
