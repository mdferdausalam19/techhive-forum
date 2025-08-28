import React, { useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminTable from "../../components/admin/AdminTable";
import {
  FiAlertTriangle,
  FiSearch,
  FiFilter,
  FiEye,
  FiCheck,
  FiX,
  FiMessageSquare,
  FiUserX,
} from "react-icons/fi";

export default function ReportedCommentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const reportedComments = [
    {
      id: 1,
      content:
        "This is an inappropriate comment that violates our community guidelines...",
      author: "User123",
      postTitle: "Getting Started with React Hooks",
      reportReason: "Hate speech",
      reportCount: 5,
      status: "pending",
      reportedAt: "2025-08-26T14:30:00",
    },
    {
      id: 2,
      content: "Spam message with promotional content...",
      author: "SpamBot",
      postTitle: "State Management in 2025",
      reportReason: "Spam",
      reportCount: 3,
      status: "pending",
      reportedAt: "2025-08-27T09:15:00",
    },
    {
      id: 3,
      content: "This comment was already reviewed and approved...",
      author: "HelpfulUser",
      postTitle: "TypeScript Best Practices",
      reportReason: "Other",
      reportCount: 1,
      status: "resolved",
      resolvedBy: "Admin",
      resolvedAt: "2025-08-25T16:45:00",
      resolution: "approved",
    },
  ];

  const filteredComments = reportedComments.filter((comment) => {
    const matchesSearch =
      comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.postTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      statusFilter === "all" || comment.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const handleView = (comment) => {
    // Handle view comment in context
    console.log("View comment:", comment);
  };

  const handleApprove = (comment) => {
    // Handle approve comment
    if (window.confirm("Approve this comment and dismiss all reports?")) {
      console.log("Approve comment:", comment.id);
    }
  };

  const handleRemove = (comment) => {
    // Handle remove comment
    if (window.confirm("Remove this comment and notify the author?")) {
      console.log("Remove comment:", comment.id);
    }
  };

  const handleBanUser = (comment) => {
    // Handle ban user
    if (
      window.confirm(
        `Ban user ${comment.author}? This will prevent them from posting.`
      )
    ) {
      console.log("Ban user:", comment.author);
    }
  };

  const getStatusBadge = (comment) => {
    if (comment.status === "resolved") {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Resolved ({comment.resolution})
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        Pending Review
      </span>
    );
  };

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
                {comment.content}
              </div>
              <div className="mt-2 flex items-center text-xs text-gray-500">
                <FiMessageSquare className="mr-1" />
                Reported for:{" "}
                <span className="font-medium ml-1">{comment.reportReason}</span>
                <span className="mx-2">•</span>
                <span>
                  Reported {comment.reportCount}{" "}
                  {comment.reportCount === 1 ? "time" : "times"}
                </span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">
                <span className="font-medium">Author:</span> {comment.author}
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-medium">Reported:</span>{" "}
                {new Date(comment.reportedAt).toLocaleString()}
              </div>
              {comment.resolvedAt && (
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Resolved by:</span>{" "}
                  {comment.resolvedBy}
                </div>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {getStatusBadge(comment)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => handleView(comment)}
                  className="text-blue-600 hover:text-blue-900 flex items-center"
                >
                  <FiEye className="mr-1 h-4 w-4" /> View in Context
                </button>
                {comment.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleApprove(comment)}
                      className="text-green-600 hover:text-green-900 flex items-center"
                    >
                      <FiCheck className="mr-1 h-4 w-4" /> Approve
                    </button>
                    <button
                      onClick={() => handleRemove(comment)}
                      className="text-red-600 hover:text-red-900 flex items-center"
                    >
                      <FiX className="mr-1 h-4 w-4" /> Remove
                    </button>
                    <button
                      onClick={() => handleBanUser(comment)}
                      className="text-red-600 hover:text-red-900 flex items-center text-xs"
                    >
                      <FiUserX className="mr-1 h-4 w-4" /> Ban User
                    </button>
                  </>
                )}
              </div>
            </td>
          </>
        )}
      />
    </div>
  );
}
