package com.example.hospital.controller;

import com.example.hospital.model.Hospital;
import com.example.hospital.service.HospitalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
@CrossOrigin(origins = "*")
public class HospitalController {

    @Autowired
    private HospitalService hospitalService;

    @GetMapping
    public ResponseEntity<List<Hospital>> getAllHospitals(
            @RequestParam(required = false) String location) {
        List<Hospital> hospitals;
        if (location != null && !location.trim().isEmpty()) {
            hospitals = hospitalService.getHospitalsByLocation(location);
        } else {
            hospitals = hospitalService.getAllHospitals();
        }
        return ResponseEntity.ok(hospitals);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hospital> getHospitalById(@PathVariable String id) {
        Hospital hospital = hospitalService.getHospitalById(id);
        if (hospital != null) {
            return ResponseEntity.ok(hospital);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Hospital>> searchHospitals(
            @RequestParam String query,
            @RequestParam(required = false) String specialty) {
        List<Hospital> hospitals = hospitalService.searchHospitals(query, specialty);
        return ResponseEntity.ok(hospitals);
    }

    @PostMapping
    public ResponseEntity<Hospital> createHospital(@RequestBody Hospital hospital) {
        Hospital createdHospital = hospitalService.createHospital(hospital);
        return ResponseEntity.ok(createdHospital);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Hospital> updateHospital(
            @PathVariable String id, 
            @RequestBody Hospital hospital) {
        Hospital updatedHospital = hospitalService.updateHospital(id, hospital);
        if (updatedHospital != null) {
            return ResponseEntity.ok(updatedHospital);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHospital(@PathVariable String id) {
        boolean deleted = hospitalService.deleteHospital(id);
        if (deleted) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
