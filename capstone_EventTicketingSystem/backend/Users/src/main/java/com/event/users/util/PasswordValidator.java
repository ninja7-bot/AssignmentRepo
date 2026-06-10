package com.event.users.util;

import com.event.users.exception.InvalidPasswordException;

/**
 * Utility class to validate password according to requirements:
 * - Minimum 8 characters
 * - Maximum 12 characters
 * - At least one uppercase letter
 * - At least one special character
 */
public class PasswordValidator {

    private static final int MIN_LENGTH = 8;
    private static final int MAX_LENGTH = 12;

    /**
     * Validate password
     * @param password - the password to validate
     * @throws InvalidPasswordException if password doesn't meet requirements
     */
    public static void validate(String password) {
        // Check if password is null or empty
        if (password == null || password.isEmpty()) {
            throw new InvalidPasswordException("Password cannot be empty");
        }

        // Check minimum length
        if (password.length() < MIN_LENGTH) {
            throw new InvalidPasswordException(
                    "Password must be at least " + MIN_LENGTH + " characters long"
            );
        }

        // Check maximum length
        if (password.length() > MAX_LENGTH) {
            throw new InvalidPasswordException(
                    "Password must not exceed " + MAX_LENGTH + " characters"
            );
        }

        // Check for at least one uppercase letter
        boolean hasUppercase = false;
        for (char c : password.toCharArray()) {
            if (Character.isUpperCase(c)) {
                hasUppercase = true;
                break;
            }
        }
        if (!hasUppercase) {
            throw new InvalidPasswordException(
                    "Password must contain at least one uppercase letter"
            );
        }

        // Check for at least one special character
        String specialCharacters = "!@#$%^&*()_+-=[]{}|;:',.<>?/";
        boolean hasSpecialChar = false;
        for (char c : password.toCharArray()) {
            if (specialCharacters.indexOf(c) >= 0) {
                hasSpecialChar = true;
                break;
            }
        }
        if (!hasSpecialChar) {
            throw new InvalidPasswordException(
                    "Password must contain at least one special character (!@#$%^&*...)"
            );
        }
    }
}