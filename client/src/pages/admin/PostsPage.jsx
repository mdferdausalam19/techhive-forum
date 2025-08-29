import React, { useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminTable from "../../components/admin/AdminTable";
import {
  FiFileText,
  FiSearch,
  FiMessageSquare,
  FiThumbsUp,
} from "react-icons/fi";
import useAxiosCommon from "../../hooks/useAxiosCommon";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import { format } from "date-fns";

export default function PostsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const axiosCommon = useAxiosCommon();

  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ["admin-posts-all"],
    queryFn: async () => {
      const { data } = await axiosCommon.get(`/admin/posts`);
      return data;
    },
  });

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleView = (post) => {
    // Handle view post
    console.log("View post:", post);
  };

  const handleDelete = (post) => {
    // Handle delete post
    if (window.confirm(`Are you sure you want to delete "${post.title}"?`)) {
      console.log("Delete post:", post);
    }
  };

  const formatDate = (date) => format(new Date(date), "MMM d, yyyy");

  if (postsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Posts Management"
        description="Manage all posts and their content"
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
        </div>
      </div>

      {/* Posts Table */}
      <AdminTable
        headers={[
          { key: "title", label: "Post" },
          { key: "author", label: "Author" },
          { key: "category", label: "Category" },
          { key: "stats", label: "Statistics" },
        ]}
        data={filteredPosts}
        keyField="id"
        emptyMessage="No posts found matching your criteria"
        onView={handleView}
        onDelete={handleDelete}
        renderRow={(post) => (
          <>
            <td className="px-6 py-4">
              <div className="text-sm font-medium text-gray-900">
                {post.title}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {formatDate(post.date)}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900 flex items-center">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full mr-2"
                />
                {post.author.name}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {post.category}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm text-gray-500">
                  <FiMessageSquare className="mr-1" />
                  {post.comments.length}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <FiThumbsUp className="mr-1" />
                  {post.likes.length}
                </div>
              </div>
            </td>
          </>
        )}
      />
    </div>
  );
}
