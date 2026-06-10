package com.event.users.exception;

/**
 * Exception thrown when password doesn't meet requirements
 */
public class InvalidPasswordException extends RuntimeException {

    public InvalidPasswordException(String message) {
        super(message);
    }
}
