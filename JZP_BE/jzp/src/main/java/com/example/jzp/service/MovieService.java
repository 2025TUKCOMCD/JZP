package com.example.jzp.service;

import com.example.jzp.model.Movie;
import com.example.jzp.controller.MovieController;
import com.example.jzp.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

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

    // 영화 시간 저장
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

    // 영화 좌석 저장
    public boolean setMovieSeat(UUID movieId, String movieSeat) {
        Optional<Movie> movieOptional = movieRepository.findById(movieId);
        if (movieOptional.isEmpty()) {
            return false;
        }

        Movie movie = movieOptional.get();
        int remainingSeats = movie.getMovieSeatRemain();

        // 이미 예약된 좌석인지 확인 후 감소
        if (remainingSeats > 0) {
            movie.setMovieSeatRemain(remainingSeats - 1); // 좌석 감소
            movieRepository.save(movie);
            return true;
        }

        return false;
    }
    // 남은 좌석 수 조회
    public int getMovieSeatRemain(UUID movieId) {
        return movieRepository.findById(movieId)
                .map(Movie::getMovieSeatRemain)
                .orElse(0);
    }

    public boolean saveMovieCustomer(MovieController.MovieCustomerRequest request) {
        Optional<Movie> movieOptional = movieRepository.findById(request.getMovieId());
        if (movieOptional.isEmpty()) {
            return false;
        }

        Movie movie = movieOptional.get();
        movie.setMovieSeatRemain(request.getMovieSeatRemain());
        // 영화 고객 정보 저장 로직 추가
        movie.setMovieCustomerDisabled(request.getMovieCustomerDisabled());
        movie.setMovieCustomerYouth(request.getMovieCustomerYouth());
        movie.setMovieCustomerAdult(request.getMovieCustomerAdult());
        movie.setMovieCustomerOld(request.getMovieCustomerOld());

        movieRepository.save(movie);
        return true;
    }
}
