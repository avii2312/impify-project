import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Crown, Check, X } from "lucide-react";

const features = [
  "Unlimited AI chats daily",
  "Priority support",
  "Advanced analytics",
  "Custom AI models",
  "Export without limits",
  "Premium templates"
];

export default function PremiumUpsellModal({ open, onClose, onUpgrade }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border border-white/10 rounded-3xl p-0 max-w-md">
        <div className="relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white z-10"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-t-3xl p-6 text-center">
            <Crown size={48} className="text-black mx-auto mb-3" />
            <h2 className="text-black text-2xl font-bold mb-2">Upgrade to Premium</h2>
            <p className="text-black/80">Unlock unlimited potential</p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Price */}
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-white mb-1">₹99<span className="text-lg text-white/60">/month</span></div>
              <p className="text-white/60 text-sm">Cancel anytime</p>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-6">
              {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-white" />
                  </div>
                  <span className="text-white/90 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              onClick={onUpgrade}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-3 rounded-xl hover:opacity-90 transition"
            >
              Upgrade Now
            </button>

            <p className="text-white/50 text-xs text-center mt-3">
              Secure payment • Instant activation
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}