import { useState } from "react";
import { useGamification } from "./GamificationProvider";
import TokenBalance from "./TokenBalance";

// Example chat component showing how to trigger animations
export default function ChatWithAnimations({ onSendMessage }) {
  const [message, setMessage] = useState("");
  const [tokens, setTokens] = useState(150);
  const { showStreakPopup, showXPGain, showTokenDeduction, showPremiumUpsell } = useGamification();

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      // Simulate API call
      const response = await onSendMessage(message);

      // Trigger animations based on response
      if (response.streakIncreased) {
        showStreakPopup(response.newStreak);
      }

      if (response.xpGained) {
        showXPGain(response.xpGained);
      }

      if (response.tokensSpent) {
        showTokenDeduction(response.tokensSpent);
        setTokens(prev => prev - response.tokensSpent);
      }

      if (response.showPremiumUpsell) {
        // Show upsell after 3 token spends
        setTimeout(() => showPremiumUpsell(), 2000);
      }

      setMessage("");
    } catch (error) {
      if (error.response?.data?.error === "no_tokens") {
        showPremiumUpsell();
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with token balance */}
      <div className="flex justify-between items-center p-4 border-b border-white/10">
        <h2 className="text-white font-semibold">AI Chat</h2>
        <TokenBalance tokens={tokens} />
      </div>

      {/* Chat messages area */}
      <div className="flex-1 p-4 space-y-4">
        {/* Chat messages would go here */}
        <div className="text-white/60 text-center">Start a conversation...</div>
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me anything..."
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-blue-400"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}