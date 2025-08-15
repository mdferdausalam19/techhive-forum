import { useState, useRef, useEffect } from "react";
import { FaCopy, FaCheck } from "react-icons/fa";

export default function ShareModal({ isOpen, onClose, postUrl }) {
  const [isCopied, setIsCopied] = useState(false);
  const modalRef = useRef(null);
  const urlInputRef = useRef(null);

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    // Handle Escape key
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      // Focus the input when modal opens
      if (urlInputRef.current) {
        urlInputRef.current.select();
      }
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        ref={modalRef}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
      >
        <h2
          id="share-modal-title"
          className="text-xl font-bold text-gray-900 mb-4"
        >
          Share this post
        </h2>

        <div className="flex items-center space-x-2 mb-6">
          <div className="flex-1 relative">
            <input
              ref={urlInputRef}
              type="text"
              readOnly
              value={postUrl}
              className="w-full pr-10 pl-3 py-2 text-sm border border-gray-300 rounded-md truncate"
              style={{
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
                direction: "ltr",
                textAlign: "left",
              }}
              aria-label="Post URL"
            />
          </div>
          <button
            onClick={handleCopy}
            className="p-2 text-gray-600 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md transition-colors cursor-pointer"
            title={isCopied ? "Copied!" : "Copy to clipboard"}
            aria-label={isCopied ? "Copied!" : "Copy to clipboard"}
          >
            {isCopied ? <FaCheck className="text-green-500" /> : <FaCopy />}
          </button>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
