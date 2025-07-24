import React from "react";
import toast from "react-hot-toast";

export default function AIMessage({ message }) {
  const isUser = message.type === "user";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    toast.success("Message copied to clipboard!");
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isUser 
          ? "bg-blue-600 text-white" 
          : "bg-gray-100 text-gray-800"
      }`}>
        {/* Message Content */}
        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
        
        {/* Timestamp and Copy Button */}
        <div className={`flex items-center justify-between mt-2 ${
          isUser ? "text-blue-100" : "text-gray-500"
        }`}>
          <span className="text-xs">{message.timestamp}</span>
          <button
            onClick={copyToClipboard}
            className={`ml-2 p-1 rounded hover:bg-opacity-20 hover:bg-gray-500 transition ${
              isUser ? "text-blue-100 hover:text-white" : "text-gray-400 hover:text-gray-600"
            }`}
            title="Copy message"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
