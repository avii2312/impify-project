import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Copy, Share2 } from "lucide-react";
import { toast } from "sonner";

export default function ReferralModal({ open, onClose, code }) {
  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success("Referral code copied!");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border border-white/10 rounded-3xl p-6">
        <h2 className="text-white text-xl font-bold mb-4">Invite & Earn</h2>
        <p className="text-white/70 mb-4">Share this code and earn 50 tokens!</p>

        <div className="flex items-center bg-white/10 px-4 py-3 rounded-xl justify-between">
          <span className="text-white font-semibold">{code}</span>
          <button onClick={copyCode}>
            <Copy className="text-white" size={18} />
          </button>
        </div>

        <button
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl flex items-center justify-center gap-2"
          onClick={() => navigator.share?.({ text: `My Impify Code: ${code}` })}
        >
          <Share2 size={18} />
          Share
        </button>
      </DialogContent>
    </Dialog>
  );
}