import { useState } from "react";
import Header from "../components/header.jsx";
import { useNavigate } from "react-router-dom";
import StepBar from "../components/movieStepBar.jsx";
import DateSelectBar from "../components/DateSelectBar.jsx";
import movie1Image from "../assets/images/movie1.png";
import movie2Image from "../assets/images/movie2.png";
import movie3Image from "../assets/images/movie3.png";
import movie4Image from "../assets/images/movie4.png";
import age12Image from "../assets/images/12.png";
import age15Image from "../assets/images/15.png";
import homeIcon from "../assets/icons/homeIcon.svg";

function JuniorMovieSelectPage() {
  const [selectedButton, setSelectedButton] = useState(null);
  const navigate = useNavigate();

  const handleJuniorMain = () => {
    navigate("/juniorMain");
  };

  const handleJuniorSeatSelect = () => {
    navigate("/juniorSeat");
  };

  const times = [
    { time: "11:00  ~  12:55", seats: "93/104석", hall: "1관" },
    { time: "12:30  ~  14:25", seats: "90/104석", hall: "2관" },
    { time: "13:00  ~  14:55", seats: "93/104석", hall: "3관" },
    { time: "14:30  ~  16:25", seats: "93/104석", hall: "2관" },
    { time: "15:00  ~  16:55", seats: "93/104석", hall: "1관" },
  ];

  const wickedTimes = [
    { time: "11:00  ~  12:45", seats: "90/104석", hall: "1관" },
    { time: "12:50  ~  14:35", seats: "85/104석", hall: "2관" },
    { time: "13:00  ~  14:55", seats: "88/104석", hall: "3관" },
    { time: "15:00  ~  16:45", seats: "80/104석", hall: "2관" },
    { time: "17:00  ~  18:45", seats: "78/104석", hall: "1관" },
  ];

  const moanaTimes = [
    { time: "10:30  ~  12:15", seats: "85/100석", hall: "1관" },
    { time: "12:30  ~  14:15", seats: "80/100석", hall: "2관" },
    { time: "14:30  ~  16:15", seats: "70/100석", hall: "3관" },
  ];

  const venomTimes = [
    { time: "10:00  ~  12:20", seats: "75/104석", hall: "1관" },
    { time: "13:00  ~  15:20", seats: "70/104석", hall: "2관" },
    { time: "16:00  ~  18:20", seats: "65/104석", hall: "3관" },
  ];

  return (
    <div className="bg-customBg h-screen text-white flex flex-col">
      <Header />
      <StepBar />
      <DateSelectBar />
      <div className="h-[1px] bg-gray-700 my-4"></div>

      {/* 영화 리스트 컨테이너 */}
      <div className="flex-1 overflow-y-auto px-4 pb-16">
        <style>
          {`
      /* Chrome, Edge, Safari */
      .flex-1::-webkit-scrollbar {
        display: none;
      }
    `}
        </style>

        {/* 범죄도시 4 */}
        <div className="flex mb-6">
          <img src={movie1Image} alt="범죄도시 4" className="w-30 h-52 mr-5" />
          <div className="flex flex-col justify-between flex-1">
            <div>
              <div className="flex items-center mb-2">
                <img src={age15Image} alt="15세" className="w-8 h-8 mr-3" />
                <h3 className="text-xl font-sbAggro font-bold">범죄도시 4</h3>
              </div>
              <p className="text-sm text-gray-400">2D 디지털더빙</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {times.map((time, index) => (
                <button
                  key={`crime-${index}`}
                  onClick={() => setSelectedButton(`crime-${index}`)}
                  className={`border w-24 h-12 flex flex-col justify-center items-center ${
                    selectedButton === `crime-${index}`
                      ? "border-black bg-white text-black"
                      : "border-gray-500 text-white"
                  }`}
                >
                  <div className="text-xs font-bold leading-tight">
                    {time.time}
                  </div>
                  <div className="flex justify-between w-full text-[10px] mt-1 px-2">
                    <span>{time.seats}</span>
                    <span>{time.hall}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="h-[1px] bg-gray-700 my-4"></div>

        {/* Wicked */}
        <div className="flex mb-6">
          <img src={movie2Image} alt="Wicked" className="w-30 h-52 mr-5" />
          <div className="flex flex-col justify-between flex-1">
            <div>
              <div className="flex items-center mb-2">
                <img src={age12Image} alt="12세" className="w-8 h-8 mr-3" />
                <h3 className="text-xl font-sbAggro font-bold">WICKED</h3>
              </div>
              <p className="text-sm text-gray-400">2D 디지털더빙</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {wickedTimes.map((time, index) => (
                <button
                  key={`wicked-${index}`}
                  onClick={() => setSelectedButton(`wicked-${index}`)}
                  className={`border w-24 h-12 flex flex-col justify-center items-center ${
                    selectedButton === `wicked-${index}`
                      ? "border-black bg-white text-black"
                      : "border-gray-500 text-white"
                  }`}
                >
                  <div className="text-xs font-bold leading-tight">
                    {time.time}
                  </div>
                  <div className="flex justify-between w-full text-[10px] mt-1 px-2">
                    <span>{time.seats}</span>
                    <span>{time.hall}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="h-[1px] bg-gray-700 my-4"></div>

        {/* 모아나 2 */}
        <div className="flex mb-6">
          <img src={movie3Image} alt="모아나 2" className="w-30 h-52 mr-5" />
          <div className="flex flex-col justify-between flex-1">
            <div>
              <div className="flex items-center mb-2">
                <img src={age12Image} alt="12세" className="w-8 h-8 mr-3" />
                <h3 className="text-xl font-sbAggro font-bold">모아나 2</h3>
              </div>
              <p className="text-sm text-gray-400">2D 디지털더빙</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {moanaTimes.map((time, index) => (
                <button
                  key={`moana-${index}`}
                  onClick={() => setSelectedButton(`moana-${index}`)}
                  className={`border w-24 h-12 flex flex-col justify-center items-center ${
                    selectedButton === `moana-${index}`
                      ? "border-black bg-white text-black"
                      : "border-gray-500 text-white"
                  }`}
                >
                  <div className="text-xs font-bold leading-tight">
                    {time.time}
                  </div>
                  <div className="flex justify-between w-full text-[10px] mt-1 px-2">
                    <span>{time.seats}</span>
                    <span>{time.hall}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="h-[1px] bg-gray-700 my-4"></div>

        {/* 베놈: 라스트댄스 */}
        <div className="flex mb-6">
          <img
            src={movie4Image}
            alt="베놈: 라스트댄스"
            className="w-30 h-52 mr-5"
          />
          <div className="flex flex-col justify-between flex-1">
            <div>
              <div className="flex items-center mb-2">
                <img src={age15Image} alt="15세" className="w-8 h-8 mr-3" />
                <h3 className="text-xl font-sbAggro font-bold">
                  베놈: 라스트댄스
                </h3>
              </div>
              <p className="text-sm text-gray-400">2D 디지털더빙</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {venomTimes.map((time, index) => (
                <button
                  key={`venom-${index}`}
                  onClick={() => setSelectedButton(`venom-${index}`)}
                  className={`border w-24 h-12 flex flex-col justify-center items-center ${
                    selectedButton === `venom-${index}`
                      ? "border-black bg-white text-black"
                      : "border-gray-500 text-white"
                  }`}
                >
                  <div className="text-xs font-bold leading-tight">
                    {time.time}
                  </div>
                  <div className="flex justify-between w-full text-[10px] mt-1 px-2">
                    <span>{time.seats}</span>
                    <span>{time.hall}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <footer className="fixed bottom-0 w-[450px] bg-gray-800 flex">
        {/* 홈 버튼 */}
        <button
          className="flex-1 bg-white text-black text-sm font-bold h-16 flex items-center justify-center leading-none gap-2"
          onClick={handleJuniorMain}
        >
          <img src={homeIcon} alt="홈 아이콘" className="w-4 h-4" />홈
        </button>

        {/* 인원 및 좌석 선택 버튼 */}
        <button
          className="flex-1 bg-red-600 text-white text-sm font-bold h-16 flex items-center justify-center leading-none"
          onClick={handleJuniorSeatSelect}
        >
          인원 및 좌석 선택 하기
        </button>
      </footer>
    </div>
  );
}

export default JuniorMovieSelectPage;
