package com.event.organizers.exception;

public class BookingNotAllowedException extends RuntimeException {
    public BookingNotAllowedException(String message) {
        super(message);
    }
}
