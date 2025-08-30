import React, { useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminTable from "../../components/admin/AdminTable";
import { FiUsers, FiSearch } from "react-icons/fi";
import useAxiosCommon from "../../hooks/useAxiosCommon";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import { format } from "date-fns";

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const axiosCommon = useAxiosCommon();

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users-all"],
    queryFn: async () => {
      const { data } = await axiosCommon.get(`/admin/users`);
      return data;
    },
  });

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const formatDate = (date) => format(new Date(date), "MMM d, yyyy");

  if (usersLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="User Management"
        description="Manage all users and their permissions"
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
        </div>
      </div>

      {/* Users Table */}
      <AdminTable
        headers={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "role", label: "Role" },
          { key: "badge", label: "Badge" },
          { key: "joinDate", label: "Join Date" },
        ]}
        data={filteredUsers}
        keyField="id"
        showActions={false}
        emptyMessage="No users found matching your criteria"
        renderRow={(user) => (
          <>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-300 flex items-center justify-center text-blue-600 font-medium">
                  <img src={user?.avatar} alt="user avatar" />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">
                    {user?.name}
                  </div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-500">{user?.email}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <span
                  className={`text-sm text-gray-900 capitalize px-2 py-1 rounded-full ${
                    user?.role === "General"
                      ? "bg-blue-600 text-white"
                      : "bg-green-600 text-white"
                  }`}
                >
                  {user?.role}
                </span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span
                className={`text-sm text-gray-900 capitalize px-2 py-1 rounded-full ${
                  user?.badge === "Bronze"
                    ? "bg-amber-600 text-white"
                    : "bg-yellow-300 text-yellow-800"
                }`}
              >
                {user?.badge}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {formatDate(user?.timestamp)}
            </td>
          </>
        )}
      />
    </div>
  );
}
