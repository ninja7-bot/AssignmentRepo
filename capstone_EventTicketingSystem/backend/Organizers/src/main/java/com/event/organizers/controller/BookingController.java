package com.event.organizers.controller;

import com.event.organizers.dto.BookingRequest;
import com.event.organizers.dto.BookingResponse;
import com.event.organizers.service.BookingService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for Booking operations
 */
@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private static final Logger logger =
            LoggerFactory.getLogger(BookingController.class);

    @Autowired
    private BookingService bookingService;

    // POST /api/bookings
    @PostMapping
    public ResponseEntity<?> createBooking(
            @Valid @RequestBody BookingRequest request,
            HttpServletRequest httpRequest) {

        String userName = (String) httpRequest.getAttribute("userName");
        String userEmail  = (String) httpRequest.getAttribute("userEmail");
        String userRole  = (String) httpRequest.getAttribute("userRole");

        if (userEmail == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication required.");
        }

        if (!userRole.equals("CUSTOMER")) {
            logger.info("User {} is a customer.", userEmail);
        }

        if (!"CUSTOMER".equals(userRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Only customers can book tickets.");
        }

        logger.info("Booking request from: {} for event: {}",
                userEmail, request.getEventId());

        BookingResponse response =
                bookingService.createBooking(request, userEmail, userName);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // GET /api/bookings/my-bookings
    @GetMapping("/my-bookings")
    public ResponseEntity<?> getMyBookings(HttpServletRequest httpRequest) {

        String userEmail = (String) httpRequest.getAttribute("userEmail");
        String userRole  = (String) httpRequest.getAttribute("userRole");

        if (userEmail == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication required.");
        }

        if (!"CUSTOMER".equals(userRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Only customers can view their bookings.");
        }

        logger.info("Fetching bookings for customer: {}", userEmail);

        List<BookingResponse> bookings =
                bookingService.getMyBookings(userEmail);

        return ResponseEntity.ok(bookings);
    }

    // GET /api/bookings/event/{eventId}
    @GetMapping("/event/{eventId}")
    public ResponseEntity<?> getBookingsByEvent(
            @PathVariable Long eventId,
            HttpServletRequest httpRequest) {

        String userEmail = (String) httpRequest.getAttribute("userEmail");
        String userRole  = (String) httpRequest.getAttribute("userRole");

        if (userEmail == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication required.");
        }

        if (!"ORGANIZER".equals(userRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Only organizers can view event bookings.");
        }

        logger.info("Fetching bookings for event: {} by organizer: {}",
                eventId, userEmail);

        List<BookingResponse> bookings =
                bookingService.getBookingsByEvent(eventId, userEmail);

        return ResponseEntity.ok(bookings);
    }

    // PATCH /api/bookings/{bookingId}/cancel
    @PatchMapping("/{bookingId}/cancel")
    public ResponseEntity<?> cancelBooking(
            @PathVariable Long bookingId,
            HttpServletRequest httpRequest) {

        String userEmail = (String) httpRequest.getAttribute("userEmail");
        String userRole  = (String) httpRequest.getAttribute("userRole");

        if (userEmail == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication required.");
        }

        if (!"CUSTOMER".equals(userRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Only customers can cancel their bookings.");
        }

        logger.info("Cancel booking: {} by customer: {}", bookingId, userEmail);

        BookingResponse response =
                bookingService.cancelBooking(bookingId, userEmail);

        return ResponseEntity.ok(response);
    }
}