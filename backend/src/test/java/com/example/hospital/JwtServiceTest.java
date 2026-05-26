package com.example.hospital;

import com.example.hospital.service.JwtService;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;
    private final String testUserId = "user-123";
    private final String testEmail = "test@example.com";
    private final String testRole = "PATIENT";

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
    }

    @Test
    void generateToken_ShouldReturnValidJWT() {
        String token = jwtService.generateToken(testUserId, testEmail, testRole);

        assertNotNull(token);
        assertTrue(token.split("\\.").length == 3); // JWT format: header.payload.signature
    }

    @Test
    void extractClaims_ShouldCorrectlyExtractValues() {
        String token = jwtService.generateToken(testUserId, testEmail, testRole);

        Claims claims = jwtService.extractClaims(token);
        assertEquals(testUserId, claims.get("userId", String.class));
        assertEquals(testEmail, claims.getSubject());
        assertEquals(testRole, claims.get("role", String.class));
    }

    @Test
    void extractRole_ShouldReturnCorrectRole() {
        String token = jwtService.generateToken(testUserId, testEmail, testRole);

        String role = jwtService.extractRole(token);
        assertEquals(testRole, role);
    }

    @Test
    void isTokenValid_ShouldReturnTrueForValidToken() {
        String token = jwtService.generateToken(testUserId, testEmail, testRole);

        assertTrue(jwtService.isTokenValid(token));
    }
}
