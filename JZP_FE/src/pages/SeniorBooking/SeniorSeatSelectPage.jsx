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
  const [reservedSeats, setReservedSeats] = useState([]);
  const [availableSeatsCount, setAvailableSeatsCount] = useState(0);
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

          // ✅ 예약된 좌석 (`movieSeat`)과 남은 좌석 수 (`movieSeatRemain`) 저장
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

    console.log("📡 인원 저장 요청 데이터:", requestBody); // ✅ 요청 데이터 확인

    try {
      const response = await fetch(`${API_BASE_URL}/api/movie/customer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      console.log("📩 API 응답:", result); // ✅ API 응답 확인용

      if (result.success) {
        // ✅ 변경: "status" 대신 "success" 확인
        console.log("✅ 인원 저장 성공:", result);
      } else {
        console.error("🚨 인원 저장 실패:", result.message || "서버 응답 없음");
      }
    } catch (error) {
      console.error("🚨 API 요청 실패:", error);
    }
  };

  const handleConfirmPeople = (adult, teen, senior, disabled) => {
    setTotalSeats(adult + teen + senior + disabled);
    setIsPeopleModalOpen(false);

    // ✅ 인원 수 서버에 저장
    handleSaveCustomerCount(adult, teen, senior, disabled);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage("");
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

    // 🚨 이미 예약된 좌석 선택 방지
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

    const requestBody = {
      movieId: movieDetails.movieId,
      movieName: movieDetails.movieName.trim(),
      movieTime: movieDetails.movieTime.trim(),
      movieSeat: selectedSeats.join(","), // 선택된 좌석을 쉼표로 구분한 문자열로 변환
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
        setAvailableSeatsCount(responseBody.movieSeatRemain); // 남은 좌석 수 업데이트
        setReservedSeats([...reservedSeats, ...selectedSeats]); // 예약된 좌석 업데이트
        setSelectedSeats([]); // 선택된 좌석 초기화
        navigate("/seniorPay"); // 결제 페이지로 이동
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

  const handleSeniorMovie = () => {
    navigate("/seniorMovie");
  };

  const handleSeniorPay = () => {
    if (totalSeats !== selectedSeats.length) {
      setModalMessage("인원 수와 좌석 수가 일치하지 않습니다!");
      setIsModalOpen(true);
    } else {
      handleSaveSeatSelection();
    }
  };

  return (
    <div className="bg-customBg h-screen text-white flex flex-col relative mx-auto w-[480px] min-w-[480px] max-w-[480px]">
      <Header />
      <StepBar prefix="senior" />
      {/* 영화 정보 */}
      <div className="bg-white text-black p-4 flex flex-col">
        {movieDetails ? (
          <div className="flex items-start">
            <img
              src={movieDetails.movieImage}
              alt="Movie Poster"
              className="w-36 h-48 mr-4"
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
              <div className="text-[18px] mt-2">
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
          <div className="bg-white rounded-lg w-[450px] max-w-[480px]">
            <PeopleSelector
              onUpdateTotalSeats={(seats) => setTotalSeats(seats)}
              onConfirm={handleConfirmPeople}
            />
          </div>
        </div>
      )}

      {/* SeatSelector 컴포넌트 */}
      <SeatSelector
        totalSeats={totalSeats}
        selectedSeats={selectedSeats}
        setSelectedSeats={setSelectedSeats}
        reservedSeats={reservedSeats}
        availableSeatsCount={availableSeatsCount}
      />

      <footer className="fixed bottom-0 w-[480px] bg-gray-800 flex mx-auto">
        <button
          className="flex-1 bg-buttonGray text-white text-xl font-bold h-20 flex items-center justify-center leading-none gap-2"
          onClick={handleSeniorMovie}
        >
          영화 다시 선택하기
        </button>
        <button
          className="flex-1 bg-red-600 text-white text-xl font-bold h-20 flex items-center justify-center leading-none"
          onClick={handleSeniorPay}
        >
          결제하기
        </button>
      </footer>
    </div>
  );
}

export default SeniorSeatSelectPage;
