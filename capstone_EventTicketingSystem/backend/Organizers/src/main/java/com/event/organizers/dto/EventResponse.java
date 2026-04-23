package com.event.organizers.dto;

import com.event.organizers.enums.EventStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO for event response
 */
public class EventResponse {

    private Long id;
    private String name;
    private String description;
    private String eventDate;
    private String eventTime;
    private String venue;
    private Integer totalSeats;
    private Integer bookedSeats;
    private Integer availableSeats;
    private BigDecimal ticketPrice;
    private String category;
    private String organizerEmail;
    private EventStatus status;
    private LocalDateTime createdAt;

    // Constructors
    public EventResponse() {
    }

    public EventResponse(Long id, String name, String description, String eventDate,
                         String eventTime, String venue, Integer totalSeats,
                         Integer bookedSeats, Integer availableSeats, BigDecimal ticketPrice,
                         String category, String organizerEmail, EventStatus status,
                         LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.eventDate = eventDate;
        this.eventTime = eventTime;
        this.venue = venue;
        this.totalSeats = totalSeats;
        this.bookedSeats = bookedSeats;
        this.availableSeats = availableSeats;
        this.ticketPrice = ticketPrice;
        this.category = category;
        this.organizerEmail = organizerEmail;
        this.status = status;
        this.createdAt = createdAt;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public Integer getBookedSeats() {
        return bookedSeats;
    }

    public void setBookedSeats(Integer bookedSeats) {
        this.bookedSeats = bookedSeats;
    }

    public Integer getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(Integer availableSeats) {
        this.availableSeats = availableSeats;
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

    public String getOrganizerEmail() {
        return organizerEmail;
    }

    public void setOrganizerEmail(String organizerEmail) {
        this.organizerEmail = organizerEmail;
    }

    public EventStatus getStatus() {
        return status;
    }

    public void setStatus(EventStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}