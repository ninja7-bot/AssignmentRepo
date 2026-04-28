package com.event.organizers.service;

import com.event.organizers.dto.BookingRequest;
import com.event.organizers.dto.BookingResponse;

import java.util.List;

/**
 * Service interface for Booking operations
 */
public interface BookingService {

    /**
     * Create a new booking
     * Validates seat availability atomically
     */
    BookingResponse createBooking(BookingRequest request,
                                  String customerEmail,
                                  String customerName);

    /**
     * Get all bookings for the logged in customer
     */
    List<BookingResponse> getMyBookings(String customerEmail);

    /**
     * Get all bookings for a specific event
     * Only the organizer of that event can call this
     */
    List<BookingResponse> getBookingsByEvent(Long eventId, String organizerEmail);

    /**
     * Cancel a booking
     * Customer can cancel up to 3 hours before event starts
     */
    BookingResponse cancelBooking(Long bookingId, String customerEmail);
}