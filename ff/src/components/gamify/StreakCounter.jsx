import { motion } from "framer-motion";
import { Flame } from "lucide-react";

export default function StreakCounter({ streak = 0 }) {
  // Calculate next milestone and progress
  let nextMilestone = 10;
  let progress = 0;

  if (streak >= 30) {
    // Every 30 days after 30
    const baseMilestone = Math.floor(streak / 30) * 30;
    nextMilestone = baseMilestone + 30;
    progress = ((streak - baseMilestone) / 30) * 100;
  } else if (streak >= 20) {
    // 20-29: progress toward 30
    nextMilestone = 30;
    progress = ((streak - 20) / 10) * 100;
  } else if (streak >= 10) {
    // 10-19: progress toward 20
    nextMilestone = 20;
    progress = ((streak - 10) / 10) * 100;
  } else {
    // 0-9: progress toward 10
    nextMilestone = 10;
    progress = (streak / 10) * 100;
  }

  return (
    <motion.div
      className="flex items-center gap-3 px-4 py-2 bg-orange-500/20 border border-orange-400/30 rounded-xl backdrop-blur-sm"
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      <Flame size={20} className="text-orange-400" />
      <div className="flex flex-col">
        <span className="text-foreground font-semibold text-sm">{streak}-day streak</span>
        <div className="w-16 h-1 bg-orange-400/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-orange-400"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className="text-xs text-muted-foreground">Next: {nextMilestone}d</span>
      </div>
    </motion.div>
  );
}