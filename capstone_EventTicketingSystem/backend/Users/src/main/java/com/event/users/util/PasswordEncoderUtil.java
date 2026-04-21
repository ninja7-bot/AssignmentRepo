package com.event.users.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * Simple password hashing utility using SHA-256 with salt
 */
public class PasswordEncoderUtil {

    /**
     * Hash a password with random salt
     */
    public static String hashPassword(String password) {
        try {
            // Generate random salt
            SecureRandom random = new SecureRandom();
            byte[] salt = new byte[16];
            random.nextBytes(salt);

            // Create SHA-256 hash
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(salt);
            byte[] hashedPassword = md.digest(password.getBytes());

            // Combine salt and hash
            byte[] combined = new byte[salt.length + hashedPassword.length];
            System.arraycopy(salt, 0, combined, 0, salt.length);
            System.arraycopy(hashedPassword, 0, combined, salt.length, hashedPassword.length);

            // Encode to Base64 for storage
            return Base64.getEncoder().encodeToString(combined);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }

    /**
     * Verify if password matches the hashed password
     */
    public static boolean verifyPassword(String password, String hashedPassword) {
        try {
            // Decode the stored hash
            byte[] combined = Base64.getDecoder().decode(hashedPassword);

            // Extract salt (first 16 bytes)
            byte[] salt = new byte[16];
            System.arraycopy(combined, 0, salt, 0, 16);

            // Hash the input password with same salt
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(salt);
            byte[] hashedInput = md.digest(password.getBytes());

            // Compare hashes
            for (int i = 0; i < hashedInput.length; i++) {
                if (hashedInput[i] != combined[i + 16]) {
                    return false;
                }
            }
            return true;
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error verifying password", e);
        }
    }
}