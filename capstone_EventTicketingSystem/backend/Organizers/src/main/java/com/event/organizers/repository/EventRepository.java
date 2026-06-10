package com.event.organizers.repository;

import com.event.organizers.entity.Event;
import com.event.organizers.enums.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository for Event entity
 */
@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    /**
     * Find all events by organizer email
     */
    List<Event> findByOrganizerEmail(String organizerEmail);

    /**
     * Find all events by status
     */
    List<Event> findByStatus(EventStatus status);

    /**
     * Find all active events (upcoming)
     */
    List<Event> findByStatusAndEventDateGreaterThanEqual(EventStatus status, LocalDate date);

    /**
     * Find events by organizer and status
     */
    List<Event> findByOrganizerEmailAndStatus(String organizerEmail, EventStatus status);
}