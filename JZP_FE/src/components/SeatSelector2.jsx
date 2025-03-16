/* eslint-disable react/prop-types */
import { useEffect } from "react";

function SeatSelector2({
  totalSeats,
  selectedSeats,
  setSelectedSeats,
  onSeatClickWithoutPeople,
  reservedSeats = [], // 예매된 좌석 리스트
  availableSeatsCount = 0,
}) {
  const rows = ["A", "B", "C", "D", "E", "F"];
  const cols = 12;

  const handleSeatClick = (row, col) => {
    if (totalSeats === 0) {
      onSeatClickWithoutPeople();
      return;
    }

    const seat = `${row}${col}`;
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else if (selectedSeats.length < totalSeats) {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  useEffect(() => {
    if (selectedSeats.length > totalSeats) {
      setSelectedSeats(selectedSeats.slice(0, totalSeats));
    }
  }, [totalSeats, selectedSeats, setSelectedSeats]);

  const getSeatStatus = (row, col) => {
    const seat = `${row}${col}`;
    if (selectedSeats.includes(seat)) return "selected";
    if (reservedSeats.includes(seat)) return "reserved";
    if (availableSeatsCount > 0) return "available";
    return "disabled";
  };

  return (
    <div className="mt-6">
      <div className="flex justify-center mb-6">
        <p className="text-[18px] text-white">
          인원 수만큼 좌석 선택 후 결제하기 버튼을 눌러주세요.
        </p>
      </div>
      <div className="text-center">
        {/* SCREEN 텍스트 */}
        <div className="w-[80%] mx-auto bg-screenGray mb-6 py-1">
          <h2 className="text-white text-[20px] font-bold">
            <span className="mr-[70px]">화</span>
            <span>면</span>
          </h2>
        </div>

        {/* 좌석 선택 영역 */}
        <div className="flex flex-col gap-4">
          {rows.map((row) => (
            <div key={row} className="flex items-center justify-center gap-4">
              {/* 왼쪽 영어 */}
              <span className="text-white font-bold">{row}</span>

              {/* 좌석 버튼 */}
              <div className="grid grid-cols-12 gap-1">
                {[...Array(cols).keys()].map((col) => {
                  const colIndex = col + 1;
                  const status = getSeatStatus(row, colIndex);
                  return (
                    <button
                      key={`${row}${colIndex}`}
                      className={`w-7 h-7 text-xs flex items-center justify-center rounded-t-md ${
                        status === "available"
                          ? "bg-white text-black"
                          : status === "reserved"
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-red-500 text-white"
                      }`}
                      onClick={() => handleSeatClick(row, colIndex)}
                      disabled={status === "reserved"}
                    >
                      {colIndex}
                    </button>
                  );
                })}
              </div>

              {/* 오른쪽 영어 */}
              <span className="text-white font-bold">{row}</span>
            </div>
          ))}
        </div>

        {/* 좌석 스타일 미리보기 */}
        <div className="mt-6 flex justify-start items-center gap-4 pl-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-500 rounded-t-md"></div>
            <span className="text-white text-sm">선택</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-500 rounded-t-md"></div>
            <span className="text-white text-sm">예매완료</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white border border-gray-500 rounded-t-md"></div>
            <span className="text-white text-sm">예매가능</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeatSelector2;
