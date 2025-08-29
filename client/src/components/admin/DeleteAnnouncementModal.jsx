import React from 'react';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

export default function DeleteAnnouncementModal({ isOpen, onClose, announcement, onDelete }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <FiAlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="ml-3 text-xl font-medium text-gray-900">
                Delete Announcement
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
          
          <div className="mt-4">
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the announcement "{announcement?.title}"? This action cannot be undone.
            </p>
            
            <div className="bg-gray-50 px-4 py-3 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700">Announcement Preview</h4>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {announcement?.content}
              </p>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => onDelete(announcement)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete Announcement
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
