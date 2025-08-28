import React, { useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminTable from "../../components/admin/AdminTable";
import { FiUsers, FiSearch, FiFilter, FiDownload } from "react-icons/fi";
import { FaUserShield, FaUserTie, FaUser } from "react-icons/fa";

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const users = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      role: "admin",
      status: "active",
      joinDate: "2025-06-15",
      posts: 12,
      comments: 45,
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      role: "moderator",
      status: "active",
      joinDate: "2025-07-20",
      posts: 8,
      comments: 32,
    },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "user",
      status: "suspended",
      joinDate: "2025-08-10",
      posts: 3,
      comments: 5,
    },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const handleEdit = (user) => {
    // Handle edit user
    console.log("Edit user:", user);
  };

  const handleDelete = (user) => {
    // Handle delete user
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      console.log("Delete user:", user);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <FaUserShield className="text-red-500" />;
      case "moderator":
        return <FaUserTie className="text-blue-500" />;
      default:
        return <FaUser className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="User Management"
        description="Manage all users and their permissions"
        buttonText="Add New User"
        onButtonClick={() => console.log("Add new user")}
        icon={FiUsers}
      />

      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <FiFilter className="h-5 w-5 text-gray-400 mr-2" />
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <AdminTable
        headers={[
          { key: "name", label: "User" },
          { key: "role", label: "Role" },
          { key: "status", label: "Status" },
          { key: "joinDate", label: "Join Date" },
          { key: "activity", label: "Activity" },
        ]}
        data={filteredUsers}
        keyField="id"
        emptyMessage="No users found matching your criteria"
        onEdit={handleEdit}
        onDelete={handleDelete}
        renderRow={(user) => (
          <>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                  {user.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">
                    {user.name}
                  </div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <span className="mr-2">{getRoleIcon(user.role)}</span>
                <span className="text-sm text-gray-900 capitalize">
                  {user.role}
                </span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.status === "active"
                    ? "bg-green-100 text-green-800"
                    : user.status === "suspended"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {new Date(user.joinDate).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{user.posts} posts</div>
              <div className="text-sm text-gray-500">
                {user.comments} comments
              </div>
            </td>
          </>
        )}
      />
    </div>
  );
}
