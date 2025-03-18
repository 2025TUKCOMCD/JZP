import { useState } from "react";
import DayBefore from "../assets/icons/theDayBefore.svg";
import DayAfter from "../assets/icons/theDayAfter.svg";

// eslint-disable-next-line react/prop-types
const DateSelectBar = ({ onDateChange }) => {
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
    setSelectedDate(newDate);
    onDateChange(formatDate(newDate)); // 부모 컴포넌트에 변경된 날짜 전달
  };

  return (
    <div className="flex items-center justify-center mt-1 text-white scale-90">
      {/* 왼쪽 버튼 */}
      <button
        className={`flex items-center justify-center w-12 h-12 ${
          selectedDate <= firstDate ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() =>
          handleDateChange(
            new Date(selectedDate.setDate(selectedDate.getDate() - 1)),
          )
        }
        disabled={selectedDate <= firstDate}
      >
        <img src={DayBefore} alt="Previous Day" className="w-12 h-12" />
      </button>

      {/* 날짜 표시 */}
      <div className="flex gap-4 mx-4 mt-1 justify-center">
        {dates.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col items-center justify-center p-2 rounded-[10px] cursor-pointer ${
              selectedDate.toDateString() === item.date.toDateString()
                ? "bg-red-700"
                : "bg-[#444855]"
            }`}
            onClick={() => handleDateChange(item.date)} // 날짜 선택 시 변경
          >
            <div className="text-[10px]">{`${item.formatted.split("-")[0]}.${item.formatted.split("-")[1]}`}</div>
            <div className="text-sm font-bold">
              {item.formatted.split("-")[2]}
            </div>
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
        onClick={() =>
          handleDateChange(
            new Date(selectedDate.setDate(selectedDate.getDate() + 1)),
          )
        }
        disabled={selectedDate >= lastDate}
      >
        <img src={DayAfter} alt="Next Day" className="w-12 h-12" />
      </button>
    </div>
  );
};

export default DateSelectBar;
