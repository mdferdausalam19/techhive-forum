import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import VisibilitySelector from "../../components/post/VisibilitySelector";
import useAuth from "../../hooks/useAuth";
import { samplePosts } from "../../data/samplePosts";

export default function EditPostPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

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

  // Load post data
  useEffect(() => {
    const loadPost = async () => {
      setPageLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Find post by ID (in real app, this would be an API call)
        let foundPost = samplePosts.find((p) => p.id === id);

        // If not found in sample posts, create a dummy post for demo
        if (!foundPost) {
          foundPost = {
            id: id,
            title: "Sample Post for Editing",
            excerpt:
              "This is a sample post created for demonstration purposes...",
            content:
              "This is a sample post content that you can edit. In a real application, this would be loaded from your database based on the post ID. You can modify the title, content, tags, category, and visibility settings.",
            author: {
              id: user?.uid || "current-user",
              name: user?.displayName || "You",
              avatar: user?.photoURL || "https://i.pravatar.cc/100?img=1",
              badge: "Bronze",
              role: "General",
            },
            tags: ["sample", "demo", "editing"],
            date: new Date().toISOString(),
            upvotes: 5,
            downvotes: 0,
            likes: 5,
            comments: 2,
            visibility: "public",
            category: "General Discussion",
          };
        }

        // Check if user owns this post (in real app, this would be validated on backend)
        if (
          foundPost.author.id !== user?.uid &&
          foundPost.author.name !== user?.displayName
        ) {
          toast.error("You can only edit your own posts!");
          navigate("/my-posts");
          return;
        }

        setPost(foundPost);

        // Pre-fill form
        reset({
          title: foundPost.title,
          content: foundPost.content,
          tags: foundPost.tags.join(", "),
          visibility: foundPost.visibility,
          category: foundPost.category,
        });
      } catch {
        toast.error("Failed to load post");
        navigate("/my-posts");
      } finally {
        setPageLoading(false);
      }
    };

    if (id) {
      loadPost();
    }
  }, [id, user, navigate, reset]);

  const onSubmit = async (data) => {
    // Check if user is trying to set private visibility without premium
    if (data.visibility === "private" && !isPremium) {
      toast.error("Private posts are only available to Premium members!");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Create updated post object
      const updatedPost = {
        ...post,
        title: data.title,
        excerpt:
          data.content.substring(0, 150) +
          (data.content.length > 150 ? "..." : ""),
        content: data.content,
        tags: data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        visibility: data.visibility,
        category: data.category,
      };

      // In a real app, this would be an API call to update the post
      console.log("Updated post:", updatedPost);

      toast.success("Post updated successfully!");
      navigate("/my-posts");
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

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            Post not found
          </h2>
          <p className="text-gray-500 mb-6">
            The post you're looking for doesn't exist or you don't have
            permission to edit it.
          </p>
          <button
            onClick={() => navigate("/my-posts")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
          >
            Back to My Posts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-700 mb-2">Edit Post</h1>
          <p className="text-gray-600">Update your post content and settings</p>
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
                onClick={() => navigate("/my-posts")}
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
                    Updating...
                  </>
                ) : (
                  "Update Post"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
