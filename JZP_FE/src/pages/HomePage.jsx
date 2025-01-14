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

      <div className="flex flex-col items-center justify-center mt-16 text-center">
        <p className="text-3xl font-sbAggro font-bold text-white">
          시작을 원하시면
          <br />
          시작하기를 눌러주세요
        </p>
      </div>

      <div className="flex justify-center mt-[auto] mb-[10%]">
        <button
          className="bg-red-700 hover:bg-red-600 text-white font-bold w-[70%] max-w-[822px] h-[120px] md:h-[140px] rounded-[30px] flex items-center justify-center relative"
          onClick={handleStartClick}
        >
          <div className="flex items-center">
            <img
              src={TouchIcon}
              alt="터치 아이콘"
              className="w-[70px] h-[70px] md:w-[100px] md:h-[100px] relative ml-[-20px]" /* 아이콘 왼쪽 이동 */
            />
            <span className="font-sbAggro font-bold text-3xl md:text-5xl">
              시작하기
            </span>
          </div>
        </button>
      </div>

      {/* 하단 JZP 로고 */}
      <div className="mt-6 flex justify-center items-center mb-6">
        <div className="font-sbAggro font-bold text-logoGray text-lg">JZP</div>
      </div>
    </div>
  );
}

export default HomePage;
