export default function ReplyModal({ show, onClose, replyingTo, replyText, setReplyText, onSubmit, loading }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
          onClick={onClose}
          disabled={loading}
          aria-label="Close"
        >
          &times;
        </button>
        <h3 className="text-lg font-bold mb-4 text-blue-700">
          Reply to {replyingTo ? <span className="text-blue-500">{replyingTo}</span> : "Comment"}
        </h3>
        <textarea
          className="w-full border border-blue-200 rounded p-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-200"
          rows={4}
          placeholder="Write your reply..."
          value={replyText}
          onChange={e => setReplyText(e.target.value)}
          disabled={loading}
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            onClick={onSubmit}
            disabled={loading || !replyText.trim()}
          >
            {loading ? "Replying..." : "Reply"}
          </button>
        </div>
      </div>
    </div>
  );
}
