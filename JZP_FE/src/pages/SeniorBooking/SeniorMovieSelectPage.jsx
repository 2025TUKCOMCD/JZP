import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header.jsx";
import StepBar from "../../components/MovieStepBar.jsx";
import DateSelectBar from "../../components/dateSelectBar2.jsx";
import age12Image from "../../assets/images/12.png";
import age15Image from "../../assets/images/15.png";
import age18Image from "../../assets/images/18.png";
import ageAllImage from "../../assets/images/All.png";
import homeIcon from "../../assets/icons/homeIcon.svg";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function SeniorMovieSelectPage() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [movies, setMovies] = useState([]);
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

  const handleMain = () => navigate("/");

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

  const handleSeniorSeatSelect = async () => {
    try {
      const requestBody = {
        movieId: selectedTime.movieId,
        movieCalendar: selectedDate,
        movieTime: selectedTime.movieTime,
        movieTheater: selectedTime.movieTheater,
      };

      console.log("📤 영화 데이터 저장:", requestBody);
      localStorage.setItem("selectedMovie", JSON.stringify(requestBody));

      navigate("/seniorSeat");
    } catch (error) {
      console.error("🚨 영화 데이터 저장 실패:", error);
    }
  };

  const fetchMovies = async (selectedDate) => {
    try {
      console.log("📅 선택한 날짜:", selectedDate);

      const response = await fetch(`${API_BASE_URL}/api/movie/showmovie/old`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieCalendar: selectedDate }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("🎬 영화 데이터 응답:", result);

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
    <div className="bg-customBg h-screen text-white flex flex-col relative mx-auto w-[570px] min-w-[570px] max-w-[570px]">
      <Header />
      <StepBar prefix="senior" />
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
                  className="w-52 h-68 mr-3"
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
                        className="w-10 h-10 mr-3"
                      />
                      <h3 className="text-3xl font-sbAggro font-bold">
                        {movie.movieName}
                      </h3>
                    </div>
                    <p className="text-lg text-gray-400">
                      {movie.movieType} | {movie.movieTheater}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {movie.times && movie.times.length > 0 ? (
                      movie.times.map((time) => (
                        <button
                          key={time.movieId}
                          onClick={() => handleSelectTime(time, movie)}
                          className={`border w-32 h-[66px] flex flex-col justify-center items-center ${
                            selectedTime?.movieId === time.movieId
                              ? "border-black bg-white text-black"
                              : "border-gray-500 text-white"
                          }`}
                        >
                          <div className="text-lg font-bold leading-tight">
                            {time.movieTime}
                          </div>
                          <div className="flex justify-between w-full text-[14px] mt-1 px-4">
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

      {/* 하단 네비게이션 */}
      <footer className="fixed bottom-0 w-[570px] bg-gray-800 flex">
        <button
          className="flex-1 bg-white text-black text-xl font-bold h-20 flex items-center justify-center leading-none gap-2"
          onClick={handleMain}
        >
          <img src={homeIcon} alt="홈 아이콘" className="w-8 h-8" />홈
        </button>

        <button
          className="flex-1 bg-red-600 text-white text-xl font-bold h-20 flex items-center justify-center leading-none"
          onClick={handleSeniorSeatSelect}
          disabled={!selectedMovie}
        >
          인원 및 좌석 선택 하기
        </button>
      </footer>
    </div>
  );
}

export default SeniorMovieSelectPage;
