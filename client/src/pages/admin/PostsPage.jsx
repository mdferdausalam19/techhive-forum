import React, { useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminTable from "../../components/admin/AdminTable";
import {
  FiFileText,
  FiSearch,
  FiMessageSquare,
  FiThumbsUp,
} from "react-icons/fi";
import { useQuery, useMutation } from "@tanstack/react-query";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import { format } from "date-fns";
import { Link } from "react-router";
import toast from "react-hot-toast";
import DeletePostModal from "../../components/post/DeletePostModal";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQueryClient } from "@tanstack/react-query";

export default function PostsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingPost, setDeletingPost] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ["admin-posts-all"],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/admin/posts`);
      return data;
    },
  });

  const { mutateAsync: deletePost, isLoading: deletePostLoading } = useMutation(
    {
      mutationFn: async (postId) => {
        await axiosSecure.delete(`/posts/${postId}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-posts-all"] });
        setShowDeleteModal(false);
        setIsDeleting(false);
        setDeletingPost(null);
        toast.success("Post deleted successfully!");
      },
      onError: () => {
        toast.error("Failed to delete post. Please try again.");
      },
    }
  );

  const confirmDeletePost = async () => {
    setIsDeleting(true);
    try {
      await deletePost(deletingPost._id);
    } catch (err) {
      console.error("Error deleting post: ", err.message);
    }
  };

  const handleDelete = async (post) => {
    setDeletingPost(post);
    setShowDeleteModal(true);
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const formatDate = (date) => format(new Date(date), "MMM d, yyyy");

  if (postsLoading || deletePostLoading) {
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
          { key: "actions", label: "Actions" },
        ]}
        data={filteredPosts}
        keyField="id"
        showActions={false}
        emptyMessage="No posts found matching your criteria"
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
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center space-x-4">
                <Link
                  to={`/post/${post._id}`}
                  className="text-blue-600 hover:text-blue-900"
                >
                  View
                </Link>
                <button
                  onClick={() => handleDelete(post)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </div>
            </td>
          </>
        )}
      />

      {/* Delete Post Modal */}
      <DeletePostModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingPost(null);
        }}
        onConfirm={confirmDeletePost}
        postTitle={deletingPost?.title}
        isLoading={isDeleting}
      />
    </div>
  );
}
