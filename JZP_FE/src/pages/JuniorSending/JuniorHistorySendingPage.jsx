import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeIcon from "../../assets/icons/homeIcon.svg";
import Header from "../../components/header.jsx";
import StepBar from "../../components/MovieStepBar3.jsx";
import Keypad from "../../components/KeyPad.jsx";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function JuniorHistorySendingPage() {
  const [phoneNumber, setPhoneNumber] = useState(["010", "", ""]);
  const [reservationNumber, setReservationNumber] = useState(["", "", "", ""]);
  const [activeField, setActiveField] = useState("reservation");
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

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
    } else {
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

  const handleJuniorMain = () => navigate("/juniorMain");

  const handleConfirm = async () => {
    const fullPhone = phoneNumber.join("");
    const ticketId = localStorage.getItem("ticketId");

    if (!ticketId || fullPhone.length !== 11) {
      console.log("휴대폰 번호 또는 예매번호가 잘못되었습니다.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/movie/Reservation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: fullPhone,
          ticketId: ticketId,
        }),
      });

      const text = await response.text();
      console.log("📦 응답 원문:", text);

      // 혹시 JSON이 아닐 수 있어서 예외 처리
      let result;
      try {
        result = JSON.parse(text);
      } catch (err) {
        console.log("응답 형식이 잘못되었습니다.");
        console.error("❌ JSON 파싱 실패:", err);
        return;
      }

      console.log("✅ 예매 내역:", result);
      // 필요하면 result를 다음 페이지로 넘기거나 저장 가능
      console.log("예매 내역을 불러왔습니다.");
      navigate("/juniorHistoryInfo");
    } catch (err) {
      console.error("❌ API 호출 실패:", err);
      console.log("예매 내역 조회에 실패했습니다.");
    }
  };

  return (
    <div className="bg-customBg h-screen text-white flex flex-col relative mx-auto w-[560px] min-w-[560px] max-w-[560px]">
      <Header />
      <StepBar prefix="junior" />
      <div className="mt-4 text-center">
        <h2 className="text-[14px]">예매 번호와 휴대폰 번호를 입력해주세요.</h2>
      </div>
      <div className="flex justify-center items-center space-x-2 my-4">
        <span className="text-gray-300 text-sm mr-4">예매 번호</span>
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
            className={`w-16 h-10 text-black text-center text-sm font-bold bg-white rounded-md cursor-pointer ${
              activeField === "reservation" && activeIndex === index
                ? "border-2 border-blue-500"
                : ""
            }`}
          />
        ))}
      </div>
      <div className="flex justify-center items-center space-x-2 my-4">
        <span className="text-gray-300 text-sm mr-4">핸드폰 번호</span>
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
              index === 0 ? "w-14" : "w-20"
            } h-10 text-center text-black text-sm font-bold bg-white rounded-md cursor-pointer ${
              activeField === "phone" && activeIndex === index
                ? "border-2 border-blue-500"
                : ""
            }`}
          />
        ))}
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
      <footer className="fixed bottom-0 w-[560px] bg-gray-800 flex">
        <button
          className="flex-1 bg-white text-black text-sm font-bold h-16 flex items-center justify-center leading-none gap-2"
          onClick={handleJuniorMain}
        >
          <img src={HomeIcon} alt="홈 아이콘" className="w-4 h-4" />홈
        </button>
        <button
          className="flex-1 bg-red-600 text-white text-sm font-bold h-16 flex items-center justify-center leading-none"
          onClick={handleConfirm}
        >
          확인
        </button>
      </footer>
    </div>
  );
}

export default JuniorHistorySendingPage;
