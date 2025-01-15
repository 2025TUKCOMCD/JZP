import { useState } from "react";
import movieImage from "../assets/images/movie2.png";
import ageImage from "../assets/images/12.png";
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
      onUpdateTotalSeats(totalSeats + 1); // 부모 컴포넌트로 전달
    }
  };

  const handleDecrement = (type) => {
    if (type === "adult" && adultCount > 0) setAdultCount(adultCount - 1);
    if (type === "teen" && teenCount > 0) setTeenCount(teenCount - 1);
    if (type === "senior" && seniorCount > 0) setSeniorCount(seniorCount - 1);
    if (type === "disabled" && disabledCount > 0)
      setDisabledCount(disabledCount - 1);

    setLastSelectedCategory(type);
    onUpdateTotalSeats(totalSeats - 1); // 부모 컴포넌트로 전달
  };

  const getNoticeMessage = () => {
    switch (lastSelectedCategory) {
      case "teen":
        return "청소년 요금은 만 4세 이상 ~ 만 19세 미만의 청소년에 한해 적용됩니다.\n※ 만 19세가 되는 해의 1월 1일을 맞이한 사람은 제외";
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
      {/* 상단 섹션 */}
      <div className="flex items-start mb-4">
        {/* 영화 이미지 */}
        <img src={movieImage} alt="Movie Poster" className="w-24 h-32 mr-4" />
        {/* 텍스트 섹션 */}
        <div className="flex flex-col">
          <div className="flex items-center">
            {/* 나이 이미지와 제목 */}
            <img src={ageImage} alt="Age Rating" className="w-6 h-6 mr-2" />
            <h2 className="text-xl font-sbAggro font-bold mt-1">WICKED</h2>
          </div>
          {/* 상영일, 상영시간, 상영관 */}
          <div className="text-[14px] ml-10">
            <p>2025.01.06 (월) 12:30 ~ 14:25</p>
            <p className="mt-1 text-[10px]">한국공대 2관</p>
          </div>
        </div>
      </div>
      {/* 안내 문구 */}
      <div className="flex justify-end">
        <p className="text-sm text-gray-500 mt-[-30px]">
          인원은 최대 8명까지 선택 가능합니다.
        </p>
      </div>

      {/* 디바이더 */}
      <div className="border-t border-gray-300"></div>

      {/* 인원수 조절 섹션 */}
      <div className="flex justify-start items-center gap-2 text-[12px] mt-2">
        {[
          { label: "성인", count: adultCount, type: "adult" },
          { label: "청소년", count: teenCount, type: "teen" },
          { label: "경로", count: seniorCount, type: "senior" },
          { label: "장애인", count: disabledCount, type: "disabled" },
        ].map((category) => (
          <div key={category.type} className="flex items-center gap-1">
            {/* 카테고리 라벨 */}
            <span className="font-bold ml-1">{category.label}</span>

            {/* 카운터 영역 */}
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
