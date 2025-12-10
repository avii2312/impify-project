import React, { useEffect, useState } from "react";
import axiosInstance from "@/api/axios";
import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminPayments({ onLogout }) {
  const [payments, setPayments] = useState([]);

  useEffect(() => { fetchPayments(); }, []);

  async function fetchPayments() {
    const res = await axiosInstance.get("/admin/payments");
    setPayments(res.data.payments || []);
  }

  async function exportCsv() {
    const res = await axiosInstance.get("/admin/export/payments.csv", { responseType: "blob" });
    const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "payments.csv");
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Payments</h2>
            <Button onClick={exportCsv} className="bg-white/10 hover:bg-white/20">Export CSV</Button>
          </div>
          <div className="space-y-3">
            {payments.map(p => (
              <div key={p.id} className="p-4 bg-white/5 rounded-xl border border-white/10 flex justify-between hover:bg-white/10 transition-colors">
                <div>
                  <div className="text-sm font-medium">{p.user_id || "—"}</div>
                  <div className="text-xs text-white/60">{p.provider} • {p.provider_payment_id}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-400">₹{p.amount_in_inr}</div>
                  <div className="text-xs text-white/60">{new Date(p.created_at).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}