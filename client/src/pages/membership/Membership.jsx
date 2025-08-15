import React, { useState } from "react";
import MembershipModal from "../../components/membership/MembershipModal";
import PricingCard from "../../components/membership/PricingCard";

export default function Membership() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = () => {
    setIsModalOpen(true);
  };

  const handleConfirmPayment = async () => {
    setIsLoading(true);
    try {
      console.log("Redirecting to payment...");
      setTimeout(() => {
        setIsLoading(false);
        setIsModalOpen(false);
      }, 1000);
    } catch (error) {
      console.error("Payment failed:", error);
      setIsLoading(false);
    }
  };

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
