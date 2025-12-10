import React from "react";
import { motion } from "framer-motion";

/**
 * Minimal card stack: shows up to 3 cards stacked with depth.
 * Click top card to pop it (call onNext).
 */
export default function CardStack({ cards = [], onNext = () => {} }) {
  return (
    <div className="relative w-full h-[380px]">
      {cards.slice(0,3).map((c, i) => {
        const z = 20 - i;
        const scale = 1 - i * 0.06;
        const y = i * 18;
        return (
          <motion.div
            key={i}
            className="absolute left-0 right-0 glass-card p-6 cursor-pointer"
            style={{ zIndex: z }}
            initial={{ opacity: 0, y: 60 - i*10 }}
            animate={{ opacity: 1, y }}
            transition={{ delay: i * 0.08 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNext}
          >
            <h3 className="text-xl font-semibold mb-2">{c.question}</h3>
            <p className="text-sm text-muted">{c.hint || ""}</p>
          </motion.div>
        );
      })}
    </div>
  );
}