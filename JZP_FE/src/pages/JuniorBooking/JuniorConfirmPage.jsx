import { useNavigate } from "react-router-dom";
import Header from "../../components/header.jsx";
import StepBar from "../../components/MovieStepBar2.jsx";
import HomeAdd from "../../assets/images/homeAdd.png";

function JuniorConfirmPage() {
  const navigate = useNavigate();

  const handleJuniorMain = () => navigate("/juniorMain");

  return (
    <div className="bg-customBg h-screen text-white flex flex-col relative mx-auto w-[570px] min-w-[570px] max-w-[570px]">
      <Header />
      <StepBar prefix="junior" />

      <div className="flex justify-center">
        <img src={HomeAdd} alt="광고 이미지" className="w-full max-w-[589px]" />
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-[28px] font-semibold">전송이 완료되었습니다.</h2>
      </div>

      <footer className="fixed bottom-0 w-[570px] bg-gray-800 flex">
        <button
          className="flex-1 bg-red-600 text-white text-sm font-bold h-16 flex items-center justify-center leading-none"
          onClick={handleJuniorMain}
        >
          확인
        </button>
      </footer>
    </div>
  );
}

export default JuniorConfirmPage;
