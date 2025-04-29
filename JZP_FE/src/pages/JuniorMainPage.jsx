import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header.jsx";
import ticketIcon from "../assets/icons/ticketIcon.svg";
import ticketPrintIcon from "../assets/icons/ticketPrintIcon.svg";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function JuniorMainPage() {
  const navigate = useNavigate();
  const [bannerImage, setBannerImage] = useState("");

  const fetchBannerImage = async () => {
    try {
      const url = `${API_BASE_URL}/api/movie/banner`;
      console.log("📡 요청 URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.movieImage) {
        setBannerImage(data.movieImage);
      } else {
        console.warn("⚠️ API 응답이 비어 있습니다.");
      }

      console.log("🖼️ 불러온 배너 이미지:", data.movieImage);
    } catch (error) {
      console.error("🚨 배너 이미지 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchBannerImage();
  }, []);

  const handleJuniorMovieSelect = () => {
    navigate("/juniorMovie");
  };

  const handleJuniorHistorySending = () => {
    navigate("/juniorHistorySending");
  };

  return (
    <div className="bg-customBg h-screen text-white flex flex-col relative mx-auto w-[480px] min-w-[480px] max-w-[480px]">
      <Header />

      <div className="flex justify-center">
        {bannerImage ? (
          <img
            src={bannerImage}
            alt="광고 이미지"
            className="w-full max-w-[589px]"
          />
        ) : (
          <p>배너 이미지를 불러오는 중...</p>
        )}
      </div>

      <div className="flex flex-col items-center justify-center mt-16 text-center">
        <p className="text-3xl font-sbAggro font-bold text-white">
          원하시는 서비스를
          <br />
          선택해주세요.
        </p>
      </div>

      <div className="flex justify-center mt-20 gap-10">
        {" "}
        <button
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold w-[150px] h-[200px] rounded-[30px] flex flex-col items-center justify-center"
          onClick={handleJuniorHistorySending}
        >
          <img
            src={ticketPrintIcon}
            alt="예매 내역 출력"
            className="w-20 h-20 mb-4"
          />
          <span className="text-center text-lg">예매 내역 출력</span>
        </button>
        {/* 티켓 예매 버튼 */}
        <button
          className="bg-red-700 hover:bg-red-600 text-white font-bold w-[150px] h-[200px] rounded-[30px] flex flex-col items-center justify-center"
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
