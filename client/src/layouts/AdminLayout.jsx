import { useState } from "react";
import AdminSidebar from "../components/admin/AdminSidebar";
import { Outlet } from "react-router";
import { FiMenu } from "react-icons/fi";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-600 text-white shadow-lg"
      >
        <FiMenu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
      >
        <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 md:ml-64 min-h-screen transition-all duration-300 p-4 md:p-8 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
