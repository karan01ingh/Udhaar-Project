import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Users, CreditCard, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Track Borrowers",
      description: "Keep detailed records of everyone who has borrowed money from you."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Your financial data is encrypted and stored securely with Firebase."
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Payment Tracking",
      description: "Monitor payments, due dates, and outstanding amounts effortlessly."
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Premium Features",
      description: "Advanced analytics, export options, and priority support."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#960018] to-[#7a0013] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Track Your Money
              <br />
              <span className="text-red-200">Udhhar Made Easy</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-red-100 max-w-3xl mx-auto">
              Never lose track of who owes you money. Manage your lending and borrowing 
              with our secure, easy-to-use platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-white text-[#960018] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center space-x-2"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-[#960018] transition-colors"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Udhhar?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built for people who want to maintain trust in their relationships 
              while keeping track of their finances.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-[#960018] rounded-lg flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Take Control?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust Udhhar to manage their lending and borrowing.
            </p>
            <Link
              to="/signup"
              className="bg-[#960018] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#7a0013] transition-colors inline-flex items-center space-x-2"
            >
              <span>Start Free Today</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}