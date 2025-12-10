import React, { useEffect, useState } from "react";
import axiosInstance from "@/api/axios";
import { Button } from "@/components/ui/button";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminTokens({ onLogout }) {
  const [packs, setPacks] = useState([]);

  useEffect(() => { fetchPacks(); }, []);

  async function fetchPacks() {
    const res = await axiosInstance.get("/token-packs");
    setPacks(res.data.token_packs || []);
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 -z-20 pointer-events-none opacity-60">
        <div className="absolute w-[600px] h-[600px] bg-purple-600/30 blur-[160px] rounded-full -top-40 -left-20 animate-pulse-slow"></div>
        <div className="absolute w-[600px] h-[600px] bg-blue-600/40 blur-[190px] rounded-full bottom-10 right-0 animate-pulse-slower"></div>
      </div>

      <AdminSidebar onLogout={onLogout} />

      <div className="p-6">
        <div className="max-w-7xl mx-auto ml-80">
          <h2 className="text-2xl font-bold mb-6">Token Packs</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {packs.map(p => (
              <div key={p.id} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <div className="text-white font-semibold text-lg">{p.name}</div>
                <div className="text-white/70">₹{p.price_in_inr} • {p.tokens} tokens</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}