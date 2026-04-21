package com.event.users.controller;

import com.event.users.dto.LoginRequest;
import com.event.users.dto.LoginResponse;
import com.event.users.dto.RegisterRequest;
import com.event.users.dto.UserProfileDTO;
import com.event.users.service.UserService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication Controller
 * Handles user registration and login
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Allow frontend to access. Related to CORS.
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final UserService userService;

    @Autowired
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Register a new user
     * POST /api/auth/register
     *
     * @param request - registration details
     * @return UserProfileDTO with 201 CREATED
     */
    @PostMapping("/register")
    public ResponseEntity<UserProfileDTO> register(@Valid @RequestBody RegisterRequest request) {
        logger.info("POST /api/auth/register - Registering user: {}", request.getEmail());

        UserProfileDTO userProfile = userService.register(request);

        logger.info("User registered successfully: {}", userProfile.getEmail());
        return new ResponseEntity<>(userProfile, HttpStatus.CREATED);
    }

    /**
     * Login user
     * POST /api/auth/login
     *
     * @param request - login credentials
     * @return LoginResponse with JWT token
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        logger.info("POST /api/auth/login - Login attempt: {}", request.getEmail());

        LoginResponse response = userService.login(request);

        logger.info("User logged in successfully: {}", request.getEmail());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Health check endpoint to ensure the service is running perfectly.
     * GET /api/auth/health
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        logger.info("GET /api/auth/health - Health check");
        return ResponseEntity.ok("User Service is running!");
    }
}