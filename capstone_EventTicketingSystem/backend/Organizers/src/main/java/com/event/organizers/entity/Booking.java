package com.event.organizers.entity;

import com.event.organizers.enums.BookingStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Booking Entity
 * Represents a ticket booking made by a customer for an event
 */
@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link to the event
    @NotNull(message = "Event is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    // Customer info stored directly
    @NotBlank(message = "Customer email is required")
    @Column(nullable = false, length = 150)
    private String customerEmail;

    @NotBlank(message = "Customer name is required")
    @Column(nullable = false, length = 100)
    private String customerName;

    @NotNull(message = "Number of tickets is required")
    @Min(value = 1, message = "Must book at least 1 ticket")
    @Column(nullable = false)
    private Integer numberOfTickets;

    // Total amount at time of booking
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private BookingStatus bookingStatus = BookingStatus.CONFIRMED;

    @Column(nullable = false, updatable = false)
    private LocalDateTime bookingDate;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // Default constructor
    public Booking() {
    }

    @PrePersist
    protected void onCreate() {
        bookingDate = LocalDateTime.now();
        updatedAt   = LocalDateTime.now();
        if (bookingStatus == null) {
            bookingStatus = BookingStatus.CONFIRMED;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public Integer getNumberOfTickets() {
        return numberOfTickets;
    }

    public void setNumberOfTickets(Integer numberOfTickets) {
        this.numberOfTickets = numberOfTickets;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BookingStatus getBookingStatus() {
        return bookingStatus;
    }

    public void setBookingStatus(BookingStatus bookingStatus) {
        this.bookingStatus = bookingStatus;
    }

    public LocalDateTime getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDateTime bookingDate) {
        this.bookingDate = bookingDate;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "Booking{" +
                "id=" + id +
                ", customerEmail='" + customerEmail + '\'' +
                ", numberOfTickets=" + numberOfTickets +
                ", bookingStatus=" + bookingStatus +
                ", bookingDate=" + bookingDate +
                '}';
    }
}