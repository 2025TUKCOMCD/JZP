package com.example.jzp.service;

import com.example.jzp.model.Movie;
import com.example.jzp.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;


@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    public List<Movie> getMoviesByDate(Date movieCalendar) {
        return movieRepository.findByMovieCalendar(movieCalendar);
    }

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
}
