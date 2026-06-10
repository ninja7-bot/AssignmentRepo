package com.event.organizers.service;

import com.event.organizers.dto.BookingRequest;
import com.event.organizers.dto.BookingResponse;
import com.event.organizers.entity.Booking;
import com.event.organizers.entity.Event;
import com.event.organizers.enums.BookingStatus;
import com.event.organizers.enums.EventStatus;
import com.event.organizers.exception.BookingNotFoundException;
import com.event.organizers.exception.InsufficientSeatsException;
import com.event.organizers.exception.InvalidEventDataException;
import com.event.organizers.exception.PastEventException;
import com.event.organizers.exception.UnauthorizedAccessException;
import com.event.organizers.repository.BookingRepository;
import com.event.organizers.repository.EventRepository;
import com.event.organizers.service.BookingServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private EventRepository eventRepository;

    @InjectMocks
    private BookingServiceImpl bookingService;

    private static final String CUSTOMER  = "customer@gmail.com";
    private static final String ORGANIZER = "organizer@gmail.com";

    private Event testEvent;
    private Booking testBooking;
    private BookingRequest validRequest;

    @BeforeEach
    void setUp() {
        testEvent = new Event();
        testEvent.setId(1L);
        testEvent.setName("Aagman");
        testEvent.setDescription("Aagman Litfest");
        testEvent.setEventDate(LocalDate.now().plusDays(10));
        testEvent.setEventTime(LocalTime.of(20, 0));
        testEvent.setVenue("Indore");
        testEvent.setTotalSeats(100);
        testEvent.setBookedSeats(0);
        testEvent.setTicketPrice(new BigDecimal("300.00"));
        testEvent.setOrganizerEmail(ORGANIZER);
        testEvent.setStatus(EventStatus.ACTIVE);
        
        testBooking = new Booking();
        testBooking.setId(1L);
        testBooking.setEvent(testEvent);
        testBooking.setCustomerEmail(CUSTOMER);
        testBooking.setCustomerName("Customer Name");
        testBooking.setNumberOfTickets(2);
        testBooking.setTotalAmount(new BigDecimal("600.00"));
        testBooking.setBookingStatus(BookingStatus.CONFIRMED);
        testBooking.setBookingDate(LocalDateTime.now());
        
        validRequest = new BookingRequest(1L, 2);
    }

    @Test
    void testCreateBooking() {
        when(eventRepository.findById(1L))
                .thenReturn(Optional.of(testEvent));
        when(eventRepository.save(any(Event.class)))
                .thenReturn(testEvent);
        when(bookingRepository.save(any(Booking.class)))
                .thenReturn(testBooking);

        BookingResponse response = bookingService.createBooking(
                validRequest, CUSTOMER, "Customer Name");

        assertNotNull(response);
        assertEquals(BookingStatus.CONFIRMED, response.getBookingStatus());
        assertEquals(2, response.getNumberOfTickets());
    }

    @Test
    void testCreateBookingNotEnoughSeats() {
        testEvent.setTotalSeats(1);
        testEvent.setBookedSeats(0);

        when(eventRepository.findById(1L))
                .thenReturn(Optional.of(testEvent));

        assertThrows(InsufficientSeatsException.class,
                () -> bookingService.createBooking(
                        validRequest, CUSTOMER, "Customer Name"));
        
        verify(bookingRepository, never()).save(any(Booking.class));
    }

    @Test
    void testCreateBookingEventAlreadyPast() {
        testEvent.setEventDate(LocalDate.now().minusDays(1));

        when(eventRepository.findById(1L))
                .thenReturn(Optional.of(testEvent));

        assertThrows(PastEventException.class,
                () -> bookingService.createBooking(
                        validRequest, CUSTOMER, "Customer Name"));
    }

    @Test
    void testCreateBookingEventCancelled() {
        testEvent.setStatus(EventStatus.CANCELLED);

        when(eventRepository.findById(1L))
                .thenReturn(Optional.of(testEvent));

        assertThrows(InvalidEventDataException.class,
                () -> bookingService.createBooking(
                        validRequest, CUSTOMER, "Customer Name"));
    }

    @Test
    void testCreateBookingMoreThan10Tickets() {
        BookingRequest bigRequest = new BookingRequest(1L, 11);

        when(eventRepository.findById(1L))
                .thenReturn(Optional.of(testEvent));

        assertThrows(InvalidEventDataException.class,
                () -> bookingService.createBooking(
                        bigRequest, CUSTOMER, "Customer Name"));
    }

    @Test
    void testGetMyBookings() {
        when(bookingRepository.findByCustomerEmail(CUSTOMER))
                .thenReturn(List.of(testBooking));

        List<BookingResponse> result =
                bookingService.getMyBookings(CUSTOMER);

        assertEquals(1, result.size());
        assertEquals(CUSTOMER, result.get(0).getCustomerEmail());
    }

    @Test
    void testGetMyBookingsNoBookings() {
        when(bookingRepository.findByCustomerEmail(CUSTOMER))
                .thenReturn(List.of());

        List<BookingResponse> result =
                bookingService.getMyBookings(CUSTOMER);

        assertTrue(result.isEmpty());
    }

    @Test
    void testCancelBooking() {
        when(bookingRepository.findById(1L))
                .thenReturn(Optional.of(testBooking));
        when(bookingRepository.save(any(Booking.class)))
                .thenReturn(testBooking);
        when(eventRepository.save(any(Event.class)))
                .thenReturn(testEvent);

        BookingResponse response =
                bookingService.cancelBooking(1L, CUSTOMER);
        
        assertEquals(BookingStatus.CANCELLED, response.getBookingStatus());
    }

    @Test
    void testCancelBookingWrongCustomer() {
        when(bookingRepository.findById(1L))
                .thenReturn(Optional.of(testBooking));

        assertThrows(UnauthorizedAccessException.class,
                () -> bookingService.cancelBooking(1L, "hacker@gmail.com"));
    }

    @Test
    void testCancelBookingAlreadyCancelled() {
        testBooking.setBookingStatus(BookingStatus.CANCELLED);

        when(bookingRepository.findById(1L))
                .thenReturn(Optional.of(testBooking));

        assertThrows(InvalidEventDataException.class,
                () -> bookingService.cancelBooking(1L, CUSTOMER));
    }

    @Test
    void testCancelBookingBookingNotFound() {
        when(bookingRepository.findById(99L))
                .thenReturn(Optional.empty());

        assertThrows(BookingNotFoundException.class,
                () -> bookingService.cancelBooking(99L, CUSTOMER));
    }

    @Test
    void testCancelBookingCloseToEvent() {
        testEvent.setEventDate(LocalDate.now());
        testEvent.setEventTime(LocalTime.now().plusHours(2));

        when(bookingRepository.findById(1L))
                .thenReturn(Optional.of(testBooking));

        assertThrows(InvalidEventDataException.class,
                () -> bookingService.cancelBooking(1L, CUSTOMER));
    }
}