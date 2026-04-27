package com.event.organizers.repository;

import com.event.organizers.entity.Booking;
import com.event.organizers.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Booking entity
 */
@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    /**
     * Find all bookings by customer email
     */
    List<Booking> findByCustomerEmail(String customerEmail);

    /**
     * Find all bookings for a specific event
     */
    List<Booking> findByEventId(Long eventId);

    /**
     * Find all bookings for a specific event by status
     */
    List<Booking> findByEventIdAndBookingStatus(Long eventId, BookingStatus status);

    /**
     * Find bookings by customer email and status
     */
    List<Booking> findByCustomerEmailAndBookingStatus(String customerEmail, BookingStatus status);

    /**
     * Check if customer already has a confirmed booking for an event
     */
    boolean existsByCustomerEmailAndEventIdAndBookingStatus(
            String customerEmail, Long eventId, BookingStatus status);
}