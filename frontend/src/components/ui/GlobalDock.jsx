import React from "react";
import { NavLink, useLocation } from "react-router-dom";
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
  Sparkles,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: Home, label: "Home", color: "from-blue-500 to-cyan-500" },
  { to: "/notes", icon: FileText, label: "Notes", color: "from-emerald-500 to-teal-500" },
  { to: "/flashcards", icon: BrainCircuit, label: "Cards", color: "from-purple-500 to-pink-500" },
  { to: "/analysis", icon: BarChart3, label: "Analysis", color: "from-orange-500 to-red-500" },
  { to: "/chat", icon: MessageSquare, label: "Chat", color: "from-indigo-500 to-purple-500" },
  { to: "/community", icon: Users, label: "Community", color: "from-pink-500 to-rose-500" },
  { to: "/support", icon: Headphones, label: "Support", color: "from-amber-500 to-orange-500" },
  { to: "/profile", icon: UserCircle, label: "Profile", color: "from-slate-500 to-slate-600" },
];

const DockItem = ({ item, isActive }) => {
  const Icon = item.icon;

  return (
    <NavLink to={item.to} className="relative group">
      <motion.div
        whileHover={{ y: -8, scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="relative"
      >
        {/* Glow effect on hover/active */}
        <motion.div
          initial={false}
          animate={{
            opacity: isActive ? 0.5 : 0,
            scale: isActive ? 1 : 0.8,
          }}
          className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${item.color} blur-xl`}
        />

        {/* Icon container */}
        <div
          className={`
            relative p-3 rounded-2xl transition-all duration-300
            ${isActive
              ? `bg-gradient-to-br ${item.color} shadow-lg`
              : 'bg-white/[0.05] hover:bg-white/[0.1]'
            }
          `}
        >
          <Icon
            size={22}
            className={`transition-colors duration-300 ${
              isActive ? 'text-white' : 'text-white/60 group-hover:text-white'
            }`}
          />
        </div>

        {/* Active indicator dot */}
        {isActive && (
          <motion.div
            layoutId="dockIndicator"
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}

        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 rounded-lg bg-slate-800/90 backdrop-blur-sm text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          {item.label}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800/90" />
        </div>
      </motion.div>
    </NavLink>
  );
};

const GlobalDock = () => {
  const location = useLocation();

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.5 }}
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[100] md:bottom-6"
    >
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-2xl opacity-50" />

      {/* Dock container */}
      <div className="relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-3 sm:py-4 rounded-[2rem] bg-slate-900/70 backdrop-blur-2xl border border-white/[0.08] shadow-2xl">
        {/* Shiny top edge */}
        <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Inner shadow for depth */}
        <div className="absolute inset-0 rounded-[2rem] shadow-[inset_0_-8px_20px_rgba(0,0,0,0.3)]" />

        {/* Navigation items */}
        <div className="relative flex items-center gap-1.5 sm:gap-2">
          {navItems.map((item) => (
            <DockItem
              key={item.to}
              item={item}
              isActive={location.pathname === item.to}
            />
          ))}
        </div>

        {/* Separator */}
        <div className="w-px h-8 bg-white/10 mx-1" />

        {/* Special action button */}
        <motion.button
          whileHover={{ y: -8, scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="relative group"
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
          <div className="relative p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg">
            <Sparkles size={22} className="text-white" />
          </div>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 rounded-lg bg-slate-800/90 backdrop-blur-sm text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            AI Assistant
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800/90" />
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default GlobalDock;