import { motion, AnimatePresence } from "framer-motion";
import { Coins } from "lucide-react";

export default function TokenDeductionAnimation({ show, tokensSpent, onComplete }) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, x: -20 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1.1, 1, 0.9],
            x: [-20, 0, 20, 40]
          }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{
            duration: 1.5,
            times: [0, 0.2, 0.7, 1]
          }}
          className="fixed top-20 right-4 z-50 pointer-events-none"
        >
          <div className="flex items-center gap-2 bg-red-500/90 backdrop-blur-md border border-red-400/50 rounded-xl px-4 py-2 shadow-lg">
            <Coins size={18} className="text-white" />
            <span className="text-white font-bold text-lg">-{tokensSpent}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}