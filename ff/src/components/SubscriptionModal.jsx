import React, { useState, useEffect } from 'react';
import { X, Check, Zap, Crown, Star, Sparkles } from 'lucide-react';
import axiosInstance from '@/api/axios';
import { toast } from 'sonner';

const SubscriptionModal = ({ isOpen, onClose, currentPlan = 'free' }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchPlans();
    }
  }, [isOpen]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/subscriptions/plans');
      setPlans(response.data.plans);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
      // Fallback plans if API fails
      setPlans([
        {
          id: 'free',
          name: 'Free',
          price: 0,
          currency: 'INR',
          period: 'forever',
          features: ['100 tokens per month', '5 uploads per day', '10 chats per day', 'Basic AI features', 'Community access'],
        },
        {
          id: 'basic',
          name: 'Basic',
          price: 199,
          currency: 'INR',
          period: 'month',
          features: ['500 tokens per month', '20 uploads per day', '50 chats per day', 'Priority AI processing', 'Email support'],
        },
        {
          id: 'pro',
          name: 'Pro',
          price: 499,
          currency: 'INR',
          period: 'month',
          features: ['2000 tokens per month', 'Unlimited uploads', 'Unlimited chats', 'Advanced AI features', 'Priority support', 'Early access to new features'],
        },
        {
          id: 'premium',
          name: 'Premium',
          price: 999,
          currency: 'INR',
          period: 'month',
          features: ['Unlimited tokens', 'Unlimited uploads', 'Unlimited chats', 'GPT-4o access', 'API access', '24/7 Priority support', 'Custom integrations'],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = async (plan) => {
    if (plan.id === currentPlan) {
      toast.info('You are already on this plan');
      return;
    }

    setSelectedPlan(plan.id);
    setProcessing(true);

    try {
      const response = await axiosInstance.post('/subscriptions/subscribe', {
        plan_id: plan.id,
      });

      if (response.data.payment_required) {
        // Handle payment flow - integrate with Razorpay or your payment gateway
        handlePayment(response.data.order, plan);
      } else {
        // Free plan - already activated
        toast.success(response.data.message);
        onClose();
        window.location.reload(); // Refresh to update UI
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error(error.response?.data?.error || 'Failed to process subscription');
    } finally {
      setProcessing(false);
      setSelectedPlan(null);
    }
  };

  const handlePayment = async (order, plan) => {
    // Example Razorpay integration
    // You'll need to add Razorpay script to your index.html:
    // <script src="https://checkout.razorpay.com/v1/checkout.js"></script>

    if (typeof window.Razorpay === 'undefined') {
      // Fallback: simulate payment for demo
      toast.info('Payment gateway not configured. Simulating payment...');

      setTimeout(async () => {
        try {
          await axiosInstance.post('/subscriptions/confirm', {
            order_id: order.order_id,
            payment_id: `pay_demo_${Date.now()}`,
            plan_id: plan.id,
          });
          toast.success(`Successfully subscribed to ${plan.name} plan!`);
          onClose();
          window.location.reload();
        } catch (error) {
          toast.error('Failed to confirm subscription');
        }
      }, 2000);
      return;
    }

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Add this to your .env
      amount: order.amount * 100, // Razorpay expects amount in paise
      currency: order.currency,
      name: 'Impify',
      description: `${plan.name} Plan Subscription`,
      order_id: order.order_id,
      handler: async function (response) {
        try {
          await axiosInstance.post('/subscriptions/confirm', {
            order_id: order.order_id,
            payment_id: response.razorpay_payment_id,
            plan_id: plan.id,
          });
          toast.success(`Successfully subscribed to ${plan.name} plan!`);
          onClose();
          window.location.reload();
        } catch (error) {
          toast.error('Failed to confirm subscription');
        }
      },
      prefill: {
        email: '', // Add user email here
      },
      theme: {
        color: '#6366f1',
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const getPlanIcon = (planId) => {
    switch (planId) {
      case 'free':
        return <Zap className="w-6 h-6" />;
      case 'basic':
        return <Star className="w-6 h-6" />;
      case 'pro':
        return <Sparkles className="w-6 h-6" />;
      case 'premium':
        return <Crown className="w-6 h-6" />;
      default:
        return <Zap className="w-6 h-6" />;
    }
  };

  const getPlanColor = (planId) => {
    switch (planId) {
      case 'free':
        return 'from-gray-500 to-gray-600';
      case 'basic':
        return 'from-blue-500 to-blue-600';
      case 'pro':
        return 'from-purple-500 to-purple-600';
      case 'premium':
        return 'from-amber-500 to-orange-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Choose Your Plan
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Select the plan that best fits your needs
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Plans Grid */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative flex flex-col p-6 rounded-2xl border-2 transition-all duration-300 ${
                    currentPlan === plan.id
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
                  } ${plan.id === 'pro' ? 'ring-2 ring-purple-500 ring-offset-2' : ''}`}
                >
                  {/* Popular Badge */}
                  {plan.id === 'pro' && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-500 text-white text-xs font-semibold rounded-full">
                      Most Popular
                    </div>
                  )}

                  {/* Current Plan Badge */}
                  {currentPlan === plan.id && (
                    <div className="absolute -top-3 right-4 px-3 py-1 bg-indigo-500 text-white text-xs font-semibold rounded-full">
                      Current Plan
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${getPlanColor(plan.id)} text-white mb-4`}>
                    {getPlanIcon(plan.id)}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {plan.name}
                  </h3>

                  {/* Price */}
                  <div className="mt-4 mb-6">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {plan.price === 0 ? 'Free' : `₹${plan.price}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-500 dark:text-gray-400">
                        /{plan.period}
                      </span>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="flex-1 space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Action Button */}
                  <button
                    onClick={() => handleSelectPlan(plan)}
                    disabled={processing || currentPlan === plan.id}
                    className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                      currentPlan === plan.id
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                        : plan.id === 'pro'
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 shadow-lg hover:shadow-purple-500/25'
                        : 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700'
                    } ${processing && selectedPlan === plan.id ? 'opacity-75' : ''}`}
                  >
                    {processing && selectedPlan === plan.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Processing...
                      </span>
                    ) : currentPlan === plan.id ? (
                      'Current Plan'
                    ) : plan.price === 0 ? (
                      'Downgrade'
                    ) : (
                      'Upgrade Now'
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            All plans include a 7-day money-back guarantee. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;