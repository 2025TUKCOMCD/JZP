import { useNavigate } from "react-router-dom";
import Header from "../../components/header.jsx";
import StepBar from "../../components/movieStepBar2.jsx";
import HomeIcon from "../../assets/icons/homeIcon.svg";
import BookingCard from "../../components/BookingCard2";

function SeniorBookingHistoryPage() {
  const navigate = useNavigate();

  const handleSeniorMain = () => {
    navigate("/seniorMain");
  };

  const handleSeniorSending = () => {
    navigate("/seniorSending");
  };

  return (
    <div className="bg-customBg h-screen text-white flex flex-col">
      <Header />
      <StepBar />

      <div className="flex-1 flex justify-center items-start pt-[35px]">
        <BookingCard />
      </div>

      <footer className="fixed bottom-0 w-[450px] bg-gray-800 flex mx-auto">
        <button
          className="flex-1 bg-white text-black text-xl font-bold h-16 flex items-center justify-center leading-none gap-2"
          onClick={handleSeniorMain}
        >
          <img src={HomeIcon} alt="홈 아이콘" className="w-8 h-8" />홈
        </button>
        <button
          className="flex-1 bg-buttonGray text-white text-xl font-bold h-16 flex items-center justify-center leading-none"
          onClick={handleSeniorSending}
        >
          예매 내역 전송하기
        </button>
      </footer>
    </div>
  );
}

export default SeniorBookingHistoryPage;
