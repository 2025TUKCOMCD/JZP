import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header.jsx";
import StepBar from "../../components/MovieStepBar.jsx";
import PeopleSelector from "../../components/PeopleSelector.jsx";
import SeatSelector from "../../components/SeatSelector.jsx";
import Modal from "../../components/Modal.jsx";
import age12Image from "../../assets/images/12.png";
import age15Image from "../../assets/images/15.png";
import age18Image from "../../assets/images/18.png";
import ageAllImage from "../../assets/images/All.png";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function JuniorSeatSelectPage() {
  const [totalSeats, setTotalSeats] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [movieDetails, setMovieDetails] = useState(null);

  const navigate = useNavigate();

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage("");
  };

  const handleJuniorMovieSelect = () => {
    navigate("/juniorMovie");
  };

  const storedMovieData =
    JSON.parse(localStorage.getItem("selectedMovie")) || {};
  const { movieCalendar, movieTime } = storedMovieData;

  useEffect(() => {
    if (!movieCalendar || !movieTime) {
      console.error("🚨 저장된 영화 데이터 없음, 메인으로 이동");
      navigate("/juniorMovie");
      return;
    }

    const fetchMovieDetails = async () => {
      try {
        const url = `${API_BASE_URL}/api/movie/movietime?movieCalendar=${movieCalendar}&movieTime=${movieTime}`;
        console.log("📡 요청 URL:", url);

        const response = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.length > 0) {
          setMovieDetails(data[0]);
        } else {
          console.warn("⚠️ API 응답이 비어 있습니다.");
        }

        console.log("🎬 불러온 영화 정보:", data[0]);
      } catch (error) {
        console.error("🚨 영화 정보 불러오기 실패:", error);
      }
    };

    fetchMovieDetails();
  }, [movieCalendar, movieTime, navigate]);

  // ✅ 인원 정보 저장
  const handleSaveCustomerCount = async (adult, teen, senior, disabled) => {
    if (!movieDetails || !movieDetails.movieId) {
      console.error("🚨 영화 정보가 없습니다.");
      return;
    }

    const requestBody = {
      movieId: movieDetails.movieId,
      movieCustomerDisabled: disabled,
      movieCustomerYouth: teen,
      movieCustomerAdult: adult,
      movieCustomerOld: senior,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/movie/customer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      if (result.status === "success") {
        console.log("✅ 인원 저장 성공:", result);
      } else {
        console.error("🚨 인원 저장 실패:", result.message);
      }
    } catch (error) {
      console.error("🚨 API 요청 실패:", error);
    }
  };

  // ✅ 좌석 정보 저장
  const handleSaveSeatSelection = async () => {
    if (!movieDetails || !movieDetails.movieId) {
      console.error("🚨 영화 정보가 없습니다.");
      return;
    }

    const requestBody = {
      movieId: movieDetails.movieId, // UUID 그대로 전달
      movieName: movieDetails.movieName.trim(), // 공백 제거
      movieTime: `${movieCalendar} ${movieTime}:00`, // 'YYYY-MM-DD HH:mm:ss' 형식으로 변환
      movieSeat: selectedSeats.join(","), // 쉼표 구분 문자열로 변환
      movietheater: movieDetails.movieTheater.trim(), // 공백 제거
    };

    console.log("📡 좌석 저장 요청 데이터:", requestBody);

    try {
      const response = await fetch(`${API_BASE_URL}/api/movie/seat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const responseBody = await response.text();
      console.log("📩 서버 응답 원본:", responseBody);

      try {
        const result = JSON.parse(responseBody);
        console.log("📩 서버 응답 (파싱된 JSON):", result);

        if (result.success) {
          console.log("✅ 좌석 저장 성공:", result);
          navigate("/juniorPay");
        } else {
          console.error("🚨 좌석 저장 실패:", result.message || "응답 오류");
          setModalMessage(result.message || "좌석 저장 중 오류 발생");
          setIsModalOpen(true);
        }
      } catch (jsonParseError) {
        console.error("🚨 JSON 파싱 오류:", jsonParseError);
        console.error("📩 원본 응답:", responseBody);
        setModalMessage("서버 응답을 처리할 수 없습니다.");
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("🚨 API 요청 실패:", error);
      setModalMessage("서버와 통신 중 오류가 발생했습니다.");
      setIsModalOpen(true);
    }
  };

  const handleJuniorPay = () => {
    if (totalSeats === 0 && selectedSeats.length === 0) {
      setModalMessage("인원 수와 좌석을 선택해주세요!");
      setIsModalOpen(true);
    } else if (totalSeats > 0 && selectedSeats.length === 0) {
      setModalMessage("좌석을 선택해주세요!");
      setIsModalOpen(true);
    } else if (totalSeats !== selectedSeats.length) {
      setModalMessage("인원 수와 좌석 수가 일치하지 않습니다!");
      setIsModalOpen(true);
    } else {
      handleSaveSeatSelection(); // 좌석 저장 후 결제 페이지로 이동
    }
  };

  return (
    <div className="bg-customBg h-screen text-white flex flex-col relative">
      <Header />
      <StepBar prefix="junior" />

      {/* 영화 정보 API 연동 */}
      <div className="bg-white text-black p-4 flex flex-col">
        {movieDetails ? (
          <>
            {/* 상단 섹션 */}
            <div className="flex items-start">
              <img
                src={movieDetails.movieImage}
                alt="Movie Poster"
                className="w-24 h-32 mr-4"
              />
              <div className="flex flex-col">
                <div className="flex items-center">
                  <img
                    src={
                      parseInt(movieDetails.movieRating) >= 18
                        ? age18Image
                        : parseInt(movieDetails.movieRating) >= 15
                          ? age15Image
                          : parseInt(movieDetails.movieRating) >= 12
                            ? age12Image
                            : ageAllImage
                    }
                    alt={`${movieDetails.movieRating}세`}
                    className="w-6 h-6 mr-2"
                  />
                  <h2 className="text-xl font-sbAggro font-bold mt-1">
                    {movieDetails.movieName}
                  </h2>
                </div>
                <div className="text-[14px] ml-10">
                  <p>
                    {movieDetails.movieCalendar} {movieDetails.movieTime}
                  </p>
                  <p className="mt-1 text-[10px]">
                    {movieDetails.movieTheater}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-400">
            🎬 영화 정보를 불러오는 중...
          </p>
        )}
      </div>

      <PeopleSelector
        onUpdateTotalSeats={setTotalSeats}
        onSave={handleSaveCustomerCount}
      />

      <SeatSelector
        totalSeats={totalSeats}
        selectedSeats={selectedSeats}
        setSelectedSeats={setSelectedSeats}
        onSeatClickWithoutPeople={() => {
          setModalMessage("인원 수를 먼저 선택해주세요!");
          setIsModalOpen(true);
        }}
      />

      {isModalOpen && <Modal onClose={closeModal} message={modalMessage} />}

      <footer className="fixed bottom-0 w-[450px] bg-gray-800 flex mx-auto">
        <button
          className="flex-1 bg-buttonGray text-white text-sm font-bold h-16 flex items-center justify-center leading-none"
          onClick={handleJuniorMovieSelect}
        >
          영화 다시 선택하기
        </button>
        <button
          className="flex-1 bg-red-600 text-white text-sm font-bold h-16 flex items-center justify-center leading-none"
          onClick={handleJuniorPay}
        >
          결제하기
        </button>
      </footer>
    </div>
  );
}

export default JuniorSeatSelectPage;
