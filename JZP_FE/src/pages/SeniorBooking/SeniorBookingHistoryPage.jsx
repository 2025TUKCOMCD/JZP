import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header.jsx";
import StepBar from "../../components/MovieStepBar.jsx";
import HomeIcon from "../../assets/icons/homeIcon.svg";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function SeniorBookingHistoryPage() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const navigate = useNavigate();
  const ticketId = localStorage.getItem("ticketId");

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/movie/ticket?ticketId=${ticketId}`,
        );
        if (!response.ok) {
          throw new Error("예매내역을 불러오는 데 실패했습니다.");
        }

        const data = await response.json();
        console.log("응답 데이터:", data); // 응답 확인

        setBookingData(data); // ✅ 단일 객체로 처리
      } catch (error) {
        console.error("API 요청 오류:", error);
      }
    };

    fetchBookingData();
  }, []);

  const handleSeniorMain = () => {
    navigate("/seniorMain");
  };

  const handleSeniorSending = () => {
    navigate("/seniorSending");
  };

  return (
    <div className="bg-customBg h-screen text-white flex flex-col">
      <Header />
      <StepBar prefix="senior" />

      <div className="flex-1 flex justify-center items-start pt-[35px]">
        {bookingData ? (
          <div
            className="flip-container w-[370px] h-[520px] cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className={`flip-card ${isFlipped ? "flipped" : ""}`}>
              {/* 앞면 */}
              <div className="flip-front bg-white flex flex-col p-8 rounded-xl shadow-lg">
                <div className="text-center">
                  <h2 className="text-4xl font-extrabold text-black">
                    {" "}
                    {bookingData.movie.movieName}
                  </h2>
                </div>

                <div className="mt-6 space-y-3">
                  <div>
                    <p className="text-gray-500 text-sm font-semibold">
                      예매번호
                    </p>
                    <p className="text-black text-lg font-bold">
                      {bookingData.ticketId}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-semibold">
                      예매일자
                    </p>
                    <p className="text-black text-lg font-bold">
                      2025.01.05 (월) 11:57
                    </p>{" "}
                  </div>
                </div>

                <div className="mt-6 text-lg text-black space-y-4">
                  <div className="grid grid-cols-2 gap-y-2">
                    <p className="text-gray-500 text-sm">영화타입</p>
                    <p>{bookingData.movie.movieType}</p>
                    <p className="text-gray-500 text-sm">관람등급</p>
                    <p>{bookingData.movie.movieGrade}</p>
                    <p className="text-gray-500 text-sm">상영관</p>
                    <p>{bookingData.movie.movieTheater}</p>
                    <p className="text-gray-500 text-sm">상영일자</p>
                    <p className="font-semibold">2025.01.06 (월)</p>
                    <p className="text-gray-500 text-sm">상영시간</p>
                    <p>{bookingData.movie.movieTime}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-4">
                    <p className="text-gray-500 text-sm">관람인원</p>
                    <p>
                      {[
                        bookingData.movieCustomer.movieCustomerAdult > 0
                          ? `성인 ${bookingData.movieCustomer.movieCustomerAdult}명`
                          : null,
                        bookingData.movieCustomer.movieCustomerYouth > 0
                          ? `청소년 ${bookingData.movieCustomer.movieCustomerYouth}명`
                          : null,
                        bookingData.movieCustomer.movieCustomerOld > 0
                          ? `경로 ${bookingData.movieCustomer.movieCustomerOld}명`
                          : null,
                        bookingData.movieCustomer.movieCustomerDisabled > 0
                          ? `장애인 ${bookingData.movieCustomer.movieCustomerDisabled}명`
                          : null,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                    <p className="text-gray-500 text-sm">선택좌석</p>
                    <p>{bookingData.movie.movieSeat}</p>
                  </div>
                </div>
              </div>

              {/* 뒷면 */}
              <div className="flip-back flex justify-center items-center bg-white p-4 rounded-xl shadow-lg">
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <img
                    src={bookingData.movie.movieImage}
                    alt="Movie Poster"
                    className="w-[95%] h-[95%]"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-white text-lg mt-10">예매 내역이 없습니다.</div>
        )}
      </div>

      <footer className="fixed bottom-0 w-[450px] bg-gray-800 flex mx-auto">
        <button
          className="flex-1 bg-white text-black text-xl font-bold h-20 flex items-center justify-center leading-none gap-2"
          onClick={handleSeniorMain}
        >
          <img src={HomeIcon} alt="홈 아이콘" className="w-8 h-8" />홈
        </button>
        <button
          className="flex-1 bg-buttonGray text-white text-xl font-bold h-20 flex items-center justify-center leading-none"
          onClick={handleSeniorSending}
        >
          예매 내역 전송하기
        </button>
      </footer>
    </div>
  );
}

export default SeniorBookingHistoryPage;
