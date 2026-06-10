package com.event.organizers.controller;

import com.event.organizers.dto.EventRequest;
import com.event.organizers.dto.EventResponse;
import com.event.organizers.service.EventService;
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
 * Controller for Event operations
 */
@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {

    private static final Logger logger =
            LoggerFactory.getLogger(EventController.class);

    @Autowired
    private EventService eventService;

    /**
     * Create a new event (Organizer only)
     * POST /api/events
     */
    @PostMapping
    public ResponseEntity<?> createEvent(
            @Valid @RequestBody EventRequest request,
            HttpServletRequest httpRequest) {

        // Get user info from request attributes (set by JWT filter)
        String userEmail = (String) httpRequest.getAttribute("userEmail");
        String userRole = (String) httpRequest.getAttribute("userRole");

        // Check authentication
        if (userEmail == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication required");
        }

        // Check if user is an organizer
        if (!"ORGANIZER".equals(userRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Only organizers can create events");
        }

        logger.info("Creating event by organizer: {}", userEmail);

        EventResponse response = eventService.createEvent(request, userEmail);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Update an event (Organizer only, own events)
     * PUT /api/events/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody EventRequest request,
            HttpServletRequest httpRequest) {

        String userEmail = (String) httpRequest.getAttribute("userEmail");
        String userRole = (String) httpRequest.getAttribute("userRole");

        if (userEmail == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication required");
        }

        if (!"ORGANIZER".equals(userRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Only organizers can update events");
        }

        logger.info("Updating event ID: {} by organizer: {}", id, userEmail);

        EventResponse response = eventService.updateEvent(id, request, userEmail);

        return ResponseEntity.ok(response);
    }

    /**
     * Get event by ID
     * GET /api/events/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> getEventById(@PathVariable Long id) {
        logger.info("Fetching event ID: {}", id);

        EventResponse response = eventService.getEventById(id);

        return ResponseEntity.ok(response);
    }

    /**
     * Get all events created by current organizer
     * GET /api/events/my-events
     */
    @GetMapping("/my-events")
    public ResponseEntity<?> getMyEvents(HttpServletRequest httpRequest) {

        String userEmail = (String) httpRequest.getAttribute("userEmail");
        String userRole = (String) httpRequest.getAttribute("userRole");

        if (userEmail == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication required");
        }

        if (!"ORGANIZER".equals(userRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Only organizers can view their events");
        }

        logger.info("Fetching events for organizer: {}", userEmail);

        List<EventResponse> events = eventService.getEventsByOrganizer(userEmail);

        return ResponseEntity.ok(events);
    }

    /**
     * Get all active events (for customers)
     * GET /api/events
     */
    @GetMapping
    public ResponseEntity<List<EventResponse>> getAllEvents() {
        logger.info("Fetching all active events");

        List<EventResponse> events = eventService.getAllActiveEvents();

        return ResponseEntity.ok(events);
    }

    /**
     * Cancel an event (Organizer only)
     * DELETE /api/events/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelEvent(
            @PathVariable Long id,
            HttpServletRequest httpRequest) {

        String userEmail = (String) httpRequest.getAttribute("userEmail");
        String userRole = (String) httpRequest.getAttribute("userRole");

        if (userEmail == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication required");
        }

        if (!"ORGANIZER".equals(userRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Only organizers can cancel events");
        }

        logger.info("Cancelling event ID: {} by organizer: {}", id, userEmail);

        eventService.cancelEvent(id, userEmail);

        return ResponseEntity.ok("Event cancelled successfully");
    }

    /**
     * Health check
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Event Service is running!");
    }
}