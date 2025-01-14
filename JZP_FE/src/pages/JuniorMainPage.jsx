import "react";
import { useNavigate } from "react-router-dom";
import HomeAdd from "../assets/images/homeAdd.png";
import Header from "../components/header.jsx";
import ticketIcon from "../assets/icons/ticketIcon.svg";
import ticketPrintIcon from "../assets/icons/ticketPrintIcon.svg";

function JuniorMainPage() {
  const navigate = useNavigate();

  const handleJuniorMovieSelect = () => {
    navigate("/juniorMovie"); // 티켓 예매 페이지로 라우팅
  };

  return (
    <div className="bg-customBg h-screen text-white flex flex-col">
      <Header />

      <div className="flex justify-center">
        <img src={HomeAdd} alt="광고 이미지" className="w-full max-w-[589px]" />
      </div>

      <div className="flex flex-col items-center justify-center mt-16 text-center">
        <p className="text-2xl font-bold text-white">
          원하시는 서비스를
          <br />
          선택해주세요.
        </p>
      </div>

      {/* 버튼 섹션 */}
      <div className="flex justify-center mt-12 gap-10">
        {/* 예매 내역 출력 버튼 */}
        <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold w-[150px] h-[200px] rounded-lg flex flex-col items-center justify-center">
          <img
            src={ticketPrintIcon}
            alt="예매 내역 출력"
            className="w-20 h-20 mb-4"
          />
          <span className="text-center text-lg">예매 내역 출력</span>
        </button>

        {/* 티켓 예매 버튼 */}
        <button
          className="bg-red-600 hover:bg-red-500 text-white font-bold w-[150px] h-[200px] rounded-lg flex flex-col items-center justify-center"
          onClick={handleJuniorMovieSelect}
        >
          <img src={ticketIcon} alt="티켓 예매" className="w-20 h-20 mb-4" />
          <span className="text-center text-lg">티켓 예매</span>
        </button>
      </div>

      {/* 하단 JZP 로고 */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center">
        <div className="font-bold text-logoGray text-lg">JZP</div>
      </div>
    </div>
  );
}

export default JuniorMainPage;
