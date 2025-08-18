import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router";
import toast from "react-hot-toast";
import VisibilitySelector from "../../components/post/VisibilitySelector";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function CreatePost() {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPremiumGate, setShowPremiumGate] = useState(false);

  const isPremium = user?.role === "Premium";

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      content: "",
      tags: "",
      visibility: "public",
      category: "General Discussion",
    },
  });

  const visibility = watch("visibility");

  const categories = [
    "General Discussion",
    "Frontend Development",
    "Backend Development",
    "Mobile Development",
    "DevOps",
    "Data Science",
    "Career Advice",
  ];

  const onSubmit = async (data) => {
    // Check if user is trying to create private post without premium
    if (data.visibility === "private" && !isPremium) {
      setShowPremiumGate(true);
      return;
    }

    setIsLoading(true);

    try {
      const newPost = {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        author: {
          id: user?.uid,
          name: user?.displayName,
          avatar:
            user?.photoURL || "https://i.ibb.co/9H2PJ7h2/d43801412989.jpg",
          badge: isPremium ? "Gold" : "Bronze",
          role: isPremium ? "Premium" : "General",
        },
        tags: data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        date: new Date().toISOString(),
        upvotes: [],
        downvotes: [],
        likes: [],
        comments: [],
        visibility: data.visibility,
        category: data.category,
      };

      await axiosSecure.post("/posts", newPost);

      toast.success("Post created successfully!");
      reset();
      navigate("/posts");
    } catch {
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVisibilityChange = (newVisibility) => {
    if (newVisibility === "private" && !isPremium) {
      setShowPremiumGate(true);
      return;
    }
    setValue("visibility", newVisibility);
  };

  if (showPremiumGate) {
    return <Navigate to={"/membership"} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-700 mb-2">
            Create New Post
          </h1>
          <p className="text-gray-600">
            Share your knowledge with the TechHive community
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg border border-blue-100 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Title *
              </label>
              <input
                type="text"
                {...register("title", {
                  required: "Title is required",
                  minLength: {
                    value: 10,
                    message: "Title must be at least 10 characters",
                  },
                  maxLength: {
                    value: 100,
                    message: "Title must be less than 100 characters",
                  },
                })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter a descriptive title for your post..."
                disabled={isLoading}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt *
              </label>
              <textarea
                {...register("excerpt", {
                  required: "Excerpt is required",
                  minLength: {
                    value: 10,
                    message: "Excerpt must be at least 10 characters",
                  },
                  maxLength: {
                    value: 100,
                    message: "Excerpt must be less than 100 characters",
                  },
                })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter a descriptive excerpt for your post..."
                disabled={isLoading}
              />
              {errors.excerpt && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.excerpt.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                {...register("content", {
                  required: "Content is required",
                  minLength: {
                    value: 50,
                    message: "Content must be at least 50 characters",
                  },
                })}
                rows={12}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write your post content here... Share your knowledge, ask questions, or start a discussion!"
                disabled={isLoading}
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.content.message}
                </p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                {...register("tags")}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="react, javascript, frontend (comma-separated)"
                disabled={isLoading}
              />
              <p className="mt-1 text-xs text-gray-500">
                Add relevant tags separated by commas to help others find your
                post
              </p>
            </div>

            {/* Visibility Selector */}
            <VisibilitySelector
              value={visibility}
              onChange={handleVisibilityChange}
              isPremium={isPremium}
              disabled={isLoading}
            />

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/posts")}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  "Create Post"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
