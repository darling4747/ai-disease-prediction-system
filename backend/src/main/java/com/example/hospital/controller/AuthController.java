package com.example.hospital.controller;

import com.example.hospital.model.User;
import com.example.hospital.repository.UserRepository;
import com.example.hospital.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtService jwtService;
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            // Check if email already exists
            if (userRepository.existsByEmail(request.getEmail())) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Email already registered");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Create new user
            User user = new User();
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole(request.getRole() != null ? request.getRole() : "PATIENT");
            
            User savedUser = userRepository.save(user);
            
            // Generate token
            String token = jwtService.generateToken(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getRole()
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("userId", savedUser.getId());
            response.put("email", savedUser.getEmail());
            response.put("role", savedUser.getRole());
            response.put("firstName", savedUser.getFirstName());
            response.put("lastName", savedUser.getLastName());
            response.put("message", "Registration successful");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Registration failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // Find user by email
            Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
            
            if (userOpt.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Invalid email or password");
                return ResponseEntity.status(401).body(error);
            }
            
            User user = userOpt.get();
            
            // Verify password
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Invalid email or password");
                return ResponseEntity.status(401).body(error);
            }
            
            // Check if user is active
            if (!user.isActive()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Account is deactivated");
                return ResponseEntity.status(401).body(error);
            }
            
            // Generate token
            String token = jwtService.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole()
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("userId", user.getId());
            response.put("email", user.getEmail());
            response.put("role", user.getRole());
            response.put("firstName", user.getFirstName());
            response.put("lastName", user.getLastName());
            response.put("message", "Login successful");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Login failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            
            if (!jwtService.isTokenValid(token)) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Invalid token");
                return ResponseEntity.status(401).body(error);
            }
            
            String email = jwtService.extractEmail(token);
            Optional<User> userOpt = userRepository.findByEmail(email);
            
            if (userOpt.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "User not found");
                return ResponseEntity.status(404).body(error);
            }
            
            User user = userOpt.get();
            Map<String, Object> response = new HashMap<>();
            response.put("userId", user.getId());
            response.put("email", user.getEmail());
            response.put("role", user.getRole());
            response.put("firstName", user.getFirstName());
            response.put("lastName", user.getLastName());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to get user: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // Request DTOs
    public static class RegisterRequest {
        private String firstName;
        private String lastName;
        private String email;
        private String password;
        private String role;
        
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }
    
    public static class LoginRequest {
        private String email;
        private String password;
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}
