import { useState, useNavigate } from "react-router-dom";
import Header from "../../components/header.jsx";
import StepBar from "../../components/MovieStepBar.jsx";
import HomeIcon from "../../assets/icons/homeIcon.svg";
import movieImage from "../../assets/images/movie2.png";

function JuniorBookingHistoryPage() {
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();

  const handleJuniorMain = () => {
    navigate("/juniorMain");
  };

  const handleJuniorSending = () => {
    navigate("/juniorSending");
  };

  return (
    <div className="bg-customBg h-screen text-white flex flex-col overflow-visible">
      <Header />
      <StepBar prefix="junior" />

      <div className="flex-1 flex justify-center items-start pt-[35px]">
        <div
          className="flip-container w-[370px] h-[520px] cursor-pointer"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className={`flip-card ${isFlipped ? "flipped" : ""}`}>
            {/* 앞면 */}
            <div className="flip-front bg-white flex flex-col p-6 rounded-xl shadow-lg">
              <div className="flex items-start gap-4">
                <img
                  src={movieImage}
                  alt="Movie Poster"
                  className="w-30 h-60 object-cover"
                />
                <div className="flex flex-col justify-center flex-1 text-left">
                  <h2 className="text-3xl font-extrabold text-black ml-4">
                    WICKED
                  </h2>
                  <div className="mt-6 mb-1">
                    <p className="text-gray-500 text-xs font-semibold">
                      예매번호
                    </p>
                    <p className="text-black text-xs">1000-1000-1000-1000</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-semibold">
                      예매일자
                    </p>
                    <p className="text-black text-xs">2025.01.05 (월) 11:57</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-sm text-gray-600 space-y-3">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <p className="text-gray-500 text-xs">영화타입</p>
                  <p>2D 디지털 더빙</p>
                  <p className="text-gray-500 text-xs">관람등급</p>
                  <p>15세 이상 이용가</p>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-4">
                  <p className="text-gray-500 text-xs">상영관</p>
                  <p>한국공대 2관</p>
                  <p className="text-gray-500 text-xs">상영일자</p>
                  <p>2025.01.06 (월)</p>
                  <p className="text-gray-500 text-xs">상영시간</p>
                  <p>12:30 ~ 14:25</p>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-4">
                  <p className="text-gray-500 text-xs">관람인원</p>
                  <p>성인 1명, 청소년 1명</p>
                  <p className="text-gray-500 text-xs">선택좌석</p>
                  <p>D4, D5</p>
                </div>
              </div>
            </div>

            {/* 뒷면 */}
            <div className="flip-back flex justify-center items-center bg-white p-4 rounded-xl shadow-lg">
              <div className="w-full h-full flex flex-col items-center justify-center">
                <img
                  src={movieImage}
                  alt="Movie Poster"
                  className="w-[95%] h-[95%]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="fixed bottom-0 w-[450px] bg-gray-800 flex mx-auto">
        <button
          className="flex-1 bg-white text-black text-sm font-bold h-16 flex items-center justify-center leading-none gap-2"
          onClick={handleJuniorMain}
        >
          <img src={HomeIcon} alt="홈 아이콘" className="w-4 h-4" />홈
        </button>

        {/* 결제하기 버튼 */}
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
