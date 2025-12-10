import { motion } from "framer-motion";
import AnimatedNumbers from "react-animated-numbers";

export function AnimatedStat({ label, value, icon: Icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg"
    >
      <div className="flex items-center gap-3 mb-4">
        <Icon className="w-6 h-6 text-blue-400" />
        <span className="text-gray-300 text-sm">{label}</span>
      </div>

      <AnimatedNumbers
        animateToNumber={value}
        fontStyle={{ fontSize: 32, color: "white", fontWeight: "700" }}
        transitions={(index) => ({
          type: "spring",
          duration: index * 0.3,
        })}
      />
    </motion.div>
  );
}