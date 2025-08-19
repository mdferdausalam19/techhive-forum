import { useState } from "react";
import PostList from "../../components/forum/PostList";
import useAxiosCommon from "../../hooks/useAxiosCommon";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

export default function AllPosts() {
  const axiosCommon = useAxiosCommon();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");

  const categories = [
    "All Categories",
    "General Discussion",
    "Frontend Development",
    "Backend Development",
    "Mobile Development",
    "DevOps",
    "Data Science",
    "Career Advice",
  ];

  const {
    data: posts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts", searchQuery, category],
    queryFn: async () => {
      const { data } = await axiosCommon.get(
        `/posts?search=${searchQuery}&category=${category}`
      );
      return data;
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.searchQuery.value);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">All Posts</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive collection of technical discussions,
            tutorials, and insights from developers around the world.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8 bg-white p-4 rounded-lg px-6 py-5 border border-gray-200 shadow-sm">
          <form
            onSubmit={handleSearch}
            className="flex-1 flex items-center gap-2 relative"
          >
            <input
              name="searchQuery"
              className="w-full border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 p-3"
              type="text"
              placeholder="Search posts by title..."
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Search
            </button>
          </form>
          <div>
            <select
              className="w-full border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 p-3"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option
                  key={category}
                  value={category === "All Categories" ? "" : category}
                >
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <PostList posts={posts} />
          </div>
        )}
      </div>
    </div>
  );
}
