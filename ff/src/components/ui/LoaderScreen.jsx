import React from "react";

export default function LoaderScreen() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="animate-pulse text-white/70">Loading…</div>
    </div>
  );
}