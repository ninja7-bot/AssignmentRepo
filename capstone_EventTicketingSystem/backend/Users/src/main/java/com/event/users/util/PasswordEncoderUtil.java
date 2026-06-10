package com.event.users.util;

import org.mindrot.jbcrypt.BCrypt;

/**
 * Password hashing utility using BCrypt
 * BCrypt automatically handles salting
 */
public class PasswordEncoderUtil {

    /**
     * Hash a password using BCrypt
     * @param password plain text password
     * @return hashed password string
     */
    public static String hashPassword(String password) {
        return BCrypt.hashpw(password, BCrypt.gensalt(12));
    }

    /**
     * Verify if a password matches the hashed password
     * @param password plain text password to check
     * @param hashedPassword stored hashed password
     * @return true if matches, false otherwise
     */
    public static boolean verifyPassword(String password, String hashedPassword) {
        return BCrypt.checkpw(password, hashedPassword);
    }
}