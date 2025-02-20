import Header from "../../components/header.jsx";
import StepBar from "../../components/MovieStepBar2.jsx";

function JuniorSendingPage() {
  return (
    <div className="bg-customBg h-screen text-white flex flex-col">
      <Header />
      <StepBar prefix="junior" />
    </div>
  );
}

export default JuniorSendingPage;
