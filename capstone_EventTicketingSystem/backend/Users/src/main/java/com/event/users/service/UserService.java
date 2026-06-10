package com.event.users.service;

import com.event.users.dto.LoginRequest;
import com.event.users.dto.LoginResponse;
import com.event.users.dto.RegisterRequest;
import com.event.users.dto.UserProfileDTO;

/**
 * User Service Interface
 */
public interface UserService {

    /**
     * Register a new user
     */
    UserProfileDTO register(RegisterRequest request);

    /**
     * Login user and return JWT token
     */
    LoginResponse login(LoginRequest request);

    /**
     * Get user profile by email
     */
    UserProfileDTO getUserByEmail(String email);
}