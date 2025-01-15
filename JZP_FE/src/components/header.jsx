import { useState, useEffect } from "react";

function Header() {
  const [currentTime, setCurrentTime] = useState("");

  const updateTime = () => {
    const now = new Date();
    const days = [
      "일요일",
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
    ];
    const formattedTime = `${now.getFullYear()}.${String(
      now.getMonth() + 1,
    ).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")} ${
      days[now.getDay()]
    } ${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes(),
    ).padStart(2, "0")} ${now.getHours() >= 12 ? "pm" : "am"}`;
    setCurrentTime(formattedTime);
  };

  useEffect(() => {
    // 페이지 로드 시 바로 시간을 업데이트
    updateTime();

    // 이후 1초마다 시간 업데이트
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-14 bg-headerColor flex items-center justify-between px-3 text-white md:px-6 lg:h-18">
      {/* 로고 영역 */}
      <div className="font-sbAggro font-bold mt-2 text-lg md:text-xl lg:text-2xl">
        JZP
      </div>

      {/* 시간 표시 영역 */}
      <div className="font-sbAggro font-light text-sm mt-2 md:text-base lg:text-lg truncate">
        {currentTime}
      </div>
    </div>
  );
}

export default Header;
