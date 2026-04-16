package com.training.ems.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * GlobalExceptionHandler
 * Catches errors from all controllers in one centralized place
 * Avoiding try-catch in every single method
 *
 * @RestControllerAdvice:
 * -> Applies to all @RestController classes automatically
 * -> Catches exceptions
 * -> Returns JSON error responses
 */
@RestControllerAdvice
public class GlobalExceptionHandler {
    /**
     * Handles custom logic errors
     * Example: "Name is required", "Employee not found"
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {

        Map<String, Object> error = new HashMap<>();
        error.put("status", "error");
        error.put("message", ex.getMessage());
        error.put("timestamp", LocalDateTime.now().toString());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    /**
     * Handles wrong data type in URL parameters
     * Example: /ems/search?age=abc (age should be a number)
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, Object>> handleTypeMismatch(
            MethodArgumentTypeMismatchException ex) {

        Map<String, Object> error = new HashMap<>();
        error.put("status", "error");
        error.put("message", "Invalid value for '" + ex.getName()
                + "'. Expected type: " + ex.getRequiredType().getSimpleName());
        error.put("timestamp", LocalDateTime.now().toString());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    /**
     * Handles any other unexpected errors
     * Acts as a safety net for unknown errors
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleException(Exception ex) {

        Map<String, Object> error = new HashMap<>();
        error.put("status", "error");
        error.put("message", "Something went wrong. Please try again.");
        error.put("timestamp", LocalDateTime.now().toString());

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}