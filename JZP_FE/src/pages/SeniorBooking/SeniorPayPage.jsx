import { useNavigate } from "react-router-dom";
import Header from "../../components/header.jsx";
import StepBar from "../../components/movieStepBar2.jsx";
import movieImage from "../../assets/images/movie2.png";
import HomeIcon from "../../assets/icons/homeIcon.svg";
import Pay from "../../components/Pay2.jsx";

function SeniorPayPage() {
  const navigate = useNavigate();

  const handleSeniorMain = () => {
    navigate("/seniorMain");
  };

  const handleSeniorSeat = () => {
    navigate("/seniorSeat");
  };

  const handlePayment = () => {
    navigate("/seniorBooking");
  };

  return (
    <div className="bg-customBg h-screen text-white flex flex-col">
      <Header />
      <StepBar />
      <div className="flex justify-center py-2">
        <div className="bg-headerColor text-white p-4 flex flex-col items-center">
          {/* 제목 */}
          <h1 className="text-3xl text-sbAggro font-bold text-center mb-4">
            WICKED
          </h1>

          {/* 영화 상세 정보 */}
          <div className="flex w-full items-center gap-4">
            {/* 왼쪽: 영화 이미지 */}
            <div className="relative w-1/2">
              <img
                src={movieImage}
                alt="Movie Poster"
                className="w-3/4 h-auto mx-auto"
              />
            </div>

            {/* 세로 디바이더 */}
            <div
              className="border-l border-textGray"
              style={{ height: "100%" }}
            ></div>

            {/* 오른쪽: 영화 정보 */}
            <div className="flex flex-col justify-start w-2/3 space-y-[28px]">
              {/* 첫 번째 그룹: 3개 */}
              <div className="flex flex-col space-y-1">
                {[
                  { label: "상영관", value: "한국공대 2관" },
                  { label: "상영일자", value: "2025.01.06 (월)" },
                  { label: "상영시간", value: "12:30 ~ 14:25" },
                ].map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <p className="font-semibold text-[16px] text-textGray mt-1">
                      {item.label}
                    </p>
                    <p className="text-[18px] font-medium mt-1">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* 두 번째 그룹: 2개 */}
              <div className="flex flex-col space-y-0.5">
                {[
                  { label: "관람인원", value: "성인 1명, 청소년 1명" },
                  { label: "선택좌석", value: "D4, D5" },
                ].map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <p className="font-semibold text-[16px] text-textGray mt-1">
                      {item.label}
                    </p>
                    <p className="text-[18px] font-medium mt-1">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-darkGray text-white rounded-lg">
        {/* 상단 디바이더 */}
        <div className="border-t border-gray-500 mt-4 mb-4"></div>

        {/* 내용 섹션 */}
        <div className="flex">
          {/* 왼쪽 텍스트 */}
          <div className="w-1/2 pr-4">
            <p className="text-center text-[22px] font-semibold mt-3 ml-4 whitespace-pre-wrap">
              결제 금액을
              <br />
              확인 해주세요.
            </p>
          </div>

          {/* 세로 점선 디바이더 */}
          <div className="border-r border-dashed border-gray-500 mr-3"></div>

          {/* 오른쪽 결제 정보 */}
          <div className="w-3/4 mr-8 py-1">
            <div className="flex justify-between mt-2">
              <span className="text-[16px] text-textGray mt-1 ml-4">성인</span>
              <span className="text-[18px]">15,000 * 1</span>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[16px] text-textGray mt-1 ml-4">
                청소년
              </span>
              <span className="text-[18px]">10,000 * 1</span>
            </div>
            <div className="flex justify-between mt-6">
              <span className="text-[18px] font-bold mt-1 ml-4">
                총 결제금액
              </span>
              <span className="text-[24px] font-bold text-red-500">
                25,000원
              </span>
            </div>
          </div>
        </div>

        {/* 하단 디바이더 */}
        <div className="border-t border-gray-500 mt-2"></div>
      </div>
      <Pay handleButtonClick={handlePayment} />
      {/* Footer 컴포넌트 */}
      <footer className="fixed bottom-0 w-[450px] bg-gray-800 flex mx-auto">
        <button
          className="flex-1 bg-white text-black text-xl font-bold h-16 flex items-center justify-center leading-none gap-2"
          onClick={handleSeniorMain}
        >
          <img src={HomeIcon} alt="홈 아이콘" className="w-8 h-8" />홈
        </button>

        {/* 결제하기 버튼 */}
        <button
          className="flex-1 bg-buttonGray text-white text-xl font-bold h-16 flex items-center justify-center leading-none"
          onClick={handleSeniorSeat}
        >
          좌석 다시 선택하기
        </button>
      </footer>
    </div>
  );
}

export default SeniorPayPage;
