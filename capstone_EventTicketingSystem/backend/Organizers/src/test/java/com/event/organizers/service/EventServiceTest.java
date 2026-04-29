package com.event.organizers.service;

import com.event.organizers.dto.EventRequest;
import com.event.organizers.dto.EventResponse;
import com.event.organizers.entity.Event;
import com.event.organizers.enums.EventStatus;
import com.event.organizers.exception.EventNotFoundException;
import com.event.organizers.exception.InvalidEventDataException;
import com.event.organizers.exception.PastEventException;
import com.event.organizers.exception.UnauthorizedAccessException;
import com.event.organizers.repository.BookingRepository;
import com.event.organizers.repository.EventRepository;
import com.event.organizers.service.EventServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private BookingRepository bookingRepository;

    @InjectMocks
    private EventServiceImpl eventService;
    
    private static final String ORGANIZER = "organizer@gmail.com";
    
    private Event testEvent;
    
    private EventRequest validRequest;

    @BeforeEach
    void setUp() {
        testEvent = new Event();
        testEvent.setId(1L);
        testEvent.setName("Aagman");
        testEvent.setDescription("Aagman Litfest");
        testEvent.setEventDate(LocalDate.now().plusDays(10));
        testEvent.setEventTime(LocalTime.of(19, 0));
        testEvent.setVenue("Indore");
        testEvent.setTotalSeats(200);
        testEvent.setBookedSeats(0);
        testEvent.setTicketPrice(new BigDecimal("500.00"));
        testEvent.setOrganizerEmail(ORGANIZER);
        testEvent.setStatus(EventStatus.ACTIVE);
        
        validRequest = new EventRequest();
        validRequest.setName("Aagman");
        validRequest.setDescription("Aagman Litfest");
        validRequest.setEventDate(LocalDate.now().plusDays(10).toString());
        validRequest.setEventTime("19:00");
        validRequest.setVenue("Indore");
        validRequest.setTotalSeats(200);
        validRequest.setTicketPrice(new BigDecimal("500.00"));
        validRequest.setCategory("CULTURE");
    }

    @Test
    void testCreateEventValidData() {
        when(eventRepository.save(any(Event.class)))
                .thenReturn(testEvent);

        EventResponse response = eventService.createEvent(validRequest, ORGANIZER);

        assertNotNull(response);
        assertEquals("Aagman", response.getName());
        assertEquals(ORGANIZER, response.getOrganizerEmail());
    }

    @Test
    void testCreateEventPastDate() {
        validRequest.setEventDate(LocalDate.now().minusDays(1).toString());

        assertThrows(PastEventException.class,
                () -> eventService.createEvent(validRequest, ORGANIZER));
        
        verify(eventRepository, never()).save(any(Event.class));
    }

    @Test
    void testCreateEventBadDateFormat() {
        validRequest.setEventDate("nakli-date");

        assertThrows(InvalidEventDataException.class,
                () -> eventService.createEvent(validRequest, ORGANIZER));
    }

    @Test
    void testGetEventByIdEventExists() {
        when(eventRepository.findById(1L))
                .thenReturn(Optional.of(testEvent));

        EventResponse response = eventService.getEventById(1L);

        assertNotNull(response);
        assertEquals("Aagman", response.getName());
        assertEquals(1L, response.getId());
    }

    @Test
    void testGetEventByIdEventDoesNotExist() {
        when(eventRepository.findById(99L))
                .thenReturn(Optional.empty());

        assertThrows(EventNotFoundException.class,
                () -> eventService.getEventById(99L));
    }

    @Test
    void testGetEventsByOrganizer() {
        when(eventRepository.findByOrganizerEmail(ORGANIZER))
                .thenReturn(List.of(testEvent));

        List<EventResponse> result = eventService.getEventsByOrganizer(ORGANIZER);
        
        assertEquals(1, result.size());
        assertEquals("Aagman", result.get(0).getName());
    }

    @Test
    void testGetEventsByOrganizerNoEvents() {
        when(eventRepository.findByOrganizerEmail(ORGANIZER))
                .thenReturn(List.of());

        List<EventResponse> result = eventService.getEventsByOrganizer(ORGANIZER);

        assertTrue(result.isEmpty());
    }

    @Test
    void testUpdateEventOwnerCanUpdate() {
        when(eventRepository.findById(1L))
                .thenReturn(Optional.of(testEvent));
        when(eventRepository.save(any(Event.class)))
                .thenReturn(testEvent);

        EventResponse response = eventService.updateEvent(1L, validRequest, ORGANIZER);

        assertNotNull(response);
        verify(eventRepository).save(any(Event.class));
    }

    @Test
    void testUpdateEventNotOwner() {
        when(eventRepository.findById(1L))
                .thenReturn(Optional.of(testEvent));
        
        assertThrows(UnauthorizedAccessException.class,
                () -> eventService.updateEvent(1L, validRequest, "other@gmail.com"));
    }

    @Test
    void testUpdateEventSeatsReducedBelowBooked() {
        testEvent.setBookedSeats(50);
        when(eventRepository.findById(1L))
                .thenReturn(Optional.of(testEvent));

        validRequest.setTotalSeats(30);

        assertThrows(InvalidEventDataException.class,
                () -> eventService.updateEvent(1L, validRequest, ORGANIZER));
    }

    @Test
    void testCancelEventOwnerCancels() {
        when(eventRepository.findById(1L))
                .thenReturn(Optional.of(testEvent));
        when(eventRepository.save(any(Event.class)))
                .thenReturn(testEvent);
        when(bookingRepository.findByEventIdAndBookingStatus(any(), any()))
                .thenReturn(List.of());
        
        assertDoesNotThrow(() -> eventService.cancelEvent(1L, ORGANIZER));
        
        verify(eventRepository).save(any(Event.class));
    }

    @Test
    void testCancelEventNotOwner() {
        when(eventRepository.findById(1L))
                .thenReturn(Optional.of(testEvent));

        assertThrows(UnauthorizedAccessException.class,
                () -> eventService.cancelEvent(1L, "hacker@gmail.com"));
    }
}