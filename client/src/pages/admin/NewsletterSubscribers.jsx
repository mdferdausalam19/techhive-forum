// client/src/pages/admin/NewsletterSubscribers.jsx
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { format } from "date-fns";
import { FaEnvelope } from "react-icons/fa";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import AdminTable from "../../components/admin/AdminTable";
import { useState } from "react";

export default function NewsletterSubscribers() {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: subscribers = [], isLoading } = useQuery({
    queryKey: ["newsletterSubscribers"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/admin/newsletter");
      return data;
    },
  });

  const filteredSubscribers = subscribers.filter((subscriber) =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tableHeaders = [
    { key: "email", label: "Email" },
    { key: "date", label: "Subscribed On" },
  ];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Newsletter Subscribers
          </h1>
          <p className="text-gray-600 mt-1">
            {filteredSubscribers.length}{" "}
            {filteredSubscribers.length === 1 ? "subscriber" : "subscribers"}{" "}
            found
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full focus:outline-none"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <AdminTable
          headers={tableHeaders}
          data={filteredSubscribers}
          keyField="_id"
          emptyMessage="No subscribers found"
          showActions={false}
          renderRow={(subscriber) => (
            <>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="text-sm font-medium text-gray-900">
                    {subscriber.email}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {format(
                    new Date(subscriber.subscribedAt),
                    "MMM d, yyyy h:mm a"
                  )}
                </div>
              </td>
            </>
          )}
        />
      </div>
    </div>
  );
}
