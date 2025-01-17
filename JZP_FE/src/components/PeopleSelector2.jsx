import { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate import
import minusIcon from "../assets/icons/minusIcon.svg";
import plusIcon from "../assets/icons/plusIcon.svg";
import closeIcon from "../assets/icons/closeIcon.svg"; // 닫기 아이콘 import

// eslint-disable-next-line react/prop-types
function PeopleSelector2({ onUpdateTotalSeats, onConfirm }) {
  const navigate = useNavigate(); // useNavigate 사용
  const [adultCount, setAdultCount] = useState(0);
  const [teenCount, setTeenCount] = useState(0);
  const [seniorCount, setSeniorCount] = useState(0);
  const [disabledCount, setDisabledCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태 관리

  const maxSeats = 8; // 최대 선택 가능 인원

  const totalSeats = adultCount + teenCount + seniorCount + disabledCount;

  const handleIncrement = (type) => {
    if (totalSeats < maxSeats) {
      if (type === "adult") setAdultCount(adultCount + 1);
      if (type === "teen") setTeenCount(teenCount + 1);
      if (type === "senior") setSeniorCount(seniorCount + 1);
      if (type === "disabled") setDisabledCount(disabledCount + 1);

      onUpdateTotalSeats(totalSeats + 1); // 부모 컴포넌트로 전달
    }
  };

  const handleDecrement = (type) => {
    if (type === "adult" && adultCount > 0) setAdultCount(adultCount - 1);
    if (type === "teen" && teenCount > 0) setTeenCount(teenCount - 1);
    if (type === "senior" && seniorCount > 0) setSeniorCount(seniorCount - 1);
    if (type === "disabled" && disabledCount > 0)
      setDisabledCount(disabledCount - 1);

    onUpdateTotalSeats(totalSeats - 1); // 부모 컴포넌트로 전달
  };

  const handleClose = () => {
    navigate("/seniorMovie"); // 닫기 버튼 클릭 시 /seniorMovie로 이동
  };

  const handleConfirm = () => {
    if (totalSeats === 0) {
      // 인원 수가 선택되지 않은 경우 에러 메시지 표시
      setErrorMessage("인원 수를 선택해주세요");
    } else {
      setErrorMessage(""); // 에러 메시지 초기화
      onConfirm(totalSeats); // 부모 컴포넌트에 선택된 인원 수 전달
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
      {/* 제목과 닫기 버튼 */}
      <div className="relative mb-2">
        <h2 className="text-black text-lg font-bold text-center">
          인원 수 선택
        </h2>
        {/* 닫기 버튼 */}
        <button
          onClick={handleClose}
          className="absolute top-0 right-0 w-6 h-6 flex items-center justify-center"
        >
          <img src={closeIcon} alt="Close" className="w-full h-full" />
        </button>
      </div>

      {/* 안내 문구 */}
      <p
        className={`text-[12px] text-right mb-2 ${
          errorMessage ? "text-red-500" : "text-gray-500"
        }`}
      >
        {errorMessage || "인원은 최대 8명까지 선택 가능합니다."}
      </p>

      {/* 인원수 조절 섹션 */}
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
            {/* 카테고리 라벨 */}
            <span className="text-black text-[20px] font-bold ml-1">
              {category.label}
            </span>

            {/* 네모 박스 */}
            <div className="flex items-center justify-between border border-gray-300 px-2 py-2 w-[120px]">
              {/* - 버튼 */}
              <button
                onClick={() => handleDecrement(category.type)}
                disabled={category.count === 0}
                className={`w-6 h-6 flex items-center justify-center ${
                  category.count === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <img src={minusIcon} alt="Minus" className="w-4 h-4" />
              </button>

              {/* 인원수 */}
              <span className="text-black text-sm font-bold">
                {category.count}
              </span>

              {/* + 버튼 */}
              <button
                onClick={() => handleIncrement(category.type)}
                disabled={totalSeats >= maxSeats}
                className={`w-6 h-6 flex items-center justify-center ${
                  totalSeats >= maxSeats ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <img src={plusIcon} alt="Plus" className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 확인 버튼 */}
      <div className="mt-6">
        <button
          onClick={handleConfirm} // 확인 버튼 동작
          className="w-full py-3 bg-buttonGray text-white text-[20px] font-bold rounded-lg"
        >
          확인
        </button>
      </div>
    </div>
  );
}

export default PeopleSelector2;
