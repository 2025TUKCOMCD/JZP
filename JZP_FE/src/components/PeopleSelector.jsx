import { useState, useEffect } from "react";
import minusIcon from "../assets/icons/minusIcon.svg";
import plusIcon from "../assets/icons/plusIcon.svg";

// eslint-disable-next-line react/prop-types
function PeopleSelector({ onUpdateTotalSeats, onSave }) {
  const [adultCount, setAdultCount] = useState(0);
  const [teenCount, setTeenCount] = useState(0);
  const [seniorCount, setSeniorCount] = useState(0);
  const [disabledCount, setDisabledCount] = useState(0);
  const [lastSelectedCategory, setLastSelectedCategory] = useState(null);

  const maxSeats = 8; // 최대 선택 가능 인원
  const totalSeats = adultCount + teenCount + seniorCount + disabledCount;

  useEffect(() => {
    if (totalSeats > 0) {
      onUpdateTotalSeats(totalSeats);
    }
  }, [adultCount, teenCount, seniorCount, disabledCount, onUpdateTotalSeats]);

  useEffect(() => {
    if (totalSeats > 0) {
      onSave(adultCount, teenCount, seniorCount, disabledCount);
    }
  }, [adultCount, teenCount, seniorCount, disabledCount, onSave]);

  const handleIncrement = (type) => {
    if (totalSeats < maxSeats) {
      setLastSelectedCategory(type);

      if (type === "adult") setAdultCount((prev) => prev + 1);
      if (type === "teen") setTeenCount((prev) => prev + 1);
      if (type === "senior") setSeniorCount((prev) => prev + 1);
      if (type === "disabled") setDisabledCount((prev) => prev + 1);

      onUpdateTotalSeats((prev) => prev + 1);
    }
  };

  const handleDecrement = (type) => {
    if (totalSeats > 0) {
      setLastSelectedCategory(type);

      if (type === "adult" && adultCount > 0) setAdultCount((prev) => prev - 1);
      if (type === "teen" && teenCount > 0) setTeenCount((prev) => prev - 1);
      if (type === "senior" && seniorCount > 0)
        setSeniorCount((prev) => prev - 1);
      if (type === "disabled" && disabledCount > 0)
        setDisabledCount((prev) => prev - 1);

      onUpdateTotalSeats((prev) => prev - 1);
    }
  };

  const getNoticeMessage = () => {
    switch (lastSelectedCategory) {
      case "teen":
        return "청소년 요금은 만 4세 이상 ~ 만 19세 미만의 청소년에 한해 적용됩니다.\n※ 만 19세가 되는 해의 1월 1일부터 제외됩니다.";
      case "senior":
        return "반드시 본인의 신분증(만 65세 이상)을 소지하신 후 입장해주세요.\n미지참 시 입장이 제한됩니다.";
      case "disabled":
        return "반드시 복지카드를 소지하신 후 입장 해주세요.\n미지참 시 입장이 제한됩니다.";
      default:
        return "좌석 선택 후 결제하기 버튼을 클릭하세요.";
    }
  };

  return (
    <div className="bg-white text-black pl-4 pr-4 flex flex-col">
      <div className="flex flex-wrap justify-center items-center gap-4 text-[12px]">
        {" "}
        {[
          { label: "성인", count: adultCount, type: "adult" },
          { label: "청소년", count: teenCount, type: "teen" },
          { label: "경로", count: seniorCount, type: "senior" },
          { label: "장애인", count: disabledCount, type: "disabled" },
        ].map((category) => (
          <div key={category.type} className="flex items-center gap-1">
            <span className="font-bold mr-2">{category.label}</span>
            <div className="border border-gray-400 w-16 flex justify-between items-center px-2 py-[3px]">
              <button
                onClick={() => handleDecrement(category.type)}
                disabled={category.count === 0}
                className={`w-6 h-6 flex justify-center items-center ${
                  category.count === 0 ? "opacity-50" : ""
                }`}
              >
                <img src={minusIcon} alt="Minus" className="w-3 h-3 mr-2" />
              </button>
              <span className="text-center w-6 font-bold">
                {category.count}
              </span>
              <button
                onClick={() => handleIncrement(category.type)}
                disabled={totalSeats >= maxSeats}
                className={`w-6 h-6 flex justify-center items-center ${
                  totalSeats >= maxSeats ? "opacity-50" : ""
                }`}
              >
                <img src={plusIcon} alt="Plus" className="w-3 h-3 ml-2" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-[12px] mt-5 px-4 whitespace-pre-line h-[36px]">
        {getNoticeMessage()}
      </p>
    </div>
  );
}

export default PeopleSelector;
