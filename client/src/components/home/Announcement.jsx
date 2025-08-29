import { FaBullhorn } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAxiosCommon from "../../hooks/useAxiosCommon";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import { format } from "date-fns";

export default function Announcement() {
  const axiosCommon = useAxiosCommon();

  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const { data } = await axiosCommon.get("/announcements");
      return data;
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

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
                  Announcements
                </h2>
              </div>
              {announcements.length > 0 ? (
                announcements.map((announcement) => (
                  <div
                    key={announcement._id}
                    className="mb-6 border-t border-blue-400 pt-2 mt-4"
                  >
                    <h3 className="text-lg font-semibold text-gray-900">
                      {announcement.title}
                    </h3>
                    <p className="mt-1 text-gray-600">{announcement.content}</p>
                    <div className="mt-3 flex flex-col md:flex-row md:items-center text-sm text-gray-500">
                      <span>
                        Posted on {format(announcement.createdAt, "PP")}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-center mt-4">
                  No announcements available.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
