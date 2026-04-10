import { useEffect, useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Solana Pay URL format: solana:<recipient>?amount=<amount>&label=<label>&message=<message>
// Replace GODWORLD_WALLET_ADDRESS with your actual Solana wallet public key
const GODWORLD_WALLET_ADDRESS = "GodWor1dFreePay11111111111111111111111111111";
const SOLANA_PAY_URL = `solana:${GODWORLD_WALLET_ADDRESS}?label=Godworld+QR+Free+Store&message=FreePay+Tip+-+100%25+to+Creator`;
const QR_API_URL = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(SOLANA_PAY_URL)}`;

const Home = () => {
  const [apiStatus, setApiStatus] = useState("connecting");

  useEffect(() => {
    const checkApi = async () => {
      try {
        const response = await axios.get(`${API}/`);
        console.log(response.data.message);
        setApiStatus("online");
      } catch (e) {
        console.error(e, "errored out requesting / api");
        setApiStatus("offline");
      }
    };
    checkApi();
  }, []);

  return (
    <div className="qr-store-page">
      {/* Header */}
      <header className="qr-store-header">
        <div className="qr-store-header-inner">
          <div className="qr-store-logo">⚛</div>
          <div>
            <h1 className="qr-store-title">Quantum Economics</h1>
            <p className="qr-store-subtitle">godworld.org</p>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="qr-store-hero">
        <h2 className="qr-store-hero-title">FreePay QR Store</h2>
        <p className="qr-store-hero-desc">
          Scan the QR code below with a Solana-compatible wallet (Phantom,
          Solflare) to send a tip. 100&nbsp;% of every payment goes directly to
          the creator.
        </p>
      </section>

      {/* QR Code card */}
      <section className="qr-store-card-section">
        <div className="qr-store-card">
          <p className="qr-store-card-label">Scan &amp; Pay with Solana Pay</p>
          <img
            src={QR_API_URL}
            alt="Solana Pay QR code for Godworld FreePay"
            className="qr-store-qr-image"
          />
          <p className="qr-store-wallet-hint">
            Wallet: <code>{GODWORLD_WALLET_ADDRESS}</code>
          </p>
          <a
            href={SOLANA_PAY_URL}
            className="qr-store-pay-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in Wallet App
          </a>
        </div>
      </section>

      {/* How it works */}
      <section className="qr-store-steps">
        <h3 className="qr-store-steps-title">How FreePay Works</h3>
        <ol className="qr-store-steps-list">
          <li>
            <span className="qr-store-step-num">1</span>
            <span>
              A visitor scans your QR code at <strong>godworld.org</strong>.
            </span>
          </li>
          <li>
            <span className="qr-store-step-num">2</span>
            <span>
              The 1AI Executor generates a&nbsp;<strong>100&nbsp;% split</strong>{" "}
              instruction — the full tip goes to the creator.
            </span>
          </li>
          <li>
            <span className="qr-store-step-num">3</span>
            <span>
              The visitor signs the transaction via their mobile wallet (Phantom
              or Solflare) — no sign-up required.
            </span>
          </li>
        </ol>
      </section>

      {/* IP / Borrowing section */}
      <section className="qr-store-ip-section">
        <h3 className="qr-store-ip-title">Digital Credit &amp; IP Pledging</h3>
        <p className="qr-store-ip-body">
          The Blue Star v2026 codebase (MIT licensed, hosted on GitHub) can be
          profiled with IP-valuation platforms such as Inngot to generate a{" "}
          <em>Certificate of Value</em>. Future FreePay tips form a predictable
          revenue stream that can be used as tokenised receivables for
          short-term liquidity.
        </p>
      </section>

      {/* Footer */}
      <footer className="qr-store-footer">
        <span
          className={`qr-store-status qr-store-status--${apiStatus}`}
          title="Backend API status"
        >
          ● API {apiStatus}
        </span>
        <p>© 2026 Quantum Economics · MIT License</p>
      </footer>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
