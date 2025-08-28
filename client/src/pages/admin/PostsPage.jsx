import React, { useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminTable from "../../components/admin/AdminTable";
import {
  FiFileText,
  FiSearch,
  FiFilter,
  FiEye,
  FiMessageSquare,
  FiThumbsUp,
} from "react-icons/fi";

export default function PostsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const posts = [
    {
      id: 1,
      title: "Getting Started with React Hooks",
      author: "Alice Johnson",
      category: "React",
      status: "published",
      date: "2025-08-15",
      views: 1245,
      comments: 23,
      likes: 87,
    },
    {
      id: 2,
      title: "Advanced TypeScript Patterns",
      author: "Bob Smith",
      category: "TypeScript",
      status: "draft",
      date: "2025-08-20",
      views: 0,
      comments: 0,
      likes: 0,
    },
    {
      id: 3,
      title: "State Management with Redux Toolkit",
      author: "Charlie Brown",
      category: "Redux",
      status: "published",
      date: "2025-08-25",
      views: 876,
      comments: 15,
      likes: 42,
    },
  ];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      statusFilter === "all" || post.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const handleView = (post) => {
    // Handle view post
    console.log("View post:", post);
  };

  const handleEdit = (post) => {
    // Handle edit post
    console.log("Edit post:", post);
  };

  const handleDelete = (post) => {
    // Handle delete post
    if (window.confirm(`Are you sure you want to delete "${post.title}"?`)) {
      console.log("Delete post:", post);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Posts Management"
        description="Manage all posts and their content"
        buttonText="Create New Post"
        onButtonClick={() => console.log("Create new post")}
        icon={FiFileText}
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
              placeholder="Search posts..."
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
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <AdminTable
        headers={[
          { key: "title", label: "Post" },
          { key: "author", label: "Author" },
          { key: "category", label: "Category" },
          { key: "status", label: "Status" },
          { key: "stats", label: "Statistics" },
        ]}
        data={filteredPosts}
        keyField="id"
        emptyMessage="No posts found matching your criteria"
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        renderRow={(post) => (
          <>
            <td className="px-6 py-4">
              <div className="text-sm font-medium text-gray-900">
                {post.title}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(post.date).toLocaleDateString()}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{post.author}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {post.category}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  post.status === "published"
                    ? "bg-green-100 text-green-800"
                    : post.status === "draft"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm text-gray-500">
                  <FiEye className="mr-1" />
                  {post.views}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <FiMessageSquare className="mr-1" />
                  {post.comments}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <FiThumbsUp className="mr-1" />
                  {post.likes}
                </div>
              </div>
            </td>
          </>
        )}
      />
    </div>
  );
}
