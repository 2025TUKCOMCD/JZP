import { useNavigate } from "react-router-dom";
import Header from "../../components/header.jsx";
import StepBar from "../../components/MovieStepBar.jsx";
import HomeIcon from "../../assets/icons/homeIcon.svg";
import BookingCard from "../../components/BookingCard";

function JuniorBookingHistoryPage() {
  const navigate = useNavigate();

  const handleJuniorMain = () => {
    navigate("/juniorMain");
  };

  const handleJuniorSending = () => {
    navigate("/juniorSending");
  };

  return (
    <div className="bg-customBg h-screen text-white flex flex-col overflow-visible">
      <Header />
      <StepBar prefix="junior" />

      <div className="flex-1 flex justify-center items-start pt-[35px]">
        <BookingCard />
      </div>

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
          onClick={handleJuniorSending}
        >
          예매 내역 전송하기
        </button>
      </footer>
    </div>
  );
}

export default JuniorBookingHistoryPage;
