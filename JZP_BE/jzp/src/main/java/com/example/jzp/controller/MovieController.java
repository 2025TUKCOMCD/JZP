package com.example.jzp.controller;

import com.example.jzp.model.Movie;
import com.example.jzp.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.*;

@RestController
@RequestMapping("/api/movie")
public class MovieController {

    @Autowired
    private MovieService movieService;

    // 영화 불러오기
    @PostMapping("/showmovie")
    public ResponseEntity<?> showMovie(@RequestBody MovieCalendarRequest request) {
        List<MovieResponse> movies = movieService.getMoviesByDate(request.getMovieCalendar());
        return ResponseEntity.ok(Map.of(
                "movieCalendar", request.getMovieCalendar(),
                "movies", movies
        ));
    }

    // 영화 시간 저장
    @PostMapping("/time")
    public ResponseEntity<?> setMovieTime(@RequestBody MovieRequest request) {
        boolean success = movieService.updateMovieTime(
                request.getMovieId(),
                request.getMovieTime(),
                request.getMovieTheater()
        );

        if (!success) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "failed",
                    "message", "Movie not found or update failed"
            ));
        }

        return ResponseEntity.ok(Map.of("status", "success"));
    }

    // DTO: 영화 날짜 요청
    public static class MovieCalendarRequest {
        @DateTimeFormat(pattern = "yyyy-MM-dd")
        private Date movieCalendar;

        public Date getMovieCalendar() {
            return movieCalendar;
        }

        public void setMovieCalendar(Date movieCalendar) {
            this.movieCalendar = movieCalendar;
        }
    }

    // DTO: 영화 시간 저장 요청
    public static class MovieRequest {
        private UUID movieId;
        private String movieName;

        @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private Date movieTime;

        private String movieTheater;

        // Getters and Setters
        public UUID getMovieId() {
            return movieId;
        }

        public void setMovieId(UUID movieId) {
            this.movieId = movieId;
        }

        public String getMovieName() {
            return movieName;
        }

        public void setMovieName(String movieName) {
            this.movieName = movieName;
        }

        public Date getMovieTime() {
            return movieTime;
        }

        public void setMovieTime(Date movieTime) {
            this.movieTime = movieTime;
        }

        public String getMovieTheater() {
            return movieTheater;
        }

        public void setMovieTheater(String movieTheater) {
            this.movieTheater = movieTheater;
        }
    }

    // DTO: 영화 응답 데이터
    public static class MovieResponse {
        private UUID movieId;
        private String movieImage;
        private String movieName;
        private String movieType;
        private String movieRating;
        private Date movieTime;
        private int movieSeatRemain;
        private String movieTheater;

        // Getters and Setters
        public UUID getMovieId() {
            return movieId;
        }

        public void setMovieId(UUID movieId) {
            this.movieId = movieId;
        }

        public String getMovieImage() {
            return movieImage;
        }

        public void setMovieImage(String movieImage) {
            this.movieImage = movieImage;
        }

        public String getMovieName() {
            return movieName;
        }

        public void setMovieName(String movieName) {
            this.movieName = movieName;
        }

        public String getMovieType() {
            return movieType;
        }

        public void setMovieType(String movieType) {
            this.movieType = movieType;
        }

        public String getMovieRating() {
            return movieRating;
        }

        public void setMovieRating(String movieRating) {
            this.movieRating = movieRating;
        }

        public Date getMovieTime() {
            return movieTime;
        }

        public void setMovieTime(Date movieTime) {
            this.movieTime = movieTime;
        }

        public int getMovieSeatRemain() {
            return movieSeatRemain;
        }

        public void setMovieSeatRemain(int movieSeatRemain) {
            this.movieSeatRemain = movieSeatRemain;
        }

        public String getMovieTheater() {
            return movieTheater;
        }

        public void setMovieTheater(String movieTheater) {
            this.movieTheater = movieTheater;
        }
    }

    // 영화 좌석 저장
    @PostMapping("/seat")
    public ResponseEntity<?> setMovieSeat(@RequestBody MovieSeatRequest request) {
        boolean success = movieService.setMovieSeat(
                request.getMovieId(),
                request.getMovieSeat()
        );

        if (!success) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Movie not found or seat reservation failed"
            ));
        }

        int remainingSeats = movieService.getMovieSeatRemain(request.getMovieId());

        return ResponseEntity.ok(Map.of(
                "success", true,
                "movieSeatRemain", remainingSeats
        ));
    }

    // DTO: 영화 좌석 저장
    public static class MovieSeatRequest {
        private UUID movieId;
        private String movieSeat;

        // Getters and Setters
        public UUID getMovieId() {
            return movieId;
        }

        public void setMovieId(UUID movieId) {
            this.movieId = movieId;
        }

        public String getMovieSeat() {
            return movieSeat;
        }

        public void setMovieSeat(String movieSeat) {
            this.movieSeat = movieSeat;
        }
    }
    @PostMapping("/customer")
    public ResponseEntity<?> setMovieCustomer(@RequestBody MovieCustomerRequest request) {
        boolean success = movieService.saveMovieCustomer(request);

        if (!success) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "failed",
                    "message", "Movie not found or update failed"
            ));
        }

        return ResponseEntity.ok(Map.of("status", "success"));
    }

    public static class MovieCustomerRequest {
        private UUID movieId;
        private String movieImage;
        private String movieName;
        private String movieType;
        private String movieRating;
        private Date movieTime;
        private int movieSeatRemain;
        private String movieTheater;
        private int movieCustomerDisabled;
        private int movieCustomerYouth;
        private int movieCustomerAdult;
        private int movieCustomerOld;

        // Getters and Setters
        public UUID getMovieId() {
            return movieId;
        }

        public void setMovieId(UUID movieId) {
            this.movieId = movieId;
        }

        public String getMovieImage() {
            return movieImage;
        }

        public void setMovieImage(String movieImage) {
            this.movieImage = movieImage;
        }

        public String getMovieName() {
            return movieName;
        }

        public void setMovieName(String movieName) {
            this.movieName = movieName;
        }

        public String getMovieType() {
            return movieType;
        }

        public void setMovieType(String movieType) {
            this.movieType = movieType;
        }

        public String getMovieRating() {
            return movieRating;
        }

        public void setMovieRating(String movieRating) {
            this.movieRating = movieRating;
        }

        public Date getMovieTime() {
            return movieTime;
        }

        public void setMovieTime(Date movieTime) {
            this.movieTime = movieTime;
        }

        public int getMovieSeatRemain() {
            return movieSeatRemain;
        }

        public void setMovieSeatRemain(int movieSeatRemain) {
            this.movieSeatRemain = movieSeatRemain;
        }

        public String getMovieTheater() {
            return movieTheater;
        }

        public void setMovieTheater(String movieTheater) {
            this.movieTheater = movieTheater;
        }

        public int getMovieCustomerDisabled() {
            return movieCustomerDisabled;
        }

        public void setMovieCustomerDisabled(int movieCustomerDisabled) {
            this.movieCustomerDisabled = movieCustomerDisabled;
        }

        public int getMovieCustomerYouth() {
            return movieCustomerYouth;
        }

        public void setMovieCustomerYouth(int movieCustomerYouth) {
            this.movieCustomerYouth = movieCustomerYouth;
        }

        public int getMovieCustomerAdult() {
            return movieCustomerAdult;
        }

        public void setMovieCustomerAdult(int movieCustomerAdult) {
            this.movieCustomerAdult = movieCustomerAdult;
        }

        public int getMovieCustomerOld() {
            return movieCustomerOld;
        }

        public void setMovieCustomerOld(int movieCustomerOld) {
            this.movieCustomerOld = movieCustomerOld;
        }
    }
}
