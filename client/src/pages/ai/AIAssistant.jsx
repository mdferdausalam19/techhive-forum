import React, { useState } from "react";
import AIMessage from "../../components/ai/AIMessage";
import AIPromptSuggestions from "../../components/ai/AIPromptSuggestions";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const initialMessages = [
  {
    id: 1,
    type: "ai",
    content:
      "Hello! I'm your AI assistant for TechHive. I can help you generate posts, answer tech questions, or brainstorm ideas. How can I assist you today?",
    timestamp: new Date(Date.now() - 60000).toLocaleTimeString(),
  },
];

export default function AIAssistant() {
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const axiosSecure = useAxiosSecure();

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Call our API endpoint
      const response = await axiosSecure.post("/ai/assist", {
        message: inputValue,
      });

      const aiMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: response.data.content || response.data,
        timestamp: new Date().toLocaleTimeString(),
        data: response.data,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: "Sorry, I encountered an error. Please try again later.",
        timestamp: new Date().toLocaleTimeString(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-center items-center mb-10">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-blue-700">AI Assistant</h1>
            <p className="text-gray-600">
              Your intelligent companion for tech discussions
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Chat Section */}
          <div className="bg-white rounded-lg shadow-lg border border-blue-100 h-[400px] md:h-[500px] lg:h-[600px] flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <AIMessage
                  key={message.id}
                  message={{
                    type: message.type,
                    content: message.content,
                    timestamp: message.timestamp,
                  }}
                />
              ))}
              {isTyping && (
                <AIMessage
                  isTyping={isTyping}
                  message={{
                    type: "ai",
                    content: "",
                    timestamp: "",
                  }}
                />
              )}
            </div>

            {/* Input Section */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex space-x-2">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about tech, or request a post..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={2}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Prompt Suggestions */}
          <div className="mt-4">
            <AIPromptSuggestions onSuggestionClick={handleSuggestionClick} />
          </div>
        </div>
      </div>
    </div>
  );
}
