import { useState, useEffect } from "react";
import {
  FaLock,
  FaCreditCard,
  FaUser,
  FaCalendarAlt,
  FaShieldAlt,
} from "react-icons/fa";

export default function MembershipModal({ isOpen, onClose, onConfirm }) {
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle click on overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Format card number with spaces after every 4 digits
    if (name === "cardNumber") {
      const formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{4})(?=\d)/g, "$1 ")
        .trim();
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    }
    // Format expiry date as MM/YY
    else if (name === "expiryDate") {
      const formattedValue = value
        .replace(/\D/g, "")
        .replace(/^(\d{2})/, "$1/")
        .replace(/\/(\d{2})\//, "/$1");
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    }
    // Only allow numbers for CVV
    else if (name === "cvv") {
      const formattedValue = value.replace(/\D/g, "").substring(0, 4);
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await onConfirm(formData);
      setFormData({
        cardType: "",
        cardNumber: "",
        cardName: "",
        expiryDate: "",
        cvv: "",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 transition-opacity duration-300"
      onClick={handleOverlayClick}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-xl transform transition-all duration-300 scale-100 opacity-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex="-1"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white rounded-t-2xl">
          <h2 className="text-2xl font-bold flex items-center">
            <FaLock className="mr-2" /> Secure Payment
          </h2>
          <p className="text-blue-100 mt-1">Upgrade to Premium Membership</p>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Card Type */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="cardType"
            >
              Card Type
            </label>
            <select
              id="cardType"
              name="cardType"
              value={formData.cardType}
              onChange={handleChange}
              className="w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Select Card Type</option>
              <option value="credit">Credit Card</option>
              <option value="debit">Debit Card</option>
            </select>
          </div>

          {/* Card Number */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="cardNumber"
            >
              Card Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaCreditCard className="text-gray-400" />
              </div>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                placeholder="1234 5678 9012 3456"
                className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                maxLength="19"
              />
            </div>
          </div>

          {/* Cardholder Name */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="cardName"
            >
              Cardholder Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                type="text"
                id="cardName"
                name="cardName"
                value={formData.cardName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Expiry Date */}
            <div>
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="expiryDate"
              >
                Expiry Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  maxLength="5"
                />
              </div>
            </div>

            {/* CVV */}
            <div>
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="cvv"
              >
                CVV
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaShieldAlt className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  maxLength="4"
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium text-gray-700 mb-3">Order Summary</h3>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Premium Membership</span>
              <span className="font-medium">$499/lifetime</span>
            </div>
            <div className="border-t border-gray-200 my-2"></div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span className="text-blue-600">$499</span>
            </div>
          </div>

          {/* Payment Buttons */}
          <div className="flex flex-col space-y-3">
            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
                isProcessing
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isProcessing ? "Processing..." : "Pay $499"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="w-full py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md border border-gray-300 font-medium transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* Security Info */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 flex items-center justify-center">
              <FaLock className="mr-1" /> Your payment is secure and encrypted
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
