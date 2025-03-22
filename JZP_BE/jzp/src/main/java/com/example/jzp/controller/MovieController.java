package com.example.jzp.controller;

import com.example.jzp.model.Movie;
import com.example.jzp.model.Ticket;
import com.example.jzp.model.User;

import com.example.jzp.service.MovieService;
import com.example.jzp.service.TicketService;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.request.SingleMessageSendingRequest;
import net.nurigo.sdk.message.response.SingleMessageSentResponse;
import net.nurigo.sdk.message.service.DefaultMessageService;
import org.springframework.messaging.simp.SimpMessagingTemplate;


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

    private final DefaultMessageService messageService;

    public MovieController(
            @Value("${coolsms.api.key}") String apiKey,
            @Value("${coolsms.api.secret}") String apiSecret,
            TicketService ticketService
    ) {
        this.messageService = NurigoApp.INSTANCE.initialize(apiKey, apiSecret, "https://api.coolsms.co.kr");
        this.ticketService = ticketService;
    }

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @PostMapping("/agegroup")
    public ResponseEntity<String> receiveAgeGroup(@RequestBody User user) {
        String ageGroup = user.getAgeGroup();

        if (ageGroup == null || (!ageGroup.equals("아이") && !ageGroup.equals("어른") && !ageGroup.equals("노인"))) {
            return ResponseEntity.badRequest().body("Invalid age group.");
        }

        // 나이대 정보를 WebSocket을 통해 프론트엔드로 전송
        messagingTemplate.convertAndSend("/jzp/agegroup", ageGroup);

        return ResponseEntity.ok("나이 전송 성공");
    }

    @PostMapping("/Reservation")
    public Map<String, Object> Reservation(@RequestBody ReservationRequest ReservationRequest) {
        UUID ticketId = ReservationRequest.getTicketId();

        // 티켓 조회
        Ticket ticket = ticketService.getTicketById(ticketId);

        if (ticket == null) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "티켓이 존재하지 않습니다.");
            return errorResponse;
        }

        // 영화 정보 가져오기
        Movie movie = ticket.getMovie();
        if (movie == null) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "해당 영화 정보를 찾을 수 없습니다.");
            return errorResponse;
        }

        // 폰번호 저장
        String phoneNumber = ReservationRequest.getPhoneNumber();
        ticket.setPhoneNumber(phoneNumber);
        ticketService.saveTicket(ticket);

        // 예매 정보 반환
        Map<String, Object> response = new HashMap<>();

        // 영화 정보만 포함
        Map<String, Object> movieInfo = new HashMap<>();
        movieInfo.put("movieName", movie.getMovieName());
        movieInfo.put("movieCalendar", movie.getMovieCalendar());
        movieInfo.put("movieTime", movie.getMovieTime());
        movieInfo.put("movieTheater", movie.getMovieTheater());
        movieInfo.put("movieImage", movie.getMovieImage());
        movieInfo.put("movieGrade", movie.getMovieGrade());
        movieInfo.put("movieSeat", ticket.getMovieSeat()); // 티켓의 좌석 정보

        response.put("movie", movieInfo);

        // 티켓 정보
        Map<String, Object> ticketInfo = new HashMap<>();
        ticketInfo.put("ticketId", ticket.getTicketId());
        ticketInfo.put("createdAt", ticket.getCreatedAt());

        response.put("ticket", ticketInfo);

        return response;
    }

    public static class ReservationRequest {
        private UUID ticketId;
        private String phoneNumber;

        // Getter와 Setter
        public UUID getTicketId() {
            return ticketId;
        }

        public void setTicketId(UUID ticketId) {
            this.ticketId = ticketId;
        }

        public String getPhoneNumber() {
            return phoneNumber;
        }

        public void setPhoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
        }
    }


    @PostMapping("/sendTicketNum")
    public String sendTicketNumber(@RequestBody SendTicketNum sendTicketNum) {
        // 가장 최근에 저장된 티켓을 조회
        Ticket ticket = ticketService.getLatestTicket();

        if (ticket == null) {
            return "최근 예매된 티켓이 존재하지 않습니다.";
        }

        // 폰번호만 업데이트
        ticket.setPhoneNumber(sendTicketNum.getPhoneNumber());
        ticketService.saveTicket(ticket);  // 예매 정보 저장

        // 영화 정보 가져오기
        Movie movie = ticket.getMovie();
        if (movie == null) {
            return "해당 영화 정보를 찾을 수 없습니다.";
        }

        // 메시지 내용 구성
        String subject = "[영화_예매알림]";
        String messageText = String.format(
                "\n\n영화명: %s\n" +
                        "예매번호: %s\n" +
                        "좌석: %s\n" +
                        "상영일시: %s\n\n" +
                        "영화 상영시작 10분전에 입장해주세요.",
                movie.getMovieName(),
                ticket.getTicketId(),
                ticket.getMovieSeat(),
                movie.getMovieTime()
        );

        // 보내는 전화번호 (실제 서비스에 맞게 설정)
        String senderPhoneNumber = "01050619483";

        // 메시지 전송 객체 생성
        Message message = new Message();
        message.setFrom(senderPhoneNumber);
        message.setTo(sendTicketNum.getPhoneNumber());
        message.setText(messageText);
        message.setSubject(subject);

        try {
            // 메시지 전송
            SingleMessageSentResponse response = messageService.sendOne(new SingleMessageSendingRequest(message));
            System.out.println(response);
            return "예매 정보 전송 성공!";
        } catch (Exception e) {
            e.printStackTrace();
            return "예매 정보 전송 실패: " + e.getMessage();
        }
    }

    public static class SendTicketNum {
        private String phoneNumber;

        // Getter와 Setter
        public String getPhoneNumber() {
            return phoneNumber;
        }

        public void setPhoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
        }
    }

    @GetMapping("/sendTicket")
    public String sendTicket(@RequestParam("ticketId") UUID ticketId) {
        // 티켓 조회
        Ticket ticket = ticketService.getTicketById(ticketId);

        if (ticket == null) {
            return "티켓이 존재하지 않습니다.";
        }

        // 영화 정보 가져오기
        Movie movie = ticket.getMovie();
        if (movie == null) {
            return "해당 영화 정보를 찾을 수 없습니다.";
        }

        // 티켓에 저장된 전화번호 가져오기
        String phoneNumber = ticket.getPhoneNumber(); // 티켓 객체에서 phoneNumber 가져오기
        if (phoneNumber == null || phoneNumber.isEmpty()) {
            return "전화번호가 등록되어 있지 않습니다.";
        }

        // 메시지 내용 구성
        String subject = "[영화_예매알림]";
        String messageText = String.format(
                "\n\n영화명: %s\n" +
                        "예매번호: %s\n" +
                        "좌석: %s\n" +
                        "상영일시: %s\n" +
                        "영화관: %s\n" +
                        "영화등급: %s\n" +
                        "영화이미지: %s\n\n" +
                        "영화 상영시작 10분 전에 입장해주세요.",
                movie.getMovieName(),
                ticket.getTicketId(),
                ticket.getMovieSeat(),
                movie.getMovieTime(),
                movie.getMovieTheater(),
                movie.getMovieGrade(),
                movie.getMovieImage()
        );

        // 보내는 전화번호 (실제 서비스에 맞게 설정)
        String senderPhoneNumber = "01050619483"; // 보내는 전화번호 (실제 서비스에 맞게 설정)

        // 메시지 전송 객체 생성
        Message message = new Message();
        message.setFrom(senderPhoneNumber);
        message.setTo(phoneNumber);
        message.setText(messageText);
        message.setSubject(subject);

        try {
            // 메시지 전송
            SingleMessageSentResponse response = messageService.sendOne(new SingleMessageSendingRequest(message));
            System.out.println(response);
            return "예매 정보 전송 성공!";
        } catch (Exception e) {
            e.printStackTrace();
            return "예매 정보 전송 실패: " + e.getMessage();
        }
    }


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
        private String movieTime;
        private String movieTheater;

        // Getters and Setters
        public UUID getMovieId() {
            return movieId;
        }

        public void setMovieId(UUID movieId) {
            this.movieId = movieId;
        }

        public String getMovieTime() {
            return movieTime;
        }

        public void setMovieTime(String movieTime) {
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
        private String  movieTime;
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

        public String  getMovieTime() {
            return movieTime;
        }

        public void setMovieTime(String  movieTime) {
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
        if (request.getMovieId() == null || request.getMovieSeat() == null || request.getMovieName() == null || request.getMovieTime() == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "필수 항목이 누락되었습니다"
            ));
        }

        UUID movieId = request.getMovieId();
        String movieSeat = request.getMovieSeat();
        String movieTheater = request.getMovieTheater();
        String movieName = request.getMovieName();  // 영화 이름
        String movieTime = request.getMovieTime();  // 영화 시간

        boolean success = movieService.setMovieSeat(movieId, movieSeat, movieTheater, movieName, movieTime); // Pass all the required parameters

        if (!success) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "해당 좌석을 이용할 수 없습니다"
            ));
        }

        // 예약 후 최신 좌석 정보 조회
        int remainingSeats = movieService.getMovieSeatRemain(movieId);
        String updatedSeats = movieService.getUpdatedMovieSeat(movieId);  // Get updated movie seat info

        return ResponseEntity.ok(Map.of(
                "success", true,
                "movieId", movieId,
                "movieSeatRemain", remainingSeats
        ));
    }



    // DTO: 영화 좌석 저장 요청
    public static class MovieSeatRequest {
        private UUID movieId;
        private String movieSeat;
        private String movieTheater;
        private String movieName;  // 영화 이름 추가
        private String movieTime;

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

        public String getMovieName() {
            return movieName;
        }

        public void setMovieName(String movieName) {
            this.movieName = movieName;
        }

        public String getMovieTime() {
            return movieTime;
        }

        public void setMovieTime(String movieTime) {
            this.movieTime = movieTime;
        }
    }

    @PostMapping("/customer")
    public ResponseEntity<?> setMovieCustomer(@RequestBody MovieCustomerRequest request) {
        if (request.getMovieId() == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "필수 항목이 누락되었습니다"
            ));
        }

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

    public static class MovieCustomerRequest {
        private UUID movieId;
        private int movieCustomerDisabled;
        private int movieCustomerYouth;
        private int movieCustomerAdult;
        private int movieCustomerOld;

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

    @GetMapping("/ticket")
    public ResponseEntity<Map<String, Object>> getTicketDetails(@RequestParam("ticketId") UUID ticketId){
        Map<String, Object> ticketDetails = movieService.getTicketDetails(ticketId);

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
        private String movieTime;
        private String movieTheater;
        private String movieGrade;
        private String movieSeat;
        private int movieSeatRemain;

        public MovieTimeResponse(UUID movieId, String movieImage, String movieName,
                                 String movieType, int movieRating, String movieTime,
                                 String movieTheater, String movieGrade,String movieSeat, int movieSeatRemain) {
            this.movieId = movieId;
            this.movieImage = movieImage;
            this.movieName = movieName;
            this.movieType = movieType;
            this.movieRating = movieRating;
            this.movieTime = movieTime;
            this.movieTheater = movieTheater;
            this.movieGrade = movieGrade;
            this.movieSeat = movieSeat;
            this.movieSeatRemain = movieSeatRemain;
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

        public String getMovieTime() {
            return movieTime;
        }

        public void setMovieTime(String movieTime) {
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
        public String getMovieSeat() {
            return movieSeat;
        }

        public void setMovieSeat(String movieSeat) {
            this.movieSeat = movieSeat;
        }

        public int getMovieSeatRemain() {
            return movieSeatRemain;
        }

        public void setMovieSeatRemain(int movieSeatRemain) {
            this.movieSeatRemain = movieSeatRemain;
        }
    }

    @GetMapping("/movietime")
    public List<MovieTimeResponse> getMoviesByTime(
            @RequestParam(name = "movieCalendar") @DateTimeFormat(pattern = "yyyy-MM-dd") Date movieCalendar,
            @RequestParam(name = "movieTime") @DateTimeFormat(pattern = "HH:mm:ss") String movieTime) {

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
                        movie.getMovieGrade(),
                        movie.getMovieSeat(),
                        movie.getMovieSeatRemain()))

                .collect(Collectors.toList());
    }

        // 결제 내역 확인
        @GetMapping("/payment/history")
        public ResponseEntity<Map<String, Object>> showPayment() {
            // MovieService에서 결제 내역과 총 금액 처리
            Map<String, Object> paymentHistory = movieService.getPaymentHistory();

            return ResponseEntity.ok(paymentHistory);
        }


}
