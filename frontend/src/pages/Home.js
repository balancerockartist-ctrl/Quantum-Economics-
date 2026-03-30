import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const StatCard = ({ label, value, icon }) => (
  <div className="bg-gray-800 border border-purple-900/40 rounded-xl p-6 flex flex-col items-center gap-2">
    <div className="text-3xl">{icon}</div>
    <div className="text-3xl font-bold text-white">{value}</div>
    <div className="text-gray-400 text-sm">{label}</div>
  </div>
);

const FeatureCard = ({ icon, title, description, to }) => (
  <Link
    to={to}
    className="bg-gray-800 border border-gray-700 hover:border-purple-500 rounded-xl p-6 flex flex-col gap-3 transition-all hover:shadow-lg hover:shadow-purple-900/20 group"
  >
    <div className="text-4xl">{icon}</div>
    <h3 className="text-white font-bold text-lg group-hover:text-purple-300 transition-colors">
      {title}
    </h3>
    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    <span className="text-purple-400 text-sm font-medium mt-auto">
      Explore →
    </span>
  </Link>
);

const Home = () => {
  const [stats, setStats] = useState({ total_products: 0, total_payments: 0 });

  useEffect(() => {
    axios
      .get(`${API}/stats`)
      .then((res) => setStats(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/60 via-gray-950 to-gray-950 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-purple-900/30 border border-purple-700/40 rounded-full px-4 py-1.5 text-purple-300 text-sm mb-6">
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            Powered by Solana Pay
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6">
            <span className="text-white">Quantum</span>{" "}
            <span className="bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent">
              Economics
            </span>
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            A decentralized QR Free Store and FreePay system built on Solana.
            Accept payments, share value, and tokenize your intellectual wealth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/store"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
            >
              Open QR Store
            </Link>
            <Link
              to="/freepay"
              className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-8 py-3 rounded-xl border border-gray-700 transition-colors"
            >
              Generate FreePay QR
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard label="Products Listed" value={stats.total_products} icon="📦" />
          <StatCard label="Payments Generated" value={stats.total_payments} icon="⚡" />
          <StatCard label="Network" value="Solana" icon="🔗" />
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">
          What You Can Do
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <FeatureCard
            icon="🛒"
            title="QR Free Store"
            description="List products and services in your Quantum Economics store. Each listing generates a scannable Solana Pay QR code for instant payment."
            to="/store"
          />
          <FeatureCard
            icon="💳"
            title="FreePay"
            description="Generate a custom Solana Pay QR code for any amount. Share it anywhere — online or in person — to accept payments instantly."
            to="/freepay"
          />
          <FeatureCard
            icon="🌐"
            title="Tokenized Value"
            description="Treat your IP, GitHub repositories, and creative output as collateral. Build a digital portfolio of intellectual wealth on-chain."
            to="/"
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            How FreePay Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center">
            {[
              { step: "1", icon: "📝", title: "List It", desc: "Add your product or service to the QR Store" },
              { step: "2", icon: "📱", title: "Scan It", desc: "Customer scans the Solana Pay QR code" },
              { step: "3", icon: "✍️", title: "Sign It", desc: "Wallet signs the transaction (Phantom, Solflare)" },
              { step: "4", icon: "⚡", title: "Done", desc: "SOL lands in your wallet instantly" },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-700/40 border border-purple-600 flex items-center justify-center text-purple-300 font-bold text-lg">
                  {step}
                </div>
                <div className="text-2xl">{icon}</div>
                <div className="text-white font-semibold">{title}</div>
                <div className="text-gray-400 text-sm">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
