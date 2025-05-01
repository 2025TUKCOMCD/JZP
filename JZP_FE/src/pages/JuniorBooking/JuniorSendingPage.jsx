import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeIcon from "../../assets/icons/homeIcon.svg";
import Header from "../../components/header.jsx";
import StepBar from "../../components/MovieStepBar2.jsx";
import Keypad from "../../components/KeyPad.jsx";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function JuniorSendingPage() {
  const [phoneNumber, setPhoneNumber] = useState(["010", "", ""]);
  const navigate = useNavigate();

  const handleKeyPress = (key) => {
    setPhoneNumber((prev) => {
      const newPhone = [...prev];

      for (let i = 0; i < newPhone.length; i++) {
        if (newPhone[i].length < (i === 0 ? 3 : 4)) {
          newPhone[i] += key;
          break;
        }
      }
      return newPhone;
    });
  };

  const handleDelete = () => {
    setPhoneNumber((prev) => {
      const newPhone = [...prev];

      for (let i = newPhone.length - 1; i >= 0; i--) {
        if (newPhone[i].length > 0) {
          newPhone[i] = newPhone[i].slice(0, -1);
          break;
        }
      }
      return newPhone;
    });
  };

  const handleReset = () => {
    setPhoneNumber(["010", "", ""]);
  };

  const handleMain = () => navigate("/");

  const handleJuniorConfirm = async () => {
    const fullPhoneNumber = phoneNumber.join("");
    const ticketId = localStorage.getItem("ticketId");

    if (fullPhoneNumber.length !== 11 || !ticketId) {
      console.warn("🚨 phone:", fullPhoneNumber, "ticketId:", ticketId);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/movie/sendTicketNum`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber: fullPhoneNumber, ticketId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ 응답 오류:", response.status, errorText);
        throw new Error("전송 실패");
      }

      const resultText = await response.text();
      console.log("✅ 응답 텍스트:", resultText);

      navigate("/juniorConfirm");
    } catch (error) {
      console.error("❌ 예외 발생:", error);
    }
  };

  return (
    <div className="bg-customBg h-screen text-white flex flex-col relative mx-auto w-[570px] min-w-[570px] max-w-[570px]">
      <Header />
      <StepBar prefix="junior" />

      <div className="mt-4 text-center">
        <h2 className="text-[14px]">
          예매 내역을 전송할 핸드폰 번호를 입력해주세요.
        </h2>
      </div>

      <div className="flex justify-center items-center space-x-2 my-10">
        <span className="text-gray-300 text-sm mr-4">핸드폰 번호</span>

        <input
          type="text"
          value={phoneNumber[0]}
          readOnly
          className="w-16 h-10 text-center text-sm font-bold bg-white text-gray-500 rounded-md"
        />

        <input
          type="text"
          value={phoneNumber[1]}
          readOnly
          className="w-20 h-10 text-center text-sm font-bold bg-white text-black rounded-md"
        />

        <input
          type="text"
          value={phoneNumber[2]}
          readOnly
          className="w-20 h-10 text-center text-sm font-bold bg-white text-black rounded-md"
        />
      </div>

      <div className="flex flex-col items-center justify-center flex-grow w-full bg-customDarkblue">
        <div className="mt-[-60px]">
          <Keypad
            onKeyPress={handleKeyPress}
            onDelete={handleDelete}
            onReset={handleReset}
          />
        </div>
      </div>

      <footer className="fixed bottom-0 w-[570px] bg-gray-800 flex">
        <button
          className="flex-1 bg-white text-black text-sm font-bold h-16 flex items-center justify-center leading-none gap-2"
          onClick={handleMain}
        >
          <img src={HomeIcon} alt="홈 아이콘" className="w-4 h-4" />홈
        </button>
        <button
          className="flex-1 bg-red-600 text-white text-sm font-bold h-16 flex items-center justify-center leading-none"
          onClick={handleJuniorConfirm}
        >
          확인
        </button>
      </footer>
    </div>
  );
}

export default JuniorSendingPage;
