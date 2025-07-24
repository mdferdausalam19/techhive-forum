import { useState } from "react";
import { Link, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, signOutUser, loading } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      navigate("/sign-in");
      toast.success("Sign out successful!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center justify-between w-full md:w-auto">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-bold text-gray-900">TechHive</span>
            </Link>

            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="ml-4 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-500 font-medium"
            >
              Home
            </Link>
            <Link
              to="/posts"
              className="text-gray-700 hover:text-blue-500 font-medium"
            >
              All Posts
            </Link>
            <Link
              to="/membership"
              className="text-gray-700 hover:text-blue-500 font-medium"
            >
              Membership
            </Link>
            <Link
              to="/ai-assistant"
              className="text-gray-700 hover:text-blue-500 font-medium"
            >
              AI Assistant
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            ) : user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-500 focus:outline-none rounded-full">
                  <img
                    src={
                      user.photoURL ||
                      "https://i.ibb.co/9H2PJ7h2/d43801412989.jpg"
                    }
                    alt="Profile"
                    className="w-8 h-8 rounded-full border"
                  />
                  <span className="hidden sm:block text-sm font-medium">
                    {user.displayName || "User"}
                  </span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/sign-in"
                  className="text-gray-700 hover:text-blue-500 px-4 py-2 text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-full text-sm font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="absolute left-0 right-0 mt-2 bg-white border-t border-gray-200 shadow-md z-40 px-4 py-4 md:hidden">
            <div className="space-y-3">
              <Link to="/" className="block text-gray-700 hover:text-blue-500">
                Home
              </Link>
              <Link
                to="/all-posts"
                className="block text-gray-700 hover:text-blue-500"
              >
                All Posts
              </Link>
              <Link
                to="/membership"
                className="block text-gray-700 hover:text-blue-500"
              >
                Membership
              </Link>
              <Link
                to="/ai-assistant"
                className="block text-gray-700 hover:text-blue-500"
              >
                AI Assistant
              </Link>
              {!loading && user && (
                <>
                  <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                    <img
                      src={user.photoURL || "https://via.placeholder.com/32"}
                      alt="Profile"
                      className="w-8 h-8 rounded-full border"
                    />
                    <span className="text-sm font-medium text-gray-800">
                      {user.displayName || "User"}
                    </span>
                  </div>
                  <Link
                    to="/profile"
                    className="block text-sm text-gray-700 hover:text-blue-500"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block text-sm text-left text-gray-700 hover:text-red-500"
                  >
                    Sign Out
                  </button>
                </>
              )}
              {!loading && !user && (
                <>
                  <Link
                    to="/sign-in"
                    className="block text-gray-700 hover:text-blue-500"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/sign-up"
                    className="block text-blue-500 font-semibold"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
