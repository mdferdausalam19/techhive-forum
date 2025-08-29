import {
  FiUsers,
  FiFileText,
  FiDollarSign,
  FiUser,
  FiMessageSquare,
} from "react-icons/fi";
import StatCard from "../../components/admin/StatCard";
import AdminTable from "../../components/admin/AdminTable";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import useAxiosCommon from "../../hooks/useAxiosCommon";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import { Link } from "react-router";

export default function AdminDashboard() {
  const axiosCommon = useAxiosCommon();
  const { data: stats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data } = await axiosCommon.get("/admin/stats");
      return data;
    },
  });

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data } = await axiosCommon.get(
        `/admin/users/recent?limit=${5}&sort=${-1}`
      );
      return data;
    },
  });

  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: async () => {
      const { data } = await axiosCommon.get(
        `/admin/posts/recent?limit=${5}&sort=${-1}`
      );
      return data;
    },
  });

  const { data: payments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ["admin-payments"],
    queryFn: async () => {
      const { data } = await axiosCommon.get(
        `/admin/payments/recent?limit=${5}&sort=${-1}`
      );
      return data;
    },
  });

  const formatDate = (date) => format(new Date(date), "MMM d, yyyy");

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { bg: "bg-green-100 text-green-800", text: "Completed" },
      pending: { bg: "bg-yellow-100 text-yellow-800", text: "Pending" },
      failed: { bg: "bg-red-100 text-red-800", text: "Failed" },
    };

    const config = statusConfig[status] || {
      bg: "bg-gray-100 text-gray-800",
      text: status,
    };

    return (
      <span
        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg}`}
      >
        {config.text}
      </span>
    );
  };

  if (statsLoading || usersLoading || postsLoading || paymentsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Users"
          value={stats.totalUsers}
          icon={FiUsers}
          textColor="text-blue-500"
        />
        <StatCard
          label="Total Posts"
          value={stats.totalPosts}
          icon={FiFileText}
          textColor="text-violet-500"
        />
        <StatCard
          label="Total Comments"
          value={stats.totalComments}
          icon={FiMessageSquare}
          textColor="text-yellow-500"
        />
        <StatCard
          label="Total Revenue"
          value={stats.totalRevenue}
          icon={FiDollarSign}
          textColor="text-green-500"
        />
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
          <Link
            to="/admin/users"
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            View All
          </Link>
        </div>
        <AdminTable
          headers={[
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "role", label: "Role" },
            { key: "joinDate", label: "Join Date" },
          ]}
          data={users}
          keyField="uid"
          emptyMessage="No users found"
          showActions={false}
          renderRow={(user) => (
            <>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <FiUser className="h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    user.role === "Premium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {formatDate(user.timestamp)}
              </td>
            </>
          )}
        />
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Posts</h2>
          <Link
            to="/admin/posts"
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            View All
          </Link>
        </div>
        <AdminTable
          headers={[
            { key: "title", label: "Title" },
            { key: "author", label: "Author" },
            { key: "category", label: "Category" },
            { key: "date", label: "Date" },
          ]}
          data={posts}
          keyField="_id"
          emptyMessage="No posts found"
          showActions={false}
          renderRow={(post) => (
            <>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">
                  {post.title}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {post.author.name}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    post.category === "AI"
                      ? "bg-purple-100 text-purple-800"
                      : post.category === "Premium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {post.category}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {formatDate(post.date)}
              </td>
            </>
          )}
        />
      </div>

      {/* Recent Payments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Payments
          </h2>
          <Link
            to="/admin/payments"
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            View All
          </Link>
        </div>
        <AdminTable
          headers={[
            { key: "user", label: "User" },
            { key: "amount", label: "Amount" },
            { key: "plan", label: "Plan" },
            { key: "status", label: "Status" },
            { key: "date", label: "Date" },
          ]}
          data={payments}
          keyField="id"
          emptyMessage="No payments found"
          showActions={false}
          renderRow={(payment) => (
            <>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <FiUser className="h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {payment.user.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {payment.user.email}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">
                  ${payment.amount.toFixed(2)}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {payment.plan}
              </td>
              <td className="px-6 py-4">{getStatusBadge(payment.status)}</td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {formatDate(payment.date)}
              </td>
            </>
          )}
        />
      </div>
    </div>
  );
}
