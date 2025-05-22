package com.example.jzp.service;
import com.example.jzp.model.Movie;
import com.example.jzp.controller.MovieController;
import com.example.jzp.repository.MovieRepository;
import com.example.jzp.repository.TicketRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.jzp.model.Ticket;
import org.springframework.web.client.RestTemplate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.Random;


@Service

public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private TicketRepository ticketRepository;
    private static final String[] THEATER_NAMES = {"1관", "2관", "3관", "4관"};
    private static final Random RANDOM = new Random();
    @Autowired
    private TicketService ticketService; // TicketService 사용

    private static final int YOUTH_TICKET_PRICE = 10000;  // 청소년 가격
    private static final int ADULT_TICKET_PRICE = 15000;  // 성인 가격
    private static final int OLD_TICKET_PRICE = 8000;    // 노인 가격
    private static final int DISABLED_TICKET_PRICE = 5000; // 장애인 가격
    private final String API_KEY = "23da313eaaed21538b2ebab1161a0981";
    private static final String BASE_URL = "https://api.themoviedb.org/3/movie/popular";

    public MovieService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }


    // 장르 목록을 가져와서 Map에 저장
    public Map<Integer, String> getGenreMap() {
        String url = "https://api.themoviedb.org/3/genre/movie/list?api_key=" + API_KEY + "&language=ko-KR";
        RestTemplate restTemplate = new RestTemplate();
        String response = restTemplate.getForObject(url, String.class);

        Map<Integer, String> genreMap = new HashMap<>();

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(response);
            JsonNode genresNode = rootNode.path("genres");

            for (JsonNode genreNode : genresNode) {
                int id = genreNode.path("id").asInt();
                String name = genreNode.path("name").asText();
                genreMap.put(id, name);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return genreMap;
    }

    // 영화 정보에서 장르 이름을 추출하는 메서드
    public List<String> extractGenres(JsonNode movieNode, Map<Integer, String> genreMap) {
        List<String> genres = new ArrayList<>();
        JsonNode genresNode = movieNode.path("genre_ids");

        for (JsonNode genreNode : genresNode) {
            int genreId = genreNode.asInt();
            String genreName = genreMap.get(genreId);
            if (genreName != null) {
                genres.add(genreName);
            }
        }

        return genres;
    }


    @Transactional(rollbackFor = Exception.class)
    public void saveMoviesFromTMDB() {
        Map<Integer, String> genreMap = getGenreMap();
        String url = "https://api.themoviedb.org/3/movie/popular?api_key=" + API_KEY + "&language=ko-KR&page=1";
        RestTemplate restTemplate = new RestTemplate();
        String response = restTemplate.getForObject(url, String.class);

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(response);
            JsonNode resultsNode = rootNode.path("results");
            LocalDate today = LocalDate.now();

            int rating = 1;

            for (JsonNode movieNode : resultsNode) {
                Long tmdbMovieId = movieNode.path("id").asLong();
                String title = movieNode.path("title").asText();
                String posterPath = movieNode.path("poster_path").asText();
                List<String> genres = extractGenres(movieNode, genreMap);
                boolean adult = movieNode.path("adult").asBoolean();


                String movieDetailsUrl = "https://api.themoviedb.org/3/movie/" + tmdbMovieId + "?api_key=" + API_KEY + "&language=ko-KR";
                String movieDetailsResponse = restTemplate.getForObject(movieDetailsUrl, String.class);
                JsonNode movieDetailsNode = objectMapper.readTree(movieDetailsResponse);


                int runtimeMinutes = movieDetailsNode.path("runtime").asInt(120);

                String ageRating = MovieGrade.getAgeRating(adult, genres).getCode();
                List<LocalTime> randomTimes = generateRandomTimes();

                Integer ranking = rating++;

                for (int i = 0; i < 5; i++) {
                    LocalDate movieDate = today.plusDays(i);
                    for (LocalTime time : randomTimes) {
                        String movieTimeFormatted = MovieGrade.formatMovieTime(time, runtimeMinutes);
                        Movie movie = new Movie();
                        movie.setMovieId(UUID.randomUUID());
                        movie.setTmdbMovieId(tmdbMovieId);
                        movie.setMovieName(title);
                        movie.setMovieImage("https://image.tmdb.org/t/p/w500" + posterPath);
                        movie.setMovieType(String.join(", ", genres));
                        movie.setMovieGrade(ageRating);
                        movie.setMovieTime(movieTimeFormatted); // String 값을 저장하도록 설정
                        movie.setMovieCalendar(java.sql.Date.valueOf(movieDate));
                        movie.setMovieSeatRemain(72);
                        movie.setMovieTheater(THEATER_NAMES[RANDOM.nextInt(THEATER_NAMES.length)]);
                        movie.setMovieRating(ranking);
                        movieRepository.save(movie);
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    public enum MovieGrade {
        ALL("전체 이용가", "ALL"),
        AGE_15("15세 이상", "15"),
        AGE_19("19세 이상", "19");

        private final String description;
        private final String code;

        MovieGrade(String description, String code) {
            this.description = description;
            this.code = code;
        }

        public String getCode() {
            return this.code;
        }


        public static MovieGrade getAgeRating(boolean adult, List<String> genres) {
            if (adult) {
                return AGE_19;
            }
            List<String> ageRestrictedGenres15 = List.of("로맨스", "스릴러", "공포", "범죄", "미스터리", "전쟁");
            for (String genre : genres) {
                if (ageRestrictedGenres15.contains(genre)) {
                    return AGE_15;
                }
            }
            return ALL;
        }

        public static String formatMovieTime(LocalTime startTime, int runtimeMinutes) {
            LocalTime endTime = startTime.plusMinutes(runtimeMinutes);
            return startTime.toString() + "~" + endTime.toString();
        }
    }


    private List<LocalTime> generateRandomTimes() {
        LocalTime start = LocalTime.parse("08:20", DateTimeFormatter.ofPattern("HH:mm"));
        LocalTime end = LocalTime.parse("23:55", DateTimeFormatter.ofPattern("HH:mm"));


        int startMinutes = start.getHour() * 60 + start.getMinute();
        int endMinutes = end.getHour() * 60 + end.getMinute();


        int totalMinutes = endMinutes - startMinutes;
        int totalIntervals = totalMinutes / 5;


        Set<LocalTime> randomTimesSet = new HashSet<>();
        while (randomTimesSet.size() < 4) {

            int randomOffset = RANDOM.nextInt(totalIntervals + 1) * 5;
            LocalTime randomTime = start.plusMinutes(randomOffset);
            randomTimesSet.add(randomTime);
        }

        List<LocalTime> randomTimes = new ArrayList<>(randomTimesSet);
        randomTimes.sort(Comparator.naturalOrder());

        return randomTimes;
    }


    public List<MovieController.MovieResponse> getMoviesByDate(Date movieCalendar) {

        List<Movie> movies = movieRepository.findByMovieCalendar(movieCalendar);


        Map<Long, MovieController.MovieResponse> movieMap = new HashMap<>();


        for (Movie movie : movies) {
            Long tmdbMovieId = movie.getTmdbMovieId();


            MovieController.MovieResponse response = movieMap.get(tmdbMovieId);
            if (response == null) {
                response = new MovieController.MovieResponse();
                response.setTmdbMovieId(tmdbMovieId);
                response.setMovieImage(movie.getMovieImage());
                response.setMovieName(movie.getMovieName());
                response.setMovieType(movie.getMovieType());
                response.setMovieRating(movie.getMovieRating());
                response.setMovieGrade(movie.getMovieGrade());
                response.setTimes(new ArrayList<>());
                movieMap.put(tmdbMovieId, response);
            }


            MovieController.MovieScheduleResponse scheduleResponse = new MovieController.MovieScheduleResponse();
            scheduleResponse.setMovieTime(movie.getMovieTime());
            scheduleResponse.setMovieSeatRemain(movie.getMovieSeatRemain());
            scheduleResponse.setMovieTheater(movie.getMovieTheater());

            // 각 상영 시간에 고유한 movieId를 설정
            scheduleResponse.setMovieId(movie.getMovieId()); // 각 영화 고유의 movieId 설정

            // times 리스트에 상영 시간을 추가
            response.getTimes().add(scheduleResponse);
        }

        // 그룹화된 영화들을 반환
        return new ArrayList<>(movieMap.values());
    }



    public List<Movie> getMoviesByTime(Date movieCalendar, String movieTime) {
        // movieCalendar와 movieTime을 기반으로 티켓을 찾음
        List<Ticket> tickets = ticketRepository.findByMovieMovieCalendarAndMovieMovieTime(movieCalendar, movieTime);

        return tickets.stream()
                .map(Ticket::getMovie)  // Ticket에서 Movie를 추출
                .distinct()  // 중복된 영화가 있을 경우 제거
                .collect(Collectors.toList());
    }


    // 영화 시간과 극장 정보 업데이트
        public boolean updateMovieTime(UUID movieId, String movieTime, String movieTheater) {
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

    private Ticket createNewTicket(Movie movie, String movieTime, String movieTheater) {
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

    public boolean setMovieSeat(UUID movieId, String movieSeat, String movieTheater, String movieName, String movieTime) {
        Optional<Movie> movieOptional = movieRepository.findById(movieId);
        if (movieOptional.isEmpty()) {
            return false; // 영화 정보가 없으면 실패
        }

        Movie movie = movieOptional.get();

        // 단순 문자열 비교로 변경
        if (!movie.getMovieName().equals(movieName) || !movie.getMovieTime().equals(movieTime)) {
            return false;
        }

        String currentReservedSeats = movie.getMovieSeat();
        if (currentReservedSeats == null || currentReservedSeats.isBlank()) {
            currentReservedSeats = "";  // null이면 빈 문자열로 초기화
        }
        List<String> reservedSeatsList = new ArrayList<>(Arrays.asList(currentReservedSeats.split(",")));

        String[] requestedSeats = movieSeat.split(",");
        for (String seat : requestedSeats) {
            if (reservedSeatsList.contains(seat)) {
                return false; // 이미 예약된 좌석이면 실패
            }
            reservedSeatsList.add(seat); // 새로운 좌석 추가
        }

        int reservedCount = requestedSeats.length;
        int remainingSeats = movie.getMovieSeatRemain();

        if (remainingSeats < reservedCount) {
            return false; // 좌석 부족
        }

        movie.setMovieSeatRemain(remainingSeats - reservedCount);

        // 리스트를 결합하기 전에 불필요한 공백 및 빈 요소 제거
        reservedSeatsList.removeIf(String::isEmpty);  // 빈 문자열이 있으면 제거

        // 결합된 좌석 정보 업데이트
        movie.setMovieSeat(String.join(",", reservedSeatsList));
        movieRepository.save(movie); // DB에 반영

        // 최근 티켓을 찾아서 좌석을 업데이트
        Optional<Ticket> latestTicketOptional = ticketRepository.findTopByMovieOrderByCreatedAtDesc(movie);
        if (latestTicketOptional.isPresent()) {
            Ticket latestTicket = latestTicketOptional.get();
            latestTicket.setMovieSeat(movieSeat); // 입력된 좌석 정보로 업데이트
            latestTicket.setMovieTheater(movieTheater); // 상영관 정보 업데이트
            ticketRepository.save(latestTicket); // 변경된 티켓 저장
        }

        return true;
    }


    public String getUpdatedMovieSeat(UUID movieId) {
        Optional<Movie> movieOptional = movieRepository.findById(movieId);
        if (movieOptional.isPresent()) {
            Movie movie = movieOptional.get();
            return movie.getMovieSeat();
        }
        return "";
    }




    // 남은 좌석 수 조회
    public int getMovieSeatRemain(UUID movieId) {
        return ticketService.getMovieSeatRemain(movieId);
    }

    public boolean saveMovieCustomer(UUID movieId, int disabled, int youth, int adult, int old) {
        // TicketService의 saveCustomerTicket 호출
        return ticketService.saveCustomerTicket(movieId, disabled, youth, adult, old);
    }


    // 결제 내역 조회 (가장 최근 티켓 1개만 반환)
    public Map<String, Object> getPaymentHistory() {
        // 가장 최근 생성된 티켓 조회
        Optional<Ticket> latestTicketOptional = ticketRepository.findTopByOrderByCreatedAtDesc();

        // 응답을 위한 데이터 맵 생성
        Map<String, Object> response = new HashMap<>();

        // 총 결제 금액 초기화
        int totalPrice = 0;

        // 영화 정보와 가격 정보 목록 생성
        List<Map<String, Object>> movieHistoryList = new ArrayList<>();

        // 티켓이 존재하면 처리
        if (latestTicketOptional.isPresent()) {
            Ticket ticket = latestTicketOptional.get();
            Map<String, Object> movieHistory = new HashMap<>();

            // 영화 정보 설정
            Movie movie = ticket.getMovie();
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
            String movieSeatStr = movie.getMovieSeat();
            List<String> movieSeatList = new ArrayList<>();
            if (movieSeatStr != null && !movieSeatStr.isBlank()) {
                movieSeatList = Arrays.asList(movieSeatStr.split(","));
            }
            movieInfo.put("movieSeat", movieSeatList);
            movieInfo.put("movieCalendar", movie.getMovieCalendar());

            movieHistory.put("movie", movieInfo);

            // 고객 정보 설정
            Map<String, Integer> movieCustomerInfo = new HashMap<>();
            movieCustomerInfo.put("movieCustomerDisabled", ticket.getCustomerDisabled());
            movieCustomerInfo.put("movieCustomerYouth", ticket.getCustomerYouth());
            movieCustomerInfo.put("movieCustomerAdult", ticket.getCustomerAdult());
            movieCustomerInfo.put("movieCustomerOld", ticket.getCustomerOld());

            movieHistory.put("movieCustomer", movieCustomerInfo);

            // 가격 계산
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

    public Map<String, Object> getTicketDetails(Long ticketId) {
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
        movieInfo.put("movieSeatRemain", movie.getMovieSeatRemain());
        movieInfo.put("movieTheater", movie.getMovieTheater());
        movieInfo.put("movieGrade", movie.getMovieGrade());
        movieInfo.put("movieCalendar", movie.getMovieCalendar());
        String movieSeatStr = movie.getMovieSeat();
        List<String> movieSeatList = new ArrayList<>();
        if (movieSeatStr != null && !movieSeatStr.isBlank()) {
            movieSeatList = Arrays.asList(movieSeatStr.split(","));
        }
        movieInfo.put("movieSeat", movieSeatList);
        response.put("movie", movieInfo);

        // 고객 정보
        Map<String, Integer> movieCustomerInfo = new HashMap<>();
        movieCustomerInfo.put("movieCustomerAdult", ticket.getCustomerAdult());
        movieCustomerInfo.put("movieCustomerDisabled", ticket.getCustomerDisabled());
        movieCustomerInfo.put("movieCustomerYouth", ticket.getCustomerYouth());
        movieCustomerInfo.put("movieCustomerOld", ticket.getCustomerOld());

        response.put("movieCustomer", movieCustomerInfo);

        // 티켓 정보
        response.put("ticketId", ticket.getTicketId());

        return response;
    }
    public Movie getMovieById(UUID movieId) {
        Optional<Movie> movieOptional = movieRepository.findById(movieId);  // movieId로 영화 조회
        if (movieOptional.isPresent()) {
            return movieOptional.get();  // 영화가 있으면 반환
        }
        return null;  // 영화가 없으면 null 반환
    }
}
