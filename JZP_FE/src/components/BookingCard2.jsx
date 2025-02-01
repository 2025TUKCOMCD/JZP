import { useState } from "react";
import movieImage from "../assets/images/movie2.png";

const BookingCard2 = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="flip-container w-[370px] h-[520px] cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`flip-card ${isFlipped ? "flipped" : ""}`}>
        {/* 앞면 */}
        <div className="flip-front bg-white flex flex-col p-8 rounded-xl shadow-lg">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-black">WICKED</h2>
          </div>

          <div className="mt-6 space-y-3">
            <div>
              <p className="text-gray-500 text-sm font-semibold">예매번호</p>
              <p className="text-black text-lg font-bold">
                1000-1000-1000-1000
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-semibold">예매일자</p>
              <p className="text-black text-lg font-bold">
                2025.01.05 (월) 11:57
              </p>
            </div>
          </div>

          <div className="mt-6 text-lg text-black space-y-4">
            <div className="grid grid-cols-2 gap-y-2">
              <p className="text-gray-500 text-sm">영화타입</p>
              <p className="font-semibold">2D 디지털 더빙</p>
              <p className="text-gray-500 text-sm">관람등급</p>
              <p className="font-semibold">15세 이상 이용가</p>
              <p className="text-gray-500 text-sm">상영관</p>
              <p className="font-semibold">한국공대 2관</p>
              <p className="text-gray-500 text-sm">상영일자</p>
              <p className="font-semibold">2025.01.06 (월)</p>
              <p className="text-gray-500 text-sm">상영시간</p>
              <p className="font-semibold">12:30 ~ 14:25</p>
              <p className="text-gray-500 text-sm">관람인원</p>
              <p className="font-semibold">성인 1명, 청소년 1명</p>
              <p className="text-gray-500 text-sm">선택좌석</p>
              <p className="font-semibold">D4, D5</p>
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
  );
};

export default BookingCard2;
