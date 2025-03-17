import { useState } from "react";
import { useNavigate } from "react-router-dom";
import minusIcon from "../assets/icons/minusIcon.svg";
import plusIcon from "../assets/icons/plusIcon.svg";
import closeIcon from "../assets/icons/closeIcon.svg";

// eslint-disable-next-line react/prop-types
function PeopleSelector2({ onUpdateTotalSeats, onConfirm }) {
  const navigate = useNavigate();
  const [adultCount, setAdultCount] = useState(0);
  const [teenCount, setTeenCount] = useState(0);
  const [seniorCount, setSeniorCount] = useState(0);
  const [disabledCount, setDisabledCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const maxSeats = 8;
  const totalSeats = adultCount + teenCount + seniorCount + disabledCount;

  const handleIncrement = (type) => {
    if (totalSeats < maxSeats) {
      if (type === "adult") setAdultCount(adultCount + 1);
      if (type === "teen") setTeenCount(teenCount + 1);
      if (type === "senior") setSeniorCount(seniorCount + 1);
      if (type === "disabled") setDisabledCount(disabledCount + 1);
      onUpdateTotalSeats(totalSeats + 1);
    }
  };

  const handleDecrement = (type) => {
    if (type === "adult" && adultCount > 0) setAdultCount(adultCount - 1);
    if (type === "teen" && teenCount > 0) setTeenCount(teenCount - 1);
    if (type === "senior" && seniorCount > 0) setSeniorCount(seniorCount - 1);
    if (type === "disabled" && disabledCount > 0)
      setDisabledCount(disabledCount - 1);
    onUpdateTotalSeats(totalSeats - 1);
  };

  const handleClose = () => {
    navigate("/seniorMovie");
  };

  const handleConfirm = () => {
    if (totalSeats === 0) {
      setErrorMessage("인원 수를 선택해주세요");
    } else {
      setErrorMessage("");
      onConfirm(adultCount, teenCount, seniorCount, disabledCount);
    }
  };

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-[320px] shadow-lg">
      <div className="relative mb-2">
        <h2 className="text-black text-lg font-bold text-center">
          인원 수 선택
        </h2>
        <button
          onClick={handleClose}
          className="absolute top-0 right-0 w-6 h-6 flex items-center justify-center"
        >
          <img src={closeIcon} alt="Close" className="w-full h-full" />
        </button>
      </div>

      <p
        className={`text-[12px] text-right mb-2 ${errorMessage ? "text-red-500" : "text-gray-500"}`}
      >
        {errorMessage || "인원은 최대 8명까지 선택 가능합니다."}
      </p>

      <div className="flex flex-col gap-2 mt-4">
        {[
          { label: "성인", count: adultCount, type: "adult" },
          { label: "청소년", count: teenCount, type: "teen" },
          { label: "경로", count: seniorCount, type: "senior" },
          { label: "장애인", count: disabledCount, type: "disabled" },
        ].map((category) => (
          <div
            key={category.type}
            className="flex items-center justify-between gap-4"
          >
            <span className="text-black text-[20px] font-bold ml-1">
              {category.label}
            </span>
            <div className="flex items-center justify-between border border-gray-300 px-2 py-2 w-[120px]">
              <button
                onClick={() => handleDecrement(category.type)}
                disabled={category.count === 0}
                className={`w-6 h-6 flex items-center justify-center ${category.count === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <img src={minusIcon} alt="Minus" className="w-4 h-4" />
              </button>
              <span className="text-black text-sm font-bold">
                {category.count}
              </span>
              <button
                onClick={() => handleIncrement(category.type)}
                disabled={totalSeats >= maxSeats}
                className={`w-6 h-6 flex items-center justify-center ${totalSeats >= maxSeats ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <img src={plusIcon} alt="Plus" className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button
          onClick={handleConfirm}
          className="w-full py-3 bg-buttonGray text-white text-[20px] font-bold rounded-lg"
        >
          확인
        </button>
      </div>
    </div>
  );
}

export default PeopleSelector2;
