import { useState } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import EditPost from "../../components/post/EditPost";
import DeletePostModal from "../../components/post/DeletePostModal";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

export default function MyPosts() {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [editingPost, setEditingPost] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingPost, setDeletingPost] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: posts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts", user?.uid],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/posts/user/${user?.uid}`);
      return data;
    },
  });

  const { mutateAsync: updatePost, isLoading: updatePostLoading } = useMutation(
    {
      mutationFn: async (updatedPost) => {
        await axiosSecure.put(`/posts/${updatedPost._id}`, updatedPost);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["posts", user?.uid] });
        setShowEditModal(false);
        setEditingPost(null);
        toast.success("Post updated successfully!");
      },
      onError: () => {
        toast.error("Failed to update post. Please try again.");
      },
    }
  );

  const { mutateAsync: deletePost, isLoading: deletePostLoading } = useMutation(
    {
      mutationFn: async (postId) => {
        await axiosSecure.delete(`/posts/${postId}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["posts", user?.uid] });
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

  const handleEditPost = (post) => {
    setEditingPost(post);
    setShowEditModal(true);
  };

  const handleSavePost = (updatedPost) => {
    updatePost(updatedPost);
  };

  const handleDeletePost = (post) => {
    setDeletingPost(post);
    setShowDeleteModal(true);
  };

  const confirmDeletePost = async () => {
    setIsDeleting(true);
    deletePost(deletingPost._id);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row j sm:justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-700 mb-2">My Posts</h1>
            <p className="text-gray-600">
              Manage and track your forum contributions
            </p>
          </div>
          <Link
            to="/create-post"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition shadow"
          >
            + Create New Post
          </Link>
        </div>

        {isLoading || updatePostLoading || deletePostLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {/* Total Posts */}
              <div className="bg-white rounded-lg shadow p-4 border border-blue-100 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-blue-600">
                  {posts.length}
                </div>
                <div className="text-sm text-gray-600">Total Posts</div>
              </div>
              {/* Upvotes & Downvotes */}
              <div className="bg-white rounded-lg shadow p-4 border border-blue-100 flex flex-col items-center justify-center">
                <div className="flex items-center w-full justify-between">
                  <div className="flex flex-col items-center flex-1">
                    <span className="text-lg font-bold text-green-600">
                      {posts.reduce(
                        (sum, post) => sum + (post.upvotes.length || 0),
                        0
                      )}
                    </span>
                    <span className="text-xs text-gray-500">Upvotes</span>
                  </div>
                  <div className="w-px h-8 bg-gray-200 mx-4"></div>
                  <div className="flex flex-col items-center flex-1">
                    <span className="text-lg font-bold text-red-500">
                      {posts.reduce(
                        (sum, post) => sum + (post.downvotes.length || 0),
                        0
                      )}
                    </span>
                    <span className="text-xs text-gray-500">Downvotes</span>
                  </div>
                </div>
              </div>
              {/* Likes & Comments */}
              <div className="bg-white rounded-lg shadow p-4 border border-blue-100 flex flex-col items-center justify-center">
                <div className="flex items-center w-full justify-between">
                  <div className="flex flex-col items-center flex-1">
                    <span className="text-lg font-bold text-pink-600">
                      {posts.reduce(
                        (sum, post) => sum + (post.likes.length || 0),
                        0
                      )}
                    </span>
                    <span className="text-xs text-gray-500">Likes</span>
                  </div>
                  <div className="w-px h-8 bg-gray-200 mx-4"></div>
                  <div className="flex flex-col items-center flex-1">
                    <span className="text-lg font-bold text-purple-600">
                      {posts.reduce(
                        (sum, post) => sum + (post.comments.length || 0),
                        0
                      )}
                    </span>
                    <span className="text-xs text-gray-500">Comments</span>
                  </div>
                </div>
              </div>
              {/* Private & Public Posts */}
              <div className="bg-white rounded-lg shadow p-4 border border-blue-100 flex flex-col items-center justify-center">
                <div className="flex items-center w-full justify-between">
                  <div className="flex flex-col items-center flex-1">
                    <span className="text-lg font-bold text-yellow-600">
                      {
                        posts.filter((post) => post.visibility === "private")
                          .length
                      }
                    </span>
                    <span className="text-xs text-gray-500">Private</span>
                  </div>
                  <div className="w-px h-8 bg-gray-200 mx-4"></div>
                  <div className="flex flex-col items-center flex-1">
                    <span className="text-lg font-bold text-green-600">
                      {
                        posts.filter((post) => post.visibility === "public")
                          .length
                      }
                    </span>
                    <span className="text-xs text-gray-500">Public</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Table */}
            <div className="bg-white rounded-lg shadow-lg border border-blue-100 overflow-hidden">
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg
                      className="w-16 h-16 mx-auto"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No posts yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Start sharing your knowledge with the community!
                  </p>
                  <Link
                    to="/create-post"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
                  >
                    Create Your First Post
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Visibility
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stats
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {posts.map((post) => (
                        <tr key={post._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="max-w-xs">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {post.title}
                              </div>
                              <div className="text-sm text-gray-500 truncate">
                                {post.excerpt}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              {post.category}
                            </span>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(post.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                post.visibility === "private"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {post.visibility === "private"
                                ? "🔒 Private"
                                : "🌐 Public"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-4">
                              <span className="flex items-center">
                                <svg
                                  className="w-4 h-4 mr-1 text-green-500"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                {post.upvotes.length}
                              </span>
                              <span className="flex items-center">
                                <svg
                                  className="w-4 h-4 mr-1 text-blue-500"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                {post.comments.length}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Link
                                to={`/post/${post._id}`}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                View
                              </Link>
                              <button
                                onClick={() => handleEditPost(post)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeletePost(post)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Edit Post Modal */}
      <EditPost
        post={editingPost}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingPost(null);
        }}
        onSave={handleSavePost}
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
