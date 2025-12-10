import { createContext, useContext, useState, useEffect } from "react";
import StreakPopup from "./StreakPopup";
import XPGainAnimation from "./XPGainAnimation";
import TokenDeductionAnimation from "./TokenDeductionAnimation";
import PremiumUpsellModal from "./PremiumUpsellModal";

const GamificationContext = createContext();

export function useGamification() {
  return useContext(GamificationContext);
}

export default function GamificationProvider({ children }) {
  const [animations, setAnimations] = useState({
    streakPopup: { show: false, streak: 0 },
    xpGain: { show: false, xpGained: 0 },
    tokenDeduction: { show: false, tokensSpent: 0 },
    premiumUpsell: { show: false }
  });

  const showStreakPopup = (streak) => {
    setAnimations(prev => ({
      ...prev,
      streakPopup: { show: true, streak }
    }));
  };

  const showXPGain = (xpGained) => {
    setAnimations(prev => ({
      ...prev,
      xpGain: { show: true, xpGained }
    }));
  };

  const showTokenDeduction = (tokensSpent) => {
    setAnimations(prev => ({
      ...prev,
      tokenDeduction: { show: true, tokensSpent }
    }));
  };

  const showPremiumUpsell = () => {
    setAnimations(prev => ({
      ...prev,
      premiumUpsell: { show: true }
    }));
  };

  const hideStreakPopup = () => {
    setAnimations(prev => ({
      ...prev,
      streakPopup: { show: false, streak: 0 }
    }));
  };

  const hideXPGain = () => {
    setAnimations(prev => ({
      ...prev,
      xpGain: { show: false, xpGained: 0 }
    }));
  };

  const hideTokenDeduction = () => {
    setAnimations(prev => ({
      ...prev,
      tokenDeduction: { show: false, tokensSpent: 0 }
    }));
  };

  const hidePremiumUpsell = () => {
    setAnimations(prev => ({
      ...prev,
      premiumUpsell: { show: false }
    }));
  };

  const value = {
    showStreakPopup,
    showXPGain,
    showTokenDeduction,
    showPremiumUpsell
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}

      {/* Animation Overlays */}
      <StreakPopup
        show={animations.streakPopup.show}
        streak={animations.streakPopup.streak}
        onClose={hideStreakPopup}
      />

      <XPGainAnimation
        show={animations.xpGain.show}
        xpGained={animations.xpGain.xpGained}
        onComplete={hideXPGain}
      />

      <TokenDeductionAnimation
        show={animations.tokenDeduction.show}
        tokensSpent={animations.tokenDeduction.tokensSpent}
        onComplete={hideTokenDeduction}
      />

      <PremiumUpsellModal
        open={animations.premiumUpsell.show}
        onClose={hidePremiumUpsell}
        onUpgrade={() => {
          hidePremiumUpsell();
          // Handle upgrade logic here
          console.log("Upgrade to premium clicked");
        }}
      />
    </GamificationContext.Provider>
  );
}