import "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header.jsx";
import HomeAdd from "../assets/images/homeAdd.png";
import TouchIcon from "../assets/icons/touchIcon.svg";

function HomePage() {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate("/juniormain");
  };

  return (
    <div className="bg-customBg h-screen text-white flex flex-col">
      <Header />

      <div className="flex justify-center">
        <img src={HomeAdd} alt="광고 이미지" className="w-full max-w-[589px]" />
      </div>

      <div className="flex flex-col items-center justify-center mt-20 text-center">
        <p className="text-2xl font-bold text-white">
          시작을 원하시면
          <br />
          시작하기를 눌러주세요
        </p>
      </div>

      <div className="flex justify-center mt-[auto] mb-[10%]">
        <button
          className="bg-customRed hover:bg-red-700 text-white font-bold w-[70%] max-w-[822px] h-[120px] md:h-[140px] rounded-[30px] flex items-center justify-start pl-6 gap-4"
          onClick={handleStartClick}
        >
          <img
            src={TouchIcon}
            alt="터치 아이콘"
            className="w-[50px] h-[50px] md:w-[80px] md:h-[80px]"
          />
          <span className="mr-3 text-xl md:text-5xl">시작하기</span>{" "}
        </button>
      </div>

      {/* 하단 JZP 로고 */}
      <div className="mt-6 flex justify-center items-center mb-6">
        <div className="font-bold text-logoGray text-lg">JZP</div>
      </div>
    </div>
  );
}

export default HomePage;
