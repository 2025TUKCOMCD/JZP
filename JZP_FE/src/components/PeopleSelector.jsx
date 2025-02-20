import { useState } from "react";
import minusIcon from "../assets/icons/minusIcon.svg";
import plusIcon from "../assets/icons/plusIcon.svg";

// eslint-disable-next-line react/prop-types
function PeopleSelector({ onUpdateTotalSeats }) {
  const [adultCount, setAdultCount] = useState(0);
  const [teenCount, setTeenCount] = useState(0);
  const [seniorCount, setSeniorCount] = useState(0);
  const [disabledCount, setDisabledCount] = useState(0);
  const [lastSelectedCategory, setLastSelectedCategory] = useState(null);

  const maxSeats = 8; // 최대 선택 가능 인원
  const totalSeats = adultCount + teenCount + seniorCount + disabledCount;

  const handleIncrement = (type) => {
    if (totalSeats < maxSeats) {
      if (type === "adult") setAdultCount(adultCount + 1);
      if (type === "teen") setTeenCount(teenCount + 1);
      if (type === "senior") setSeniorCount(seniorCount + 1);
      if (type === "disabled") setDisabledCount(disabledCount + 1);

      setLastSelectedCategory(type);
      onUpdateTotalSeats(totalSeats + 1);
    }
  };

  const handleDecrement = (type) => {
    if (type === "adult" && adultCount > 0) setAdultCount(adultCount - 1);
    if (type === "teen" && teenCount > 0) setTeenCount(teenCount - 1);
    if (type === "senior" && seniorCount > 0) setSeniorCount(seniorCount - 1);
    if (type === "disabled" && disabledCount > 0)
      setDisabledCount(disabledCount - 1);

    setLastSelectedCategory(type);
    onUpdateTotalSeats(totalSeats - 1);
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
    <div className="bg-white text-black p-4 flex flex-col">
      {/* 인원수 조절 섹션 */}
      <div className="flex justify-start items-center gap-2 text-[12px] mt-2">
        {[
          { label: "성인", count: adultCount, type: "adult" },
          { label: "청소년", count: teenCount, type: "teen" },
          { label: "경로", count: seniorCount, type: "senior" },
          { label: "장애인", count: disabledCount, type: "disabled" },
        ].map((category) => (
          <div key={category.type} className="flex items-center gap-1">
            <span className="font-bold ml-1">{category.label}</span>
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

      <p className="text-center text-[12px] mt-3 px-4 whitespace-pre-line">
        {getNoticeMessage()}
      </p>
    </div>
  );
}

export default PeopleSelector;
