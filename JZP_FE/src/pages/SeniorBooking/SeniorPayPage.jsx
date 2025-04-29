import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../../components/header.jsx";
import StepBar from "../../components/MovieStepBar.jsx";
import HomeIcon from "../../assets/icons/homeIcon.svg";
import kakaopayIcon from "../../assets/images/kakaopay.png";
import cardIcon from "../../assets/images/card.png";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function SeniorPayPage() {
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

  const handleSeniorMain = () => {
    navigate("/seniorMain");
  };

  const handleSeniorSeat = () => {
    navigate("/seniorSeat");
  };

  const handlePayment = () => {
    if (!movieData?.ticketId) {
      alert("ticketId가 없습니다. 결제 정보를 다시 확인해주세요.");
      return;
    }

    localStorage.setItem("ticketId", movieData.ticketId);
    navigate("/seniorBooking");
  };

  return (
    <div className="bg-customBg h-screen text-white flex flex-col relative mx-auto w-[570px] min-w-[570px] max-w-[570px]">
      <Header />
      <StepBar prefix="senior" />

      {movieData ? (
        <>
          <div className="flex justify-center py-2">
            <div className="bg-headerColor text-white p-4 flex flex-col items-center">
              <h1 className="text-3xl text-sbAggro font-bold text-center mb-4">
                {movieData.movie.movieName}
              </h1>

              <div className="flex w-full items-center gap-4">
                <div className="relative w-1/2">
                  <img
                    src={movieData.movie.movieImage}
                    alt="Movie Poster"
                    className="w-3/4 h-auto mx-auto"
                  />
                </div>

                <div
                  className="border-l border-textGray"
                  style={{ height: "100%" }}
                ></div>

                <div className="flex flex-col justify-start w-2/3 space-y-[28px]">
                  <div className="flex flex-col space-y-1">
                    {[
                      { label: "상영관", value: movieData.movie.movieTheater },
                      { label: "상영일자", value: "2025.01.06 (월)" },
                      { label: "상영시간", value: movieData.movie.movieTime },
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <p className="font-semibold text-[16px] text-textGray mt-1">
                          {item.label}
                        </p>
                        <p className="text-[18px] font-medium mt-1">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col space-y-0.5">
                    {(movieData.movieCustomer.movieCustomerAdult > 0 ||
                      movieData.movieCustomer.movieCustomerYouth > 0 ||
                      movieData.movieCustomer.movieCustomerOld > 0 ||
                      movieData.movieCustomer.movieCustomerDisabled > 0) && (
                      <div className="flex justify-between text-sm">
                        <p className="font-semibold text-[16px] text-textGray mt-1">
                          관람인원
                        </p>
                        <p className="text-[18px] font-medium mt-1">
                          {[
                            movieData.movieCustomer.movieCustomerAdult > 0
                              ? `성인 ${movieData.movieCustomer.movieCustomerAdult}명`
                              : null,
                            movieData.movieCustomer.movieCustomerYouth > 0
                              ? `청소년 ${movieData.movieCustomer.movieCustomerYouth}명`
                              : null,
                            movieData.movieCustomer.movieCustomerOld > 0
                              ? `경로 ${movieData.movieCustomer.movieCustomerOld}명`
                              : null,
                            movieData.movieCustomer.movieCustomerDisabled > 0
                              ? `장애인 ${movieData.movieCustomer.movieCustomerDisabled}명`
                              : null,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <p className="font-semibold text-[16px] text-textGray mt-1">
                        선택좌석
                      </p>
                      <p className="text-[18px] font-medium mt-1 whitespace-nowrap">
                        {Array.isArray(movieData?.movie?.movieSeat)
                          ? movieData.movie.movieSeat.join(", ")
                          : "좌석 정보 없음"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-darkGray text-white rounded-lg">
            <div className="border-t border-gray-500 mt-4 mb-4"></div>
            <div className="flex">
              <div className="w-1/2 pr-4">
                <p className="text-center text-[22px] font-semibold mt-3 ml-4 whitespace-pre-wrap">
                  결제 금액을
                  <br />
                  확인 해주세요.
                </p>
              </div>
              <div className="border-r border-dashed border-gray-500 mr-3"></div>
              <div className="w-3/4 mr-8 py-1">
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
            <div className="border-t border-gray-500 mt-4"></div>
          </div>
          <div className="flex justify-center mt-6">
            <button
              onClick={handlePayment}
              className="flex items-center bg-customYellow text-black px-6 py-6 rounded-lg font-semibold hover:opacity-90 transition duration-300"
              style={{ width: "380px" }}
            >
              <img
                src={kakaopayIcon}
                alt="카카오페이 아이콘"
                className="w-15 h-7 mr-6"
              />
              <span className="text-sm text-kakaoPayGray font-medium mr-auto">
                마음놓고 금융하다
              </span>
              <span className="text-[16px] font-semibold">카카오페이</span>
            </button>
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={handlePayment}
              className="flex items-center bg-white text-black px-6 py-6 rounded-lg font-semibold hover:opacity-90 transition duration-300"
              style={{ width: "380px" }}
            >
              <img
                src={cardIcon}
                alt="카카오페이 아이콘"
                className="w-7 h-7 ml-4 mr-20"
              />
              <span className="text-[16px] font-semibold">카드 결제하기</span>
            </button>
          </div>{" "}
        </>
      ) : (
        <p className="text-center mt-4 text-gray-400">로딩 중...</p>
      )}
      <footer className="fixed bottom-0 w-[570px] bg-gray-800 flex mx-auto">
        <button
          className="flex-1 bg-white text-black text-xl font-bold h-20 flex items-center justify-center leading-none gap-2"
          onClick={handleSeniorMain}
        >
          <img src={HomeIcon} alt="홈 아이콘" className="w-8 h-8" />홈
        </button>

        <button
          className="flex-1 bg-buttonGray text-white text-xl font-bold h-20 flex items-center justify-center leading-none"
          onClick={handleSeniorSeat}
        >
          좌석 다시 선택하기
        </button>
      </footer>
    </div>
  );
}

export default SeniorPayPage;
