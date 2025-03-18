import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeIcon from "../../assets/icons/homeIcon.svg";
import Header from "../../components/header.jsx";
import StepBar from "../../components/MovieStepBar2.jsx";
import Keypad from "../../components/KeyPad2.jsx";

function SeniorSendingPage() {
  const [phoneNumber, setPhoneNumber] = useState(["010", "", ""]);

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

  const navigate = useNavigate();

  const handleSeniorMain = () => navigate("/seniorMain");
  const handleSeniorConfirm = () => navigate("/seniorConfirm");

  return (
    <div className="bg-customBg h-screen text-white flex flex-col">
      <Header />
      <StepBar prefix="junior" />

      <div className="mt-4 text-center">
        <h2 className="text-[20px]">
          예매 내역을 전송할 핸드폰 번호를 입력해주세요.
        </h2>
      </div>

      <div className="flex justify-center items-center space-x-2 my-10">
        <span className="text-gray-300 text-xl font-semibold mr-4">
          핸드폰 번호
        </span>

        <input
          type="text"
          value={phoneNumber[0]}
          readOnly
          className="w-20 h-14 text-center text-xl font-bold bg-white text-gray-500 rounded-md"
        />

        <input
          type="text"
          value={phoneNumber[1]}
          readOnly
          className="w-24 h-14 text-center text-xl font-bold bg-white text-black rounded-md"
        />

        <input
          type="text"
          value={phoneNumber[2]}
          readOnly
          className="w-24 h-14 text-center text-xl font-bold bg-white text-black rounded-md"
        />
      </div>

      <div className="flex flex-col items-center justify-center flex-grow w-full bg-customDarkblue">
        <div className="mt-[-75px]">
          <Keypad
            onKeyPress={handleKeyPress}
            onDelete={handleDelete}
            onReset={handleReset}
          />
        </div>
      </div>

      <footer className="fixed bottom-0 w-[450px] bg-gray-800 flex">
        <button
          className="flex-1 bg-white text-black text-xl font-bold h-20 flex items-center justify-center leading-none gap-2"
          onClick={handleSeniorMain}
        >
          <img src={HomeIcon} alt="홈 아이콘" className="w-4 h-4" />홈
        </button>
        <button
          className="flex-1 bg-red-600 text-white text-xl font-bold h-20 flex items-center justify-center leading-none"
          onClick={handleSeniorConfirm}
        >
          확인
        </button>
      </footer>
    </div>
  );
}

export default SeniorSendingPage;
