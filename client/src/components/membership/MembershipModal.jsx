import { useEffect } from "react";

export default function MembershipModal({ isOpen, onClose, onConfirm }) {
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 transition-opacity duration-300"
      onClick={handleOverlayClick}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl transform transition-all duration-300 scale-100 opacity-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex="-1"
      >
        <h3 id="modal-title" className="text-2xl font-bold text-gray-900 mb-4">
          Upgrade to Premium
        </h3>

        <div className="mt-2 space-y-4">
          <p className="text-gray-600">
            You're about to upgrade to TechHive Premium for just $499/lifetime.
            This includes:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>AI Assistant</li>
            <li>Priority Support</li>
            <li>Early Access to New Features</li>
            <li>Gold Profile Badge</li>
          </ul>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={onConfirm}
          >
            Confirm Upgrade
          </button>
        </div>
      </div>
    </div>
  );
}
