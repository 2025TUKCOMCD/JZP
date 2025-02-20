import "./App.css";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import JuniorMainPage from "./pages/JuniorMainPage.jsx";
import SeniorMainPage from "./pages/SeniorMainPage.jsx";
import JuniorMovieSelect from "./pages/JuniorBooking/JuniorMovieSelectPage.jsx";
import SeniorMovieSelect from "./pages/SeniorBooking/SeniorMovieSelectPage.jsx";
import JuniorSeatSelect from "./pages/JuniorBooking/JuniorSeatSelectPage.jsx";
import SeniorSeatSelect from "./pages/SeniorBooking/SeniorSeatSelectPage.jsx";
import JuniorPayPage from "./pages/JuniorBooking/JuniorPayPage.jsx";
import SeniorPayPage from "./pages/SeniorBooking/SeniorPayPage.jsx";
import JuniorBookHistoryPage from "./pages/JuniorBooking/JuniorBookingHistoryPage.jsx";
import SeniorBookHistoryPage from "./pages/SeniorBooking/SeniorBookingHistoryPage.jsx";
import JuniorSendingPage from "./pages/JuniorBooking/JuniorSendingPage.jsx";
import SeniorSendingPage from "./pages/SeniorBooking/SeniorSendingPage.jsx";
import JuniorConfirmPage from "./pages/JuniorBooking/JuniorConfirmPage.jsx";
import SeniorConfirmPage from "./pages/SeniorBooking/SeniorConfirmPage.jsx";
import JuniorHistoryConfirmPage from "./pages/JuniorSending/JuniorHistoryConfirmPage.jsx";
import SeniorHistoryConfirmPage from "./pages/SeniorSending/SeniorHistoryConfirmPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="w-full h-screen grid grid-cols-[1fr_450px_1fr]">
        <div className="h-full"></div>
        <div className="shadow-xl h-full">
          <Routes>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/juniorMain" element={<JuniorMainPage />}></Route>
            <Route path="/juniorMovie" element={<JuniorMovieSelect />}></Route>
            <Route path="/juniorSeat" element={<JuniorSeatSelect />}></Route>
            <Route path="/juniorPay" element={<JuniorPayPage />}></Route>
            <Route
              path="/juniorBooking"
              element={<JuniorBookHistoryPage />}
            ></Route>
            <Route
              path="/juniorSending"
              element={<JuniorSendingPage />}
            ></Route>
            <Route
              path="/juniorConfirm"
              element={<JuniorConfirmPage />}
            ></Route>
            <Route
              path="/juniorHistoryConfirm"
              element={<JuniorHistoryConfirmPage />}
            ></Route>
            <Route path="/seniorMain" element={<SeniorMainPage />}></Route>
            <Route path="/seniorMovie" element={<SeniorMovieSelect />}></Route>
            <Route path="/seniorSeat" element={<SeniorSeatSelect />}></Route>
            <Route path="/seniorPay" element={<SeniorPayPage />}></Route>
            <Route
              path="/seniorBooking"
              element={<SeniorBookHistoryPage />}
            ></Route>
            <Route
              path="/seniorSending"
              element={<SeniorSendingPage />}
            ></Route>
            <Route
              path="/seniorConfirm"
              element={<SeniorConfirmPage />}
            ></Route>
            <Route
              path="/seniorHistoryConfirm"
              element={<SeniorHistoryConfirmPage />}
            ></Route>
          </Routes>
        </div>
        <div className="h-full"></div>
      </div>
    </BrowserRouter>
  );
}

export default App;
