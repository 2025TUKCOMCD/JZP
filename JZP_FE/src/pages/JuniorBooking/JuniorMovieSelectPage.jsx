import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header.jsx";
import StepBar from "../../components/MovieStepBar.jsx";
import DateSelectBar from "../../components/DateSelectBar.jsx";
import age12Image from "../../assets/images/12.png";
import age15Image from "../../assets/images/15.png";
import age18Image from "../../assets/images/18.png";
import ageAllImage from "../../assets/images/All.png";
import homeIcon from "../../assets/icons/homeIcon.svg";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function JuniorMovieSelectPage() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [movies, setMovies] = useState([]);

  // 날짜 가져오기 함수
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 초기 상태
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const navigate = useNavigate();

  const handleJuniorMain = () => navigate("/juniorMain");

  const handleSelectTime = async (time, movie) => {
    setSelectedMovie(movie);
    setSelectedTime(time);

    try {
      const requestBody = {
        movieId: time.movieId,
        movieTime: time.movieTime,
        movieTheater: time.movieTheater,
      };

      console.log(
        "📤 영화 시간 저장 요청 데이터:",
        JSON.stringify(requestBody, null, 2),
      );

      const response = await fetch(`${API_BASE_URL}/api/movie/time`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      console.log("✅ 영화 시간 저장 응답:", result);

      if (result.status !== "success") {
        console.warn("🚨 영화 시간 저장 실패:", result);
      }
    } catch (error) {
      console.error("🚨 영화 시간 저장 중 오류 발생:", error);
    }
  };

  const handleJuniorSeatSelect = async () => {
    try {
      const requestBody = {
        movieId: selectedMovie.movieId,
        movieCalendar: selectedDate,
        movieTime: selectedTime.movieTime,
        movieTheater: selectedTime.movieTheater,
      };

      console.log("📤 영화 데이터 저장:", requestBody);
      localStorage.setItem("selectedMovie", JSON.stringify(requestBody));

      navigate("/juniorSeat");
    } catch (error) {
      console.error("🚨 영화 데이터 저장 실패:", error);
    }
  };

  const fetchMovies = async (selectedDate) => {
    try {
      console.log("📅 선택한 날짜:", selectedDate);

      const response = await fetch(
        `${API_BASE_URL}/api/movie/showmovie/youth`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ movieCalendar: selectedDate }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("🎬 영화 데이터 응답:", result);

      // 각 영화의 상영 시간을 정렬 (시간 빠른 순)
      const sortedMovies = (result.movies || []).map((movie) => {
        const sortedTimes = (movie.times || []).sort((a, b) => {
          return a.movieTime.localeCompare(b.movieTime); // 문자열 시간 비교
        });
        return {
          ...movie,
          times: sortedTimes,
        };
      });

      setMovies(sortedMovies);
    } catch (error) {
      console.error("🚨 영화 목록 가져오기 실패:", error);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchMovies(selectedDate);
    }
  }, [selectedDate]);

  return (
    <div className="bg-customBg h-screen text-white flex flex-col relative mx-auto w-[480px] min-w-[480px] max-w-[480px]">
      <Header />
      <StepBar />
      <DateSelectBar onDateChange={setSelectedDate} />
      <div className="h-[1px] bg-gray-700 my-4"></div>
      <div className="flex-1 overflow-y-scroll scrollbar-hidden px-4 pb-16">
        {movies.length > 0 ? (
          movies.map((movie, index) => (
            <div key={movie.tmdbMovieId} className="mb-6">
              <div className="flex">
                <img
                  src={movie.movieImage}
                  alt={movie.movieName}
                  className="w-38 h-48 mr-5"
                />
                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center mb-2">
                      <img
                        src={
                          parseInt(movie.movieRating) >= 18
                            ? age18Image
                            : parseInt(movie.movieRating) >= 15
                              ? age15Image
                              : parseInt(movie.movieRating) >= 12
                                ? age12Image
                                : ageAllImage
                        }
                        alt={`${movie.movieRating}세`}
                        className="w-8 h-8 mr-3"
                      />
                      <h3 className="text-lg font-sbAggro font-bold">
                        {movie.movieName}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-400">{movie.movieType}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {movie.times && movie.times.length > 0 ? (
                      movie.times.map((time) => (
                        <button
                          key={time.movieId}
                          onClick={() => handleSelectTime(time, movie)}
                          className={`border w-24 h-12 flex flex-col justify-center items-center ${
                            selectedTime?.movieId === time.movieId
                              ? "border-black bg-white text-black"
                              : "border-gray-500 text-white"
                          }`}
                        >
                          <div className="text-xs font-bold leading-tight">
                            {time.movieTime}
                          </div>
                          <div className="flex justify-between w-full text-[10px] mt-1 px-3">
                            <span>{time.movieSeatRemain}석 남음</span>
                            <span>{time.movieTheater}</span>
                          </div>
                        </button>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm">
                        🎬 상영 시간이 없습니다.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {index !== movies.length - 1 && (
                <div className="h-[1px] bg-gray-700 my-4"></div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">
            🎬 현재 선택한 날짜에는 상영 영화가 없습니다.
          </p>
        )}
      </div>

      {/* 하단 버튼 */}
      <footer className="fixed bottom-0 w-[480px] bg-gray-800 flex">
        <button
          className="flex-1 bg-white text-black text-sm font-bold h-16 flex items-center justify-center leading-none gap-2"
          onClick={handleJuniorMain}
        >
          <img src={homeIcon} alt="홈 아이콘" className="w-4 h-4" />홈
        </button>
        <button
          className="flex-1 bg-red-600 text-white text-sm font-bold h-16 flex items-center justify-center leading-none"
          onClick={handleJuniorSeatSelect}
          disabled={!selectedMovie || !selectedTime}
        >
          인원 및 좌석 선택 하기
        </button>
      </footer>
    </div>
  );
}

export default JuniorMovieSelectPage;
