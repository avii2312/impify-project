import React from "react";
import { motion } from "framer-motion";

/* ---------------------------
   CARD STACK (Hero small)
   --------------------------- */
const CardStack = ({ name = "Study Notes" }) => {
  return (
    <div className="relative w-full max-w-xl h-48">
      <div className="absolute -left-6 -top-6 w-36 h-36 rounded-xl bg-indigo-600/20 blur-2xl" />
      <div className="absolute -right-4 bottom-4 w-28 h-28 rounded-xl bg-purple-600/12 blur-2xl" />
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="absolute left-6 top-8 transform -rotate-2 w-[86%] h-32 rounded-2xl bg-gradient-to-br from-white/4 to-white/3 border border-white/4 p-4"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs text-slate-300">Recent Upload</div>
            <div className="text-lg font-semibold text-foreground">Question Paper — {name}</div>
            <div className="text-sm text-slate-300 mt-2 line-clamp-2">
              Short summary: topics covered — AI algorithms, evaluation, time management tips.
            </div>
          </div>
          <div className="ml-4 text-slate-200">3 min</div>
        </div>
      </motion.div>
      <div className="absolute left-10 top-16 rotate-1 w-[82%] h-32 rounded-2xl bg-white/3 border border-white/4 p-4" />
    </div>
  );
};

export default CardStack;