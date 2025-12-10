// src/components/ui/GlobalDock.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  FileText,
  BrainCircuit,
  BarChart3,
  MessageSquare,
  UserCircle,
  Users,
  Headphones,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: Home, label: "Dashboard" },
  { to: "/notes", icon: FileText, label: "Notes" },
  { to: "/flashcards", icon: BrainCircuit, label: "Flashcards" },
  { to: "/analysis", icon: BarChart3, label: "Analysis" },
  { to: "/chat", icon: MessageSquare, label: "Chat" },
  { to: "/community", icon: Users, label: "Community" },
  { to: "/support", icon: Headphones, label: "Support" },
  { to: "/profile", icon: UserCircle, label: "Profile" },
];

const GlobalDock = () => {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 md:bottom-6">
      <div className="flex items-center gap-1 sm:gap-2 md:gap-4 px-2 sm:px-3 md:px-6 py-2 sm:py-3 rounded-2xl sm:rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-lg max-w-[95vw] sm:max-w-[90vw] md:max-w-none overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 min-w-max">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className="group relative flex-shrink-0">
              {({ isActive }) => (
                <motion.div
                  whileHover={{ y: -6, scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 touch-manipulation
                    ${isActive ? "bg-white/20 shadow-md" : "bg-white/5"}
                  `}
                >
                  <item.icon
                    size={16}
                    className={`sm:w-[18px] sm:h-[18px] md:w-[22px] md:h-[22px] ${isActive ? "text-blue-400" : "text-white/80"}`}
                  />
                </motion.div>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GlobalDock;