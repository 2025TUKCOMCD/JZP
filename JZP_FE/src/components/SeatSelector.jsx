/* eslint-disable react/prop-types */
import { useEffect } from "react";

function SeatSelector({
  totalSeats,
  selectedSeats,
  setSelectedSeats,
  onSeatClickWithoutPeople,
  reservedSeats = [],
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
    <div className="mt-8">
      <div className="text-center">
        <div className="w-[60%] mx-auto bg-gray-500 mb-12 py-1">
          <h2 className="text-white text-sm font-bold tracking-widest">
            S C R E E N
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {rows.map((row) => (
            <div key={row} className="flex items-center justify-center gap-3">
              <span className="text-white font-bold">{row}</span>

              <div className="grid grid-cols-12 gap-1">
                {[...Array(cols).keys()].map((col) => {
                  const colIndex = col + 1;
                  const status = getSeatStatus(row, colIndex);
                  return (
                    <button
                      key={`${row}${colIndex}`}
                      className={`w-6 h-6 text-xs flex items-center justify-center rounded-t-md ${
                        status === "selected"
                          ? "bg-red-500 text-white"
                          : status === "reserved"
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-white text-black"
                      }`}
                      onClick={() => handleSeatClick(row, colIndex)}
                      disabled={status === "reserved"}
                    >
                      {colIndex}
                    </button>
                  );
                })}
              </div>

              <span className="text-white font-bold">{row}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-start items-center gap-4 pl-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-500 rounded-t-md"></div>
            <span className="text-white text-sm">선택</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-500 rounded-t-md"></div>
            <span className="text-white text-sm">예매 완료</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white border border-gray-500 rounded-t-md"></div>
            <span className="text-white text-sm">예매 가능</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeatSelector;
