// src/layouts/AppLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import GlobalDock from "@/components/ui/GlobalDock";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-slate-900 text-white relative">
      <div className="pb-20 md:pb-28">
        {/* pushes content so dock never overlaps - smaller padding on mobile */}
        <Outlet />
      </div>

      <GlobalDock />
    </div>
  );
};

export default AppLayout;