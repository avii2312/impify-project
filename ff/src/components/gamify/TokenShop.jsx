import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Coins, Loader2 } from "lucide-react";
import { useState } from "react";
import axiosInstance from "@/api/axios";
import { ENDPOINTS } from "@/api/api";
import { toast } from "sonner";

const packs = [
  { tokens: 100, price: 19, id: "pack_100" },
  { tokens: 300, price: 39, id: "pack_300" },
  { tokens: 1000, price: 99, id: "pack_1000" },
];

export default function TokenShop({ open, onClose }) {
  const [loading, setLoading] = useState(null);

  const handlePurchase = async (pack) => {
    try {
      setLoading(pack.id);

      // Initiate purchase
      const response = await axiosInstance.post(ENDPOINTS.tokenPurchaseInitiate, {
        pack_id: pack.id,
        amount: pack.price,
        tokens: pack.tokens
      });

      if (response.data.payment_url) {
        // Redirect to payment gateway
        window.location.href = response.data.payment_url;
      } else {
        toast.error("Payment initiation failed");
      }
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error(error.response?.data?.error || "Purchase failed");
    } finally {
      setLoading(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card rounded-3xl border border-border p-6 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">Buy Tokens</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {packs.map((pack, i) => (
            <button
              key={i}
              className="w-full bg-muted/50 border border-border rounded-xl p-4 flex justify-between items-center hover:bg-muted transition disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handlePurchase(pack)}
              disabled={loading === pack.id}
            >
              <div className="flex items-center gap-2">
                <Coins className="text-yellow-500" size={20} />
                <span className="font-semibold">{pack.tokens} Tokens</span>
              </div>
              <div className="flex items-center gap-2">
                {loading === pack.id && <Loader2 size={16} className="animate-spin" />}
                <span className="text-green-600 font-bold">₹{pack.price}</span>
              </div>
            </button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Tokens never expire and can be used for any AI-powered features
        </p>
      </DialogContent>
    </Dialog>
  );
}