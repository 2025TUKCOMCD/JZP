import "./App.css";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import JuniorMainPage from "./pages/JuniorMainPage.jsx";
import SeniorMainPage from "./pages/SeniorMainPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="w-full h-screen grid grid-cols-[1fr_450px_1fr] m-0 p-0">
        <div className="h-full"></div>
        <div className="shadow-xl h-full">
          <Routes>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/juniormain" element={<JuniorMainPage />}></Route>
            <Route path="/seniormain" element={<SeniorMainPage />}></Route>
          </Routes>
        </div>
        <div className="h-full"></div>
      </div>
    </BrowserRouter>
  );
}

export default App;
