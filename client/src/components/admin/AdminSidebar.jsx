import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import {
  FiHome,
  FiUsers,
  FiFileText,
  FiAlertTriangle,
  FiBell,
  FiChevronLeft,
  FiChevronRight,
  FiDollarSign,
} from "react-icons/fi";

export default function AdminSidebar({ onNavigate }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (to) => {
    if (onNavigate) onNavigate();
    navigate(to);
  };

  const navItems = [
    {
      to: "/admin",
      icon: <FiHome className="w-5 h-5" />,
      label: "Dashboard",
    },
    {
      to: "/admin/users",
      icon: <FiUsers className="w-5 h-5" />,
      label: "User Management",
    },
    {
      to: "/admin/posts",
      icon: <FiFileText className="w-5 h-5" />,
      label: "Posts Management",
    },
    {
      to: "/admin/payments",
      icon: <FiDollarSign className="w-5 h-5" />,
      label: "Payments",
    },
    {
      to: "/admin/reported-comments",
      icon: <FiAlertTriangle className="w-5 h-5" />,
      label: "Reported",
    },
    {
      to: "/admin/announcements",
      icon: <FiBell className="w-5 h-5" />,
      label: "Announcements",
    },
  ];

  return (
    <aside
      className={`bg-gradient-to-b from-blue-600 to-blue-500 text-white flex flex-col h-screen transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="p-4 flex items-center justify-between border-b border-blue-500 h-16">
        {!collapsed && (
          <h2 className="text-xl font-bold text-white">Admin Panel</h2>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-full hover:bg-blue-700 transition-colors hidden md:block"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <FiChevronRight className="w-5 h-5" />
          ) : (
            <FiChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => `
                  flex items-center p-3 rounded-lg transition-colors
                  ${
                    isActive ||
                    (item.to === "/admin" &&
                      window.location.pathname === "/admin")
                      ? "bg-blue-700 text-white"
                      : "text-blue-100 hover:bg-blue-600"
                  }
                  ${collapsed ? "justify-center" : "space-x-3"}
                `}
                end={item.to === "/admin"}
                onClick={() => handleNavigation(item.to)}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
