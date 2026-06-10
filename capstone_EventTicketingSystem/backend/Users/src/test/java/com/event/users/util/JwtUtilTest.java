package com.event.users.util;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();

        ReflectionTestUtils.setField(jwtUtil, "SECRET_KEY",
                "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970");
        ReflectionTestUtils.setField(jwtUtil, "EXPIRATION_TIME", 1800000L);
    }

    @Test
    void testGenerateToken() {
        String token = jwtUtil.generateToken("Test User", "test@gmail.com", "CUSTOMER");

        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void testExtractEmail() {
        String token = jwtUtil.generateToken("Test User", "test@gmail.com", "CUSTOMER");

        String email = jwtUtil.extractEmail(token);

        assertEquals("test@gmail.com", email);
    }

    @Test
    void testExtractRole() {
        String token = jwtUtil.generateToken("Test User", "test@gmail.com", "ORGANIZER");

        String role = jwtUtil.extractRole(token);

        assertEquals("ORGANIZER", role);
    }

    @Test
    void testExtractName() {
        String token = jwtUtil.generateToken("John Doe", "test@gmail.com", "CUSTOMER");

        String name = jwtUtil.extractName(token);

        assertEquals("John Doe", name);
    }

    @Test
    void testValidateToken() {
        String token = jwtUtil.generateToken("Test User", "test@gmail.com", "CUSTOMER");

        boolean isValid = jwtUtil.validateToken(token, "test@gmail.com");

        assertTrue(isValid);
    }

    @Test
    void testValidateTokenWrongEmail() {
        String token = jwtUtil.generateToken("Test User", "test@gmail.com", "CUSTOMER");

        boolean isValid = jwtUtil.validateToken(token, "wrong@gmail.com");

        assertFalse(isValid);
    }

    @Test
    void testValidateTokenFakeToken() {
        boolean isValid = jwtUtil.validateToken("this.is.fake");

        assertFalse(isValid);
    }

    @Test
    void testIsTokenExpired() {
        String token = jwtUtil.generateToken("Test User", "test@gmail.com", "CUSTOMER");

        boolean isExpired = jwtUtil.isTokenExpired(token);

        assertFalse(isExpired);
    }
}