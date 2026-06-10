package com.event.users.util;

import com.event.users.exception.InvalidPasswordException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PasswordValidatorTest {

    @Test
    void testGoodPassword() {
        assertDoesNotThrow(() -> PasswordValidator.validate("Valid@123"));
    }

    @Test
    void testPasswordShort() {
        assertThrows(InvalidPasswordException.class,
                () -> PasswordValidator.validate("Va@1"));
    }

    @Test
    void testPasswordLong() {
        assertThrows(InvalidPasswordException.class,
                () -> PasswordValidator.validate("ValidPassword@123"));
    }

    @Test
    void testPasswordNoUppercase() {
        assertThrows(InvalidPasswordException.class,
                () -> PasswordValidator.validate("valid@123"));
    }

    @Test
    void testPasswordNoSpecialChar() {
        assertThrows(InvalidPasswordException.class,
                () -> PasswordValidator.validate("Password123"));
    }

    @Test
    void testNullPassword() {
        assertThrows(InvalidPasswordException.class,
                () -> PasswordValidator.validate(null));
    }

    @Test
    void testEmptyPassword() {
        assertThrows(InvalidPasswordException.class,
                () -> PasswordValidator.validate(""));
    }
}