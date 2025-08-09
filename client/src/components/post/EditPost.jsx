import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import VisibilitySelector from "./VisibilitySelector";
import useAuth from "../../hooks/useAuth";

export default function EditPost({ post, isOpen, onClose, onSave }) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

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

  // Pre-fill form when post changes
  useEffect(() => {
    if (post) {
      reset({
        title: post.title || "",
        excerpt: post.excerpt || "",
        content: post.content || "",
        tags: post.tags ? post.tags.join(", ") : "",
        visibility: post.visibility || "public",
        category: post.category || "General Discussion",
      });
    }
  }, [post, reset]);

  const onSubmit = (data) => {
    if (data.visibility === "private" && !isPremium) {
      toast.error("Private posts are only available to Premium members!");
      return;
    }

    setIsLoading(true);

    try {
      const updatedPost = {
        ...post,
        title: data.title,
        excerpt:
          data.excerpt.substring(0, 150) +
          (data.excerpt.length > 150 ? "..." : ""),
        content: data.content,
        tags: data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        visibility: data.visibility,
        category: data.category,
      };

      console.log(updatedPost);

      if (onSave) {
        onSave(updatedPost);
      }

      toast.success("Post updated successfully!");
      onClose();
    } catch {
      toast.error("Failed to update post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVisibilityChange = (newVisibility) => {
    if (newVisibility === "private" && !isPremium) {
      toast.error("Private posts are only available to Premium members!");
      return;
    }
    setValue("visibility", newVisibility);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-blue-700">Edit Post</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            disabled={isLoading}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
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
              rows={10}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your post content here..."
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
              Add relevant tags separated by commas
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
              onClick={onClose}
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
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
