package com.event.users.controller;

import com.event.users.dto.LoginRequest;
import com.event.users.dto.LoginResponse;
import com.event.users.dto.RegisterRequest;
import com.event.users.dto.UserProfileDTO;
import com.event.users.enums.UserRole;
import com.event.users.exception.InvalidCredentialsException;
import com.event.users.exception.UserAlreadyExistsException;
import com.event.users.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    private RegisterRequest validRegisterRequest;
    private UserProfileDTO userProfileDTO;
    private LoginRequest loginRequest;
    private LoginResponse loginResponse;

    @BeforeEach
    void setUp() {
        validRegisterRequest = new RegisterRequest();
        validRegisterRequest.setName("John Doe");
        validRegisterRequest.setEmail("john@gmail.com");
        validRegisterRequest.setPassword("Valid@123");
        validRegisterRequest.setPhone("1234567890");
        validRegisterRequest.setRole(UserRole.CUSTOMER);

        userProfileDTO = new UserProfileDTO();
        userProfileDTO.setId(1L);
        userProfileDTO.setName("John Doe");
        userProfileDTO.setEmail("john@gmail.com");
        userProfileDTO.setPhone("1234567890");
        userProfileDTO.setRole(UserRole.CUSTOMER);
        userProfileDTO.setCreatedAt(LocalDateTime.now());

        loginRequest = new LoginRequest("john@gmail.com", "Valid@123");

        loginResponse = new LoginResponse();
        loginResponse.setToken("mock-jwt-token");
        loginResponse.setEmail("john@gmail.com");
        loginResponse.setName("John Doe");
        loginResponse.setRole("CUSTOMER");
        loginResponse.setMessage("Login successful");
    }

    @Test
    void testRegisterSuccess() throws Exception {
        when(userService.register(any(RegisterRequest.class)))
                .thenReturn(userProfileDTO);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                validRegisterRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("John Doe"))
                .andExpect(jsonPath("$.email")
                        .value("john@gmail.com"))
                .andExpect(jsonPath("$.role").value("CUSTOMER"));
    }

    @Test
    void testRegisterDuplicateEmail() throws Exception {
        when(userService.register(any(RegisterRequest.class)))
                .thenThrow(new UserAlreadyExistsException(
                        "Email already exists"));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                validRegisterRequest)))
                .andExpect(status().isConflict());
    }

    @Test
    void testRegisterMissingName() throws Exception {
        validRegisterRequest.setName("");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                validRegisterRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testRegisterMissingEmail() throws Exception {
        validRegisterRequest.setEmail("");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                validRegisterRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testRegisterMissingPhone() throws Exception {
        validRegisterRequest.setPhone("");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                validRegisterRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testRegisterNoPassword()
            throws Exception {
        when(userService.register(any(RegisterRequest.class)))
                .thenReturn(userProfileDTO);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                validRegisterRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.password").doesNotExist());
    }

    @Test
    void testLoginSuccess() throws Exception {
        when(userService.login(any(LoginRequest.class)))
                .thenReturn(loginResponse);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token")
                        .value("mock-jwt-token"))
                .andExpect(jsonPath("$.email")
                        .value("john@gmail.com"))
                .andExpect(jsonPath("$.role").value("CUSTOMER"))
                .andExpect(jsonPath("$.message")
                        .value("Login successful"));
    }

    @Test
    void testLoginInvalidCredentials() throws Exception {
        when(userService.login(any(LoginRequest.class)))
                .thenThrow(new InvalidCredentialsException(
                        "Invalid email or password"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                loginRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testLoginMissingEmail() throws Exception {
        LoginRequest bad = new LoginRequest("", "Valid@123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(bad)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testLoginMissingPassword() throws Exception {
        LoginRequest bad = new LoginRequest("john@gmail.com", "");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(bad)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testHealth() throws Exception {
        mockMvc.perform(get("/api/auth/health"))
                .andExpect(status().isOk())
                .andExpect(content()
                        .string("User Service is running!"));
    }
}