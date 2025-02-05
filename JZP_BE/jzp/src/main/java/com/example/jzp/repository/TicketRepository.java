package com.example.jzp.repository;

import com.example.jzp.model.Movie;
import com.example.jzp.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TicketRepository extends JpaRepository<Ticket, UUID> {
    List<Ticket> findByMovie(Movie movie);
}
