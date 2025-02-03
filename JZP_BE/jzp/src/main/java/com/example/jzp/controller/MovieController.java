package com.example.jzp.controller;

import com.example.jzp.model.Movie;
import com.example.jzp.service.MovieService;
import com.example.jzp.service.TicketService;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;
import java.util.stream.Collectors;

import java.util.*;

@RestController
@RequestMapping("/api/movie")
public class MovieController {

    @Autowired
    private MovieService movieService;

    @Autowired
    private TicketService ticketService;

    @PostMapping("/showmovie/{group}")
    public ResponseEntity<?> showMovieByGroup(@PathVariable("group") String group,
                                              @RequestBody MovieCalendarRequest request) {
        // 영화 리스트를 요청된 날짜로 가져옴
        List<MovieResponse> movies = movieService.getMoviesByDate(request.getMovieCalendar());

        // 사용자 그룹에 맞는 우선순위 처리
        if ("youth".equals(group)) {
            movies = prioritizeForYouth(movies); // 청소년 우선순위 정렬
        } else if ("old".equals(group)) {
            movies = prioritizeForOld(movies); // 노인 우선순위 정렬
        }

        return ResponseEntity.ok(Map.of(
                "movieCalendar", request.getMovieCalendar(),
                "movies", movies
        ));
    }

    // 청소년 우선순위로 영화 정렬 (좌석이 적은 영화부터 우선)
    private List<MovieResponse> prioritizeForYouth(List<MovieResponse> movies) {
        return movies.stream()
                .sorted(Comparator.comparingInt(MovieResponse::getMovieSeatRemain)) // 좌석이 적은 영화
                .collect(Collectors.toList());
    }

    // 노인 우선순위로 영화 정렬 (드라마 장르를 우선시, 좌석이 적은 드라마 영화부터 우선)
    private List<MovieResponse> prioritizeForOld(List<MovieResponse> movies) {
        return movies.stream()
                .sorted(Comparator.comparingInt((MovieResponse movie) ->
                                movie.getMovieType().equals("드라마") ? 1 : 0)
                        .reversed() // 드라마 영화를 먼저
                        .thenComparingInt(MovieResponse::getMovieSeatRemain)) // 좌석 수가 적은 영화
                .collect(Collectors.toList());
    }




    // 영화 시간 저장
    @PostMapping("/time")
    public ResponseEntity<?> setMovieTime(@RequestBody MovieRequest request) {
        boolean success = movieService.updateMovieTime(
                request.getMovieId(),
                request.getMovieTime(),
                request.getMovieTheater()
        );

        return success ? ResponseEntity.ok(Map.of("status", "success"))
                : ResponseEntity.badRequest().body(Map.of("status", "failed", "message", "Movie not found"));
    }


    // DTO: 영화 날짜 요청
    public static class MovieCalendarRequest {
        @JsonFormat(pattern = "yyyy-MM-dd")
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
                request.getMovieSeat(),
                request.getDisabled(),
                request.getYouth(),
                request.getAdult(),
                request.getOld()
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
    public class MovieSeatRequest {
        private UUID movieId;
        private String movieSeat;
        private int disabled; // 장애인 인원 수
        private int youth; // 청소년 인원 수
        private int adult; // 성인 인원 수
        private int old; // 노인 인원 수


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

        public int getDisabled() {
            return disabled;
        }

        public void setDisabled(int disabled) {
            this.disabled = disabled;
        }

        public int getYouth() {
            return youth;
        }

        public void setYouth(int youth) {
            this.youth = youth;
        }

        public int getAdult() {
            return adult;
        }

        public void setAdult(int adult) {
            this.adult = adult;
        }

        public int getOld() {
            return old;
        }

        public void setOld(int old) {
            this.old = old;
        }
    }

    @PostMapping("/customer")
    public ResponseEntity<?> setMovieCustomer(@RequestBody MovieCustomerRequest request) {
        boolean success = movieService.saveMovieCustomer(request);

        if (!success) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "failed",
                    "message", "영화 정보를 찾을 수 없습니다."
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
        private String movieSeat;

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

        public String getMovieSeat() {
            return movieSeat;
        }

        public void setMovieSeat(String movieSeat) {

            this.movieSeat = movieSeat;
        }
    }

    // 결제 내역 확인
    @GetMapping("/payment/history")
    public ResponseEntity<Map<String, Object>> showPayment() {
        // MovieService에서 결제 내역과 총 금액 처리
        Map<String, Object> paymentHistory = movieService.getPaymentHistory();

        return ResponseEntity.ok(paymentHistory);
    }
}

