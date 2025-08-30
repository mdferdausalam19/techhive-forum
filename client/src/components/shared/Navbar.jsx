import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import {
  FaRobot,
  FaUser,
  FaSignOutAlt,
  FaPlus,
  FaFileAlt,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import useRole from "../../hooks/useRole";

export default function Navbar() {
  const { user, signOutUser, loading } = useAuth();
  const { role } = useRole();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
        setMobileProfileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      navigate("/sign-in");
      toast.success("Sign out successful!");
      setProfileDropdownOpen(false);
      setMobileMenuOpen(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (mobileProfileOpen) {
      setMobileProfileOpen(false);
    }
  };

  const profileMenuItems = [
    { name: "Create Post", href: "/create-post", icon: FaPlus },
    { name: "My Posts", href: "/my-posts", icon: FaFileAlt },
    { name: "Profile", href: "/profile", icon: FaUser },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                <FaRobot className="h-6 w-6 text-white transition-transform duration-300 group-hover:scale-110" />
              </div>
              <span className="text-xl md:text-2xl font-bold md:font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                TechHive
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={handleMobileMenuToggle}
                className="ml-4 inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300"
                aria-label="Toggle menu"
              >
                <svg
                  className={`h-6 w-6 transform transition-transform duration-300 ${
                    mobileMenuOpen ? "rotate-90" : "rotate-0"
                  }`}
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

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 hover:bg-blue-50 px-4 py-2 rounded-lg relative group"
            >
              Home
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-500 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
            </Link>
            <Link
              to="/posts"
              className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 hover:bg-blue-50 px-4 py-2 rounded-lg relative group"
            >
              All Posts
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-500 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
            </Link>
            <Link
              to="/membership"
              className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 hover:bg-blue-50 px-4 py-2 rounded-lg relative group"
            >
              Membership
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-500 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
            </Link>
            {role === "Premium" && (
              <Link
                to="/ai-assistant"
                className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 hover:bg-blue-50 px-4 py-2 rounded-lg relative group"
              >
                AI Assistant
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-500 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
              </Link>
            )}
          </div>

          {/* Desktop User Section */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
            ) : user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none rounded-full p-1 hover:bg-blue-50 transition-all duration-300 group"
                >
                  <div className="relative">
                    <img
                      src={
                        user.photoURL ||
                        "https://i.ibb.co/9H2PJ7h2/d43801412989.jpg"
                      }
                      alt="Profile"
                      className="w-8 h-8 rounded-full border-2 border-gray-200 group-hover:border-blue-400 transition-all duration-300 group-hover:scale-110"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <span className="hidden sm:block text-sm font-medium group-hover:text-blue-600 transition-colors duration-300">
                    {user.displayName || "User"}
                  </span>
                  <svg
                    className={`w-4 h-4 transform transition-transform duration-300 ${
                      profileDropdownOpen ? "rotate-180" : "rotate-0"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Desktop Profile Dropdown */}
                <div
                  className={`absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 transition-all duration-300 origin-top-right ${
                    profileDropdownOpen
                      ? "opacity-100 scale-100 visible translate-y-0"
                      : "opacity-0 scale-95 invisible -translate-y-2"
                  }`}
                >
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <img
                        src={
                          user.photoURL ||
                          "https://i.ibb.co/9H2PJ7h2/d43801412989.jpg"
                        }
                        alt="Profile"
                        className="w-10 h-10 rounded-full border-2 border-blue-200"
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {user.displayName || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  {role === "Admin" && (
                    <Link
                      to="/admin"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 border-l-2 border-transparent hover:border-blue-500"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <MdDashboard className="w-4 h-4 mr-3 text-gray-400" />
                      Dashboard
                    </Link>
                  )}
                  {profileMenuItems.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 border-l-2 border-transparent hover:border-blue-500"
                        onClick={() => setProfileDropdownOpen(false)}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <IconComponent className="w-4 h-4 mr-3 text-gray-400" />
                        {item.name}
                      </Link>
                    );
                  })}

                  <div className="border-t border-gray-100 my-1"></div>

                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200 border-l-2 border-transparent hover:border-red-500"
                  >
                    <FaSignOutAlt className="w-4 h-4 mr-3 text-gray-400" />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/sign-in"
                  className="text-gray-700 hover:text-blue-600 px-6 py-2.5 text-sm font-medium transition-all duration-300 hover:bg-blue-50 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 border border-blue-400"
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute left-0 right-0 top-full bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-lg transition-all duration-300 ease-in-out ${
            mobileMenuOpen
              ? "opacity-100 visible translate-y-0"
              : "opacity-0 invisible -translate-y-4"
          } ${mobileMenuOpen ? "max-h-screen" : "max-h-0"} overflow-hidden`}
        >
          <div className="px-4 py-4 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {/* Navigation Links */}
            <Link
              to="/"
              className="block text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 hover:bg-blue-50 px-4 py-3 rounded-lg transform hover:translate-x-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/posts"
              className="block text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 hover:bg-blue-50 px-4 py-3 rounded-lg transform hover:translate-x-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              All Posts
            </Link>
            <Link
              to="/membership"
              className="block text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 hover:bg-blue-50 px-4 py-3 rounded-lg transform hover:translate-x-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Membership
            </Link>
            {role === "Premium" && (
              <Link
                to="/ai-assistant"
                className="block text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 hover:bg-blue-50 px-4 py-3 rounded-lg transform hover:translate-x-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                AI Assistant
              </Link>
            )}

            {/* Mobile User Section */}
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
              </div>
            ) : user ? (
              <div className="pt-4 border-t border-gray-100">
                {/* User Profile Button */}
                <button
                  onClick={() => setMobileProfileOpen(!mobileProfileOpen)}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 rounded-lg"
                >
                  <div className="relative">
                    <img
                      src={
                        user.photoURL ||
                        "https://i.ibb.co/9H2PJ7h2/d43801412989.jpg"
                      }
                      alt="Profile"
                      className="w-8 h-8 rounded-full border-2 border-gray-200"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold">
                      {user.displayName || "User"}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <svg
                    className={`w-4 h-4 transform transition-transform duration-300 ${
                      mobileProfileOpen ? "rotate-180" : "rotate-0"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Mobile Profile Menu */}
                <div
                  className={`ml-4 mt-2 space-y-1 transition-all duration-300 ease-in-out ${
                    mobileProfileOpen
                      ? "opacity-100 visible max-h-64 translate-y-0"
                      : "opacity-0 invisible max-h-0 -translate-y-2"
                  } overflow-hidden`}
                >
                  {role === "Admin" && (
                    <Link
                      to="/admin"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 border-l-2 border-transparent hover:border-blue-500"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <MdDashboard className="w-4 h-4 mr-3 text-gray-400" />
                      Dashboard
                    </Link>
                  )}
                  {profileMenuItems.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="flex items-center text-gray-600 hover:text-blue-600 transition-all duration-200 hover:bg-blue-50 px-4 py-2 rounded-md border-l-2 border-transparent hover:border-blue-400 transform hover:translate-x-1"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setMobileProfileOpen(false);
                        }}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <IconComponent className="w-4 h-4 mr-3 text-gray-400" />
                        {item.name}
                      </Link>
                    );
                  })}

                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full text-gray-600 hover:text-red-600 transition-all duration-200 hover:bg-red-50 px-4 py-2 rounded-md border-l-2 border-transparent hover:border-red-400 transform hover:translate-x-1"
                  >
                    <FaSignOutAlt className="w-4 h-4 mr-3 text-gray-400" />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-100 space-y-2">
                <Link
                  to="/sign-in"
                  className="block text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 hover:bg-blue-50 px-4 py-3 rounded-lg text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  className="block text-center bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 font-medium transition-all duration-300 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
