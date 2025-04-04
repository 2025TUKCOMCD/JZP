package com.example.jzp.repository;

import com.example.jzp.model.Movie;
import com.example.jzp.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.time.LocalTime;
import java.util.Date;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    Optional<Ticket> findTopByMovieOrderByCreatedAtDesc(Movie movie);
    List<Ticket> findByMovie(Movie movie);
    List<Ticket> findByMovieMovieCalendarAndMovieMovieTime(Date movieCalendar, String movieTime);
    Ticket findTopByOrderByTicketIdDesc();

}
