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

    // 영화 그룹별 요청
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

    // 청소년 우선순위로 영화 정렬
    private List<MovieResponse> prioritizeForYouth(List<MovieResponse> movies) {
        return movies.stream()
                .sorted(Comparator.comparingInt(MovieResponse::getMovieRating)) // 영화 평점으로 우선 정렬
                .collect(Collectors.toList());
    }

    // 노인 우선순위로 영화 정렬, 드라마 장르를 우선시
    private List<MovieResponse> prioritizeForOld(List<MovieResponse> movies) {
        return movies.stream()
                .sorted(Comparator.comparingInt((MovieResponse movie) ->
                                movie.getMovieType().equals("드라마") ? 1 : 0) // 드라마 영화를 먼저
                        .reversed() // 드라마 우선
                        .thenComparingInt(MovieResponse::getMovieRating)) // 영화 평점으로 정렬
                .collect(Collectors.toList());
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

    // 영화 시간 저장
    @PostMapping("/time")
    public ResponseEntity<?> updateMovieTime(@RequestBody MovieTimeRequest request) {
        boolean success = movieService.updateMovieTime(request.getMovieId(), request.getMovieTime(), request.getMovieTheater());

        if (!success) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "failed",
                    "message", "영화 정보를 찾을 수 없습니다."
            ));
        }

        return ResponseEntity.ok(Map.of("status", "success"));
    }

    public static class MovieTimeRequest {
        private UUID movieId;
        private LocalTime movieTime;
        private String movieTheater;

        // Getters and Setters
        public UUID getMovieId() {
            return movieId;
        }

        public void setMovieId(UUID movieId) {
            this.movieId = movieId;
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
        private int movieRating;
        private LocalTime movieTime;
        private int movieSeatRemain;
        private String movieTheater;
        private String movieGrade;

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

        public int getMovieRating() {
            return movieRating;
        }

        public void setMovieRating(int movieRating) {
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

        public String getMovieGrade() {
            return movieGrade;
        }

        public void setMovieGrade(String movieGrade) {
            this.movieGrade = movieGrade;
        }

        public String getMovieTheater() {
            return movieTheater;
        }

        public void setMovieTheater(String movieTheater) {
            this.movieTheater = movieTheater;
        }
    }

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
        private UUID movieId;
        private String movieSeat;
        private String movieTheater;

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

        public String getMovieTheater() {
            return movieTheater;
        }

        public void setMovieTheater(String movieTheater) {
            this.movieTheater = movieTheater;
        }
    }

    // 고객 정보를 저장하는 API
    @PostMapping("/customer")
    public ResponseEntity<?> saveMovieCustomer(@RequestBody MovieCustomerRequest request) {
        if (request.getMovieId() == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "필수 항목이 누락되었습니다"
            ));
        }

        // 고객 정보를 저장
        boolean success = movieService.saveMovieCustomer(
                request.getMovieId(),
                request.getMovieCustomerDisabled(),
                request.getMovieCustomerYouth(),
                request.getMovieCustomerAdult(),
                request.getMovieCustomerOld()
        );

        if (!success) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false
            ));
        }

        return ResponseEntity.ok(Map.of(
                "success", true
        ));
    }

    // MovieCustomerRequest DTO 정의
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

    // 예매 내역 확인
    @PostMapping("/ticket")
    public ResponseEntity<Map<String, Object>> showTicket(@RequestBody TicketRequest request) {
        Map<String, Object> ticketDetails = movieService.getTicketDetails(request.getTicketId());
        if (ticketDetails != null) {
            return ResponseEntity.ok(ticketDetails);
        }
        return ResponseEntity.notFound().build();
    }

    public static class TicketRequest {
        private UUID ticketId;

        public UUID getTicketId() {
            return ticketId;
        }

        public void setTicketId(UUID ticketId) {
            this.ticketId = ticketId;
        }
    }

    @GetMapping("/banner")
    public ResponseEntity<?> getBanner() {
        return ResponseEntity.ok(Map.of(
                "success", true,
                "movieImage", "http://3.106.89.95/images/harry2.jpg"
        ));
    }

    // 새로운 응답 클래스 정의
    public static class MovieTimeResponse {
        private UUID movieId;
        private String movieImage;
        private String movieName;
        private String movieType;
        private int movieRating;
        private LocalTime movieTime;
        private String movieTheater;
        private String movieGrade;

        public MovieTimeResponse(UUID movieId, String movieImage, String movieName,
                                 String movieType, int movieRating, LocalTime movieTime,
                                 String movieTheater, String movieGrade) {
            this.movieId = movieId;
            this.movieImage = movieImage;
            this.movieName = movieName;
            this.movieType = movieType;
            this.movieRating = movieRating;
            this.movieTime = movieTime;
            this.movieTheater = movieTheater;
            this.movieGrade = movieGrade;
        }

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

        public int getMovieRating() {
            return movieRating;
        }

        public void setMovieRating(int movieRating) {
            this.movieRating = movieRating;
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

        public String getMovieGrade() {
            return movieGrade;
        }

        public void setMovieGrade(String movieGrade) {
            this.movieGrade = movieGrade;
        }
    }

    @GetMapping("/movietime")
    public List<MovieTimeResponse> getMoviesByTime(
            @RequestParam(name = "movieCalendar") @DateTimeFormat(pattern = "yyyy-MM-dd") Date movieCalendar,
            @RequestParam(name = "movieTime") @DateTimeFormat(pattern = "HH:mm:ss") LocalTime movieTime) {

        List<Movie> movies = movieService.getMoviesByTime(movieCalendar, movieTime);

        return movies.stream()
                .map(movie -> new MovieTimeResponse(
                        movie.getMovieId(),
                        movie.getMovieImage(),
                        movie.getMovieName(),
                        movie.getMovieType(),
                        movie.getMovieRating(),
                        movie.getMovieTime(),
                        movie.getMovieTheater(),
                        movie.getMovieGrade()))
                .collect(Collectors.toList());
    }


}
