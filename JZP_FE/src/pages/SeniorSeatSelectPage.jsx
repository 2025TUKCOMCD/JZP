import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeIcon from "../assets/icons/homeIcon.svg";
import movieImage from "../assets/images/movie2.png";
import ageImage from "../assets/images/12.png";
import Header from "../components/header.jsx";
import StepBar from "../components/movieStepBar.jsx";
import PeopleSelector from "../components/PeopleSelector2.jsx";
import SeatSelector from "../components/SeatSelector2.jsx";
import Modal from "../components/Modal.jsx";

function SeniorSeatSelectPage() {
  const [totalSeats, setTotalSeats] = useState(0); // 선택된 인원 수
  const [selectedSeats, setSelectedSeats] = useState([]); // 선택된 좌석 배열
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태

  const [modalMessage, setModalMessage] = useState(""); // 모달 메시지
  const [isPeopleModalOpen, setIsPeopleModalOpen] = useState(true); // PeopleSelector 모달 상태

  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate

  const handleConfirmPeople = (seats) => {
    setTotalSeats(seats); // 선택된 인원 수 설정
    setIsPeopleModalOpen(false); // 모달 닫기
  };

  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
    setModalMessage(""); // 메시지 초기화
  };

  const handleJuniorMain = () => {
    navigate("/seniorMain");
  };

  const handleJuniorPay = () => {
    if (totalSeats !== selectedSeats.length) {
      setModalMessage("인원 수와 좌석 수가 일치하지 않습니다!");
      setIsModalOpen(true);
    } else {
      navigate("/seniorPay");
    }
  };

  return (
    <div className="bg-customBg h-screen text-white flex flex-col relative">
      <Header />
      <StepBar />
      {/* 영화 정보 */}
      <div className="bg-white text-black p-4 flex flex-col">
        <div className="flex items-start">
          <img src={movieImage} alt="Movie Poster" className="w-24 h-32 mr-4" />
          <div className="flex flex-col">
            <div className="flex items-center">
              <img src={ageImage} alt="Age Rating" className="w-10 h-10 mr-2" />
              <h2 className="text-[32px] font-bold">WICKED</h2>
            </div>
            <div className="text-[18px] mt-6">
              <p>2025.01.06 (월) 12:30 ~ 14:25</p>
              <p className="mt-1 text-[14px]">한국공대 2관</p>
            </div>
          </div>
        </div>
      </div>

      {/* 모달 컴포넌트 */}
      {isModalOpen && <Modal onClose={closeModal} message={modalMessage} />}
      {/* PeopleSelector 모달 */}
      {isPeopleModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg w-[60%] max-w-md">
            <PeopleSelector
              onUpdateTotalSeats={(seats) => setTotalSeats(seats)}
              onConfirm={handleConfirmPeople} // 확인 버튼 핸들러
            />
          </div>
        </div>
      )}

      {/* SeatSelector 컴포넌트 */}
      <SeatSelector
        totalSeats={totalSeats}
        selectedSeats={selectedSeats}
        setSelectedSeats={setSelectedSeats}
      />

      <footer className="fixed bottom-0 w-[450px] bg-gray-800 flex mx-auto">
        <button
          className="flex-1 bg-white text-black text-xl font-bold h-16 flex items-center justify-center leading-none gap-2"
          onClick={handleJuniorMain}
        >
          <img src={HomeIcon} alt="홈 아이콘" className="w-8 h-8" />홈
        </button>
        <button
          className="flex-1 bg-red-600 text-white text-xl font-bold h-16 flex items-center justify-center leading-none"
          onClick={handleJuniorPay}
        >
          결제하기
        </button>
      </footer>
    </div>
  );
}

export default SeniorSeatSelectPage;
