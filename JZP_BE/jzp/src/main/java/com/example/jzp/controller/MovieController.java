package com.example.jzp.controller;

import com.example.jzp.model.Movie;
import com.example.jzp.service.MovieService;
import com.example.jzp.service.TicketService;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalTime;
import java.util.stream.Collectors;

import java.util.*;

@RestController
@CrossOrigin("*")

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
                : ResponseEntity.badRequest().body(Map.of("status", "failed", "message", "영화를 찾을 수 없습니다"));
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
        private LocalTime movieTime;
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

        public LocalTime getMovieTime() {
            return movieTime;
        }

        public void setMovieTime(LocalTime movieTime) {
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
        private LocalTime movieTime;
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

        public LocalTime getMovieTime() {
            return movieTime;
        }
        public void setMovieTime(LocalTime movieTime) {
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
        if (request.getMovieId() == null || request.getMovieSeat() == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "필수 항목이 누락되었습니다"
            ));
        }

        // 영화 ID와 좌석 정보를 받아서 예약 처리
        UUID movieId = request.getMovieId();
        String movieSeat = request.getMovieSeat();
        String movieTheater = request.getMovieTheater();

        // 좌석 예약을 위해 MovieService의 setMovieSeat 호출
        boolean success = movieService.setMovieSeat(movieId, movieSeat, movieTheater);

        if (!success) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "해당 좌석을 이용할 수 없습니다"
            ));
        }

        // 예약 후 남은 좌석 수 조회
        int remainingSeats = movieService.getMovieSeatRemain(movieId);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "movieSeatRemain", remainingSeats
        ));
    }


    // DTO: 영화 좌석 저장 요청
    public static class MovieSeatRequest {
        private UUID movieId;         // 영화 ID
        private String movieName;     // 영화 이름
        private LocalTime movieTime;       // 영화 시간
        private String movieSeat;     // 좌석
        private String movieTheater;  // 영화관 정보

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

        public LocalTime getMovieTime() {
            return movieTime;
        }

        public void setMovieTime(LocalTime movieTime) {
            this.movieTime = movieTime;
        }

        public String getMovieSeat() {
            return movieSeat;
        }

        public void setMovieSeat(String movieSeat) {
            this.movieSeat = movieSeat;
        }

        public String getMovieTheater() {
            return movieTheater;
        }

        public void setMovieTheater(String movieTheater) {
            this.movieTheater = movieTheater;
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

    // 결제 내역 확인
    @GetMapping("/payment/history")
    public ResponseEntity<Map<String, Object>> showPayment() {
        // MovieService에서 결제 내역과 총 금액 처리
        Map<String, Object> paymentHistory = movieService.getPaymentHistory();

        return ResponseEntity.ok(paymentHistory);
    }

    // 예매 내역 확인
    @PostMapping("/ticket")
    public ResponseEntity<Map<String, Object>> showTicket(@RequestBody TicketRequest request) {
        Map<String, Object> ticketDetails = movieService.getTicketDetails(request.getTicketId());
        if (ticketDetails != null) {
            return ResponseEntity.ok(ticketDetails);
        }
        return ResponseEntity.notFound().build(); // 예매 정보가 없을 경우 404 반환
    }

    // Request Body를 위한 DTO (Data Transfer Object) 클래스
    public static class TicketRequest {
        private UUID ticketId;

        public UUID getTicketId() {
            return ticketId;
        }

        public void setTicketId(UUID ticketId) {
            this.ticketId = ticketId;
        }
    }
}