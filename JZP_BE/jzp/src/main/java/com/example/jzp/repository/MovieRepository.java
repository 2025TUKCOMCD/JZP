package com.example.jzp.repository;

import com.example.jzp.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.List;
import java.util.UUID;

public interface MovieRepository extends JpaRepository<Movie, UUID> {
    List<Movie> findByMovieCalendar(Date movieCalendar);
}
