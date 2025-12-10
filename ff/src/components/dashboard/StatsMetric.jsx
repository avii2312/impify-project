import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { motion } from "framer-motion";

export default function StatsMetric({ label, value }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="
        flex flex-col items-start text-center sm:text-left
        py-4 sm:py-6 px-2 touch-manipulation
      "
    >
      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
        <AnimatedNumber value={value} />
      </div>

      <p className="text-white/40 text-xs sm:text-sm md:text-base mt-1 leading-tight">
        {label}
      </p>
    </motion.div>
  );
}