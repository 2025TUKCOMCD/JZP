import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header.jsx";
import StepBar from "../components/movieStepBar.jsx";
import DateSelectBar from "../components/DateSelectBar.jsx";
import age12Image from "../assets/images/12.png";
import age15Image from "../assets/images/15.png";
import age18Image from "../assets/images/18.png";
import ageAllImage from "../assets/images/All.png";
import homeIcon from "../assets/icons/homeIcon.svg";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function JuniorMovieSelectPage() {
  const [selectedButton, setSelectedButton] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movies, setMovies] = useState([]);
  const [selectedDate, setSelectedDate] = useState("2025-02-20");
  const navigate = useNavigate();

  const handleJuniorMain = () => navigate("/juniorMain");

  const handleJuniorSeatSelect = async () => {
    if (!selectedMovie) {
      alert("🎬 영화를 선택해주세요!");
      return;
    }

    if (!selectedMovie.movieTime || !selectedMovie.movieTheater) {
      alert("❗ 영화 시간 또는 상영관 정보가 없습니다. 다시 선택해주세요!");
      return;
    }

    try {
      const requestBody = {
        movieId: selectedMovie.movieId,
        movieCalendar: selectedDate,
        movieTime: selectedMovie.movieTime,
        movieTheater: selectedMovie.movieTheater,
      };

      console.log("📤 영화 데이터 저장:", requestBody);

      // ✅ `localStorage`에 저장 (JuniorSeatSelectPage에서 사용할 데이터)
      localStorage.setItem("selectedMovie", JSON.stringify(requestBody));

      navigate("/juniorSeat"); // ✅ `state` 없이 이동
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
      setMovies(result.movies || []);
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
    <div className="bg-customBg h-screen text-white flex flex-col">
      <Header />
      <StepBar />
      <DateSelectBar onDateChange={setSelectedDate} />
      <div className="h-[1px] bg-gray-700 my-4"></div>
      <div className="flex-1 overflow-y-auto px-4 pb-16">
        {movies.length > 0 ? (
          movies.map((movie, index) => (
            <div key={movie.movieId}>
              <div className="flex mb-6">
                <img
                  src={movie.movieImage}
                  alt={movie.movieName}
                  className="w-30 h-52 mr-5"
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
                      <h3 className="text-xl font-sbAggro font-bold">
                        {movie.movieName}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-400">
                      {movie.movieType} | {movie.movieTheater}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <button
                      onClick={() => {
                        setSelectedButton(movie.movieId);
                        setSelectedMovie(movie);
                      }}
                      className={`border w-24 h-12 flex flex-col justify-center items-center ${
                        selectedButton === movie.movieId
                          ? "border-black bg-white text-black"
                          : "border-gray-500 text-white"
                      }`}
                    >
                      <div className="text-xs font-bold leading-tight">
                        {movie.movieTime}
                      </div>
                      <div className="flex justify-between w-full text-[10px] mt-1 px-3">
                        <span>{movie.movieSeatRemain}석 남음</span>
                        <span>{movie.movieTheater}</span>
                      </div>
                    </button>
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
      <footer className="fixed bottom-0 w-[450px] bg-gray-800 flex">
        <button
          className="flex-1 bg-white text-black text-sm font-bold h-16 flex items-center justify-center leading-none gap-2"
          onClick={handleJuniorMain}
        >
          <img src={homeIcon} alt="홈 아이콘" className="w-4 h-4" />홈
        </button>
        <button
          className="flex-1 bg-red-600 text-white text-sm font-bold h-16 flex items-center justify-center leading-none"
          onClick={handleJuniorSeatSelect}
          disabled={!selectedMovie}
        >
          인원 및 좌석 선택 하기
        </button>
      </footer>
    </div>
  );
}

export default JuniorMovieSelectPage;
