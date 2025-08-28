import React, { useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminTable from "../../components/admin/AdminTable";
import { FiBell, FiSearch } from "react-icons/fi";
import AnnouncementsModal from "../../components/admin/AnnouncementsModal";

export default function AnnouncementsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
  });

  const announcements = [
    {
      id: 1,
      title: "Scheduled Maintenance",
      content:
        "We will be performing scheduled maintenance on August 30th from 2:00 AM to 4:00 AM UTC.",
      author: "Admin",
      createdAt: "2025-08-25T10:30:00",
      publishedAt: "2025-08-25T10:35:00",
      views: 1245,
    },
    {
      id: 2,
      title: "New Feature: Dark Mode",
      content:
        "We've added a dark mode feature! You can now switch between light and dark themes in your account settings.",
      author: "Admin",
      createdAt: "2025-08-20T14:15:00",
      publishedAt: "2025-08-20T14:20:00",
      views: 2456,
    },
    {
      id: 3,
      title: "Community Guidelines Update",
      content:
        "We've updated our community guidelines. Please review the changes at...",
      author: "Moderator",
      createdAt: "2025-08-27T09:45:00",
      views: 0,
    },
  ];

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleCreateAnnouncement = () => {
    // Handle create announcement
    console.log("Create announcement:", newAnnouncement);
    setIsCreateModalOpen(false);
    setNewAnnouncement({
      title: "",
      content: "",
    });
  };

  const handleEdit = (announcement) => {
    // Handle edit announcement
    console.log("Edit announcement:", announcement.id);
  };

  const handleDelete = (announcement) => {
    // Handle delete announcement
    if (
      window.confirm(`Are you sure you want to delete "${announcement.title}"?`)
    ) {
      console.log("Delete announcement:", announcement.id);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Announcements"
        description="Create and manage announcements for your community"
        buttonText="New Announcement"
        onButtonClick={() => setIsCreateModalOpen(true)}
        icon={FiBell}
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
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Announcements Table */}
      <AdminTable
        headers={[
          { key: "title", label: "Announcement" },
          { key: "date", label: "Date" },
        ]}
        data={filteredAnnouncements}
        keyField="id"
        emptyMessage="No announcements found"
        onEdit={handleEdit}
        onDelete={handleDelete}
        renderRow={(announcement) => (
          <>
            <td className="px-6 py-4">
              <div className="text-sm font-medium text-gray-900">
                {announcement.title}
              </div>
              <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                {announcement.content}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">
                {announcement.views.toLocaleString()} views
              </div>
              <div className="text-xs text-gray-500">
                By {announcement.author}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <div>
                Created: {new Date(announcement.createdAt).toLocaleDateString()}
              </div>
              {announcement.publishedAt && (
                <div>
                  Published:{" "}
                  {new Date(announcement.publishedAt).toLocaleDateString()}
                </div>
              )}
            </td>
          </>
        )}
      />

      {/* Create Announcement Modal */}
      {isCreateModalOpen && (
        <AnnouncementsModal
          setIsCreateModalOpen={setIsCreateModalOpen}
          newAnnouncement={newAnnouncement}
          setNewAnnouncement={setNewAnnouncement}
          onCreateAnnouncement={handleCreateAnnouncement}
        />
      )}
    </div>
  );
}
