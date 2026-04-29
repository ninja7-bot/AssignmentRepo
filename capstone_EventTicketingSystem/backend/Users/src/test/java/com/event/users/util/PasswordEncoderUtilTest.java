package com.event.users.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PasswordEncoderUtilTest {

    @Test
    void testHashPassword() {
        String hashed = PasswordEncoderUtil.hashPassword("Valid@123");

        assertNotNull(hashed);
        assertFalse(hashed.isEmpty());
    }

    @Test
    void testHashPasswordFake() {
        String original = "Valid@123";
        String hashed   = PasswordEncoderUtil.hashPassword(original);

        assertNotEquals(original, hashed);
    }

    @Test
    void testHashPasswordTwice() {
        String hash1 = PasswordEncoderUtil.hashPassword("Valid@123");
        String hash2 = PasswordEncoderUtil.hashPassword("Valid@123");

        assertNotEquals(hash1, hash2);
    }

    @Test
    void testVerifyPasswordCorrect() {
        String plain  = "Valid@123";
        String hashed = PasswordEncoderUtil.hashPassword(plain);

        assertTrue(PasswordEncoderUtil.verifyPassword(plain, hashed));
    }

    @Test
    void testVerifyPasswordIncorrect() {
        String hashed = PasswordEncoderUtil.hashPassword("Valid@123");

        assertFalse(PasswordEncoderUtil.verifyPassword("Wrong@123", hashed));
    }
}