// src/components/ui/Dock.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

export const Dock = ({ children, className = "" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {children}
    </div>
  );
};

export const DockIcon = ({ label, icon: Icon, to = "/" }) => {
  const loc = useLocation();
  const active = loc.pathname === to;
  return (
    <Link to={to} className="flex flex-col items-center text-white/80">
      <motion.div
        whileHover={{ y: -6, scale: 1.16 }}
        className={`p-3 rounded-2xl ${active ? "bg-white/12" : "bg-white/6"} backdrop-blur border border-white/8`}
      >
        <Icon size={20} />
      </motion.div>
      <div className="text-xs mt-1">{label}</div>
    </Link>
  );
};