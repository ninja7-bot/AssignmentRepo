package com.event.organizers.service;

import com.event.organizers.dto.EventRequest;
import com.event.organizers.dto.EventResponse;
import com.event.organizers.entity.Booking;
import com.event.organizers.entity.Event;
import com.event.organizers.enums.BookingStatus;
import com.event.organizers.enums.EventStatus;
import com.event.organizers.exception.EventNotFoundException;
import com.event.organizers.exception.InvalidEventDataException;
import com.event.organizers.exception.PastEventException;
import com.event.organizers.exception.UnauthorizedAccessException;
import com.event.organizers.repository.BookingRepository;
import com.event.organizers.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of EventService
 */
@Service
public class EventServiceImpl implements EventService {

    private final EventRepository   eventRepository;
    private final BookingRepository bookingRepository;

    @Autowired
    public EventServiceImpl(EventRepository eventRepository,
                            BookingRepository bookingRepository) {
        this.eventRepository   = eventRepository;
        this.bookingRepository = bookingRepository;
    }
    @Override
    @Transactional
    public EventResponse createEvent(EventRequest request, String organizerEmail) {
        System.out.println("Creating event: " + request.getName() + " by organizer: " + organizerEmail);

        // Parse and validate date
        LocalDate eventDate;
        try {
            eventDate = LocalDate.parse(request.getEventDate());
        } catch (DateTimeParseException e) {
            throw new InvalidEventDataException("Invalid date format. Use yyyy-MM-dd");
        }

        // Parse and validate time
        LocalTime eventTime;
        try {
            eventTime = LocalTime.parse(request.getEventTime());
        } catch (DateTimeParseException e) {
            throw new InvalidEventDataException("Invalid time format. Use HH:mm");
        }

        // Check if event date is in the future
        LocalDateTime eventDateTime = LocalDateTime.of(eventDate, eventTime);
        if (eventDateTime.isBefore(LocalDateTime.now())) {
            throw new PastEventException("Event date and time must be in the future");
        }

        // Create event entity
        Event event = new Event();
        event.setName(request.getName());
        event.setDescription(request.getDescription());
        event.setEventDate(eventDate);
        event.setEventTime(eventTime);
        event.setVenue(request.getVenue());
        event.setTotalSeats(request.getTotalSeats());
        event.setBookedSeats(0);
        event.setTicketPrice(request.getTicketPrice());
        event.setCategory(request.getCategory());
        event.setOrganizerEmail(organizerEmail);
        event.setStatus(EventStatus.ACTIVE);

        // Save event
        Event savedEvent = eventRepository.save(event);
        System.out.println("Event created successfully with ID: " + savedEvent.getId());

        return convertToResponse(savedEvent);
    }

    @Override
    @Transactional
    public EventResponse updateEvent(Long eventId, EventRequest request, String organizerEmail) {
        System.out.println("Updating event ID: " + eventId + " by organizer: " + organizerEmail);

        // Find event
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException("Event not found with ID: " + eventId));

        // Check if organizer is the owner
        if (!event.getOrganizerEmail().equals(organizerEmail)) {
            throw new UnauthorizedAccessException("You are not authorized to update this event");
        }

        // Check if event has already started (can't update if event started)
        LocalDateTime eventDateTime = LocalDateTime.of(event.getEventDate(), event.getEventTime());
        if (eventDateTime.isBefore(LocalDateTime.now())) {
            throw new PastEventException("Cannot update an event that has already started");
        }

        // Update fields
        event.setName(request.getName());
        event.setDescription(request.getDescription());

        // Update date if provided and valid
        if (request.getEventDate() != null) {
            LocalDate newDate;
            try {
                newDate = LocalDate.parse(request.getEventDate());
            } catch (DateTimeParseException e) {
                throw new InvalidEventDataException("Invalid date format. Use yyyy-MM-dd");
            }

            LocalTime newTime = event.getEventTime();
            if (request.getEventTime() != null) {
                try {
                    newTime = LocalTime.parse(request.getEventTime());
                } catch (DateTimeParseException e) {
                    throw new InvalidEventDataException("Invalid time format. Use HH:mm");
                }
            }

            LocalDateTime newDateTime = LocalDateTime.of(newDate, newTime);
            if (newDateTime.isBefore(LocalDateTime.now())) {
                throw new PastEventException("Event date and time must be in the future");
            }

            event.setEventDate(newDate);
            event.setEventTime(newTime);
        }

        // Update total seats (must be >= booked seats)
        if (request.getTotalSeats() != null) {
            if (request.getTotalSeats() < event.getBookedSeats()) {
                throw new InvalidEventDataException(
                        "Cannot reduce total seats below already booked seats (" + event.getBookedSeats() + ")"
                );
            }
            event.setTotalSeats(request.getTotalSeats());
        }

        if (request.getTicketPrice() != null) {
            event.setTicketPrice(request.getTicketPrice());
        }

        if (request.getCategory() != null) {
            event.setCategory(request.getCategory());
        }

        // Save updated event
        Event updatedEvent = eventRepository.save(event);
        System.out.println("Event updated successfully: " + updatedEvent.getId());

        return convertToResponse(updatedEvent);
    }

    @Override
    public EventResponse getEventById(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException("Event not found with ID: " + eventId));

        return convertToResponse(event);
    }

    @Override
    public List<EventResponse> getEventsByOrganizer(String organizerEmail) {
        System.out.println("Fetching events for organizer: " + organizerEmail);

        List<Event> events = eventRepository.findByOrganizerEmail(organizerEmail);

        return events.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<EventResponse> getAllActiveEvents() {
        List<Event> events = eventRepository.findByStatusAndEventDateGreaterThanEqual(
                EventStatus.ACTIVE,
                LocalDate.now()
        );

        return events.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void cancelEvent(Long eventId, String organizerEmail) {
        System.out.print("Cancelling event ID: "+ eventId + " by organizer: "+ organizerEmail);

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException(
                        "Event not found with ID: " + eventId));

        if (!event.getOrganizerEmail().equals(organizerEmail)) {
            throw new UnauthorizedAccessException(
                    "You are not authorized to cancel this event.");
        }

        // Cancel the event
        event.setStatus(EventStatus.CANCELLED);
        eventRepository.save(event);

        // Cancel all CONFIRMED bookings for this event
        List<Booking> confirmedBookings =
                bookingRepository.findByEventIdAndBookingStatus(
                        eventId, BookingStatus.CONFIRMED);

        for (Booking booking : confirmedBookings) {
            booking.setBookingStatus(BookingStatus.CANCELLED_BY_ORGANIZER);
            bookingRepository.save(booking);
        }

        System.out.print("Event cancelled. ID: " + eventId + " | " + confirmedBookings.size() + " bookings also cancelled.");
    }


    /**
     * Convert Event entity to EventResponse DTO
     */
    private EventResponse convertToResponse(Event event) {
        EventResponse response = new EventResponse();
        response.setId(event.getId());
        response.setName(event.getName());
        response.setDescription(event.getDescription());
        response.setEventDate(event.getEventDate().toString());
        response.setEventTime(event.getEventTime().toString());
        response.setVenue(event.getVenue());
        response.setTotalSeats(event.getTotalSeats());
        response.setBookedSeats(event.getBookedSeats());
        response.setAvailableSeats(event.getAvailableSeats());
        response.setTicketPrice(event.getTicketPrice());
        response.setCategory(event.getCategory());
        response.setOrganizerEmail(event.getOrganizerEmail());
        response.setStatus(event.getStatus());
        response.setCreatedAt(event.getCreatedAt());
        return response;
    }
}