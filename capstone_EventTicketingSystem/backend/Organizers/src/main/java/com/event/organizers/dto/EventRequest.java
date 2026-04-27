package com.event.organizers.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

/**
 * DTO for creating/updating event
 */
public class EventRequest {

    @NotBlank(message = "Event name is required")
    @Size(min = 2, max = 200, message = "Event name must be between 2 and 200 characters")
    @Pattern(regexp = "^[a-zA-Z0-9\\s,.-]+$", message = "Event name must be alphanumeric")
    private String name;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Event date is required")
    private String eventDate; // Format: yyyy-MM-dd

    @NotBlank(message = "Event time is required")
    private String eventTime; // Format: HH:mm

    @NotBlank(message = "Venue is required")
    @Pattern(regexp = "^[a-zA-Z0-9\\s,.-]+$", message = "Venue must be alphanumeric")
    private String venue;

    @NotNull(message = "Total seats is required")
    @Min(value = 1, message = "Total seats must be at least 1")
    private Integer totalSeats;

    @NotNull(message = "Ticket price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Ticket price must be greater than 0")
    private BigDecimal ticketPrice;

    private String category;

    // Constructors
    public EventRequest() {
    }

    public EventRequest(String name, String description, String eventDate,
                        String eventTime, String venue, Integer totalSeats,
                        BigDecimal ticketPrice, String category) {
        this.name = name;
        this.description = description;
        this.eventDate = eventDate;
        this.eventTime = eventTime;
        this.venue = venue;
        this.totalSeats = totalSeats;
        this.ticketPrice = ticketPrice;
        this.category = category;
    }

    // Getters and Setters

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEventDate() {
        return eventDate;
    }

    public void setEventDate(String eventDate) {
        this.eventDate = eventDate;
    }

    public String getEventTime() {
        return eventTime;
    }

    public void setEventTime(String eventTime) {
        this.eventTime = eventTime;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public Integer getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(Integer totalSeats) {
        this.totalSeats = totalSeats;
    }

    public BigDecimal getTicketPrice() {
        return ticketPrice;
    }

    public void setTicketPrice(BigDecimal ticketPrice) {
        this.ticketPrice = ticketPrice;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}