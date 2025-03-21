import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../../components/header.jsx";
import StepBar from "../../components/MovieStepBar.jsx";
import HomeIcon from "../../assets/icons/homeIcon.svg";
import Pay from "../../components/Pay.jsx";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function JuniorPayPage() {
  const navigate = useNavigate();
  const [movieData, setMovieData] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchMoviePaymentHistory = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/movie/payment/history`,
        );
        if (!response.ok) {
          throw new Error("데이터를 불러오는 데 실패했습니다.");
        }
        const data = await response.json();
        setMovieData(data.movieHistory[0]);
        setTotalPrice(data.totalPrice);
      } catch (error) {
        console.error("API 요청 오류:", error);
      }
    };

    fetchMoviePaymentHistory();
  }, []);

  const handleJuniorMain = () => {
    navigate("/juniorMain");
  };

  const handleJuniorSeat = () => {
    navigate("/juniorSeat");
  };

  const handlePayment = () => {
    navigate("/juniorBooking");
  };

  return (
    <div className="bg-customBg h-screen text-white flex flex-col">
      <Header />
      <StepBar prefix="junior" />

      {movieData ? (
        <>
          {/* 영화 상세 정보 */}
          <div className="flex justify-center py-2">
            <div className="bg-buttonGray text-white p-4 flex flex-col items-center">
              <h1 className="text-3xl text-sbAggro font-bold text-center mb-4">
                {movieData.movie.movieName}
              </h1>

              <div className="flex w-full items-center gap-4">
                {/* 영화 이미지 */}
                <div className="relative w-1/2">
                  <img
                    src={movieData.movie.movieImage}
                    alt="Movie Poster"
                    className="w-3/4 h-auto mx-auto"
                  />
                </div>

                <div className="border-l border-textGray"></div>

                {/* 영화 정보 */}
                <div className="flex flex-col justify-start w-1/2 space-y-[28px]">
                  {/* 첫 번째 그룹 */}
                  <div className="flex flex-col space-y-0.5">
                    {[
                      { label: "영화타입", value: movieData.movie.movieType },
                      { label: "관람등급", value: movieData.movie.movieGrade },
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <p className="font-semibold text-xs text-textGray mt-0.5">
                          {item.label}
                        </p>
                        <p className="text-[14px] font-medium">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* 두 번째 그룹 */}
                  <div className="flex flex-col space-y-0.5">
                    {[
                      { label: "상영관", value: movieData.movie.movieTheater },
                      { label: "상영일자", value: "2025.01.06 (월)" },
                      { label: "상영시간", value: movieData.movie.movieTime },
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <p className="font-semibold text-xs text-textGray mt-0.5">
                          {item.label}
                        </p>
                        <p className="text-[14px] font-medium">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* 세 번째 그룹 */}
                  <div className="flex flex-col space-y-0.5">
                    {[
                      {
                        label: "관람인원",
                        value: `성인 ${movieData.movieCustomer.movieCustomerAdult}명, 청소년 ${movieData.movieCustomer.movieCustomerYouth}명`,
                      },
                      { label: "선택좌석", value: movieData.movie.movieSeat },
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <p className="font-semibold text-xs text-textGray mt-0.5">
                          {item.label}
                        </p>
                        <p className="text-[14px] font-medium">{item.value}</p>
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
                <p className="text-center text-[14px] font-semibold mt-4 ml-4">
                  결제 금액을 확인하신 후 결제 해주세요.
                </p>
              </div>

              {/* 세로 점선 디바이더 */}
              <div className="border-r border-dashed border-gray-500 mr-4"></div>

              {/* 오른쪽 결제 정보 */}
              <div className="w-3/4 mr-8 py-1">
                {/* 성인 */}
                {movieData.movieCustomer.movieCustomerAdult > 0 && (
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-textGray mt-1 ml-4">
                      성인
                    </span>
                    <span className="text-[18px]">
                      15,000원 * {movieData.movieCustomer.movieCustomerAdult}
                    </span>
                  </div>
                )}

                {/* 청소년 */}
                {movieData.movieCustomer.movieCustomerYouth > 0 && (
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-textGray mt-1 ml-4">
                      청소년
                    </span>
                    <span className="text-[18px]">
                      10,000원 * {movieData.movieCustomer.movieCustomerYouth}
                    </span>
                  </div>
                )}

                {/* 경로 (노인) */}
                {movieData.movieCustomer.movieCustomerOld > 0 && (
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-textGray mt-1 ml-4">
                      경로
                    </span>
                    <span className="text-[18px]">
                      8,000원 * {movieData.movieCustomer.movieCustomerOld}
                    </span>
                  </div>
                )}

                {/* 장애인 */}
                {movieData.movieCustomer.movieCustomerDisabled > 0 && (
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-textGray mt-1 ml-4">
                      장애인
                    </span>
                    <span className="text-[18px]">
                      5,000원 * {movieData.movieCustomer.movieCustomerDisabled}
                    </span>
                  </div>
                )}
                <div className="flex justify-between mt-6">
                  <span className="text-[14px] font-bold mt-1 ml-4">
                    총 결제금액
                  </span>
                  <span className="text-[24px] font-bold text-red-500">
                    {totalPrice.toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>

            {/* 하단 디바이더 */}
            <div className="border-t border-gray-500 mt-2"></div>
          </div>

          <Pay handleButtonClick={handlePayment} />
        </>
      ) : (
        <p className="text-center mt-4 text-gray-400">로딩 중...</p>
      )}

      {/* Footer 컴포넌트 */}
      <footer className="fixed bottom-0 w-[450px] bg-gray-800 flex mx-auto">
        <button
          className="flex-1 bg-white text-black text-sm font-bold h-16 flex items-center justify-center leading-none gap-2"
          onClick={handleJuniorMain}
        >
          <img src={HomeIcon} alt="홈 아이콘" className="w-4 h-4" />홈
        </button>

        {/* 결제하기 버튼 */}
        <button
          className="flex-1 bg-buttonGray text-white text-sm font-bold h-16 flex items-center justify-center leading-none"
          onClick={handleJuniorSeat}
        >
          좌석 다시 선택하기
        </button>
      </footer>
    </div>
  );
}

export default JuniorPayPage;
