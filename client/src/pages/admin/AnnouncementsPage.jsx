import React, { useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminTable from "../../components/admin/AdminTable";
import { FiBell, FiSearch } from "react-icons/fi";
import AnnouncementsModal from "../../components/admin/AnnouncementsModal";
import useAuth from "../../hooks/useAuth";
import useAxiosCommon from "../../hooks/useAxiosCommon";
import { toast } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import { format } from "date-fns";

export default function AnnouncementsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { user } = useAuth();
  const axiosCommon = useAxiosCommon();
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    author: {
      id: user?.uid,
      name: user?.displayName,
      avatar: user?.photoURL,
      email: user?.email,
    },
    createdAt: "",
    role: "Admin",
    visibility: "private",
  });

  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const { data } = await axiosCommon.get("/announcements");
      return data;
    },
  });

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleCreateAnnouncement = () => {
    try {
      const announcement = {
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        author: {
          id: user?.uid,
          name: user?.displayName,
          avatar: user?.photoURL,
          email: user?.email,
        },
        createdAt: new Date().toISOString(),
        role: "Admin",
        visibility: "private",
      };
      axiosCommon.post("/admin/announcements", announcement);
      toast.success("Announcement created successfully!");
      setNewAnnouncement({
        title: "",
        content: "",
        role: "Admin",
        author: {
          id: user?.uid,
          name: user?.displayName,
          avatar: user?.photoURL,
          email: user?.email,
        },
        createdAt: "",
        visibility: "private",
      });
    } catch (err) {
      console.error("Error creating announcement: ", err.message);
      toast.error("Failed to create announcement. Please try again.");
    } finally {
      setIsCreateModalOpen(false);
    }
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

  if (isLoading) {
    return <LoadingSpinner />;
  }

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
          { key: "author", label: "Author" },
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
              <div className="text-xs text-gray-500">
                By {announcement.author.name}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <div>Created: {format(announcement.createdAt, "PP")}</div>
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
