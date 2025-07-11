import { useState } from "react";
import {
  FaSearch,
  FaRobot,
  FaUsers,
  FaComments,
  FaCrown,
  FaStar,
} from "react-icons/fa";

export default function HeroBanner() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search query:", searchQuery);
    setSearchQuery("");
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-16 pb-20 text-center lg:pt-24 lg:pb-24">
          <div className="flex justify-center items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-4">
              <FaRobot className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              <span className="text-blue-600">TechHive</span>
            </h1>
          </div>

          <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <FaStar className="h-4 w-4 mr-2" />
            AI-Driven Discussion Hub
          </div>

          <p className="mt-6 max-w-4xl mx-auto text-xl text-gray-600 leading-relaxed">
            Join the most intelligent tech community where{" "}
            <span className="font-semibold text-blue-600">
              AI meets discussion
            </span>
            . Engage in meaningful conversations, get AI-powered content
            suggestions, and connect with tech professionals worldwide.
          </p>

          <div className="mt-10 max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search discussions, AI insights, or tech topics..."
                  className="block w-full pl-10 pr-24 py-4 border border-gray-300 rounded-full text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-lg transition-all duration-200"
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-6 rounded-full mr-2 transition-all duration-200 shadow-md"
                  >
                    Search
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="text-sm text-gray-500">Popular Topics:</span>
              {[
                "AI & ML",
                "Web Development",
                "Mobile Apps",
                "Cloud Computing",
                "DevOps",
                "Blockchain",
              ].map((tag) => (
                <button
                  key={tag}
                  className="text-sm bg-white/60 hover:bg-white/80 text-gray-700 px-3 py-1 rounded-full border border-blue-200 transition-all duration-200 hover:shadow-sm"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div className="text-center group">
              <div className="bg-gradient-to-r from-blue-100 to-blue-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <FaComments className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Smart Discussions
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                AI-enhanced conversations
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-r from-purple-100 to-purple-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <FaRobot className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                AI Assistant
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Powered by Gemini API
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-r from-green-100 to-green-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <FaUsers className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Community</h3>
              <p className="text-sm text-gray-600 mt-1">
                Tech professionals network
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <FaCrown className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Premium Access
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Exclusive AI features
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-full text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Join Community
            </button>
            <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-3 px-8 rounded-full text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Explore Premium
            </button>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                10K+
              </div>
              <div className="text-sm text-gray-600">Tech Discussions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                5K+
              </div>
              <div className="text-sm text-gray-600">Community Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                1K+
              </div>
              <div className="text-sm text-gray-600">AI-Generated Posts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
