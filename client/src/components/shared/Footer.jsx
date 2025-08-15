import { Link } from "react-router";
import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaDiscord,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaRobot,
} from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-blue-600 to-blue-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div className="col-span-1">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-2">
                <FaRobot className="h-6 w-6 text-white" />
              </div>
              <span>TechHive</span>
            </h3>
            <p className="text-blue-100 text-sm mb-4">
              A vibrant community for tech enthusiasts to share knowledge, ask
              questions, and connect with like-minded individuals.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-200 hover:text-white transition">
                <FaGithub size={20} />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition">
                <FaLinkedin size={20} />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition">
                <FaDiscord size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-blue-200 hover:text-white transition text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/posts"
                  className="text-blue-200 hover:text-white transition text-sm"
                >
                  All Posts
                </Link>
              </li>
              <li>
                <Link
                  to="/membership"
                  className="text-blue-200 hover:text-white transition text-sm"
                >
                  Membership
                </Link>
              </li>
              <li>
                <Link
                  to="/ai-assistant"
                  className="text-blue-200 hover:text-white transition text-sm"
                >
                  AI Assistant
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">
              Categories
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-blue-200 hover:text-white transition text-sm"
                >
                  Frontend Development
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-blue-200 hover:text-white transition text-sm"
                >
                  Backend Development
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-blue-200 hover:text-white transition text-sm"
                >
                  Mobile Development
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-blue-200 hover:text-white transition text-sm"
                >
                  DevOps
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-blue-200 hover:text-white transition text-sm"
                >
                  Career Advice
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="h-5 w-5 text-blue-300 mt-1 mr-3 flex-shrink-0" />
                <span className="text-blue-100">
                  123 Travel Street, TechHive City, WC 12345
                </span>
              </li>
              <li className="flex items-center">
                <FaPhone className="h-4 w-4 text-blue-300 mr-3" />
                <a
                  href="tel:+1234567890"
                  className="text-blue-100 hover:text-white transition-colors"
                >
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="h-4 w-4 text-blue-300 mr-3" />
                <a
                  href="mailto:info@techhive.com"
                  className="text-blue-100 hover:text-white transition-colors"
                >
                  info@techhive.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-200 text-sm mb-4 md:mb-0">
            &copy; {currentYear} TechHive. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link
              to="/"
              className="text-blue-200 hover:text-white text-sm transition"
            >
              Privacy Policy
            </Link>
            <Link
              to="/"
              className="text-blue-200 hover:text-white text-sm transition"
            >
              Terms of Service
            </Link>
            <Link
              to="/"
              className="text-blue-200 hover:text-white text-sm transition"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
