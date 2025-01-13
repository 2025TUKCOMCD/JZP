import { useState, useEffect } from "react";

function Header() {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
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
      const formattedTime = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")} ${days[now.getDay()]} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")} pm`;
      setCurrentTime(formattedTime);
    }, 1000); // 1초마다 업데이트
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-16 bg-headerColor flex items-center justify-between px-4 text-white md:px-8 lg:h-20">
      {/* 로고 영역 */}
      <div className="font-bold text-lg md:text-xl lg:text-2xl">JZP</div>

      {/* 시간 표시 영역 */}
      <div className="text-sm md:text-base lg:text-lg truncate">
        {currentTime}
      </div>
    </div>
  );
}

export default Header;
