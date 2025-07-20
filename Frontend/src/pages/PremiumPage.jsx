import React, { useState } from 'react';
import { Check, Crown, Star, Zap, Shield, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function PremiumPage() {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [loading, setLoading] = useState(false);

  const plans = {
    monthly: {
      price: 199,
      period: 'month',
      savings: null
    },
    yearly: {
      price: 1999,
      period: 'year',
      savings: '17% off'
    }
  };

  const features = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Advanced Analytics',
      description: 'Detailed insights into your lending patterns and payment history'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Enhanced Security',
      description: 'Advanced encryption and backup features for your data'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Automated Reminders',
      description: 'Set up automatic payment reminders via email and SMS'
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Priority Support',
      description: '24/7 customer support with faster response times'
    }
  ];

  const premiumFeatures = [
    'Unlimited borrower records',
    'Advanced analytics dashboard',
    'Automated payment reminders',
    'Export data to Excel/PDF',
    'Custom payment categories',
    'Multi-currency support',
    'Priority customer support',
    'Advanced reporting tools',
    'Data backup & recovery',
    'Mobile app access'
  ];

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated payment
      // toast.success('Premium upgrade successful! Welcome to Premium!');
      toast.success('Premium functionality is comming soon!');
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-[#960018] to-[#7a0013] rounded-full">
              <Crown className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Upgrade to <span className="text-[#960018]">Premium</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Unlock powerful features to better manage your lending and borrowing relationships
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-[#960018] bg-opacity-10 rounded-lg flex items-center justify-center text-white mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Pricing Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-[#960018] to-[#7a0013] p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-2">Choose Your Plan</h2>
            <p className="text-red-100">Start your premium experience today</p>
          </div>

          <div className="p-8">
            {/* Plan Toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-100 p-1 rounded-lg flex">
                <button
                  onClick={() => setSelectedPlan('monthly')}
                  className={`px-6 py-2 rounded-md font-medium transition-colors ${
                    selectedPlan === 'monthly'
                      ? 'bg-[#960018] text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setSelectedPlan('yearly')}
                  className={`px-6 py-2 rounded-md font-medium transition-colors relative ${
                    selectedPlan === 'yearly'
                      ? 'bg-[#960018] text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Yearly
                  {plans.yearly.savings && (
                    <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      {plans.yearly.savings}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pricing */}
              <div className="text-center lg:text-left">
                <div className="mb-8">
                  <div className="flex items-baseline justify-center lg:justify-start mb-2">
                    <span className="text-5xl font-bold text-gray-900">₹{plans[selectedPlan].price}</span>
                    <span className="text-xl text-gray-600 ml-2">/{plans[selectedPlan].period}</span>
                  </div>
                  {selectedPlan === 'yearly' && (
                    <p className="text-green-600 font-medium">Save ₹390 per year!</p>
                  )}
                </div>

                <button
                  onClick={handleUpgrade}
                  disabled={loading}
                  className="w-full bg-[#960018] text-white py-4 px-8 rounded-xl font-semibold text-lg hover:bg-[#7a0013] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#960018] disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-6"
                >
                  {loading ? 'Processing...' : 'Upgrade to Premium'}
                </button>

                <p className="text-sm text-gray-600">
                  Secure payment powered by Stripe. Cancel anytime.
                </p>
              </div>

              {/* Features List */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Everything included:</h3>
                <div className="space-y-3">
                  {premiumFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600 text-sm">Yes, you can cancel your subscription at any time. No questions asked.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Is my data secure?</h3>
              <p className="text-gray-600 text-sm">Absolutely! We use bank-level encryption to protect your data.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600 text-sm">Yes, we offer a 30-day money-back guarantee if you're not satisfied.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Need help?</h3>
              <p className="text-gray-600 text-sm">Our premium support team is available 24/7 to assist you.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
