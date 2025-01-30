package com.example.jzp.service;

import com.example.jzp.repository.MovieRepository;
import com.example.jzp.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.UUID;
import com.example.jzp.model.Movie;
import com.example.jzp.model.Ticket;



@Service
public class TicketService {
    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private MovieRepository movieRepository;

    public UUID bookTicket(UUID movieId, String movieSeat, int disabled, int youth, int adult, int old) {
        Movie movie = movieRepository.findById(movieId).orElse(null);
        if (movie == null || movie.getMovieSeatRemain() <= 0) {
            return null; // 영화 정보 없음 or 좌석 부족
        }

        Ticket ticket = new Ticket();
        ticket.setMovie(movie);
        ticket.setMovieSeat(movieSeat);
        ticket.setCustomerDisabled(disabled);
        ticket.setCustomerYouth(youth);
        ticket.setCustomerAdult(adult);
        ticket.setCustomerOld(old);

        movie.setMovieSeatRemain(movie.getMovieSeatRemain() - 1); // 좌석 감소
        movieRepository.save(movie);

        Ticket savedTicket = ticketRepository.save(ticket);
        return savedTicket.getTicketId();
    }
}

