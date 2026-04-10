import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import axios from "axios";
import FreePayStore from "@/components/FreePayStore";
import CreditLine from "@/components/CreditLine";
import CameraScanner from "@/components/CameraScanner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const NavBar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/90 backdrop-blur border-b border-zinc-800">
    <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
      <span className="font-bold text-white tracking-tight">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Quantum</span>
        {" "}Economics
      </span>
      <div className="flex gap-1">
        {[
          { to: "/", label: "Home" },
          { to: "/store", label: "⚡ Free Store" },
          { to: "/credit-line", label: "🏦 Credit Line" },
          { to: "/camera", label: "📷 Camera Scan" },
        ].map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
    </div>
  </nav>
);

const Home = () => {
  useEffect(() => {
    axios.get(`${API}/`).catch(() => {});
  }, []);

  return (
    <div className="qe-home min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="qe-glow" />
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-1 text-purple-400 text-sm font-medium mb-6">
          ✦ Quantum Economics Platform
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white mb-4">
          God<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">world</span>.org
        </h1>
        <p className="text-zinc-400 text-xl max-w-xl mx-auto mb-10">
          A new financial paradigm — IP as capital, FreePay as infrastructure, quantum economics as theory.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <NavLink
            to="/store"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition-colors"
          >
            ⚡ Open Free Store
          </NavLink>
          <NavLink
            to="/credit-line"
            className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-lg transition-colors border border-zinc-700"
          >
            🏦 Credit Line
          </NavLink>
        </div>
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
          {[
            { icon: "⚡", title: "FreePay", desc: "Solana Pay QR codes — scan & claim free digital goods" },
            { icon: "🧠", title: "IP Pledging", desc: "Intellectual property tokenized as collateral on-chain" },
            { icon: "📈", title: "Quantum Economics", desc: "A unified theory of value, wealth, and digital credit" },
          ].map((f) => (
            <div key={f.title} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5">
              <div className="text-2xl mb-2">{f.icon}</div>
              <h3 className="font-semibold text-white mb-1">{f.title}</h3>
              <p className="text-zinc-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App bg-[#0a0a0f]">
      <BrowserRouter>
        <NavBar />
        <div className="pt-14">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/store" element={<FreePayStore />} />
            <Route path="/credit-line" element={<CreditLine />} />
            <Route path="/camera" element={<CameraScanner />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
