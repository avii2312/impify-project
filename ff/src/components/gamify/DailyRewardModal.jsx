import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Gift } from "lucide-react";

export default function DailyRewardModal({ open, onClose, reward = 20 }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border border-white/10 rounded-3xl p-6 text-center">
        <Gift size={40} className="text-yellow-400 mx-auto mb-4" />
        <h2 className="text-white text-xl font-bold mb-3">Daily Reward!</h2>
        <p className="text-white/70 mb-4">You've earned <span className="text-yellow-300 font-bold">{reward} Tokens</span> today.</p>
        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700"
        >
          Claim Reward
        </button>
      </DialogContent>
    </Dialog>
  );
}