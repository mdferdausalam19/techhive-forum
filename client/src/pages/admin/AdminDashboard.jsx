import { FiUsers } from "react-icons/fi";
import { FiFileText } from "react-icons/fi";
import StatCard from "../../components/admin/StatCard";

export default function AdminDashboard() {
  const stats = {
    totalPosts: 128,
    totalComments: 432,
    totalUsers: 78,
    generalUsers: 60,
    premiumUsers: 18,
    totalLikes: 2100,
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

  // Status badge component
  const StatusBadge = ({ status }) => (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
        status === "Premium"
          ? "bg-yellow-100 text-yellow-800"
          : "bg-blue-100 text-blue-800"
      }`}
    >
      {status}
    </span>
  );

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Users"
          value={stats.totalUsers}
          icon="👥"
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          label="Total Posts"
          value={stats.totalPosts}
          icon="📝"
          color="from-purple-500 to-purple-600"
        />
        <StatCard
          label="Total Comments"
          value={stats.totalComments}
          icon="💬"
          color="from-green-500 to-green-600"
        />
        <StatCard
          label="Total Likes"
          value={stats.totalLikes}
          icon="🤍"
          color="from-pink-500 to-pink-600"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <FiUsers className="mr-2 text-blue-600" />
            Recent Users
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr
                  key={user.uid}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                        {user.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={user.role} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.joinDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <FiFileText className="mr-2 text-blue-600" />
            Recent Posts
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr
                  key={post._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {post.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{post.author}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <span className="bg-green-200 px-2 py-1 rounded">
                        {post.category}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(post.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
