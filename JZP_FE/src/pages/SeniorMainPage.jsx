import "react";
import { useNavigate } from "react-router-dom";
import HomeAdd from "../assets/images/homeAdd.png";
import Header from "../components/header.jsx";
import ticketIcon from "../assets/icons/ticketIcon.svg";
import ticketPrintIcon from "../assets/icons/ticketPrintIcon.svg";

function SeniorMainPage() {
  const navigate = useNavigate();

  const handleSeniorMovieSelect = () => {
    navigate("/seniorMovie"); // 티켓 예매 페이지로 라우팅
  };

  return (
    <div className="bg-customBg h-screen text-white flex flex-col">
      <Header />

      <div className="flex flex-col items-center justify-center mt-12 text-center">
        <p className="text-3xl font-bold text-white">
          원하시는 서비스를
          <br />
          선택해주세요.
        </p>
      </div>

      {/* 버튼 섹션 */}
      <div className="flex justify-center mt-8 gap-5">
        {/* 예매 내역 출력 버튼 */}
        <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold w-[200px] h-[250px] rounded-lg flex flex-col items-center justify-between py-4">
          <img
            src={ticketPrintIcon}
            alt="예매 내역 출력"
            className="w-32 h-32 mt-6"
          />
          <span className="text-center text-3xl">예매 내역 출력</span>
        </button>

        {/* 티켓 예매 버튼 */}
        <button
          className="bg-red-600 hover:bg-red-500 text-white font-bold w-[200px] h-[250px] rounded-lg flex flex-col items-center justify-between py-4"
          onClick={handleSeniorMovieSelect}
        >
          <img
            src={ticketIcon}
            alt="티켓 예매"
            className="w-28 h-28 mt-8" // 아이콘 아래로 내림
          />
          <span className="text-center text-3xl">티켓 예매</span>
        </button>
      </div>

      <div className="flex justify-center mt-8">
        <img src={HomeAdd} alt="광고 이미지" className="w-full max-w-[589px]" />
      </div>

      {/* 하단 JZP 로고 */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center">
        <div className="font-bold text-logoGray text-lg">JZP</div>
      </div>
    </div>
  );
}

export default SeniorMainPage;
