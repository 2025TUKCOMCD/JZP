import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header.jsx";
import TouchIcon from "../assets/icons/touchIcon.svg";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function HomePage() {
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

  const handleStartClick = async () => {
    try {
      const url = `${API_BASE_URL}/api/movie/user`;
      console.log("📡 나이 정보 요청:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // 응답이 문자열이므로 .text() 사용
      const age = await response.text();
      console.log("👤 사용자 연령대:", age);

      if (age === "아이" || age === "성인") {
        navigate("/juniormain");
      } else if (age === "노인") {
        navigate("/seniormain");
      } else {
        console.warn("⚠️ 예상치 못한 사용자 정보:", age);
      }
    } catch (error) {
      console.error("🚨 사용자 연령 정보 불러오기 실패:", error);
    }
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
          시작을 원하시면
          <br />
          시작하기를 눌러주세요
        </p>
      </div>

      <div className="flex justify-center mt-[auto] mb-[10%]">
        <button
          className="bg-red-700 hover:bg-red-600 text-white font-bold w-[70%] max-w-[822px] h-[140px] rounded-[30px] flex items-center justify-center relative"
          onClick={handleStartClick}
        >
          <div className="flex items-center">
            <img
              src={TouchIcon}
              alt="터치 아이콘"
              className="w-[100px] h-[100px] relative ml-[-20px]"
            />
            <span className="font-sbAggro font-bold text-5xl">시작하기</span>
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
