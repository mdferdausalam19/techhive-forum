import { useState } from "react";

export default function VisibilitySelector({
  value,
  onChange,
  isPremium = false,
  disabled = false,
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleVisibilityChange = (newValue) => {
    if (newValue === "private" && !isPremium) {
      setShowTooltip(true);
      return;
    }
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Post Visibility
      </label>
      <div className="flex space-x-4">
        {/* Public Option */}
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="visibility"
            value="public"
            checked={value === "public"}
            onChange={(e) => handleVisibilityChange(e.target.value)}
            disabled={disabled}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <span className="ml-2 text-sm text-gray-700">
            <span className="flex items-center">
              <svg
                className="w-4 h-4 mr-1 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
                  clipRule="evenodd"
                />
              </svg>
              Public
            </span>
          </span>
        </label>

        {/* Private Option */}
        <label
          className={`flex items-center ${
            isPremium ? "cursor-pointer" : "cursor-not-allowed opacity-60"
          }`}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <input
            type="radio"
            name="visibility"
            value="private"
            checked={value === "private"}
            onChange={(e) => handleVisibilityChange(e.target.value)}
            disabled={disabled || !isPremium}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 disabled:opacity-50"
          />
          <span className="ml-2 text-sm text-gray-700 flex items-center">
            <svg
              className="w-4 h-4 mr-1 text-yellow-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            Private
            {!isPremium && (
              <>
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                  Premium
                </span>
              </>
            )}
          </span>
        </label>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="relative">
          <div className="absolute left-20 bottom-6 mb-2 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
            {isPremium
              ? "Private posts are only visible to Premium members"
              : "Private posts are only available to Premium users. Upgrade to unlock this feature!"}
            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <p className="text-xs text-gray-500">
        Public posts are visible to all users. Private posts are exclusive to
        Premium members.
      </p>
    </div>
  );
}
