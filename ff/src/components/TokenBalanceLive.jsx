import React, { useEffect, useState } from "react";
import { initSocket } from "@/lib/socket";
import axiosInstance from "@/api/axios";

export default function TokenBalanceLive({ user }) {
  const [tokens, setTokens] = useState(user?.tokens || 0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const socket = initSocket(token);

    socket.on("connect", () => {
      socket.emit("join", { user_id: user.id });
    });

    socket.on("user_event", (payload) => {
      if (payload.user_id !== user.id) return;
      if (payload.type === "payment_success") {
        setTokens(payload.new_token_balance);
      }
      if (payload.type === "subscription_updated") {
        // optionally refresh subscription UI
        fetchStats();
      }
    });

    // Polling fallback
    let poll = setInterval(() => {
      if (!socket.connected) fetchStats();
    }, 30000);

    async function fetchStats() {
      try {
        const res = await axiosInstance.get("/api/user/token-info");
        setTokens(res.data.tokens || 0);
      } catch (e) { /* ignore */ }
    }

    return () => {
      clearInterval(poll);
      socket?.off('user_event');
    };
  }, [user?.id]);

  return <div className="px-3 py-1 rounded bg-white/5">{tokens} Tokens</div>;
}