package com.example.hospital;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.hospital.controller.AuthController.RegisterRequest;
import com.example.hospital.controller.AuthController.LoginRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void registerUser_ValidPayload_ShouldReturnOk() throws Exception {
        String uniqueEmail = "user_" + UUID.randomUUID() + "@example.com";
        RegisterRequest request = new RegisterRequest();
        request.setFirstName("Alice");
        request.setLastName("Smith");
        request.setEmail(uniqueEmail);
        request.setPassword("password123");
        request.setRole("PATIENT");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.email", is(uniqueEmail)))
                .andExpect(jsonPath("$.role", is("PATIENT")));
    }

    @Test
    void registerUser_InvalidEmail_ShouldReturnApiError() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setFirstName("Bob");
        request.setLastName("Jones");
        request.setEmail("not-a-valid-email"); // Invalid email format
        request.setPassword("12345"); // Password too short (minimum 6)
        request.setRole("PATIENT");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.error", is("Bad Request")))
                .andExpect(jsonPath("$.message", containsString("validation failed")))
                .andExpect(jsonPath("$.validationErrors.email", notNullValue()))
                .andExpect(jsonPath("$.validationErrors.password", notNullValue()));
    }

    @Test
    void registerUser_DuplicateEmail_ShouldReturnApiError() throws Exception {
        String duplicateEmail = "dup_" + UUID.randomUUID() + "@example.com";
        
        // 1. First registration
        RegisterRequest request1 = new RegisterRequest();
        request1.setFirstName("John");
        request1.setLastName("Doe");
        request1.setEmail(duplicateEmail);
        request1.setPassword("securePassword");
        request1.setRole("DOCTOR");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request1)))
                .andExpect(status().isOk());

        // 2. Second registration with the same email
        RegisterRequest request2 = new RegisterRequest();
        request2.setFirstName("Johnny");
        request2.setLastName("Doe");
        request2.setEmail(duplicateEmail);
        request2.setPassword("anotherPassword");
        request2.setRole("PATIENT");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request2)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.message", is("Email already registered")));
    }
}
