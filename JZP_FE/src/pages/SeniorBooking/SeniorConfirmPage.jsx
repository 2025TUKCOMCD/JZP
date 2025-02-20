import Header from "../../components/header.jsx";
import StepBar from "../../components/MovieStepBar2.jsx";

function SeniorConfirmPage() {
  return (
    <div className="bg-customBg h-screen text-white flex flex-col">
      <Header />
      <StepBar prefix="senior" />
    </div>
  );
}

export default SeniorConfirmPage;
