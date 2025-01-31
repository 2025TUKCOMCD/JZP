package com.example.jzp.service;

import com.example.jzp.model.Movie;
import com.example.jzp.model.Ticket;
import com.example.jzp.controller.MovieController;
import com.example.jzp.repository.MovieRepository;
import com.example.jzp.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class TicketService {

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private TicketRepository ticketRepository;

    // 티켓 예약 메서드
    public UUID bookTicket(UUID movieId, String movieSeat, int disabled, int youth, int adult, int old) {
        // Movie 객체 조회
        Optional<Movie> movieOptional = movieRepository.findById(movieId);
        if (movieOptional.isEmpty()) {
            return null; // 영화가 없으면 null 반환
        }

        Movie movie = movieOptional.get();

        // 새 티켓 생성
        Ticket ticket = new Ticket();

        // 티켓 정보 설정
        ticket.setMovie(movie); // movieId 대신 movie 객체를 설정
        ticket.setMovieSeat(movieSeat);
        ticket.setCustomerDisabled(disabled); // 변경된 부분
        ticket.setCustomerYouth(youth); // 변경된 부분
        ticket.setCustomerAdult(adult); // 변경된 부분
        ticket.setCustomerOld(old); // 변경된 부분
        ticket.setMovieTheater(movie.getMovieTheater()); // 영화관 정보 저장

        // 티켓 저장
        ticketRepository.save(ticket);

        // 생성된 티켓의 ID 반환
        return ticket.getTicketId();
    }

    // 날짜별 영화 조회
    public List<MovieController.MovieResponse> getMoviesByDate(Date movieCalendar) {
        List<Movie> movies = movieRepository.findByMovieCalendar(movieCalendar);
        return movies.stream().map(movie -> {
            MovieController.MovieResponse response = new MovieController.MovieResponse();
            response.setMovieId(movie.getMovieId());
            response.setMovieImage(movie.getMovieImage());
            response.setMovieName(movie.getMovieName());
            response.setMovieType(movie.getMovieType());
            response.setMovieRating(movie.getMovieRating());
            response.setMovieTime(movie.getMovieTime());
            response.setMovieSeatRemain(movie.getMovieSeatRemain());
            response.setMovieTheater(movie.getMovieTheater());
            return response;
        }).collect(Collectors.toList());
    }

    // 영화 시간 저장 (영화 정보만 갱신)
    public boolean updateMovieTime(UUID movieId, Date movieTime, String movieTheater) {
        Optional<Movie> movieOptional = movieRepository.findById(movieId);
        if (movieOptional.isEmpty()) {
            return false;
        }

        Movie movie = movieOptional.get();
        movie.setMovieTime(movieTime);
        movie.setMovieTheater(movieTheater);
        movieRepository.save(movie);

        return true;
    }

    // 영화 좌석 예약 -> TicketService에서 처리하도록 변경
    public boolean setMovieSeat(UUID movieId, String movieSeat, int disabled, int youth, int adult, int old) {
        return bookTicket(movieId, movieSeat, disabled, youth, adult, old) != null;
    }

    // 남은 좌석 수 조회
    public int getMovieSeatRemain(UUID movieId) {
        return movieRepository.findById(movieId)
                .map(Movie::getMovieSeatRemain)
                .orElse(0);
    }

    // 고객 정보 저장 후 Ticket 생성
    public boolean saveMovieCustomer(MovieController.MovieCustomerRequest request) {
        Optional<Movie> movieOptional = movieRepository.findById(request.getMovieId());
        if (movieOptional.isEmpty()) {
            return false;
        }

        // Movie 객체 조회
        Movie movie = movieOptional.get();

        System.out.println("Disabled: " + request.getMovieCustomerDisabled());
        System.out.println("Youth: " + request.getMovieCustomerYouth());
        System.out.println("Adult: " + request.getMovieCustomerAdult());
        System.out.println("Old: " + request.getMovieCustomerOld());


        // 새 티켓 생성
        Ticket ticket = new Ticket();

        // 고객 정보 설정
        ticket.setMovie(movie); // movieId 대신 movie 객체를 설정
        ticket.setMovieSeat(request.getMovieSeat());
        ticket.setCustomerDisabled(request.getMovieCustomerDisabled());
        ticket.setCustomerYouth(request.getMovieCustomerYouth());
        ticket.setCustomerAdult(request.getMovieCustomerAdult());
        ticket.setCustomerOld(request.getMovieCustomerOld());
        ticket.setMovieTheater(movie.getMovieTheater());

        // 티켓 저장
        ticketRepository.save(ticket);


        // 티켓 저장 후 성공적인 ID 반환 여부
        return true;
    }
}
