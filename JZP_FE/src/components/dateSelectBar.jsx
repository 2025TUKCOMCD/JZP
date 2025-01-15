import { useState } from "react";
import DayBefore from "../assets/icons/theDayBefore.svg";
import DayAfter from "../assets/icons/theDayAfter.svg";

const DateSelectBar = () => {
  const today = new Date(); // 오늘 날짜
  const [selectedDate, setSelectedDate] = useState(today);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return { year, month, day };
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
  const lastDate = dates[dates.length - 2].date; // 19일 날짜
  const firstDate = dates[0].date; // 15일 날짜

  const handleLeftClick = () => {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() - 1);
      return newDate;
    });
  };

  const handleRightClick = () => {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + 1);
      return newDate;
    });
  };

  return (
    <div className="flex items-center justify-center mt-1 text-white scale-90">
      {/* 왼쪽 버튼 */}
      <button
        className={`flex items-center justify-center w-12 h-12 ${
          selectedDate <= firstDate ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={selectedDate > firstDate ? handleLeftClick : undefined}
        disabled={selectedDate <= firstDate}
      >
        <img src={DayBefore} alt="Previous Day" className="w-12 h-12" />
      </button>

      {/* 날짜 표시 */}
      <div className="flex gap-4 mx-4 mt-1 justify-center">
        {dates.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col items-center justify-center p-2 rounded-[10px] ${
              selectedDate.toDateString() === item.date.toDateString()
                ? "bg-red-700"
                : "bg-[#444855]"
            }`}
          >
            <div className="text-[10px]">{`${item.formatted.year}.${item.formatted.month}`}</div>
            <div className="text-sm font-bold">{item.formatted.day}</div>
            <div className="text-[10px]">
              {today.toDateString() === item.date.toDateString()
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
        className={`flex items-center justify-center w-12 h-12 ${
          selectedDate >= lastDate ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={selectedDate < lastDate ? handleRightClick : undefined}
        disabled={selectedDate >= lastDate}
      >
        <img src={DayAfter} alt="Next Day" className="w-12 h-12" />
      </button>
    </div>
  );
};

export default DateSelectBar;
