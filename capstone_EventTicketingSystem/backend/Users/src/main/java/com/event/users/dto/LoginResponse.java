package com.event.users.dto;

/**
 * DTO for login response
 * Contains JWT token and user info
 */
public class LoginResponse {

    private String token;
    private String email;
    private String name;
    private String role;
    private String message;

    // Constructors
    public LoginResponse() {
    }

    public LoginResponse(String token, String email, String name, String role, String message) {
        this.token = token;
        this.email = email;
        this.name = name;
        this.role = role;
        this.message = message;
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public String toString() {
        return "LoginResponse{" +
                "token='[PROTECTED]'" +
                ", email='" + email + '\'' +
                ", name='" + name + '\'' +
                ", role='" + role + '\'' +
                ", message='" + message + '\'' +
                '}';
    }
}