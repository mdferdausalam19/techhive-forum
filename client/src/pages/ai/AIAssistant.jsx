import React, { useState} from "react";
import AIMessage from "../../components/ai/AIMessage";
import AIPromptSuggestions from "../../components/ai/AIPromptSuggestions";
import PostGenerator from "../../components/ai/PostGenerator";

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
  const [generatedPost, setGeneratedPost] = useState(null);

  const handleSendMessage = () => {
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

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      const aiMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: aiResponse.content,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);

      // If it's a post generation request, show the post generator
      if (aiResponse.showPostGenerator) {
        setGeneratedPost({
          title: "How to Optimize React Performance",
          content:
            "React performance optimization is crucial for building fast, responsive applications. Here are key strategies:\n\n1. Use React.memo() for component memoization\n2. Implement useMemo() and useCallback() hooks\n3. Optimize bundle size with code splitting\n4. Use React DevTools Profiler to identify bottlenecks",
          tags: ["React", "Performance", "Optimization", "JavaScript"],
        });
      }
    }, 1500);
  };

  const generateAIResponse = (input) => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes("generate") && lowerInput.includes("post")) {
      return {
        content:
          "I'll help you generate a post! Here's a draft based on your request:",
        showPostGenerator: true,
      };
    } else if (
      lowerInput.includes("react") ||
      lowerInput.includes("performance")
    ) {
      return {
        content:
          "Great question about React performance! Here are some key optimization techniques: Use React.memo for preventing unnecessary re-renders, implement useMemo and useCallback hooks for expensive calculations, and consider code splitting for better bundle management.",
        showPostGenerator: false,
      };
    } else if (lowerInput.includes("help") || lowerInput.includes("?")) {
      return {
        content:
          "I'm here to help! I can assist with:\n• Generating tech discussion posts\n• Answering programming questions\n• Brainstorming project ideas\n• Code optimization tips\n\nWhat would you like to explore?",
        showPostGenerator: false,
      };
    } else {
      return {
        content:
          "That's an interesting topic! Could you provide more details so I can give you a more specific and helpful response?",
        showPostGenerator: false,
      };
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

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Chat Section */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg border border-blue-100 h-96 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <AIMessage key={message.id} message={message} />
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center space-x-2">
                    <div className="bg-gray-100 rounded-lg px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      AI is typing...
                    </span>
                  </div>
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

          {/* Post Generator Section */}
          <div className="lg:col-span-2">
            {generatedPost ? (
              <PostGenerator
                post={generatedPost}
                onClose={() => setGeneratedPost(null)}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-lg border border-blue-100 p-6 text-center">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Post Generator
                </h3>
                <p className="text-gray-500 text-sm">
                  Ask me to generate a post and I'll create a draft for you!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
