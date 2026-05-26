package com.example.hospital.controller;

import com.example.hospital.model.Appointment;
import com.example.hospital.model.Doctor;
import com.example.hospital.model.User;
import com.example.hospital.repository.AppointmentRepository;
import com.example.hospital.repository.DoctorRepository;
import com.example.hospital.repository.UserRepository;
import com.example.hospital.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    // Get current user from token
    private User getCurrentUser(String token) {
        System.out.println("DEBUG: Token received: " + (token != null ? token.substring(0, Math.min(50, token.length())) + "..." : "null"));
        try {
            if (token == null || token.isEmpty()) {
                System.out.println("DEBUG: Token is null or empty");
                return null;
            }
            // Remove "Bearer " prefix if present
            String jwtToken = token.startsWith("Bearer ") ? token.substring(7) : token;
            System.out.println("DEBUG: JWT after removing Bearer: " + jwtToken.substring(0, Math.min(30, jwtToken.length())) + "...");
            
            // Validate token first
            if (!jwtService.isTokenValid(jwtToken)) {
                System.out.println("DEBUG: Token is invalid or expired");
                return null;
            }
            
            String email = jwtService.extractEmail(jwtToken);
            System.out.println("DEBUG: Extracted email: " + email);
            
            Optional<User> user = userRepository.findByEmail(email);
            if (user.isPresent()) {
                System.out.println("DEBUG: User found: " + user.get().getEmail());
            } else {
                System.out.println("DEBUG: User not found for email: " + email);
            }
            return user.orElse(null);
        } catch (Exception e) {
            System.out.println("DEBUG: Exception in getCurrentUser: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    // Book an appointment
    @PostMapping("/book")
    public ResponseEntity<Map<String, Object>> bookAppointment(
            @RequestBody Map<String, Object> request,
            @RequestHeader("Authorization") String token) {

        Map<String, Object> response = new HashMap<>();
        User currentUser = getCurrentUser(token);

        if (currentUser == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }
        if (!"PATIENT".equalsIgnoreCase(currentUser.getRole())) {
            response.put("success", false);
            response.put("message", "Only patients can book appointments");
            return ResponseEntity.status(403).body(response);
        }

        try {
            String doctorId = (String) request.get("doctorId");
            String appointmentDateStr = (String) request.get("appointmentDate");
            String symptoms = (String) request.get("symptoms");
            String notes = (String) request.get("notes");

            // Get doctor details
            Optional<Doctor> doctorOpt = doctorRepository.findById(doctorId);
            if (!doctorOpt.isPresent()) {
                response.put("success", false);
                response.put("message", "Doctor not found");
                return ResponseEntity.badRequest().body(response);
            }

            Doctor doctor = doctorOpt.get();

            // Parse appointment date
            LocalDateTime appointmentDate = LocalDateTime.parse(appointmentDateStr);

            // Check if slot is available
            boolean exists = appointmentRepository.existsByDoctorIdAndAppointmentDate(doctorId, appointmentDate);
            if (exists) {
                response.put("success", false);
                response.put("message", "This time slot is already booked");
                return ResponseEntity.badRequest().body(response);
            }

            // Create appointment
            Appointment appointment = new Appointment();
            appointment.setPatientId(currentUser.getId());
            appointment.setPatientName(currentUser.getFirstName() + " " + currentUser.getLastName());
            appointment.setPatientEmail(currentUser.getEmail());
            appointment.setDoctorId(doctorId);
            appointment.setDoctorName(doctor.getName());
            appointment.setDoctorSpecialization(doctor.getSpecialization());
            appointment.setHospitalId(doctor.getHospitalId());
            appointment.setHospitalName(doctor.getHospital());
            appointment.setAppointmentDate(appointmentDate);
            appointment.setSymptoms(symptoms);
            appointment.setNotes(notes);
            appointment.setStatus("PENDING");

            Appointment saved = appointmentRepository.save(appointment);

            response.put("success", true);
            response.put("message", "Appointment booked successfully");
            response.put("appointment", saved);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error booking appointment: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get patient's appointments
    @GetMapping("/my-appointments")
    public ResponseEntity<Map<String, Object>> getMyAppointments(
            @RequestHeader("Authorization") String token) {

        Map<String, Object> response = new HashMap<>();
        User currentUser = getCurrentUser(token);

        if (currentUser == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        try {
            List<Appointment> appointments = appointmentRepository
                    .findByPatientIdOrderByAppointmentDateDesc(currentUser.getId());

            response.put("success", true);
            response.put("appointments", appointments);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error fetching appointments: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Cancel appointment
    @PutMapping("/cancel/{id}")
    public ResponseEntity<Map<String, Object>> cancelAppointment(
            @PathVariable String id,
            @RequestHeader("Authorization") String token) {

        Map<String, Object> response = new HashMap<>();
        User currentUser = getCurrentUser(token);

        if (currentUser == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        try {
            Optional<Appointment> appointmentOpt = appointmentRepository.findById(id);
            if (!appointmentOpt.isPresent()) {
                response.put("success", false);
                response.put("message", "Appointment not found");
                return ResponseEntity.badRequest().body(response);
            }

            Appointment appointment = appointmentOpt.get();

            // Check if user owns this appointment
            if (!appointment.getPatientId().equals(currentUser.getId())) {
                response.put("success", false);
                response.put("message", "Not authorized to cancel this appointment");
                return ResponseEntity.status(403).body(response);
            }

            appointment.setStatus("CANCELLED");
            appointment.setUpdatedAt(LocalDateTime.now());
            appointmentRepository.save(appointment);

            response.put("success", true);
            response.put("message", "Appointment cancelled successfully");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error cancelling appointment: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get available time slots for a doctor on a specific date
    @GetMapping("/available-slots")
    public ResponseEntity<Map<String, Object>> getAvailableSlots(
            @RequestParam String doctorId,
            @RequestParam String date) {

        Map<String, Object> response = new HashMap<>();

        try {
            // Parse date and create slots (9 AM to 5 PM, 30 min intervals)
            LocalDateTime startOfDay = LocalDateTime.parse(date + "T09:00:00");
            LocalDateTime endOfDay = LocalDateTime.parse(date + "T17:00:00");

            List<Appointment> existingAppointments = appointmentRepository
                    .findByDoctorIdAndAppointmentDateBetween(doctorId, startOfDay, endOfDay);

            // Generate all possible slots
            String[] slots = {
                "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
                "12:00", "12:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
            };

            // Filter out booked slots
            List<String> availableSlots = new java.util.ArrayList<>();
            for (String slot : slots) {
                LocalDateTime slotTime = LocalDateTime.parse(date + "T" + slot + ":00");
                boolean isBooked = existingAppointments.stream()
                        .anyMatch(a -> a.getAppointmentDate().equals(slotTime) && 
                                !a.getStatus().equals("CANCELLED"));
                if (!isBooked) {
                    availableSlots.add(slot);
                }
            }

            response.put("success", true);
            response.put("slots", availableSlots);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error fetching slots: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get all appointments (for admin)
    @GetMapping("/all")
    public ResponseEntity<Map<String, Object>> getAllAppointments(
            @RequestHeader("Authorization") String token) {

        Map<String, Object> response = new HashMap<>();
        User currentUser = getCurrentUser(token);

        if (currentUser == null || (!"ADMIN".equals(currentUser.getRole()) && !"DOCTOR".equals(currentUser.getRole()))) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(403).body(response);
        }

        try {
            List<Appointment> appointments;
            if ("ADMIN".equals(currentUser.getRole())) {
                appointments = appointmentRepository.findAll();
            } else {
                Optional<Doctor> doctor = doctorRepository.findByEmail(currentUser.getEmail());
                appointments = doctor
                        .map(value -> appointmentRepository.findByDoctorIdOrderByAppointmentDateDesc(value.getId()))
                        .orElse(List.of());
            }
            response.put("success", true);
            response.put("appointments", appointments);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error fetching appointments: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Update appointment status (for admin/doctor)
    @PutMapping("/status/{id}")
    public ResponseEntity<Map<String, Object>> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> request,
            @RequestHeader("Authorization") String token) {

        Map<String, Object> response = new HashMap<>();
        User currentUser = getCurrentUser(token);

        if (currentUser == null || !"ADMIN".equals(currentUser.getRole())) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(403).body(response);
        }

        try {
            Optional<Appointment> appointmentOpt = appointmentRepository.findById(id);
            if (!appointmentOpt.isPresent()) {
                response.put("success", false);
                response.put("message", "Appointment not found");
                return ResponseEntity.badRequest().body(response);
            }

            Appointment appointment = appointmentOpt.get();
            appointment.setStatus(request.get("status"));
            appointment.setUpdatedAt(LocalDateTime.now());
            appointmentRepository.save(appointment);

            response.put("success", true);
            response.put("message", "Status updated successfully");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error updating status: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
