import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeIcon from "../assets/icons/homeIcon.svg";
import Header from "../components/header.jsx";
import StepBar from "../components/movieStepBar.jsx";
import PeopleSelector from "../components/PeopleSelector.jsx";
import SeatSelector from "../components/SeatSelector.jsx";
import Modal from "../components/Modal.jsx";

function JuniorSeatSelectPage() {
  const [totalSeats, setTotalSeats] = useState(0); // 선택된 인원 수
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [modalMessage, setModalMessage] = useState(""); // 모달 메시지
  const [selectedSeats, setSelectedSeats] = useState([]); // 선택된 좌석 배열

  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
    setModalMessage(""); // 메시지 초기화
  };

  // 홈으로 이동
  const handleJuniorMain = () => {
    navigate("/juniorMain");
  };

  // 결제 페이지로 이동
  const handleJuniorPay = () => {
    if (totalSeats === 0 && selectedSeats.length === 0) {
      // 인원 수와 좌석 둘 다 선택되지 않은 경우
      setModalMessage("인원 수와 좌석을 선택해주세요!");
      setIsModalOpen(true);
    } else if (totalSeats > 0 && selectedSeats.length === 0) {
      // 인원 수만 선택되고 좌석이 선택되지 않은 경우
      setModalMessage("좌석을 선택해주세요!");
      setIsModalOpen(true);
    } else if (totalSeats !== selectedSeats.length) {
      // 인원 수와 선택된 좌석 수가 일치하지 않는 경우
      setModalMessage("인원 수와 좌석 수가 일치하지 않습니다!");
      setIsModalOpen(true);
    } else {
      // 모든 조건을 충족하면 결제 페이지로 이동
      navigate("/juniorPay");
    }
  };

  return (
    <div className="bg-customBg h-screen text-white flex flex-col relative">
      {/* 상단 Header와 StepBar */}
      <Header />
      <StepBar />
      {/* PeopleSelector 컴포넌트 */}
      <PeopleSelector onUpdateTotalSeats={(seats) => setTotalSeats(seats)} />
      {/* SeatSelector 컴포넌트 */}
      <SeatSelector
        totalSeats={totalSeats}
        selectedSeats={selectedSeats}
        setSelectedSeats={setSelectedSeats}
        onSeatClickWithoutPeople={() =>
          setModalMessage("인원 수를 먼저 선택해주세요!") ||
          setIsModalOpen(true)
        }
      />
      {/* 모달 컴포넌트 */}
      {isModalOpen && <Modal onClose={closeModal} message={modalMessage} />}

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
          className="flex-1 bg-red-600 text-white text-sm font-bold h-16 flex items-center justify-center leading-none"
          onClick={handleJuniorPay}
        >
          결제하기
        </button>
      </footer>
    </div>
  );
}

export default JuniorSeatSelectPage;
