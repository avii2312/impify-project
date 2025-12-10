import { motion } from "framer-motion";
export default function XPBar({ xp=0, level=1 }){
  // Calculate XP needed for current level (level * 100)
  const currentLevelXP = (level - 1) * 100;
  // Calculate XP needed for next level
  const nextLevelXP = level * 100;
  // Calculate progress within current level
  const progressInLevel = xp - currentLevelXP;
  const xpNeededForLevel = nextLevelXP - currentLevelXP;
  const progress = Math.min((progressInLevel / xpNeededForLevel) * 100, 100);
  
  return (
    <div className="bg-white/5 p-3 rounded-xl">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2"><span className="font-bold">Level {level}</span></div>
        <div className="text-xs text-white/60">{xp} XP</div>
      </div>
      <div className="h-2 bg-white/10 rounded">
        <motion.div initial={{width:0}} animate={{width:`${progress}%`}} className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded"/>
      </div>
      <div className="text-xs text-white/40 mt-1">
        {progressInLevel}/{xpNeededForLevel} XP to Level {level + 1}
      </div>
    </div>
  );
}