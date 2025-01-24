package com.example.jzp.controller;

import com.example.jzp.model.Movie;
import com.example.jzp.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.*;

@RestController
@RequestMapping("/api/movie")
public class MovieController {

    @Autowired
    private MovieService movieService;

    @PostMapping("/showmovie")
    public List<Movie> showMovie(@RequestBody MovieRequest movieRequest) {
        return movieService.getMoviesByDate(movieRequest.getMovieCalendar());
    }

    @PostMapping("/movietime")
    public ResponseEntity<?> setMovieTime(
            @RequestParam UUID movieId,
            @RequestParam String movieName,
            @RequestParam @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date movieTime,
            @RequestParam String movieTheater) {
        // 영화 시간과 극장 정보를 업데이트
        boolean success = movieService.updateMovieTime(movieId, movieTime, movieTheater);

        if (!success) {
            return ResponseEntity.badRequest().body(Map.of("status", "failed", "message", "Movie not found or update failed"));
        }

        // 임의로 생성된 ticketId 반환
        UUID ticketId = UUID.randomUUID();
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "ticketId", ticketId
        ));
    }

    public static class MovieRequest {
        @JsonFormat(pattern = "yyyy-MM-dd")
        private Date movieCalendar;

        public Date getMovieCalendar() {
            return movieCalendar;
        }

        public void setMovieCalendar(Date movieCalendar) {
            this.movieCalendar = movieCalendar;
        }
    }
}
