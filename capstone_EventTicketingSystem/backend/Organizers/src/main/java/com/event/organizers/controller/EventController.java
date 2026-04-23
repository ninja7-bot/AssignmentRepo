package com.event.organizers.controller;

import com.event.organizers.dto.EventRequest;
import com.event.organizers.dto.EventResponse;
import com.event.organizers.service.EventService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
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

        System.out.println("Creating event by organizer: " + userEmail);

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

        System.out.println("Updating event ID: " + id + " by organizer: " + userEmail);

        EventResponse response = eventService.updateEvent(id, request, userEmail);

        return ResponseEntity.ok(response);
    }

    /**
     * Get event by ID
     * GET /api/events/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> getEventById(@PathVariable Long id) {
        System.out.println("Fetching event ID: " + id);

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

        System.out.println("Fetching events for organizer: " + userEmail);

        List<EventResponse> events = eventService.getEventsByOrganizer(userEmail);

        return ResponseEntity.ok(events);
    }

    /**
     * Get all active events (for customers)
     * GET /api/events
     */
    @GetMapping
    public ResponseEntity<List<EventResponse>> getAllEvents() {
        System.out.println("Fetching all active events");

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

        System.out.println("Cancelling event ID: " + id + " by organizer: " + userEmail);

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