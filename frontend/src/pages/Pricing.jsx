import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Star, Zap, Crown, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import TokenShop from "@/components/gamify/TokenShop";
import { toast } from "sonner";

const Pricing = () => {
  const [tokenShopOpen, setTokenShopOpen] = useState(false);

  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "/month",
      description: "Perfect for getting started",
      features: [
        "100 tokens/month",
        "5 uploads/day",
        "10 chats/day",
        "Basic AI models",
        "Community access",
        "Email support"
      ],
      buttonText: "Current Plan",
      buttonVariant: "outline",
      popular: false
    },
    {
      name: "Premium",
      price: "₹99",
      period: "/month",
      description: "For serious learners and professionals",
      features: [
        "Unlimited uploads & chats",
        "GPT-4o AI model",
        "Priority processing",
        "Advanced analytics",
        "Premium support",
        "Early access to features"
      ],
      buttonText: "Upgrade to Premium",
      buttonVariant: "default",
      popular: true
    }
  ];

  const tokenPacks = [
    { tokens: 100, price: 19, popular: false },
    { tokens: 300, price: 39, popular: true },
    { tokens: 1000, price: 99, popular: false }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="relative px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
            >
              Choose Your{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Learning Plan
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Unlock your potential with AI-powered study tools. Choose the plan that fits your learning journey.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-card border rounded-2xl p-8 ${
                  plan.popular
                    ? "border-primary shadow-lg shadow-primary/20"
                    : "border-border"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                      <Star size={16} fill="currentColor" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check size={20} className="text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={plan.buttonVariant}
                  size="lg"
                  disabled={plan.name === "Free"}
                >
                  {plan.buttonText}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Token Packs Section */}
      <div className="px-4 sm:px-6 py-16 sm:py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Need Extra Tokens?
            </h2>
            <p className="text-lg text-muted-foreground mb-12">
              Top up your account with additional tokens for uninterrupted learning
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {tokenPacks.map((pack, index) => (
                <motion.div
                  key={pack.tokens}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative bg-card border rounded-xl p-6 text-center ${
                    pack.popular
                      ? "border-primary shadow-lg shadow-primary/20"
                      : "border-border"
                  }`}
                >
                  {pack.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                        Best Value
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Coins size={24} className="text-yellow-500" />
                    <span className="text-2xl font-bold">{pack.tokens}</span>
                  </div>

                  <div className="text-3xl font-bold mb-4">₹{pack.price}</div>

                  <Button
                    className="w-full"
                    variant={pack.popular ? "default" : "outline"}
                    onClick={() => setTokenShopOpen(true)}
                  >
                    Buy Now
                  </Button>
                </motion.div>
              ))}
            </div>

            <p className="text-sm text-muted-foreground">
              Tokens never expire and can be used for any AI-powered features
            </p>
          </motion.div>
        </div>
      </div>

      {/* Token Shop Modal */}
      <TokenShop
        open={tokenShopOpen}
        onClose={() => setTokenShopOpen(false)}
      />
    </div>
  );
};

export default Pricing;