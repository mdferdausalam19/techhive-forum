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

export default function AdminDashboard() {
  const stats = {
    totalPosts: 128,
    totalComments: 432,
    totalUsers: 78,
    generalUsers: 60,
    premiumUsers: 18,
    totalLikes: 2100,
    totalRevenue: 528.93,
    monthlyGrowth: 12.5,
  };

  const users = [
    {
      uid: "1",
      name: "Alice Smith",
      email: "alice@example.com",
      role: "Premium",
      joinDate: "2025-08-20",
    },
    {
      uid: "2",
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "General",
      joinDate: "2025-08-21",
    },
    {
      uid: "3",
      name: "Clara Lee",
      email: "clara@example.com",
      role: "Premium",
      joinDate: "2025-08-22",
    },
  ];

  const posts = [
    {
      _id: "p1",
      title: "Welcome to TechHive!",
      author: "Alice Smith",
      category: "General",
      date: "2025-08-25",
    },
    {
      _id: "p2",
      title: "How to use the AI Assistant",
      author: "Bob Johnson",
      category: "AI",
      date: "2025-08-26",
    },
    {
      _id: "p3",
      title: "Premium Features Overview",
      author: "Clara Lee",
      category: "Premium",
      date: "2025-08-27",
    },
  ];

  const payments = [
    {
      id: "PMT-1001",
      user: { id: "user1", name: "Alice Johnson", email: "alice@example.com" },
      amount: 9.99,
      plan: "Monthly Premium",
      status: "completed",
      date: new Date("2025-08-27T14:30:00"),
      method: "Credit Card",
    },
    {
      id: "PMT-1002",
      user: { id: "user2", name: "Bob Smith", email: "bob@example.com" },
      amount: 99.99,
      plan: "Annual Premium",
      status: "completed",
      date: new Date("2025-08-26T10:15:00"),
      method: "PayPal",
    },
    {
      id: "PMT-1003",
      user: {
        id: "user3",
        name: "Charlie Brown",
        email: "charlie@example.com",
      },
      amount: 9.99,
      plan: "Monthly Premium",
      status: "pending",
      date: new Date("2025-08-28T09:45:00"),
      method: "Credit Card",
    },
  ];

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

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Users"
          value={stats.totalUsers}
          icon={FiUsers}
          color="blue"
          trend={stats.monthlyGrowth}
        />
        <StatCard
          label="Total Posts"
          value={stats.totalPosts}
          icon={FiFileText}
          color="green"
          trend={8.2}
        />
        <StatCard
          label="Total Comments"
          value={stats.totalComments}
          icon={FiMessageSquare}
          color="purple"
          trend={15.3}
        />
        <StatCard
          label="Total Revenue"
          value={stats.totalRevenue}
          icon={FiDollarSign}
          color="indigo"
          trend={stats.monthlyGrowth}
        />
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
            View All
          </button>
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
                {new Date(user.joinDate).toLocaleDateString()}
              </td>
            </>
          )}
        />
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Posts</h2>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
            View All
          </button>
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
          renderRow={(post) => (
            <>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">
                  {post.title}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">{post.author}</td>
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
          <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
            View All
          </button>
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
