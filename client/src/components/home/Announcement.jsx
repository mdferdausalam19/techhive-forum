import { FaBullhorn } from "react-icons/fa";

export default function Announcement() {
  const latestAnnouncement = {
    title: "Welcome to TechHive Forum!",
    content:
      "We're excited to announce our new community features and improvements. Stay tuned for more updates!",
    date: "August 19, 2025",
    author: "Admin Team",
  };

  if (!latestAnnouncement) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 overflow-hidden">
        <div className="p-8">
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg">
              <FaBullhorn
                className="h-6 w-6 text-blue-600"
                aria-hidden="true"
              />
            </div>
            <div className="ml-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Announcement
                </h2>
              </div>
              <div className="mt-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {latestAnnouncement.title}
                </h3>
                <p className="mt-1 text-gray-600">
                  {latestAnnouncement.content}
                </p>
                <div className="mt-3 flex flex-col md:flex-row md:items-center text-sm text-gray-500">
                  <span>Posted on {latestAnnouncement.date}</span>
                  <span className="mx-2 hidden md:inline">•</span>
                  <span>By {latestAnnouncement.author}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
