import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeIcon from "../../assets/icons/homeIcon.svg";
import Header from "../../components/header.jsx";
import StepBar from "../../components/MovieStepBar3.jsx";
import Keypad from "../../components/KeyPad2.jsx";

function SeniorHistorySendingPage() {
  const [phoneNumber, setPhoneNumber] = useState(["010", "", ""]);
  const [reservationNumber, setReservationNumber] = useState(["", "", "", ""]);
  const [activeField, setActiveField] = useState("reservation");
  const [activeIndex, setActiveIndex] = useState(0);

  const handleKeyPress = (key) => {
    if (activeField === "reservation") {
      setReservationNumber((prev) => {
        const newNumber = [...prev];

        if (newNumber[activeIndex].length < 4) {
          newNumber[activeIndex] += key;
        }

        if (newNumber[activeIndex].length === 4 && activeIndex < 3) {
          setActiveIndex(activeIndex + 1);
        } else if (
          activeIndex === 3 &&
          newNumber.every((num) => num.length === 4)
        ) {
          setActiveField("phone");
          setActiveIndex(0);
        }

        return newNumber;
      });
    } else if (activeField === "phone") {
      setPhoneNumber((prev) => {
        const newPhone = [...prev];

        if (newPhone[activeIndex].length < (activeIndex === 0 ? 3 : 4)) {
          newPhone[activeIndex] += key;
        }

        if (
          newPhone[activeIndex].length === (activeIndex === 0 ? 3 : 4) &&
          activeIndex < 2
        ) {
          setActiveIndex(activeIndex + 1);
        }

        return newPhone;
      });
    }
  };

  const handleDelete = () => {
    if (activeField === "phone") {
      setPhoneNumber((prev) => {
        const newPhone = [...prev];

        if (newPhone[activeIndex].length > 0) {
          newPhone[activeIndex] = newPhone[activeIndex].slice(0, -1);
        } else if (activeIndex > 0) {
          setActiveIndex(activeIndex - 1);
        }

        return newPhone;
      });
    } else {
      setReservationNumber((prev) => {
        const newNumber = [...prev];

        if (newNumber[activeIndex].length > 0) {
          newNumber[activeIndex] = newNumber[activeIndex].slice(0, -1);
        } else if (activeIndex > 0) {
          setActiveIndex(activeIndex - 1);
        }

        return newNumber;
      });
    }
  };

  const handleReset = () => {
    setReservationNumber(["", "", "", ""]);
    setPhoneNumber(["010", "", ""]);
    setActiveField("reservation");
    setActiveIndex(0);
  };

  const navigate = useNavigate();

  const handleSeniorMain = () => navigate("/seniorMain");
  const handleSeniorHistoryInfo = () => navigate("/seniorHistoryInfo");

  return (
    <div className="bg-customBg h-screen text-white flex flex-col">
      <Header />
      <StepBar prefix="junior" />

      <div className="mt-4 text-center">
        <h2 className="text-[20px]">예매 번호와 휴대폰 번호를 입력해주세요.</h2>
      </div>

      {/* 📌 예매번호 입력 */}
      <div className="flex justify-center items-center space-x-2 my-4">
        <span className="text-gray-300 text-lg">예매 번호</span>
        {reservationNumber.map((num, index) => (
          <input
            key={index}
            type="text"
            value={num}
            readOnly
            onClick={() => {
              setActiveField("reservation");
              setActiveIndex(index);
            }}
            className={`w-20 h-14 text-black text-center text-lg font-bold bg-white rounded-md cursor-pointer ${
              activeField === "reservation" && activeIndex === index
                ? "border-2 border-blue-500"
                : ""
            }`}
          />
        ))}
      </div>

      {/* 📌 핸드폰 번호 입력 */}
      <div className="flex justify-center items-center space-x-2 mt-2 mb-4">
        <span className="text-gray-300 text-lg mr-4">핸드폰 번호</span>
        {phoneNumber.map((num, index) => (
          <input
            key={index}
            type="text"
            value={num}
            readOnly
            onClick={() => {
              setActiveField("phone");
              setActiveIndex(index);
            }}
            className={`${
              index === 0 ? "w-20" : "w-24"
            } h-14 text-center text-black text-lg font-bold bg-white rounded-md cursor-pointer ${
              activeField === "phone" && activeIndex === index
                ? "border-2 border-blue-500"
                : ""
            }`}
          />
        ))}
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
          <img src={HomeIcon} alt="홈 아이콘" className="w-8 h-8" />홈
        </button>
        <button
          className="flex-1 bg-red-600 text-white text-xl font-bold h-20 flex items-center justify-center leading-none"
          onClick={handleSeniorHistoryInfo}
        >
          확인
        </button>
      </footer>
    </div>
  );
}

export default SeniorHistorySendingPage;
