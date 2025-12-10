export default function StreakWidget({ streak=0 }){
  // compute next milestone progress: 10,20,30
  const milestones = [10,20,30];
  const next = milestones.find(m => streak < m) || 30;
  const pct = Math.min((streak/next)*100,100);
  return (
    <div className="bg-white/5 p-3 rounded-xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">🔥 {streak}-day streak</div>
          <div className="text-xs text-white/60">Progress to {next} day milestone</div>
        </div>
        <div className="w-24">
          <div className="h-2 bg-white/10 rounded">
            <div style={{width:`${pct}%`}} className="h-full bg-amber-400 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}