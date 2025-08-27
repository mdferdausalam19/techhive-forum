import React, { useState } from "react";
import MembershipModal from "../../components/membership/MembershipModal";
import PricingCard from "../../components/membership/PricingCard";
import useAxiosCommon from "../../hooks/useAxiosCommon";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export default function Membership() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const axiosCommon = useAxiosCommon();
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
      await axiosCommon.post("/payments", paymentInfo);
      await axiosCommon.patch("/upgrade", { uid: user.uid });
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
