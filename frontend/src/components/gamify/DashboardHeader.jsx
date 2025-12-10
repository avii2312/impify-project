import { useState } from "react";
import XPBar from "@/components/gamify/XPBar";
import StreakCounter from "@/components/gamify/StreakCounter";
import TokenBalance from "@/components/gamify/TokenBalance";
import PremiumBadge from "@/components/gamify/PremiumBadge";
import SubscriptionModal from "@/components/SubscriptionModal";

export default function DashboardHeader({ stats, showLevelUpAnimation = false }) {
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  // Determine current plan from subscription data
  const getCurrentPlan = () => {
    return stats.subscription?.plan_id || 'free';
  };

  return (
    <>
      <div className="p-4 flex items-center justify-between">
        <div className="flex gap-4">
          <div
            onClick={() => setIsSubscriptionModalOpen(true)}
            className="cursor-pointer"
          >
            <TokenBalance
              tokens={stats.tokens}
              monthlyTokens={stats.monthly_tokens}
              daysUntilReset={stats.days_until_reset}
            />
          </div>
          <StreakCounter streak={stats.streak} />
        </div>

        <div className="w-1/3">
          <XPBar xp={stats.xp} level={stats.level} showLevelUpAnimation={showLevelUpAnimation} />
        </div>

        {stats.is_premium && <PremiumBadge />}
      </div>

      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        currentPlan={getCurrentPlan()}
      />
    </>
  );
}