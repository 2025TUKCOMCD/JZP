import { useState } from "react";
import DayBefore from "../assets/icons/theDayBefore.svg";
import DayAfter from "../assets/icons/theDayAfter.svg";

// eslint-disable-next-line react/prop-types
const DateSelectBar2 = ({ onDateChange }) => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);

  // 날짜 포맷 변경 함수 (yyyy-MM-dd)
  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const generateDates = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return {
        date: date,
        formatted: formatDate(date),
      };
    });
  };

  const dates = generateDates();
  const lastDate = dates[dates.length - 2].date; // 마지막 날짜
  const firstDate = dates[0].date; // 첫 날짜

  const handleDateChange = (newDate) => {
    const formattedDate = formatDate(newDate);
    setSelectedDate(new Date(formattedDate)); // 날짜 업데이트
    onDateChange(formattedDate); // 부모 컴포넌트로 전달
  };

  return (
    <div className="flex items-center justify-center mt-1 text-white scale-100">
      {/* 왼쪽 버튼 */}
      <button
        className={`flex items-center justify-center w-16 h-16 ${
          selectedDate <= firstDate ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => {
          const newDate = new Date(selectedDate);
          newDate.setDate(newDate.getDate() - 1);
          handleDateChange(newDate);
        }}
        disabled={selectedDate <= firstDate}
      >
        <img src={DayBefore} alt="Previous Day" className="w-14 h-14" />
      </button>

      {/* 날짜 표시 */}
      <div className="flex gap-1 mt-1 justify-center">
        {dates.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col items-center justify-center mt-1 p-3 rounded-[18px] cursor-pointer ${
              formatDate(selectedDate) === item.formatted
                ? "bg-red-700"
                : "bg-[#444855]"
            }`}
            onClick={() => handleDateChange(item.date)}
          >
            <div className="text-[12px]">{`${item.formatted.split("-")[0]}.${item.formatted.split("-")[1]}`}</div>
            <div className="text-xl font-bold">
              {item.formatted.split("-")[2]}
            </div>
            <div className="text-[12px]">
              {formatDate(today) === item.formatted
                ? "오늘"
                : ["일", "월", "화", "수", "목", "금", "토"][
                    item.date.getDay()
                  ]}
            </div>
          </div>
        ))}
      </div>

      {/* 오른쪽 버튼 */}
      <button
        className={`flex items-center justify-center w-16 h-16 ${
          selectedDate >= lastDate ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => {
          const newDate = new Date(selectedDate);
          newDate.setDate(newDate.getDate() + 1);
          handleDateChange(newDate);
        }}
        disabled={selectedDate >= lastDate}
      >
        <img src={DayAfter} alt="Next Day" className="w-14 h-14" />
      </button>
    </div>
  );
};

export default DateSelectBar2;
