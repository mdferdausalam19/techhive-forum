import React, { useState } from "react";
import MembershipModal from "../../components/membership/MembershipModal";
import PricingCard from "../../components/membership/PricingCard";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import useRole from "../../hooks/useRole";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

export default function Membership() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading } = useAuth();
  const { role, isLoading: roleLoading } = useRole();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const handleUpgrade = () => {
    setIsModalOpen(true);
  };

  const handleConfirmPayment = async (formData) => {
    setIsLoading(true);
    try {
      const paymentInfo = {
        uid: user.uid,
        cardNumber: formData.cardNumber,
        cardName: formData.cardName,
        expiryDate: formData.expiryDate,
        cvv: formData.cvv,
      };
      await axiosSecure.post("/payments", paymentInfo);
      await axiosSecure.patch("/upgrade", { uid: user.uid });
      toast.success("Payment successful!");
      setIsLoading(false);
      setIsModalOpen(false);
      navigate("/posts");
    } catch (error) {
      console.error("Payment failed:", error);
      toast.error("Payment failed!");
      setIsLoading(false);
    }
  };

  if (roleLoading || loading) {
    return <LoadingSpinner />;
  }

  if (role === "Premium") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center max-w-2xl p-8 bg-white rounded-xl shadow-lg">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            You're a Premium Member!
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Thank you for being a valued TechHive Premium member. Enjoy all the
            exclusive benefits!
          </p>
          <Link
            to="/ai-assistant"
            className="bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold py-3 px-8 rounded-full hover:opacity-90 transition duration-300 transform hover:scale-105"
          >
            Go to AI Assistant
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <div className="text-center py-14 bg-gradient-to-r from-blue-600 to-blue-400 text-white mb-10 shadow">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-extrabold mb-3">
            Upgrade to TechHive Premium
          </h1>
          <p className="text-lg max-w-xl mx-auto">
            Unlock exclusive features, dive into AI-enhanced discussions, and
            enjoy priority-supported community experience.
          </p>
        </div>
      </div>

      {/* Pricing Card */}
      <PricingCard onUpgrade={handleUpgrade} />

      {/* Membership Modal */}
      <MembershipModal
        isOpen={isModalOpen}
        onClose={() => !isLoading && setIsModalOpen(false)}
        onConfirm={handleConfirmPayment}
      />
    </div>
  );
}
