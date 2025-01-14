import "./App.css";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import JuniorMainPage from "./pages/JuniorMainPage.jsx";
import SeniorMainPage from "./pages/SeniorMainPage.jsx";
import JuniorMovieSelect from "./pages/JuniorMovieSelectPage.jsx";
import SeniorMoviewSelect from "./pages/SeniorMovieSelectPage.jsx";

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
            <Route path="/seniorMovie" element={<SeniorMoviewSelect />}></Route>
          </Routes>
        </div>
        <div className="h-full"></div>
      </div>
    </BrowserRouter>
  );
}

export default App;
