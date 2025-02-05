import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header.jsx";
import StepBar from "../components/movieStepBar.jsx";
import PeopleSelector from "../components/PeopleSelector.jsx";
import SeatSelector from "../components/SeatSelector.jsx";
import Modal from "../components/Modal.jsx";
import age12Image from "../assets/images/12.png";
import age15Image from "../assets/images/15.png";
import age18Image from "../assets/images/18.png";
import ageAllImage from "../assets/images/All.png";

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
      navigate("/juniorPay");
    }
  };

  // ✅ `localStorage`에서 가져오기 (저장 X)
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

  return (
    <div className="bg-customBg h-screen text-white flex flex-col relative">
      <Header />
      <StepBar />

      {/* 영화 정보 API 연동 */}
      <div className="bg-white text-black p-4 flex flex-col">
        {movieDetails ? (
          <>
            {/* 상단 섹션 */}
            <div className="flex items-start mb-4">
              {/* 영화 이미지 */}
              <img
                src={movieDetails.movieImage}
                alt="Movie Poster"
                className="w-24 h-32 mr-4"
              />
              {/* 텍스트 섹션 */}
              <div className="flex flex-col">
                <div className="flex items-center">
                  {/* 영화 등급 이미지 */}
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

                  {/* 영화 제목 */}
                  <h2 className="text-xl font-sbAggro font-bold mt-1">
                    {movieDetails.movieName}
                  </h2>
                </div>
                {/* 상영일, 상영시간, 상영관 */}
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

        {/* 안내 문구 */}
        <div className="flex justify-end">
          <p className="text-sm text-gray-500 mt-[-30px]">
            인원은 최대 8명까지 선택 가능합니다.
          </p>
        </div>
      </div>

      <div className="border-t border-gray-300 mt-[-20px]"></div>

      <PeopleSelector onUpdateTotalSeats={setTotalSeats} />

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
