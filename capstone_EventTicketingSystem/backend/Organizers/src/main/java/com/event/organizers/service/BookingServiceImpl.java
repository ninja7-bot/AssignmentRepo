package com.event.organizers.service;

import com.event.organizers.dto.BookingRequest;
import com.event.organizers.dto.BookingResponse;
import com.event.organizers.entity.Booking;
import com.event.organizers.entity.Event;
import com.event.organizers.enums.BookingStatus;
import com.event.organizers.enums.EventStatus;
import com.event.organizers.exception.BookingNotFoundException;
import com.event.organizers.exception.EventNotFoundException;
import com.event.organizers.exception.InsufficientSeatsException;
import com.event.organizers.exception.InvalidEventDataException;
import com.event.organizers.exception.PastEventException;
import com.event.organizers.exception.UnauthorizedAccessException;
import com.event.organizers.repository.BookingRepository;
import com.event.organizers.repository.EventRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of BookingService
 * All booking operations use @Transactional to prevent overbooking
 */
@Service
public class BookingServiceImpl implements BookingService {

    private static final Logger logger = LoggerFactory.getLogger(BookingServiceImpl.class);

    // Cancellation window: 3 hours before event
    private static final int CANCELLATION_HOURS = 3;

    // Max tickets per booking
    private static final int MAX_TICKETS_PER_BOOKING = 10;

    private final BookingRepository bookingRepository;
    private final EventRepository   eventRepository;

    @Autowired
    public BookingServiceImpl(BookingRepository bookingRepository,
                              EventRepository eventRepository) {
        this.bookingRepository = bookingRepository;
        this.eventRepository   = eventRepository;
    }

    
    //  Create Booking
    @Override
    @Transactional
    public BookingResponse createBooking(BookingRequest request,
                                         String customerEmail,
                                         String customerName) {

        logger.info("Creating booking for customer: {} | {} | event: {} | tickets: {}",
                customerName, customerEmail, request.getEventId(), request.getNumberOfTickets());

        // 1. Find event
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new EventNotFoundException(
                        "Event not found with ID: " + request.getEventId()));

        // 2. Event must be ACTIVE
        if (event.getStatus() != EventStatus.ACTIVE) {
            throw new InvalidEventDataException(
                    "Event is not active. Booking not allowed.");
        }

        // 3. Event must be in the future
        LocalDateTime eventDateTime =
                LocalDateTime.of(event.getEventDate(), event.getEventTime());

        if (eventDateTime.isBefore(LocalDateTime.now())) {
            throw new PastEventException(
                    "Cannot book tickets for a past event.");
        }

        // 4. Validate ticket count
        if (request.getNumberOfTickets() > MAX_TICKETS_PER_BOOKING) {
            throw new InvalidEventDataException(
                    "Maximum " + MAX_TICKETS_PER_BOOKING + " tickets allowed per booking.");
        }

        // 5. Check seat availability (ATOMIC)
        // @Transactional ensures no other thread can change bookedSeats
        // between this check and the save below
        int available = event.getTotalSeats() - event.getBookedSeats();
        if (request.getNumberOfTickets() > available) {
            throw new InsufficientSeatsException(
                    "Only " + available + " seats available. "
                            + "You requested " + request.getNumberOfTickets() + ".");
        }

        // 6. Calculate total amount
        BigDecimal ticketPrice = event.getTicketPrice() != null
                ? event.getTicketPrice()
                : BigDecimal.ZERO;

        BigDecimal totalAmount = ticketPrice.multiply(
                BigDecimal.valueOf(request.getNumberOfTickets()));

        // 7. Update booked seats on event
        event.setBookedSeats(event.getBookedSeats() + request.getNumberOfTickets());
        eventRepository.save(event);

        // 8. Create booking record
        Booking booking = new Booking();
        booking.setEvent(event);
        booking.setCustomerEmail(customerEmail);
        booking.setCustomerName(customerName);
        booking.setNumberOfTickets(request.getNumberOfTickets());
        booking.setTotalAmount(totalAmount);
        booking.setBookingStatus(BookingStatus.CONFIRMED);

