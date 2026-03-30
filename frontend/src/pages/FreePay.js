import { useState } from "react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const DEFAULT_WALLET = "GodWorldFreePay1111111111111111111111111111";

const QUICK_AMOUNTS = [0.01, 0.05, 0.1, 0.5, 1, 5];

const FreePay = () => {
  const [form, setForm] = useState({
    recipient: DEFAULT_WALLET,
    amount_sol: "",
    label: "Quantum Economics FreePay",
    message: "",
  });
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuickAmount = (amount) => {
    setForm((prev) => ({ ...prev, amount_sol: String(amount) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPayment(null);
    try {
      const res = await axios.post(`${API}/payment/generate-qr`, {
        ...form,
        amount_sol: parseFloat(form.amount_sol),
      });
      setPayment(res.data);
    } catch {
      setError("Failed to generate QR code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (payment?.solana_pay_url) {
      navigator.clipboard.writeText(payment.solana_pay_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setPayment(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-white mb-2">⚡ FreePay</h1>
          <p className="text-gray-400">
            Generate a Solana Pay QR code for any amount. Share it anywhere to
            accept instant payments.
          </p>
        </div>

        {!payment ? (
          <form
            onSubmit={handleSubmit}
            className="bg-gray-800 border border-gray-700 rounded-2xl p-6 flex flex-col gap-5"
          >
            {/* Wallet Address */}
            <div>
              <label className="text-gray-400 text-sm font-medium block mb-1">
                Your Solana Wallet Address *
              </label>
              <input
                required
                name="recipient"
                value={form.recipient}
                onChange={handleChange}
                placeholder="Enter your Solana wallet address"
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500"
              />
              <p className="text-gray-600 text-xs mt-1">
                This is where the SOL will be sent. Use your Phantom or Solflare
                address.
              </p>
            </div>

            {/* Label */}
            <div>
              <label className="text-gray-400 text-sm font-medium block mb-1">
                Payment Label *
              </label>
              <input
                required
                name="label"
                value={form.label}
                onChange={handleChange}
                placeholder="e.g. Consulting Fee, Tip, Donation"
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="text-gray-400 text-sm font-medium block mb-1">
                Amount (SOL) *
              </label>
              <input
                required
                name="amount_sol"
                type="number"
                min="0.000001"
                step="any"
                value={form.amount_sol}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500"
              />
              {/* Quick amounts */}
              <div className="flex flex-wrap gap-2 mt-2">
                {QUICK_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleQuickAmount(amt)}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                      form.amount_sol === String(amt)
                        ? "bg-purple-700 border-purple-600 text-white"
                        : "bg-gray-900 border-gray-700 text-gray-400 hover:border-purple-600 hover:text-purple-300"
                    }`}
                  >
                    {amt} SOL
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="text-gray-400 text-sm font-medium block mb-1">
                Message (optional)
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={2}
                placeholder="Add a note for the sender..."
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors text-sm"
            >
              {loading ? "Generating..." : "⚡ Generate FreePay QR Code"}
            </button>
          </form>
        ) : (
          <div className="bg-gray-800 border border-purple-700/40 rounded-2xl p-6 flex flex-col items-center gap-5">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-green-400 text-sm font-medium bg-green-900/20 border border-green-800/40 rounded-full px-4 py-1 mb-3">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                QR Code Ready
              </div>
              <h2 className="text-white font-bold text-xl">{payment.label}</h2>
              <p className="text-purple-400 font-bold text-2xl mt-1">
                {payment.amount_sol} SOL
              </p>
            </div>

            {/* QR Code */}
            <div className="bg-white p-4 rounded-2xl shadow-lg shadow-purple-900/20">
              <img
                src={payment.qr_image_url}
                alt="Solana Pay QR Code"
                className="w-52 h-52"
              />
            </div>

            <p className="text-gray-400 text-sm text-center">
              Scan with{" "}
              <span className="text-purple-300 font-medium">Phantom</span> or{" "}
              <span className="text-purple-300 font-medium">Solflare</span> wallet
              to send payment
            </p>

            {/* Payment URL */}
            <div className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3">
              <p className="text-gray-500 text-xs mb-1">Solana Pay URL</p>
              <p className="text-gray-300 text-xs break-all font-mono">
                {payment.solana_pay_url}
              </p>
            </div>

            {/* Payment Details */}
            <div className="w-full grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
                <p className="text-gray-500 text-xs mb-1">Recipient</p>
                <p className="text-white font-mono text-xs truncate">
                  {payment.recipient}
                </p>
              </div>
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
                <p className="text-gray-500 text-xs mb-1">Amount</p>
                <p className="text-purple-400 font-bold">{payment.amount_sol} SOL</p>
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <button
                onClick={handleCopy}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-2.5 rounded-xl transition-colors text-sm"
              >
                {copied ? "✓ Copied!" : "📋 Copy URL"}
              </button>
              <button
                onClick={handleReset}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-xl transition-colors text-sm"
              >
                ⚡ Generate New
              </button>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-gray-800/40 border border-gray-700/60 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-3 text-sm">
            💡 About FreePay
          </h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">•</span>
              FreePay uses the Solana Pay protocol for instant, low-fee transactions
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">•</span>
              Compatible with Phantom, Solflare, and other Solana wallets
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">•</span>
              QR codes can be printed, shared on social media, or embedded in websites
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">•</span>
              No contract needed — payments settle directly to your wallet
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FreePay;
