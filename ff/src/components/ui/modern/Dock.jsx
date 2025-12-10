import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, User, BarChart3, MessageSquare, FileText, Bell } from "lucide-react";

/* ---------------------------
   DOCK ITEM
   --------------------------- */
const DockItem = ({ item = {}, onClick = () => {} }) => {
  const Icon = item.icon || BookOpen;
  const [hover, setHover] = useState(false);

  return (
    <motion.button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className="relative w-12 h-12 rounded-lg flex items-center justify-center"
    >
      <motion.div
        animate={{ scale: hover ? 1.25 : 1, y: hover ? -6 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
          hover
            ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg"
            : "bg-white/4 text-slate-200 border border-white/6"
        }`}
      >
        <Icon className="w-5 h-5" />
      </motion.div>
      {/* tooltip */}
      <AnimatePresence>
        {hover && (
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-xs px-2 py-1 rounded-md text-white"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

/* ---------------------------
   DOCK (bottom center) with OS X slide reveal & magnetic hover
   --------------------------- */
const Dock = ({ items = [], onOpenProfile }) => {
  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-8 z-50">
      <div className="flex items-center gap-3 p-3 rounded-3xl bg-white/6 border border-white/6 shadow-2xl">
        {items.map((it) => (
          <DockItem key={it.key} item={it} onClick={it.onClick} />
        ))}
        <DockItem
          item={{ key: "profile", label: "Profile", icon: User }}
          onClick={onOpenProfile}
        />
      </div>
    </div>
  );
};

export default Dock;