        Booking savedBooking = bookingRepository.save(booking);

        logger.info("Booking created successfully. ID: {} | Customer: {} | {} | Event: {}",
                savedBooking.getId(), customerName, customerEmail, event.getName());

        return convertToResponse(savedBooking);
    }

    
    //  Get My Bookings (Customer)
    @Override
    public List<BookingResponse> getMyBookings(String customerEmail) {

        logger.info("Fetching bookings for customer: {}", customerEmail);

        List<Booking> bookings = bookingRepository.findByCustomerEmail(customerEmail);

        return bookings.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    
    // Get Bookings by Event (Organizer)
    @Override
    public List<BookingResponse> getBookingsByEvent(Long eventId, String organizerEmail) {

        logger.info("Fetching bookings for event: {} by organizer: {}",
                eventId, organizerEmail);

        // Verify event exists and belongs to this organizer
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException(
                        "Event not found with ID: " + eventId));

        if (!event.getOrganizerEmail().equals(organizerEmail)) {
            throw new UnauthorizedAccessException(
                    "You are not authorized to view bookings for this event.");
        }

        List<Booking> bookings = bookingRepository.findByEventId(eventId);

        return bookings.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    
    //  Canel Booking
    @Override
    @Transactional
    public BookingResponse cancelBooking(Long bookingId, String customerEmail) {

        logger.info("Cancelling booking ID: {} by customer: {}", bookingId, customerEmail);

        // 1. Find booking
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException(
                        "Booking not found with ID: " + bookingId));

        // 2. Verify ownership
        if (!booking.getCustomerEmail().equals(customerEmail)) {
            throw new UnauthorizedAccessException(
                    "You are not authorized to cancel this booking.");
        }

        // 3. Already cancelled?
        if (booking.getBookingStatus() != BookingStatus.CONFIRMED) {
            throw new InvalidEventDataException(
                    "Booking is already cancelled.");
        }

        // 4. Check cancellation window
        Event event = booking.getEvent();
        LocalDateTime eventDateTime =
                LocalDateTime.of(event.getEventDate(), event.getEventTime());
        LocalDateTime cancellationDeadline =
                eventDateTime.minusHours(CANCELLATION_HOURS);

        if (LocalDateTime.now().isAfter(cancellationDeadline)) {
            throw new InvalidEventDataException(
                    "Cancellation is not allowed within "
                            + CANCELLATION_HOURS + " hours of the event.");
        }

        // 5. Cannot cancel past events
        if (eventDateTime.isBefore(LocalDateTime.now())) {
            throw new PastEventException(
                    "Cannot cancel a booking for a past event.");
        }

        // 6. Update booking status
        booking.setBookingStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);

        // 7. Restore seats on event
        event.setBookedSeats(
                Math.max(0, event.getBookedSeats() - booking.getNumberOfTickets()));
        eventRepository.save(event);

        logger.info("Booking cancelled. ID: {} | Seats restored: {} | Event: {}",
                bookingId, booking.getNumberOfTickets(), event.getName());

        return convertToResponse(booking);
    }


    /**
     * Convert Booking entity to BookingResponse DTO
     */
    private BookingResponse convertToResponse(Booking booking) {
        BookingResponse response = new BookingResponse();
        response.setId(booking.getId());
        response.setCustomerEmail(booking.getCustomerEmail());
        response.setCustomerName(booking.getCustomerName());
        response.setNumberOfTickets(booking.getNumberOfTickets());
        response.setTotalAmount(booking.getTotalAmount());
        response.setBookingStatus(booking.getBookingStatus());
        response.setBookingDate(booking.getBookingDate());

        // Snapshot event details into response
        Event event = booking.getEvent();
        if (event != null) {
            response.setEventId(event.getId());
            response.setEventName(event.getName());
            response.setEventDate(event.getEventDate().toString());
            response.setEventTime(event.getEventTime().toString());
            response.setVenue(event.getVenue());
        }

        return response;
    }
}