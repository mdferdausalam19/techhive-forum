import { useState } from "react";
import toast from "react-hot-toast";

export default function PostGenerator({ post, onClose }) {
  const [editablePost, setEditablePost] = useState(post);
  const [isEditing, setIsEditing] = useState(false);

  const handleTitleChange = (e) => {
    setEditablePost(prev => ({ ...prev, title: e.target.value }));
  };

  const handleContentChange = (e) => {
    setEditablePost(prev => ({ ...prev, content: e.target.value }));
  };

  const handleTagsChange = (e) => {
    const tagsArray = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setEditablePost(prev => ({ ...prev, tags: tagsArray }));
  };

  const handleUsePost = () => {
    // In a real app, this would save the post or navigate to create post page
    toast.success("Post saved to drafts! You can publish it from your dashboard.");
    onClose();
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      toast.success("Changes saved!");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-blue-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-blue-700">Generated Post</h3>
        <div className="flex space-x-2">
          <button
            onClick={toggleEdit}
            className="p-2 text-gray-500 hover:text-blue-600 transition"
            title={isEditing ? "Save changes" : "Edit post"}
          >
            {isEditing ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            )}
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-red-600 transition"
            title="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Post Preview */}
      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          {isEditing ? (
            <input
              type="text"
              value={editablePost.title}
              onChange={handleTitleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <h4 className="text-lg font-semibold text-gray-800">{editablePost.title}</h4>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          {isEditing ? (
            <textarea
              value={editablePost.content}
              onChange={handleContentChange}
              rows={8}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 whitespace-pre-wrap">
              {editablePost.content}
            </div>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          {isEditing ? (
            <input
              type="text"
              value={editablePost.tags.join(', ')}
              onChange={handleTagsChange}
              placeholder="Enter tags separated by commas"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {editablePost.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex space-x-3">
          <button
            onClick={handleUsePost}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            Use This Post
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(`${editablePost.title}\n\n${editablePost.content}\n\nTags: ${editablePost.tags.join(', ')}`);
              toast.success("Post copied to clipboard!");
            }}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}
