package com.event.organizers.exception;

public class PastEventException extends RuntimeException {
    public PastEventException(String message) {
        super(message);
    }
}
