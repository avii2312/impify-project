import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";

export default function XPGainAnimation({ show, xpGained, onComplete }) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1.2, 1, 0.8],
            y: [20, -50, -80, -100]
          }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{
            duration: 2,
            times: [0, 0.2, 0.8, 1]
          }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
        >
          <div className="flex items-center gap-2 bg-yellow-500/90 backdrop-blur-md border border-yellow-400/50 rounded-xl px-4 py-2 shadow-lg">
            <Star size={20} className="text-white" />
            <span className="text-white font-bold text-lg">+{xpGained} XP</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}