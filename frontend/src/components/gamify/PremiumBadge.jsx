import { Crown } from "lucide-react";

export default function PremiumBadge() {
  return (
    <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1 rounded-lg text-black font-bold text-sm shadow">
      <Crown size={16} />
      Premium
    </div>
  );
}