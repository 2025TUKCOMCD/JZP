import "./App.css";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import JuniorMainPage from "./pages/JuniorMainPage.jsx";
import SeniorMainPage from "./pages/SeniorMainPage.jsx";
import JuniorMovieSelect from "./pages/JuniorMovieSelectPage.jsx";
import SeniorMovieSelect from "./pages/SeniorMovieSelectPage.jsx";
import JuniorSeatSelect from "./pages/JuniorSeatSelectPage.jsx";
import SeniorSeatSelect from "./pages/SeniorSeatSelectPage.jsx";
import JuniorPayPage from "./pages/JuniorPayPage.jsx";
import SeniorPayPage from "./pages/SeniorPayPage.jsx";
import JuniorBookHistoryPage from "./pages/JuniorBookingHistoryPage.jsx";
import SeniorBookHistoryPage from "./pages/SeniorBookingHistoryPage.jsx";
import JuniorSendingPage from "./pages/JuniorSendingPage.jsx";
import SeniorSendingPage from "./pages/SeniorSendingPage.jsx";

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
            <Route path="/seniorMain" element={<SeniorMainPage />}></Route>
            <Route path="/seniorMovie" element={<SeniorMovieSelect />}></Route>
            <Route path="/juniorSeat" element={<JuniorSeatSelect />}></Route>
            <Route path="/seniorSeat" element={<SeniorSeatSelect />}></Route>
            <Route path="/juniorPay" element={<JuniorPayPage />}></Route>
            <Route path="/seniorPay" element={<SeniorPayPage />}></Route>
            <Route
              path="/juniorBooking"
              element={<JuniorBookHistoryPage />}
            ></Route>
            <Route
              path="/seniorBooking"
              element={<SeniorBookHistoryPage />}
            ></Route>
            <Route
              path="/juniorSending"
              element={<JuniorSendingPage />}
            ></Route>
            <Route
              path="/seniorSending"
              element={<SeniorSendingPage />}
            ></Route>
          </Routes>
        </div>
        <div className="h-full"></div>
      </div>
    </BrowserRouter>
  );
}

export default App;
