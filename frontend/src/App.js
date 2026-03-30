import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Home from "@/pages/Home";
import QRStore from "@/pages/QRStore";
import FreePay from "@/pages/FreePay";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/store" element={<QRStore />} />
          <Route path="/freepay" element={<FreePay />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
