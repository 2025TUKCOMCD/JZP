package com.example.jzp.repository;

import java.util.UUID;
import com.example.jzp.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, UUID> {
}
