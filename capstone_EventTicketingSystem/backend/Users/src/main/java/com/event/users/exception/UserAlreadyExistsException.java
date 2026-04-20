package com.event.users.exception;

/**
 * Exception thrown when trying to register with an email that already exists
 */
public class UserAlreadyExistsException extends RuntimeException {

    public UserAlreadyExistsException(String message) {
        super(message);
    }
}