import { useNavigate } from "react-router-dom";
import Header from "../../components/header.jsx";
import StepBar from "../../components/MovieStepBar3.jsx";
import HomeAdd from "../../assets/images/homeAdd.png";

function SeniorHistoryConfirmPage() {
  const navigate = useNavigate();

  const handleMain = () => navigate("/");

  return (
    <div className="bg-customBg h-screen text-white flex flex-col relative mx-auto w-[570px] min-w-[570px] max-w-[570px]">
      <Header />
      <StepBar prefix="senior" />

      <div className="flex justify-center">
        <img src={HomeAdd} alt="광고 이미지" className="w-full max-w-[589px]" />
      </div>

      <div className="mt-20 text-center">
        <h2 className="text-[40px] font-semibold">전송이 완료되었습니다.</h2>
      </div>

      <footer className="fixed bottom-0 w-[570px] bg-gray-800 flex">
        <button
          className="flex-1 bg-red-600 text-white text-xl font-bold h-20 flex items-center justify-center leading-none"
          onClick={handleMain}
        >
          확인
        </button>
      </footer>
    </div>
  );
}

export default SeniorHistoryConfirmPage;
