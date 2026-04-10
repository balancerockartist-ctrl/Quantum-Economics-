import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MOCK_CREDIT = {
  ip_assets: [
    { id: "ip-1", name: "Quantum Economics IP", description: "Core IP for Quantum Economics theory", estimated_value: 250000, token_symbol: "QEI" },
    { id: "ip-2", name: "Blue Star v2026 Code", description: "Music generation algorithm & compositions", estimated_value: 75000, token_symbol: "BSC" },
    { id: "ip-3", name: "GOS System", description: "Godworld Operating System architecture", estimated_value: 180000, token_symbol: "GOS" },
    { id: "ip-4", name: "Claudia AI", description: "AI training data, prompts & fine-tuning corpus", estimated_value: 120000, token_symbol: "CAI" },
  ],
  total_credit: 375000,
  available_credit: 300000,
  receivables_stream: 1420.5,
};

const MOCK_RECEIVABLES = [
  { id: "r1", source: "FreePay Tips – Music Pack", amount: 320.5, date: "2025-07-10", status: "Settled" },
  { id: "r2", source: "FreePay Tips – Whitepaper", amount: 540.0, date: "2025-07-11", status: "Settled" },
  { id: "r3", source: "FreePay Tips – Art Pack", amount: 215.0, date: "2025-07-12", status: "Pending" },
  { id: "r4", source: "FreePay Tips – AI Library", amount: 345.0, date: "2025-07-13", status: "Streaming" },
];

function fmt(n) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const STATUS_COLORS = {
  Settled: "bg-green-500/20 text-green-300 border-green-500/30",
  Pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Streaming: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
};

export default function CreditLine() {
  const [data, setData] = useState(MOCK_CREDIT);

  useEffect(() => {
    axios
      .get(`${API}/store/credit-line`)
      .then((res) => setData(res.data))
      .catch(() => {});
  }, []);

  const totalIP = data.ip_assets.reduce((s, a) => s + a.estimated_value, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white px-4 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-1 text-cyan-400 text-sm font-medium mb-4">
            🏦 Digital Credit Line
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Intellectual{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Wealth Statement
            </span>
          </h1>
          <p className="text-zinc-400 text-lg">IP Pledging · Tokenized Receivables · Quantum Economics</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total IP Value", value: `$${fmt(totalIP)}`, color: "text-white" },
            { label: "Total Credit Line", value: `$${fmt(data.total_credit)}`, color: "text-cyan-400" },
            { label: "Available Credit", value: `$${fmt(data.available_credit)}`, color: "text-green-400" },
            { label: "Receivables Stream", value: `$${fmt(data.receivables_stream)}`, color: "text-purple-400" },
          ].map((s) => (
            <Card key={s.label} className="bg-zinc-900 border-zinc-700">
              <CardContent className="pt-4 pb-4">
                <p className="text-xs text-zinc-500 mb-1">{s.label}</p>
                <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* IP Asset Portfolio */}
        <Card className="bg-zinc-900 border-zinc-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">IP Asset Portfolio</CardTitle>
            <CardDescription className="text-zinc-400">Tokenized intellectual property pledged as collateral</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.ip_assets.map((asset) => (
                <div key={asset.id} className="flex items-center justify-between p-3 bg-zinc-800/60 rounded-lg border border-zinc-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-xs font-bold">
                      {asset.token_symbol.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{asset.name}</p>
                      <p className="text-xs text-zinc-500">{asset.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-cyan-400">${fmt(asset.estimated_value)}</p>
                    <p className="text-xs text-zinc-600 font-mono">${asset.token_symbol}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tokenized Receivables */}
        <Card className="bg-zinc-900 border-zinc-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Tokenized Receivables</CardTitle>
            <CardDescription className="text-zinc-400">FreePay tip streams converted to on-chain receivables</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {MOCK_RECEIVABLES.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-3 bg-zinc-800/60 rounded-lg border border-zinc-700/50">
                  <div>
                    <p className="text-sm font-medium text-white">{r.source}</p>
                    <p className="text-xs text-zinc-500">{r.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_COLORS[r.status]}`}>
                      {r.status}
                    </span>
                    <p className="text-sm font-semibold text-green-400">${fmt(r.amount)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Statement of Intellectual Wealth */}
        <Card className="bg-zinc-900 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white">Statement of Intellectual Wealth</CardTitle>
            <CardDescription className="text-zinc-400">Quantum Economics balance sheet — IP as primary capital asset</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {[
                { label: "Gross IP Asset Value", value: `$${fmt(totalIP)}`, strong: false },
                { label: "Tokenized Receivables (YTD)", value: `$${fmt(data.receivables_stream)}`, strong: false },
                { label: "Total Intellectual Assets", value: `$${fmt(totalIP + data.receivables_stream)}`, strong: true },
                { label: "Credit Line Extended (60%)", value: `$${fmt(data.total_credit)}`, strong: false },
                { label: "Available Credit (80% of line)", value: `$${fmt(data.available_credit)}`, strong: true },
              ].map((row) => (
                <div key={row.label} className={`flex justify-between py-2 ${row.strong ? "border-t border-zinc-700 font-semibold" : ""}`}>
                  <span className={row.strong ? "text-white" : "text-zinc-400"}>{row.label}</span>
                  <span className={row.strong ? "text-cyan-400" : "text-zinc-300"}>{row.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="text-center text-xs text-zinc-700 mt-12">
        Quantum Economics · IP Pledging Framework · godworld.org
      </p>
    </div>
  );
}
