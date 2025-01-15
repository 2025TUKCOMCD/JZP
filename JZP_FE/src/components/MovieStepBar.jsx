import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const MovieSelectBar = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const location = useLocation();

  useEffect(() => {
    // Set currentStep based on the current pathname
    switch (location.pathname) {
      case "/juniortMovieSelect":
        setCurrentStep(1);
        break;
      case "/juniorSeat":
        setCurrentStep(2);
        break;
      case "/juniorPay":
        setCurrentStep(3);
        break;
      case "/juniorBooking":
        setCurrentStep(4);
        break;
      default:
        setCurrentStep(1);
        break;
    }
  }, [location.pathname]);

  const steps = [
    { id: 1, label: "영화선택" },
    { id: 2, label: "인원 및 좌석 선택" },
    { id: 3, label: "결제하기" },
    { id: 4, label: "예매내역" },
  ];

  return (
    <div className="relative flex flex-col items-center py-4 mt-2 mb-0">
      {/* Progress Bar */}
      <div className="absolute top-[35%] left-[17%] w-[66%] h-0.5 bg-[#444855] z-0">
        <div
          className="h-full bg-white transition-all duration-300"
          style={{
            width: `${
              currentStep === 1
                ? "0%"
                : currentStep === 2
                  ? "30%"
                  : currentStep === 3
                    ? "70%"
                    : "100%"
            }`,
          }}
        ></div>
      </div>
      <div className="flex items-center w-full max-w-md px-2 relative z-10">
        {steps.map((step) => (
          <div
            key={step.id}
            className="flex flex-col items-center flex-1 relative"
          >
            {/* Step Circle */}
            <div
              className={`flex items-center justify-center rounded-full w-6 h-6 border-2 text-xs font-medium transition-all duration-300 ${
                currentStep >= step.id
                  ? "bg-white text-black border-white"
                  : "bg-[#444855] text-white border-[#444855]"
              }`}
            >
              <span>{step.id}</span>
            </div>
            {/* Step Label */}
            <span
              className={`mt-2 text-[12px] ${
                currentStep >= step.id ? "text-white" : "text-[#717070]"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieSelectBar;
