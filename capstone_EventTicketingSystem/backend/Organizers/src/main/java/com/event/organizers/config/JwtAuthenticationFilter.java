package com.event.organizers.config;

import com.event.organizers.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT Authentication Filter
 * Validates JWT token and extracts user information
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // Get Authorization header
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                // Validate token
                if (jwtUtil.validateToken(token)) {
                    // Extract user information
                    String name = jwtUtil.extractName(token);
                    String email = jwtUtil.extractEmail(token);
                    String role = jwtUtil.extractRole(token);

                    System.out.print(name + " " + email + " " + role);

                    // Set user info in request attributes
                    request.setAttribute("userEmail", email);
                    request.setAttribute("userRole", role);
                    request.setAttribute("userName", name);
                }
            } catch (Exception e) {
                System.err.println("JWT validation failed: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}