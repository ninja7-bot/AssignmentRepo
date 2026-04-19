package com.training.todo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * GlobalExceptionHandler
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    // HANDLER 1: Validation Errors
    /**
     * Handles validation failures from @Valid
     *
     * When @Valid fails in the controller, Spring throws
     * MethodArgumentNotValidException with a list of all errors
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(
            MethodArgumentNotValidException ex) {

        // Collect all field errors into a map
        Map<String, String> fieldErrors = new HashMap<>();

        /*
         * getBindingResult().getFieldErrors() returns a list of all failed fields
         */
        ex.getBindingResult().getFieldErrors().forEach(error ->
                fieldErrors.put(error.getField(), error.getDefaultMessage())
        );

        // Build the response
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "validation_error");
        response.put("errors", fieldErrors);
        response.put("timestamp", LocalDateTime.now().toString());

        // Return 400 Bad Request
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }


    // HANDLER 2: Business Logic Errors
    /**
     * Handles custom RuntimeExceptions from service layer
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(
            RuntimeException ex) {

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "error");
        response.put("message", ex.getMessage());
        response.put("timestamp", LocalDateTime.now().toString());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }


    // HANDLER 3: Unexpected Errors (Safety Net)
    /**
     * Catches any other unexpected exceptions
     * This is the last resort "safety net"
     *
     * Returns 500 Internal Server Error
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleException(Exception ex) {

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "error");
        response.put("message", "An unexpected error occurred. Please try again.");
        response.put("timestamp", LocalDateTime.now().toString());

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}