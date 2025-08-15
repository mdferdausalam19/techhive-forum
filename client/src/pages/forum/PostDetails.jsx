import { useParams } from "react-router";
import CommentSection from "../../components/comment/CommentSection";
import useAxiosCommon from "../../hooks/useAxiosCommon";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import { useState } from "react";
import { FaHeart } from "react-icons/fa";
import ShareModal from "../../components/forum/ShareModal";

export default function PostDetails() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const axiosCommon = useAxiosCommon();
  const { id } = useParams();
  const [voteStatus, setVoteStatus] = useState({
    upvoted: false,
    downvoted: false,
  });
  const [likeStatus, setLikeStatus] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const {
    data: post = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const { data } = await axiosCommon.get(`/posts/${id}`);
      setVoteStatus({
        upvoted: data.upvotes.includes(user?.uid),
        downvoted: data.downvotes.includes(user?.uid),
      });
      setLikeStatus(data.likes.includes(user?.uid));
      return data;
    },
  });

  const { mutateAsync: voteMutateAsync, isLoading: voteLoading } = useMutation({
    mutationFn: async (voteInfo) =>
      await axiosCommon.patch(`/posts/${post._id}/vote`, voteInfo),
    onSuccess: ({ data }) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["post", id] });
    },
    onError: () => {
      toast.error("Failed to vote post. Please try again.");
    },
  });

  const { mutateAsync: likeMutateAsync, isLoading: likeLoading } = useMutation({
    mutationFn: async (likeInfo) =>
      await axiosCommon.patch(`/posts/${post._id}/like`, likeInfo),
    onSuccess: ({ data }) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["post", id] });
    },
    onError: () => {
      toast.error("Failed to like post. Please try again.");
    },
  });

  const handleVote = async (type) => {
    const voteInfo = {
      user_id: user?.uid,
      type,
    };
    try {
      await voteMutateAsync(voteInfo);
    } catch (err) {
      console.error("Error voting post: ", err.message);
      toast.error("Failed to vote post. Please try again.");
    }
  };

  const handleLike = async () => {
    const likeInfo = {
      user_id: user?.uid,
    };
    try {
      await likeMutateAsync(likeInfo);
    } catch (err) {
      console.error("Error liking post: ", err.message);
      toast.error("Failed to like post. Please try again.");
    }
  };

  const getPostUrl = () => {
    return `${window.location.origin}/posts/${id}`;
  };

  if (isLoading || voteLoading || likeLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
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

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">Post not found</p>
          </div>
        </div>
      </div>
    );
  }

  const getBadgeColor = (badge) => {
    switch (badge) {
      case "Gold":
        return "bg-yellow-300 text-yellow-800 border border-yellow-400";
      case "Bronze":
        return "bg-amber-600 text-white border border-amber-700";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
            <div className="flex flex-col md:flex-row items-center justify-between mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm mb-2 md:mb-0">
                {post.category}
              </span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
                    />
                  </svg>
                  <span>{post.likes.length} Likes</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span>{post.comments.length} comments</span>
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-4 leading-tight">
              {post.title}
            </h1>
            <p className="text-blue-100 text-lg">{post.excerpt}</p>
          </div>

          {/* Author Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-12 h-12 rounded-full border-2 border-white shadow-lg"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg font-semibold text-gray-900">
                    {post.author.name}
                  </span>
                  {post.author.badge && (
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(
                        post.author.badge
                      )}`}
                    >
                      {post.author.badge}
                    </span>
                  )}
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {post.author.role}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>
                    Published on{" "}
                    {new Date(post.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={voteStatus.upvoted}
                  onClick={() => handleVote("upvote")}
                  className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 11l5-5m0 0l5 5m-5-5v12"
                    />
                  </svg>
                  <span className="font-medium">{post.upvotes.length}</span>
                </button>
                <button
                  disabled={voteStatus.downvoted}
                  onClick={() => handleVote("downvote")}
                  className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 13l-5 5m0 0l-5-5m5 5V6"
                    />
                  </svg>
                  <span className="font-medium">{post.downvotes.length}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
                >
                  {likeStatus ? (
                    <FaHeart className="w-4 h-4 text-red-500" />
                  ) : (
                    <FaHeart className="w-4 h-4" />
                  )}
                  <span>{likeStatus ? "Liked" : "Like"}</span>
                </button>
              </div>
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                  />
                </svg>
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
        {/* Comments Section */}
        <div className="mt-12">
          <CommentSection post={post} />
        </div>
      </div>
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        postUrl={getPostUrl()}
      />
    </div>
  );
}
