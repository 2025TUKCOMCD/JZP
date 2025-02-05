package com.example.jzp.service;

import com.example.jzp.model.Movie;
import com.example.jzp.controller.MovieController;
import com.example.jzp.repository.MovieRepository;
import com.example.jzp.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.jzp.model.Ticket;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service

public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private TicketService ticketService; // TicketService 사용

    private static final int YOUTH_TICKET_PRICE = 10000;  // 청소년 가격
    private static final int ADULT_TICKET_PRICE = 15000;  // 성인 가격
    private static final int OLD_TICKET_PRICE = 8000;    // 노인 가격
    private static final int DISABLED_TICKET_PRICE = 5000; // 장애인 가격

    public MovieService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public List<Movie> getMoviesByTime(Date movieCalendar, LocalTime movieTime) {
        List<Ticket> tickets = ticketRepository.findByMovieMovieCalendarAndMovieMovieTime(movieCalendar, movieTime);
        return tickets.stream()
                .map(Ticket::getMovie)  // Ticket에서 Movie를 추출
                .distinct()  // 중복된 영화가 있을 경우 제거
                .collect(Collectors.toList());
    }

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
            response.setMovieGrade(movie.getMovieGrade());
            response.setMovieTime(movie.getMovieTime());  // LocalTime 사용
            response.setMovieSeatRemain(movie.getMovieSeatRemain());
            response.setMovieTheater(movie.getMovieTheater());
            return response;
        }).collect(Collectors.toList());
    }

    // 영화 시간과 극장 정보 업데이트
        public boolean updateMovieTime(UUID movieId, LocalTime movieTime, String movieTheater) {
            // 영화 ID로 Movie 객체를 조회
            Optional<Movie> movieOptional = movieRepository.findById(movieId);
            if (movieOptional.isEmpty()) {
                return false;  // 영화 정보가 없으면 false 반환
            }

            Movie movie = movieOptional.get();

            // 해당 영화와 관련된 모든 티켓 조회
            List<Ticket> tickets = ticketRepository.findByMovie(movie);
            if (tickets.isEmpty()) {
                // 티켓이 없다면 새로 생성
                Ticket newTicket = createNewTicket(movie, movieTime, movieTheater);
                ticketRepository.save(newTicket);  // 새 티켓 저장
            } else {
                // 기존 티켓은 업데이트하지 않음 (필요한 경우 업데이트 가능)
                for (Ticket ticket : tickets) {
                    ticket.setMovieTime(movieTime);
                    ticket.setMovieTheater(movieTheater);
                    ticketRepository.save(ticket);  // 각 티켓 저장
                }
            }

            return true;
        }

    private Ticket createNewTicket(Movie movie, LocalTime movieTime, String movieTheater) {
        Ticket ticket = new Ticket();
        ticket.setMovie(movie);
        ticket.setMovieTime(movieTime);
        ticket.setMovieTheater(movieTheater);

        return ticket;
    }

    // 영화에 해당하는 티켓 정보 업데이트
    private void updateTicketsForMovie(Movie movie) {
        List<Ticket> tickets = ticketRepository.findByMovie(movie);
        for (Ticket ticket : tickets) {
            ticket.setMovieTheater(movie.getMovieTheater());
            ticket.setMovieTime(movie.getMovieTime());
            ticketRepository.save(ticket);
        }
    }

    // 영화 좌석 예약 처리 (요청된 좌석 개수만큼 감소)
    public boolean setMovieSeat(UUID movieId, String movieSeat, String movieTheater) {
        Optional<Movie> movieOptional = movieRepository.findById(movieId);
        if (movieOptional.isEmpty()) {
            return false; // 영화 정보가 없으면 실패
        }

        Movie movie = movieOptional.get();

        // 요청된 좌석 개수 확인
        int reservedCount = movieSeat.split(",").length;
        int remainingSeats = movie.getMovieSeatRemain();

        // 좌석 부족 체크
        if (remainingSeats < reservedCount) {
            return false; // 예약할 좌석 수보다 남은 좌석이 적으면 실패
        }

        // 남은 좌석 수 감소
        movie.setMovieSeatRemain(remainingSeats - reservedCount);

        // 변경된 정보 저장
        movieRepository.save(movie);

        // 해당 영화에 대한 가장 최근에 생성된 티켓 조회 (생성일자 기준 내림차순)
        Optional<Ticket> latestTicketOptional = ticketRepository.findTopByMovieOrderByCreatedAtDesc(movie);
        if (latestTicketOptional.isPresent()) {
            Ticket latestTicket = latestTicketOptional.get();

            // 기존 티켓에 좌석 정보 업데이트
            latestTicket.setMovieSeat(movieSeat);
            latestTicket.setMovieTheater(movieTheater);

            // 업데이트된 티켓 저장
            ticketRepository.save(latestTicket);
        } else {
            // 기존 티켓이 없다면 새로운 티켓을 생성하지 않음 (기존 티켓이 있어야만 업데이트)
            return false;
        }

        return true;
    }

    // 남은 좌석 수 조회
    public int getMovieSeatRemain(UUID movieId) {
        return ticketService.getMovieSeatRemain(movieId);
    }

    public boolean saveMovieCustomer(UUID movieId, int disabled, int youth, int adult, int old) {
        // TicketService의 saveCustomerTicket 호출
        return ticketService.saveCustomerTicket(movieId, disabled, youth, adult, old);
    }


    // 결제 내역 조회
    public Map<String, Object> getPaymentHistory() {
        // 결제 내역 조회
        List<Ticket> tickets = ticketRepository.findAll(); // 조건에 맞는 티켓 조회 가능

        // 응답을 위한 데이터 맵 생성
        Map<String, Object> response = new HashMap<>();

        // 총 결제 금액 초기화
        int totalPrice = 0;

        // 영화 정보와 가격 정보 목록 생성
        List<Map<String, Object>> movieHistoryList = new ArrayList<>();

        // 각 티켓에 대해 필요한 정보를 처리
        for (Ticket ticket : tickets) {
            Map<String, Object> movieHistory = new HashMap<>();

            // 영화 정보 설정
            Movie movie = ticket.getMovie(); // Ticket 객체에서 Movie 정보 가져오기
            Map<String, Object> movieInfo = new HashMap<>();
            movieInfo.put("movieId", movie.getMovieId());
            movieInfo.put("movieImage", movie.getMovieImage());
            movieInfo.put("movieName", movie.getMovieName());
            movieInfo.put("movieType", movie.getMovieType());
            movieInfo.put("movieRating", movie.getMovieRating());
            movieInfo.put("movieTime", movie.getMovieTime());
            movieInfo.put("movieSeatRemain", movie.getMovieSeatRemain());
            movieInfo.put("movieTheater", movie.getMovieTheater());
            movieInfo.put("movieGrade", movie.getMovieGrade());

            movieHistory.put("movie", movieInfo);

            // 고객 정보 설정
            Map<String, Integer> movieCustomerInfo = new HashMap<>();
            movieCustomerInfo.put("movieCustomerDisabled", ticket.getCustomerDisabled());
            movieCustomerInfo.put("movieCustomerYouth", ticket.getCustomerYouth());
            movieCustomerInfo.put("movieCustomerAdult", ticket.getCustomerAdult());
            movieCustomerInfo.put("movieCustomerOld", ticket.getCustomerOld());

            movieHistory.put("movieCustomer", movieCustomerInfo);

            // 가격 계산 (인원수 * 가격)
            int youthPrice = ticket.getCustomerYouth() * YOUTH_TICKET_PRICE;
            int adultPrice = ticket.getCustomerAdult() * ADULT_TICKET_PRICE;
            int oldPrice = ticket.getCustomerOld() * OLD_TICKET_PRICE;
            int disabledPrice = ticket.getCustomerDisabled() * DISABLED_TICKET_PRICE;

            Map<String, Integer> priceInfo = new HashMap<>();
            priceInfo.put("youthPrice", youthPrice);
            priceInfo.put("adultPrice", adultPrice);
            priceInfo.put("oldPrice", oldPrice);
            priceInfo.put("disabledPrice", disabledPrice);

            movieHistory.put("price", priceInfo);
            movieHistory.put("ticketId", ticket.getTicketId());

            // 총 금액 계산
            totalPrice += youthPrice + adultPrice + oldPrice + disabledPrice;

            movieHistoryList.add(movieHistory);
        }

        // 전체 응답에 영화 내역과 총 금액 추가
        response.put("movieHistory", movieHistoryList);
        response.put("totalPrice", totalPrice);

        return response;
    }

    // 예매 내역 확인
    public Map<String, Object> getTicketDetails(UUID ticketId) {
        Optional<Ticket> ticketOptional = ticketRepository.findById(ticketId);

        if (ticketOptional.isEmpty()) {
            return null; // 예매 정보가 없으면 null 반환
        }

        Ticket ticket = ticketOptional.get();
        Movie movie = ticket.getMovie();

        Map<String, Object> response = new HashMap<>();

        // 영화 정보
        Map<String, Object> movieInfo = new HashMap<>();
        movieInfo.put("movieId", movie.getMovieId());
        movieInfo.put("movieImage", movie.getMovieImage());
        movieInfo.put("movieName", movie.getMovieName());
        movieInfo.put("movieType", movie.getMovieType());
        movieInfo.put("movieRating", movie.getMovieRating());
        movieInfo.put("movieTime", movie.getMovieTime());
        movieInfo.put("movieSeatremain", movie.getMovieSeatRemain());
        movieInfo.put("movieTheater", movie.getMovieTheater());
        movieInfo.put("movieGrade", movie.getMovieGrade());


        response.put("movie", movieInfo);

        // 고객 정보
        Map<String, Integer> movieCustomerInfo = new HashMap<>();
        movieCustomerInfo.put("movieCustomerdisabled", ticket.getCustomerDisabled());
        movieCustomerInfo.put("movieCustomeryouth", ticket.getCustomerYouth());
        movieCustomerInfo.put("movieCustomeradult", ticket.getCustomerAdult());
        movieCustomerInfo.put("movieCustomerold", ticket.getCustomerOld());

        response.put("movieCustomer", movieCustomerInfo);

        // 티켓 정보
        response.put("ticketId", ticket.getTicketId());

        return response;
    }

}
