import { motion, AnimatePresence } from "framer-motion";
import { Flame } from "lucide-react";

export default function StreakPopup({ show, streak, onClose }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          <div className="bg-orange-500/90 backdrop-blur-md border border-orange-400/50 rounded-2xl p-6 text-center shadow-2xl">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              <Flame size={48} className="text-white mx-auto mb-3" />
            </motion.div>
            <h3 className="text-white text-2xl font-bold mb-2">🔥 Streak Extended!</h3>
            <p className="text-white/90 text-lg">{streak}-day streak</p>
            <p className="text-white/70 text-sm mt-1">Keep it up!</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}