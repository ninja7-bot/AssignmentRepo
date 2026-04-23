package com.event.organizers.service;

import com.event.organizers.dto.EventRequest;
import com.event.organizers.dto.EventResponse;

import java.util.List;

/**
 * Service interface for Event operations
 */
public interface EventService {

    /**
     * Create a new event
     */
    EventResponse createEvent(EventRequest request, String organizerEmail);

    /**
     * Update an existing event
     */
    EventResponse updateEvent(Long eventId, EventRequest request, String organizerEmail);

    /**
     * Get event by ID
     */
    EventResponse getEventById(Long eventId);

    /**
     * Get all events by organizer
     */
    List<EventResponse> getEventsByOrganizer(String organizerEmail);

    /**
     * Get all active events (for customers)
     */
    List<EventResponse> getAllActiveEvents();

    /**
     * Cancel an event
     */
    void cancelEvent(Long eventId, String organizerEmail);
}