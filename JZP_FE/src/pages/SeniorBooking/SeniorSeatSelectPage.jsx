import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header.jsx";
import StepBar from "../../components/MovieStepBar.jsx";
import PeopleSelector from "../../components/PeopleSelector2.jsx";
import SeatSelector from "../../components/SeatSelector2.jsx";
import Modal from "../../components/Modal.jsx";
import age12Image from "../../assets/images/12.png";
import age15Image from "../../assets/images/15.png";
import age18Image from "../../assets/images/18.png";
import ageAllImage from "../../assets/images/All.png";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function SeniorSeatSelectPage() {
  const [totalSeats, setTotalSeats] = useState(0); // 선택된 인원 수
  const [selectedSeats, setSelectedSeats] = useState([]); // 선택된 좌석 배열
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [modalMessage, setModalMessage] = useState(""); // 모달 메시지
  const [isPeopleModalOpen, setIsPeopleModalOpen] = useState(true); // PeopleSelector 모달 상태
  const [movieDetails, setMovieDetails] = useState(null);

  const navigate = useNavigate();
  const storedMovieData =
    JSON.parse(localStorage.getItem("selectedMovie")) || {};
  const { movieCalendar, movieTime } = storedMovieData;

  useEffect(() => {
    if (!movieCalendar || !movieTime) {
      console.error("🚨 저장된 영화 데이터 없음, 메인으로 이동");
      navigate("/seniorMovie"); // 영화 정보가 없으면 영화 선택 페이지로 이동
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
          setMovieDetails(data[0]); // ✅ 영화 정보 저장
          console.log("🎬 불러온 영화 정보:", data[0]);
        } else {
          console.warn("⚠️ API 응답이 비어 있습니다.");
        }
      } catch (error) {
        console.error("🚨 영화 정보 불러오기 실패:", error);
      }
    };

    fetchMovieDetails();
  }, [movieCalendar, movieTime, navigate]);

  const handleConfirmPeople = (seats) => {
    setTotalSeats(seats);
    setIsPeopleModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage("");
  };

  const handleJuniorMovie = () => {
    navigate("/seniorMovie");
  };

  const handleJuniorPay = () => {
    if (totalSeats !== selectedSeats.length) {
      setModalMessage("인원 수와 좌석 수가 일치하지 않습니다!");
      setIsModalOpen(true);
    } else {
      navigate("/seniorPay");
    }
  };

  return (
    <div className="bg-customBg h-screen text-white flex flex-col relative">
      <Header />
      <StepBar prefix="senior" />
      {/* 영화 정보 */}
      <div className="bg-white text-black p-4 flex flex-col">
        {movieDetails ? (
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
                  className="w-10 h-10 mr-2"
                />
                <h2 className="text-[32px] font-bold">
                  {movieDetails.movieName}
                </h2>
              </div>
              <div className="text-[18px] mt-6">
                <p>
                  {movieDetails.movieCalendar} {movieDetails.movieTime}
                </p>
                <p className="mt-1 text-[14px]">{movieDetails.movieTheater}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-400">
            🎬 영화 정보를 불러오는 중...
          </p>
        )}
      </div>

      {/* 모달 컴포넌트 */}
      {isModalOpen && <Modal onClose={closeModal} message={modalMessage} />}
      {/* PeopleSelector 모달 */}
      {isPeopleModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg w-[30%] max-w-sm">
            <PeopleSelector
              onUpdateTotalSeats={(seats) => setTotalSeats(seats)}
              onConfirm={handleConfirmPeople} // 확인 버튼 핸들러
            />
          </div>
        </div>
      )}

      {/* SeatSelector 컴포넌트 */}
      <SeatSelector
        totalSeats={totalSeats}
        selectedSeats={selectedSeats}
        setSelectedSeats={setSelectedSeats}
      />

      <footer className="fixed bottom-0 w-[450px] bg-gray-800 flex mx-auto">
        <button
          className="flex-1 bg-buttonGray text-white text-xl font-bold h-20 flex items-center justify-center leading-none gap-2"
          onClick={handleJuniorMovie}
        >
          영화 다시 선택하기
        </button>
        <button
          className="flex-1 bg-red-600 text-white text-xl font-bold h-20 flex items-center justify-center leading-none"
          onClick={handleJuniorPay}
        >
          결제하기
        </button>
      </footer>
    </div>
  );
}

export default SeniorSeatSelectPage;
