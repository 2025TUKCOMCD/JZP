import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header.jsx";
import StepBar from "../../components/MovieStepBar.jsx";
import HomeIcon from "../../assets/icons/homeIcon.svg";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function JuniorBookingHistoryPage() {
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

  const handleMain = () => {
    navigate("/");
  };

  const handleJuniorSending = () => {
    navigate("/juniorSending");
  };

  return (
    <div className="bg-customBg h-screen text-white flex flex-col relative mx-auto w-[560px] min-w-[560px] max-w-[560px]">
      <Header />
      <StepBar prefix="junior" />

      <div className="flip-container w-[370px] h-[520px] cursor-pointer mt-[7vh] mx-auto">
        {bookingData ? (
          <div
            className="flip-container w-[370px] h-[520px] cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className={`flip-card ${isFlipped ? "flipped" : ""}`}>
              {/* 앞면 */}
              <div className="flip-front bg-white flex flex-col p-6 rounded-xl shadow-lg">
                <div className="flex items-start gap-4">
                  <img
                    src={bookingData.movie.movieImage}
                    alt="Movie Poster"
                    className="w-30 h-60 object-cover"
                  />
                  <div className="flex flex-col justify-center flex-1 text-left">
                    <h2 className="text-xl font-extrabold text-black ml-2">
                      {bookingData.movie.movieName}
                    </h2>
                    <div className="mt-6 mb-1">
                      <p className="text-gray-500 text-xs font-semibold">
                        예매번호
                      </p>
                      <p className="text-black text-xs">
                        {bookingData.ticketId}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs font-semibold">
                        예매일자
                      </p>
                      <p className="text-black text-xs">
                        2025.01.05 (월) 11:57
                      </p>{" "}
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-sm text-gray-600 space-y-3">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <p className="text-gray-500 text-xs">영화타입</p>
                    <p>{bookingData.movie.movieType}</p>
                    <p className="text-gray-500 text-xs">관람등급</p>
                    <p>{bookingData.movie.movieGrade}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-4">
                    <p className="text-gray-500 text-xs">상영관</p>
                    <p>{bookingData.movie.movieTheater}</p>
                    <p className="text-gray-500 text-xs">상영일자</p>
                    <p className="font-semibold">2025.01.06 (월)</p>
                    <p className="text-gray-500 text-xs">상영시간</p>
                    <p>{bookingData.movie.movieTime}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-4">
                    <p className="text-gray-500 text-xs">관람인원</p>
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
                    <p className="text-gray-500 text-xs">선택좌석</p>
                    <p>{bookingData.movie.movieSeat.join(", ")}</p>
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

      <footer className="fixed bottom-0 w-[560px] bg-gray-800 flex mx-auto">
        <button
          className="flex-1 bg-white text-black text-sm font-bold h-16 flex items-center justify-center leading-none gap-2"
          onClick={handleMain}
        >
          <img src={HomeIcon} alt="홈 아이콘" className="w-4 h-4" />홈
        </button>
        <button
          className="flex-1 bg-buttonGray text-white text-sm font-bold h-16 flex items-center justify-center leading-none"
          onClick={handleJuniorSending}
        >
          예매 내역 전송하기
        </button>
      </footer>
    </div>
  );
}

export default JuniorBookingHistoryPage;
