import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const WALLET = "Gr4H2oDqdvb5CZ9SHSUcxpZFGCMNdGNHEjxkxQnFtWp";

const TIP_AMOUNTS = [
  { label: "Free", value: 0 },
  { label: "0.1 SOL", value: 0.1 },
  { label: "0.5 SOL", value: 0.5 },
  { label: "1.0 SOL", value: 1.0 },
];

const CATEGORY_COLORS = {
  Document: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Music: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Software: "bg-green-500/20 text-green-300 border-green-500/30",
  "AI Tools": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Art: "bg-pink-500/20 text-pink-300 border-pink-500/30",
};

export default function FreePayStore() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [tipAmount, setTipAmount] = useState(0);
  const [payUrl, setPayUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`${API}/store/items`)
      .then((res) => setItems(res.data))
      .catch(() =>
        setItems([
          { id: "1", name: "Quantum Economics Whitepaper", description: "Full PDF of the Quantum Economics framework", category: "Document" },
          { id: "2", name: "Blue Star v2026 Beat Pack", description: "Exclusive lo-fi + quantum-wave music (10 tracks)", category: "Music" },
          { id: "3", name: "GOS System Starter Kit", description: "Digital toolkit for the Godworld Operating System", category: "Software" },
          { id: "4", name: "Claudia AI Prompt Library", description: "Curated prompt collection for advanced AI workflows", category: "AI Tools" },
          { id: "5", name: "Quantum Art Genesis Pack", description: "5 original generative SVG art pieces", category: "Art" },
        ])
      );
  }, []);

  const handleSelect = async (item, amount) => {
    setSelected(item);
    setTipAmount(amount);
    setLoading(true);
    try {
      const res = await axios.post(`${API}/store/generate-payment-url`, {
        recipient: WALLET,
        amount,
        label: `Godworld FreePay – ${item.name}`,
        message: item.description,
        memo: `freepay-${item.id}`,
      });
      setPayUrl(res.data.url);
    } catch {
      const reference = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
      const encoded = encodeURIComponent(`Godworld FreePay – ${item.name}`);
      setPayUrl(`solana:${WALLET}?amount=${amount}&label=${encoded}&reference=${reference}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white px-4 py-10">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-4 py-1 text-yellow-400 text-sm font-medium mb-4">
          ⚡ FreePay Enabled
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Godworld.org{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            Free Store
          </span>
        </h1>
        <p className="text-zinc-400 text-lg">Scan a QR code with your Solana wallet. Everything is free — tips welcome.</p>
        <div className="mt-3 text-xs text-zinc-600 font-mono break-all">Wallet: {WALLET}</div>
      </div>

      {selected ? (
        /* QR Panel */
        <div className="max-w-sm mx-auto">
          <Card className="bg-zinc-900 border-zinc-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">{selected.name}</CardTitle>
              <CardDescription className="text-zinc-400">{selected.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-5">
              {/* Tip selector */}
              <div className="flex gap-2 flex-wrap justify-center">
                {TIP_AMOUNTS.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => handleSelect(selected, t.value)}
                    className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                      tipAmount === t.value
                        ? "bg-purple-600 border-purple-500 text-white"
                        : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-purple-500"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="w-[220px] h-[220px] flex items-center justify-center text-zinc-500">Generating…</div>
              ) : payUrl ? (
                <div className="p-3 bg-white rounded-xl">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(payUrl)}`}
                    alt="Solana Pay QR Code"
                    width={220}
                    height={220}
                  />
                </div>
              ) : null}

              <p className="text-xs text-zinc-500 text-center">
                {tipAmount === 0 ? "Scan to claim for free" : `Scan to tip ${tipAmount} SOL`}
              </p>

              <div className="w-full pt-2 border-t border-zinc-800">
                <p className="text-[10px] text-zinc-600 font-mono break-all text-center">{payUrl}</p>
              </div>

              <Button
                variant="outline"
                className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                onClick={() => { setSelected(null); setPayUrl(""); }}
              >
                ← Back to Store
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Item Grid */
        <div className="max-w-4xl mx-auto grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card
              key={item.id}
              className="bg-zinc-900 border-zinc-700 hover:border-purple-500/60 transition-colors cursor-pointer group"
              onClick={() => handleSelect(item, 0)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-white text-base leading-snug group-hover:text-purple-300 transition-colors">
                    {item.name}
                  </CardTitle>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border font-medium shrink-0 ${
                      CATEGORY_COLORS[item.category] || "bg-zinc-700 text-zinc-300 border-zinc-600"
                    }`}
                  >
                    {item.category}
                  </span>
                </div>
                <CardDescription className="text-zinc-400 text-sm">{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-green-400 font-semibold text-sm">FREE</span>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-500 text-white text-xs">
                    Get QR ↗
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <p className="text-center text-xs text-zinc-700 mt-12">
        Powered by Solana Pay · godworld.org · Quantum Economics
      </p>
    </div>
  );
}
