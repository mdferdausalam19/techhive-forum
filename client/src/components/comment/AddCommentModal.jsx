export default function AddCommentModal({
  setShowAddModal,
  adding,
  newComment,
  setNewComment,
  onSubmitComment,
}) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
          onClick={() => setShowAddModal(false)}
          disabled={adding}
          aria-label="Close"
        >
          &times;
        </button>
        <h3 className="text-lg font-bold mb-4 text-blue-700">Add a Comment</h3>
        <textarea
          className="w-full border border-blue-200 rounded p-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-200"
          rows={4}
          placeholder="Write your comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={adding}
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
            onClick={() => setShowAddModal(false)}
            disabled={adding}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            onClick={onSubmitComment}
            disabled={adding || !newComment.trim()}
          >
            {adding ? "Adding..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
