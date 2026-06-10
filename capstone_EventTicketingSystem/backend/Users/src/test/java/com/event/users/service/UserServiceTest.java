package com.event.users.service;

import com.event.users.dto.LoginRequest;
import com.event.users.dto.LoginResponse;
import com.event.users.dto.RegisterRequest;
import com.event.users.dto.UserProfileDTO;
import com.event.users.entity.User;
import com.event.users.enums.UserRole;
import com.event.users.exception.InvalidCredentialsException;
import com.event.users.exception.InvalidPasswordException;
import com.event.users.exception.UserAlreadyExistsException;
import com.event.users.repository.UserRepository;
import com.event.users.util.JwtUtil;
import com.event.users.util.PasswordEncoderUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private UserServiceImpl userService;

    private RegisterRequest validRegisterRequest;
    private User savedUser;

    @BeforeEach
    void setUp() {
        validRegisterRequest = new RegisterRequest();
        validRegisterRequest.setName("John Doe");
        validRegisterRequest.setEmail("john@gmail.com");
        validRegisterRequest.setPassword("Valid@123");
        validRegisterRequest.setPhone("1234567890");
        validRegisterRequest.setRole(UserRole.CUSTOMER);

        savedUser = new User();
        savedUser.setId(1L);
        savedUser.setName("John Doe");
        savedUser.setEmail("john@gmail.com");

        savedUser.setPassword(PasswordEncoderUtil.hashPassword("Valid@123"));
        savedUser.setPhone("1234567890");
        savedUser.setRole(UserRole.CUSTOMER);
    }

    @Test
    void testRegisterValidData() {
        when(userRepository.existsByEmail("john@gmail.com"))
                .thenReturn(false);

        when(userRepository.save(any(User.class)))
                .thenReturn(savedUser);

        UserProfileDTO result = userService.register(validRegisterRequest);

        assertNotNull(result);
        assertEquals("John Doe", result.getName());
        assertEquals("john@gmail.com", result.getEmail());
        assertEquals(UserRole.CUSTOMER, result.getRole());
    }

    @Test
    void testRegisterEmailAlreadyExists() {
        when(userRepository.existsByEmail("john@gmail.com"))
                .thenReturn(true);

        assertThrows(UserAlreadyExistsException.class,
                () -> userService.register(validRegisterRequest));

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testRegisterPasswordShort() {
        validRegisterRequest.setPassword("Va@1"); // Too short

        when(userRepository.existsByEmail(anyString()))
                .thenReturn(false);

        assertThrows(InvalidPasswordException.class,
                () -> userService.register(validRegisterRequest));
    }

    @Test
    void testRegisterPasswordNoUppercase() {
        validRegisterRequest.setPassword("valid@123"); // no uppercase

        when(userRepository.existsByEmail(anyString()))
                .thenReturn(false);

        assertThrows(InvalidPasswordException.class,
                () -> userService.register(validRegisterRequest));
    }

    @Test
    void testRegisterPasswordNoSpecialChar() {
        validRegisterRequest.setPassword("Password123");

        when(userRepository.existsByEmail(anyString()))
                .thenReturn(false);

        assertThrows(InvalidPasswordException.class,
                () -> userService.register(validRegisterRequest));
    }

    @Test
    void testLoginCorrectCredentials() {
        when(userRepository.findByEmail("john@gmail.com"))
                .thenReturn(Optional.of(savedUser));

        when(jwtUtil.generateToken(anyString(), anyString(), anyString()))
                .thenReturn("fake-jwt-token");

        LoginRequest loginRequest = new LoginRequest("john@gmail.com", "Valid@123");
        LoginResponse response = userService.login(loginRequest);

        assertNotNull(response);
        assertEquals("fake-jwt-token", response.getToken());
        assertEquals("john@gmail.com", response.getEmail());
        assertEquals("Login successful", response.getMessage());
    }

    @Test
    void testLoginWrongEmail() {
        when(userRepository.findByEmail(anyString()))
                .thenReturn(Optional.empty());

        LoginRequest loginRequest = new LoginRequest("nobody@gmail.com", "Valid@123");

        assertThrows(InvalidCredentialsException.class,
                () -> userService.login(loginRequest));
    }

    @Test
    void testLoginWrongPassword() {
        when(userRepository.findByEmail("john@gmail.com"))
                .thenReturn(Optional.of(savedUser));

        LoginRequest loginRequest = new LoginRequest("john@gmail.com", "Wrong@123");

        assertThrows(InvalidCredentialsException.class,
                () -> userService.login(loginRequest));
    }
}