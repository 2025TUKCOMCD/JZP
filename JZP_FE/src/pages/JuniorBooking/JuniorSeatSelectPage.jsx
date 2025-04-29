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
  const [reservedSeats, setReservedSeats] = useState([]);
  const [availableSeatsCount, setAvailableSeatsCount] = useState(0);

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

          const latestSeats = data[0].movieSeat
            ? data[0].movieSeat.split(",")
            : [];
          setReservedSeats(latestSeats);
          setAvailableSeatsCount(data[0].movieSeatRemain || 0);

          console.log("🎬 불러온 영화 정보:", data[0]);
          console.log("🎫 최신 예약된 좌석:", latestSeats);
          console.log("🪑 남은 좌석 수:", data[0].movieSeatRemain);
        } else {
          console.warn("⚠️ API 응답이 비어 있습니다.");
        }
      } catch (error) {
        console.error("🚨 영화 정보 불러오기 실패:", error);
      }
    };

    fetchMovieDetails();
  }, [movieCalendar, movieTime, navigate]);

  const handleSaveCustomerCount = async (adult, teen, senior, disabled) => {
    if (!movieDetails || !movieDetails.movieId) {
      console.error("🚨 영화 정보가 없습니다. movieDetails:", movieDetails);
      return;
    }

    const requestBody = {
      movieId: movieDetails.movieId,
      movieCustomerDisabled: disabled,
      movieCustomerYouth: teen,
      movieCustomerAdult: adult,
      movieCustomerOld: senior,
    };

    console.log("📡 인원 저장 요청 데이터:", requestBody);

    try {
      const response = await fetch(`${API_BASE_URL}/api/movie/customer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      console.log("📩 API 응답:", result);

      if (result.success) {
        console.log("✅ 인원 저장 성공:", result);
      } else {
        console.error("🚨 인원 저장 실패:", result.message || "서버 응답 없음");
      }
    } catch (error) {
      console.error("🚨 API 요청 실패:", error);
    }
  };

  const handleSaveSeatSelection = async () => {
    if (!movieDetails || !movieDetails.movieId) {
      console.error("🚨 영화 정보가 없습니다.");
      setModalMessage("영화 정보를 찾을 수 없습니다.");
      setIsModalOpen(true);
      return;
    }

    if (selectedSeats.length === 0) {
      setModalMessage("좌석을 선택해주세요!");
      setIsModalOpen(true);
      return;
    }

    const reservedSeats = movieDetails.movieSeat?.split(",") || [];
    const unavailableSeats = selectedSeats.filter((seat) =>
      reservedSeats.includes(seat),
    );

    if (unavailableSeats.length > 0) {
      console.warn("🚨 예약된 좌석 선택됨:", unavailableSeats);
      setModalMessage(
        `다음 좌석은 이미 예약되었습니다: ${unavailableSeats.join(", ")}`,
      );
      setIsModalOpen(true);
      return;
    }

    const validSeats = selectedSeats.filter((seat) => seat.trim() !== "");
    if (validSeats.length === 0) {
      setModalMessage("좌석을 다시 선택해주세요.");
      setIsModalOpen(true);
      return;
    }

    const requestBody = {
      movieId: movieDetails.movieId,
      movieName: movieDetails.movieName.trim(),
      movieTime: movieTime.trim(),
      movieSeat: validSeats.join(","),
      movieTheater: movieDetails.movieTheater.trim(),
    };

    console.log(
      "📡 좌석 저장 요청 데이터:",
      JSON.stringify(requestBody, null, 2),
    );

    try {
      const response = await fetch(`${API_BASE_URL}/api/movie/seat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const responseBody = await response.json();
      console.log("📩 서버 응답:", responseBody);

      if (responseBody.success) {
        console.log("✅ 좌석 저장 성공:", responseBody);
        navigate("/juniorPay");
      } else {
        console.error("🚨 좌석 저장 실패:", responseBody.message);
        setModalMessage(responseBody.message || "좌석 저장 중 오류 발생");
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
      handleSaveSeatSelection();
    }
  };

  return (
    <div className="bg-customBg h-screen text-white flex flex-col relative mx-auto w-[570px] min-w-[570px] max-w-[570px]">
      <Header />
      <StepBar prefix="junior" />

      <div className="bg-white text-black p-4 flex flex-col">
        {movieDetails ? (
          <>
            <div className="flex items-start">
              <img
                src={movieDetails.movieImage}
                alt="Movie Poster"
                className="w-24 h-36 mr-4"
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
                  <h2 className="text-xl font-bold mt-1">
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
        reservedSeats={reservedSeats}
        availableSeatsCount={availableSeatsCount}
        onSeatClickWithoutPeople={() => {
          setModalMessage("인원 수를 먼저 선택해주세요!");
          setIsModalOpen(true);
        }}
      />

      {isModalOpen && <Modal onClose={closeModal} message={modalMessage} />}

      <footer className="fixed bottom-0 w-[570px] bg-gray-800 flex mx-auto">
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
