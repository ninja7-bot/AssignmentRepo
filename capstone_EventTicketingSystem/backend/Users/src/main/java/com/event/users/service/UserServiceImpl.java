package com.event.users.service;

import com.event.users.dto.LoginRequest;
import com.event.users.dto.LoginResponse;
import com.event.users.dto.RegisterRequest;
import com.event.users.dto.UserProfileDTO;
import com.event.users.entity.User;
import com.event.users.exception.InvalidCredentialsException;
import com.event.users.exception.UserAlreadyExistsException;
import com.event.users.repository.UserRepository;
import com.event.users.util.JwtUtil;
import com.event.users.util.PasswordEncoderUtil;
import com.event.users.util.PasswordValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * User Service Implementation
 * Logic for user operations
 */
@Service
public class UserServiceImpl implements UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Register a new user
     */
    @Override
    @Transactional
    public UserProfileDTO register(RegisterRequest request) {
        logger.info("Registration attempt for email: {}", request.getEmail());

        // Checking if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            logger.warn("Registration failed: Email already exists - {}", request.getEmail());
            throw new UserAlreadyExistsException(
                    "User with email " + request.getEmail() + " already exists"
            );
        }

        // Password Validation
        PasswordValidator.validate(request.getPassword());
        logger.info("Password validation passed for: {}", request.getEmail());

        // Create new user
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // Hash password
        String hashedPassword = PasswordEncoderUtil.hashPassword(request.getPassword());
        user.setPassword(hashedPassword);

        user.setPhone(request.getPhone());
        user.setRole(request.getRole());

        // Save user
        User savedUser = userRepository.save(user);
        logger.info("User registered successfully with ID: {}", savedUser.getId());

        // Return DTO without password
        return convertToDTO(savedUser);
    }

    /**
     * Login user
     */
    @Override
    public LoginResponse login(LoginRequest request) {
        logger.info("Login attempt for email: {}", request.getEmail());

        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    logger.warn("Login failed: User not found - {}", request.getEmail());
                    return new InvalidCredentialsException("Invalid email or password");
                });

        // Verify password
        boolean passwordMatches = PasswordEncoderUtil.verifyPassword(
                request.getPassword(),
                user.getPassword()
        );

        if (!passwordMatches) {
            logger.warn("Login failed: Invalid password for - {}", request.getEmail());
            throw new InvalidCredentialsException("Invalid email or password");
        }

        logger.info("Login successful for: {}", request.getEmail());

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getName(), user.getEmail(), user.getRole().toString());

        // Create response
        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setRole(user.getRole().toString());
        response.setMessage("Login successful");

        return response;
    }

    /**
     * Get user by email
     */
    @Override
    public UserProfileDTO getUserByEmail(String email) {
        logger.info("Fetching user profile for: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        return convertToDTO(user);
    }

    /**
     * Convert User entity to UserProfileDTO
     */
    private UserProfileDTO convertToDTO(User user) {
        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}