import { SlBadge } from "react-icons/sl";
import { Link } from "react-router";

export default function PostCard({
  _id,
  title,
  excerpt,
  author,
  date,
  likes = 0,
  upvotes = 0,
  downvotes = 0,
  comments = 0,
  tags = [],
  category = "General",
}) {
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
    <Link to={`/post/${_id}`}>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden group">
        <div className="p-6">
          {/* Category Badge */}
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {category}
            </span>
          </div>

          {/* Title */}
          <h2 className="block text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200 mb-2 group-hover:text-blue-600">
            {title}
          </h2>

          {/* Excerpt */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{excerpt}</p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex items-center flex-wrap gap-1 mb-4">
              {tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
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
                    d="M7 11l5-5m0 0l5 5m-5-5v12"
                  />
                </svg>
                <span>{upvotes}</span>
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
                    d="M17 13l-5 5m0 0l-5-5m5 5V6"
                  />
                </svg>

                <span>{downvotes}</span>
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
                    d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
                  />
                </svg>
                <span>{likes}</span>
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
                <span>{comments}</span>
              </div>
            </div>
          </div>

          {/* Author Info */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <img
              src={author.avatar}
              alt={author.name}
              className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">
                  {author.name}
                </span>
                {author.badge && (
                  <span
                    title={
                      author.badge === "Gold"
                        ? "Premium Member"
                        : "General Member"
                    }
                    className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(
                      author.badge
                    )}`}
                  >
                    <SlBadge className="w-3 h-3 mr-1" />
                    {author.badge}
                  </span>
                )}
              </div>
            </div>
            <span className="text-xs text-gray-500">
              {new Date(date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
