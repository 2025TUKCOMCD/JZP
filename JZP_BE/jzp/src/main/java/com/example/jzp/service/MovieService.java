package com.example.jzp.service;

import com.example.jzp.model.Movie;
import com.example.jzp.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    public List<Movie> getMoviesByDate(Date movieCalendar) {
        return movieRepository.findByMovieCalendar(movieCalendar);
    }
}

