"use client";

import { useAuthStore } from "@/store/authStore";
import ProtectedRoute from "@/components/protectedRoute";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export const url = 'http://localhost:4000';


const PremiumPage = () => {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();

  useEffect(() => {
    const status = searchParams.get('status');
    if (!status) return;

    if (user && status === 'success') {
      toast.success(`Thanks for paying, ${user.name}`);
    } else if (status === 'cancelled') {
      toast.info('Payment cancelled');
    } else if (status === 'error') {
      toast.error('Something went wrong with the payment');
    }
      
    window.history.replaceState({}, '', window.location.pathname);
  }, [searchParams, user]);

  const handleSubscribe = async () => {
    try {
      const response = await axios.post(`${url}/api/payment/session`, {
        userId: user?._id
      }, {
        withCredentials: true
      });
      
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      toast.error("Error Occurred");
    }
  };

  const features = [
    "High quality audio",
    "Playback speed control",
    "Advanced equalizer function",
    "AI-powered song recommendations",
  ];

  return (
    <ProtectedRoute>
      <div className="p-6 space-y-6">
        {/* Decorative Background Element */}
        <div className="fixed top-0 right-0 -z-10 opacity-10">
          <div className="w-96 h-96 bg-gradient-to-r from-purple-500 to-cyan-500 blur-3xl rounded-full"></div>
        </div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Beatify Premium</h1>
          <p className="text-gray-400">
            {user?.plan === "premium" 
              ? "You are currently on Premium plan" 
              : "Upgrade your listening experience"}
          </p>
        </div>

        {/* Plan Card */}
        <div className="max-w-md mx-auto bg-neutral-800/80 backdrop-blur-sm rounded-lg p-6 border border-neutral-700">
          <div className="text-center mb-6">
            <div className="text-2xl font-bold">$1.99/month</div>
            <p className="text-sm text-gray-400">Cancel anytime</p>
          </div>

          {/* Features List */}
          <ul className="space-y-3 mb-6">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center bg-neutral-700/30 p-3 rounded-lg">
                <span className="mr-2 text-cyan-500">✓</span>
                {feature}
              </li>
            ))}
          </ul>

          {/* Subscribe Button */}
          <button 
            onClick={handleSubscribe}
            className={`w-full py-3 rounded-full font-bold mb-4
              ${user?.plan === "premium"
                ? "bg-neutral-600 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-600 to-cyan-500 hover:opacity-90"
              }`}
            disabled={user?.plan === "premium"}
          >
            {user?.plan === "premium" ? "Already Premium" : "Get Premium"}
          </button>

          {/* Payment Methods */}
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-3">Secure payment powered by</p>
            <div className="flex justify-center items-center space-x-4">
              <div className="bg-white p-1 rounded-lg">
                <Image 
                  src="/images/stripe.gif" 
                  alt="Stripe" 
                  width={60} 
                  height={25}
                  className="opacity-80"
                />
              </div>
            </div>
          </div>

          {/* Security Badges */}
          <div className="flex justify-center items-center space-x-3 mt-4 text-xs text-gray-400">
            <div className="flex items-center">
              <span className="mr-1">🔒</span>
              Secure Payment
            </div>
            <div className="flex items-center">
              <span className="mr-1">⚡</span>
              Instant Access
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="max-w-md mx-auto bg-neutral-800/80 backdrop-blur-sm rounded-lg p-6 border border-neutral-700">
          <h2 className="text-xl font-bold text-center mb-4">Compare Plans</h2>
          <table className="w-full text-left text-sm text-gray-400">
            <thead>
              <tr>
                <th className="py-2">Feature</th>
                <th className="py-2">Free</th>
                <th className="py-2">Premium</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-neutral-700 hover:text-white">
                <td className="py-2">High quality audio</td>
                <td className="py-2 text-center">✗</td>
                <td className="py-2 text-center">✓</td>
              </tr>
              <tr className="hover:bg-neutral-700 hover:text-white">
                <td className="py-2">Playback speed control</td>
                <td className="py-2 text-center">✗</td>
                <td className="py-2 text-center">✓</td>
              </tr>
              <tr className="hover:bg-neutral-700 hover:text-white">
                <td className="py-2">Advanced equalizer function</td>
                <td className="py-2 text-center">✗</td>
                <td className="py-2 text-center">✓</td>
              </tr>
              <tr className="hover:bg-neutral-700 hover:text-white">
                <td className="py-2">AI-powered song recommendations</td>
                <td className="py-2 text-center">✗</td>
                <td className="py-2 text-center">✓</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Terms */}
        <div className="text-center text-xs text-gray-400">
          By subscribing you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default PremiumPage;