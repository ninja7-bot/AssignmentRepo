package com.event.organizers.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/**
 * DTO for creating a booking
 */
public class BookingRequest {

    @NotNull(message = "Event ID is required")
    private Long eventId;

    @NotNull(message = "Number of tickets is required")
    @Min(value = 1, message = "Must book at least 1 ticket")
    private Integer numberOfTickets;

    // Default constructor
    public BookingRequest() {
    }

    public BookingRequest(Long eventId, Integer numberOfTickets) {
        this.eventId         = eventId;
        this.numberOfTickets = numberOfTickets;
    }

    // Getters and Setters

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public Integer getNumberOfTickets() {
        return numberOfTickets;
    }

    public void setNumberOfTickets(Integer numberOfTickets) {
        this.numberOfTickets = numberOfTickets;
    }

    @Override
    public String toString() {
        return "BookingRequest{" +
                "eventId=" + eventId +
                ", numberOfTickets=" + numberOfTickets +
                '}';
    }
}