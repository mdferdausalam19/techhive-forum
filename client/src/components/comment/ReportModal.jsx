import { useState } from "react";
import { FiX } from "react-icons/fi";
export default function ReportModal({
  commentId,
  onClose,
  onSubmitReport,
  loading,
}) {
  const [reason, setReason] = useState("Spam");
  const [details, setDetails] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitReport(commentId, reason, details);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl relative border-2 border-red-400">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          <FiX />
        </button>
        <div className="flex items-center mb-3">
          <span className="mr-2 text-red-500 text-xl">⚠️</span>
          <h3 className="text-lg font-bold text-red-600">Report Comment</h3>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border rounded px-2 py-1 focus:ring-2 focus:ring-red-200 outline-red-200 border-red-400"
            >
              <option value="Spam">Spam</option>
              <option value="Abuse">Abuse</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Details
            </label>
            <textarea
              className="w-full border rounded px-2 py-1 focus:ring-2 focus:ring-red-200 outline-red-200 border-red-400"
              rows={3}
              value={details}
              required
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 outline-red-200 border-red-400"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 shadow outline-red-200 border-red-400"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
