import React, { useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminTable from "../../components/admin/AdminTable";
import {
  FiAlertTriangle,
  FiSearch,
  FiFilter,
  FiMessageSquare,
} from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import { IoWarningOutline } from "react-icons/io5";
import WarningModal from "../../components/admin/WarningModal";
import { useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useMutation } from "@tanstack/react-query";

export default function ReportedCommentsPage() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);

  const { data: reportedComments = [], isLoading: reportedCommentsLoading } =
    useQuery({
      queryKey: ["reported-comments"],
      queryFn: async () => {
        const { data } = await axiosSecure.get("/admin/reported-comments");
        return data;
      },
    });

  const { mutateAsync: warnComment } = useMutation({
    mutationFn: async (commentId) => {
      const { data } = await axiosSecure.put(`/admin/warn/${commentId}`);
      return data;
    },
    onSuccess: () => {
      toast.success("Warning sent successfully");
      queryClient.invalidateQueries(["reported-comments"]);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleSendWarning = async () => {
    try {
      await warnComment(selectedComment._id);
    } finally {
      setWarningModalOpen(false);
    }
  };

  const handleWarnClick = (comment) => {
    setSelectedComment(comment);
    setWarningModalOpen(true);
  };

  const filteredComments = reportedComments.filter((comment) => {
    const matchesSearch =
      comment.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.postTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      statusFilter === "all" || comment.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (comment) => {
    if (comment.status === "resolved") {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Resolved
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        Pending Review
      </span>
    );
  };

  if (reportedCommentsLoading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Reported Comments"
        description="Review and moderate reported comments"
        icon={FiAlertTriangle}
      />

      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search reported comments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <FiFilter className="h-5 w-5 text-gray-400 mr-2" />
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending Review</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reported Comments Table */}
      <AdminTable
        headers={[
          { key: "comment", label: "Reported Comment" },
          { key: "details", label: "Details" },
          { key: "status", label: "Status" },
          { key: "actions", label: "Actions" },
        ]}
        data={filteredComments}
        keyField="id"
        showActions={false}
        emptyMessage="No reported comments found"
        renderRow={(comment) => (
          <>
            <td className="px-6 py-4">
              <div className="text-sm text-gray-900 font-medium mb-1">
                On: <span className="text-blue-600">{comment.postTitle}</span>
              </div>
              <div className="text-sm text-gray-500 line-clamp-2">
                {comment.postExcerpt}
              </div>
              <div className="mt-2 flex items-center text-xs text-gray-500">
                <FiMessageSquare className="mr-1" />
                Reported for:{" "}
                <span className="font-medium ml-1">{comment.reason}</span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">
                <span className="font-medium">Author:</span>{" "}
                {comment.author.name}
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-medium">Reported:</span>{" "}
                {new Date(comment.reportDate).toLocaleString()}
              </div>
              {comment.resolvedAt && (
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Resolved:</span>{" "}
                  {new Date(comment.resolvedAt).toLocaleString()}
                </div>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {getStatusBadge(comment)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => handleWarnClick(comment)}
                  className="text-yellow-500 hover:text-yellow-600 flex items-center gap-1 cursor-pointer"
                >
                  <IoWarningOutline className="text-lg" /> <span>Warn</span>
                </button>
              </div>
            </td>
          </>
        )}
      />

      {/* Warning Modal */}
      {warningModalOpen && selectedComment && (
        <WarningModal
          isOpen={warningModalOpen}
          onClose={() => setWarningModalOpen(false)}
          user={selectedComment.author}
          onSendWarning={handleSendWarning}
        />
      )}
    </div>
  );
}
