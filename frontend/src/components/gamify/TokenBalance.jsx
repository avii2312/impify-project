import { Coins, Clock } from "lucide-react";

export default function TokenBalance({ tokens = 0, monthlyTokens = 0, daysUntilReset = 0 }) {
  return (
    <div className="flex items-center gap-3 bg-card/50 px-3 py-2 rounded-xl border border-border backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Coins size={18} className="text-yellow-400" />
        <span className="text-foreground font-semibold text-sm">{tokens}</span>
      </div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Clock size={12} />
        <span>{daysUntilReset}d</span>
      </div>
    </div>
  );
}