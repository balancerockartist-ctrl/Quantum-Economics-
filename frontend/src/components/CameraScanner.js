import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CATEGORIES = ["Hotel", "Food", "Housing", "Water", "Medical"];

const CATEGORY_META = {
  Hotel:   { icon: "🏨", color: "bg-blue-500/20 text-blue-300 border-blue-500/40" },
  Food:    { icon: "🍽️", color: "bg-orange-500/20 text-orange-300 border-orange-500/40" },
  Housing: { icon: "🏠", color: "bg-purple-500/20 text-purple-300 border-purple-500/40" },
  Water:   { icon: "💧", color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" },
  Medical: { icon: "🏥", color: "bg-red-500/20 text-red-300 border-red-500/40" },
};

const SMART_CONTRACT_CODE = `if (dualC_verified == true) {
  execute_credit_release()
  pool.withdraw(item_price)
  blockchain.confirm(tx)
  lifetime_membership.unlock(24h)
}`;

function fmt(n) {
  return Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const STATUS_COLORS = {
  Confirmed: "bg-green-500/20 text-green-300 border-green-500/30",
  Pending:   "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Failed:    "bg-red-500/20 text-red-300 border-red-500/30",
};

export default function CameraScanner() {
  const [category, setCategory] = useState("Food");
  const [scanState, setScanState] = useState("standby"); // standby | scanning | verified | executing | done
  const [scanResult, setScanResult] = useState(null);
  const [contractResult, setContractResult] = useState(null);
  const [pool, setPool] = useState({ available_pool: 0, daily_capacity_pct: 0, incoming_tips_24h: 0, daily_limit: 500 });
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const scanTimerRef = useRef(null);

  const fetchPool = () => {
    axios.get(`${API}/camera/pool`)
      .then((r) => setPool(r.data))
      .catch(() => {});
  };

  const fetchTransactions = () => {
    axios.get(`${API}/camera/transactions`)
      .then((r) => setTransactions(r.data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchPool();
    fetchTransactions();
    const interval = setInterval(() => {
      fetchPool();
      fetchTransactions();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleScan = () => {
    setError("");
    setScanState("scanning");
    setScanResult(null);
    setContractResult(null);

    // Simulate a 2-second "camera scan" before hitting the API
    scanTimerRef.current = setTimeout(async () => {
      try {
        const res = await axios.post(`${API}/camera/scan`, { category });
        setScanResult(res.data);
        setScanState(res.data.verified ? "verified" : "standby");
        if (!res.data.verified) setError(res.data.message);
      } catch {
        setScanState("standby");
        setError("Scan failed — please try again.");
      }
    }, 2000);
  };

  const handleExecute = async () => {
    if (!scanResult) return;
    setScanState("executing");
    setError("");
    try {
      const res = await axios.post(`${API}/camera/execute-contract`, {
        tx_id: scanResult.tx_id,
        item_price: scanResult.item_price,
      });
      setContractResult(res.data);
      setScanState("done");
      fetchPool();
      fetchTransactions();
    } catch {
      setScanState("verified");
      setError("Contract execution failed — please retry.");
    }
  };

  const handleReset = () => {
    setScanState("standby");
    setScanResult(null);
    setContractResult(null);
    setError("");
  };

  const isScanning = scanState === "scanning";
  const isVerified = scanState === "verified";
  const isExecuting = scanState === "executing";
  const isDone = scanState === "done";

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white px-4 py-10">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-1 text-green-400 text-sm font-medium mb-4">
            📷 Point Camera at Item
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
              Dual C
            </span>{" "}
            Verification
          </h1>
          <p className="text-zinc-400">Scan an item to unlock credit and execute the smart contract.</p>
        </div>

        {/* Category Selector */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); handleReset(); }}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                category === cat
                  ? CATEGORY_META[cat].color + " ring-1 ring-current"
                  : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
              }`}
            >
              <span>{CATEGORY_META[cat].icon}</span> {cat}
            </button>
          ))}
        </div>

        {/* Camera Scan Area */}
        <Card className="bg-zinc-900 border-zinc-700 mb-6">
          <CardContent className="flex flex-col items-center gap-5 py-8">
            {/* Viewfinder */}
            <div className={`relative w-52 h-52 rounded-2xl border-2 flex items-center justify-center overflow-hidden transition-all duration-500 ${
              isScanning ? "border-green-400 shadow-[0_0_24px_#22c55e60]" :
              isVerified || isExecuting ? "border-cyan-400 shadow-[0_0_24px_#22d3ee60]" :
              isDone ? "border-purple-400 shadow-[0_0_24px_#c084fc60]" :
              "border-zinc-600"
            }`}>
              <div className="absolute inset-0 bg-zinc-800/60" />
              {/* Corner brackets */}
              {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos, i) => (
                <span key={i} className={`absolute ${pos} w-5 h-5 border-2 ${
                  isScanning ? "border-green-400" : isVerified || isExecuting ? "border-cyan-400" : isDone ? "border-purple-400" : "border-zinc-500"
                } ${i === 0 ? "border-r-0 border-b-0 rounded-tl" : i === 1 ? "border-l-0 border-b-0 rounded-tr" : i === 2 ? "border-r-0 border-t-0 rounded-bl" : "border-l-0 border-t-0 rounded-br"}`} />
              ))}

              <div className="relative z-10 text-center px-4">
                {isDone ? (
                  <>
                    <div className="text-4xl mb-1">✅</div>
                    <p className="text-green-400 text-sm font-semibold">Credit Released</p>
                  </>
                ) : isVerified || isExecuting ? (
                  <>
                    <div className="text-4xl mb-1">{CATEGORY_META[category].icon}</div>
                    <p className="text-cyan-300 text-sm font-semibold">{scanResult?.item_label}</p>
                    <p className="text-cyan-400 text-xs mt-0.5">${fmt(scanResult?.item_price || 0)}</p>
                  </>
                ) : isScanning ? (
                  <>
                    <div className="text-3xl mb-2 animate-spin">⚙️</div>
                    <p className="text-green-400 text-xs font-mono animate-pulse">SCANNING…</p>
                  </>
                ) : (
                  <>
                    <div className="text-3xl mb-2 text-zinc-500">📷</div>
                    <p className="text-zinc-500 text-xs font-mono">STANDBY</p>
                  </>
                )}
              </div>

              {/* Scan line animation */}
              {isScanning && (
                <div className="absolute inset-x-0 h-0.5 bg-green-400/60 animate-bounce" style={{ top: "50%" }} />
              )}
            </div>

            {/* Scan label */}
            <p className="text-zinc-400 text-sm">
              {isScanning ? "Waiting for camera scan…" :
               isVerified ? "Item identified — ready to execute" :
               isExecuting ? "Executing smart contract…" :
               isDone ? "Transaction complete" :
               "Waiting for camera scan…"}
            </p>

            {/* Action Buttons */}
            {!isScanning && !isExecuting && !isDone && (
              <Button
                onClick={isVerified ? handleExecute : handleScan}
                className={`w-48 ${isVerified ? "bg-cyan-600 hover:bg-cyan-500" : "bg-green-600 hover:bg-green-500"} text-white font-semibold`}
              >
                {isVerified ? "⚡ Execute Contract" : "📷 Start Scan"}
              </Button>
            )}
            {isDone && (
              <Button
                onClick={handleReset}
                variant="outline"
                className="w-48 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              >
                ↩ Scan Another
              </Button>
            )}

            {error && <p className="text-red-400 text-xs text-center">{error}</p>}
          </CardContent>
        </Card>

        {/* Status Badges */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Google Lens Integration", status: "Ready", icon: "🔍" },
            { label: "Sensor Array", status: "Active", icon: "📡" },
            { label: "Block Chain Link", status: "Ready", icon: "⛓️" },
          ].map((s) => (
            <Card key={s.label} className="bg-zinc-900 border-zinc-700">
              <CardContent className="pt-4 pb-4 text-center">
                <div className="text-xl mb-1">{s.icon}</div>
                <p className="text-[10px] text-zinc-500 leading-tight mb-1">{s.label}</p>
                <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 border border-green-500/30 font-medium">
                  {s.status}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Credit Pool & Smart Contract */}
        <Card className="bg-zinc-900 border-zinc-700 mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base">Credit Pool &amp; Smart Contract</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Pool Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-800/60 rounded-lg p-4 border border-zinc-700/50">
                <p className="text-xs text-zinc-500 mb-1">Available Pool</p>
                <p className="text-2xl font-bold text-green-400">${fmt(pool.available_pool)}</p>
                <p className="text-xs text-zinc-600 mt-1">{pool.daily_capacity_pct}% of daily capacity</p>
                {/* Progress bar */}
                <div className="mt-2 h-1.5 rounded-full bg-zinc-700 overflow-hidden">
                  <div
                    className="h-full bg-green-400 transition-all duration-700"
                    style={{ width: `${100 - pool.daily_capacity_pct}%` }}
                  />
                </div>
              </div>
              <div className="bg-zinc-800/60 rounded-lg p-4 border border-zinc-700/50">
                <p className="text-xs text-zinc-500 mb-1">Incoming Tips (24h)</p>
                <p className="text-2xl font-bold text-purple-400">${fmt(pool.incoming_tips_24h)}</p>
                <p className="text-xs text-zinc-600 mt-1">of ${fmt(pool.daily_limit)} daily limit</p>
                <div className="mt-2 h-1.5 rounded-full bg-zinc-700 overflow-hidden">
                  <div
                    className="h-full bg-purple-400 transition-all duration-700"
                    style={{ width: `${pool.daily_capacity_pct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Smart Contract Code */}
            <div>
              <p className="text-xs text-zinc-500 mb-2 font-medium">Smart Contract Execution</p>
              <pre className="bg-zinc-950 border border-zinc-700 rounded-lg p-4 text-xs text-cyan-300 font-mono overflow-x-auto leading-relaxed">
                {SMART_CONTRACT_CODE}
              </pre>
            </div>

            {/* Last execution result */}
            {contractResult && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-sm space-y-1">
                <p className="text-green-300 font-semibold">✅ {contractResult.message}</p>
                <p className="text-zinc-400 text-xs font-mono break-all">TX: {contractResult.tx_hash}</p>
                <p className="text-zinc-400 text-xs">Credit Released: <span className="text-green-400 font-semibold">${fmt(contractResult.credit_released)}</span></p>
                <p className="text-zinc-400 text-xs">Membership Unlocked: <span className="text-cyan-400">24h</span></p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Real-Time Transactions */}
        <Card className="bg-zinc-900 border-zinc-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base">Real-Time Transactions</CardTitle>
            <CardDescription className="text-zinc-500 text-xs">Last 20 on-chain events</CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-zinc-600 text-sm text-center py-4">No transactions yet — scan an item to begin.</p>
            ) : (
              <div className="space-y-2">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 bg-zinc-800/60 rounded-lg border border-zinc-700/50 gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{tx.item_label || "Item"}</p>
                      <p className="text-xs text-zinc-500 font-mono truncate">{tx.tx_hash ? tx.tx_hash.slice(0, 18) + "…" : ""}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_COLORS[tx.status] || "bg-zinc-700 text-zinc-400 border-zinc-600"}`}>
                        {tx.status}
                      </span>
                      <span className="text-sm font-semibold text-green-400">${fmt(tx.amount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>

      <p className="text-center text-xs text-zinc-700 mt-12">
        Dual-C Verification · Google Lens · Blockchain · Quantum Economics
      </p>
    </div>
  );
}
